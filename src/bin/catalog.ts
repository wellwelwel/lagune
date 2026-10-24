import { stdout } from 'node:process';
import { list } from '../catalog/catalog.js';
import { isSpecializationName } from '../catalog/name.js';
import { catalogEntries, readSpecialization } from '../catalog/project.js';
import {
  catalogUsage,
  invalidSpecializationName,
  noSpecialization,
} from '../cli/messages.js';
import { loadVersion } from '../core/version.js';

const printSpecialization = async (
  name: string,
  cwd: string,
  packageRoot: URL
): Promise<void> => {
  if (!isSpecializationName(name))
    throw new Error(invalidSpecializationName(name));

  const text = await readSpecialization(cwd, packageRoot, name);

  if (text === undefined)
    throw new Error(noSpecialization(name, await loadVersion(packageRoot)));

  stdout.write(text);
};

/** Lists the project's catalog, or prints the one specialization it resolves under a name */
export const runCatalog = async (
  names: string[],
  cwd: string,
  packageRoot: URL
): Promise<void> => {
  if (names.length > 1) throw new Error(catalogUsage());

  const [name] = names;

  if (name !== undefined) return printSpecialization(name, cwd, packageRoot);

  stdout.write(list(await catalogEntries(cwd)));
};
