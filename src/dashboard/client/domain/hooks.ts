import type { CheckerName } from '@/types/checkers';
import type { HookMeta, HookScope } from '@/types/dashboard/client';
import { specializationIconName } from '@/dashboard/shared/specialization-meta';

const HOOKS: Record<CheckerName, HookMeta> = {
  agent: {
    label: 'Agent',
    blurb: 'Detects uncapped agent loops.',
    icon: specializationIconName('llm'),
  },
  cors: {
    label: 'CORS',
    blurb: 'Audits CORS origins.',
    icon: specializationIconName('http-request'),
  },
  crypto: {
    label: 'Crypto',
    blurb: 'Detects weak cryptography.',
    icon: specializationIconName('crypto'),
  },
  infra: {
    label: 'Infrastructure',
    blurb: 'Detects IaC misconfiguration.',
    icon: specializationIconName('infra'),
  },
  interpreter: {
    label: 'Interpreter',
    blurb: 'Flags dynamic-code-execution sinks.',
    icon: specializationIconName('interpreter'),
  },
  jwt: {
    label: 'JWT',
    blurb: 'Detects unpinned JWT verification.',
    icon: specializationIconName('federation'),
  },
  regex: {
    label: 'Regex',
    blurb: 'Detects ReDoS patterns.',
    icon: specializationIconName('regex'),
  },
  secrets: {
    label: 'Secrets',
    blurb: 'Detects hardcoded secrets.',
    icon: specializationIconName('secrets'),
  },
};

export const EVERY_HOOK: HookMeta = {
  label: 'All hooks',
  blurb: 'Settings every hook inherits.',
  icon: 'sliders',
};

export const hookMeta = (scope: HookScope): HookMeta =>
  scope === undefined ? EVERY_HOOK : HOOKS[scope];
