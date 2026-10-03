import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example node ./.lagune/hooks/cvss.mjs -v 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N'       // => 9.3, Critical
 * @example node ./.lagune/hooks/cvss.mjs -v 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A' // => 8.7, High
 * @example node ./.lagune/hooks/cvss.mjs -e -v 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N'    // adds each metric in plain words
 */
await runHook(import.meta.url, (args) => run(args));
