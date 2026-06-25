import { spawn } from 'node:child_process';
import { execPath } from 'node:process';
import { describe, it, strict } from 'poku';
import { initInto, newWorkspace } from './__utils__.js';

const runUrlSafety = (workspace: string, ...args: string[]): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = spawn(execPath, ['.bluespec/hooks/url-safety.mjs', ...args], {
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

      reject(new Error(`url-safety hook exited with code ${code}`));
    });
  });

await describe('the scaffolded url-safety hook runs without install', async () => {
  await it('classifies destinations as private, divergent, safe, or invalid', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    strict.strictEqual(
      await runUrlSafety(workspace, 'http://0x7f000001/'),
      'private-target'
    );
    strict.strictEqual(
      await runUrlSafety(workspace, 'http://169.254.169.254/'),
      'private-target'
    );
    strict.strictEqual(
      await runUrlSafety(workspace, 'http://localhost/'),
      'private-target'
    );
    strict.strictEqual(
      await runUrlSafety(workspace, 'http://evil.com\\@expected.com/'),
      'parser-divergent'
    );
    strict.strictEqual(
      await runUrlSafety(workspace, 'http://example.com/'),
      'safe'
    );
    strict.strictEqual(
      await runUrlSafety(workspace, 'not a url'),
      'invalid url'
    );
  });
});
