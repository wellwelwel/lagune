import type {
  HookRun,
  RootsCase,
  RootsClient,
} from '../../../src/types/test.js';
import { spawn } from 'node:child_process';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, parse } from 'node:path';
import { execPath } from 'node:process';
import { createInterface } from 'node:readline';
import { pathToFileURL } from 'node:url';
import { describe, it, strict } from 'poku';
import { isRecord, readField } from '../../../src/core/collections.js';
import { ENGINE, newWorkspace, runEngine } from './__utils__.js';

const LEAKED_KEY = 'export const key = "AKIAIOSFODNN7EXAMPLE";\n';
const ENGINE_FOLDER = dirname(dirname(dirname(ENGINE)));
const ADD_PYTHON = ['--categories', 'python'];
const REJECTED_ROOTS: RootsCase[] = [
  { label: 'no root', roots: () => [] },
  {
    label: 'two roots',
    roots: (project, sibling) => [fileUri(project), fileUri(sibling)],
  },
  {
    label: 'a root that is no local folder',
    roots: () => ['https://example.com/project'],
  },
  {
    label: 'a file as its root',
    roots: (project) => [fileUri(join(project, 'config.ts'))],
  },
  { label: "the server's own folder", roots: () => [fileUri(ENGINE_FOLDER)] },
  {
    label: 'the root of the file system',
    roots: () => [fileUri(parse(ENGINE_FOLDER).root)],
  },
];

const fileUri = (path: string): string => pathToFileURL(path).href;

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

const parseMessages = (stdout: string): unknown[] =>
  stdout
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line): unknown => JSON.parse(line));

const exchange = async (
  project: string,
  requests: object[]
): Promise<unknown[]> => {
  const { stdout } = await serve([project], project, requests);

  return parseMessages(stdout);
};

const replyTo = (replies: unknown[], id: number): Record<string, unknown> => {
  const reply = replies.find(
    (candidate) => isRecord(candidate) && candidate.id === id
  );

  return isRecord(reply) ? reply : {};
};

const field = (payload: unknown, ...path: string[]): unknown =>
  path.reduce<unknown>(readField, payload);

const toolAnswer = (reply: unknown) => {
  const content = field(reply, 'result', 'content');

  return {
    text: Array.isArray(content) ? field(content[0], 'text') : undefined,
    isError: field(reply, 'result', 'isError'),
  };
};

