import { cwd } from 'node:process';
import { runHook } from '../../cli/run-hook.js';
import { SKILLS_CATALOG } from './catalog.js';
import { discoverSkills } from './discover.js';
import { list, merge } from './skills.js';

/**
 * @example node ./.bluespec/hooks/skills.mjs   // lists every sub-skill and its tags
 */
await runHook(import.meta.url, async () =>
  list(merge(SKILLS_CATALOG, await discoverSkills(cwd())))
);
