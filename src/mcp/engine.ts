import type { EngineRun } from '../types/mcp.js';
import { execFile } from 'node:child_process';
import { execPath } from 'node:process';

const MAX_OUTPUT_BYTES = 64 * 1024 * 1024;

/** Runs one engine command in its own process from the project root, with no shell, as the CLI would */
export const runEngine = (
  entry: string,
  project: string,
  command: string,
  values: string[]
): Promise<EngineRun> =>
  new Promise((resolve) => {
    execFile(
      execPath,
      [entry, command, ...values],
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
