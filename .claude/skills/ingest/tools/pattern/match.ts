import type { Entry, PatternRequest } from '../types.ts';
import { Worker } from 'node:worker_threads';
import { checkPatterns } from './check.ts';

const PATTERN_BUDGET_MS = 10_000;
const WORKER = new URL('./worker.ts', import.meta.url);

const runInWorker = (request: PatternRequest): Promise<number[][]> =>
  new Promise((settle, reject) => {
    const worker = new Worker(WORKER, { workerData: request });
    const timer = setTimeout(() => {
      void worker.terminate();
      reject(
        new Error(
          `--pattern ran past ${PATTERN_BUDGET_MS / 1000}s, simplify it or search with --term`
        )
      );
    }, PATTERN_BUDGET_MS);

    worker.once('message', (lines: number[][]) => {
      clearTimeout(timer);
      void worker.terminate();
      settle(lines);
    });
    worker.once('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });

export const matchPatterns = async (
  entries: Entry[],
  sources: string[],
  caseSensitive: boolean
): Promise<Set<number>[]> => {
  if (sources.length === 0) return entries.map(() => new Set());

  const lines = await runInWorker({
    sources: checkPatterns(sources),
    flags: caseSensitive ? '' : 'i',
    texts: entries.map((entry) => entry.lines.join('\n')),
  });

  return lines.map((numbers) => new Set(numbers));
};
