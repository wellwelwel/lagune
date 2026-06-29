import { spawn } from 'node:child_process';
import { execPath } from 'node:process';
import { describe, it, strict } from 'poku';
import { initInto, newWorkspace } from './__utils__.js';

const runNetwork = (workspace: string, ...args: string[]): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = spawn(execPath, ['.bluespec/hooks/network.mjs', ...args], {
      cwd: workspace,
    });
    const chunks: string[] = [];

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => chunks.push(chunk));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve(chunks.join('').trim());
        return;
      }

      reject(new Error(`network hook exited with code ${code}`));
    });
  });

await describe('the scaffolded network hook runs without install', async () => {
  await it('classifies one destination per -u flag', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    strict.strictEqual(
      await runNetwork(workspace, '-u', 'http://0x7f000001/'),
      'private-target'
    );
    strict.strictEqual(
      await runNetwork(workspace, '-u', 'http://169.254.169.254/'),
      'private-target'
    );
    strict.strictEqual(
      await runNetwork(workspace, '-u', 'http://localhost/'),
      'private-target'
    );
    strict.strictEqual(
      await runNetwork(workspace, '-u', 'http://evil.com\\@expected.com/'),
      'parser-divergent'
    );
    strict.strictEqual(
      await runNetwork(workspace, '-u', 'http://example.com/'),
      'safe'
    );
    strict.strictEqual(
      await runNetwork(workspace, '-u', 'not a url'),
      'invalid url'
    );
  });

  await it('scores several destinations in one call, one verdict per line', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    strict.strictEqual(
      await runNetwork(
        workspace,
        '-u',
        'http://example.com/',
        '-u',
        'http://[::1]/',
        '-u',
        'not a url'
      ),
      'safe\nprivate-target\ninvalid url'
    );
  });
});
