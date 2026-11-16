import type {
  BoundCandidate,
  BoundString,
  CallSite,
  ExtractedPatterns,
  LiteralMark,
  RegexCandidate,
  SourceReading,
  SourceToken,
} from '../../types/hooks/regex.js';
import type { LanguageId } from '../../types/scan.js';
import { boundStrings } from './bindings.js';
import { callsOf, methodsOf, patternArgumentStarts } from './calls.js';
import { decodeLiteral, staticLiteralAt } from './lexer.js';
import { readSource, slashAt, slashLiteralEnd } from './source.js';

const METACHARACTERS = /[.*+?^${}()|[\]\\]/;

const REGEX_TOKENS =
  /\\[dwsbDWSB]|\[[^[\]]{1,200}\]|[*+?]|\{\d{1,9}(,\d{0,9})?\}|\|/;

const MIN_LENGTH = 3;

const MARK_REACH = 24;

const LITERAL_MARKS: Partial<Record<LanguageId, LiteralMark>> = {
  clojure: { before: /#$/ },
  julia: { before: /(?:^|\W)r$/ },
  nim: { before: /(?:^|\W)rex?$/ },
  elixir: { before: /~[rR]$/ },
  powershell: { before: /-[ic]?(?:not)?(?:match|replace|split)\s{1,8}$/i },
  kotlin: { after: /^\.toRegex\(/ },
  scala: { after: /^\.r\b/ },
};

const looksLikeRegex = (source: string): boolean =>
  source.length >= MIN_LENGTH &&
  METACHARACTERS.test(source) &&
  REGEX_TOKENS.test(source);

export const readingKey = ({ source, flags }: RegexCandidate): string =>
  `${flags}/${source}`;

const keep = (
  out: Map<string, RegexCandidate>,
  source: string,
  flags: string
): void => {
  if (looksLikeRegex(source))
    out.set(readingKey({ source, flags }), { source, flags });
};

const collectSlashLiterals = (
  { text, tokens }: SourceReading,
  out: Map<string, RegexCandidate>
): void => {
  for (const { kind, open, end, flags } of tokens)
    if (kind === 'slash') keep(out, text.slice(open + 1, end), flags);
};

/** A bundle on a single line pairs its quotes wrong for good after one literal the scan misreads */
const collectJavaScriptLiterals = (
  { code }: SourceReading,
  out: Map<string, RegexCandidate>
): void => {
  for (let index = 0; index < code.length; index += 1) {
    if (code[index] !== '/') continue;

    const literal = slashAt(code, index, 'javascript');

    if (literal === null) continue;

    keep(out, code.slice(index + 1, literal.end), literal.flags);
    index = literal.end + literal.flags.length;
  }
};

/** PHP writes a pattern as a string that holds its own delimiters */
const collectDelimitedStrings = (
  { text, tokens }: SourceReading,
  out: Map<string, RegexCandidate>
): void => {
  for (const { kind, open, end } of tokens) {
    if (kind !== 'string') continue;

    for (let index = open + 1; index < end; index += 1) {
      if (text[index] !== '/') continue;

      const close = slashLiteralEnd(text, index);

      if (close === -1 || close >= end) break;

      keep(out, text.slice(index + 1, close), '');
      index = close;
    }
  }
};

const collectCallArguments = (
  { code, language }: SourceReading,
  calls: readonly CallSite[],
  out: Map<string, RegexCandidate>
): void => {
  for (const call of calls)
    for (const start of patternArgumentStarts(code, call)) {
      const literal = staticLiteralAt(code, start, language);

      if (literal !== null)
        keep(out, decodeLiteral(code, literal.open, literal.end, language), '');
    }
};

const LITERAL_READERS: Partial<
  Record<LanguageId, typeof collectSlashLiterals>
> = { php: collectDelimitedStrings, javascript: collectJavaScriptLiterals };

const isMarkedLiteral = (
  text: string,
  { open, end }: SourceToken,
  language: LanguageId
): boolean => {
  const mark = LITERAL_MARKS[language];

  if (mark === undefined) return false;

  return (
    mark.before?.test(text.slice(Math.max(0, open - MARK_REACH), open)) ===
      true ||
    mark.after?.test(text.slice(end + 1, end + 1 + MARK_REACH)) === true
  );
};

const quotedCandidates = (
  { text, language }: SourceReading,
  strings: readonly BoundString[]
): { marked: boolean; candidate: BoundCandidate }[] =>
  strings
    .filter(({ token }) => !token.interpolated)
    .map(({ token, names, label, callee }) => ({
      marked: isMarkedLiteral(text, token, language),
      candidate: {
        source: decodeLiteral(text, token.open, token.end, language),
        flags: '',
        names,
        label,
        callee,
      },
    }))
    .filter(({ candidate }) => looksLikeRegex(candidate.source));

/** Pulls the regexes a file holds, as the program holds them: the ones its code proves it compiles, and the quoted strings that only look like one, each with the names its code binds it to */
export const extractPatterns = (source: SourceReading): ExtractedPatterns => {
  const { language } = source;
  const strings = boundStrings(source);
  const quoted = quotedCandidates(source, strings);
  const proven = new Map<string, RegexCandidate>();

  (LITERAL_READERS[language] ?? collectSlashLiterals)(source, proven);
  collectCallArguments(source, callsOf(language), proven);
  collectCallArguments(source, methodsOf(language), proven);

  for (const { marked, candidate } of quoted)
    if (marked) keep(proven, candidate.source, candidate.flags);

  return {
    proven: [...proven.values()],
    bound: quoted
      .filter(({ marked }) => !marked)
      .map(({ candidate }) => candidate),
    names: [
      ...[...new Set(strings.map(({ names }) => names))].flat(),
      ...strings.map(({ label }) => label),
    ],
  };
};

/** Pulls the distinct sources a file holds that read as a regex, compiled or only quoted, gated to its language */
export const extractSources = (
  text: string,
  language: LanguageId
): string[] => {
  const { proven, bound } = extractPatterns(readSource(text, language));

  return [...new Set([...proven, ...bound].map(({ source }) => source))];
};
