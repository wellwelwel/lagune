import type {
  CheckerName,
  CheckersConfig,
  CheckerSettings,
  IgnorePatternRead,
} from '../types/checkers.js';
import { deepFreeze } from './collections.js';
import { rootPatternOf } from './git/pattern.js';

export const CHECKERS: readonly CheckerName[] = deepFreeze([
  'agent',
  'cors',
  'crypto',
  'dependency',
  'infra',
  'interpreter',
  'jwt',
  'regex',
  'secrets',
]);

export const DEFAULT_SETTINGS: CheckerSettings = deepFreeze({
  gitignore: true,
  ignore: [],
});

export const MAX_IGNORE_ENTRIES = 1000;

export const MAX_PATTERN_LENGTH = 1024;

export const isCheckerName = (value: unknown): value is CheckerName =>
  CHECKERS.some((name) => name === value);

const hasDrive = (entry: string): boolean => /^[A-Za-z]:/.test(entry);

const isRooted = (entry: string): boolean =>
  entry.startsWith('/') || entry.startsWith('\\') || hasDrive(entry);

const hasControlCharacter = (entry: string): boolean =>
  /[\u0000-\u001f\u007f]/.test(entry);

const segmentsOf = (entry: string): string[] =>
  entry
    .replaceAll('\\', '/')
    .split('/')
    .filter((segment) => segment !== '' && segment !== '.');

const shapeProblem = (entry: string): string | undefined => {
  if (entry.length > MAX_PATTERN_LENGTH)
    return `is longer than ${MAX_PATTERN_LENGTH} characters`;
  if (hasControlCharacter(entry)) return 'holds a control character';
  if (entry.trim() !== entry) return 'starts or ends with a space';
  if (entry.startsWith('!'))
    return "starts with !, but a checker's own list, not a pattern, is what takes paths back";
  if (isRooted(entry))
    return 'is absolute instead of starting at the project root';

  return undefined;
};

/** Reads an ignore entry as a path or glob pattern from the project root, or names the problem that keeps it from being one */
export const readIgnorePattern = (entry: string): IgnorePatternRead => {
  const problem = shapeProblem(entry);

  if (problem !== undefined) return { problem };

  const segments = segmentsOf(entry);

  if (segments.length === 0)
    return { problem: 'names no path inside the project' };
  if (segments.includes('..')) return { problem: 'climbs out of the project' };

  const rule = rootPatternOf(segments);

  return rule === null
    ? { problem: 'opens a bracket the checkers cannot read' }
    : { pattern: segments.join('/'), rule };
};

/** What a checker leaves out, its own setting replacing the shared one key by key */
export const settingsFor = (
  { shared, own }: CheckersConfig,
  checker: CheckerName
): CheckerSettings => ({
  gitignore:
    own.get(checker)?.gitignore ??
    shared.gitignore ??
    DEFAULT_SETTINGS.gitignore,
  ignore: own.get(checker)?.ignore ?? shared.ignore ?? DEFAULT_SETTINGS.ignore,
});

/** The ignore list a change starts from: the checker's own, or the shared one it would otherwise follow */
export const ignoreListOf = (
  config: CheckersConfig,
  checker: CheckerName | undefined
): readonly string[] =>
  checker === undefined
    ? (config.shared.ignore ?? DEFAULT_SETTINGS.ignore)
    : settingsFor(config, checker).ignore;

export const withIgnoreList = (
  config: CheckersConfig,
  checker: CheckerName | undefined,
  ignore: string[]
): CheckersConfig =>
  checker === undefined
    ? { ...config, shared: { ...config.shared, ignore } }
    : {
        ...config,
        own: new Map([
          ...config.own,
          [checker, { ...config.own.get(checker), ignore }],
        ]),
      };

/** The checkers that keep an ignore list of their own instead of the shared one */
export const checkersWithOwnList = ({ own }: CheckersConfig): CheckerName[] =>
  CHECKERS.filter((checker) => own.get(checker)?.ignore !== undefined);

/** The checkers block as the configs file records it */
export const checkersRecord = ({
  shared,
  own,
}: CheckersConfig): Record<string, unknown> =>
  Object.assign(Object.create(null), shared, Object.fromEntries(own));
