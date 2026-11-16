import type {
  HistoryBarrier,
  HistoryLimits,
  HistoryRead,
  HistoryStop,
  HistoryWalk,
  UnreadCause,
  UnreadObjects,
} from '../../types/git.js';
import type {
  HistoryEntry,
  HistoryHit,
  HistoryReport,
} from '../../types/hooks/secrets.js';
import type { ScanDetail } from '../../types/scan.js';
import { deepFreeze } from '../../core/collections.js';
import { CONFIGS_FILE } from '../../core/configs.js';
import { MAX_REFS } from '../../core/git/refs.js';
import { groupedSection, skippedSentence } from '../../core/scan/report.js';
import { MEBIBYTE } from './history.js';
import { namedFiles } from './verdicts.js';

const GIT_FOLDER = '.git';
const SENTINEL = 'no secrets found in the Git history';
const PROVEN_HEADING =
  'Secrets in the Git history, to rotate where each was issued:';
const POSSIBLE_HEADING =
  'Possible secrets in the Git history to review manually:';
const STASHED_HEADING =
  'Secrets only a stash holds, local until the stash is applied and committed:';
const NOT_READ_HEADING = 'Git history the checker did not read:';
const MAX_FILES_PER_FOLDER = 3;
const MAX_FOLDERS_PER_KIND = 3;
const ROOT_FOLDER = './';
const REF_NAME = /^[!-~]{1,255}$/;
const UNSHOWN_REF = 'one whose name cannot be shown';

const BARRIERS: Readonly<Record<HistoryBarrier, string>> = deepFreeze({
  absent:
    'the whole history, with no .git at the project root: run the check from the repository root',
  pointer:
    'the whole history, with a .git that points to a repository elsewhere, as a worktree or submodule does, which the checker never follows: run the check from the main checkout of a worktree, or from a clone of its own for a submodule',
  other:
    'the whole history, with a .git or an object store the checker cannot read as a folder of its own',
  reftable:
    'the whole history, whose refs Git keeps in the reftable format, which the checker does not read',
});

const UNREAD_CAUSES: readonly UnreadCause[] = deepFreeze([
  'missing',
  'malformed',
  'oversized',
  'deep',
]);

const UNREAD_DETAILS: Readonly<
  Record<UnreadCause, (limits: HistoryLimits) => string>
> = deepFreeze({
  missing: () =>
    'missing from the object store, as a partial clone or an alternate store leaves them',
  malformed: () => 'the checker could not read as Git objects',
  oversized: (limits) => `larger than ${mebibytes(limits.objectBytes)} MiB`,
  deep: (limits) => `behind a delta chain deeper than ${limits.deltaDepth}`,
});

const UNREAD_REMEDIES: Readonly<Record<UnreadCause, string>> = deepFreeze({
  missing: '',
  malformed: '',
  oversized: `: check by hand, or leave out in ${CONFIGS_FILE} a path that cannot hold a secret`,
  deep: '',
});

const STOP_LIMITS: Readonly<
  Record<HistoryStop, (limits: HistoryLimits) => string>
> = deepFreeze({
  commits: (limits) => counted(limits.commits, 'commit'),
  objects: (limits) => counted(limits.objects, 'object'),
  bytes: (limits) => `${mebibytes(limits.bytes)} MiB read`,
  time: (limits) => `${limits.milliseconds / 1000} seconds`,
});

const counted = (count: number, noun: string): string =>
  `${count} ${count === 1 ? noun : `${noun}s`}`;

const mebibytes = (bytes: number): number => Math.round(bytes / MEBIBYTE);

const fromDate = (seconds: number): string => {
  const date = new Date(seconds * 1000);

  return seconds <= 0 || Number.isNaN(date.getTime())
    ? ''
    : ` from ${date.toISOString().slice(0, 10)}`;
};

const stopLine = ({ stop, limits, commits, last }: HistoryWalk): string[] => {
  if (stop === null) return [];

  const reached =
    last === null
      ? 'before reading a whole commit'
      : `after reading ${counted(commits, 'commit')}, back to commit ${last.id}${fromDate(last.time)}: continue with --history --before ${last.id}`;

  return [
    `the commits it did not reach: the walk stopped at its limit of ${STOP_LIMITS[stop](limits)}, ${reached}`,
  ];
};

