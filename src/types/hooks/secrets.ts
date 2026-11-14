import type { GitTracking } from '../git.js';
import type { FileAnalysis } from '../scan.js';

export type TrackingVerdicts = Record<
  Exclude<GitTracking, 'ignored'>,
  FileAnalysis
>;

export type CredentialVerdict = 'credential' | 'clean' | 'unread';

export type CredentialFile = {
  label: string;
  matches: (name: string, folder: string) => boolean;
  holdsSecret: ((text: string) => boolean) | null;
};

export type ConfigEntry = readonly [key: string, value: string];

export type EnvFileKind = 'local' | 'shared';
