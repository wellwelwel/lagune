import type { AgentSpec } from './lagune';
import { AGENT_SPECS, agentIcon, SKILL_GROUPS, skillGroupIcon } from './lagune';

export type AgentSuccessor = {
  key: string;
  name: string;
};

export type AgentDeprecation =
  { successor: AgentSuccessor } | { endOfLife: string };

export type Agent = {
  key: string;
  name: string;
  url: string;
  icon: string;
  deprecation?: AgentDeprecation;
};

export type AgentNote = {
  lead: string;
  code?: string;
};

export type Category = {
  key: string;
  name: string;
  description: string;
  icon: string;
};

const FEATURED_AGENT_KEYS = [
  'claude',
  'codex',
  'cursor-agent',
  'agy',
  'copilot',
];

const specByKey = new Map(AGENT_SPECS.map((spec) => [spec.key, spec]));

const successorOf = (key: string): AgentSuccessor => {
  const spec = specByKey.get(key);

  if (spec === undefined) throw new Error(`Unknown successor agent "${key}"`);

  return { key: spec.key, name: spec.displayName };
};

const deprecationOf = (spec: AgentSpec): AgentDeprecation | undefined => {
  if (spec.deprecated === undefined) return undefined;
  if ('endOfLife' in spec.deprecated)
    return { endOfLife: spec.deprecated.endOfLife };

  return { successor: successorOf(spec.deprecated.successor) };
};

const toAgent = (spec: AgentSpec): Agent => ({
  key: spec.key,
  name: spec.displayName,
  url: spec.url,
  icon: agentIcon(spec),
  deprecation: deprecationOf(spec),
});

const byName = (left: Agent, right: Agent): number =>
  left.name.localeCompare(right.name, 'en', { sensitivity: 'base' });

export const deprecationNote = (deprecation: AgentDeprecation): AgentNote =>
  'endOfLife' in deprecation
    ? { lead: `Deprecated by the vendor after ${deprecation.endOfLife}` }
    : {
        lead: `Deprecated, renamed ${deprecation.successor.name}`,
        code: deprecation.successor.key,
      };

export const ALL_AGENTS: Agent[] = AGENT_SPECS.map(toAgent).sort(byName);

export const AGENTS: Agent[] = FEATURED_AGENT_KEYS.flatMap((key) =>
  ALL_AGENTS.filter((agent) => agent.key === key)
);

export const ALL_CATEGORIES: Category[] = SKILL_GROUPS.map((group) => ({
  key: group.key,
  name: group.label,
  description: group.description,
  icon: skillGroupIcon(group.key),
}));
