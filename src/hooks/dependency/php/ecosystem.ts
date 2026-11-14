import type {
  CoverageScope,
  DependencyEcosystem,
  DependencyFlag,
  DependencyReader,
} from '../../../types/hooks/dependency.js';
import { basename, dirname, join } from 'node:path';
import { deepFreeze } from '../../../core/collections.js';
import { parseJsonObject } from '../../../core/json.js';
import { cannotJudge } from '../text.js';
import { readComposerLock } from './lockfile.js';
import { plainVerdictOf, readComposerManifest } from './manifest.js';

const LOCKFILE = 'composer.lock';

const INSTALLED_FOLDER = 'composer';

const INSTALLED_NAME = 'installed.json';

const PROJECT_ROOT = '.';

const MANIFEST = 'composer.json';

const READERS: ReadonlyMap<string, DependencyReader> = new Map([
  [MANIFEST, readComposerManifest],
  [LOCKFILE, readComposerLock],
]);

/** The composer/installed.json Composer writes into the vendor folder it installs packages to, listing every package there */
const isInstalledRecord = (file: string): boolean =>
  basename(file) === INSTALLED_NAME &&
  basename(dirname(file)) === INSTALLED_FOLDER;

/** Whether a package sits two levels below a vendor folder Composer installed to, as in vendor/acme/package, the project root never being one */
const isInstalledPackage = (
  packageFolder: string,
  scope: CoverageScope
): boolean => {
  const vendor = dirname(dirname(packageFolder));

  return (
    vendor !== PROJECT_ROOT &&
    scope.has(join(vendor, INSTALLED_FOLDER, INSTALLED_NAME))
  );
};

/** The flags of a composer.lock once the composer.json beside it says whether Composer's guard against URLs in the clear is on */
const resolveBeside = async (
  file: string,
  flags: readonly DependencyFlag[],
  scope: CoverageScope
): Promise<readonly DependencyFlag[]> => {
  if (basename(file) !== LOCKFILE) return flags;

  const manifest = join(dirname(file), MANIFEST);

  if (!scope.has(manifest)) return flags;

  const verdict = plainVerdictOf(
    manifest,
    parseJsonObject(await scope.textAt(manifest), manifest, cannotJudge)
  );

  return flags.map((flag) =>
    flag.verdict === 'guarded-plain-transport' ? { ...flag, verdict } : flag
  );
};

/** Composer, whose lockfile covers only the manifest beside it, and whose installed packages need none */
export const PHP: DependencyEcosystem = deepFreeze({
  readerOf: (file: string) => READERS.get(basename(file)) ?? null,
  keeps: (file: string) =>
    READERS.has(basename(file)) || isInstalledRecord(file),
  coveredBeside: async (manifest: string, scope: CoverageScope) => {
    const folder = dirname(manifest);

    return (
      scope.has(join(folder, LOCKFILE)) || isInstalledPackage(folder, scope)
    );
  },
  rootsWorkspace: async () => false,
  resolveBeside,
});
