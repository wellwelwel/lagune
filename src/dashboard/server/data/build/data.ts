import type { DashboardData } from '../../../../types/dashboard/dashboard';
import { join, resolve } from 'node:path';
import { readOwnIndex, resolveCatalog } from '../../../../catalog/project';
import {
  readProjectCategories,
  usedCategories,
} from '../../../../categories/project';
import { bulletField } from '../../../../core/markdown/fields';
import { readMarkdown, readText } from '../../../../core/markdown/read';
import { parseTracking, pathsByName } from '../tracking';
import { buildCatalog } from './catalog';
import { buildCharter } from './charter';
import { buildFindings } from './findings';
import { buildHistory } from './history';
import { matchProject, matchVersion } from './meta';
import { buildPhases } from './phases';
import { buildSideQuests } from './sidequests';

export const buildData = async (laguneDir: string): Promise<DashboardData> => {
  const projectRoot = resolve(laguneDir, '..');
  const [detect, plan, harden, charter, history, tracking, categories, own] =
    await Promise.all([
      readMarkdown(join(laguneDir, 'memory/detect.md')),
      readMarkdown(join(laguneDir, 'memory/plan.md')),
      readMarkdown(join(laguneDir, 'memory/harden.md')),
      readMarkdown(join(laguneDir, 'memory/charter.md')),
      readMarkdown(join(laguneDir, 'memory/history.md')),
      readText(join(laguneDir, 'tracking.json')),
      readProjectCategories(projectRoot).catch(() => undefined),
      readOwnIndex(projectRoot).catch(() => []),
    ]);
  const used = usedCategories(categories);
  const entries = await resolveCatalog(projectRoot, used, own);

  const findings = buildFindings(
    detect,
    plan,
    harden,
    pathsByName(parseTracking(tracking))
  );

  return {
    project: matchProject(detect, charter),
    version: matchVersion(charter),
    tagline: 'Read-only view of .lagune/ · live',
    scope: bulletField(detect, 'Scope'),
    dates: {
      mapped: bulletField(detect, 'Mapped'),
      planned: bulletField(plan, 'Planned'),
      hardened: bulletField(harden, 'Hardened'),
    },
    phases: buildPhases(charter, detect, plan, harden, findings),
    findings,
    sidequests: buildSideQuests(detect, plan, harden),
    charter: buildCharter(charter),
    catalog: buildCatalog(detect, entries),
    categories: {
      used,
      recorded: categories !== undefined,
    },
    history: buildHistory(history).reverse(),
    artifacts: [detect, plan, harden, charter, history].some(
      (artifact) => artifact !== null
    ),
  };
};
