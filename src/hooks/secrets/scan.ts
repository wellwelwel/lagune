import type { GitIgnores } from '../../types/git.js';
import type { GitTracking } from '../../types/hooks/secrets.js';
import type {
  AnalyzedFile,
  FileAnalysis,
  ScanReport,
  WalkFilter,
} from '../../types/scan.js';
import { join, sep } from 'node:path';
import { checkerSettings } from '../../core/checkers.js';
import { deepFreeze } from '../../core/collections.js';
import { gitIgnoresOf } from '../../core/git/repository.js';
import { readText } from '../../core/markdown/read.js';
import { reportOf } from '../../core/scan/driver.js';
import {
  BASE_IGNORED_DIR_PATTERNS,
  BASE_IGNORED_DIRS,
  SOURCE_FILTER,
} from '../../core/scan/filters.js';
import { EMPTY_ANALYSIS } from '../../core/scan/scope.js';
import { walkTargetsWith } from '../../core/scan/walk.js';
import {
  credentialFileAnalysis,
  credentialFileOf,
  readsContent,
} from './credential-files.js';
import { analyze } from './secrets.js';

const SECRETS_FILTER: WalkFilter = deepFreeze({
  ignoredDirs: BASE_IGNORED_DIRS,
  ignoredDirPatterns: BASE_IGNORED_DIR_PATTERNS,
  accept: (relativePath) =>
    SOURCE_FILTER.accept(relativePath) ||
    credentialFileOf(relativePath) !== null,
});

const trackingOf = (ignores: GitIgnores | null, file: string): GitTracking => {
  if (ignores === null) return 'unknown';

  return ignores.tracked.files.has(file.split(sep).join('/'))
    ? 'tracked'
    : 'untracked';
};

const combined = (left: FileAnalysis, right: FileAnalysis): FileAnalysis => ({
  findings: [...left.findings, ...right.findings],
  review: [...left.review, ...right.review],
  advisory: [...left.advisory, ...right.advisory],
});

const analyzedFile = async (
  root: string,
  file: string,
  ignores: GitIgnores | null
): Promise<AnalyzedFile> => {
  const isSource = SOURCE_FILTER.accept(file);
  const credentialFile = credentialFileOf(file);
  const text =
    isSource || readsContent(credentialFile)
      ? await readText(join(root, file))
      : null;
  const values =
    isSource && text !== null ? analyze(file, text) : EMPTY_ANALYSIS;

  if (credentialFile === null) return { file, analysis: values };

  const stored = credentialFileAnalysis(
    credentialFile,
    text,
    trackingOf(ignores, file)
  );

  return { file, analysis: combined(values, stored) };
};

/** Scans the targets for secrets written in the source and for the credential files Git tracks */
export const scanSecrets = async (
  root: string,
  targets: readonly string[]
): Promise<ScanReport> => {
  const [settings, ignores] = await Promise.all([
    checkerSettings(root, 'secrets'),
    gitIgnoresOf(root),
  ]);
  const { files, skipped } = await walkTargetsWith(
    root,
    targets,
    SECRETS_FILTER,
    settings,
    ignores
  );
  const analyzed = await Promise.all(
    files.map((file) => analyzedFile(root, file, ignores))
  );

  return reportOf(analyzed, skipped);
};
