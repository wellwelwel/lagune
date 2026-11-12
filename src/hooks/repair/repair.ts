import type {
  ObservedEntry,
  ReconcileResult,
  TrackingEntry,
  TrackingMap,
  UnresolvedEntry,
  UnresolvedReason,
} from '../../types/core.js';
import { withStateLock } from '../../core/state-lock.js';
import {
  foldEntries,
  parseObservedPayload,
  samePaths,
  updateTrackingMap,
} from '../../core/tracking.js';

const orphanReason = (
  entry: TrackingEntry,
  observed: ObservedEntry[]
): UnresolvedReason => {
  const renamed = observed.some(
    (item) => item.name !== entry.name && samePaths(item.paths, entry.paths)
  );

  return renamed ? 'renamed-candidate' : 'orphan';
};

export const repairEntries = (
  map: TrackingMap,
  observed: ObservedEntry[]
): ReconcileResult => {
  const folded = foldEntries(map, observed);
  const observedNames = new Set(observed.map((item) => item.name));

  const unresolved: UnresolvedEntry[] = map.entries
    .filter((entry) => !observedNames.has(entry.name))
    .map((entry) => ({
      name: entry.name,
      paths: [...entry.paths],
      reason: orphanReason(entry, observed),
    }));

  return {
    updatedMap: folded.map,
    classifications: folded.classifications,
    unresolved,
  };
};

/** Realigns the whole tracking map, flagging what no longer matches */
export const repair = async (
  targetDir: string,
  payload: string
): Promise<string> => {
  const entries = parseObservedPayload(payload);

  if (entries.length === 0)
    throw new Error(
      'repair input needs `entries`, each an item with `name` and `paths`'
    );

  const { classifications, unresolved } = await withStateLock(
    targetDir,
    (state) => updateTrackingMap(state, (map) => repairEntries(map, entries))
  );

  return `${JSON.stringify({ classifications, unresolved }, null, 2)}\n`;
};
