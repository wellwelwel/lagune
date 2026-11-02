import type { EngineProcess, EngineRun } from '../types/mcp.js';
import { execFile } from 'node:child_process';

const MAX_OUTPUT_BYTES = 64 * 1024 * 1024;

/** Runs one engine command line in its own process from the project root, with no shell */
export const runEngine = (
  { runtime, entry, project }: EngineProcess,
  args: string[]
): Promise<EngineRun> =>
  new Promise((resolve) => {
    execFile(
      runtime,
      [entry, ...args],
      {
        cwd: project,
        encoding: 'utf8',
        maxBuffer: MAX_OUTPUT_BYTES,
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        const interruption =
          error !== null && typeof error.code !== 'number' ? error.message : '';
        const output = [stdout, stderr, interruption]
          .map((text) => text.trimEnd())
          .filter((text) => text.length > 0)
          .join('\n');

        resolve({ output, failed: error !== null });
      }
    );
  });