/** A continued walk that never meets the commit it was given passed over every commit */
const resumeLine = ({ resume, stop }: HistoryWalk): string[] =>
  resume === null || resume.reached || stop !== null
    ? []
    : [
        `the whole history, since the walk never met commit ${resume.commit}, which --before names: name the commit the run before printed`,
      ];

const unreadLine = (
  cause: UnreadCause,
  { count, paths }: UnreadObjects,
  limits: HistoryLimits
): string => {
  const objects = `${counted(count, 'object')} ${UNREAD_DETAILS[cause](limits)}`;

  return paths.length === 0
    ? objects
    : `${objects}, at ${namedFiles(paths)}${UNREAD_REMEDIES[cause]}`;
};

const unreadLines = ({ unread, limits }: HistoryWalk): string[] =>
  UNREAD_CAUSES.filter((cause) => unread[cause].count > 0).map((cause) =>
    unreadLine(cause, unread[cause], limits)
  );

/** A repository can name a ref anything: only a short name in printable ASCII reaches the output */
const shownRef = (ref: string): string =>
  REF_NAME.test(ref) ? ref : UNSHOWN_REF;

const refLines = ({ refs, refsTruncated }: HistoryWalk): string[] => [
  ...(refs.length > 0
    ? [
        `${counted(refs.length, 'ref')} the checker could not follow to a commit: ${namedFiles([...new Set(refs.map(shownRef))])}`,
      ]
    : []),
  ...(refsTruncated ? [`the refs past the first ${MAX_REFS}`] : []),
];

const storeLines = (walk: HistoryWalk): string[] => [
  ...(walk.packs > 0
    ? [`${counted(walk.packs, 'packfile')} the checker could not read`]
    : []),
  ...refLines(walk),
  ...(walk.submodules.length > 0
    ? [
        `${counted(walk.submodules.length, 'submodule')} at ${namedFiles(walk.submodules)}: the history of a submodule lives in a repository of its own, so run the check from a clone of it`,
      ]
    : []),
  ...(walk.alternates
    ? [
        'the objects in the alternate stores that objects/info/alternates names, outside this repository',
      ]
    : []),
  ...(walk.shallow
    ? [
        "the commits before the shallow clone's boundary, never fetched: fetch them with git fetch --unshallow, then run this again",
      ]
    : []),
];

const notReadLines = (read: HistoryRead): string[] =>
  read.kind === 'barred'
    ? [BARRIERS[read.barrier]]
    : [
        ...stopLine(read.walk),
        ...resumeLine(read.walk),
        ...unreadLines(read.walk),
        ...storeLines(read.walk),
      ];

/** One entry for each kind of secret a version of a file holds, naming the other paths that hold the same version, as a moved or copied file leaves them */
const entriesOf = (hits: readonly HistoryHit[]): HistoryEntry[] => {
  const entries = new Map<string, HistoryEntry>();

  for (const hit of hits) {
    const key = `${hit.blob}\n${hit.label}`;
    const entry = entries.get(key);

    if (entry === undefined) entries.set(key, { ...hit, copies: [] });
    else entry.copies.push(hit.path);
  }

  return [...entries.values()];
};

const entryDetail = ({
  path,
  label,
  commit,
  copies,
}: HistoryEntry): ScanDetail => ({
  file: path,
  detail:
    copies.length === 0
      ? `${label}, in commit ${commit}`
      : `${label}, in commit ${commit}, also at ${namedFiles(copies)}`,
});

const folderOf = (path: string): string =>
  path.slice(0, path.lastIndexOf('/') + 1) || ROOT_FOLDER;

const pathWithin = (folder: string, path: string): string =>
  folder === ROOT_FOLDER ? path : path.slice(folder.length);

const grouped = <Item>(
  items: readonly Item[],
  keyOf: (item: Item) => string
): Item[][] => {
  const groups = new Map<string, Item[]>();

  for (const item of items) {
    const key = keyOf(item);
    const group = groups.get(key) ?? [];

    group.push(item);
    groups.set(key, group);
  }

  return [...groups.values()];
};

const firstByPath = (hits: readonly HistoryHit[]): HistoryHit =>
  hits.toSorted((left, right) => left.path.localeCompare(right.path))[0];

