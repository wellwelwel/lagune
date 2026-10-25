import type { CatalogEntry } from '../../../../types/catalog';
import type { CatalogItem } from '../../../../types/dashboard/dashboard';
import { specializationLabel } from '../../../shared/specialization-meta';
import { parseApplied } from '../parsers';

/** The specializations detect applied first, then the rest of the project's catalog */
export const buildCatalog = (
  detect: string | null,
  entries: CatalogEntry[]
): CatalogItem[] => {
  const inCatalog = new Set(entries.map((entry) => entry.name));
  const applied = parseApplied(detect).map((specialization): CatalogItem => ({
    ...specialization,
    applied: true,
    inCatalog: inCatalog.has(specialization.name),
  }));
  const appliedNames = new Set(applied.map((item) => item.name));
  const rest = entries
    .filter((entry) => !appliedNames.has(entry.name))
    .map((entry): CatalogItem => ({
      name: entry.name,
      label: specializationLabel(entry.name),
      applied: false,
      inCatalog: true,
    }));

  return [...applied, ...rest];
};
