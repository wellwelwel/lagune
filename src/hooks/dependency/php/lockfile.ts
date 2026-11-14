import type {
  DependencyFlag,
  DependencyRead,
  PlacedTable,
} from '../../../types/hooks/dependency.js';
import { ownValue } from '../../../core/collections.js';
import { parseJsonObject } from '../../../core/json.js';
import { pathOf, tablesAt, textAt } from '../fields.js';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';
import { isPlainTransport } from '../transport.js';
import { packageUrls } from './package.js';

const PACKAGES = 'packages';

const PACKAGE_LISTS = [PACKAGES, 'packages-dev'];

/** A locked package as Composer prints it when it installs one, its name and version */
const lockedName = (file: string, [where, entry]: PlacedTable): string => {
  const name = textAt(file, entry, 'name', where);

  if (name === undefined)
    throw cannotJudge(file, `locks a package with no name at ${where}`);

  const version = textAt(file, entry, 'version', where);

  return version === undefined ? name : `${name} (${version})`;
};

const lockedFlags = (file: string, placed: PlacedTable): DependencyFlag[] => {
  const name = lockedName(file, placed);

  return packageUrls(file, placed).some(isPlainTransport)
    ? [{ verdict: 'guarded-plain-transport', name }]
    : [];
};

/** A composer.lock, flagging each package it locks, for production or development, from a URL over plain http:// or git://, which Composer refuses unless the composer.json beside it switches its guard off */
export const readComposerLock = (
  file: string,
  content: string
): DependencyRead => {
  const lock = parseJsonObject(content, file, cannotJudge);

  if (ownValue(lock, PACKAGES) === undefined)
    throw cannotJudge(file, 'is not a composer.lock');

  return flagsRead(
    PACKAGE_LISTS.flatMap((list) =>
      tablesAt(file, lock, list, '').flatMap((entry, index) =>
        lockedFlags(file, [pathOf(list, String(index)), entry])
      )
    )
  );
};
