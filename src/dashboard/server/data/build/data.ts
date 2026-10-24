import type { ProjectCatalog } from '../../../../types/catalog';
import type { DashboardData } from '../../../../types/dashboard/dashboard';
import { join, resolve } from 'node:path';
import {
  readProjectCatalog,
  resolveCatalog,
  usedCategories,
} from '../../../../catalog/project';
import { bulletField } from '../../../../core/markdown/fields';
import { readMarkdown, readText } from '../../../../core/markdown/read';
import { loadVersion } from '../../../../core/version';
import { parseTracking, pathsByName } from '../tracking';
import { buildCatalog } from './catalog';
import { buildCharter } from './charter';
import { buildFindings } from './findings';
import { buildHistory } from './history';
import { matchProject, matchVersion } from './meta';
import { buildPhases } from './phases';
import { buildSideQuests } from './sidequests';

const UNREADABLE_CATALOG: ProjectCatalog = {
  categories: undefined,
  entries: [],
};

export const buildData = async (
  laguneDir: string,
  packageRoot: URL
): Promise<DashboardData> => {
  const projectRoot = resolve(laguneDir, '..');
  const [detect, plan, harden, charter, history, tracking, project, engine] =
    await Promise.all([
      readMarkdown(join(laguneDir, 'memory/detect.md')),
      readMarkdown(join(laguneDir, 'memory/plan.md')),
      readMarkdown(join(laguneDir, 'memory/harden.md')),
      readMarkdown(join(laguneDir, 'memory/charter.md')),
      readMarkdown(join(laguneDir, 'memory/history.md')),
      readText(join(laguneDir, 'tracking.json')),
      readProjectCatalog(projectRoot).catch(() => UNREADABLE_CATALOG),
      loadVersion(packageRoot).catch(() => null),
    ]);
  const entries = await resolveCatalog(projectRoot, project);

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
      used: usedCategories(project),
      recorded: project.categories !== undefined,
    },
    history: buildHistory(history).reverse(),
    artifacts: [detect, plan, harden, charter, history].some(
      (artifact) => artifact !== null
    ),
    engine,
  };
};
