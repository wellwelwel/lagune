import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { initInto, newWorkspace, spawnHook } from './__utils__.js';

await describe('the scaffolded interpreter hook runs without install', async () => {
  await it('scores a snippet and scans across languages, always exiting 0', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    const careful = await spawnHook(workspace, 'interpreter.mjs', [
      '-l',
      'javascript',
      '-p',
      'eval(x)',
    ]);
    strict.strictEqual(careful.stdout.trim(), 'careful');
    strict.strictEqual(careful.code, 0);

    const safe = await spawnHook(workspace, 'interpreter.mjs', [
      '-l',
      'javascript',
      '-p',
      'JSON.parse(x)',
    ]);
    strict.strictEqual(safe.stdout.trim(), 'safe');
    strict.strictEqual(safe.code, 0);

    await writeFile(
      join(workspace, 'app.py'),
      'def run(user_input):\n    return eval(user_input)\n',
      'utf8'
    );
    const scan = await spawnHook(workspace, 'interpreter.mjs', [
      '-f',
      'app.py',
    ]);
    strict.ok(scan.stdout.includes('Dynamic-execution sinks to review'));
    strict.strictEqual(scan.code, 0);
  });
});
