import type {
  EntryClassification,
  FoldState,
  ItemMatch,
  ObservedEntry,
  RemovalResult,
  TrackingEntry,
  TrackingMap,
} from '../types/core.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { isString, isStringArray, readField } from './collections.js';
import { ensureDir, writeFileOverwrite } from './fs-actions.js';

const TRACKING_DIR = '.lagune';
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

const normalizeEntry = (value: unknown): TrackingEntry | undefined => {
  const name = readField(value, 'name');

  if (!isString(name)) return undefined;

  const paths = readField(value, 'paths');

  return { name, paths: Array.isArray(paths) ? paths.filter(isString) : [] };
};

const parseTrackingMap = (raw: string): TrackingMap => {
  const entries = readField(JSON.parse(raw), 'entries');

  if (!Array.isArray(entries)) return emptyTrackingMap();

  return {
    entries: entries
      .map(normalizeEntry)
      .filter((entry): entry is TrackingEntry => entry !== undefined),
  };
};

export const loadTrackingMap = async (
  targetDir: string
): Promise<TrackingMap> => {
  try {
    const raw = await readFile(join(targetDir, TRACKING_PATH), 'utf8');

    return parseTrackingMap(raw);
  } catch {
    return emptyTrackingMap();
  }
};

export const serializeTrackingMap = (map: TrackingMap): string =>
  `${JSON.stringify(map, null, 2)}\n`;

export const writeTrackingMap = async (
  targetDir: string,
  map: TrackingMap
): Promise<void> => {
  await ensureDir(join(targetDir, TRACKING_DIR));
  await writeFileOverwrite(
    join(targetDir, TRACKING_PATH),
    serializeTrackingMap(map)
  );
};
