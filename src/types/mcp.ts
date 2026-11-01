import type { CliCommand, HookName } from './core.js';

export type EngineCommand = CliCommand | HookName;

export type EngineTool = {
  name: string;
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

export type EngineRunner = (
  command: string,
  values: string[]
) => Promise<EngineRun>;

export type McpServer = EngineProcess & { version: string };

export type JsonRpcId = string | number;

export type McpAnswer =
  { result: unknown } | { error: { code: number; message: string } };

export type McpMethod = (
  params: unknown,
  server: McpServer
) => McpAnswer | Promise<McpAnswer>;
