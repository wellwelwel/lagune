import type { CheckersConfig, CheckerSettings } from '../../types/checkers';
import type { ListChange } from '../../types/core';
import type {
  CategoriesChange,
  CategoriesRequest,
} from '../../types/dashboard/api';
import type { ActionHandler, ActionResult } from '../../types/dashboard/server';
import { CATEGORIES } from '../../categories/categories';
import { recordCategories } from '../../categories/project';
import {
  CHECKERS,
  checkersRecord,
  settingsFor,
} from '../../core/checker-rules';
import { checkersConfigOf } from '../../core/checkers';
import { addToList, isRecord, removeFromList } from '../../core/collections';
import { recordConfigs } from '../../core/configs';
import { errorMessage } from '../../core/errors';

const CATEGORY_KEYS: ReadonlySet<string> = new Set(
  CATEGORIES.map((category) => category.key)
);

const CATEGORIES_FIELDS: ReadonlySet<string> = new Set(['categories']);

const CHECKERS_FIELDS: ReadonlySet<string> = new Set(['checkers']);

const INVALID_REQUEST: ActionResult = {
  status: 400,
  body: { ok: false, error: 'Invalid request' },
};

const hasOnlyFields = (
  body: Record<string, unknown>,
  fields: ReadonlySet<string>
): boolean => {
  const keys = Object.keys(body);

  return keys.length === fields.size && keys.every((key) => fields.has(key));
};

const failed = (subject: string, error: unknown): ActionResult => {
  const oneLine = errorMessage(error)
    .replaceAll('\r', ' ')
    .replaceAll('\n', ' ');

  process.stderr.write(`[dashboard] ${subject} failed: ${oneLine}\n`);

  return {
    status: 500,
    body: { ok: false, error: `Recording the ${subject} failed` },
  };
};

const parseCategories = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value) || value.length > CATEGORIES.length)
    return undefined;

  const valid = value.every(
    (item) => typeof item === 'string' && CATEGORY_KEYS.has(item)
  );

  if (!valid) return undefined;

  return [...new Set(value.filter((item) => typeof item === 'string'))];
};

const parseCategoriesRequest = (
  body: unknown
): CategoriesRequest | undefined => {
  if (!isRecord(body) || !hasOnlyFields(body, CATEGORIES_FIELDS))
    return undefined;

  const categories = parseCategories(body.categories);

  return categories === undefined ? undefined : { categories };
};

const chosenCategories = (
  used: string[],
  chosen: string[]
): Pick<ListChange, 'values'> & CategoriesChange => {
  const removed = removeFromList(
    used,
    used.filter((key) => !chosen.includes(key))
  );
  const added = addToList(removed.values, chosen);

  return {
    values: added.values,
    added: added.changed.length,
    removed: removed.changed.length,
  };
};

/** Records the chosen set as the project's categories, by the same rules as add and remove */
const handleCategories: ActionHandler = async (body, context) => {
  const request = parseCategoriesRequest(body);

  if (request === undefined) return INVALID_REQUEST;

  try {
    const { added, removed } = await recordCategories(context.cwd, (used) =>
      chosenCategories(used, request.categories)
    );

    return { status: 200, body: { ok: true, added, removed } };
  } catch (error) {
    return failed('categories', error);
  }
};

/** Reads the requested checkers block by the same rules the engine reads the file with, none when any key, value, or path fails them */
const parseCheckersRequest = (body: unknown): CheckersConfig | undefined => {
  if (!isRecord(body) || !hasOnlyFields(body, CHECKERS_FIELDS))
    return undefined;

  try {
    return checkersConfigOf(body);
  } catch {
    return undefined;
  }
};

const sameSettings = (left: CheckerSettings, right: CheckerSettings): boolean =>
  left.gitignore === right.gitignore &&
  left.ignore.length === right.ignore.length &&
  left.ignore.every((pattern) => right.ignore.includes(pattern));

const changedCheckers = (
  current: CheckersConfig,
  requested: CheckersConfig
): number =>
  CHECKERS.filter(
    (checker) =>
      !sameSettings(
        settingsFor(current, checker),
        settingsFor(requested, checker)
      )
  ).length;

/** Records the requested block as what the checkers leave out, refusing to replace a block the engine itself would refuse */
const handleCheckers: ActionHandler = async (body, context) => {
  const requested = parseCheckersRequest(body);

  if (requested === undefined) return INVALID_REQUEST;

  try {
    const changed = await recordConfigs(context.cwd, (configs) => ({
      fields: { checkers: checkersRecord(requested) },
      result: changedCheckers(checkersConfigOf(configs), requested),
    }));

    return { status: 200, body: { ok: true, changed } };
  } catch (error) {
    return failed('hook settings', error);
  }
};

export const ACTIONS: ReadonlyMap<string, ActionHandler> = new Map([
  ['/api/actions/categories', handleCategories],
  ['/api/actions/checkers', handleCheckers],
]);
