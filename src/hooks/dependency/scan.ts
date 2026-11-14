import type { GitEntry } from '../../types/git.js';
import type {
  CoverageScope,
  DependencyFlag,
  DependencyRead,
  JudgedFile,
  ManifestCoverage,
  PlacedReader,
} from '../../types/hooks/dependency.js';
import type { ScanReport } from '../../types/scan.js';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { checkerSettings } from '../../core/checkers.js';
import { deepFreeze } from '../../core/collections.js';
import { errorMessage } from '../../core/errors.js';
import { gitEntryOf, gitIgnoresOf } from '../../core/git/repository.js';
import { reportOf } from '../../core/scan/driver.js';
import { resolveTargets } from '../../core/scan/targets.js';
import { walkTargetsWith } from '../../core/scan/walk.js';
import { analysisOf, unjudgedAnalysis, unknownGitLead } from './analysis.js';
import { coverageOf } from './coverage.js';
import { DEPENDENCY_FILTER, placedReader } from './ecosystems.js';
import { flagsRead } from './read.js';
import { cannotJudge, unjudgedProblem, unlessUnjudged } from './text.js';

const BYTE_ORDER_MARK = '\uFEFF';

const NO_LOCKFILE: DependencyFlag = { verdict: 'no-lockfile', name: null };

const BLANK_READ: DependencyRead = deepFreeze(flagsRead([]));

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

/** Judges one file, keeping one the checker cannot judge as a blank read with its problem instead of stopping the scan */
const judgedFileOf = async (
  root: string,
  file: string,
  { ecosystem, reader }: PlacedReader
): Promise<JudgedFile> => {
  try {
    const read = reader(file, await readText(root, file));

    return { file, ecosystem, read, problem: null };
  } catch (error) {
    const problem = unjudgedProblem(error);

    if (problem === undefined) throw error;

    return { file, ecosystem, read: BLANK_READ, problem };
  }
};

const judgedFiles = (
  root: string,
  files: readonly string[],
  present: ReadonlySet<string>
): Promise<JudgedFile[]> =>
  Promise.all(
    files.flatMap((file) => {
      const placed = placedReader(file, (other) => present.has(other));

      return placed === null ? [] : [judgedFileOf(root, file, placed)];
    })
  );

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

      const pending = unlessUnjudged(
        readPlaced(root, file, present),
        BLANK_READ
      );

      reads.set(file, pending);

      return pending;
    },
  };
};

const resolvedFlags = (
  { file, ecosystem, read, problem }: JudgedFile,
  scope: CoverageScope
): Promise<readonly DependencyFlag[]> =>
  problem === null && ecosystem.resolveBeside !== undefined
    ? unlessUnjudged(
        ecosystem.resolveBeside(file, read.flags, scope),
        read.flags
      )
    : Promise.resolve(read.flags);

/** The manifests whose lockfile coverage waits on a Git state the checker cannot read: every covered one, since Git may ignore its lockfile, and, with no .git at all, every other one, since a workspace root above the project may hold one */
const waitingOnGit = (
  entry: GitEntry,
  { covered, uncovered }: ManifestCoverage
): Set<string> =>
  new Set(entry === 'absent' ? [...covered, ...uncovered] : covered);

/** Scans the targets' dependency files, judging whether a lockfile covers each manifest across the whole project, and gathering under one lead the coverage a Git state it cannot read leaves unconfirmed */
export const scanDependencies = async (
  root: string,
  targets: string[]
): Promise<ScanReport> => {
  const [settings, ignores] = await Promise.all([
    checkerSettings(root, 'dependency'),
    gitIgnoresOf(root),
  ]);
  const scanned = await walkTargetsWith(
    root,
    await resolveTargets(root, targets),
    DEPENDENCY_FILTER,
    settings,
    ignores
  );
  const project =
    targets.length === 0
      ? scanned
      : await walkTargetsWith(
          root,
          await resolveTargets(root, []),
          DEPENDENCY_FILTER,
          settings,
          ignores
        );
  const present = new Set([...scanned.files, ...project.files]);
  const judged = await judgedFiles(root, scanned.files, present);
  const scope = coverageScope(root, present, judged);
  const [coverage, resolved] = await Promise.all([
    coverageOf(judged, scope),
    Promise.all(judged.map((entry) => resolvedFlags(entry, scope))),
  ]);
  const gitEntry =
    settings.gitignore && ignores === null ? await gitEntryOf(root) : null;
  const waiting =
    gitEntry === null ? new Set<string>() : waitingOnGit(gitEntry, coverage);
  const report = reportOf(
    judged.map(({ file, problem }, index) => ({
      file,
      analysis:
        problem === null
          ? analysisOf([
              ...resolved[index],
              ...(coverage.uncovered.has(file) && !waiting.has(file)
                ? [NO_LOCKFILE]
                : []),
            ])
          : unjudgedAnalysis(problem),
    })),
    scanned.skipped
  );

  if (gitEntry === null || waiting.size === 0) return report;

  return {
    ...report,
    review: [...report.review, unknownGitLead(gitEntry, [...waiting])],
  };
};
