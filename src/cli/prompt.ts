import type { AgentChoice, SkillGroup } from '../types/core.js';
import { stdin } from 'node:process';
import {
  interactiveMultiSelect,
  interactiveSelect,
} from './interactive-select.js';
import {
  agentSelectHint,
  agentSelectTitle,
  selectionAborted,
  skillsSelectHint,
  skillsSelectTitle,
} from './messages.js';

export const isInteractive = (): boolean => stdin.isTTY === true;

export const promptForAgent = async (
  agents: AgentChoice[]
): Promise<string> => {
  const index = await interactiveSelect({
    title: agentSelectTitle(),
    hint: agentSelectHint(),
    options: agents.map((agent) => ({
      label: agent.displayName,
      keywords: agent.key,
    })),
  });

  if (index === undefined) throw new Error(selectionAborted());

  return agents[index].key;
};

export const promptForSkills = async (
  groups: SkillGroup[]
): Promise<string[]> => {
  const indexes = await interactiveMultiSelect({
    title: skillsSelectTitle(),
    hint: skillsSelectHint(),
    options: groups.map((group) => ({
      label: `${group.label}: ${group.description}`,
      keywords: group.key,
    })),
  });

  if (indexes === undefined) return [];

  return indexes.map((index) => groups[index].key);
};
