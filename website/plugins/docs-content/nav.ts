export type DocsNavCategory = {
  key: string;
  label: string;
  collapsed?: boolean;
  items: string[];
};

export type DocsNavEntry = string | DocsNavCategory;

export const docsNav: DocsNavEntry[] = [
  {
    key: 'get-started',
    label: 'Get Started',
    collapsed: false,
    items: [
      'get-started/install',
      'get-started/commands',
      'get-started/dashboard',
    ],
  },
  {
    key: 'development-flow',
    label: 'Development Flow',
    collapsed: false,
    items: ['commands/lagune'],
  },
  {
    key: 'the-blue-team-flow',
    label: 'The Blue Team Flow',
    collapsed: false,
    items: [
      'commands/charter',
      'commands/detect',
      'commands/plan',
      'commands/harden',
      'commands/verify',
    ],
  },
  {
    key: 'specializations',
    label: 'Specializations',
    items: ['categories', 'catalog'],
  },
  {
    key: 'tools',
    label: 'Tools',
    items: ['commands/specialize', 'commands/prove'],
  },
  {
    key: 'hooks',
    label: 'Hooks',
    items: [
      'hooks/configure',
      'hooks/agent',
      'hooks/cors',
      'hooks/crypto',
      'hooks/cvss',
      'hooks/infra',
      'hooks/interpreter',
      'hooks/jwt',
      'hooks/network',
      'hooks/regex',
      'hooks/secrets',
    ],
  },
  {
    key: 'examples',
    label: 'Examples',
    items: [
      'examples/prompts',
      'examples/spec-driven-development',
      'examples/scheduled-audits',
    ],
  },
  {
    key: 'references-sources',
    label: 'References & Sources',
    items: [
      'references/paper',
      'references/glossary',
      'references/configs-schema',
      'references/deepsec',
      'references/owasp-sources',
    ],
  },
  {
    key: 'maintenance',
    label: 'Maintenance',
    items: ['commands/repair', 'commands/migrate'],
  },
];
