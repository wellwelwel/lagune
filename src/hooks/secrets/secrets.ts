import type {
  ConnectionKind,
  SecretEvidence,
  SecretKind,
} from '../../types/hooks/secrets.js';
import type { FileAnalysis, LanguageId } from '../../types/scan.js';
import { deepFreeze } from '../../core/collections.js';
import { languageOf } from '../../core/scan/language.js';
import { codeLines } from '../../core/scan/lines.js';
import {
  connectionKindOf,
  envFallbacksOf,
  isPlaceholder,
  SIGNATURES,
  sinkOf,
  strongestConnection,
} from './patterns.js';

const ASSIGN =
  /(?:password|passwd|pwd|secret|api[_-]?key|apikey|access[_-]?key|auth[_-]?token|token|credential|private[_-]?key|client[_-]?secret)\s{0,16}[:=]\s{0,16}(['"`])([^'"`]{0,4096})\1/i;

const SECRET_REF =
  /\b(?:password|secret|api[_-]?key|apikey|token|credential|private[_-]?key|plaintext|decrypted\w{0,64})\b/i;

const SECRET_IDENTIFIER =
  /(?:password|passwd|pwd|secret|api[_-]?key|apikey|access[_-]?key|auth[_-]?token|token|credential|private[_-]?key|client[_-]?secret)/i;

const SINK_DETAIL =
  'a secret-named value flows into a log/response/error sink: verify it is redacted';

const remedied = (label: string, remedy: string): SecretKind =>
  deepFreeze({ label, detail: `${label}: ${remedy}` });

const ENV_FALLBACK = remedied(
  'hardcoded fallback for an environment secret',
  'remove the literal default'
);

const CONNECTION = remedied(
  'credential embedded in a connection/DSN string',
  'move it to an environment variable or secret store'
);

const LOCAL_CONNECTION = remedied(
  'credential embedded in a connection/DSN string to a local host or a service name',
  'if it is a real credential rather than a development default, move it to an environment variable or secret store'
);

const EXAMPLE_CONNECTION = remedied(
  'credential embedded in a connection/DSN string whose password reads as an example',
  'if it is a real credential rather than an example, move it to an environment variable or secret store'
);

const UNCONFIRMED_CONNECTIONS: Readonly<
  Record<Exclude<ConnectionKind, 'remote'>, SecretKind>
> = deepFreeze({ local: LOCAL_CONNECTION, example: EXAMPLE_CONNECTION });

const LITERAL = remedied(
  'literal bound to a secret-named identifier',
  'confirm it is a real credential, and move any secret to an environment variable or secret store'
);

const hasHardcodedLiteral = (line: string): boolean => {
  const match = ASSIGN.exec(line);

  if (match === null) return false;

  return match[2].length >= 8 && !isPlaceholder(match[2]);
};

const hasEnvFallback = (line: string, patterns: readonly RegExp[]): boolean =>
  patterns.some((pattern) => {
    const match = pattern.exec(line);

    if (match === null) return false;

    const [matched, quote, defaultLiteral] = match;

    if (isPlaceholder(defaultLiteral)) return false;

    const quotedDefault = `${quote}${defaultLiteral}${quote}`;
    const lookup = matched.slice(0, -quotedDefault.length);

    return SECRET_IDENTIFIER.test(lookup);
  });

/** The secrets the lines hold, by how strongly they prove each. Provider signatures and connection strings count even inside a comment, the other rules read the code form of each line that names a secret */
export const secretsInLines = (
  language: LanguageId | null,
  rawLines: readonly string[],
  codeLineAt: (index: number) => string
): SecretEvidence => {
  const envPatterns = language === null ? [] : envFallbacksOf(language);
  const connection = strongestConnection(rawLines, connectionKindOf);
  const lines = rawLines.map((line, index) =>
    SECRET_IDENTIFIER.test(line) ? codeLineAt(index) : ''
  );
  const fallback =
    envPatterns.length > 0 &&
    lines.some((line) => hasEnvFallback(line, envPatterns));
  const signed = SIGNATURES.filter((rule) =>
    rawLines.some((line) => rule.regex.test(line))
  );

  return {
    proven: [
      ...signed,
      ...(fallback ? [ENV_FALLBACK] : []),
      ...(connection === 'remote' ? [CONNECTION] : []),
    ],
    unconfirmed: [
      ...(connection === null || connection === 'remote'
        ? []
        : [UNCONFIRMED_CONNECTIONS[connection]]),
      ...(lines.some(hasHardcodedLiteral) ? [LITERAL] : []),
    ],
  };
};

const detailOf = ({ detail }: SecretKind): string => detail;

export const analyzeFor = (
  language: LanguageId | null,
  content: string
): FileAnalysis => {
  const rawLines = content.split('\n');
  const lines = codeLines(content, language);
  const { proven, unconfirmed } = secretsInLines(
    language,
    rawLines,
    (index) => lines[index]
  );
  const sink = language === null ? null : sinkOf(language);
  const leaks =
    sink !== null &&
    lines.some((line) => sink.test(line) && SECRET_REF.test(line));

  return {
    findings: proven.map(detailOf),
    review: [...unconfirmed.map(detailOf), ...(leaks ? [SINK_DETAIL] : [])],
    advisory: [],
  };
};

export const analyze = (file: string, content: string): FileAnalysis =>
  analyzeFor(languageOf(file), content);
