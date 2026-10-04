import { access } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { agentIcon } from '../../../src/dashboard/shared/agent-meta.js';
import { skillGroupIcon } from '../../../src/dashboard/shared/skill-meta.js';
import { SKILL_GROUPS } from '../../../src/hooks/skills/groups.js';
import { AGENT_SPECS } from '../../../src/providers/specs.js';

const publicDir = new URL(
  '../../../src/dashboard/client/public/',
  import.meta.url
);

const exists = (icon: string): Promise<boolean> =>
  access(new URL(`.${icon}`, publicDir)).then(
    () => true,
    () => false
  );

await describe('the shared icons folder carries every registered logo', async () => {
  for (const spec of AGENT_SPECS) {
    const icon = agentIcon(spec);
    const present = await exists(icon);

    it('gives every agent a logo', () => {
      strict(present, `${spec.key} points at a missing logo ${icon}`);
    });
  }

  for (const group of SKILL_GROUPS) {
    const icon = skillGroupIcon(group.key);
    const present = await exists(icon);

    it('gives every category an icon', () => {
      strict(present, `${group.key} points at a missing icon ${icon}`);
    });
  }
});
