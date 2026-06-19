import type {
  CommandWrite,
  FileOutcome,
  ScaffoldOptions,
  ScaffoldResult,
  TemplateKey,
} from '../types/core.js';
import { dirname, join } from 'node:path';
import { ensureDir, writeFileIfAbsent } from './fs-actions.js';
import { buildManifest, serializeManifest } from './manifest.js';
import {
  emptySkillsCatalog,
  serializeSkillsCatalog,
} from './skills-catalog.js';
import { emptyTrackingMap, serializeTrackingMap } from './tracking.js';

const MEMORY_DIR = '.bluespec/memory';
const MANIFEST_PATH = '.bluespec/manifest.json';
const TRACKING_PATH = '.bluespec/tracking.json';
const SKILLS_CATALOG_PATH = '.bluespec/skills.json';

const templateJobs = (
  templates: ScaffoldOptions['assets']['templates']
): CommandWrite[] => {
  const keys = Object.keys(templates) as TemplateKey[];

  return keys.map((key) => ({
    relativePath: `.bluespec/templates/${templates[key].fileName}`,
    contents: templates[key].contents,
  }));
};

const hookJobs = (hooks: ScaffoldOptions['assets']['hooks']): CommandWrite[] =>
  hooks.map((hook) => ({
    relativePath: `.bluespec/hooks/${hook.fileName}`,
    contents: hook.contents,
  }));

const skillJobs = (
  skills: ScaffoldOptions['assets']['skills']
): CommandWrite[] =>
  skills.map((skill) => ({
    relativePath: `.bluespec/skills/${skill.fileName}`,
    contents: skill.contents,
  }));

const toAbsolute = (targetDir: string, relativePath: string): string =>
  join(targetDir, relativePath);

export const scaffold = async (
  options: ScaffoldOptions
): Promise<ScaffoldResult> => {
  const { targetDir, provider, assets, version, now } = options;
  const jobs: CommandWrite[] = [
    ...templateJobs(assets.templates),
    ...hookJobs(assets.hooks),
    ...skillJobs(assets.skills),
    ...provider.buildCommands(assets),
    {
      relativePath: TRACKING_PATH,
      contents: serializeTrackingMap(emptyTrackingMap()),
    },
    {
      relativePath: SKILLS_CATALOG_PATH,
      contents: serializeSkillsCatalog(emptySkillsCatalog()),
    },
  ];

  await ensureDir(toAbsolute(targetDir, MEMORY_DIR));
  await Promise.all(
    jobs.map((job) =>
      ensureDir(dirname(toAbsolute(targetDir, job.relativePath)))
    )
  );

  const outcomes: FileOutcome[] = await Promise.all(
    jobs.map(async (job) => {
      const outcome = await writeFileIfAbsent(
        toAbsolute(targetDir, job.relativePath),
        job.contents
      );

      return { path: job.relativePath, status: outcome.status };
    })
  );

  const created = outcomes
    .filter((outcome) => outcome.status === 'created')
    .map((outcome) => outcome.path);
  const skipped = outcomes
    .filter((outcome) => outcome.status === 'skipped')
    .map((outcome) => outcome.path);

  const manifest = buildManifest({
    version,
    agent: provider.key,
    now,
    files: created,
  });

  await writeFileIfAbsent(
    toAbsolute(targetDir, MANIFEST_PATH),
    serializeManifest(manifest)
  );

  return { created, skipped, manifestPath: MANIFEST_PATH };
};
