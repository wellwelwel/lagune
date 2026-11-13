export type GitTracking = 'tracked' | 'untracked' | 'unknown';

export type CredentialVerdict = 'credential' | 'clean' | 'unread';

export type CredentialFile = {
  label: string;
  matches: (name: string, folder: string) => boolean;
  holdsSecret: ((text: string) => boolean) | null;
};

export type ConfigEntry = readonly [key: string, value: string];

export type EnvFileKind = 'local' | 'shared';
