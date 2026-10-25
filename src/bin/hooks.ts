import type { HookHandler, HookName } from '../types/core.js';
import { run as agent } from '../hooks/agent/cli.js';
import { run as cors } from '../hooks/cors/cli.js';
import { run as crypto } from '../hooks/crypto/cli.js';
import { run as cvss } from '../hooks/cvss/cli.js';
import { run as infra } from '../hooks/infra/cli.js';
import { run as interpreter } from '../hooks/interpreter/cli.js';
import { run as jwt } from '../hooks/jwt/cli.js';
import { run as network } from '../hooks/network/cli.js';
import { run as regex } from '../hooks/regex/cli.js';
import { run as repair } from '../hooks/repair/cli.js';
import { run as secrets } from '../hooks/secrets/cli.js';
import { run as track } from '../hooks/track/cli.js';
import { run as untrack } from '../hooks/untrack/cli.js';
import { run as validate } from '../hooks/validate/cli.js';

export const HOOKS: Record<HookName, HookHandler> = {
  agent,
  cors,
  crypto,
  cvss,
  infra,
  interpreter,
  jwt,
  network,
  regex,
  repair,
  secrets,
  track,
  untrack,
  validate,
};

export const isHookName = (value: string | undefined): value is HookName =>
  value !== undefined && Object.hasOwn(HOOKS, value);
