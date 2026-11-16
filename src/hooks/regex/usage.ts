import type {
  ArgumentShape,
  CallSite,
  LiteralForm,
  RegexUsage,
  SourceReading,
} from '../../types/hooks/regex.js';
import type { LanguageId } from '../../types/scan.js';
import { IDENTIFIER, identifiersIn } from './bindings.js';
import { callsOf, methodsOf, patternArgumentStarts } from './calls.js';
import {
  CLOSER_OF,
  CLOSERS,
  PREFIX_LIMIT,
  QUOTES,
  readLiteral,
  skipLabel,
  skipSpace,
  staticLiteralAt,
} from './lexer.js';

const ARGUMENT_LENGTH = 256;

const ARGUMENT_ENDS = new Set([')', ',', ']']);

const QUALIFIES = new Set(['(', '.', ':', ...QUOTES]);

const BLANKS = new Set([' ', '\t', '\r', '\n']);

const LITERAL_PREFIX = /[A-Za-z@#$]/;

const INTERPOLATED_NAME = /#\{\s{0,8}@{0,2}(\w{1,64})/g;

const INTERPOLATING_LITERALS: ReadonlySet<LanguageId> = new Set([
  'ruby',
  'crystal',
]);

const LITERAL_FORMS: readonly LiteralForm[] = [
  {
    languages: ['perl'],
    static: /(?:\bqr|\bm|=~\s{0,40}m?|\bs)\/[^/\n]{0,500}\//,
    dynamic: /(?:\bqr|\bm|=~\s{0,40}m?|\bs)\/[^/\n]{0,500}\$(\w{1,64})/g,
  },
  {
    languages: ['elixir'],
    static: /~r[/"{|]/,
    dynamic: /~r[/"{|][^\n]{0,500}#\{\s{0,8}@?(\w{0,64})/g,
  },
  {
    languages: ['julia'],
    static: /\br"[^"\n]{0,500}"/,
    dynamic: null,
  },
  {
    languages: ['clojure'],
    static: /#"[^"\n]{0,500}"/,
    dynamic: null,
  },
  {
    languages: ['nim'],
    static: /\bre"[^"\n]{0,500}"/,
    dynamic: null,
  },
  {
    languages: ['scala'],
    static: /"[^"\n]{0,500}"\.r\b/,
    dynamic: /\b[a-z]"[^"\n]{0,500}"\.r\b/g,
  },
  {
    languages: ['powershell'],
    static: null,
    dynamic: /-(?:match|replace)\s{1,40}\$(\w{0,64})/g,
  },
];

const argumentShape = (
  text: string,
  start: number,
  language: LanguageId
): ArgumentShape => {
  const literal = staticLiteralAt(text, start, language);

  if (literal === null) return 'dynamic';

  const next = skipSpace(text, literal.next);

  return ARGUMENT_ENDS.has(text[next]) || skipLabel(text, next) !== next
    ? 'static-literal'
    : 'dynamic';
};

const argumentEnd = (bare: string, start: number): number => {
  const limit = Math.min(bare.length, start + ARGUMENT_LENGTH);
  let depth = 0;

  for (let index = start; index < limit; index += 1) {
    const char = bare[index];

    if (depth === 0 && (char === ',' || CLOSERS.has(char))) return index;
    if (CLOSER_OF.has(char)) depth += 1;
    if (CLOSERS.has(char)) depth -= 1;
  }

  return limit;
};

/** The names an argument hands over as values, leaving out a label, a qualifier, and a function it calls */
const receivedNames = (bare: string, start: number): string[] => {
  const argument = bare.slice(start, argumentEnd(bare, start));

  return [...argument.matchAll(IDENTIFIER)]
    .filter(
      ({ 0: name, index }) => !QUALIFIES.has(argument[index + name.length])
    )
    .map(({ 0: name }) => name);
};

const literalOpen = (text: string, start: number): number => {
  let index = start;

  while (index - start < ARGUMENT_LENGTH && BLANKS.has(text[index])) index += 1;

  const prefixed = index;

  while (
    index - prefixed < PREFIX_LIMIT &&
    LITERAL_PREFIX.test(text[index] ?? '')
  )
    index += 1;

  return QUOTES.has(text[index]) ? index : -1;
};

/** Whether an argument opens with a string that runs past its own line: a pattern the scan cannot read, never a value it could trace */
const opensUnreadLiteral = (
  text: string,
  texts: ReadonlySet<number>,
  start: number
): boolean => {
  const open = literalOpen(text, start);

  return open !== -1 && (texts.has(open) || readLiteral(text, open) === null);
};

const patternArguments = <Call extends CallSite>(
  { code, language }: SourceReading,
  calls: readonly Call[]
): { call: Call; start: number; shape: ArgumentShape }[] =>
  calls.flatMap((call) =>
    patternArgumentStarts(code, call).map((start) => ({
      call,
      start,
      shape: argumentShape(code, start, language),
    }))
  );

const dynamicNames = (
  { text, bare }: SourceReading,
  texts: ReadonlySet<number>,
  written: readonly { start: number; shape: ArgumentShape }[]
): string[][] =>
  written
    .filter(
      ({ start, shape }) =>
        shape === 'dynamic' && !opensUnreadLiteral(text, texts, start)
    )
    .map(({ start }) => receivedNames(bare, start));

const interpolatedLiterals = ({
  text,
  tokens,
  language,
}: SourceReading): string[][] =>
  INTERPOLATING_LITERALS.has(language)
    ? tokens
        .filter(({ kind }) => kind === 'slash')
        .map(({ open, end }) => text.slice(open + 1, end))
        .filter((body) => body.includes('#{'))
        .map((body) =>
          [...body.matchAll(INTERPOLATED_NAME)].map(({ 1: name }) => name)
        )
    : [];

const formsOf = (language: LanguageId): LiteralForm[] =>
  LITERAL_FORMS.filter((form) => form.languages.includes(language));

const dynamicForms = (code: string, language: LanguageId): string[][] =>
  formsOf(language).flatMap(({ dynamic }) =>
    dynamic === null
      ? []
      : [...code.matchAll(dynamic)].map((match) =>
          identifiersIn(match[1] ?? '')
        )
  );

/** Classifies how a file builds its regexes, from a non-literal pattern at runtime or from a static literal wrapped in a constructor, and lists the names its patterns are built from, best-effort */
export const regexUsage = (source: SourceReading): RegexUsage => {
  const { language } = source;
  const called = patternArguments(source, callsOf(language));
  const forms = [
    ...interpolatedLiterals(source),
    ...dynamicForms(source.code, language),
  ];
  const texts = new Set(
    source.tokens.filter(({ kind }) => kind === 'text').map(({ open }) => open)
  );
  const receivers = [...dynamicNames(source, texts, called), ...forms];
  const methods = patternArguments(source, methodsOf(language));

  return {
    dynamic:
      forms.length > 0 || called.some(({ shape }) => shape === 'dynamic'),
    staticWrap:
      called.some(
        ({ call, shape }) => call.hasLiteralForm && shape === 'static-literal'
      ) ||
      formsOf(language).some((form) => form.static?.test(source.code) === true),
    receivers,
    reaching: [...receivers, ...dynamicNames(source, texts, methods)].flat(),
  };
};
