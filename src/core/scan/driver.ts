import type {
  AnalyzedFile,
  FileAnalysis,
  ScanDetail,
  ScanReport,
  WalkFilter,
} from '../../types/scan.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { walkTargets } from './walk.js';

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

export const scanReport = async (
  root: string,
  targets: string[],
  filter: WalkFilter,
  analyze: (file: string, content: string) => FileAnalysis
): Promise<ScanReport> => {
  const { files, skipped } = await walkTargets(root, targets, filter);
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
    skipped: skipped.length,
  };
};
