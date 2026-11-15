import type { SpecializationPhase } from '../../../src/types/catalog.js';
import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { BUILTIN_SPECIALIZATIONS } from '../../../src/catalog/builtin.js';
import { tailorSpecialization } from '../../../src/catalog/reading.js';

const packageRoot = new URL('../../../', import.meta.url);

const OPENING = `# GraphQL vulnerabilities

> - This knowledge extends your judgment. Apply what fits the project and keep reasoning beyond the list.
`;
const SOURCE = '> - Source: OWASP, <https://cheatsheetseries.owasp.org/>.\n';
const KNOWLEDGE = `
## Rules

- This specialization audits and explains.
- By default, it never rewrites your code.

## What to look for

### Unbounded queries

A deeply nested query exhausts the server.

Safer shape: cap the depth.
`;
const GUIDANCE = '\n## How to act on the result\n\n';
const DETECT =
  '- **In detect (detection):** each unbounded query is a finding.\n';
const VERIFY =
  '- **In verify (proof):** the control holds only when the depth is capped.\n';
const BODY = `${KNOWLEDGE}${GUIDANCE}`;
const AUTHORED = `${OPENING}${SOURCE}${BODY}${DETECT}${VERIFY}`;
const NO_PHASE = undefined;
const READINGS: [string, SpecializationPhase | undefined, string][] = [
  [
    'leaves out the source credit and the guidance of every phase when no phase reads it',
    NO_PHASE,
    `${OPENING}${KNOWLEDGE}`,
  ],
  [
    'keeps only the detect guidance for detect',
    'detect',
    `${OPENING}${BODY}${DETECT}`,
  ],
  [
    'keeps only the verify guidance for verify',
    'verify',
    `${OPENING}${BODY}${VERIFY}`,
  ],
];
const READERS: (SpecializationPhase | undefined)[] = [
  NO_PHASE,
  'detect',
  'verify',
];
const UNRECOGNIZED: [string, string][] = [
  ['an empty file', ''],
  ['a file of blank lines', '\n\n'],
  ['binary noise', '\u0000\uFFFD> \uFFFD## \u0001\n\uFFFD- **In \u0000'],
  [
    'a file with old Mac line endings, which leave it a single line',
    AUTHORED.replaceAll('\n', '\r'),
  ],
  [
    'guidance under leads it does not know',
    `${OPENING}${BODY}- **Detect:** each unbounded query.\n- **Verify:** the depth is capped.\n`,
  ],
];
const TOLERATED: [string, string, SpecializationPhase | undefined, string][] = [
  [
    'is cut before its last line ends',
    `${OPENING}${BODY}${DETECT}- **In verify (pro`,
    'verify',
    `${OPENING}${BODY}- **In verify (pro`,
  ],
  [
    'has no newline at its end',
    `${OPENING}${BODY}${VERIFY}${DETECT}`.slice(0, -1),
    'verify',
    `${OPENING}${BODY}${VERIFY}`.slice(0, -1),
  ],
  [
    'marks its items with another bullet',
    `${OPENING}${BODY}* **In detect (detection):** a finding.\n* **In verify (proof):** it holds.\n`,
    'detect',
    `${OPENING}${BODY}* **In detect (detection):** a finding.\n`,
  ],
  [
    'writes the guidance heading in another case',
    `${OPENING}${KNOWLEDGE}\n## HOW TO ACT ON THE RESULT\n\n${DETECT}${VERIFY}`,
    'detect',
    `${OPENING}${KNOWLEDGE}\n## HOW TO ACT ON THE RESULT\n\n${DETECT}`,
  ],
  [
    'opens with a byte order mark',
    `\uFEFF${AUTHORED}`,
    'detect',
    `\uFEFF${OPENING}${BODY}${DETECT}`,
  ],
];
const MAY_DROP =
  /^(?:\s*|> - Source:.*|## How to act on the result|- \*\*In (?:detect|verify).*|[ \t].*)$/;

/** Every file a text becomes when it is cut short at the end of one of its lines */
const cutShort = (text: string): string[] => {
  const lines = text.split('\n');

  return lines.map((_line, length) => lines.slice(0, length).join('\n'));
};

/** The lines a read left out of a text, or nothing when the read is not that text with lines left out */
const leftOut = (text: string, read: string): string[] | undefined => {
  const kept = read.split('\n');
  const dropped: string[] = [];
  let cursor = 0;

  for (const line of text.split('\n'))
    if (kept[cursor] === line) cursor += 1;
    else dropped.push(line);

  return cursor === kept.length ? dropped : undefined;
};

const dropsOnlyWhatItMay = (
  text: string,
  reader: SpecializationPhase | undefined
): boolean =>
  leftOut(text, tailorSpecialization(text, reader))?.every((line) =>
    MAY_DROP.test(line)
  ) === true;

describe('a specialization is read as its reader needs it', () => {
  for (const [promise, phase, expected] of READINGS)
    it(promise, () => {
      strict.strictEqual(tailorSpecialization(AUTHORED, phase), expected);
    });
});

describe('the source credit a read leaves out', () => {
  it('goes with the lines it wraps onto', () => {
    const wrapped =
      '> - Source: OWASP,\n>   <https://cheatsheetseries.owasp.org/>.\n';

    strict.strictEqual(
      tailorSpecialization(`${OPENING}${wrapped}${BODY}${DETECT}`, 'detect'),
      `${OPENING}${BODY}${DETECT}`
    );
  });

  it('leaves no gap behind when the opening quote held nothing else', () => {
    strict.strictEqual(
      tailorSpecialization(`# GraphQL\n\n${SOURCE}${KNOWLEDGE}`, NO_PHASE),
      `# GraphQL\n${KNOWLEDGE}`
    );
  });

  it('is only the one in the opening quote, never a quoted line of the knowledge', () => {
    const quoting = `${OPENING}${KNOWLEDGE}\n${SOURCE}`;

    strict.strictEqual(tailorSpecialization(quoting, NO_PHASE), quoting);
  });
});

describe('the guidance addressed to a phase', () => {
  it('drops the lines nested under another phase and keeps its own', () => {
    const nested = `${VERIFY}  1. the depth is capped.\n  2. the cost is capped.\n\n  A passing test is supporting evidence only.\n`;
    const authored = `${OPENING}${BODY}${DETECT}${nested}`;

    strict.strictEqual(
      tailorSpecialization(authored, 'detect'),
      `${OPENING}${BODY}${DETECT}`
    );
    strict.strictEqual(
      tailorSpecialization(authored, 'verify'),
      `${OPENING}${BODY}${nested}`
    );
  });

  it('leaves one blank line where another phase sat between two', () => {
    const shared = '- Report what the code cannot show.\n';
    const authored = `${OPENING}${BODY}${DETECT}\n${VERIFY}\n${shared}`;

    strict.strictEqual(
      tailorSpecialization(authored, 'detect'),
      `${OPENING}${BODY}${DETECT}\n${shared}`
    );
    strict.strictEqual(
      tailorSpecialization(authored, 'verify'),
      `${OPENING}${BODY}${VERIFY}\n${shared}`
    );
  });

  it('keeps the paragraph that follows another phase', () => {
    const closing = '\nReport what the code cannot show.\n';
    const authored = `${OPENING}${BODY}${DETECT}${VERIFY}${closing}`;

    strict.strictEqual(
      tailorSpecialization(authored, 'detect'),
      `${OPENING}${BODY}${DETECT}${closing}`
    );
  });

  it('keeps what addresses no phase, whoever reads it', () => {
    const shared = '- **In every case:** report what the code cannot show.\n';
    const authored = `${OPENING}${BODY}${shared}${DETECT}`;

    strict.strictEqual(
      tailorSpecialization(authored, 'verify'),
      `${OPENING}${BODY}${shared}`
    );
    strict.strictEqual(
      tailorSpecialization(authored, NO_PHASE),
      `${OPENING}${BODY}${shared}`
    );
  });

  it('takes its whole section along when nothing in it is left for the reader', () => {
    const later = '\n## References\n\n- The GraphQL specification.\n';

    strict.strictEqual(
      tailorSpecialization(`${OPENING}${BODY}${DETECT}`, 'verify'),
      `${OPENING}${KNOWLEDGE}`
    );
    strict.strictEqual(
      tailorSpecialization(`${OPENING}${BODY}${DETECT}${later}`, 'verify'),
      `${OPENING}${KNOWLEDGE}${later}`
    );
  });

  it('is tailored only under its own heading', () => {
    const lookFor = `${OPENING}\n## What to look for\n\n${VERIFY}`;
    const later = `\n## References\n\n${VERIFY}`;

    strict.strictEqual(
      tailorSpecialization(
        `${lookFor}${GUIDANCE}${DETECT}${VERIFY}${later}`,
        'detect'
      ),
      `${lookFor}${GUIDANCE}${DETECT}${later}`
    );
  });

  it('reads whole a specialization that carries none', () => {
    const authored = `${OPENING}${KNOWLEDGE}`;

    strict.strictEqual(tailorSpecialization(authored, 'detect'), authored);
  });

  it('is read the same from a file with Windows line endings', () => {
    const windows = (text: string): string => text.replaceAll('\n', '\r\n');

    strict.strictEqual(
      tailorSpecialization(windows(AUTHORED), 'detect'),
      windows(`${OPENING}${BODY}${DETECT}`)
    );
  });

  it('survives a crafted file that repeats another phase without end', () => {
    const flood = VERIFY.repeat(50_000);

    strict.strictEqual(
      tailorSpecialization(`${OPENING}${BODY}${flood}${DETECT}`, 'detect'),
      `${OPENING}${BODY}${DETECT}`
    );
  });
});

describe('a file the read cannot make sense of', () => {
  for (const [label, broken] of UNRECOGNIZED)
    it(`prints ${label} as it is, whoever reads it`, () => {
      strict.deepStrictEqual(
        READERS.map((reader) => tailorSpecialization(broken, reader)),
        [broken, broken, broken]
      );
    });

  for (const [label, broken, reader, expected] of TOLERATED)
    it(`still serves its reader when the file ${label}`, () => {
      strict.strictEqual(tailorSpecialization(broken, reader), expected);
    });
});

await describe('a built-in whose file is cut short', async () => {
  const builtins = await Promise.all(
    BUILTIN_SPECIALIZATIONS.map(async ({ name }) => ({
      name,
      text: await readFile(new URL(`catalog/${name}.md`, packageRoot), 'utf8'),
    }))
  );

  it('loses nothing but its source credit and phase guidance, wherever the cut lands', () => {
    const overcut = builtins.flatMap(({ name, text }) =>
      cutShort(text).flatMap((cut, length) =>
        READERS.filter((reader) => !dropsOnlyWhatItMay(cut, reader)).map(
          (reader) =>
            `${name} cut at line ${length}, read by ${reader ?? 'no phase'}`
        )
      )
    );

    strict.deepStrictEqual(overcut, []);
  });
});
