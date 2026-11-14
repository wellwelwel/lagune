import type {
  GradleBlock,
  GradleDialect,
  GradleOpenInterpolation,
  GradleOpenString,
  GradleScan,
  GradleScanState,
} from '../../../types/hooks/dependency.js';
import { cannotJudge } from '../text.js';

/** One token of Groovy code: a line comment, the opening of a block comment, an opening quote, a brace, a name, a run of whitespace, a run of anything else, or a single character */
const GROOVY_CODE =
  /(?<comment>\/\/[^\n]*)|(?<blockComment>\/\*)|(?<quote>'''|"""|'|")|(?<open>\{)|(?<close>\})|(?<name>[A-Za-z_$][\w$]*|`[^`\n]*`)|(?<space>\s+)|[^\s/'"`{}A-Za-z_$]+|[\s\S]/y;

/** One token of Kotlin code, which has no triple single quote */
const KOTLIN_CODE =
  /(?<comment>\/\/[^\n]*)|(?<blockComment>\/\*)|(?<quote>"""|'|")|(?<open>\{)|(?<close>\})|(?<name>[A-Za-z_$][\w$]*|`[^`\n]*`)|(?<space>\s+)|[^\s/'"`{}A-Za-z_$]+|[\s\S]/y;

/** A single-quoted string, or a Kotlin character, which ends with its line */
const SINGLE_QUOTED = /(?<close>')|\\[\s\S]|(?<newline>\n)|[^\\'\n]+|[\s\S]/y;

const DOUBLE_QUOTED =
  /(?<interpolation>\$\{)|(?<close>")|\\[\s\S]|(?<newline>\n)|[^\\$"\n]+|[\s\S]/y;

const GROOVY_TRIPLE_SINGLE = /(?<close>''')|\\[\s\S]|[^\\']+|[\s\S]/y;

const GROOVY_TRIPLE_DOUBLE =
  /(?<interpolation>\$\{)|(?<close>""")|\\[\s\S]|[^\\$"]+|[\s\S]/y;

/** A Kotlin raw string, where a backslash escapes nothing */
const KOTLIN_RAW = /(?<interpolation>\$\{)|(?<close>""")|[^$"]+|[\s\S]/y;

/** The marks that open and close a block comment, read up to its end */
const COMMENT_TOKEN = /(?<open>\/\*)|(?<close>\*\/)|[^/*]+|[\s\S]/y;

const GROOVY: GradleDialect = {
  language: 'Groovy',
  code: GROOVY_CODE,
  strings: new Map([
    ["'''", GROOVY_TRIPLE_SINGLE],
    ['"""', GROOVY_TRIPLE_DOUBLE],
    ["'", SINGLE_QUOTED],
    ['"', DOUBLE_QUOTED],
  ]),
  nestedComments: false,
};

const KOTLIN: GradleDialect = {
  language: 'Kotlin',
  code: KOTLIN_CODE,
  strings: new Map([
    ['"""', KOTLIN_RAW],
    ["'", SINGLE_QUOTED],
    ['"', DOUBLE_QUOTED],
  ]),
  nestedComments: true,
};

const KOTLIN_SCRIPT = '.gradle.kts';

/** The blocks whose strings name where dependencies come from */
const SOURCE_BLOCKS: ReadonlySet<string> = new Set([
  'repositories',
  'maven',
  'ivy',
  'sourceControl',
]);

/** The blocks that publish the project's own artifacts, whose repositories receive them instead of serving dependencies, uploadArchives being the one Gradle 6 and earlier deploy through */
const PUBLISHING_BLOCKS: ReadonlySet<string> = new Set([
  'publishing',
  'uploadArchives',
]);

/** The blocks that configure something other than the project itself: the script's own classpath and the subprojects */
const ELSEWHERE_BLOCKS: ReadonlySet<string> = new Set([
  'buildscript',
  'subprojects',
]);

const DEPENDENCIES = 'dependencies';

const TOP_LEVEL: GradleBlock = {
  namesSources: false,
  publishes: false,
  configuresElsewhere: false,
  listsDependencies: false,
};

const LINE_BREAK = '\n';

const lineAt = (content: string, index: number): number =>
  content.slice(0, index).split(LINE_BREAK).length;

/** The token a sticky pattern reads at an offset of a file's code, as its length and its named groups */
const tokenAt = (
  file: string,
  language: string,
  tokens: RegExp,
  content: string,
  index: number
): [length: number, groups: Record<string, string | undefined>] => {
  tokens.lastIndex = index;

  const token = tokens.exec(content);

  if (token === null)
    throw cannotJudge(
      file,
      `holds text at offset ${index} that the checker cannot read as ${language}`
    );

  const groups: Record<string, string | undefined> =
    token.groups ?? Object.create(null);

  return [token[0].length, groups];
};

const blockOf = (parent: GradleBlock, name: string | null): GradleBlock => {
  const publishes =
    parent.publishes || (name !== null && PUBLISHING_BLOCKS.has(name));
  const configuresElsewhere =
    parent.configuresElsewhere || (name !== null && ELSEWHERE_BLOCKS.has(name));

  return {
    namesSources:
      !publishes &&
      (parent.namesSources || (name !== null && SOURCE_BLOCKS.has(name))),
    publishes,
    configuresElsewhere,
    listsDependencies: !configuresElsewhere && name === DEPENDENCIES,
  };
};

/** Where a block comment ends, counting the comments nested in it where the language nests them */
const blockCommentEnd = (
  file: string,
  { language, nestedComments }: GradleDialect,
  content: string,
  start: number
): number => {
  let depth = 1;
  let index = start;

  while (depth > 0) {
    if (index >= content.length)
      throw cannotJudge(
        file,
        `never closes the block comment it opens on line ${lineAt(content, start)}`
      );

    const [length, groups] = tokenAt(
      file,
      language,
      COMMENT_TOKEN,
      content,
      index
    );

    index += length;

    if (groups.close !== undefined) depth -= 1;
    if (groups.open !== undefined && nestedComments) depth += 1;
  }

  return index;
};

const blockStep = (
  file: string,
  content: string,
  index: number,
  state: GradleScanState,
  { open, close, name }: Record<string, string | undefined>
): void => {
  if (open !== undefined) {
    state.blocks.push(blockOf(state.blocks.at(-1) ?? TOP_LEVEL, state.name));
    state.name = null;
    return;
  }

  if (close !== undefined) {
    if (state.blocks.length === 0)
      throw cannotJudge(
        file,
        `closes a block on line ${lineAt(content, index)} that it never opens`
      );

    state.blocks.pop();
  }

  state.name = name ?? null;
};

/** Counts the braces a token opens or closes inside an interpolation, and leaves the interpolation at the brace that ends it */
const interpolationStep = (
  frame: GradleOpenInterpolation,
  state: GradleScanState,
  { open, close }: Record<string, string | undefined>
): void => {
  if (open !== undefined) frame.braces += 1;
  if (close === undefined) return;
  if (frame.braces > 0) {
    frame.braces -= 1;
    return;
  }

  state.frames.pop();
};

const codeStep = (
  file: string,
  dialect: GradleDialect,
  content: string,
  index: number,
  frame: GradleOpenInterpolation | undefined,
  state: GradleScanState
): number => {
  const [length, groups] = tokenAt(
    file,
    dialect.language,
    dialect.code,
    content,
    index
  );
  const next = index + length;

  if (groups.space !== undefined || groups.comment !== undefined) return next;
  if (groups.blockComment !== undefined)
    return blockCommentEnd(file, dialect, content, next);

  const block = state.blocks.at(-1) ?? TOP_LEVEL;

  if (block.listsDependencies && groups.close === undefined)
    state.declaresDependencies = true;

  const tokens =
    groups.quote === undefined ? undefined : dialect.strings.get(groups.quote);

  if (tokens !== undefined) {
    state.name = null;
    state.frames.push({
      kind: 'string',
      tokens,
      start: next,
      namesSources: block.namesSources,
    });

    return next;
  }

  if (frame === undefined) blockStep(file, content, index, state, groups);
  else interpolationStep(frame, state, groups);

  return next;
};

const stringStep = (
  file: string,
  { language }: GradleDialect,
  content: string,
  index: number,
  frame: GradleOpenString,
  state: GradleScanState
): number => {
  const [length, groups] = tokenAt(
    file,
    language,
    frame.tokens,
    content,
    index
  );
  const next = index + length;

  if (groups.newline !== undefined)
    throw cannotJudge(
      file,
      `holds a string on line ${lineAt(content, frame.start)} that runs past the end of its line`
    );

  if (groups.interpolation !== undefined) {
    state.frames.push({ kind: 'interpolation', braces: 0 });

    return next;
  }

  if (groups.close === undefined) return next;

  state.frames.pop();

  if (frame.namesSources)
    state.sources.push(content.slice(frame.start, index).trim());

  return next;
};

/** The strings a Gradle script writes in the blocks that name sources, and whether a dependencies block of its own holds anything, reading Groovy or Kotlin by the script's name and refusing one that leaves a string, a comment, or a block open */
export const gradleScanOf = (file: string, content: string): GradleScan => {
  const dialect = file.endsWith(KOTLIN_SCRIPT) ? KOTLIN : GROOVY;
  const state: GradleScanState = {
    frames: [],
    blocks: [],
    name: null,
    sources: [],
    declaresDependencies: false,
  };
  let index = 0;

  while (index < content.length) {
    const frame = state.frames.at(-1);

    index =
      frame?.kind === 'string'
        ? stringStep(file, dialect, content, index, frame, state)
        : codeStep(file, dialect, content, index, frame, state);
  }

  const open = state.frames.find(
    (frame): frame is GradleOpenString => frame.kind === 'string'
  );

  if (open !== undefined)
    throw cannotJudge(
      file,
      `never closes the string it opens on line ${lineAt(content, open.start)}`
    );

  if (state.blocks.length > 0)
    throw cannotJudge(file, 'never closes every block it opens');

  return {
    sources: state.sources,
    declaresDependencies: state.declaresDependencies,
  };
};