/** One line for a folder where many files share a kind of possible secret, such as a build's bundles, naming one of them as the example */
const folderDetail = (group: readonly HistoryHit[]): ScanDetail => {
  const example = firstByPath(group);
  const folder = folderOf(example.path);

  return {
    file: folder,
    detail: `${example.label} in ${group.length} files, such as ${pathWithin(folder, example.path)} in commit ${example.commit}: leave the folder out in ${CONFIGS_FILE} if it holds build output`,
  };
};

const segmentsOf = (folder: string): string[] =>
  folder === ROOT_FOLDER ? [] : folder.slice(0, -1).split('/');

/** The deepest folder that holds every one of the folders */
const sharedFolder = (folders: readonly string[]): string => {
  const [first, ...others] = folders.map(segmentsOf);
  const differs = first.findIndex((segment, index) =>
    others.some((other) => other[index] !== segment)
  );
  const shared = differs === -1 ? first : first.slice(0, differs);

  return shared.length === 0 ? ROOT_FOLDER : `${shared.join('/')}/`;
};

/** One line for a kind of possible secret that many such folders share, as a site built once per language leaves them */
const acrossFoldersDetail = (
  folders: readonly (readonly HistoryHit[])[]
): ScanDetail => {
  const hits = folders.flat();
  const example = firstByPath(hits);
  const folder = sharedFolder(hits.map(({ path }) => folderOf(path)));

  return {
    file: folder,
    detail: `${example.label} in ${hits.length} files across ${folders.length} folders, such as ${pathWithin(folder, example.path)} in commit ${example.commit}: leave the folders out in ${CONFIGS_FILE} if they hold build output`,
  };
};

const possibleDetails = (hits: readonly HistoryHit[]): ScanDetail[] => {
  const folders = grouped(
    hits,
    ({ path, label }) => `${folderOf(path)}\n${label}`
  );
  const few = folders.filter((folder) => folder.length <= MAX_FILES_PER_FOLDER);
  const many = folders.filter((folder) => folder.length > MAX_FILES_PER_FOLDER);

  return [
    ...entriesOf(few.flat()).map(entryDetail),
    ...grouped(many, ([{ label }]) => label).flatMap((kind) =>
      kind.length > MAX_FOLDERS_PER_KIND
        ? [acrossFoldersDetail(kind)]
        : kind.map(folderDetail)
    ),
  ];
};

const stashedCommits = (read: HistoryRead): ReadonlySet<string> =>
  new Set(read.kind === 'walked' ? read.walk.stashed : []);

/** Proof a stash holds comes last, apart from the rest: Git pushes no stash */
const hitSections = ({ read, hits }: HistoryReport): string[] => {
  const stashed = stashedCommits(read);
  const proven = entriesOf(hits.filter(({ tier }) => tier === 'proven'));
  const sections: (readonly [heading: string, details: ScanDetail[]])[] = [
    [
      PROVEN_HEADING,
      proven.filter(({ commit }) => !stashed.has(commit)).map(entryDetail),
    ],
    [
      POSSIBLE_HEADING,
      possibleDetails(hits.filter(({ tier }) => tier === 'unconfirmed')),
    ],
    [
      STASHED_HEADING,
      proven.filter(({ commit }) => stashed.has(commit)).map(entryDetail),
    ],
  ];

  return sections
    .filter(([, details]) => details.length > 0)
    .map(([heading, details]) => groupedSection(heading, details));
};

const sectionsOf = (report: HistoryReport): string[] => {
  const hits = hitSections(report);
  const notRead = notReadLines(report.read).map((detail) => ({
    file: GIT_FOLDER,
    detail,
  }));

  return notRead.length === 0
    ? hits
    : [...hits, groupedSection(NOT_READ_HEADING, notRead)];
};

/** A clean run that continued another answers only for the commits it read */
const sentinelOf = (read: HistoryRead): string =>
  read.kind === 'walked' && read.walk.resume !== null
    ? `${SENTINEL} before commit ${read.walk.resume.commit}\n`
    : `${SENTINEL}\n`;

/** Prints what the history holds by the strength of its evidence, then everything the walk did not read */
export const formatHistory = (report: HistoryReport): string => {
  const sections = sectionsOf(report);
  const body =
    sections.length === 0
      ? sentinelOf(report.read)
      : `${sections.join('\n\n')}\n`;
  const skipped = skippedSentence({ git: 0, configs: report.skipped });

  return skipped === null ? body : `${body}\n${skipped}\n`;
};
