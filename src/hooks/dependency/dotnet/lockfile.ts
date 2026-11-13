import type { DependencyRead } from '../../../types/hooks/dependency.js';
import { ownValue } from '../../../core/collections.js';
import { parseJsonObject } from '../../../core/json.js';
import { subtablesAt } from '../fields.js';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';

const DEPENDENCIES = 'dependencies';

/** A packages.lock.json, which NuGet also accepts blank as a project's opt-in */
export const readNugetLock = (
  file: string,
  content: string
): DependencyRead => {
  if (content.trim() === '') return flagsRead([]);

  const lock = parseJsonObject(content, file, cannotJudge);

  if (ownValue(lock, DEPENDENCIES) === undefined)
    throw cannotJudge(file, 'is not a NuGet lockfile');

  subtablesAt(file, lock, DEPENDENCIES, '');

  return flagsRead([]);
};
