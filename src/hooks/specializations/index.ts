import { cwd } from 'node:process';
import { runHook } from '../../cli/run-hook.js';
import { renderSpecializations } from '../../core/specializations.js';

/**
 * @example node ./.bluespec/hooks/specializations.mjs   // rebuilds .bluespec/specializations.md from the catalog
 */
await runHook(import.meta.url, async () => {
  await renderSpecializations(cwd());

  return 'rebuilt .bluespec/specializations.md\n';
});
