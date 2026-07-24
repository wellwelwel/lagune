import { describe, it, strict } from 'poku';
import { initInto, newWorkspace, spawnHook } from './__utils__.js';

await describe('the scaffolded jwt hook runs without install', async () => {
  await it('scores pinned and unpinned verify calls', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    const unpinned = await spawnHook(workspace, 'jwt.mjs', [
      '-l',
      'javascript',
      '-p',
      'jwt.verify(token, secret)',
    ]);
    strict.strictEqual(unpinned.stdout.trim(), 'unpinned');
    strict.strictEqual(unpinned.code, 1);

    const safe = await spawnHook(workspace, 'jwt.mjs', [
      '-l',
      'javascript',
      '-p',
      'jwt.verify(token, secret, { algorithms: ["HS256"] })',
    ]);
    strict.strictEqual(safe.stdout.trim(), 'safe');
    strict.strictEqual(safe.code, 0);

    const python = await spawnHook(workspace, 'jwt.mjs', [
      '-l',
      'python',
      '-p',
      'jwt.decode(token, key, options={"verify_signature": False})',
    ]);
    strict.strictEqual(python.stdout.trim(), 'unpinned');
    strict.strictEqual(python.code, 1);
  });
});
