import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example node ./.lagune/hooks/agent.mjs                                                    // scans the whole project
 * @example node ./.lagune/hooks/agent.mjs -d src/ai                                          // scans a directory
 * @example node ./.lagune/hooks/agent.mjs -f src/chat.ts                                     // scans a single file
 * @example node ./.lagune/hooks/agent.mjs -l javascript -p 'query({ prompt })'  // => uncapped
 * @example node ./.lagune/hooks/agent.mjs -l python -p 'AgentExecutor(agent=a, max_iterations=None)' // => uncapped
 */
await runHook(import.meta.url, (args) => run(args));
