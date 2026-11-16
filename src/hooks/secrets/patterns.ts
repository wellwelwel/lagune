import type {
  ConnectionKind,
  EvidenceTier,
  SecretSignature,
} from '../../types/hooks/secrets.js';
import type { LanguageId } from '../../types/scan.js';
import { deepFreeze } from '../../core/collections.js';

export const PRIVATE_KEY_BLOCK =
  /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?(?:ENCRYPTED )?PRIVATE KEY(?: BLOCK)?-----/;

const PLACEHOLDER =
  /^(?:changeme|changeit|change[-_]me|replace(?:me|[-_][\w-]*)|insert[-_][\w-]*|your[-_]?[\w-]+|example[\w-]*|sample[\w-]*|dummy[\w-]*|test[\w-]*|placeholder|redacted|todo|none|null|undefined|x{3,}|\*{3,}|[\w.-]{0,64}(?:\.{3}|\u2026)|<.*>|\$\{.*\}|\{\{.*\}\})$/i;

const CONNECTION_STRING =
  /\b[a-z][a-z0-9+.-]{1,20}:\/\/[^\s:'"`@/]{0,64}:([^\s:'"`@/]{1,256})@([^\s'"`/]{1,256})/gi;

const EXAMPLE_PASSWORD = /^(?:password|passwd|pass|pwd)$/i;
const SCHEME_SEPARATOR = '://';
const HOST_END = /[:?#,;)>]/;
const LOOPBACK_IPV4 = /^127(?:\.\d{1,3}){3}$/;
const SINGLE_LABEL = /^[a-z0-9_%-]{0,253}$/;

const LOCAL_HOSTS: ReadonlySet<string> = new Set([
  'localhost',
  '::1',
  '0.0.0.0',
  'host.docker.internal',
]);

const CONNECTION_RANKS: Readonly<Record<ConnectionKind, number>> = deepFreeze({
  remote: 2,
  local: 1,
  example: 0,
});

const CONNECTION_TIERS: Readonly<Record<ConnectionKind, EvidenceTier>> =
  deepFreeze({
    remote: 'proven',
    local: 'unconfirmed',
    example: 'unconfirmed',
  });

const signature = (label: string, regex: RegExp): SecretSignature => ({
  regex,
  label,
  detail: `${label} committed in source`,
});

/** Curated provider token formats, not exhaustive: the structural rule (a literal bound to a secret-named identifier) catches the rest */
export const SIGNATURES: readonly SecretSignature[] = deepFreeze([
  signature('AWS access key id (AKIA…)', /\bAKIA[0-9A-Z]{16}\b/),
  signature('GitHub personal access token (ghp_…)', /\bghp_[A-Za-z0-9]{36}\b/),
  signature(
    'GitHub fine-grained token (github_pat_…)',
    /\bgithub_pat_[A-Za-z0-9_]{22,}\b/
  ),
  signature('Slack token (xox…)', /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/),
  signature(
    'Stripe live secret key (sk_live_…)',
    /\bsk_live_[A-Za-z0-9]{16,}\b/
  ),
  signature(
    'Stripe test secret key (sk_test_…)',
    /\bsk_test_[A-Za-z0-9]{16,}\b/
  ),
  signature(
    'OpenAI project secret key (sk-proj-…)',
    /\bsk-proj-[A-Za-z0-9_-]{20,}\b/
  ),
  signature('OpenAI secret key (sk-…)', /\bsk-[A-Za-z0-9]{20,}\b/),
  signature(
    'GitLab personal access token (glpat-…)',
    /\bglpat-[A-Za-z0-9_-]{20,}\b/
  ),
  signature(
    'SendGrid API key (SG.…)',
    /\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/
  ),
  signature('Google API key (AIza…)', /\bAIza[A-Za-z0-9_-]{35}\b/),
  signature(
    'JSON Web Token (eyJ…)',
    /(?<![A-Za-z0-9_-])eyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/
  ),
  signature('private key block (PEM)', PRIVATE_KEY_BLOCK),
]);

const JVM_SINK =
  /System\.(?:out|err)\.(?:println|print|printf|format)\s{0,16}\(|\b(?:log|logger)\.(?:info|warn|error|debug|trace|fatal)\s{0,16}\(|\bprintln\s{0,16}\(|throw\s{1,16}new\s{1,16}\w{0,64}(?:Exception|Error)/;

const C_SINK =
  /\b(?:printf|fprintf|sprintf|snprintf|puts|fputs|perror)\s{0,16}\(/;

const SINKS: Partial<Record<LanguageId, RegExp>> = {
  javascript:
    /\b(?:console\.(?:log|info|warn|error|debug)|logger\.(?:info|warn|error|debug|trace)|res\.(?:send|json|write)|response\.(?:send|json)|throw\s{1,16}new\s{1,16}\w{0,64}Error|new\s{1,16}Error)\s{0,16}\(/,
  python:
    /\bprint\s{0,16}\(|\b(?:logging|logger)\.(?:info|warning|error|debug|critical|exception)\s{0,16}\(|\braise\s{1,16}\w{0,64}(?:Error|Exception)/,
  ruby: /(?:^|[;{(])\s{0,16}(?:puts|print|pp?)\b|(?:Rails\.)?logger\.(?:info|warn|error|debug|fatal)\s{0,16}\(|(?:^|[;{(])\s{0,16}raise\b/,
  php: /(?:^|[;{])\s{0,16}(?:echo|print)\b|\bprintf\s{0,16}\(|\bvar_dump\s{0,16}\(|\berror_log\s{0,16}\(|throw\s{1,16}new\s{1,16}\w{0,64}(?:Exception|Error)/,
  java: JVM_SINK,
  kotlin: JVM_SINK,
  go: /\bfmt\.(?:Print|Printf|Println|Sprint|Sprintf|Sprintln|Fprint\w{0,8})\s{0,16}\(|\blog\.(?:Print|Printf|Println|Fatal\w{0,8}|Panic\w{0,8})\s{0,16}\(|\bslog\.(?:Info|Warn|Error|Debug)\s{0,16}\(|\bpanic\s{0,16}\(/,
  rust: /\b(?:println|print|eprintln|eprint)\s{0,16}!|\b(?:log|tracing)::(?:info|warn|error|debug|trace)\s{0,16}!|\bpanic\s{0,16}!/,
  c: C_SINK,
  cpp: /\b(?:printf|fprintf|sprintf|snprintf|puts|fputs|perror)\s{0,16}\(|\b(?:std::)?(?:cout|cerr|clog)\b\s{0,16}<</,
  csharp:
    /\bConsole\.(?:Write|WriteLine)\s{0,16}\(|\bConsole\.Error\.(?:Write|WriteLine)\s{0,16}\(|\b_?[Ll]ogger\.(?:LogInformation|LogWarning|LogError|LogDebug|LogTrace|LogCritical)\s{0,16}\(|throw\s{1,16}new\s{1,16}\w{0,64}Exception/,
};

/** Every pattern ends with its quoted default: the quote as group 1 and the literal as group 2 */
const ENV_FALLBACKS: Partial<Record<LanguageId, readonly RegExp[]>> =
  deepFreeze({
    javascript: [
      /(?:process\.env\.\w{1,64}|import\.meta\.env\.\w{1,64})\s{0,16}(?:\?\?|\|\|)\s{0,16}(['"`])([^'"`]{8,512})\1/,
    ],
    python: [
      /\bos\.(?:getenv|environ\.get)\s{0,16}\(\s{0,16}['"]\w{1,64}['"]\s{0,16},\s{0,16}(['"])([^'"]{8,512})\1/,
      /\bos\.(?:getenv\s{0,16}\([^)]{0,200}\)|environ\s{0,16}\[\s{0,16}['"]\w{1,64}['"]\s{0,16}\])\s{1,16}or\s{1,16}(['"])([^'"]{8,512})\1/,
    ],
    ruby: [
      /\bENV\s{0,16}\[\s{0,16}['"]\w{1,64}['"]\s{0,16}\]\s{0,16}\|\|\s{0,16}(['"])([^'"]{8,512})\1/,
      /\bENV\.fetch\s{0,16}\(\s{0,16}['"]\w{1,64}['"]\s{0,16},\s{0,16}(['"])([^'"]{8,512})\1/,
    ],
    php: [
      /\bgetenv\s{0,16}\(\s{0,16}['"]\w{1,64}['"]\s{0,16}\)\s{0,16}\?:\s{0,16}(['"])([^'"]{8,512})\1/,
      /\$_(?:ENV|SERVER)\s{0,16}\[\s{0,16}['"]\w{1,64}['"]\s{0,16}\]\s{0,16}\?\?\s{0,16}(['"])([^'"]{8,512})\1/,
    ],
    java: [
      /System\.getenv\s{0,16}\([^)]{0,200}\)[^;\n]{0,120}\.orElse\s{0,16}\(\s{0,16}(['"])([^'"]{8,512})\1/,
    ],
    kotlin: [
      /System\.getenv\s{0,16}\([^)]{0,200}\)\s{0,16}\?:\s{0,16}(['"])([^'"]{8,512})\1/,
      /System\.getenv\s{0,16}\([^)]{0,200}\)[^;\n]{0,120}\.orElse\s{0,16}\(\s{0,16}(['"])([^'"]{8,512})\1/,
    ],
    go: [
      /\bcmp\.Or\s{0,16}\(\s{0,16}os\.Getenv\s{0,16}\([^)]{0,200}\)\s{0,16},\s{0,16}(['"])([^'"]{8,512})\1/,
    ],
    rust: [
      /\benv::var\w{0,8}\s{0,16}\([^)]{0,200}\)[^;\n]{0,120}\.unwrap_or(?:_else)?\s{0,16}\([^"'\n]{0,40}(['"])([^'"]{8,512})\1/,
    ],
    csharp: [
      /\bEnvironment\.GetEnvironmentVariable\s{0,16}\([^)]{0,200}\)\s{0,16}\?\?\s{0,16}(['"])([^'"]{8,512})\1/,
    ],
  });

export const sinkOf = (language: LanguageId): RegExp | null =>
  SINKS[language] ?? null;

export const envFallbacksOf = (language: LanguageId): readonly RegExp[] =>
  ENV_FALLBACKS[language] ?? [];

export const isPlaceholder = (value: string): boolean =>
  PLACEHOLDER.test(value);

/** The kind of connection string that proves a credential most strongly, among the kinds the items earn */
export const strongestConnection = <Item>(
  items: Iterable<Item>,
  kindOf: (item: Item) => ConnectionKind | null
): ConnectionKind | null => {
  let strongest: ConnectionKind | null = null;

  for (const item of items) {
    const kind = kindOf(item);

    if (kind === 'remote') return kind;
    if (kind === null) continue;
    if (
      strongest === null ||
      CONNECTION_RANKS[kind] > CONNECTION_RANKS[strongest]
    )
      strongest = kind;
  }

  return strongest;
};

const hostOf = (authority: string): string => {
  const address = authority.slice(authority.lastIndexOf('@') + 1).toLowerCase();

  if (address.startsWith('[')) {
    const end = address.indexOf(']');

    return end === -1 ? address : address.slice(1, end);
  }

  const end = address.search(HOST_END);

  return end === -1 ? address : address.slice(0, end);
};

/** A loopback or unspecified address, Docker's host machine, or a single-label name such as a Docker Compose service */
const isLocalHost = (host: string): boolean =>
  LOCAL_HOSTS.has(host) || LOOPBACK_IPV4.test(host) || SINGLE_LABEL.test(host);

const connectionOf = ([
  ,
  password,
  authority,
]: RegExpExecArray): ConnectionKind | null => {
  if (password.startsWith('$') || isPlaceholder(password)) return null;
  if (isLocalHost(hostOf(authority))) return 'local';

  return EXAMPLE_PASSWORD.test(password) ? 'example' : 'remote';
};

/** The strongest connection string on the line: a password toward a remote host, then one toward a local host, then the word a documented example writes where the password goes */
export const connectionKindOf = (line: string): ConnectionKind | null =>
  line.includes(SCHEME_SEPARATOR)
    ? strongestConnection(line.matchAll(CONNECTION_STRING), connectionOf)
    : null;

/** A password a connection string on the line carries is proven toward a remote host, and unconfirmed toward a local one or as the word an example uses */
export const connectionCredentialOf = (line: string): EvidenceTier | null => {
  const kind = connectionKindOf(line);

  return kind === null ? null : CONNECTION_TIERS[kind];
};
