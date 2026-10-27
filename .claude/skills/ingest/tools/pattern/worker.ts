import type { PatternRequest } from '../types.ts';
import { parentPort, workerData } from 'node:worker_threads';

const request: PatternRequest = workerData;
const patterns = request.sources.map(
  (source) => new RegExp(source, request.flags)
);

const matchingLines = (text: string): number[] =>
  text
    .split('\n')
    .flatMap((line, index) =>
      patterns.some((pattern) => pattern.test(line)) ? [index + 1] : []
    );

parentPort?.postMessage(request.texts.map(matchingLines));
