import type { DependencyRead } from '../../../types/hooks/dependency.js';
import { subtablesAt, tableOrEmptyAt, textAt } from '../fields.js';
import { flagsRead } from '../read.js';
import { tomlOf } from '../toml.js';
import { plainUrlFlags } from '../transport.js';
import { dependencyTableFlags } from './manifest.js';

const SOURCE_URL_KEYS = ['registry', 'git'];

/** A .cargo/config.toml, read for the registry indexes and replacement sources it names and the dependencies it patches */
export const readCargoConfig = (
  file: string,
  content: string
): DependencyRead => {
  const config = tomlOf(file, content);
  const registry = tableOrEmptyAt(file, config, 'registry', '');
  const legacyIndex = textAt(file, registry, 'index', 'registry');
  const urls = [
    ...subtablesAt(file, config, 'registries', '').flatMap(
      ([where, table]) => textAt(file, table, 'index', where) ?? []
    ),
    ...(legacyIndex === undefined ? [] : [legacyIndex]),
    ...subtablesAt(file, config, 'source', '').flatMap(([where, table]) =>
      SOURCE_URL_KEYS.flatMap((key) => textAt(file, table, key, where) ?? [])
    ),
  ];

  return flagsRead([
    ...plainUrlFlags(urls),
    ...subtablesAt(file, config, 'patch', '').flatMap((table) =>
      dependencyTableFlags(file, table)
    ),
  ]);
};
