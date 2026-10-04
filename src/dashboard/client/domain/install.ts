import type { InstallAgent, InstallCategory } from '@/types/dashboard/client';
import type { Install } from '@/types/dashboard/dashboard';
import { agentIcon } from '@/dashboard/shared/agent-meta';
import { skillGroupIcon } from '@/dashboard/shared/skill-meta';
import { SKILL_GROUPS } from '@/hooks/skills/groups';
import { AGENT_SPECS } from '@/providers/specs';

export const isLocked = (install: Install): boolean => !install.present;

export const AGENTS: InstallAgent[] = AGENT_SPECS.map((spec) => ({
  key: spec.key,
  name: spec.displayName,
  icon: agentIcon(spec),
}));

export const CATEGORIES: InstallCategory[] = SKILL_GROUPS.map((group) => ({
  key: group.key,
  name: group.label,
  description: group.description,
  icon: skillGroupIcon(group.key),
}));
