import type { CategoriesRequest } from '../../types/dashboard/api';
import type { ActionHandler, ActionResult } from '../../types/dashboard/server';
import {
  addCategories,
  CATEGORIES,
  removeCategories,
} from '../../categories/categories';
import {
  readProjectCategories,
  recordCategories,
  usedCategories,
} from '../../categories/project';
import { isRecord } from '../../core/collections';

const CATEGORY_KEYS: ReadonlySet<string> = new Set(
  CATEGORIES.map((category) => category.key)
);

const CATEGORIES_FIELDS: ReadonlySet<string> = new Set(['categories']);

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
  if (!isRecord(body)) return undefined;

  const keys = Object.keys(body);

  if (keys.length > CATEGORIES_FIELDS.size) return undefined;
  if (!keys.every((key) => CATEGORIES_FIELDS.has(key))) return undefined;

  const categories = parseCategories(body.categories);

  return categories === undefined ? undefined : { categories };
};

const INVALID_REQUEST: ActionResult = {
  status: 400,
  body: { ok: false, error: 'Invalid request' },
};

const failed = (error: unknown): ActionResult => {
  const message = error instanceof Error ? error.message : String(error);
  const oneLine = message.replaceAll('\r', ' ').replaceAll('\n', ' ');

  process.stderr.write(`[dashboard] categories failed: ${oneLine}\n`);

  return {
    status: 500,
    body: { ok: false, error: 'Recording the categories failed' },
  };
};

/** Records the chosen set as the project's categories, by the same rules as add and remove */
const handleCategories: ActionHandler = async (body, context) => {
  const request = parseCategoriesRequest(body);

  if (request === undefined) return INVALID_REQUEST;

  try {
    const used = usedCategories(await readProjectCategories(context.cwd));
    const removed = removeCategories(
      used,
      used.filter((key) => !request.categories.includes(key))
    );
    const added = addCategories(removed.categories, request.categories);

    await recordCategories(context.cwd, added.categories);

    return {
      status: 200,
      body: {
        ok: true,
        added: added.changed.length,
        removed: removed.changed.length,
      },
    };
  } catch (error) {
    return failed(error);
  }
};

export const ACTIONS: ReadonlyMap<string, ActionHandler> = new Map([
  ['/api/actions/categories', handleCategories],
]);
