import type { CliCommand, HookName } from './core.js';

export type EngineCommand = CliCommand | HookName;

export type EngineTool = {
  name: string;
  prefix: string;
  title: string;
  summary: string;
  readOnly: boolean;
  commands: readonly EngineCommand[];
};

export type EngineRun = {
  output: string;
  failed: boolean;
};

/** The Node.js that runs the engine, the engine's entry, and the project each call runs from */
export type EngineProcess = {
  runtime: string;
  entry: string;
  project: string;
};

/** Runs the engine with the arguments of one command line */
export type EngineRunner = (args: string[]) => Promise<EngineRun>;

/** The engine a server runs, and the project it serves when the agent named one or started it there */
export type McpServer = Omit<EngineProcess, 'project'> & {
  project: string | undefined;
  packageRoot: URL;
  version: string;
};

export type JsonRpcId = string | number;

/** One client's connection: whether it offered roots, the project its calls run from, and the server's requests awaiting its answer */
export type McpSession = {
  server: McpServer;
  send: (message: Record<string, unknown>) => void;
  rootsOffered: boolean;
  project: Promise<string | undefined>;
  requestsSent: number;
  awaiting: Map<JsonRpcId, (answer: unknown) => void>;
};

export type McpAnswer =
  { result: unknown } | { error: { code: number; message: string } };

export type McpMethod = (
  params: unknown,
  session: McpSession
) => McpAnswer | Promise<McpAnswer>;

export type McpNotification = (session: McpSession) => void;
