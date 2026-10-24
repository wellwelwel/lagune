import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example npx lagune infra                                              // scans the whole project
 * @example npx lagune infra --dir infra                                  // scans a directory
 * @example npx lagune infra --file Dockerfile                            // scans a single file
 * @example npx lagune infra --kind dockerfile --pattern 'FROM node:20'   // => mutable-tag
 * @example npx lagune infra --kind terraform --pattern 'actions = ["*"]' // => iam-wildcard
 */
await runHook(import.meta.url, (args) => run(args));
