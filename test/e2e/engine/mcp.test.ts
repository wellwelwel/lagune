import { spawn } from 'node:child_process';
import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execPath } from 'node:process';
import { describe, it, strict } from 'poku';
import { isRecord } from '../../../src/core/collections.js';
import { ENGINE, newWorkspace, runEngine } from './__utils__.js';

const LEAKED_KEY = 'export const key = "AKIAIOSFODNN7EXAMPLE";\n';

const exchange = (project: string, requests: object[]): Promise<unknown[]> =>
  new Promise((resolve, reject) => {
    const child = spawn(execPath, [ENGINE, 'mcp', project]);
    const out: string[] = [];

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => out.push(chunk));
    child.on('error', reject);
    child.on('close', () =>
      resolve(
        out
          .join('')
          .split('\n')
          .filter((line) => line.length > 0)
          .map((line): unknown => JSON.parse(line))
      )
    );
    child.stdin.end(
      requests
        .map((request) => JSON.stringify({ jsonrpc: '2.0', ...request }))
        .join('\n') + '\n'
    );
  });

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
    const result = field(replyTo(replies, 1), 'result');
    const content = field(result, 'content');

    strict.strictEqual(cli.code, 1);
    strict.deepStrictEqual(
      {
        text: Array.isArray(content) ? field(content[0], 'text') : undefined,
        isError: field(result, 'isError'),
      },
      { text: cli.stdout.trimEnd(), isError: true }
    );
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

    strict.strictEqual(field(replyTo(replies, 1), 'result', 'isError'), true);
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
