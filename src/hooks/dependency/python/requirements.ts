import type {
  DependencyFlag,
  DependencyRead,
  NumberedLine,
  PipOption,
  PipOptionValue,
  RequirementLine,
  RequirementsContent,
} from '../../../types/hooks/dependency.js';
import { deepFreeze } from '../../../core/collections.js';
import { quotedExcerpt } from '../../../core/errors.js';
import { cannotJudge } from '../text.js';
import { plainUrlFlags } from '../transport.js';
import { requirementOf } from './requirement.js';
import { extraIndexFlags, requirementFlags } from './source.js';

/** The options pip accepts in a requirements file, on their own line or after a requirement */
const PIP_OPTIONS: readonly PipOption[] = deepFreeze([
  { name: 'index-url', short: 'i', takesValue: true },
  { name: 'extra-index-url', short: null, takesValue: true },
  { name: 'no-index', short: null, takesValue: false },
  { name: 'constraint', short: 'c', takesValue: true },
  { name: 'requirement', short: 'r', takesValue: true },
  { name: 'editable', short: 'e', takesValue: true },
  { name: 'find-links', short: 'f', takesValue: true },
  { name: 'no-binary', short: null, takesValue: true },
  { name: 'only-binary', short: null, takesValue: true },
  { name: 'prefer-binary', short: null, takesValue: false },
  { name: 'require-hashes', short: null, takesValue: false },
  { name: 'pre', short: null, takesValue: false },
  { name: 'trusted-host', short: null, takesValue: true },
  { name: 'use-feature', short: null, takesValue: true },
  { name: 'global-option', short: null, takesValue: true },
  { name: 'hash', short: null, takesValue: true },
  { name: 'config-settings', short: 'C', takesValue: true },
]);

const FETCHED_OPTIONS: ReadonlySet<string> = new Set([
  'index-url',
  'extra-index-url',
  'find-links',
  'requirement',
  'constraint',
]);

const EXTRA_INDEX: ReadonlySet<string> = new Set(['extra-index-url']);

const LINE_BREAKS = /\r?\n/;

const COMMENT_LINE = /^\s*#/;

const WHITESPACE = /\s/;

const WHITESPACE_RUN = /\s+/;

const withoutEdgeBackslashes = (line: string): string => {
  let start = 0;
  let end = line.length;

  while (line[start] === '\\') start += 1;
  while (end > start && line[end - 1] === '\\') end -= 1;

  return line.slice(start, end);
};

/** Where a comment starts: at a # that opens the line or follows whitespace, or -1 when the line has none */
const commentStart = (text: string): number => {
  let index = text.indexOf('#');

  while (index > 0 && !WHITESPACE.test(text[index - 1]))
    index = text.indexOf('#', index + 1);

  return index;
};

/** Joins the lines a trailing backslash continues the way pip does, numbering each joined line by its first */
const logicalLines = (content: string): NumberedLine[] => {
  const joined: NumberedLine[] = [];
  let pending: string[] = [];
  let first = 1;

  for (const [index, line] of content.split(LINE_BREAKS).entries()) {
    const comment = COMMENT_LINE.test(line);

    if (pending.length === 0) first = index + 1;

    if (line.endsWith('\\') && !comment) {
      pending.push(withoutEdgeBackslashes(line));
      continue;
    }

    joined.push([first, [...pending, comment ? ` ${line}` : line].join('')]);
    pending = [];
  }

  if (pending.length > 0) joined.push([first, pending.join('')]);

  return joined;
};

const optionNamed = (key: string): PipOption | null => {
  const exact = PIP_OPTIONS.find(({ name }) => name === key);

  if (exact !== undefined) return exact;

  const prefixed = PIP_OPTIONS.filter(({ name }) => name.startsWith(key));

  return key !== '' && prefixed.length === 1 ? prefixed[0] : null;
};

const unquoted = (value: string): string => {
  const quote = value[0];

  return value.length >= 2 &&
    (quote === '"' || quote === "'") &&
    value.endsWith(quote)
    ? value.slice(1, -1)
    : value;
};

