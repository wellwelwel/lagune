import type { BuiltinSkillEntry } from '../../types/core.js';

export const SKILLS_CATALOG: BuiltinSkillEntry[] = [
  {
    name: 'regex',
    tags: ['Regular Expression'],
    groups: ['owasp'],
  },
  {
    name: 'javascript',
    tags: ['Node.js', 'Deno', 'Bun', 'TypeScript'],
    groups: ['javascript'],
  },
  {
    name: 'browser',
    tags: ['DOM', 'Navigator'],
    groups: ['javascript'],
  },
  {
    name: 'ssrf',
    tags: ['Server-Side Request Forgery', 'Webhook', 'URL fetch', 'IMDS'],
    groups: ['owasp'],
  },
];
