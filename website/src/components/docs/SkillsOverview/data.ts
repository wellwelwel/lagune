import type { SkillGroupBadge, SkillIconName } from '@site/src/data/lagune';
import {
  skillDescription,
  skillGroups,
  skillIconName,
  skillLabel,
  skillPromptTask,
  SKILLS_CATALOG,
} from '@site/src/data/lagune';

export type CatalogSkill = {
  name: string;
  label: string;
  icon: SkillIconName;
  description: string;
  promptTask: string;
  groups: SkillGroupBadge[];
};

const byName = (left: CatalogSkill, right: CatalogSkill): number =>
  left.name.localeCompare(right.name);

export const skillsCatalog: CatalogSkill[] = SKILLS_CATALOG.map((entry) => ({
  name: entry.name,
  label: skillLabel(entry.name),
  icon: skillIconName(entry.name),
  description: skillDescription(entry.name),
  promptTask: skillPromptTask(entry.name),
  groups: skillGroups(entry.name),
})).sort(byName);
