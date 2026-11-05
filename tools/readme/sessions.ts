import type { Session } from './types';

export const SESSIONS: Session[] = [
  {
    tab: 'Project charter',
    prompt: {
      command: '/lagune-charter',
      text: " It's a SaaS where each company manages its own users",
    },
    heading: 'I found that the project uses:',
    thinking: 1.3,
    hold: 1.3,
    closing: 'ready',
    rows: [
      { kind: 'detected', icon: 'rust', name: 'Rust' },
      { kind: 'detected', icon: 'database', name: 'Database' },
      { kind: 'detected', icon: 'tenants', name: 'Multi-tenant' },
      { kind: 'detected', icon: 'signup', name: 'User sign-up' },
    ],
  },
  {
    tab: 'User sign-up',
    prompt: { command: '/lagune', text: ' Implement user sign-up' },
    heading: 'Matched specializations:',
    thinking: 1.2,
    hold: 3.5,
    closing: 'building',
    rows: [
      {
        kind: 'specialization',
        name: 'credential-endpoint',
        note: 'Rate limits and anti-automation on sign-up',
      },
      {
        kind: 'specialization',
        name: 'access-control',
        note: 'Tenant isolation and Argon2id password storage',
      },
      {
        kind: 'specialization',
        name: 'crypto',
        note: 'Unpredictable verification tokens',
      },
      {
        kind: 'specialization',
        name: 'sql',
        note: 'Parameterized, tenant-scoped queries',
      },
      {
        kind: 'specialization',
        name: 'regex',
        note: 'Input validation safe from ReDoS',
      },
      {
        kind: 'specialization',
        name: 'rust',
        note: 'Sound unsafe code and checked integer math',
      },
    ],
  },
  {
    tab: 'Blue Team Audit',
    prompt: { command: '/lagune-detect', text: '' },
    heading: 'Scanned the whole project and mapped 4 findings:',
    thinking: 1.7,
    hold: 4.5,
    closing: 'next',
    rows: [
      {
        kind: 'finding',
        name: 'Invoice export',
        note: 'One company can read another company’s invoices',
      },
      {
        kind: 'finding',
        name: 'Database password',
        note: 'Written straight into the source code',
      },
      {
        kind: 'finding',
        name: 'Password reset',
        note: 'Reset links can be guessed',
      },
      {
        kind: 'finding',
        name: 'Search',
        note: 'User input can rewrite the SQL query',
      },
    ],
  },
];
