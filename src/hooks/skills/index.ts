import { cwd } from 'node:process';
import { runHook } from '../../cli/run-hook.js';
import { SKILLS_CATALOG } from './catalog.js';
import { discoverSkills, presentSkillNames } from './discover.js';
import { keepPresent, list, merge } from './skills.js';

/**
 * @example node ./.bluespec/hooks/skills.mjs   // lists the installed sub-skills and their tags
 */
await runHook(import.meta.url, async () => {
  const target = cwd();
  const [userCatalog, present] = await Promise.all([
    discoverSkills(target),
    presentSkillNames(target),
  ]);

  return list(keepPresent(merge(SKILLS_CATALOG, userCatalog), present));
});
