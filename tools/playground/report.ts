import { realpathSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

type JsonObject = Record<string, unknown>;

type Route = 'npx' | 'shell' | 'tools' | 'unrecorded';

type Call = {
  at: string;
  processId: number;
  route: string;
  args: string[];
  cwd: string;
  parent: string;
  npxCommand: string;
  npxYes: boolean;
  exit: number | undefined;
};

type NpxLaunch = { spec: string; yes: boolean; text: string };

const UNEXPANDED = /\$\{[^{}]*\}/;
const SHELL = /^(?:.*\/)?-?(?:ba|z|da|fi)?sh$/;

const [kind, logFile = '', project = '', ...rest] = process.argv.slice(2);

const isObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const fieldOf = (value: unknown, key: string): unknown =>
  isObject(value) ? value[key] : undefined;

const objectOf = (value: unknown, key: string): JsonObject => {
  const field = fieldOf(value, key);

  return isObject(field) ? field : {};
};

const textOf = (value: unknown, key: string): string => {
  const field = fieldOf(value, key);

  return typeof field === 'string' ? field : '';
};

const numberOf = (value: unknown, key: string): number | undefined => {
  const field = fieldOf(value, key);

  return typeof field === 'number' ? field : undefined;
};

const textsOf = (value: unknown, key: string): string[] => {
  const field = fieldOf(value, key);

  return Array.isArray(field)
    ? field.filter((item): item is string => typeof item === 'string')
    : [];
};

const readEntries = async (file: string): Promise<JsonObject[]> => {
  try {
    const text = await readFile(file, 'utf8');

    return text
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line): unknown => JSON.parse(line))
      .filter(isObject);
  } catch {
    return [];
  }
};

const canonical = (path: string): string => {
  try {
    return realpathSync(path);
  } catch {
    return resolve(path);
  }
};

const projectPath = canonical(project);

const isProject = (path: unknown): boolean =>
  typeof path === 'string' && path !== '' && canonical(path) === projectPath;

const where = (path: string): string =>
  isProject(path) ? 'the project' : `${path}, outside the project`;

const time = (at: string): string => new Date(at).toTimeString().slice(0, 8);

const toCall = (entry: JsonObject, exits: Map<number, number>): Call => {
  const processId = numberOf(entry, 'pid') ?? 0;

  return {
    at: textOf(entry, 'at'),
    processId,
    route: textOf(entry, 'route'),
    args: textsOf(entry, 'args'),
    cwd: textOf(entry, 'cwd'),
    parent: textOf(entry, 'parent'),
    npxCommand: textOf(objectOf(entry, 'npx'), 'command'),
    npxYes: objectOf(entry, 'npx').yes === true,
    exit: exits.get(processId),
  };
};

const npxLaunch = (call: Call): NpxLaunch | undefined => {
  if (call.npxCommand === '') return undefined;

  const [spec = '', ...words] = call.npxCommand
    .replace(/^npm exec /, '')
    .split(' ');

  return {
    spec,
    yes: call.npxYes,
    text: ['npx', ...(call.npxYes ? ['--yes'] : []), spec, ...words].join(' '),
  };
};

const failed = (call: Call): boolean =>
  call.exit !== undefined && call.exit !== 0;

const fromShell = (call: Call): boolean =>
  SHELL.test(call.parent.split(' ')[0] ?? '');

const routeOf = (call: Call): Route => {
  if (npxLaunch(call)) return 'npx';
  if (fromShell(call)) return 'shell';
  if (call.route === 'npx') return 'unrecorded';

  return 'tools';
};

const describeRoute = (call: Call, command: string): string => {
  const launch = npxLaunch(call);

  if (launch) return launch.text;

  const route = routeOf(call);

  if (route === 'shell')
    return `shell  ${command}, run straight from a shell, not through npx`;
  if (route === 'tools') return `tools  ${command}`;

  return `npx    ${command}, launch not recorded`;
};

const describeCall = (call: Call): string => {
  const outcome = failed(call) ? `, failed with exit code ${call.exit}` : '';

  return `${describeRoute(call, `lagune ${call.args.join(' ')}`)}${outcome}`;
};

const judgeFallback = (first: Call, version: string): string => {
  const route = routeOf(first);

  if (route === 'shell')
    return 'FAIL, the engine ran straight from a shell, not through npx';
  if (route === 'tools')
    return 'FAIL, the call reached the tools with the server removed';

  const launch = npxLaunch(first);

  if (!launch) return 'UNKNOWN, the npx launch was not recorded';

  const missing = [
    ...(launch.spec === `lagune@${version}`
      ? []
      : [`the pin lagune@${version}`]),
    ...(launch.yes ? [] : ['--yes']),
  ];

  return missing.length === 0
    ? 'PASS'
    : `FAIL, npx without ${missing.join(' and without ')}`;
};

const judge = (first: Call, mode: string, version: string): string => {
  if (mode === 'off') return judgeFallback(first, version);

  return routeOf(first) === 'tools'
    ? 'PASS'
    : "FAIL, the call skipped the plugin's tools";
};

const describeServer = (server: Call): string => {
  const [, requested = ''] = server.args;
  const serves =
    requested === '' || UNEXPANDED.test(requested)
      ? server.cwd
      : resolve(server.cwd, requested);

  return isProject(serves)
    ? `  ${time(server.at)}  serves the project`
    : `  ${time(server.at)}  starts in ${serves}, outside the project, so it serves the single folder its client lists as its MCP root, if any`;
};

