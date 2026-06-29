const hextet = /^[0-9a-fA-F]{1,4}$/;

const ipv4Octet = /^(0|[1-9]\d{0,2})$/;

const parseIPv4Tail = (text: string): number | null => {
  const octets = text.split('.');

  if (octets.length !== 4) return null;

  let value = 0;

  for (const octet of octets) {
    if (!ipv4Octet.test(octet)) return null;

    const part = Number.parseInt(octet, 10);

    if (part > 0xff) return null;

    value = value * 0x100 + part;
  }

  return value >>> 0;
};

const parseGroups = (text: string): number[] | null => {
  if (text === '') return [];

  const groups: number[] = [];

  for (const group of text.split(':')) {
    if (!hextet.test(group)) return null;

    groups.push(Number.parseInt(group, 16));
  }

  return groups;
};

const stripBrackets = (host: string): string | null => {
  const open = host.startsWith('[');
  const close = host.endsWith(']');

  if (open && close) return host.slice(1, -1);
  if (open || close) return null;

  return host;
};

export const normalizeIPv6 = (host: string): number[] | null => {
  const unbracketed = stripBrackets(host);

  if (unbracketed === null) return null;

  const zoneIndex = unbracketed.indexOf('%');
  const body = zoneIndex === -1 ? unbracketed : unbracketed.slice(0, zoneIndex);

  if (body.split('::').length > 2) return null;

  const lastColon = body.lastIndexOf(':');
  const lastGroup = lastColon === -1 ? body : body.slice(lastColon + 1);
  const hasIPv4Tail = lastGroup.includes('.');

  let tailHextets: number[] = [];
  let scanned = body;

  if (hasIPv4Tail) {
    const ipv4 = parseIPv4Tail(lastGroup);

    if (ipv4 === null) return null;

    tailHextets = [(ipv4 >>> 16) & 0xffff, ipv4 & 0xffff];
    scanned = body.slice(0, lastColon);
  }

  const [head, tail, extra] = scanned.split('::');

  if (extra !== undefined) return null;

  if (tail === undefined) {
    const groups = parseGroups(head);

    if (groups === null) return null;

    const all = [...groups, ...tailHextets];

    return all.length === 8 ? all : null;
  }

  const headGroups = parseGroups(head);
  const tailGroups = parseGroups(tail);

  if (headGroups === null || tailGroups === null) return null;

  const present = headGroups.length + tailGroups.length + tailHextets.length;

  if (present > 7) return null;

  const fill = new Array<number>(8 - present).fill(0);

  return [...headGroups, ...fill, ...tailGroups, ...tailHextets];
};
