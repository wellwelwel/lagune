import type { CliCommand, ParsedCliArgs } from '../types/core.js';
import { parseArgs } from 'node:util';

const COMMANDS: CliCommand[] = [
  'catalog',
  'add',
  'remove',
  'list',
  'dashboard',
  'migrate',
  'init',
  'pull',
  'update',
];

const toCommand = (value: string | undefined): CliCommand | undefined =>
  COMMANDS.find((command) => command === value);

const parsePort = (value: unknown): number | undefined => {
  if (typeof value !== 'string') return undefined;

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1024 || port > 65535)
    throw new Error(`Invalid port: ${value} (expected 1024-65535)`);

  return port;
};

const parseNamed = (value: unknown, kind: string): string | undefined => {
  if (value === undefined || typeof value === 'string') return value;

  throw new Error(`--${kind} needs the name of a ${kind}`);
};

export const parseCliArgs = (argv: string[]): ParsedCliArgs => {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    strict: false,
    options: {
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
      categories: { type: 'boolean' },
      ignore: { type: 'boolean' },
      checker: { type: 'string' },
      findings: { type: 'boolean' },
      phase: { type: 'string' },
      raw: { type: 'boolean' },
      port: { type: 'string', short: 'p' },
    },
  });

  const [first, ...rest] = positionals;
  const command = toCommand(first);
  const categoriesRequested = values.categories === true;
  const ignoreRequested = values.ignore === true;
  const checker = parseNamed(values.checker, 'checker');
  const findingsRequested = values.findings === true;
  const phase = parseNamed(values.phase, 'phase');
  const rawRequested = values.raw === true;
  const help = values.help === true;
  const version = values.version === true;
  const bare =
    positionals.length === 0 &&
    !categoriesRequested &&
    !ignoreRequested &&
    checker === undefined &&
    !findingsRequested &&
    phase === undefined &&
    !rawRequested &&
    !help &&
    !version;

  return {
    command,
    unknown: command === undefined ? first : undefined,
    values: rest,
    categoriesRequested,
    ignoreRequested,
    checker,
    findingsRequested,
    phase,
    rawRequested,
    help,
    version,
    bare,
    port: parsePort(values.port),
  };
};
