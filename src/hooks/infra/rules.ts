import type {
  InfraKind,
  InfraRule,
  InfraVerdict,
} from '../../types/hooks/infra.js';
import { deepFreeze } from '../../core/collections.js';
import { hasCurlPipe, hasMutableFrom, runsAsRoot } from './dockerfile.js';
import { hasScriptInjection, hasUnpinnedUses } from './github-actions.js';
import {
  hasIamWildcard,
  hasPublicIngress,
  hasSecretInData,
  hasUnpinnedModule,
} from './terraform.js';

export const RULES: Record<InfraKind, InfraRule[]> = deepFreeze({
  terraform: [
    {
      tag: 'public-ingress',
      severity: 'finding',
      detail:
        'security group / NACL ingress open to 0.0.0.0/0 on a sensitive port',
      test: hasPublicIngress,
    },
    {
      tag: 'iam-wildcard',
      severity: 'finding',
      detail:
        'IAM policy grants a wildcard Action / Resource / Principal ("*")',
      test: hasIamWildcard,
    },
    {
      tag: 'secret-in-data',
      severity: 'finding',
      detail:
        'a literal secret value in a resource attribute: use a variable or a secret store',
      test: hasSecretInData,
    },
    {
      tag: 'encryption-disabled',
      severity: 'finding',
      detail: 'encryption explicitly disabled (encrypted = false)',
      test: (content) => /\bencrypted\s{0,16}=\s{0,16}false\b/i.test(content),
    },
    {
      tag: 'unpinned-module',
      severity: 'finding',
      detail: 'module sourced from git without a commit-pinned ?ref=<sha>',
      test: hasUnpinnedModule,
    },
  ],
  dockerfile: [
    {
      tag: 'root-user',
      severity: 'finding',
      detail: 'final image sets USER root (or USER 0)',
      test: runsAsRoot,
    },
    {
      tag: 'curl-pipe',
      severity: 'finding',
      detail: 'RUN pipes a downloaded script into a shell without verification',
      test: hasCurlPipe,
    },
    {
      tag: 'mutable-tag',
      severity: 'advisory',
      detail:
        'final FROM uses a mutable tag (or is untagged), not a @sha256 digest',
      test: hasMutableFrom,
    },
  ],
  'github-actions': [
    {
      tag: 'script-injection',
      severity: 'finding',
      detail: 'untrusted github.event field interpolated into a run: block',
      test: hasScriptInjection,
    },
    {
      tag: 'write-all',
      severity: 'finding',
      detail: 'workflow grants permissions: write-all',
      test: (content) => /permissions\s{0,16}:\s{0,16}write-all/i.test(content),
    },
    {
      tag: 'unpinned-action',
      severity: 'advisory',
      detail: 'uses: an action pinned to a tag/branch, not a full commit SHA',
      test: hasUnpinnedUses,
    },
  ],
});

export const FINDING_TAGS: ReadonlySet<InfraVerdict> = new Set(
  Object.values(RULES)
    .flat()
    .filter((rule) => rule.severity === 'finding')
    .map((rule) => rule.tag)
);
