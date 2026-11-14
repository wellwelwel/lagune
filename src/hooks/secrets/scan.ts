import type { GitScope, GitTracking } from '../../types/git.js';
import type {
  CredentialFile,
  EnvFileKind,
  SecretsFile,
} from '../../types/hooks/secrets.js';
import type { FileAnalysis, ScanReport, WalkFilter } from '../../types/scan.js';
import { join } from 'node:path';
import { checkerSettings } from '../../core/checkers.js';
import { deepFreeze } from '../../core/collections.js';
import { gitEntryOf, gitIgnoresOf } from '../../core/git/repository.js';
import { rootScopeOf, trackingOf } from '../../core/git/scope.js';
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
import { unknownGitLead } from './verdicts.js';

const SECRETS_FILTER: WalkFilter = deepFreeze({
  ignoredDirs: BASE_IGNORED_DIRS,
  ignoredDirPatterns: BASE_IGNORED_DIR_PATTERNS,
  accept: (relativePath) =>
    SOURCE_FILTER.accept(relativePath) ||
    credentialFileOf(relativePath) !== null ||
    envFileOf(relativePath) !== null,
});

const combined = (...analyses: readonly FileAnalysis[]): FileAnalysis => ({
  findings: analyses.flatMap((analysis) => analysis.findings),
  review: analyses.flatMap((analysis) => analysis.review),
  advisory: analyses.flatMap((analysis) => analysis.advisory),
});

const isAtStake = ({ findings, review }: FileAnalysis): boolean =>
  findings.length > 0 || review.length > 0;

const sourceFile = async (root: string, file: string): Promise<SecretsFile> => {
  const text = await readText(join(root, file));

  return {
    file,
    analysis: text === null ? EMPTY_ANALYSIS : analyze(file, text),
    awaitsGit: false,
  };
};

const ownVerdict = (
  file: string,
  credentialFile: CredentialFile | null,
  envFile: EnvFileKind | null,
  text: string | null,
  tracking: GitTracking
): FileAnalysis =>
  combined(
    credentialFile === null
      ? EMPTY_ANALYSIS
      : credentialFileAnalysis(file, credentialFile, text, tracking),
    envFile === null ? EMPTY_ANALYSIS : envFileAnalysis(envFile, text, tracking)
  );

const analyzedFile = async (
  root: string,
  file: string,
  rootScope: GitScope | null
): Promise<SecretsFile> => {
  const credentialFile = credentialFileOf(file);
  const envFile = envFileOf(file);

  if (credentialFile === null && envFile === null)
    return sourceFile(root, file);

  const text =
    readsCredentialContent(credentialFile) || readsEnvContent(envFile)
      ? await readText(join(root, file))
      : null;

  if (rootScope === null)
    return {
      file,
      analysis: EMPTY_ANALYSIS,
      awaitsGit: isAtStake(
        ownVerdict(file, credentialFile, envFile, text, 'tracked')
      ),
    };

  const tracking = await trackingOf(root, file, rootScope);

  return {
    file,
    analysis: ownVerdict(file, credentialFile, envFile, text, tracking),
    awaitsGit: false,
  };
};

const withUnknownGit = async (
  root: string,
  report: ScanReport,
  analyzed: readonly SecretsFile[]
): Promise<ScanReport> => {
  const waiting = analyzed
    .filter(({ awaitsGit }) => awaitsGit)
    .map(({ file }) => file);

  if (waiting.length === 0) return report;

  return {
    ...report,
    review: [...report.review, unknownGitLead(await gitEntryOf(root), waiting)],
  };
};

/** Scans the targets for secrets written in the source and for the credential and environment files Git tracks or would commit, gathering under one lead the files whose Git status it cannot read */
export const scanSecrets = async (
  root: string,
  targets: readonly string[]
): Promise<ScanReport> => {
  const [settings, ignores] = await Promise.all([
    checkerSettings(root, 'secrets'),
    gitIgnoresOf(root),
  ]);
  const [{ files, skipped }, rootScope] = await Promise.all([
    walkTargetsWith(root, targets, SECRETS_FILTER, settings, ignores),
    rootScopeOf(root, ignores),
  ]);
  const analyzed = await Promise.all(
    files.map((file) => analyzedFile(root, file, rootScope))
  );
  const report = reportOf(analyzed, skipped);

  return rootScope === null ? withUnknownGit(root, report, analyzed) : report;
};
