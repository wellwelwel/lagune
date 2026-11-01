import type { EngineTool } from '../types/mcp.js';
import type { PiExtensionApi, PiTool } from '../types/pi.js';
import { describeTool, ENGINE_TOOLS, runTool } from '../mcp/tools.js';
import { runFromProject } from './engine.js';

const piTool = (tool: EngineTool): PiTool => {
  const { name, title, description, inputSchema, annotations } =
    describeTool(tool);

  return {
    name,
    label: title,
    description,
    parameters: inputSchema,
    annotations,
    execute: async (_toolCallId, params, _signal, _onUpdate, context) => {
      const run = await runTool(tool, params, runFromProject(context.cwd));

      return {
        content: [{ type: 'text', text: run.output }],
        details: undefined,
        isError: run.failed,
      };
    },
  };
};

const extension = (pi: PiExtensionApi): void => {
  for (const tool of ENGINE_TOOLS) pi.registerTool(piTool(tool));
};

/** Pi loads an extension from its module's default export */
export default extension;
