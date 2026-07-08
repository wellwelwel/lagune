import type {
  PerformInitInput,
  PerformInitResult,
  PerformPullInput,
  PerformPullResult,
  PerformSpecializeInput,
  PerformSpecializeResult,
  PerformUpdateInput,
  PerformUpdateResult,
} from '../types/core.js';
import { getProviders } from '../providers/registry.js';
import { loadAssets, loadVersion } from './assets.js';
import { ensureGitignoreEntries } from './gitignore.js';
import { addSkills, removeSkills, selectSkillAssets } from './manage-skills.js';
import {
  applyManifestChange,
  readManifestInstall,
  recordManifestInstall,
} from './manifest.js';
import { reconstruct, refresh, scaffold } from './scaffold.js';
import { renderSpecializations } from './specializations.js';

export const performInit = async (
  input: PerformInitInput
): Promise<PerformInitResult> => {
  const { cwd, packageRoot, provider, categoryKeys, now } = input;
  const [assets, version] = await Promise.all([
    loadAssets(packageRoot),
    loadVersion(packageRoot),
  ]);

  const result = await scaffold({
    targetDir: cwd,
    provider,
    assets: { ...assets, skills: selectSkillAssets(assets, categoryKeys) },
  });

  await recordManifestInstall(cwd, {
    agent: provider?.key,
    categories: categoryKeys,
    version,
    now,
    addFiles: result.created,
  });

  await renderSpecializations(cwd);

  const gitignore = await ensureGitignoreEntries(cwd);
  const { agents } = await readManifestInstall(cwd);

  return { scaffold: result, gitignore, installedAgents: agents };
};

export const performPull = async (
  input: PerformPullInput
): Promise<PerformPullResult> => {
  const { cwd, packageRoot } = input;
  const { agents, categories } = await readManifestInstall(cwd);

  if (agents.length === 0) return { initialized: false };

  const providers = getProviders(agents);
  const assets = await loadAssets(packageRoot);

  const scaffold = await reconstruct({
    targetDir: cwd,
    providers,
    assets: { ...assets, skills: selectSkillAssets(assets, categories) },
  });

  await renderSpecializations(cwd);

  const gitignore = await ensureGitignoreEntries(cwd);

  return { initialized: true, scaffold, gitignore, agents };
};

export const performUpdate = async (
  input: PerformUpdateInput
): Promise<PerformUpdateResult> => {
  const { cwd, packageRoot, now } = input;
  const { agents, categories } = await readManifestInstall(cwd);

  if (agents.length === 0) return { initialized: false };

  const providers = getProviders(agents);
  const [assets, version] = await Promise.all([
    loadAssets(packageRoot),
    loadVersion(packageRoot),
  ]);

  const result = await refresh({
    targetDir: cwd,
    providers,
    assets: { ...assets, skills: selectSkillAssets(assets, categories) },
    version,
    now,
  });

  await renderSpecializations(cwd);

  return { initialized: true, refresh: result, agents };
};

export const performSpecialize = async (
  input: PerformSpecializeInput
): Promise<PerformSpecializeResult> => {
  const { cwd, packageRoot, categories, now } = input;
  const { agents, categories: installed } = await readManifestInstall(cwd);

  if (agents.length === 0) return { initialized: false };

  const toAdd = categories.filter((key) => !installed.includes(key));
  const toRemove = installed.filter((key) => !categories.includes(key));

  const [assets, version] = await Promise.all([
    loadAssets(packageRoot),
    loadVersion(packageRoot),
  ]);

  const added = await addSkills(cwd, assets, installed, toAdd);
  const removed = await removeSkills(cwd, added.categories, toRemove);
  const createdFiles = added.outcomes
    .filter((outcome) => outcome.status === 'created')
    .map((outcome) => outcome.path);
  const removedFiles = removed.outcomes
    .filter((outcome) => outcome.status === 'removed')
    .map((outcome) => outcome.path);

  const changed =
    removed.categories.length !== installed.length ||
    removed.categories.some((key) => !installed.includes(key));

  if (changed)
    await applyManifestChange(
      cwd,
      {
        categories: removed.categories,
        addFiles: createdFiles,
        removeFiles: removedFiles,
      },
      { version, now }
    );

  await renderSpecializations(cwd);

  return {
    initialized: true,
    added: createdFiles.length,
    removed: removedFiles.length,
    categories: removed.categories,
  };
};
