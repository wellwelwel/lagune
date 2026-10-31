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

export type McpServer = {
  entry: string;
  project: string;
  version: string;
};

export type JsonRpcId = string | number;

export type McpAnswer =
  { result: unknown } | { error: { code: number; message: string } };

export type McpMethod = (
  params: unknown,
  server: McpServer
) => McpAnswer | Promise<McpAnswer>;
