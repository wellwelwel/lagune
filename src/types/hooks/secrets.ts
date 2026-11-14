import type { GitTracking } from '../git.js';
import type { AnalyzedFile, FileAnalysis } from '../scan.js';

export type CommittableTracking = Exclude<GitTracking, 'ignored'>;

export type TrackingVerdicts = Record<CommittableTracking, FileAnalysis>;

export type TrackingSeverities = Record<
  CommittableTracking,
  (detail: string) => FileAnalysis
>;

export type EvidenceTier = 'proven' | 'unconfirmed';

export type ContentVerdict = 'credential' | 'clean' | 'unconfirmed';

export type CredentialVerdict = ContentVerdict | 'unread';

export type CredentialFile = {
  label: string;
  matches: (name: string, folder: string) => boolean;
  judgeContent: ((text: string) => ContentVerdict) | null;
};

export type ConfigEntry = readonly [key: string, value: string];

export type EnvFileKind = 'local' | 'shared';

export type EnvEvidence = { tier: EvidenceTier; source: string };

export type SecretsFile = AnalyzedFile & { awaitsGit: boolean };
