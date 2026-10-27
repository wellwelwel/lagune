import type { WorkerOptions } from 'node:worker_threads';
import type {
  ReadingJob,
  RegexAssessment,
  RegexCandidate,
} from '../../types/hooks/regex.js';
import { once } from 'node:events';
import { availableParallelism } from 'node:os';
import { Worker } from 'node:worker_threads';
import { assess } from './regex.js';

const WORKER_LIMIT = 8;

const READINGS_PER_WORKER = 8;

const WORKER_OPTIONS = {
  resourceLimits: { maxYoungGenerationSizeMb: 12 },
} satisfies WorkerOptions;

const workersFor = (readings: number): number =>
  Math.min(
    WORKER_LIMIT,
    Math.floor(availableParallelism() / 2),
    Math.floor(readings / READINGS_PER_WORKER)
  );

const byLongestSource = (
  [, left]: [string, RegexCandidate],
  [, right]: [string, RegexCandidate]
): number => right.source.length - left.source.length;

const ask = async (
  worker: Worker,
  job: ReadingJob,
  signal: AbortSignal
): Promise<RegexAssessment> => {
  worker.postMessage(job);

  const [assessment]: RegexAssessment[] = await once(worker, 'message', {
    signal,
  });

  return assessment;
};

const drain = async (
  worker: Worker,
  queue: IterableIterator<[string, RegexCandidate]>,
  repetitionLimit: number | undefined
): Promise<[string, RegexAssessment][]> => {
  const exited = new AbortController();
  const judged: [string, RegexAssessment][] = [];

  worker.once('exit', () => exited.abort());

  for (const [key, { source, flags }] of queue)
    judged.push([
      key,
      await ask(worker, { source, flags, repetitionLimit }, exited.signal),
    ]);

  return judged;
};

const assessAcross = async (
  readings: ReadonlyMap<string, RegexCandidate>,
  repetitionLimit: number | undefined,
  workerCount: number
): Promise<Map<string, RegexAssessment>> => {
  const entry = new URL(import.meta.resolve('./worker.js'));
  const queue = [...readings].toSorted(byLongestSource).values();
  const workers = Array.from(
    { length: workerCount },
    () => new Worker(entry, WORKER_OPTIONS)
  );

  try {
    const lanes = await Promise.all(
      workers.map((worker) => drain(worker, queue, repetitionLimit))
    );

    return new Map(lanes.flat());
  } finally {
    await Promise.all(workers.map((worker) => worker.terminate()));
  }
};

const assessInline = (
  readings: ReadonlyMap<string, RegexCandidate>,
  repetitionLimit: number | undefined
): Map<string, RegexAssessment> =>
  new Map(
    [...readings].map(([key, { source, flags }]): [string, RegexAssessment] => [
      key,
      assess(source, { flags, repetitionLimit }),
    ])
  );

/** Judges every reading, spreading the work across worker threads when the load and the cores make it pay off */
export const assessReadings = async (
  readings: ReadonlyMap<string, RegexCandidate>,
  repetitionLimit: number | undefined,
  workers = workersFor(readings.size)
): Promise<Map<string, RegexAssessment>> =>
  workers < 2
    ? assessInline(readings, repetitionLimit)
    : assessAcross(readings, repetitionLimit, workers);
