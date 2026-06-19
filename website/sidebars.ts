import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Get Started',
      collapsed: false,
      items: ['get-started/install', 'get-started/commands'],
    },
    {
      type: 'category',
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
      type: 'category',
      label: 'Tools',
      items: ['commands/specialize', 'commands/skills', 'commands/list'],
    },
    {
      type: 'category',
      label: 'Maintenance',
      items: ['commands/repair'],
    },
    'skills',
    {
      type: 'category',
      label: 'Hooks',
      items: ['hooks/regex', 'hooks/skills'],
    },
    'supported-agents',
    'requirements',
  ],
};

export default sidebars;
