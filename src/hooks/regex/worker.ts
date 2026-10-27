import type { MessagePort } from 'node:worker_threads';
import type { ReadingJob } from '../../types/hooks/regex.js';
import { parentPort } from 'node:worker_threads';
import { assess } from './regex.js';

const serve = (port: MessagePort): void => {
  port.on('message', ({ source, flags, repetitionLimit }: ReadingJob) =>
    port.postMessage(assess(source, { flags, repetitionLimit }))
  );
};

if (parentPort) serve(parentPort);
