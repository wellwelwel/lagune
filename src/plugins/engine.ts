import type { EngineRunner } from '../types/mcp.js';
import { fileURLToPath } from 'node:url';
import { noNodeForEngine } from '../cli/messages.js';
import { nodeOnSearchPath } from '../core/search-path.js';
import { runEngine } from '../mcp/engine.js';

const ENGINE_ENTRY = fileURLToPath(new URL('../bin/index.js', import.meta.url));

/** Runs the engine the package carries from the project, on Node.js, whatever runtime hosts the plugin */
export const runFromProject =
  (project: string): EngineRunner =>
  async (args) => {
    const runtime = await nodeOnSearchPath();

    if (runtime === undefined)
      return { output: noNodeForEngine(), failed: true };

    return runEngine({ runtime, entry: ENGINE_ENTRY, project }, args);
  };
