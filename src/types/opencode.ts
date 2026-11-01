/** The skill sources OpenCode 1.x reads from its configuration */
export type SkillSources = { paths?: string[] };

export type ServerConfig = { skills?: SkillSources };

/** The permission a tool raises before it acts, which OpenCode 1.x matches against the user's rules */
export type PermissionAsk = {
  permission: string;
  patterns: string[];
  always: string[];
  metadata: Record<string, unknown>;
};

/** What OpenCode 1.x hands a plugin tool on each call */
export type ServerToolContext = {
  directory: string;
  ask: (request: PermissionAsk) => Promise<void>;
};

/** A plugin tool as OpenCode 1.x reads it, with each argument as a JSON Schema property */
export type ServerTool = {
  description: string;
  args: Record<string, Record<string, unknown>>;
  execute: (args: unknown, context: ServerToolContext) => Promise<string>;
};

export type ServerHooks = {
  config: (config: ServerConfig) => Promise<void>;
  tool: Record<string, ServerTool>;
};

/** A skill as OpenCode 2.x registers it, with its body apart from the frontmatter */
export type SkillInfo = {
  id: string;
  name: string;
  description?: string;
  autoinvoke?: boolean;
  path: string;
  content: string;
};

/** OpenCode 1.x also runs setup, with an editor that has no `add` */
export type SkillEditor = { add?: (skill: SkillInfo) => void };

export type SkillDomain = {
  transform?: (edit: (editor: SkillEditor) => void) => Promise<unknown>;
};

/** What OpenCode 2.x hands a plugin tool on each call */
export type ToolCall = {
  sessionID: string;
  agent: string;
  messageID: string;
  id: string;
};

/** A plugin tool as OpenCode 2.x registers it, outside Code Mode, which would hide it from the model */
export type ToolInfo = {
  name: string;
  description: string;
  input: Record<string, unknown>;
  options: { codemode: false };
  execute: (input: unknown, call: ToolCall) => Promise<{ content: string }>;
};

export type ToolEditor = { add?: (tool: ToolInfo) => void };

export type ToolDomain = {
  transform?: (edit: (editor: ToolEditor) => void) => Promise<unknown>;
};

/** The action a tool asks OpenCode 2.x to clear against the session's rules before it acts */
export type PermissionAssert = {
  sessionID: string;
  agent: string;
  action: string;
  resources: string[];
  save: string[];
  source: { type: 'tool'; messageID: string; id: string };
};

export type PermissionDomain = {
  assert?: (request: PermissionAssert) => Promise<void>;
};

export type SetupContext = {
  skill?: SkillDomain;
  tool?: ToolDomain;
  permission?: PermissionDomain;
  location?: { directory: string };
};

export type OpenCodePlugin = {
  id: string;
  server: () => Promise<ServerHooks>;
  setup: (context: SetupContext) => Promise<void>;
};
