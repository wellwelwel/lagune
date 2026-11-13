import type { SeverityDetail } from '../scan.js';

export type InfraKind = 'terraform' | 'dockerfile' | 'github-actions';

export type InfraVerdict =
  | 'public-ingress'
  | 'iam-wildcard'
  | 'secret-in-data'
  | 'encryption-disabled'
  | 'unpinned-module'
  | 'unpinned-action'
  | 'root-user'
  | 'curl-pipe'
  | 'mutable-tag'
  | 'script-injection'
  | 'write-all'
  | 'safe';

export type InfraRule = SeverityDetail & {
  tag: InfraVerdict;
  test: (content: string) => boolean;
};