const reportCalls = (
  entries: JsonObject[],
  mode: string,
  version: string
): void => {
  const exits = new Map(
    entries.flatMap((entry) => {
      const exit = numberOf(entry, 'exit');

      return exit === undefined ? [] : [[numberOf(entry, 'pid') ?? 0, exit]];
    })
  );
  const starts = entries
    .filter((entry) => Array.isArray(entry.args))
    .map((entry) => toCall(entry, exits));
  const servers = starts.filter(({ args }) => args[0] === 'mcp');
  const calls = starts.filter(({ args }) => args[0] !== 'mcp');
  const [first] = calls;

  console.log(
    mode === 'off'
      ? `Server off: the first engine call should be npx --yes lagune@${version}.\n`
      : "Server on: the first engine call should go through the plugin's tools.\n"
  );
  console.log(
    servers.length === 0 ? 'Engine server: none started.' : 'Engine server:'
  );

  for (const server of servers) console.log(describeServer(server));

  console.log(
    calls.length === 0 ? '\nEngine calls: none yet.' : '\nEngine calls:'
  );

  for (const call of calls)
    console.log(
      `  ${time(call.at)}  ${describeCall(call)}  (in ${where(call.cwd)})`
    );

  if (!first) {
    console.log(
      '\nNo verdict yet: run the charter command in a session first.'
    );
    return;
  }

  console.log(`\nFirst engine call: ${describeCall(first)}`);
  console.log(`Verdict: ${judge(first, mode, version)}`);

  if (failed(first))
    console.log(
      'Note: the route counts for the verdict, but the engine rejected that first command.'
    );

  if (calls.some(({ cwd }) => !isProject(cwd)))
    console.log('Warning: at least one call ran outside the project.');
};

const describeValue = (value: string): string =>
  isProject(value) ? `${value}  <- the project` : value;

const rootPath = (root: unknown): string => {
  const uri = textOf(root, 'uri');

  return uri.startsWith('file:') ? fileURLToPath(uri) : uri;
};

const lastEvent = (
  entries: JsonObject[],
  event: string
): JsonObject | undefined => entries.findLast((entry) => entry.event === event);

const reportRoots = (
  roots: JsonObject | undefined,
  channels: Set<string>
): void => {
  if (!roots) {
    console.log('  roots     not answered yet');
    return;
  }

  if (roots.advertised !== true) {
    console.log('  roots     not advertised by the client');
    return;
  }

  if (roots.error !== null && roots.error !== undefined) {
    console.log(`  roots     error: ${JSON.stringify(roots.error)}`);
    return;
  }

  const listed = Array.isArray(roots.roots) ? roots.roots : [];

  for (const root of listed) {
    const path = rootPath(root);

    if (isProject(path)) channels.add('MCP roots');

    console.log(`  root      ${describeValue(path)}`);
  }

  if (listed.length === 0) console.log('  roots     an empty list');
};

const reportServer = (
  entries: JsonObject[],
  name: string,
  channels: Set<string>
): void => {
  const own = entries.filter((entry) => entry.server === name);
  const start = lastEvent(own, 'start');
  const initialize = lastEvent(own, 'initialize');

  console.log(`\n${name}`);

  if (!start) {
    console.log('  never started');
    return;
  }

  const received = objectOf(start, 'received');
  const cwd = textOf(received, 'cwd');
  const runtime = objectOf(received, 'runtime');
  const bun = textOf(runtime, 'bun');

  if (isProject(cwd)) channels.add('its working folder');

  console.log(
    `  started   ${time(textOf(start, 'at'))} in ${describeValue(cwd)}`
  );
  console.log(
    `  runtime   ${bun === '' ? `node ${textOf(runtime, 'node')}` : `bun ${bun}`} at ${textOf(runtime, 'execPath')}`
  );

  for (const [variable, value] of Object.entries(
    objectOf(received, 'environment')
  )) {
    const text = String(value);

    if (isProject(text))
      channels.add(`the ${variable} variable of its environment`);

    console.log(`  env       ${variable}=${describeValue(text)}`);
  }

  for (const value of textsOf(received, 'variables')) {
    const expanded = !UNEXPANDED.test(value);

    if (expanded && isProject(value))
      channels.add('a placeholder in its arguments');

    console.log(
      `  argument  ${describeValue(value)}${expanded ? '' : '  (not expanded)'}`
    );
  }

  if (!initialize) {
    console.log('  client    no handshake logged');
    return;
  }

  const client = objectOf(initialize, 'client');
  const info = objectOf(client, 'info');
  const protocolVersion = textOf(client, 'protocolVersion') || 'unknown';

  console.log(
    `  client    ${textOf(info, 'name') || 'unknown'} ${textOf(info, 'version')}, protocol ${protocolVersion}`
  );

  reportRoots(lastEvent(own, 'roots'), channels);
};

const reportProbe = (entries: JsonObject[], servers: string[]): void => {
  const channels = new Set<string>();

  for (const name of servers) reportServer(entries, name, channels);

  console.log(
    channels.size === 0
      ? '\nNo channel named the project to a plugin server.'
      : `\nThe project reached a plugin server through: ${[...channels].join(', ')}.`
  );
};

const entries = await readEntries(logFile);

if (kind === 'calls') reportCalls(entries, rest[0] ?? 'on', rest[1] ?? '');
if (kind === 'probe') reportProbe(entries, rest);
