import type { Readable, Writable } from 'node:stream';
import type {
  JsonRpcId,
  McpAnswer,
  McpMethod,
  McpNotification,
  McpServer,
  McpSession,
} from '../types/mcp.js';
import { createInterface } from 'node:readline';
import { noServedProject } from '../cli/messages.js';
import { isRecord, readField } from '../core/collections.js';
import { runEngine } from './engine.js';
import { projectFromRoots } from './project.js';
import { describeTool, ENGINE_TOOLS, findTool, runTool } from './tools.js';

const LATEST_PROTOCOL = '2025-11-25';
const PROTOCOLS = new Set([
  LATEST_PROTOCOL,
  '2025-06-18',
  '2025-03-26',
  '2024-11-05',
]);

const PARSE_ERROR = -32700;
const INVALID_REQUEST = -32600;
const METHOD_NOT_FOUND = -32601;
const INVALID_PARAMS = -32602;
const INTERNAL_ERROR = -32603;

const isRequestId = (value: unknown): value is JsonRpcId =>
  typeof value === 'string' || typeof value === 'number';

const failure = (code: number, message: string): McpAnswer => ({
  error: { code, message },
});

const toolResult = (text: string, isError: boolean): McpAnswer => ({
  result: { content: [{ type: 'text', text }], isError },
});

const initialize: McpMethod = (params, session) => {
  const requested = readField(params, 'protocolVersion');

  session.rootsOffered = isRecord(
    readField(readField(params, 'capabilities'), 'roots')
  );

  return {
    result: {
      protocolVersion:
        typeof requested === 'string' && PROTOCOLS.has(requested)
          ? requested
          : LATEST_PROTOCOL,
      capabilities: { tools: Object.create(null) },
      serverInfo: { name: 'lagune', version: session.server.version },
    },
  };
};

const callTool: McpMethod = async (params, session) => {
  const name = readField(params, 'name');
  const tool = findTool(name);

  if (tool === undefined)
    return failure(INVALID_PARAMS, `Unknown tool: ${String(name)}`);

  const project = await session.project;

  if (project === undefined) return toolResult(noServedProject(), true);

  const { runtime, entry } = session.server;
  const run = await runTool(tool, readField(params, 'arguments'), (args) =>
    runEngine({ runtime, entry, project }, args)
  );

  return toolResult(run.output, run.failed);
};

/** Asks the client for its roots whenever only they can name the project and the client offered them */
const askRoots: McpNotification = (session) => {
  if (session.server.project !== undefined || !session.rootsOffered) return;

  session.requestsSent += 1;

  const id = `roots-${session.requestsSent}`;

  session.project = new Promise((resolve) => {
    session.awaiting.set(id, (answer) =>
      resolve(projectFromRoots(answer, session.server.packageRoot))
    );
  });
  session.send({ id, method: 'roots/list' });
};

const METHODS: Record<string, McpMethod> = {
  initialize,
  ping: () => ({ result: Object.create(null) }),
  'tools/list': () => ({ result: { tools: ENGINE_TOOLS.map(describeTool) } }),
  'tools/call': callTool,
};

const NOTIFICATIONS: Record<string, McpNotification> = {
  'notifications/initialized': askRoots,
  'notifications/roots/list_changed': askRoots,
};

const envelope = (id: JsonRpcId | null, answer: McpAnswer): string =>
  JSON.stringify({ jsonrpc: '2.0', id, ...answer });

const parse = (line: string): unknown => {
  try {
    return JSON.parse(line);
  } catch {
    return undefined;
  }
};

const dispatch = async (
  method: string,
  params: unknown,
  session: McpSession
): Promise<McpAnswer> => {
  if (!Object.hasOwn(METHODS, method))
    return failure(METHOD_NOT_FOUND, `Method not found: ${method}`);

  try {
    return await METHODS[method](params, session);
  } catch (error) {
    return failure(
      INTERNAL_ERROR,
      error instanceof Error ? error.message : String(error)
    );
  }
};

const notify = (method: unknown, session: McpSession): void => {
  if (typeof method === 'string' && Object.hasOwn(NOTIFICATIONS, method))
    NOTIFICATIONS[method](session);
};

/** Hands the client's answer to the request of the server's that awaits it */
const settle = (id: unknown, answer: unknown, session: McpSession): void => {
  if (!isRequestId(id)) return;

  const resolve = session.awaiting.get(id);

  if (resolve === undefined) return;

  session.awaiting.delete(id);
  resolve(answer);
};

/** The reply to one line the client sent, or nothing for a notification or a response */
const respond = async (
  line: string,
  session: McpSession
): Promise<string | undefined> => {
  const message = parse(line);

  if (message === undefined)
    return envelope(null, failure(PARSE_ERROR, 'Parse error'));
  if (!isRecord(message))
    return envelope(null, failure(INVALID_REQUEST, 'Invalid Request'));

  const { id, method, params, result } = message;

  if (method === undefined) {
    settle(id, result, session);

    return undefined;
  }

  if (id === undefined) {
    notify(method, session);

    return undefined;
  }

  if (!isRequestId(id) || typeof method !== 'string')
    return envelope(
      isRequestId(id) ? id : null,
      failure(INVALID_REQUEST, 'Invalid Request')
    );

  return envelope(id, await dispatch(method, params, session));
};

/** Serves the engine over stdio MCP until the client closes the input */
export const serveMcp = (
  server: McpServer,
  input: Readable,
  output: Writable
): Promise<void> =>
  new Promise((resolve) => {
    const lines = createInterface({ input, crlfDelay: Infinity });
    const session: McpSession = {
      server,
      send: (message) =>
        output.write(`${JSON.stringify({ jsonrpc: '2.0', ...message })}\n`),
      rootsOffered: false,
      project: Promise.resolve(server.project),
      requestsSent: 0,
      awaiting: new Map(),
    };

    lines.on('line', (line) => {
      if (line.trim().length === 0) return;

      respond(line, session).then((reply) => {
        if (reply !== undefined) output.write(`${reply}\n`);
      });
    });
    lines.on('close', () => resolve());
  });
