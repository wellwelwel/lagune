import type { Node } from '@ruby/prism/src/nodes.js';
import type { RubyCode } from '../../../types/hooks/dependency.js';
import type { PrismParseResult } from '../../../types/prism.js';
import { randomFillSync } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  CallNode,
  InterpolatedStringNode,
  InterpolatedSymbolNode,
  ProgramNode,
  StringNode,
  SymbolNode,
} from '@ruby/prism/src/nodes.js';
import { parsePrism } from '#prism/parse';
import { errorMessage } from '../../../core/errors.js';
import { cannotJudge, rubyParserFault } from '../text.js';

/** Prism, Ruby's own parser compiled to WebAssembly, which the package's imports map to the copy the build ships beside the engine */
const PARSER = '#prism.wasm';

/** The WASI error for a file descriptor that does not exist */
const BAD_DESCRIPTOR = 8;

const SUCCESS = 0;

const ENCODER = new TextEncoder();

let compiled: WebAssembly.Module | undefined;

const parserModule = (): WebAssembly.Module => {
  compiled ??= new WebAssembly.Module(
    readFileSync(fileURLToPath(import.meta.resolve(PARSER)))
  );

  return compiled;
};

const memoryOf = ({ exports }: WebAssembly.Instance): WebAssembly.Memory => {
  if (exports.memory instanceof WebAssembly.Memory) return exports.memory;

  throw new Error('it exports no memory');
};

const refuse = (): number => BAD_DESCRIPTOR;

/** The only system the parser reaches: no file, stream, or folder, randomness from Node.js, and an exit that ends the parse */
const isolatedSystem = (
  memory: () => WebAssembly.Memory
): WebAssembly.Imports => ({
  wasi_snapshot_preview1: {
    fd_close: refuse,
    fd_prestat_get: refuse,
    fd_prestat_dir_name: refuse,
    fd_seek: refuse,
    fd_write: refuse,
    proc_exit: (code: number) => {
      throw new Error(`the parser exits with code ${code}`);
    },
    random_get: (pointer: number, length: number) => {
      randomFillSync(new Uint8Array(memory().buffer, pointer, length));

      return SUCCESS;
    },
  },
});

/** A parser of its own for each file, out of reach of whatever an earlier file left in the parser's memory */
const startedParser = (): WebAssembly.Instance => {
  const instance = new WebAssembly.Instance(
    parserModule(),
    isolatedSystem(() => memoryOf(instance))
  );
  const initialize = instance.exports._initialize;

  if (typeof initialize !== 'function')
    throw new Error('it exports no _initialize');

  initialize();

  return instance;
};

const parserFor = (file: string): WebAssembly.Instance => {
  try {
    return startedParser();
  } catch (error) {
    throw rubyParserFault(file, errorMessage(error));
  }
};

const parsedBy = (
  file: string,
  parser: WebAssembly.Instance,
  content: string
): PrismParseResult => {
  try {
    return parsePrism(parser.exports, ENCODER.encode(content));
  } catch (error) {
    throw cannotJudge(file, `stops the Ruby parser (${errorMessage(error)})`);
  }
};

const programOf = (file: string, content: string): ProgramNode => {
  const parsed = parsedBy(file, parserFor(file), content);
  const [error] = parsed.errors;

  if (error !== undefined)
    throw cannotJudge(
      file,
      `is not valid Ruby at line ${error.location.startLine()} (${error.message})`
    );

  if (!(parsed.value instanceof ProgramNode))
    throw cannotJudge(
      file,
      'stops the Ruby parser before it returns a program'
    );

  return parsed.value;
};

const pushReversed = (pending: Node[], nodes: readonly Node[]): void => {
  for (let index = nodes.length - 1; index >= 0; index -= 1)
    pending.push(nodes[index]);
};

/** The text an interpolated literal spells, each literal part decoded and each interpolation as written, handing the interpolations on to be read as code */
const spelledText = (
  parts: readonly Node[],
  interpolations: Node[]
): string => {
  const pieces: string[] = [];
  const pending: Node[] = [];

  pushReversed(pending, parts);

  for (let part = pending.pop(); part !== undefined; part = pending.pop()) {
    if (part instanceof StringNode) {
      pieces.push(part.unescaped.value);
      continue;
    }

    if (part instanceof InterpolatedStringNode) {
      pushReversed(pending, part.parts);
      continue;
    }

    pieces.push(part.location.slice());
    interpolations.push(part);
  }

  return pieces.join('');
};

/** Ruby code as Prism parses it up to its __END__ line: the text of every string and symbol it writes, at any depth, and every call it makes, refusing code Ruby would not run */
export const rubyCodeOf = (file: string, content: string): RubyCode => {
  const code: RubyCode = { texts: [], calls: [] };
  const pending: Node[] = [programOf(file, content)];

  for (let node = pending.pop(); node !== undefined; node = pending.pop()) {
    if (node instanceof StringNode || node instanceof SymbolNode) {
      code.texts.push(node.unescaped.value);
      continue;
    }

    if ('parts' in node) {
      const interpolations: Node[] = [];
      const text = spelledText(node.parts, interpolations);

      if (
        node instanceof InterpolatedStringNode ||
        node instanceof InterpolatedSymbolNode
      )
        code.texts.push(text);

      pushReversed(pending, interpolations);
      continue;
    }

    if (node instanceof CallNode) code.calls.push(node);

    pushReversed(pending, node.compactChildNodes());
  }

  return code;
};
