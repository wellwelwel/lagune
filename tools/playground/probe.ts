import { appendFileSync } from 'node:fs';
import process from 'node:process';
import { createInterface } from 'node:readline';

type JsonObject = Record<string, unknown>;

type Client = { info: unknown; protocolVersion: unknown; roots: unknown };

type Received = {
  cwd: string;
  variables: string[];
  environment: Record<string, string | undefined>;
  runtime: { execPath: string; node: string; bun: string | null };
};

type State = { received: Received; client: Client | null; roots: unknown };

type Handler = (id: unknown, params: unknown) => void;

const SECRET = /KEY|TOKEN|SECRET|PASS|AUTH|COOKIE|CREDENTIAL|SESSION/i;
const WORKSPACE = /PROJECT|WORKSPACE|PLUGIN|ROOT|PWD|CWD|DIR$|EXTENSION/i;
const ROOTS_REQUEST = 'probe-roots';
const METHOD_NOT_FOUND = -32601;

const isObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const fieldOf = (value: unknown, key: string): unknown =>
  isObject(value) ? value[key] : undefined;

const optionAfter = (name: string): string | undefined => {
  const index = process.argv.indexOf(name);

  return index === -1 ? undefined : process.argv[index + 1];
};

const variablesAfter = (name: string): string[] => {
  const index = process.argv.indexOf(name);

  return index === -1 ? [] : process.argv.slice(index + 1);
};

const logFile = optionAfter('--log');
const serverName = optionAfter('--name') ?? 'probe';
const received: Received = {
  cwd: process.cwd(),
  variables: variablesAfter('--vars'),
  environment: Object.fromEntries(
    Object.entries(process.env).filter(
      ([name]) => WORKSPACE.test(name) && !SECRET.test(name)
    )
  ),
  runtime: {
    execPath: process.execPath,
    node: process.versions.node,
    bun: process.versions.bun ?? null,
  },
};
const state: State = { received, client: null, roots: null };

const record = (event: string, details: JsonObject): void => {
  if (logFile === undefined) return;

  appendFileSync(
    logFile,
    `${JSON.stringify({ at: new Date().toISOString(), server: serverName, event, ...details })}\n`
  );
};

const send = (message: JsonObject): void => {
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', ...message })}\n`);
};

const askForRoots = (): void =>
  send({ id: ROOTS_REQUEST, method: 'roots/list' });

const reply = (id: unknown, result: JsonObject): void => send({ id, result });

const HANDLERS: Record<string, Handler> = {
  initialize: (id, params) => {
    const protocolVersion = fieldOf(params, 'protocolVersion') ?? null;

    state.client = {
      info: fieldOf(params, 'clientInfo') ?? null,
      protocolVersion,
      roots: fieldOf(fieldOf(params, 'capabilities'), 'roots') ?? null,
    };

    record('initialize', { client: state.client });
    reply(id, {
      protocolVersion: protocolVersion ?? '2025-06-18',
      capabilities: { tools: Object.create(null) },
      serverInfo: { name: 'lagune-probe', version: '0.0.0' },
    });
  },
  'notifications/initialized': () => {
    if (state.client?.roots) return askForRoots();

    record('roots', { advertised: false });
  },
  'notifications/roots/list_changed': () => askForRoots(),
  'tools/list': (id) =>
    reply(id, {
      tools: [
        {
          name: 'where',
          description:
            'Reports the folder, variables, environment, and MCP roots this plugin server received.',
          inputSchema: { type: 'object', properties: Object.create(null) },
        },
      ],
    }),
  'tools/call': (id) => {
    record('call', Object.create(null));
    reply(id, {
      content: [{ type: 'text', text: JSON.stringify(state, null, 2) }],
    });
  },
  ping: (id) => reply(id, Object.create(null)),
};

const handle = (message: JsonObject): void => {
  const { id, method, params } = message;

  if (id === ROOTS_REQUEST) {
    state.roots = fieldOf(message.result, 'roots') ?? null;

    return record('roots', {
      advertised: true,
      roots: state.roots,
      error: message.error ?? null,
    });
  }

  if (typeof method === 'string' && Object.hasOwn(HANDLERS, method))
    return HANDLERS[method](id, params);
  if (id === undefined) return record('notification', { method });

  send({ id, error: { code: METHOD_NOT_FOUND, message: 'Method not found' } });
};

if (logFile === undefined) {
  process.stderr.write(
    'Usage: probe.ts --log <file> [--name <server>] [--vars <value>...]\n'
  );
  process.exit(1);
}

record('start', { received: state.received });

createInterface({ input: process.stdin }).on('line', (line) => {
  if (line.trim().length === 0) return;

  try {
    const message: unknown = JSON.parse(line);

    if (isObject(message)) handle(message);
  } catch (error) {
    record('unreadable', { line, error: String(error) });
  }
});
