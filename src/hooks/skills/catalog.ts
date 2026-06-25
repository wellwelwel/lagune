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
    name: 'network',
    tags: ['Requests', 'Webhook', 'URL Fetch', 'IMDS'],
    groups: ['owasp'],
  },
];
