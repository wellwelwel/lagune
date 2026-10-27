import type {
  CallOpener,
  CallSite,
  RegexCall,
} from '../../types/hooks/regex.js';
import type { LanguageId } from '../../types/scan.js';
import { isIdentifierChar, QUOTES, readLiteral, skipSpace } from './lexer.js';

const REGEX_CALLS: readonly RegexCall[] = [
  {
    name: 'new RegExp',
    argumentIndex: 0,
    hasLiteralForm: true,
    languages: ['javascript'],
  },
  {
    name: 'RegExp',
    argumentIndex: 0,
    hasLiteralForm: true,
    languages: ['javascript'],
  },
  {
    name: 'RegExp',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['dart'],
  },
  {
    name: 're.compile',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['python'],
  },
  {
    name: 're.match',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['python'],
  },
  {
    name: 're.search',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['python'],
  },
  {
    name: 're.sub',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['python'],
  },
  {
    name: 're.findall',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['python'],
  },
  {
    name: 're.fullmatch',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['python'],
  },
  {
    name: 'regex.compile',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['python'],
  },
  {
    name: 'Pattern.compile',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['java', 'kotlin', 'scala'],
  },
  {
    name: 'new Regex',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['csharp', 'scala'],
  },
  {
    name: 'Regex.Match',
    argumentIndex: 1,
    hasLiteralForm: false,
    languages: ['csharp'],
  },
  {
    name: 'Regex.Matches',
    argumentIndex: 1,
    hasLiteralForm: false,
    languages: ['csharp'],
  },
  {
    name: 'Regex.IsMatch',
    argumentIndex: 1,
    hasLiteralForm: false,
    languages: ['csharp'],
  },
  {
    name: 'Regex.Replace',
    argumentIndex: 1,
    hasLiteralForm: false,
    languages: ['csharp'],
  },
  {
    name: 'Regex',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['csharp', 'kotlin', 'julia'],
  },
  {
    name: 'regexp.Compile',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['go'],
  },
  {
    name: 'regexp.MustCompile',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['go'],
  },
  {
    name: 'regexp.MatchString',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['go'],
  },
  {
    name: 'Regexp.new',
    argumentIndex: 0,
    hasLiteralForm: true,
    languages: ['ruby'],
  },
  {
    name: 'Regexp.compile',
    argumentIndex: 0,
    hasLiteralForm: true,
    languages: ['ruby'],
  },
  {
    name: 'preg_match_all',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['php'],
  },
  {
    name: 'preg_match',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['php'],
  },
  {
    name: 'preg_replace',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['php'],
  },
  {
    name: 'preg_split',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['php'],
  },
  {
    name: 'Regex::new',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['rust'],
  },
  {
    name: 'RegexBuilder::new',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['rust'],
  },
  {
    name: 'std::regex',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['cpp'],
  },
  {
    name: 'NSRegularExpression',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['swift', 'objc'],
  },
  {
    name: 'regularExpressionWithPattern',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['swift', 'objc'],
    opener: 'colon',
  },
  {
    name: '[regex]::Match',
    argumentIndex: 1,
    hasLiteralForm: false,
    languages: ['powershell'],
  },
  {
    name: '[regex]::Matches',
    argumentIndex: 1,
    hasLiteralForm: false,
    languages: ['powershell'],
  },
  {
    name: '[regex]::IsMatch',
    argumentIndex: 1,
    hasLiteralForm: false,
    languages: ['powershell'],
  },
  {
    name: '[regex]::Replace',
    argumentIndex: 1,
    hasLiteralForm: false,
    languages: ['powershell'],
  },
  {
    name: 'Regex.compile',
    argumentIndex: 0,
    hasLiteralForm: true,
    languages: ['elixir'],
  },
  { name: 'grepl', argumentIndex: 0, hasLiteralForm: false, languages: ['r'] },
  { name: 'gsub', argumentIndex: 0, hasLiteralForm: false, languages: ['r'] },
  {
    name: 'regexpr',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['r'],
  },
  {
    name: 'regexec',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['r'],
  },
  {
    name: 're-pattern',
    argumentIndex: 0,
    hasLiteralForm: true,
    languages: ['clojure'],
    opener: 'space',
  },
  {
    name: 'Regex.new',
    argumentIndex: 0,
    hasLiteralForm: true,
    languages: ['crystal'],
  },
  {
    name: 'nre.re',
    argumentIndex: 0,
    hasLiteralForm: true,
    languages: ['nim'],
  },
  {
    name: 'regex.regex_opt',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['vlang'],
  },
  {
    name: 'regex',
    argumentIndex: 0,
    hasLiteralForm: false,
    languages: ['dlang'],
  },
  {
    name: 'regcomp',
    argumentIndex: 1,
    hasLiteralForm: false,
    languages: ['c', 'cpp'],
  },
];

export const callsOf = (language: LanguageId): RegexCall[] =>
  REGEX_CALLS.filter((call) => call.languages.includes(language));

const skipDeclarator = (text: string, from: number): number => {
  let index = skipSpace(text, from);

  while (index < text.length && isIdentifierChar(text[index])) index += 1;

  return skipSpace(text, index);
};

const isWordBoundaryMatch = (
  text: string,
  at: number,
  name: string
): boolean => {
  const before = text[at - 1] ?? '';

  if (isIdentifierChar(name[0]) && isIdentifierChar(before)) return false;

  const after = text[at + name.length] ?? '';

  return !isIdentifierChar(after);
};

const skipArguments = (
  text: string,
  afterParen: number,
  count: number
): number => {
  let index = afterParen;
  let depth = 0;
  let skipped = 0;

  while (index < text.length && skipped < count) {
    const char = text[index];

    if (QUOTES.has(char)) {
      const literal = readLiteral(text, index);

      if (literal === null) return -1;

      index = literal.end + 1;
      continue;
    }

    if (char === '(' || char === '[' || char === '{') depth += 1;

    if (char === ')' || char === ']' || char === '}') {
      if (depth === 0) return -1;

      depth -= 1;
    }

    if (char === ',' && depth === 0) skipped += 1;

    index += 1;
  }

  return skipped === count ? index : -1;
};

const argumentStart = (
  text: string,
  afterName: number,
  opener: CallOpener,
  argumentIndex: number
): number => {
  if (opener === 'colon') {
    const colon = skipSpace(text, afterName);

    return text[colon] === ':' ? colon + 1 : -1;
  }

  if (opener === 'space')
    return text[afterName] === ' ' || text[afterName] === '\t'
      ? skipSpace(text, afterName)
      : -1;

  const paren = skipDeclarator(text, afterName);

  return text[paren] === '('
    ? skipArguments(text, paren + 1, argumentIndex)
    : -1;
};

/** Lists where the pattern argument starts in each call the text makes to the API */
export const patternArgumentStarts = (
  text: string,
  { name, argumentIndex, opener = 'paren' }: CallSite
): number[] => {
  const starts: number[] = [];

  for (
    let at = text.indexOf(name);
    at !== -1;
    at = text.indexOf(name, at + name.length)
  ) {
    if (!isWordBoundaryMatch(text, at, name)) continue;

    const start = argumentStart(text, at + name.length, opener, argumentIndex);

    if (start !== -1) starts.push(start);
  }

  return starts;
};
