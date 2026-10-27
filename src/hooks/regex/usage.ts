import type {
  ArgumentShape,
  LiteralForm,
  RegexUsage,
} from '../../types/hooks/regex.js';
import type { LanguageId } from '../../types/scan.js';
import { callsOf, patternArgumentStarts } from './calls.js';
import { skipLabel, skipSpace, staticLiteralAt } from './lexer.js';

const ARGUMENT_ENDS = new Set([')', ',', ']']);

const LITERAL_FORMS: readonly LiteralForm[] = [
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

/** Classifies how a file builds its regexes, from a non-literal pattern at runtime or from a static literal wrapped in a constructor, best-effort */
export const regexUsage = (text: string, language: LanguageId): RegexUsage => {
  let dynamic = false;
  let staticWrap = false;

  for (const call of callsOf(language)) {
    const shapes = new Set(
      patternArgumentStarts(text, call).map((start) =>
        argumentShape(text, start, language)
      )
    );

    if (shapes.has('dynamic')) dynamic = true;
    if (shapes.has('static-literal') && call.hasLiteralForm) staticWrap = true;
  }

  for (const form of LITERAL_FORMS) {
    if (!form.languages.includes(language)) continue;

    if (form.static && form.static.test(text)) staticWrap = true;
    if (form.dynamic && form.dynamic.test(text)) dynamic = true;
  }

  return { dynamic, staticWrap };
};
