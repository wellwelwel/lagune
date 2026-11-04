import { fileURLToPath } from 'node:url';
import { describe, it, strict } from 'poku';
import { runHook } from '../../../src/cli/run-hook.js';

const ENTRY = fileURLToPath(
  new URL('../../../src/bin/index.ts', import.meta.url)
);
const VECTOR =
  'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N';
const CAPPED_PATTERN =
  '\\benv::var\\w{0,8}\\s{0,16}\\([^)]{0,200}\\)[^;\\n]{0,120}\\.unwrap_or(?:_else)?\\s{0,16}\\([^"\'\\n]{0,40}([\'"])([^\'"]{8,512})\\1';

await describe('a hook runs under a deadline', async () => {
  await it("returns the hook's answer", async () => {
    const outcome = await runHook(ENTRY, {
      name: 'cvss',
      args: ['--vector', VECTOR],
    });

    strict.deepStrictEqual(outcome, {
      kind: 'answered',
      output: '9.3, Critical\n',
      hasFinding: false,
    });
  });

  await it("returns the hook's error", async () => {
    const outcome = await runHook(ENTRY, { name: 'regex', args: ['--bogus'] });

    strict(
      outcome.kind === 'failed' && outcome.message.includes('--bogus'),
      'the error names the flag'
    );
  });

  await it('stops a hook that crafted input stalls', async () => {
    const started = performance.now();
    const outcome = await runHook(
      ENTRY,
      {
        name: 'regex',
        args: Array.from({ length: 8 }, () => [
          '--pattern',
          CAPPED_PATTERN,
        ]).flat(),
      },
      500
    );
    const elapsed = performance.now() - started;

    strict.deepStrictEqual(outcome, { kind: 'stalled' });
    strict(elapsed < 10_000, `the hook ran for ${elapsed}ms`);
  });
});
