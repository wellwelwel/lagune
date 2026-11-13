import type {
  CoverageScope,
  DependencyFlag,
  DependencyRead,
  JudgedFile,
} from '../../types/hooks/dependency.js';
import type { ScanReport } from '../../types/scan.js';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { checkerSettings } from '../../core/checkers.js';
import { errorMessage } from '../../core/errors.js';
import { reportOf } from '../../core/scan/driver.js';
import { resolveTargets } from '../../core/scan/targets.js';
import { walkTargets } from '../../core/scan/walk.js';
import { analysisOf } from './analysis.js';
import { uncoveredManifests } from './coverage.js';
import { DEPENDENCY_FILTER, placedReader } from './ecosystems.js';
import { cannotJudge } from './text.js';

const BYTE_ORDER_MARK = '\uFEFF';

const NO_LOCKFILE: DependencyFlag = { verdict: 'no-lockfile', name: null };

const readText = async (root: string, file: string): Promise<string> => {
  let content: string;

  try {
    content = await readFile(join(root, file), 'utf8');
  } catch (error) {
    throw cannotJudge(file, `cannot be read (${errorMessage(error)})`);
  }

  return content.startsWith(BYTE_ORDER_MARK) ? content.slice(1) : content;
};

const readPlaced = async (
  root: string,
  file: string,
  present: ReadonlySet<string>
): Promise<DependencyRead> => {
  const placed = placedReader(file, (other) => present.has(other));

  if (placed === null)
    throw new Error(`${file} is not a dependency file the checker reads.`);

  return placed.reader(file, await readText(root, file));
};

/** Judges the files in the order the walk found them, once every one is read, failing on the first it cannot judge */
const judgedFiles = async (
  root: string,
  files: readonly string[],
  present: ReadonlySet<string>
): Promise<JudgedFile[]> => {
  const placed = files.flatMap((file) => {
    const found = placedReader(file, (other) => present.has(other));

    return found === null ? [] : [{ file, ...found }];
  });
  const contents = await Promise.all(
    placed.map(({ file }) => readText(root, file))
  );

  return placed.map(({ file, ecosystem, reader }, index) => ({
    file,
    ecosystem,
    read: reader(file, contents[index]),
  }));
};

const foldersOf = (files: ReadonlySet<string>): Map<string, string[]> => {
  const folders = new Map<string, string[]>();

  for (const file of files) {
    const folder = dirname(file);
    const listed = folders.get(folder) ?? [];

    listed.push(file);
    folders.set(folder, listed);
  }

  return folders;
};

/** The whole project's dependency files, reading one outside the scanned targets only when a judgment across files needs it */
const coverageScope = (
  root: string,
  present: ReadonlySet<string>,
  judged: readonly JudgedFile[]
): CoverageScope => {
  const folders = foldersOf(present);
  const reads = new Map(
    judged.map(({ file, read }) => [file, Promise.resolve(read)])
  );

  return {
    has: (file) => present.has(file),
    filesIn: (folder) => folders.get(folder) ?? [],
    textAt: (file) => readText(root, file),
    readAt: (file) => {
      const known = reads.get(file);

      if (known !== undefined) return known;

      const pending = readPlaced(root, file, present);

      reads.set(file, pending);

      return pending;
    },
  };
};

/** Scans the targets' dependency files, judging whether a lockfile covers each manifest across the whole project */
export const scanDependencies = async (
  root: string,
  targets: string[]
): Promise<ScanReport> => {
  const settings = await checkerSettings(root, 'dependency');
  const scanned = await walkTargets(
    root,
    await resolveTargets(root, targets),
    DEPENDENCY_FILTER,
    settings
  );
  const project =
    targets.length === 0
      ? scanned
      : await walkTargets(
          root,
          await resolveTargets(root, []),
          DEPENDENCY_FILTER,
          settings
        );
  const present = new Set([...scanned.files, ...project.files]);
  const judged = await judgedFiles(root, scanned.files, present);
  const scope = coverageScope(root, present, judged);
  const [uncovered, beside] = await Promise.all([
    uncoveredManifests(judged, scope),
    Promise.all(
      judged.map(
        ({ file, ecosystem }) => ecosystem.flagsBeside?.(file, scope) ?? []
      )
    ),
  ]);
  const analyzed = judged.map(({ file, read }, index) => ({
    file,
    analysis: analysisOf([
      ...read.flags,
      ...beside[index],
      ...(uncovered.has(file) ? [NO_LOCKFILE] : []),
    ]),
  }));

  return reportOf(analyzed, scanned.skipped);
};
