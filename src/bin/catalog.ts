import { stdout } from 'node:process';
import { list } from '../catalog/catalog.js';
import { isSpecializationName } from '../catalog/name.js';
import { catalogEntries, readSpecialization } from '../catalog/project.js';
import {
  catalogUsage,
  invalidSpecializationName,
  noSpecialization,
} from '../cli/messages.js';

const printSpecialization = async (
  name: string,
  cwd: string,
  packageRoot: URL,
  version: string
): Promise<void> => {
  if (!isSpecializationName(name))
    throw new Error(invalidSpecializationName(name));

  const text = await readSpecialization(cwd, packageRoot, name);

  if (text === undefined) throw new Error(noSpecialization(name, version));

  stdout.write(text);
};

/** Lists the project's catalog, or prints the one specialization it resolves under a name */
export const runCatalog = async (
  names: string[],
  cwd: string,
  packageRoot: URL,
  version: string
): Promise<void> => {
  if (names.length > 1) throw new Error(catalogUsage(version));

  const [name] = names;

  if (name !== undefined)
    return printSpecialization(name, cwd, packageRoot, version);

  stdout.write(list(await catalogEntries(cwd)));
};
