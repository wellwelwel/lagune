import type {
  ArgumentShape,
  CallConstructor,
  LanguageId,
  LiteralForm,
  RegexUsage,
} from '../../types/hooks/regex.js';
import {
  argumentStart,
  isWordBoundaryMatch,
  QUOTES,
  readLiteral,
  skipSpace,
} from './lexer.js';

const CONSTRUCTORS: CallConstructor[] = [
  {
    name: 'new RegExp',
    argIndex: 0,
    hasLiteralForm: true,
    languages: ['javascript'],
  },
  {
    name: 'RegExp',
    argIndex: 0,
    hasLiteralForm: true,
    languages: ['javascript', 'dart'],
  },
  {
    name: 're.compile',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['python'],
  },
  {
    name: 're.match',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['python'],
  },
  {
    name: 're.search',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['python'],
  },
  { name: 're.sub', argIndex: 0, hasLiteralForm: false, languages: ['python'] },
  {
    name: 're.findall',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['python'],
  },
  {
    name: 're.fullmatch',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['python'],
  },
  {
    name: 'regex.compile',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['python'],
  },
  {
    name: 'Pattern.compile',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['java', 'kotlin', 'scala'],
  },
  {
    name: 'new Regex',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['csharp', 'scala'],
  },
  {
    name: 'Regex.Match',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['csharp'],
  },
  {
    name: 'Regex.Matches',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['csharp'],
  },
  {
    name: 'Regex.IsMatch',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['csharp'],
  },
  {
    name: 'Regex.Replace',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['csharp'],
  },
  {
    name: 'Regex',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['csharp', 'kotlin', 'julia'],
  },
  {
    name: 'regexp.Compile',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['go'],
  },
  {
    name: 'regexp.MustCompile',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['go'],
  },
  {
    name: 'regexp.MatchString',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['go'],
  },
  {
    name: 'Regexp.new',
    argIndex: 0,
    hasLiteralForm: true,
    languages: ['ruby'],
  },
  {
    name: 'Regexp.compile',
    argIndex: 0,
    hasLiteralForm: true,
    languages: ['ruby'],
  },
  {
    name: 'preg_match_all',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['php'],
  },
  {
    name: 'preg_match',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['php'],
  },
  {
    name: 'preg_replace',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['php'],
  },
  {
    name: 'preg_split',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['php'],
  },
  {
    name: 'Regex::new',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['rust'],
  },
  {
    name: 'RegexBuilder::new',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['rust'],
  },
  {
    name: 'std::regex',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['cpp'],
  },
  {
    name: 'NSRegularExpression',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['swift', 'objc'],
  },
  {
    name: 'regularExpressionWithPattern',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['swift', 'objc'],
    opener: 'colon',
  },
  {
    name: '[regex]::Match',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['powershell'],
  },
  {
    name: '[regex]::Matches',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['powershell'],
  },
  {
    name: '[regex]::IsMatch',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['powershell'],
  },
  {
    name: '[regex]::Replace',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['powershell'],
  },
  {
    name: 'Regex.compile',
    argIndex: 0,
    hasLiteralForm: true,
    languages: ['elixir'],
  },
  {
    name: 'Regex.run',
    argIndex: 0,
    hasLiteralForm: true,
    languages: ['elixir'],
  },
  {
    name: 'Regex.match?',
    argIndex: 0,
    hasLiteralForm: true,
    languages: ['elixir'],
  },
  {
    name: 'Regex.scan',
    argIndex: 0,
    hasLiteralForm: true,
    languages: ['elixir'],
  },
  {
    name: 'Regex.replace',
    argIndex: 0,
    hasLiteralForm: true,
    languages: ['elixir'],
  },
  { name: 'grepl', argIndex: 0, hasLiteralForm: false, languages: ['r'] },
  { name: 'gsub', argIndex: 0, hasLiteralForm: false, languages: ['r'] },
  { name: 'regmatches', argIndex: 0, hasLiteralForm: false, languages: ['r'] },
  { name: 'regexpr', argIndex: 0, hasLiteralForm: false, languages: ['r'] },
  { name: 'regexec', argIndex: 0, hasLiteralForm: false, languages: ['r'] },
  {
    name: 're-pattern',
    argIndex: 0,
    hasLiteralForm: true,
    languages: ['clojure'],
    opener: 'space',
  },
  {
    name: 'Regex.new',
    argIndex: 0,
    hasLiteralForm: true,
    languages: ['crystal'],
  },
  { name: 'nre.re', argIndex: 0, hasLiteralForm: true, languages: ['nim'] },
  {
    name: 'regex.regex_opt',
    argIndex: 0,
    hasLiteralForm: false,
    languages: ['vlang'],
  },
  { name: 'regex', argIndex: 0, hasLiteralForm: false, languages: ['dlang'] },
  {
    name: 'regcomp',
    argIndex: 1,
    hasLiteralForm: false,
    languages: ['c', 'cpp'],
  },
];

