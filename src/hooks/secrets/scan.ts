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
  readsCredentialContent,
} from './credential-files.js';
import { envFileAnalysis, envFileOf, readsEnvContent } from './env-files.js';
import { analyze } from './secrets.js';

const SECRETS_FILTER: WalkFilter = deepFreeze({
  ignoredDirs: BASE_IGNORED_DIRS,
  ignoredDirPatterns: BASE_IGNORED_DIR_PATTERNS,
  accept: (relativePath) =>
    SOURCE_FILTER.accept(relativePath) ||
    credentialFileOf(relativePath) !== null ||
    envFileOf(relativePath) !== null,
});

const trackingOf = (ignores: GitIgnores | null, file: string): GitTracking => {
  if (ignores === null) return 'unknown';

  return ignores.tracked.files.has(file.split(sep).join('/'))
    ? 'tracked'
    : 'untracked';
};

const combined = (...analyses: readonly FileAnalysis[]): FileAnalysis => ({
  findings: analyses.flatMap((analysis) => analysis.findings),
  review: analyses.flatMap((analysis) => analysis.review),
  advisory: analyses.flatMap((analysis) => analysis.advisory),
});

const analyzedFile = async (
  root: string,
  file: string,
  ignores: GitIgnores | null
): Promise<AnalyzedFile> => {
  const isSource = SOURCE_FILTER.accept(file);
  const credentialFile = credentialFileOf(file);
  const envFile = envFileOf(file);
  const text =
    isSource ||
    readsCredentialContent(credentialFile) ||
    readsEnvContent(envFile)
      ? await readText(join(root, file))
      : null;
  const values =
    isSource && text !== null ? analyze(file, text) : EMPTY_ANALYSIS;

  if (credentialFile === null && envFile === null)
    return { file, analysis: values };

  const tracking = trackingOf(ignores, file);
  const credential =
    credentialFile === null
      ? EMPTY_ANALYSIS
      : credentialFileAnalysis(credentialFile, text, tracking);
  const environment =
    envFile === null
      ? EMPTY_ANALYSIS
      : envFileAnalysis(envFile, text, tracking);

  return { file, analysis: combined(values, credential, environment) };
};

/** Scans the targets for secrets written in the source and for the credential and environment files Git tracks */
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
