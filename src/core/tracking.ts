import type {
  EntryClassification,
  FoldState,
  ItemMatch,
  LockedState,
  ObservedEntry,
  RemovalResult,
  TrackingEntry,
  TrackingMap,
  TrackResult,
} from '../types/core.js';
import { isString, isStringArray, readField } from './collections.js';
import { parseJsonObject } from './json.js';
import {
  readStateFile,
  stateFileRefusal,
  writeStateFile,
} from './state-file.js';

const TRACKING_PATH = '.lagune/tracking.json';

const emptyTrackingMap = (): TrackingMap => ({ entries: [] });

export const samePaths = (left: string[], right: string[]): boolean => {
  if (left.length !== right.length) return false;

  const sortedRight = right.toSorted();

  return left.toSorted().every((path, index) => path === sortedRight[index]);
};

const matchItem = (observed: ObservedEntry, map: TrackingMap): ItemMatch => {
  const existing = map.entries.find((entry) => entry.name === observed.name);

  if (existing) {
    const classification: EntryClassification = samePaths(
      existing.paths,
      observed.paths
    )
      ? 'unchanged'
      : 'moved';

    return {
      entry: { name: existing.name, paths: [...observed.paths] },
      classification: { name: existing.name, classification },
    };
  }

  return {
    entry: { name: observed.name, paths: [...observed.paths] },
    classification: { name: observed.name, classification: 'new' },
  };
};

const upsert = (
  entries: TrackingEntry[],
  next: TrackingEntry
): TrackingEntry[] =>
  entries.some((entry) => entry.name === next.name)
    ? entries.map((entry) => (entry.name === next.name ? next : entry))
    : [...entries, next];

export const foldEntries = (
  map: TrackingMap,
  observed: ObservedEntry[]
): FoldState =>
  observed.reduce<FoldState>(
    (state, item) => {
      const match = matchItem(item, state.map);

      return {
        map: { entries: upsert(state.map.entries, match.entry) },
        classifications: [...state.classifications, match.classification],
      };
    },
    { map, classifications: [] }
  );

export const removeEntries = (
  map: TrackingMap,
  names: string[]
): RemovalResult => {
  const wanted = new Set(names);
  const kept = map.entries.filter((entry) => !wanted.has(entry.name));
  const removed = map.entries
    .filter((entry) => wanted.has(entry.name))
    .map((entry) => entry.name);
  const notFound = names.filter(
    (name) => !map.entries.some((entry) => entry.name === name)
  );

  return {
    updatedMap: { entries: kept },
    removed,
    notFound,
  };
};

const isObservedEntry = (value: unknown): value is ObservedEntry =>
  isString(readField(value, 'name')) &&
  isStringArray(readField(value, 'paths'));

const payloadList = (raw: string, field: string): unknown[] => {
  const list = readField(JSON.parse(raw), field);

  if (!Array.isArray(list))
    throw new Error(`the input needs \`${field}\` as a list`);

  return list;
};

export const parseObservedPayload = (raw: string): ObservedEntry[] =>
  payloadList(raw, 'entries')
    .filter(isObservedEntry)
    .map((entry) => ({ name: entry.name, paths: [...entry.paths] }));

export const parseNamePayload = (raw: string): string[] =>
  payloadList(raw, 'names').filter(isString);

const storedEntry = (value: unknown): TrackingEntry => {
  const name = readField(value, 'name');

  if (!isString(name))
    throw stateFileRefusal(TRACKING_PATH, 'holds an entry with no name');

  const paths = readField(value, 'paths');

  return { name, paths: Array.isArray(paths) ? paths.filter(isString) : [] };
};

const parseTrackingMap = (raw: string): TrackingMap => {
  const entries = readField(parseJsonObject(raw, TRACKING_PATH), 'entries');

  if (!Array.isArray(entries))
    throw stateFileRefusal(
      TRACKING_PATH,
      'records entries that are not a list'
    );

  return { entries: entries.map(storedEntry) };
};

/** Reads the tracking map, empty while the file is absent, refusing a file it cannot trust or one outside the project */
export const loadTrackingMap = async (
  targetDir: string
): Promise<TrackingMap> => {
  const raw = await readStateFile(targetDir, TRACKING_PATH);

  return raw === null ? emptyTrackingMap() : parseTrackingMap(raw);
};

export const serializeTrackingMap = (map: TrackingMap): string =>
  `${JSON.stringify(map, null, 2)}\n`;

export const writeTrackingMap = (
  state: LockedState,
  map: TrackingMap
): Promise<void> =>
  writeStateFile(state, TRACKING_PATH, serializeTrackingMap(map));

/** Applies an update to the tracking map, rewriting the file only when the update changes it */
export const updateTrackingMap = async <
  Update extends Pick<TrackResult, 'updatedMap'>,
>(
  state: LockedState,
  update: (map: TrackingMap) => Update
): Promise<Update> => {
  const map = await loadTrackingMap(state.cwd);
  const result = update(map);

  if (serializeTrackingMap(map) !== serializeTrackingMap(result.updatedMap))
    await writeTrackingMap(state, result.updatedMap);

  return result;
};
