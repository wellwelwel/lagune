import type {
  ObservedEntry,
  TrackingMap,
  TrackResult,
} from '../../types/core.js';
import { withStateLock } from '../../core/state-lock.js';
import {
  foldEntries,
  parseObservedPayload,
  updateTrackingMap,
} from '../../core/tracking.js';

export const trackEntries = (
  map: TrackingMap,
  observed: ObservedEntry[]
): TrackResult => {
  const folded = foldEntries(map, observed);

  return {
    updatedMap: folded.map,
    classifications: folded.classifications,
  };
};

/** Registers reported findings in the tracking map, never removing */
export const track = async (
  targetDir: string,
  payload: string
): Promise<string> => {
  const entries = parseObservedPayload(payload);

  if (entries.length === 0)
    return `${JSON.stringify({ classifications: [] }, null, 2)}\n`;

  const { classifications } = await withStateLock(targetDir, (state) =>
    updateTrackingMap(state, (map) => trackEntries(map, entries))
  );

  return `${JSON.stringify({ classifications }, null, 2)}\n`;
};
