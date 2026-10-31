import type { Readable, Writable } from 'node:stream';
import type {
  EngineTool,
  JsonRpcId,
  McpAnswer,
  McpMethod,
  McpServer,
} from '../types/mcp.js';
import { createInterface } from 'node:readline';
import { isRecord, isStringArray } from '../core/collections.js';
import { runEngine } from './engine.js';
import { describeTool, ENGINE_TOOLS, findTool, toolFor } from './tools.js';

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

const readField = (payload: unknown, field: string): unknown =>
  isRecord(payload) ? payload[field] : undefined;

const isRequestId = (value: unknown): value is JsonRpcId =>
  typeof value === 'string' || typeof value === 'number';

const failure = (code: number, message: string): McpAnswer => ({
  error: { code, message },
});

const toolResult = (text: string, isError: boolean): McpAnswer => ({
  result: { content: [{ type: 'text', text }], isError },
});

const refusal = (tool: EngineTool, command: unknown): string => {
  const owner = toolFor(command);

  if (owner === undefined)
    return `${tool.name} runs one of: ${tool.commands.join(', ')}.`;

  return `${String(command)} runs through ${owner.name}, not ${tool.name}.`;
};

const initialize: McpMethod = (params, server) => {
  const requested = readField(params, 'protocolVersion');

  return {
    result: {
      protocolVersion:
        typeof requested === 'string' && PROTOCOLS.has(requested)
          ? requested
          : LATEST_PROTOCOL,
      capabilities: { tools: {} },
      serverInfo: { name: 'lagune', version: server.version },
    },
  };
};

const callTool: McpMethod = async (params, server) => {
  const name = readField(params, 'name');
  const tool = findTool(name);

  if (tool === undefined)
    return failure(INVALID_PARAMS, `Unknown tool: ${String(name)}`);

  const input = readField(params, 'arguments');
  const command = readField(input, 'command');
  const values = readField(input, 'arguments') ?? [];

  if (typeof command !== 'string' || toolFor(command) !== tool)
    return toolResult(refusal(tool, command), true);
  if (!isStringArray(values))
    return toolResult('arguments must be a list of strings.', true);

  const run = await runEngine(server.entry, server.project, command, values);

  return toolResult(run.output, run.failed);
};

const METHODS: Record<string, McpMethod> = {
  initialize,
  ping: () => ({ result: {} }),
  'tools/list': () => ({ result: { tools: ENGINE_TOOLS.map(describeTool) } }),
  'tools/call': callTool,
};

const envelope = (id: JsonRpcId | null, answer: McpAnswer): string =>
  JSON.stringify({ jsonrpc: '2.0', id, ...answer });

const parse = (line: string): { message: unknown } | undefined => {
  try {
    return { message: JSON.parse(line) };
  } catch {
    return undefined;
  }
};

const dispatch = async (
  method: string,
  params: unknown,
  server: McpServer
): Promise<McpAnswer> => {
  if (!Object.hasOwn(METHODS, method))
    return failure(METHOD_NOT_FOUND, `Method not found: ${method}`);

  try {
    return await METHODS[method](params, server);
  } catch (error) {
    return failure(
      INTERNAL_ERROR,
      error instanceof Error ? error.message : String(error)
    );
  }
};

/** The reply to one line the client sent, or nothing for a notification or a response */
export const respond = async (
  line: string,
  server: McpServer
): Promise<string | undefined> => {
  const parsed = parse(line);

  if (parsed === undefined)
    return envelope(null, failure(PARSE_ERROR, 'Parse error'));
  if (!isRecord(parsed.message))
    return envelope(null, failure(INVALID_REQUEST, 'Invalid Request'));

  const { id, method, params } = parsed.message;

  if (method === undefined || id === undefined) return undefined;
  if (!isRequestId(id) || typeof method !== 'string')
    return envelope(
      isRequestId(id) ? id : null,
      failure(INVALID_REQUEST, 'Invalid Request')
    );

  return envelope(id, await dispatch(method, params, server));
};

/** Serves the engine over stdio MCP until the client closes the input */
export const serveMcp = (
  server: McpServer,
  input: Readable,
  output: Writable
): Promise<void> =>
  new Promise((resolve) => {
    const lines = createInterface({ input, crlfDelay: Infinity });

    lines.on('line', (line) => {
      if (line.trim().length === 0) return;

      respond(line, server).then((reply) => {
        if (reply !== undefined) output.write(`${reply}\n`);
      });
    });
    lines.on('close', () => resolve());
  });
