import type { UntrackSummary } from '../../types/core.js';
import { withStateLock } from '../../core/state-lock.js';
import {
  parseNamePayload,
  removeEntries,
  updateTrackingMap,
} from '../../core/tracking.js';
import { appendClosedFindings } from './history.js';
import { removeSectionsFromMemory } from './prose.js';

export const untrack = async (
  targetDir: string,
  payload: string,
  now: Date
): Promise<string> => {
  const names = parseNamePayload(payload);

  if (names.length === 0)
    throw new Error('untrack input needs `names`, a list of finding names');

  const summary: UntrackSummary = await withStateLock(
    targetDir,
    async (state) => {
      const history = await appendClosedFindings(state, names, now);
      const prose = await removeSectionsFromMemory(state, names);
      const { removed, notFound } = await updateTrackingMap(state, (map) =>
        removeEntries(map, names)
      );

      return { removed, notFound, prose, history };
    }
  );

  return `${JSON.stringify(summary, null, 2)}\n`;
};
