import type { SkillGroup } from '../../types/core.js';

export const SKILL_GROUPS: SkillGroup[] = [
  {
    key: 'owasp',
    label: 'OWASP',
    description: 'Harden against the application security risks OWASP tracks',
  },
  {
    key: 'javascript',
    label: 'JavaScript',
    description: 'JavaScript and its runtimes',
  },
  {
    key: 'python',
    label: 'Python',
    description: 'Python and its language-specific risks',
  },
  {
    key: 'rust',
    label: 'Rust',
    description: 'Rust and its language-specific risks',
  },
  {
    key: 'java',
    label: 'Java',
    description: 'Java and its language-specific risks',
  },
  {
    key: 'ruby',
    label: 'Ruby',
    description: 'Ruby and its language-specific risks',
  },
  {
    key: 'php',
    label: 'PHP',
    description: 'PHP and its language-specific risks',
  },
  {
    key: 'go',
    label: 'Go',
    description: 'Go and its language-specific risks',
  },
  {
    key: 'c-cpp',
    label: 'C / C++',
    description: 'C and C++ and their language-specific risks',
  },
];
