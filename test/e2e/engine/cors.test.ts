import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { newWorkspace, runEngine } from './__utils__.js';

await describe('the cors hook runs through the engine', async () => {
  await it('scores origins with -o, flagging wildcard and null', async () => {
    const workspace = await newWorkspace();

    const wildcard = await runEngine(workspace, ['cors', '-o', '*']);
    strict.strictEqual(wildcard.stdout.trim(), 'wildcard');
    strict.strictEqual(wildcard.code, 1);

    const many = await runEngine(workspace, [
      'cors',
      '-o',
      'null',
      '-o',
      'https://app.example.com',
    ]);
    strict.strictEqual(many.stdout.trim(), 'null\nsafe');
    strict.strictEqual(many.code, 1);
  });

  await it('scans source for bypassable origin allowlists without changing the exit code', async () => {
    const workspace = await newWorkspace();
    await writeFile(
      join(workspace, 'cors.js'),
      'const ok = /^https?:\\/\\/.+\\.trusted\\.com/.test(origin);\n',
      'utf8'
    );

    const scan = await runEngine(workspace, ['cors', '-f', 'cors.js']);
    strict.ok(
      scan.stdout.includes(
        'Origin-allowlist patterns with a greedy wildcard (bypassable, review):'
      )
    );
    strict.ok(scan.stdout.includes('cors.js'));
    strict.strictEqual(scan.code, 0);

    const bare = await runEngine(workspace, ['cors']);
    strict.strictEqual(bare.code, 0);
  });

  await it('rejects mixing an -o score with a scan scope', async () => {
    const workspace = await newWorkspace();

    const mixed = await runEngine(workspace, [
      'cors',
      '-o',
      '*',
      '-f',
      'cors.js',
    ]);
    strict.strictEqual(mixed.code, 1);
    strict.ok(mixed.stderr.includes('cannot be combined'));
  });
});
