import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example npx lagune agent                                                                       // scans the whole project
 * @example npx lagune agent --dir src/ai                                                          // scans a directory
 * @example npx lagune agent --file src/chat.ts                                                    // scans a single file
 * @example npx lagune agent --lang javascript --pattern 'query({ prompt })'                       // => uncapped
 * @example npx lagune agent --lang python --pattern 'AgentExecutor(agent=a, max_iterations=None)' // => uncapped
 */
await runHook(import.meta.url, (args) => run(args));
