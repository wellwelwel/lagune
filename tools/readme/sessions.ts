import type { Outro, Session } from './types';

export const SESSIONS: Session[] = [
  {
    tab: 'First time using Lagune',
    agent: { name: 'Claude Code', icon: 'claude' },
    prompt: ["/lagune-charter It's a social media for devs"],
    heading: 'I found that the project uses',
    thinking: 0.95,
    pace: 0.25,
    hold: 1.3,
    closing: 'principles',
    rows: [
      { kind: 'detected', icon: 'rust', name: 'Rust' },
      { kind: 'detected', icon: 'database', name: 'Database' },
      { kind: 'detected', icon: 'image', name: 'Photo uploads' },
      { kind: 'detected', icon: 'signup', name: 'User sign-up' },
    ],
  },
  {
    tab: 'Using it for any task',
    agent: { name: 'Codex', icon: 'codex' },
    prompt: ['/lagune Implement user sign-up'],
    heading: 'Matched specializations',
    thinking: 0.9,
    pace: 0.25,
    hold: 0.8,
    closing: 'building',
    rows: [
      {
        kind: 'specialization',
        name: 'Credential Endpoint',
        note: 'Rate limits and anti-automation on sign-up',
      },
      {
        kind: 'specialization',
        name: 'Access Control',
        note: 'Ownership checks and Argon2id password storage',
      },
      {
        kind: 'specialization',
        name: 'Cryptography',
        note: 'Unpredictable verification tokens',
      },
      {
        kind: 'specialization',
        name: 'SQL',
        note: 'Parameterized, owner-scoped queries',
      },
      {
        kind: 'specialization',
        name: 'Regex',
        note: 'Input validation safe from ReDoS',
      },
      {
        kind: 'specialization',
        name: 'Rust',
        note: 'Sound unsafe code and checked integer math',
      },
    ],
  },
  {
    tab: 'Blue Team Audit',
    agent: { name: 'Antigravity', icon: 'antigravity' },
    prompt: [
      'You are a cybersecurity orchestrator:',
      '',
      '- 1st sub-agent: /lagune-detect',
      '- 2nd sub-agent: /lagune-plan',
      '- 3rd sub-agent: /lagune-harden',
      '- 4th sub-agent: /lagune-verify',
      '',
      'Loop: re-run harden and verify sub-agents until all findings are closed.',
    ],
    heading: 'Orchestrating 4 sub-agents',
    thinking: 0.9,
    pace: 0.9,
    hold: 1,
    closing: 'rest',
    rows: [
      {
        kind: 'step',
        name: '/lagune-detect',
        runs: [
          {
            tone: 'success',
            note: 'Mapped 4 findings across the project',
          },
        ],
      },
      {
        kind: 'step',
        name: '/lagune-plan',
        runs: [
          {
            tone: 'success',
            note: 'Ranked 4 fixes by CVSS v4.0',
          },
        ],
      },
      {
        kind: 'step',
        name: '/lagune-harden',
        runs: [
          { tone: 'success', note: 'Applied the 4 fixes' },
          {
            tone: 'success',
            note: 'Loop 2: reworked the rejected fix',
          },
        ],
      },
      {
        kind: 'step',
        name: '/lagune-verify',
        runs: [
          {
            tone: 'danger',
            note: '3 proven closed, 1 rejected',
          },
          {
            tone: 'success',
            note: 'Loop 2: all 4 proven closed',
          },
        ],
      },
    ],
  },
];

export const OUTRO: Outro = {
  tab: 'Give Lagune a Star',
  agent: { name: 'Cursor', icon: 'cursor' },
  lead: 'Your',
  trail: ' helps Lagune grow.',
  agents: [
    { name: 'OpenCode', icon: 'opencode' },
    { name: 'Muse Code', icon: 'muse' },
    { name: 'GitHub Copilot CLI', icon: 'copilot' },
    { name: 'Devin', icon: 'devin' },
    { name: 'Grok Build', icon: 'grok' },
    { name: 'skills.sh', icon: 'vercel' },
    { name: 'Pi', icon: 'pi' },
    { name: 'Qwen Code', icon: 'qwen' },
    { name: 'Kimi Code', icon: 'kimi' },
  ],
};
