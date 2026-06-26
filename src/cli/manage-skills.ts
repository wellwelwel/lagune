import type {
  BundledAssets,
  FileOutcome,
  SkillsChange,
} from '../types/core.js';
import { join } from 'node:path';
import {
  ensureDir,
  removeFileIfPresent,
  writeFileIfAbsent,
} from '../core/fs-actions.js';
import { SKILLS_CATALOG } from '../hooks/skills/catalog.js';
import { SKILL_GROUPS } from '../hooks/skills/groups.js';
import {
  expandCategories,
  groupKeysForSkill,
  skillNamesForGroups,
  unknownGroupKeys,
} from '../hooks/skills/skills.js';
import { unknownCategories } from './messages.js';

const SKILLS_DIR = '.bluespec/skills';

const relativePath = (name: string): string => `${SKILLS_DIR}/${name}`;

const resolveKeys = (categories: string[]): string[] => {
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

const union = (left: string[], right: string[]): string[] => [
  ...left,
  ...right.filter((key) => !left.includes(key)),
];

export const addSkills = async (
  targetDir: string,
  assets: BundledAssets,
  installed: string[],
  categories: string[]
): Promise<SkillsChange> => {
  const requested = resolveKeys(categories);
  const wanted = new Set(
    skillNamesForGroups(SKILLS_CATALOG, requested).map((name) => `${name}.md`)
  );

  const jobs = assets.skills.filter((skill) => wanted.has(skill.fileName));
  if (jobs.length === 0) return { outcomes: [], categories: installed };

  await ensureDir(join(targetDir, SKILLS_DIR));

  const outcomes = await Promise.all(
    jobs.map(async (skill): Promise<FileOutcome> => {
      const path = relativePath(skill.fileName);
      const outcome = await writeFileIfAbsent(
        join(targetDir, path),
        skill.contents
      );

      return { path, status: outcome.status };
    })
  );

  return { outcomes, categories: union(installed, requested) };
};

export const removeSkills = async (
  targetDir: string,
  installed: string[],
  categories: string[]
): Promise<SkillsChange> => {
  const requested = resolveKeys(categories);
  const remaining = installed.filter((key) => !requested.includes(key));
  const names = skillNamesForGroups(SKILLS_CATALOG, requested);

  const outcomes = await Promise.all(
    names.map(async (name): Promise<FileOutcome> => {
      const path = relativePath(`${name}.md`);
      const keptBy = groupKeysForSkill(SKILLS_CATALOG, name, remaining);

      if (keptBy.length > 0) return { path, status: 'kept', keptBy: keptBy[0] };

      const outcome = await removeFileIfPresent(join(targetDir, path));

      return { path, status: outcome.status };
    })
  );

  return { outcomes, categories: remaining };
};
