import type {
  BundledAssets,
  FileOutcome,
  ListTarget,
  ParsedCliArgs,
  TrackingMap,
} from '../types/core.js';
import { stdout } from 'node:process';
import { loadAssets, loadVersion } from '../core/assets.js';
import {
  applyManifestChange,
  readManifestCategories,
} from '../core/manifest.js';
import { scaffold } from '../core/scaffold.js';
import { loadTrackingMap } from '../core/tracking.js';
import { SKILLS_CATALOG } from '../hooks/skills/catalog.js';
import { SKILL_GROUPS } from '../hooks/skills/groups.js';
import {
  expandCategories,
  findGroup,
  skillNamesForGroups,
  unknownGroupKeys,
} from '../hooks/skills/skills.js';
import { listAgentKeys } from '../providers/registry.js';
import { addSkills, removeSkills } from './manage-skills.js';
import {
  addSummary,
  addUsage,
  categoryList,
  createdLine,
  helpText,
  keptLine,
  nextSteps,
  notInstalledLine,
  removedLine,
  removeSummary,
  removeUsage,
  skippedLine,
  summaryLine,
  unknownCategories,
} from './messages.js';
import { promptForListTarget } from './prompt.js';
import { selectAgent } from './select-agent.js';
import { selectCategories } from './select-categories.js';

const print = (line: string): void => {
  stdout.write(`${line}\n`);
};

const countStatus = (outcomes: FileOutcome[], status: string): number =>
  outcomes.filter((outcome) => outcome.status === status).length;

const pathsWithStatus = (outcomes: FileOutcome[], status: string): string[] =>
  outcomes
    .filter((outcome) => outcome.status === status)
    .map((outcome) => outcome.path);

const sameCategories = (left: string[], right: string[]): boolean =>
  left.length === right.length && left.every((key) => right.includes(key));

const resolveCategoryKeys = (categories: string[]): string[] => {
  const keys = expandCategories(SKILL_GROUPS, categories);
  const unknown = unknownGroupKeys(SKILL_GROUPS, keys);

  if (unknown.length > 0)
    throw new Error(
      unknownCategories(
        unknown,
        SKILL_GROUPS.map((group) => group.key)
      )
    );

  return keys;
};

const skillsForKeys = (
  assets: BundledAssets,
  keys: string[]
): BundledAssets['skills'] => {
  const chosen = new Set(
    skillNamesForGroups(SKILLS_CATALOG, keys).map((name) => `${name}.md`)
  );

  return assets.skills.filter((skill) => chosen.has(skill.fileName));
};

const groupsForKeys = (keys: string[]): typeof SKILL_GROUPS =>
  keys
    .map((key) => findGroup(SKILL_GROUPS, key))
    .filter((group) => group !== undefined);

const runInit = async (
  args: ParsedCliArgs,
  cwd: string,
  packageRoot: URL
): Promise<void> => {
  const provider = await selectAgent(args.agent);
  const categories = await selectCategories({
    requested: args.skills,
    shouldPrompt: args.skillsRequested || typeof args.agent !== 'string',
    groups: SKILL_GROUPS,
  });
  const keys = resolveCategoryKeys(categories);
  const [assets, version] = await Promise.all([
    loadAssets(packageRoot),
    loadVersion(packageRoot),
  ]);

  const result = await scaffold({
    targetDir: cwd,
    provider,
    assets: { ...assets, skills: skillsForKeys(assets, keys) },
    version,
    now: new Date(),
    categories: keys,
  });

  for (const path of result.created) print(createdLine(path));

  for (const path of result.skipped) print(skippedLine(path));

  print(summaryLine(provider.displayName, result));

  if (result.created.length > 0) print(nextSteps(provider.displayName));
};

