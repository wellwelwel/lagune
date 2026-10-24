import { describe, it, strict } from 'poku';
import { newWorkspace, runEngine } from './__utils__.js';

await describe('the agent hook runs through the engine', async () => {
  await it('scores capped and uncapped agent calls', async () => {
    const workspace = await newWorkspace();

    const uncapped = await runEngine(workspace, [
      'agent',
      '-l',
      'javascript',
      '-p',
      'query({ prompt })',
    ]);
    strict.strictEqual(uncapped.stdout.trim(), 'uncapped');
    strict.strictEqual(uncapped.code, 1);

    const safe = await runEngine(workspace, [
      'agent',
      '-l',
      'javascript',
      '-p',
      'query({ prompt, options: { maxTurns: 5 } })',
    ]);
    strict.strictEqual(safe.stdout.trim(), 'safe');
    strict.strictEqual(safe.code, 0);

    const python = await runEngine(workspace, [
      'agent',
      '-l',
      'python',
      '-p',
      'AgentExecutor(agent=a, tools=t, max_iterations=None)',
    ]);
    strict.strictEqual(python.stdout.trim(), 'uncapped');
    strict.strictEqual(python.code, 1);
  });
});
