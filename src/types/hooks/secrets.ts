import type { GitTracking, HistoryRead } from '../git.js';
import type { AnalyzedFile, FileAnalysis } from '../scan.js';

export type CommittableTracking = Exclude<GitTracking, 'ignored'>;

export type TrackingVerdicts = Record<CommittableTracking, FileAnalysis>;

export type TrackingSeverities = Record<
  CommittableTracking,
  (detail: string) => FileAnalysis
>;

export type EvidenceTier = 'proven' | 'unconfirmed';

export type SecretKind = { label: string; detail: string };

export type SecretSignature = SecretKind & { regex: RegExp };

export type SecretEvidence = Record<EvidenceTier, SecretKind[]>;

export type EnvSecrets = { tier: EvidenceTier; sources: string[] };

export type HistoryEvidence = { tier: EvidenceTier; label: string };

export type HistoryHit = HistoryEvidence & {
  path: string;
  commit: string;
  blob: string;
};

export type HistoryEntry = HistoryHit & { copies: string[] };

export type ConnectionKind = 'remote' | 'local' | 'example';

export type HistoryReport = {
  read: HistoryRead;
  hits: HistoryHit[];
  skipped: number;
};

export type ContentVerdict = 'credential' | 'clean' | 'unconfirmed';

export type CredentialVerdict = ContentVerdict | 'unread';

export type CredentialFile = {
  label: string;
  matches: (name: string, folder: string) => boolean;
  judgeContent: ((text: string) => ContentVerdict) | null;
};

export type ConfigEntry = readonly [key: string, value: string];

export type EnvFileKind = 'local' | 'shared' | 'template';

export type EnvEvidence = { tier: EvidenceTier; source: string };

export type SecretsFile = AnalyzedFile & { awaitsGit: boolean };