const LITERAL_FORMS: LiteralForm[] = [
  {
    languages: ['ruby', 'crystal'],
    static: null,
    dynamic: /\/[^/\n]{0,500}#\{[^/\n]{0,500}\//,
  },
  {
    languages: ['perl'],
    static: /(?:\bqr|\bm|=~\s{0,40}m?|\bs)\/[^/\n]{0,500}\//,
    dynamic: /(?:\bqr|\bm|=~\s{0,40}m?|\bs)\/[^/\n]{0,500}\$\w/,
  },
  {
    languages: ['elixir'],
    static: /~r[/"{|]/,
    dynamic: /~r[/"{|][^\n]{0,500}#\{/,
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
    dynamic: /\b[a-z]"[^"\n]{0,500}"\.r\b/,
  },
  {
    languages: ['powershell'],
    static: null,
    dynamic: /-(?:match|replace)\s{1,40}\$/,
  },
];

const argumentShape = (text: string, start: number): ArgumentShape => {
  const at = skipSpace(text, start);
  const char = text[at];

  if (!QUOTES.has(char)) return 'dynamic';

  const literal = readLiteral(text, at);

  if (literal === null || literal.interpolated) return 'dynamic';

  const next = skipSpace(text, literal.end + 1);

  if (text[next] !== ')' && text[next] !== ',') return 'dynamic';

  return 'static-literal';
};

const classifyCalls = (
  text: string,
  entry: CallConstructor,
  shapes: Set<ArgumentShape>
): void => {
  const { name, argIndex, opener = 'paren' } = entry;
  let from = 0;

  for (;;) {
    const at = text.indexOf(name, from);

    if (at === -1) return;

    from = at + name.length;

    if (!isWordBoundaryMatch(text, at, name)) continue;

    const start = argumentStart(text, at + name.length, opener, argIndex);

    if (start !== -1) shapes.add(argumentShape(text, start));
  }
};

const classify = (text: string, language: LanguageId): RegexUsage => {
  let dynamic = false;
  let staticWrap = false;

  for (const entry of CONSTRUCTORS) {
    if (!entry.languages.includes(language)) continue;

    const shapes = new Set<ArgumentShape>();

    classifyCalls(text, entry, shapes);

    if (shapes.has('dynamic')) dynamic = true;
    if (shapes.has('static-literal') && entry.hasLiteralForm) staticWrap = true;
  }

  for (const form of LITERAL_FORMS) {
    if (!form.languages.includes(language)) continue;

    if (form.static && form.static.test(text)) staticWrap = true;
    if (form.dynamic && form.dynamic.test(text)) dynamic = true;
  }

  return { dynamic, staticWrap };
};

/** True when the file builds a regex from a non-literal pattern, best-effort */
export const buildsDynamicRegex = (
  text: string,
  language: LanguageId
): boolean => classify(text, language).dynamic;

/** True when the file wraps a static literal in a regex constructor, best-effort */
export const wrapsStaticRegex = (text: string, language: LanguageId): boolean =>
  classify(text, language).staticWrap;
