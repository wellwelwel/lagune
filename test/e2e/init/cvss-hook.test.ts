import { describe, it, strict } from 'poku';
import { initInto, newWorkspace, spawnHook } from './__utils__.js';

const BASE_VECTOR =
  'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N';

await describe('the scaffolded cvss hook runs without install', async () => {
  await it('scores one vector per -v flag, printing its score and band', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    const { stdout, code } = await spawnHook(workspace, 'cvss.mjs', [
      '-v',
      BASE_VECTOR,
      '-v',
      `${BASE_VECTOR}/MAV:A`,
    ]);

    strict.strictEqual(code, 0);
    strict.strictEqual(stdout, '9.3, Critical\n8.7, High\n');
  });

  await it('explains the vector in plain words on request', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    const { stdout, code } = await spawnHook(workspace, 'cvss.mjs', [
      '-e',
      '-v',
      BASE_VECTOR,
    ]);

    strict.strictEqual(code, 0);
    strict(stdout.startsWith('9.3, Critical\n'));
    strict(stdout.includes('  Attack Vector: Network\n'));
  });

  await it('exits 1 on an invalid vector, naming what is wrong', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    const { stdout, code } = await spawnHook(workspace, 'cvss.mjs', [
      '-v',
      BASE_VECTOR.replace('AV:N', 'AV:X'),
    ]);

    strict.strictEqual(code, 1);
    strict(
      stdout.startsWith('invalid vector: AV (Attack Vector) does not take "X"')
    );
  });

  await it('exits 1 with no vector at all', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    const { stderr, code } = await spawnHook(workspace, 'cvss.mjs', []);

    strict.strictEqual(code, 1);
    strict(stderr.includes('the cvss hook needs at least one -v <vector>'));
  });
});
