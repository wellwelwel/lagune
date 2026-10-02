import type {
  AgentProvider,
  BundledAssets,
  CommandWrite,
  FileOutcome,
  LinkedFile,
  PlannedCommandWrite,
  ReconstructOptions,
  RefreshOptions,
  RefreshResult,
  ScaffoldOptions,
  ScaffoldResult,
  TemplateKey,
} from '../types/core.js';
import { dirname, join, relative } from 'node:path';
import { planCommandReuse } from './command-reuse.js';
import {
  ensureDir,
  pathExists,
  removeSymlinkIfPresent,
  writeFileIfAbsent,
  writeFileOverwrite,
  writeSymlinkIfAbsent,
  writeSymlinkOverwrite,
} from './fs-actions.js';
import { restampManifestVersion } from './manifest.js';
import {
  emptySkillsCatalog,
  serializeSkillsCatalog,
} from './skills-catalog.js';
import { renderSpecializations } from './specializations.js';
import { emptyTrackingMap, serializeTrackingMap } from './tracking.js';

const MEMORY_DIR = '.lagune/memory';
const MANIFEST_PATH = '.lagune/manifest.json';
const TRACKING_PATH = '.lagune/tracking.json';
const SKILLS_CATALOG_PATH = '.lagune/skills.json';

const templateJobs = (
  templates: ScaffoldOptions['assets']['templates']
): CommandWrite[] => {
  const keys = Object.keys(templates) as TemplateKey[];

  return keys.map((key) => ({
    relativePath: `.lagune/templates/${templates[key].fileName}`,
    contents: templates[key].contents,
  }));
};

const hookJobs = (hooks: ScaffoldOptions['assets']['hooks']): CommandWrite[] =>
  hooks.map((hook) => ({
    relativePath: `.lagune/hooks/${hook.fileName}`,
    contents: hook.contents,
  }));

const skillJobs = (
  skills: ScaffoldOptions['assets']['skills']
): CommandWrite[] =>
  skills.map((skill) => ({
    relativePath: `.lagune/skills/${skill.fileName}`,
    contents: skill.contents,
  }));

const toAbsolute = (targetDir: string, relativePath: string): string =>
  join(targetDir, relativePath);

const sharedJobs = (assets: BundledAssets): CommandWrite[] => [
  ...templateJobs(assets.templates),
  ...hookJobs(assets.hooks),
  ...skillJobs(assets.skills),
];

const userStateJobs = (): CommandWrite[] => [
  {
    relativePath: TRACKING_PATH,
    contents: serializeTrackingMap(emptyTrackingMap()),
  },
  {
    relativePath: SKILLS_CATALOG_PATH,
    contents: serializeSkillsCatalog(emptySkillsCatalog()),
  },
];

const ensureJobDirs = async (
  targetDir: string,
  jobs: CommandWrite[]
): Promise<void> => {
  await Promise.all(
    jobs.map((job) =>
      ensureDir(dirname(toAbsolute(targetDir, job.relativePath)))
    )
  );
};

const writeJobsIfAbsent = (
  targetDir: string,
  jobs: CommandWrite[]
): Promise<FileOutcome[]> =>
  Promise.all(
    jobs.map(async (job): Promise<FileOutcome> => {
      const outcome = await writeFileIfAbsent(
        toAbsolute(targetDir, job.relativePath),
        job.contents
      );

      return { path: job.relativePath, status: outcome.status };
    })
  );

const relativeLinkTarget = (
  targetDir: string,
  linkRelativePath: string,
  ownerRelativePath: string
): string =>
  relative(
    dirname(toAbsolute(targetDir, linkRelativePath)),
    toAbsolute(targetDir, ownerRelativePath)
  );

const reclaimFileIfAbsent = async (
  absolutePath: string,
  contents: string
): Promise<FileOutcome> => {
  const outcome = await writeFileIfAbsent(absolutePath, contents);

  if (outcome.status === 'created') return outcome;
  if (!(await removeSymlinkIfPresent(absolutePath))) return outcome;
  return writeFileIfAbsent(absolutePath, contents);
};

const linkFileIfAbsent = async (
  targetDir: string,
  job: PlannedCommandWrite,
  linkTo: string
): Promise<FileOutcome> => {
  const linkPath = toAbsolute(targetDir, job.relativePath);

  if (!(await pathExists(toAbsolute(targetDir, linkTo))))
    return reclaimFileIfAbsent(linkPath, job.contents);

  try {
    return await writeSymlinkIfAbsent(
      linkPath,
      relativeLinkTarget(targetDir, job.relativePath, linkTo)
    );
  } catch {
    return reclaimFileIfAbsent(linkPath, job.contents);
  }
};

const writePlannedIfAbsent = async (
  targetDir: string,
  job: PlannedCommandWrite
): Promise<FileOutcome> => {
  const outcome =
    job.linkTo === undefined
      ? await reclaimFileIfAbsent(
          toAbsolute(targetDir, job.relativePath),
          job.contents
        )
      : await linkFileIfAbsent(targetDir, job, job.linkTo);

  if (outcome.status === 'linked')
    return { path: job.relativePath, status: 'linked', linkTo: job.linkTo };

  return { path: job.relativePath, status: outcome.status };
};

const splitPlanned = (
  jobs: PlannedCommandWrite[]
): { files: PlannedCommandWrite[]; links: PlannedCommandWrite[] } => ({
  files: jobs.filter((job) => job.linkTo === undefined),
  links: jobs.filter((job) => job.linkTo !== undefined),
});

