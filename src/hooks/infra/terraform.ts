const OPEN_CIDR =
  /(?:cidr_blocks?|cidr_ipv4|cidr_ipv6)\s{0,16}=\s{0,16}\[?\s{0,16}["'](?:0\.0\.0\.0\/0|::\/0)["']|["']::\/0["']/;

const SENSITIVE_PORTS = [
  22, 23, 25, 135, 139, 445, 1433, 1521, 2049, 2375, 2376, 27017, 3306, 3389,
  5432, 5601, 5984, 6379, 7001, 8020, 9000, 9042, 9200, 9300, 11211,
];

const PORT_ASSIGNMENT =
  /\b(?:from_port|to_port|port)\s{0,16}=\s{0,16}(\d{1,5})\b/g;

/** Protocol "-1" stands for all protocols, opening every port at once */
const OPEN_PROTOCOL = /\b(?:protocol|ip_protocol)\s{0,16}=\s{0,16}["']-1["']/;

const stripBlockComments = (content: string): string => {
  const kept: string[] = [];
  let cursor = 0;

  while (cursor < content.length) {
    const open = content.indexOf('/*', cursor);
    const close = open === -1 ? -1 : content.indexOf('*/', open + 2);

    if (close === -1) break;

    kept.push(content.slice(cursor, open));
    cursor = close + 2;
  }

  kept.push(content.slice(cursor));

  return kept.join(' ');
};

/** Strips HCL comments so braces inside them do not corrupt block matching */
const stripHclComments = (content: string): string =>
  stripBlockComments(content)
    .split('\n')
    .map((line) => line.replace(/#[^\n]*/, '').replace(/(^|[^:])\/\/.*/, '$1'))
    .join('\n');

const balancedSpan = (
  text: string,
  openIndex: number,
  open: string,
  close: string
): string | null => {
  let depth = 0;
  const limit = Math.min(text.length, openIndex + 20000);

  for (let index = openIndex; index < limit; index += 1) {
    if (text[index] === open) depth += 1;
    else if (text[index] === close) {
      depth -= 1;

      if (depth === 0) return text.slice(openIndex, index + 1);
    }
  }

  return null;
};

const topLevelObjects = (list: string): string[] => {
  const objects: string[] = [];
  let index = 0;

  while (index < list.length) {
    if (list[index] !== '{') {
      index += 1;
      continue;
    }

    const object = balancedSpan(list, index, '{', '}');

    if (object === null) break;

    objects.push(object);
    index += object.length;
  }

  return objects;
};

const INGRESS_OPENER =
  /(?:\bingress\b\s{0,16}=?\s{0,16}|dynamic\s{1,16}"ingress"\s{0,16}|"ingress"\s{0,16}:\s{0,16})([{[])/g;

/** Egress blocks are never extracted, so a safe-port CIDR and a sensitive port in separate blocks cannot combine into a false positive */
const ingressRuleBodies = (content: string): string[] => {
  const stripped = stripHclComments(content);

  return [...stripped.matchAll(INGRESS_OPENER)].flatMap((match) => {
    const open = match[1];
    const start = match.index + match[0].length - 1;
    const block = balancedSpan(stripped, start, open, open === '{' ? '}' : ']');

    if (block === null) return [];

    return open === '[' ? topLevelObjects(block) : [block];
  });
};

const namesSensitivePort = (body: string): boolean =>
  [...body.matchAll(PORT_ASSIGNMENT)].some((match) =>
    SENSITIVE_PORTS.includes(Number(match[1]))
  );

const coversSensitivePort = (body: string): boolean => {
  if (namesSensitivePort(body) || OPEN_PROTOCOL.test(body)) return true;

  const from = /\bfrom_port\s{0,16}=\s{0,16}(\d{1,5})/.exec(body);
  const to = /\bto_port\s{0,16}=\s{0,16}(\d{1,5})/.exec(body);

  if (from === null || to === null) return false;

  const low = Number(from[1]);
  const high = Number(to[1]);

  return SENSITIVE_PORTS.some((port) => low <= port && port <= high);
};

export const hasPublicIngress = (content: string): boolean =>
  ingressRuleBodies(content).some(
    (body) => OPEN_CIDR.test(body) && coversSensitivePort(body)
  );

const IAM_WILDCARD_LINE = [
  /^[ \t]*actions\s*=\s*\[\s*["']\*["']/im,
  /^[ \t]*resources\s*=\s*\[\s*["']\*["']/im,
  /["']Action["']\s{0,16}:\s{0,16}\[?\s{0,16}["']\*["']/i,
  /["']Resource["']\s{0,16}:\s{0,16}\[?\s{0,16}["']\*["']/i,
  /["']Principal["']\s{0,16}:\s{0,16}\[?\s{0,16}["']\*["']/i,
  /\bidentifiers\s{0,16}=\s{0,16}\[\s{0,16}["']\*["']/im,
];

const DENY =
  /\beffect\s{0,16}=\s{0,16}["']?Deny|["']Effect["']\s{0,16}:\s{0,16}["']Deny/i;

export const hasIamWildcard = (content: string): boolean => {
  const lines = content.split('\n');

  return lines.some((line, index) => {
    if (!IAM_WILDCARD_LINE.some((rule) => rule.test(line))) return false;

    const window = lines
      .slice(Math.max(0, index - 10), Math.min(lines.length, index + 11))
      .join('\n');

    // A wildcard inside a Deny statement is a guardrail, the opposite of an over-grant.
    return !DENY.test(window);
  });
};

export const hasUnpinnedModule = (content: string): boolean =>
  content
    .split('\n')
    .some(
      (line) =>
        /\bsource\s{0,16}=\s{0,16}"(?:(?:git::|git@|github\.com\/|bitbucket\.org\/)|https:\/\/(?=[^"]{0,500}\.git))[^"]{0,500}"/i.test(
          line
        ) && !/\?ref=[0-9a-f]{6,40}\b/i.test(line)
    );

const SECRET_IN_DATA =
  /^[ \t]*[\w-]{0,64}(?:password|secret|token|api_key|access_key|client_secret|private_key)[ \t]*=[ \t]*"(?!\$\{)[^"]{6,4096}"/im;

export const hasSecretInData = (content: string): boolean =>
  SECRET_IN_DATA.test(content);
