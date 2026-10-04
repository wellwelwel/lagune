import type { AgentSpec } from '../../types/core';
import { iconPath } from './assets';

export const agentIcon = (spec: AgentSpec): string =>
  iconPath(spec.icon ?? spec.key);
