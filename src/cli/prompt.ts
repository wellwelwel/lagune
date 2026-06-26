import type { AgentChoice, ListTarget, SkillGroup } from '../types/core.js';
import { stdin } from 'node:process';
import {
  interactiveMultiSelect,
  interactiveSelect,
} from './interactive-select.js';
import {
  agentSelectHint,
  agentSelectTitle,
  listSelectHint,
  listSelectTitle,
  selectionAborted,
  skillsSelectHint,
  skillsSelectTitle,
} from './messages.js';

export const isInteractive = (): boolean => stdin.isTTY === true;

const LIST_TARGETS: { value: ListTarget; label: string }[] = [
  {
    value: 'findings',
    label: 'Findings: the security findings Blue Spec tracks',
  },
  {
    value: 'skills',
    label: 'Skills: the specialization categories and their state',
  },
];

export const promptForListTarget = async (): Promise<
  ListTarget | undefined
> => {
  const index = await interactiveSelect({
    title: listSelectTitle(),
    hint: listSelectHint(),
    options: LIST_TARGETS.map((target) => ({
      label: target.label,
      keywords: target.value,
    })),
    confirmLabel: 'List:',
  });

  if (index === undefined) return undefined;

  return LIST_TARGETS[index].value;
};

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
