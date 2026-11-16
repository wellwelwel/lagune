import type { TrackingMap } from '../../../src/types/core.js';
import type { Expectation, RunScore } from '../../../tools/detection/score.js';
import { readdir, stat } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { describe, it, strict } from 'poku';
import {
  FIXTURES_PATH,
  readExpectations,
  scoreRun,
} from '../../../tools/detection/score.js';

type ScoreCase = {
  label: string;
  detect: string | null;
  tracking: TrackingMap;
  score: RunScore;
};

const INSTRUCTION_NAMES = new Set([
  'CLAUDE.md',
  'AGENTS.md',
  'GEMINI.md',
  'QWEN.md',
  'SKILL.md',
  'copilot-instructions.md',
  '.cursorrules',
  '.windsurfrules',
  '.clinerules',
  '.claude',
  '.cursor',
  '.agents',
  '.github',
  '.gemini',
  '.qwen',
  '.windsurf',
]);

const expectation: Expectation = {
  fixture: 'notes-board',
  specialization: 'browser',
  file: 'public/share.js',
};

const detectApplying = (specialization: string) =>
  [
    '# Notes Board Detect Map',
    '',
    '- **Scope:** a full project scan',
    '- **Mapped:** 2026-11-15',
    '',
    '## Findings',
    '',
    '### Shared board banner',
    '',
    '- **What it is:** The page shows who shared the board.',
    '- **Why it matters:** The name comes from the link.',
    '- **Evidence:** the banner on the board page.',
    '',
    '## Applied specializations',
    '',
    `- **${specialization}**: the banner under "Shared board banner"`,
    '',
  ].join('\n');

const tracked = (...paths: string[]): TrackingMap => ({
  entries: [{ name: 'Shared board banner', paths }],
});

const SCORE_CASES: ScoreCase[] = [
  {
    label:
      'a run that applied the specialization and tracked the expected file',
    detect: detectApplying('browser'),
    tracking: tracked('public/share.js'),
    score: { applied: true, covered: true },
  },
  {
    label: 'the expected file tracked with a leading dot segment',
    detect: detectApplying('browser'),
    tracking: tracked('./public/share.js'),
    score: { applied: true, covered: true },
  },
  {
    label: 'the expected file tracked with Windows separators',
    detect: detectApplying('browser'),
    tracking: tracked('public\\share.js'),
    score: { applied: true, covered: true },
  },
  {
    label: 'a run that applied another specialization and tracked another file',
    detect: detectApplying('javascript'),
    tracking: tracked('public/board.js'),
    score: { applied: false, covered: false },
  },
  {
    label: 'a run that wrote no detect map',
    detect: null,
    tracking: { entries: [] },
    score: { applied: false, covered: false },
  },
];

const isFile = async (path: string) =>
  (await stat(path).catch(() => undefined))?.isFile() ?? false;

const filesUnder = async (folder: string) =>
  (await readdir(folder, { recursive: true })).map((entry) =>
    join(folder, entry)
  );

describe('scoring a detect run against its expectation', () => {
  for (const scoreCase of SCORE_CASES)
    it(scoreCase.label, () => {
      strict.deepStrictEqual(
        scoreRun(expectation, scoreCase.detect, scoreCase.tracking),
        scoreCase.score
      );
    });
});

describe('the detection fixtures', async () => {
  const expectations = await readExpectations();
  const fixtures = (await readdir(FIXTURES_PATH)).filter(
    (name) => !name.startsWith('.')
  );

  it('pair every fixture folder with one expectation', () => {
    const expected = expectations.map((entry) => entry.fixture).toSorted();

    strict.deepStrictEqual(fixtures.toSorted(), expected);
  });

  it('keep every expected file inside its fixture', async () => {
    const missing: string[] = [];

    for (const entry of expectations)
      if (!(await isFile(join(FIXTURES_PATH, entry.fixture, entry.file))))
        missing.push(`${entry.fixture}/${entry.file}`);

    strict.deepStrictEqual(missing, []);
  });

  it('hold no instruction file an agent could load', async () => {
    const files = await filesUnder(FIXTURES_PATH);
    const instructions = files.filter((file) =>
      INSTRUCTION_NAMES.has(basename(file))
    );

    strict.deepStrictEqual(instructions, []);
  });
});
