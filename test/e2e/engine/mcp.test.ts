import type { HookRun } from '../../../src/types/test.js';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, parse } from 'node:path';
import { describe, it, strict } from 'poku';
import { isRecord } from '../../../src/core/collections.js';
import { ENGINE, newWorkspace, runEngine } from './__utils__.js';

const LEAKED_KEY = 'export const key = "AKIAIOSFODNN7EXAMPLE";\n';
const ENGINE_FOLDER = dirname(dirname(dirname(ENGINE)));

/** Starts the server as an agent would, from a working folder, and sends it every request */
const serve = (
  args: string[],
  cwd: string,
  requests: object[]
): Promise<HookRun> =>
  runEngine(cwd, ['mcp', ...args], {
    input:
      requests
        .map((request) => JSON.stringify({ jsonrpc: '2.0', ...request }))
        .join('\n') + '\n',
  });

const exchange = async (
  project: string,
  requests: object[]
): Promise<unknown[]> => {
  const { stdout } = await serve([project], project, requests);

  return stdout
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line): unknown => JSON.parse(line));
};

const replyTo = (replies: unknown[], id: number): Record<string, unknown> => {
  const reply = replies.find(
    (candidate) => isRecord(candidate) && candidate.id === id
  );

  return isRecord(reply) ? reply : {};
};

const field = (payload: unknown, ...path: string[]): unknown =>
  path.reduce<unknown>(
    (current, key) => (isRecord(current) ? current[key] : undefined),
    payload
  );

const toolAnswer = (replies: unknown[], id: number) => {
  const result = field(replyTo(replies, id), 'result');
  const content = field(result, 'content');

  return {
    text: Array.isArray(content) ? field(content[0], 'text') : undefined,
    isError: field(result, 'isError'),
  };
};

const callTool = (
  id: number,
  name: string,
  command: string,
  values: string[]
) => ({
  id,
  method: 'tools/call',
  params: { name, arguments: { command, arguments: values } },
});

await describe('the engine served over MCP', async () => {
  await it('answers the handshake in the version the client asked for, or the latest it speaks', async () => {
    const workspace = await newWorkspace();
    const replies = await exchange(workspace, [
      {
        id: 1,
        method: 'initialize',
        params: { protocolVersion: '2025-06-18' },
      },
      {
        id: 2,
        method: 'initialize',
        params: { protocolVersion: '1999-01-01' },
      },
    ]);

    strict.deepStrictEqual(
      [1, 2].map((id) => ({
        version: field(replyTo(replies, id), 'result', 'protocolVersion'),
        server: field(replyTo(replies, id), 'result', 'serverInfo', 'name'),
        tools: isRecord(
          field(replyTo(replies, id), 'result', 'capabilities', 'tools')
        ),
      })),
      [
        { version: '2025-06-18', server: 'lagune', tools: true },
        { version: '2025-11-25', server: 'lagune', tools: true },
      ]
    );
  });

  await it('keeps every command that writes .lagune/ out of the read-only tool', async () => {
    const workspace = await newWorkspace();
    const [reply] = await exchange(workspace, [
      { id: 1, method: 'tools/list' },
    ]);
    const tools = field(reply, 'result', 'tools');
    const listed = Array.isArray(tools) ? tools : [];
    const commandsOf = (name: string): unknown[] => {
      const tool = listed.find(
        (candidate) => field(candidate, 'name') === name
      );
      const commands = field(
        tool,
        'inputSchema',
        'properties',
        'command',
        'enum'
      );

      return Array.isArray(commands) ? commands : [];
    };
    const readOnly = commandsOf('lagune_read');
    const writing = commandsOf('lagune_write');

    strict.deepStrictEqual(
      listed.map((tool) => [
        field(tool, 'name'),
        field(tool, 'annotations', 'readOnlyHint'),
      ]),
      [
        ['lagune_read', true],
        ['lagune_write', false],
      ]
    );
    strict.deepStrictEqual(
      readOnly.filter((command) => writing.includes(command)),
      []
    );
    strict(readOnly.includes('secrets') && writing.includes('track'));
  });

  await it('answers a checker with what the CLI prints, failing it the same way', async () => {
    const workspace = await newWorkspace();

    await writeFile(join(workspace, 'config.ts'), LEAKED_KEY);

    const [replies, cli] = await Promise.all([
      exchange(workspace, [
        callTool(1, 'lagune_read', 'secrets', ['--file', 'config.ts']),
      ]),
      runEngine(workspace, ['secrets', '--file', 'config.ts']),
    ]);

    strict.strictEqual(cli.code, 1);
    strict.deepStrictEqual(toolAnswer(replies, 1), {
      text: cli.stdout.trimEnd(),
      isError: true,
    });
  });

  await it('refuses a writing command through the read-only tool, leaving .lagune/ untouched', async () => {
    const workspace = await newWorkspace();
    const replies = await exchange(workspace, [
      callTool(1, 'lagune_read', 'track', [
        '{"entries":[{"name":"Leaked key","paths":["config.ts"]}]}',
      ]),
    ]);
    const entries = await readdir(workspace);

    strict.strictEqual(field(replyTo(replies, 1), 'result', 'isError'), true);
    strict.deepStrictEqual(entries, []);
  });

  await it('keeps the checkers it runs inside the project it serves', async () => {
    const workspace = await newWorkspace();
    const replies = await exchange(workspace, [
      callTool(1, 'lagune_read', 'secrets', ['--dir', '..']),
    ]);
    const { text, isError } = toolAnswer(replies, 1);

    strict.strictEqual(isError, true);
    strict(
      String(text).includes('outside'),
      'it refuses the folder above the project'
    );
  });

  await it('serves the folder the agent started it in when the agent passes its project variable unexpanded', async () => {
    const workspace = await newWorkspace();
    const { code } = await serve(['${CLAUDE_PROJECT_DIR}'], workspace, [
      callTool(1, 'lagune_write', 'add', ['--categories', 'python']),
    ]);
    const configs = await readFile(
      join(workspace, '.lagune', 'configs.json'),
      'utf8'
    );

    strict.strictEqual(code, 0);
    strict(configs.includes('python'), 'the project records the category');
  });

  await it('refuses to serve its own folder, where an agent outside the project would start it', async () => {
    const { code, stdout, stderr } = await serve([], ENGINE_FOLDER, [
      callTool(1, 'lagune_write', 'add', ['--categories', 'python']),
    ]);
    const entries = await readdir(ENGINE_FOLDER);

    strict.strictEqual(code, 1);
    strict.strictEqual(stdout, '');
    strict(stderr.includes('npx'), 'it points the agent to the npx fallback');
    strict(!entries.includes('.lagune'), 'it writes nothing there');
  });

  await it('refuses to serve the root of the file system', async () => {
    const { code, stdout, stderr } = await serve(
      [],
      parse(ENGINE_FOLDER).root,
      [{ id: 1, method: 'tools/list' }]
    );

    strict.strictEqual(code, 1);
    strict.strictEqual(stdout, '');
    strict(stderr.includes('npx'), 'it points the agent to the npx fallback');
  });

  await it('answers an unknown tool and an unknown method with protocol errors', async () => {
    const workspace = await newWorkspace();
    const replies = await exchange(workspace, [
      {
        id: 1,
        method: 'tools/call',
        params: { name: 'lagune_shell', arguments: {} },
      },
      { id: 2, method: 'server/discover' },
    ]);

    strict.deepStrictEqual(
      [1, 2].map((id) => field(replyTo(replies, id), 'error', 'code')),
      [-32602, -32601]
    );
  });
});
