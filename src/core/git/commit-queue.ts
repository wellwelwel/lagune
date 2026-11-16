import type { ParsedCommit } from '../../types/git.js';

const isNewer = (left: ParsedCommit, right: ParsedCommit): boolean =>
  left.time > right.time;

const swap = (queue: ParsedCommit[], left: number, right: number): void => {
  [queue[left], queue[right]] = [queue[right], queue[left]];
};

/** Adds a commit to a queue kept as a binary heap of commit times */
export const pushCommit = (
  queue: ParsedCommit[],
  commit: ParsedCommit
): void => {
  queue.push(commit);

  let index = queue.length - 1;

  while (index > 0) {
    const parent = (index - 1) >> 1;

    if (!isNewer(queue[index], queue[parent])) return;

    swap(queue, index, parent);
    index = parent;
  }
};

/** Takes the commit with the latest committer time out of the queue */
export const popNewest = (queue: ParsedCommit[]): ParsedCommit | undefined => {
  const newest = queue[0];
  const last = queue.pop();

  if (last === undefined || queue.length === 0) return newest;

  queue[0] = last;

  let index = 0;

  while (true) {
    const left = index * 2 + 1;
    const right = left + 1;
    let next = index;

    if (left < queue.length && isNewer(queue[left], queue[next])) next = left;
    if (right < queue.length && isNewer(queue[right], queue[next]))
      next = right;
    if (next === index) return newest;

    swap(queue, index, next);
    index = next;
  }
};
