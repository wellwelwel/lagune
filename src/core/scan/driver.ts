import type { CheckerName } from '../../types/checkers.js';
import type {
  AnalyzedFile,
  FileAnalysis,
  ScanDetail,
  ScanReport,
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
  const present = analyzed.filter((entry) => entry !== null);

  return {
    findings: details(present, (analysis) => analysis.findings),
    review: details(present, (analysis) => analysis.review),
    advisory: details(present, (analysis) => analysis.advisory),
    skipped: skippedCounts(skipped),
  };
};