const writePlannedJobsIfAbsent = async (
  targetDir: string,
  jobs: PlannedCommandWrite[]
): Promise<FileOutcome[]> => {
  const { files, links } = splitPlanned(jobs);
  const fileOutcomes = await Promise.all(
    files.map((job) => writePlannedIfAbsent(targetDir, job))
  );
  const linkOutcomes = await Promise.all(
    links.map((job) => writePlannedIfAbsent(targetDir, job))
  );

  return [...fileOutcomes, ...linkOutcomes];
};

const overwriteAsFile = async (
  absolutePath: string,
  contents: string
): Promise<void> => {
  await removeSymlinkIfPresent(absolutePath);
  await writeFileOverwrite(absolutePath, contents);
};

const writePlannedOverwrite = async (
  targetDir: string,
  job: PlannedCommandWrite
): Promise<string> => {
  const absolutePath = toAbsolute(targetDir, job.relativePath);
  const { linkTo } = job;

  if (
    linkTo === undefined ||
    !(await pathExists(toAbsolute(targetDir, linkTo)))
  ) {
    await overwriteAsFile(absolutePath, job.contents);

    return job.relativePath;
  }

  try {
    await writeSymlinkOverwrite(
      absolutePath,
      relativeLinkTarget(targetDir, job.relativePath, linkTo)
    );
  } catch {
    await overwriteAsFile(absolutePath, job.contents);
  }

  return job.relativePath;
};

const writePlannedJobsOverwrite = async (
  targetDir: string,
  jobs: PlannedCommandWrite[]
): Promise<string[]> => {
  const { files, links } = splitPlanned(jobs);
  const fileWritten = await Promise.all(
    files.map((job) => writePlannedOverwrite(targetDir, job))
  );
  const linkWritten = await Promise.all(
    links.map((job) => writePlannedOverwrite(targetDir, job))
  );

  return [...fileWritten, ...linkWritten];
};

const providerCommandPlan = (
  installedProviders: AgentProvider[],
  provider: AgentProvider,
  assets: BundledAssets
): PlannedCommandWrite[] => {
  const providerPaths = new Set(
    provider.buildCommands(assets).map((command) => command.relativePath)
  );

  return planCommandReuse([...installedProviders, provider], assets).filter(
    (job) => providerPaths.has(job.relativePath)
  );
};

const renderSpecializationsOutcome = async (
  targetDir: string
): Promise<FileOutcome> => {
  const existed = await pathExists(
    toAbsolute(targetDir, '.lagune/specializations.md')
  );
  const path = await renderSpecializations(targetDir);

  return { path, status: existed ? 'skipped' : 'created' };
};

const pathsWithStatus = (
  outcomes: FileOutcome[],
  status: FileOutcome['status']
): string[] =>
  outcomes
    .filter((outcome) => outcome.status === status)
    .map((outcome) => outcome.path);

const linkedFiles = (outcomes: FileOutcome[]): LinkedFile[] =>
  outcomes.flatMap((outcome) =>
    outcome.status === 'linked' && outcome.linkTo !== undefined
      ? [{ path: outcome.path, target: outcome.linkTo }]
      : []
  );

const toScaffoldResult = (outcomes: FileOutcome[]): ScaffoldResult => ({
  created: pathsWithStatus(outcomes, 'created'),
  linked: linkedFiles(outcomes),
  skipped: pathsWithStatus(outcomes, 'skipped'),
  manifestPath: MANIFEST_PATH,
});

export const scaffold = async (
  options: ScaffoldOptions
): Promise<ScaffoldResult> => {
  const { targetDir, provider, installedProviders = [], assets } = options;
  const fileJobs = [...sharedJobs(assets), ...userStateJobs()];
  const commandJobs = provider
    ? providerCommandPlan(installedProviders, provider, assets)
    : [];

  await ensureDir(toAbsolute(targetDir, MEMORY_DIR));
  await ensureJobDirs(targetDir, [...fileJobs, ...commandJobs]);

  const outcomes = [
    ...(await writeJobsIfAbsent(targetDir, fileJobs)),
    ...(await writePlannedJobsIfAbsent(targetDir, commandJobs)),
  ];

  return toScaffoldResult([
    ...outcomes,
    await renderSpecializationsOutcome(targetDir),
  ]);
};

export const refresh = async (
  options: RefreshOptions
): Promise<RefreshResult> => {
  const { targetDir, providers, assets, version, now } = options;
  const fileJobs = sharedJobs(assets);
  const commandJobs = planCommandReuse(providers, assets);

  await ensureJobDirs(targetDir, [...fileJobs, ...commandJobs]);

  const written = await Promise.all(
    fileJobs.map(async (job): Promise<string> => {
      await writeFileOverwrite(
        toAbsolute(targetDir, job.relativePath),
        job.contents
      );

      return job.relativePath;
    })
  );
  const commandsWritten = await writePlannedJobsOverwrite(
    targetDir,
    commandJobs
  );

  const refreshed = [
    ...written,
    ...commandsWritten,
    await renderSpecializations(targetDir),
  ];

  await restampManifestVersion(targetDir, { version, now, files: refreshed });

  return { refreshed, manifestPath: MANIFEST_PATH };
};

export const reconstruct = async (
  options: ReconstructOptions
): Promise<ScaffoldResult> => {
  const { targetDir, providers, assets } = options;
  const fileJobs = sharedJobs(assets);
  const commandJobs = planCommandReuse(providers, assets);

  await ensureJobDirs(targetDir, [...fileJobs, ...commandJobs]);

  const outcomes = [
    ...(await writeJobsIfAbsent(targetDir, fileJobs)),
    ...(await writePlannedJobsIfAbsent(targetDir, commandJobs)),
  ];

  return toScaffoldResult([
    ...outcomes,
    await renderSpecializationsOutcome(targetDir),
  ]);
};