const isServedProjectFailure = (reply: unknown): boolean => {
  const { text, isError } = toolAnswer(reply);

  return isError === true && String(text).includes('npx');
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

/** Starts the server in a folder as a client offering roots, answering each roots request with the next list */
const openRootsClient = (cwd: string, rootLists: string[][]): RootsClient => {
  const server = spawn(execPath, [ENGINE, 'mcp'], { cwd });
  const awaiting = new Map<unknown, (reply: unknown) => void>();
  let rootsAsked = 0;
  const write = (message: object): void => {
    server.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', ...message })}\n`);
  };

  createInterface({ input: server.stdout }).on('line', (line) => {
    const message: unknown = JSON.parse(line);
    const id = field(message, 'id');

    if (field(message, 'method') !== 'roots/list') {
      awaiting.get(id)?.(message);
      return;
    }

    const uris = rootLists[rootsAsked] ?? [];

    rootsAsked += 1;
    write({ id, result: { roots: uris.map((uri) => ({ uri })) } });
  });

  write({
    id: 0,
    method: 'initialize',
    params: {
      protocolVersion: '2025-11-25',
      capabilities: { roots: { listChanged: true } },
    },
  });
  write({ method: 'notifications/initialized' });

  return {
    request: (message) =>
      new Promise((resolve) => {
        awaiting.set(message.id, resolve);
        write(message);
      }),
    notify: (method) => write({ method }),
    rootsAsked: () => rootsAsked,
    close: () =>
      new Promise((resolve) => {
        server.on('close', () => resolve());
        server.stdin.end();
      }),
  };
};

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
    strict.deepStrictEqual(toolAnswer(replyTo(replies, 1)), {
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
    const { text, isError } = toolAnswer(replyTo(replies, 1));

    strict.strictEqual(isError, true);
    strict(
      String(text).includes('outside'),
      'it refuses the folder above the project'
    );
  });

  await it('serves the folder the agent started it in when the agent passes its project variable unexpanded', async () => {
    const workspace = await newWorkspace();
    const { code } = await serve(['${CLAUDE_PROJECT_DIR}'], workspace, [
      callTool(1, 'lagune_write', 'add', ADD_PYTHON),
    ]);
    const configs = await readFile(
      join(workspace, '.lagune', 'configs.json'),
      'utf8'
    );

    strict.strictEqual(code, 0);
    strict(configs.includes('python'), 'the project records the category');
  });

  for (const [place, folder] of [
    ['its own folder', ENGINE_FOLDER],
    ['the root of the file system', parse(ENGINE_FOLDER).root],
  ]) {
    await it(`serves no project from ${place} to a client that offers no roots, pointing each call to npx`, async () => {
      const { stdout } = await serve([], folder, [
        callTool(1, 'lagune_write', 'add', ADD_PYTHON),
      ]);
      const messages = parseMessages(stdout);
      const entries = await readdir(folder);

      strict.deepStrictEqual(
        messages.map((message) => field(message, 'method')),
        [undefined],
        'it asks the client nothing'
      );
      strict(isServedProjectFailure(replyTo(messages, 1)));
      strict(!entries.includes('.lagune'), 'it writes nothing there');
    });
  }

  await it('refuses a project the agent names that is its own folder', async () => {
    const { code, stdout, stderr } = await serve(
      [ENGINE_FOLDER],
      ENGINE_FOLDER,
      [{ id: 1, method: 'tools/list' }]
    );

    strict.strictEqual(code, 1);
    strict.strictEqual(stdout, '');
    strict(stderr.includes('npx'), 'it points the agent to the npx fallback');
  });

  await it('serves the single folder its client lists as its root, when it starts in its own folder', async () => {
    const workspace = await newWorkspace();
    const client = openRootsClient(ENGINE_FOLDER, [[fileUri(workspace)]]);
    const reply = await client.request(
      callTool(1, 'lagune_write', 'add', ADD_PYTHON)
    );

    await client.close();

    const configs = await readFile(
      join(workspace, '.lagune', 'configs.json'),
      'utf8'
    );
    const entries = await readdir(ENGINE_FOLDER);

    strict.strictEqual(field(reply, 'result', 'isError'), false);
    strict(configs.includes('python'), 'the project records the category');
    strict(!entries.includes('.lagune'), 'it writes nothing in its own folder');
  });

  for (const { label, roots } of REJECTED_ROOTS) {
    await it(`serves no project when its client lists ${label}, pointing each call to npx`, async () => {
      const [workspace, sibling] = await Promise.all([
        newWorkspace(),
        newWorkspace(),
      ]);

      await writeFile(join(workspace, 'config.ts'), LEAKED_KEY);

      const client = openRootsClient(ENGINE_FOLDER, [
        roots(workspace, sibling),
      ]);
      const reply = await client.request(
        callTool(1, 'lagune_write', 'add', ADD_PYTHON)
      );

      await client.close();

      const written = await Promise.all(
        [workspace, sibling, ENGINE_FOLDER].map((folder) => readdir(folder))
      );

      strict(isServedProjectFailure(reply));
      strict.deepStrictEqual(
        written.map((entries) => entries.includes('.lagune')),
        [false, false, false]
      );
    });
  }

  await it('asks again when its client reports a change of roots', async () => {
    const workspace = await newWorkspace();
    const client = openRootsClient(ENGINE_FOLDER, [[], [fileUri(workspace)]]);
    const before = await client.request(
      callTool(1, 'lagune_write', 'add', ADD_PYTHON)
    );

    client.notify('notifications/roots/list_changed');

    const after = await client.request(
      callTool(2, 'lagune_write', 'add', ADD_PYTHON)
    );
    const asked = client.rootsAsked();

    await client.close();

    strict(isServedProjectFailure(before));
    strict.strictEqual(field(after, 'result', 'isError'), false);
    strict.strictEqual(asked, 2);
  });

  await it('keeps the project it started in, never asking its client for roots', async () => {
    const [workspace, elsewhere] = await Promise.all([
      newWorkspace(),
      newWorkspace(),
    ]);
    const client = openRootsClient(workspace, [[fileUri(elsewhere)]]);
    const reply = await client.request(
      callTool(1, 'lagune_write', 'add', ADD_PYTHON)
    );
    const asked = client.rootsAsked();

    await client.close();

    const written = await Promise.all(
      [workspace, elsewhere].map((folder) => readdir(folder))
    );

    strict.strictEqual(field(reply, 'result', 'isError'), false);
    strict.strictEqual(asked, 0);
    strict.deepStrictEqual(
      written.map((entries) => entries.includes('.lagune')),
      [true, false]
    );
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
