export type PiToolResult = {
  content: { type: 'text'; text: string }[];
  details: undefined;
  isError: boolean;
};

/** What Pi hands an extension tool on each call */
export type PiToolContext = { cwd: string };

/** A tool as a Pi extension registers it, with its parameters as JSON Schema */
export type PiTool = {
  name: string;
  label: string;
  description: string;
  parameters: Record<string, unknown>;
  annotations: Record<string, unknown>;
  execute: (
    toolCallId: string,
    params: unknown,
    signal: AbortSignal | undefined,
    onUpdate: unknown,
    context: PiToolContext
  ) => Promise<PiToolResult>;
};

export type PiExtensionApi = { registerTool: (tool: PiTool) => void };
