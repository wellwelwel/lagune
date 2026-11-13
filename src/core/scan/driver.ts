import type { CheckerName } from '../../types/checkers.js';
import type {
  AnalyzedFile,
  FileAnalysis,
  RuleSeverity,
  ScanDetail,
  ScanReport,
  SeverityDetail,
  SkippedPaths,
  WalkFilter,
} from '../../types/scan.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { checkerSettings } from '../checkers.js';
import { skippedCounts, walkTargets } from './walk.js';

const readText = async (path: string): Promise<string | null> => {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return null;
  }
};

const details = (
  analyzed: AnalyzedFile[],
  pick: (analysis: FileAnalysis) => string[]
): ScanDetail[] =>
  analyzed.flatMap(({ file, analysis }) =>
    pick(analysis).map((detail) => ({ file, detail }))
  );

const detailsAt = (
  broken: readonly SeverityDetail[],
  severity: RuleSeverity
): string[] =>
  broken
    .filter((rule) => rule.severity === severity)
    .map((rule) => rule.detail);

/** The analysis of a file from the rules it breaks, each detail under its rule's severity */
export const analysisBySeverity = (
  broken: readonly SeverityDetail[]
): FileAnalysis => ({
  findings: detailsAt(broken, 'finding'),
  review: [],
  advisory: detailsAt(broken, 'advisory'),
});

/** The report of what each analyzed file breaks, ending with what the walk left out */
export const reportOf = (
  analyzed: AnalyzedFile[],
  skipped: SkippedPaths
): ScanReport => ({
  findings: details(analyzed, (analysis) => analysis.findings),
  review: details(analyzed, (analysis) => analysis.review),
  advisory: details(analyzed, (analysis) => analysis.advisory),
  skipped: skippedCounts(skipped),
});

/** Scans the targets for one checker, leaving out what its settings and Git ignore */
export const scanReport = async (
  root: string,
  targets: string[],
  filter: WalkFilter,
  analyze: (file: string, content: string) => FileAnalysis,
  checker: CheckerName
): Promise<ScanReport> => {
  const settings = await checkerSettings(root, checker);
  const { files, skipped } = await walkTargets(root, targets, filter, settings);
  const analyzed = await Promise.all(
    files.map(async (file): Promise<AnalyzedFile | null> => {
      const content = await readText(join(root, file));

      return content === null
        ? null
        : { file, analysis: analyze(file, content) };
    })
  );

  return reportOf(
    analyzed.filter((entry) => entry !== null),
    skipped
  );
};
