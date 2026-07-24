import { describe, it, strict } from 'poku';
import { initInto, newWorkspace, spawnHook } from './__utils__.js';

await describe('the scaffolded agent hook runs without install', async () => {
  await it('scores capped and uncapped agent calls', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    const uncapped = await spawnHook(workspace, 'agent.mjs', [
      '-l',
      'javascript',
      '-p',
      'query({ prompt })',
    ]);
    strict.strictEqual(uncapped.stdout.trim(), 'uncapped');
    strict.strictEqual(uncapped.code, 1);

    const safe = await spawnHook(workspace, 'agent.mjs', [
      '-l',
      'javascript',
      '-p',
      'query({ prompt, options: { maxTurns: 5 } })',
    ]);
    strict.strictEqual(safe.stdout.trim(), 'safe');
    strict.strictEqual(safe.code, 0);

    const python = await spawnHook(workspace, 'agent.mjs', [
      '-l',
      'python',
      '-p',
      'AgentExecutor(agent=a, tools=t, max_iterations=None)',
    ]);
    strict.strictEqual(python.stdout.trim(), 'uncapped');
    strict.strictEqual(python.code, 1);
  });
});