const runAdd = async (
  args: ParsedCliArgs,
  cwd: string,
  packageRoot: URL
): Promise<void> => {
  if (!args.skillsRequested) {
    print(addUsage());
    return;
  }

  const categories = await selectCategories({
    requested: args.skills,
    shouldPrompt: true,
    groups: SKILL_GROUPS,
  });
  const [assets, version, installed] = await Promise.all([
    loadAssets(packageRoot),
    loadVersion(packageRoot),
    readManifestCategories(cwd),
  ]);
  const change = await addSkills(cwd, assets, installed, categories);

  if (!sameCategories(change.categories, installed))
    await applyManifestChange(
      cwd,
      {
        categories: change.categories,
        addFiles: pathsWithStatus(change.outcomes, 'created'),
        removeFiles: [],
      },
      { version, now: new Date() }
    );

  for (const outcome of change.outcomes)
    print(
      outcome.status === 'created'
        ? createdLine(outcome.path)
        : skippedLine(outcome.path)
    );

  print(
    addSummary(
      countStatus(change.outcomes, 'created'),
      countStatus(change.outcomes, 'skipped')
    )
  );
};

const removeLine = (outcome: FileOutcome): string => {
  if (outcome.status === 'removed') return removedLine(outcome.path);

  if (outcome.status === 'kept')
    return keptLine(outcome.path, outcome.keptBy ?? '');

  return notInstalledLine(outcome.path);
};

const runRemove = async (
  args: ParsedCliArgs,
  cwd: string,
  packageRoot: URL
): Promise<void> => {
  if (!args.skillsRequested) {
    print(removeUsage());

    return;
  }

  const [version, installed] = await Promise.all([
    loadVersion(packageRoot),
    readManifestCategories(cwd),
  ]);
  const categories = await selectCategories({
    requested: args.skills,
    shouldPrompt: true,
    groups: groupsForKeys(installed),
  });
  const change = await removeSkills(cwd, installed, categories);

  if (!sameCategories(change.categories, installed))
    await applyManifestChange(
      cwd,
      {
        categories: change.categories,
        addFiles: [],
        removeFiles: pathsWithStatus(change.outcomes, 'removed'),
      },
      { version, now: new Date() }
    );

  for (const outcome of change.outcomes) print(removeLine(outcome));

  print(
    removeSummary(
      countStatus(change.outcomes, 'removed'),
      countStatus(change.outcomes, 'absent'),
      countStatus(change.outcomes, 'kept')
    )
  );
};

const formatFindings = (map: TrackingMap): string => {
  if (map.entries.length === 0) return 'No findings tracked yet.';

  return `Findings:\n${map.entries.map((entry) => `- ${entry.name}`).join('\n')}`;
};

const printFindings = async (cwd: string): Promise<void> =>
  print(formatFindings(await loadTrackingMap(cwd)));

const printCategories = async (cwd: string): Promise<void> =>
  print(
    categoryList(SKILL_GROUPS, await readManifestCategories(cwd)).trimEnd()
  );

const resolveListTarget = async (
  args: ParsedCliArgs
): Promise<ListTarget | undefined> => {
  if (args.findingsRequested) return 'findings';

  if (args.skillsRequested) return 'skills';

  return promptForListTarget();
};

const runList = async (args: ParsedCliArgs, cwd: string): Promise<void> => {
  const target = await resolveListTarget(args);

  if (target === 'findings') await printFindings(cwd);

  if (target === 'skills') await printCategories(cwd);
};

export const run = async (
  args: ParsedCliArgs,
  cwd: string,
  packageRoot: URL
): Promise<void> => {
  if (args.version) {
    print(await loadVersion(packageRoot));

    return;
  }

  if (args.command === 'init') {
    await runInit(args, cwd, packageRoot);

    return;
  }

  if (args.command === 'add') {
    await runAdd(args, cwd, packageRoot);
    return;
  }

  if (args.command === 'remove') {
    await runRemove(args, cwd, packageRoot);
    return;
  }

  if (args.command === 'list') {
    await runList(args, cwd);
    return;
  }

  print(helpText(listAgentKeys()));
};
