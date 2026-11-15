import type { SpecializationPhase } from '../types/catalog.js';
import type { ParsedCliArgs } from '../types/core.js';
import { stdout } from 'node:process';
import { list } from '../catalog/catalog.js';
import { isSpecializationName } from '../catalog/name.js';
import { catalogEntries, readSpecialization } from '../catalog/project.js';
import {
  isBlank,
  isSpecializationPhase,
  SPECIALIZATION_PHASES,
  tailorSpecialization,
} from '../catalog/reading.js';
import {
  catalogUsage,
  emptySpecialization,
  invalidSpecializationName,
  noSpecialization,
  nothingForRead,
  unknownPhase,
} from '../cli/messages.js';

const phaseNamed = (
  name: string | undefined
): SpecializationPhase | undefined => {
  if (name === undefined || isSpecializationPhase(name)) return name;

  throw new Error(unknownPhase(name, SPECIALIZATION_PHASES));
};

const printSpecialization = async (
  name: string,
  { phase, rawRequested }: Pick<ParsedCliArgs, 'phase' | 'rawRequested'>,
  cwd: string,
  packageRoot: URL
): Promise<void> => {
  if (!isSpecializationName(name))
    throw new Error(invalidSpecializationName(name));

  const reader = phaseNamed(phase);
  const text = await readSpecialization(cwd, packageRoot, name);

  if (text === undefined) throw new Error(noSpecialization(name));
  if (isBlank(text)) throw new Error(emptySpecialization(name));

  const read = rawRequested ? text : tailorSpecialization(text, reader);

  if (isBlank(read)) throw new Error(nothingForRead(name));

  stdout.write(read);
};

/** Lists the project's catalog, or prints the one specialization it resolves under a name, as its reader needs it or as its file is written */
export const runCatalog = async (
  args: ParsedCliArgs,
  cwd: string,
  packageRoot: URL
): Promise<void> => {
  const { phase, rawRequested } = args;
  const [name, ...others] = args.values;
  const contradictsItself = phase !== undefined && rawRequested;

  if (others.length > 0 || contradictsItself) throw new Error(catalogUsage());
  if (name !== undefined)
    return printSpecialization(name, args, cwd, packageRoot);

  const shapesRead = phase !== undefined || rawRequested;

  if (shapesRead) throw new Error(catalogUsage());

  stdout.write(list(await catalogEntries(cwd)));
};