/** The option a token names and the value written inside it, as `--name=value` or `-Xvalue` */
const optionToken = (
  token: string
): [option: PipOption | null, inline: string | null] => {
  if (token.startsWith('--')) {
    const equals = token.indexOf('=');
    const key = equals === -1 ? token.slice(2) : token.slice(2, equals);

    return [optionNamed(key), equals === -1 ? null : token.slice(equals + 1)];
  }

  const option = PIP_OPTIONS.find(({ short }) => short === token[1]) ?? null;

  return [option, token.length > 2 ? token.slice(2) : null];
};

const optionsOf = (
  file: string,
  line: number,
  tokens: readonly string[]
): PipOptionValue[] => {
  const values: PipOptionValue[] = [];
  let index = 0;

  while (index < tokens.length) {
    const token = tokens[index];

    index += 1;

    if (!token.startsWith('-')) continue;

    const [option, inline] = optionToken(token);

    if (option === null)
      throw cannotJudge(
        file,
        `holds an option pip does not know on line ${line}: ${quotedExcerpt(token)}`
      );

    if (!option.takesValue) {
      values.push({ name: option.name, value: '' });
      continue;
    }

    const value = inline ?? (index < tokens.length ? tokens[index] : '');

    if (value === '')
      throw cannotJudge(
        file,
        `leaves --${option.name} on line ${line} without a value`
      );

    if (inline === null) index += 1;

    values.push({ name: option.name, value: unquoted(value) });
  }

  return values;
};

/** The options and requirements of a requirements file, where options after a requirement belong to it alone */
const requirementsContentOf = (
  file: string,
  content: string
): RequirementsContent => {
  const lines = logicalLines(content).flatMap(([line, text]) => {
    const comment = commentStart(text);
    const kept = (comment === -1 ? text : text.slice(0, comment)).trim();

    return kept === '' ? [] : [{ line, tokens: kept.split(WHITESPACE_RUN) }];
  });
  const parsed = lines.map(({ line, tokens }) => {
    const firstOption = tokens.findIndex((token) => token.startsWith('-'));
    const words = firstOption === -1 ? tokens : tokens.slice(0, firstOption);
    const options = optionsOf(
      file,
      line,
      firstOption === -1 ? [] : tokens.slice(firstOption)
    );

    return { words, options };
  });
  const lineOptions = parsed.flatMap(({ words, options }) =>
    words.length === 0 ? options : []
  );
  const editables: RequirementLine[] = lineOptions
    .filter(({ name }) => name === 'editable')
    .map(({ value }) => ({
      requirement: requirementOf(file, value),
      hashed: false,
    }));
  const requirements: RequirementLine[] = parsed.flatMap(
    ({ words, options }) =>
      words.length === 0
        ? []
        : [
            {
              requirement: requirementOf(file, words.join(' ')),
              hashed: options.some(({ name }) => name === 'hash'),
            },
          ]
  );

  return {
    options: lineOptions,
    requirements: [...requirements, ...editables],
  };
};

const missingHashFlags = (
  requireHashes: boolean,
  requirements: readonly RequirementLine[]
): DependencyFlag[] => {
  if (!requireHashes && !requirements.some(({ hashed }) => hashed)) return [];

  return requirements.flatMap(({ requirement, hashed }) =>
    requirement.kind === 'index' && !hashed
      ? [{ verdict: 'missing-integrity', name: requirement.text }]
      : []
  );
};

/** A pip requirements file, which pins like a lockfile once every requirement it resolves from an index is pinned to one version */
export const readRequirements = (
  file: string,
  content: string
): DependencyRead => {
  const { options, requirements } = requirementsContentOf(file, content);
  const valuesOf = (names: ReadonlySet<string>): string[] =>
    options.filter(({ name }) => names.has(name)).map(({ value }) => value);
  const indexed = requirements.flatMap(({ requirement }) =>
    requirement.kind === 'index' ? [requirement] : []
  );

  return {
    flags: [
      ...plainUrlFlags(valuesOf(FETCHED_OPTIONS)),
      ...requirements.flatMap(({ requirement }) =>
        requirementFlags(requirement)
      ),
      ...extraIndexFlags(valuesOf(EXTRA_INDEX)),
      ...missingHashFlags(
        options.some(({ name }) => name === 'require-hashes'),
        requirements
      ),
    ],
    needsLockfile: indexed.some(({ pinned }) => !pinned),
    pins: indexed.length > 0 && indexed.every(({ pinned }) => pinned),
    declaresWorkspace: false,
  };
};
