const EVENT_EXPRESSION = /\$\{\{\s{0,16}github\.event\.([^}]{0,400})\}\}/gi;

const UNTRUSTED_EVENT_FIELD =
  /title|body|message|name|email|label|ref|head_ref|comment|description|author|default_branch/i;

/** Scoped to `run:` bodies, so GitHub's own mitigation (a `github.event` value mapped into `env:` and read as `$VAR`) is not flagged */
const runStepBodies = (content: string): string[] => {
  const lines = content.split('\n');
  const bodies: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const match = /^(\s*)(?:-\s{0,4})?run\s{0,16}:(.*)$/.exec(lines[index]);

    if (match === null) continue;

    const indent = match[1].length;
    const inline = match[2].trim();

    if (inline !== '' && !/^[|>]/.test(inline)) {
      bodies.push(inline);
      continue;
    }

    let body = '';

    for (let next = index + 1; next < lines.length; next += 1) {
      if (lines[next].trim() === '') continue;
      if (lines[next].search(/\S/) <= indent) break;

      body += `${lines[next]}\n`;
    }

    bodies.push(body);
  }

  return bodies;
};

const interpolatesUntrustedField = (body: string): boolean =>
  [...body.matchAll(EVENT_EXPRESSION)].some((match) =>
    UNTRUSTED_EVENT_FIELD.test(match[1])
  );

export const hasScriptInjection = (content: string): boolean =>
  runStepBodies(content).some(interpolatesUntrustedField);

export const hasUnpinnedUses = (content: string): boolean =>
  content.split('\n').some((line) => {
    const match =
      /^\s*(?:-\s*)?uses\s*:\s*['"]?[\w.-]+\/[\w.-]+@([^\s'"]+)/i.exec(line);

    return match !== null && !/^[0-9a-f]{40}$/i.test(match[1]);
  });
