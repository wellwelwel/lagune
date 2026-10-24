import { describe, it, strict } from 'poku';
import { newWorkspace, runEngine } from './__utils__.js';

await describe('the jwt hook runs through the engine', async () => {
  await it('scores pinned and unpinned verify calls', async () => {
    const workspace = await newWorkspace();

    const unpinned = await runEngine(workspace, [
      'jwt',
      '-l',
      'javascript',
      '-p',
      'jwt.verify(token, secret)',
    ]);
    strict.strictEqual(unpinned.stdout.trim(), 'unpinned');
    strict.strictEqual(unpinned.code, 1);

    const safe = await runEngine(workspace, [
      'jwt',
      '-l',
      'javascript',
      '-p',
      'jwt.verify(token, secret, { algorithms: ["HS256"] })',
    ]);
    strict.strictEqual(safe.stdout.trim(), 'safe');
    strict.strictEqual(safe.code, 0);

    const python = await runEngine(workspace, [
      'jwt',
      '-l',
      'python',
      '-p',
      'jwt.decode(token, key, options={"verify_signature": False})',
    ]);
    strict.strictEqual(python.stdout.trim(), 'unpinned');
    strict.strictEqual(python.code, 1);
  });
});
