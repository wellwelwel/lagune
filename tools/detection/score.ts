import type { TrackingMap } from '../../src/types/core.js';
import { readFile, stat } from 'node:fs/promises';
import { join, posix, resolve } from 'node:path';
import process, { argv } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isString, readField } from '../../src/core/collections.js';
import {
  APPLIED_HEADINGS,
  appliedEntry,
} from '../../src/core/markdown/applied.js';
import { sectionBullets } from '../../src/core/markdown/sections.js';
import { readStateFile } from '../../src/core/state-file.js';
import { loadTrackingMap } from '../../src/core/tracking.js';

export type Expectation = {
  fixture: string;
  specialization: string;
  file: string;
};

export type RunScore = {
  applied: boolean;
  covered: boolean;
};

type Row = Expectation & { score: RunScore | undefined };

const REPOSITORY = fileURLToPath(new URL('../../', import.meta.url));
const DEFAULT_RUNS = join(REPOSITORY, 'temp/detection');
const DETECT_PATH = '.lagune/memory/detect.md';

export const EXPECTATIONS_PATH = join(
  REPOSITORY,
  'test/detection/expectations.json'
);
export const FIXTURES_PATH = join(REPOSITORY, 'test/detection/fixtures');

const toExpectation = (value: unknown, index: number): Expectation => {
  const fixture = readField(value, 'fixture');
  const specialization = readField(value, 'specialization');
  const file = readField(value, 'file');

  if (!isString(fixture) || !isString(specialization) || !isString(file))
    throw new Error(
      `Expectation ${index + 1} in ${EXPECTATIONS_PATH} needs \`fixture\`, \`specialization\`, and \`file\` as strings.`
    );

  return { fixture, specialization, file };
};

const parseExpectations = (raw: string): Expectation[] => {
  const list = readField(JSON.parse(raw), 'expectations');

  if (!Array.isArray(list))
    throw new Error(`${EXPECTATIONS_PATH} needs \`expectations\` as a list.`);

  return list.map(toExpectation);
};

export const readExpectations = async (): Promise<Expectation[]> =>
  parseExpectations(await readFile(EXPECTATIONS_PATH, 'utf8'));

const projectPath = (path: string): string =>
  posix.normalize(path.replaceAll('\\', '/')).replace(/^\.\//, '');

export const appliedSpecializations = (detect: string): string[] =>
  APPLIED_HEADINGS.flatMap((heading) => sectionBullets(detect, heading))
    .map(appliedEntry)
    .flatMap((entry) => (entry === undefined ? [] : [entry.name]));

export const scoreRun = (
  expectation: Expectation,
  detect: string | null,
  tracking: TrackingMap
): RunScore => {
  const expected = projectPath(expectation.file);

  return {
    applied:
      detect !== null &&
      appliedSpecializations(detect).includes(expectation.specialization),
    covered: tracking.entries.some((entry) =>
      entry.paths.some((path) => projectPath(path) === expected)
    ),
  };
};

const isFolder = (path: string): Promise<boolean> =>
  stat(path).then(
    (stats) => stats.isDirectory(),
    () => false
  );

const scoreFolder = async (
  runs: string,
  expectation: Expectation
): Promise<Row> => {
  const run = join(runs, expectation.fixture);

  if (!(await isFolder(run))) return { ...expectation, score: undefined };

  const detect = await readStateFile(run, DETECT_PATH);
  const tracking = await loadTrackingMap(run);

  return { ...expectation, score: scoreRun(expectation, detect, tracking) };
};

const verdict = (passed: boolean): string => (passed ? 'yes' : 'no');

const formatTable = (rows: string[][]): string => {
  const widths = rows[0].map((_, column) =>
    Math.max(...rows.map((row) => row[column].length))
  );
  const line = (row: string[]) =>
    `| ${row.map((cell, column) => cell.padEnd(widths[column])).join(' | ')} |`;
  const divider = `| ${widths.map((width) => '-'.repeat(width)).join(' | ')} |`;

  return [line(rows[0]), divider, ...rows.slice(1).map(line)].join('\n');
};

const cellsOf = (row: Row): string[] => [
  row.specialization,
  row.fixture,
  row.score === undefined ? 'not run' : verdict(row.score.applied),
  row.score === undefined ? 'not run' : verdict(row.score.covered),
];

const missed = (row: Row): boolean =>
  row.score !== undefined && !(row.score.applied && row.score.covered);

const run = async () => {
  const runs = resolve(argv[2] ?? DEFAULT_RUNS);
  const expectations = await readExpectations();
  const rows = await Promise.all(
    expectations.map((expectation) => scoreFolder(runs, expectation))
  );

  console.log(
    formatTable([
      ['Specialization', 'Fixture', 'Applied', 'Covered'],
      ...rows.map(cellsOf),
    ])
  );

  if (rows.some(missed)) process.exitCode = 1;
};

if (import.meta.url === pathToFileURL(argv[1] ?? '').href)
  run().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
