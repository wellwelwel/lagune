import type { UntrackSummary } from '../../types/core.js';
import {
  loadTrackingMap,
  parseNamePayload,
  removeEntries,
  serializeTrackingMap,
  writeTrackingMap,
} from '../../core/tracking.js';
import { removeSectionsFromMemory } from './prose.js';

export const untrack = async (
  targetDir: string,
  payload: string
): Promise<string> => {
  const names = parseNamePayload(payload);

  if (names.length === 0)
    throw new Error('untrack input needs `names`, a list of finding names');

  const prose = await removeSectionsFromMemory(targetDir, names);

  const map = await loadTrackingMap(targetDir);
  const result = removeEntries(map, names);

  if (serializeTrackingMap(map) !== serializeTrackingMap(result.updatedMap))
    await writeTrackingMap(targetDir, result.updatedMap);

  const summary: UntrackSummary = {
    removed: result.removed,
    notFound: result.notFound,
    prose,
  };

  return `${JSON.stringify(summary, null, 2)}\n`;
};
