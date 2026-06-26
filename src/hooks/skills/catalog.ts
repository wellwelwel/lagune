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
  {
    name: 'python',
    tags: ['CPython', 'pickle'],
    groups: ['python'],
  },
  {
    name: 'rust',
    tags: ['Cargo', 'crates.io', 'unsafe'],
    groups: ['rust'],
  },
  {
    name: 'java',
    tags: ['JVM'],
    groups: ['java'],
  },
  {
    name: 'ruby',
    tags: ['Rails', 'Marshal', 'Psych'],
    groups: ['ruby'],
  },
  {
    name: 'php',
    tags: ['Laravel', 'WordPress', 'Composer'],
    groups: ['php'],
  },
  {
    name: 'go',
    tags: ['Golang', 'goroutine', 'go vet'],
    groups: ['go'],
  },
  {
    name: 'c-cpp',
    tags: ['C', 'C++'],
    groups: ['c-cpp'],
  },
];
