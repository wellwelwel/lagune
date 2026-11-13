import type { DependencyRead } from '../../../src/types/hooks/dependency.js';
import type { FileAnalysis } from '../../../src/types/scan.js';
import { analysisOf } from '../../../src/hooks/dependency/analysis.js';
import { readManifest } from '../../../src/hooks/dependency/javascript/manifest.js';

export const PLAIN = 'fetched over plain http:// or git://';
export const UNHASHED = 'no integrity hash to check the download against';
export const FLOATING = 'floating specifier (such as * or latest)';
export const CANNOT_JUDGE = /so the dependency checker cannot judge it/;

export const report = (
  findings: string[],
  advisory: string[]
): FileAnalysis => ({ findings, review: [], advisory });

export const findings = (lines: string[]): FileAnalysis => report(lines, []);

export const CLEAN = findings([]);

export const reported = (read: DependencyRead): FileAnalysis =>
  analysisOf(read.flags);

export const manifestReport = (content: unknown): FileAnalysis =>
  reported(readManifest('package.json', JSON.stringify(content)));

export const coverage = ({
  needsLockfile,
  pins,
  declaresWorkspace,
}: DependencyRead): Omit<DependencyRead, 'flags'> => ({
  needsLockfile,
  pins,
  declaresWorkspace,
});

export const flaggedNames = (read: DependencyRead): (string | null)[] =>
  read.flags.map(({ name }) => name);
