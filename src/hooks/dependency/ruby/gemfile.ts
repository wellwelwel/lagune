import type { CallNode } from '@ruby/prism/src/nodes.js';
import type {
  DependencyFlag,
  DependencyRead,
} from '../../../types/hooks/dependency.js';
import { SelfNode, SymbolNode } from '@ruby/prism/src/nodes.js';
import { plainUrlFlags } from '../transport.js';
import { rubyCodeOf } from './parser.js';

/** The calls of Bundler's own that declare dependencies */
const DECLARING_CALLS: ReadonlySet<string> = new Set(['gem', 'gemspec']);

const SOURCE = 'source';

/** The symbols a source names that Bundler 2 reads as http://rubygems.org and later releases refuse */
const SYMBOL_SOURCES: ReadonlySet<string> = new Set([
  'rubygems',
  'gemcutter',
  'rubyforge',
]);

const LINE_BREAK = '\n';

/** A call the Gemfile makes to Bundler itself, never a method of another object that shares its name */
const isBundlerCall = ({ receiver }: CallNode): boolean =>
  receiver === null || receiver instanceof SelfNode;

const linesOf = (text: string): string[] =>
  text
    .split(LINE_BREAK)
    .map((line) => line.trim())
    .filter((line) => line !== '');

const symbolSourceFlags = ({
  name,
  arguments_,
}: CallNode): DependencyFlag[] => {
  if (name !== SOURCE) return [];

  const [first] = arguments_?.arguments_ ?? [];

  if (
    !(first instanceof SymbolNode) ||
    !SYMBOL_SOURCES.has(first.unescaped.value)
  )
    return [];

  return [
    { verdict: 'plain-transport', name: `${SOURCE} :${first.unescaped.value}` },
  ];
};

/** A Gemfile or gems.rb, where an http:// or git:// URL written as a string or a symbol, or on a line of one, is a source, whatever call takes it */
export const readGemfile = (file: string, content: string): DependencyRead => {
  const { texts, calls } = rubyCodeOf(file, content);
  const bundlerCalls = calls.filter(isBundlerCall);

  return {
    flags: [
      ...plainUrlFlags(texts.flatMap(linesOf)),
      ...bundlerCalls.flatMap(symbolSourceFlags),
    ],
    needsLockfile: bundlerCalls.some(({ name }) => DECLARING_CALLS.has(name)),
    pins: false,
    declaresWorkspace: false,
  };
};
