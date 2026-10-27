import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { newWorkspace, runEngine } from './__utils__.js';

const FINDING_EXIT = 1;

const SAFE_EXIT = 0;

const runRegex = async (
  workspace: string,
  ...args: string[]
): Promise<string> => {
  const { stdout, stderr, code } = await runEngine(workspace, [
    'regex',
    ...args,
  ]);

  if (code !== SAFE_EXIT && code !== FINDING_EXIT)
    throw new Error(`regex hook exited with code ${code}: ${stderr.trim()}`);

  return stdout.trim();
};

await describe('the regex hook runs through the engine', async () => {
  await it('classifies one pattern as unsafe, safe, or invalid', async () => {
    const workspace = await newWorkspace();

    strict.strictEqual(await runRegex(workspace, '-p', '(a+)+$'), 'unsafe');
    strict.strictEqual(
      await runRegex(workspace, '-p', 'boundary=(.+)$'),
      'unsafe'
    );
    strict.strictEqual(
      await runRegex(workspace, '-p', '^([IVXLC]+)\\.\\s*(.*)$'),
      'unsafe'
    );
    strict.strictEqual(await runRegex(workspace, '-p', '(a+)+'), 'unsafe');
    strict.strictEqual(await runRegex(workspace, '-p', '^abc$'), 'safe');
    strict.strictEqual(await runRegex(workspace, '-p', '('), 'invalid regex');
  });

  await it('checks many patterns in one call, one verdict per line', async () => {
    const workspace = await newWorkspace();

    strict.strictEqual(
      await runRegex(workspace, '-p', '(a+)+$', '-p', '^abc$', '-p', '('),
      'unsafe\nsafe\ninvalid regex'
    );
  });

  await it('applies a custom repetition limit to the checks', async () => {
    const workspace = await newWorkspace();

    strict.strictEqual(
      await runRegex(workspace, '-p', 'a?a?a?', '-l', '2'),
      'unsafe'
    );
  });

  await it('scans a file for ReDoS-prone literals', async () => {
    const workspace = await newWorkspace();

    await writeFile(
      join(workspace, 'app.js'),
      'const re = /(a+)+$/;\n',
      'utf8'
    );

    strict.strictEqual(
      await runRegex(workspace, '-f', 'app.js'),
      'Vulnerable regular expressions found:\n\napp.js\n  (a+)+$ (exponential, search)'
    );
  });

  await it('scans a directory and the whole project from the root', async () => {
    const workspace = await newWorkspace();

    await mkdir(join(workspace, 'src'), { recursive: true });
    await writeFile(
      join(workspace, 'src', 'app.js'),
      'const re = /(a+)+$/;\n',
      'utf8'
    );

    strict.strictEqual(
      await runRegex(workspace, '-d', 'src'),
      'Vulnerable regular expressions found:\n\nsrc/app.js\n  (a+)+$ (exponential, search)'
    );
    strict.strictEqual(
      await runRegex(workspace),
      'Vulnerable regular expressions found:\n\nsrc/app.js\n  (a+)+$ (exponential, search)'
    );
  });

  await it('scans a file with enough patterns to share the analysis across threads', async () => {
    const workspace = await newWorkspace();
    const literals = Array.from(
      { length: 16 },
      (_, index) => `const k${index} = /^k${index}\\d+$/;`
    );

    await writeFile(
      join(workspace, 'app.js'),
      [...literals, 'const a = /(a+)+$/;', 'const b = /(.+)$/;'].join('\n'),
      'utf8'
    );

    strict.strictEqual(
      await runRegex(workspace, '-f', 'app.js'),
      'Vulnerable regular expressions found:\n\n' +
        'app.js\n  (.+)$ (polynomial of degree 2, search)\n  (a+)+$ (exponential, search)'
    );
  });

  await it('unions several -d and -f targets, each file once', async () => {
    const workspace = await newWorkspace();

    await mkdir(join(workspace, 'src'), { recursive: true });
    await mkdir(join(workspace, 'lib'), { recursive: true });
    await writeFile(
      join(workspace, 'src', 'a.js'),
      'const re = /(a+)+$/;\n',
      'utf8'
    );
    await writeFile(
      join(workspace, 'lib', 'b.js'),
      'const re = /(.+)$/;\n',
      'utf8'
    );

    strict.strictEqual(
      await runRegex(workspace, '-d', 'src', '-d', 'lib', '-f', 'src/a.js'),
      'Vulnerable regular expressions found:\n\n' +
        'lib/b.js\n  (.+)$ (polynomial of degree 2, search)\n\n' +
        'src/a.js\n  (a+)+$ (exponential, search)'
    );
  });

  await it('applies a custom repetition limit to a scan', async () => {
    const workspace = await newWorkspace();

    await writeFile(
      join(workspace, 'app.js'),
      'const re = /a?a?a?/;\n',
      'utf8'
    );

    strict.strictEqual(
      await runRegex(workspace, '-f', 'app.js'),
      'no unsafe patterns found'
    );
    strict.strictEqual(
      await runRegex(workspace, '-f', 'app.js', '-l', '2'),
      'Vulnerable regular expressions found:\n\napp.js\n  a?a?a? (more than 2 quantifiers)'
    );
  });

  await it('rejects mixing a check with a scan scope', async () => {
    const workspace = await newWorkspace();
    const { code, stderr } = await runEngine(workspace, [
      'regex',
      '-p',
      '(a+)+',
      '-d',
      'src',
    ]);

    strict.strictEqual(code, 1);
    strict.strictEqual(
      stderr.trim(),
      '-p checks a pattern and cannot be combined with -d or -f'
    );
  });

  await it('exits 1 on an unsafe finding and 0 when clean', async () => {
    const workspace = await newWorkspace();

    await writeFile(
      join(workspace, 'app.js'),
      'const re = /(a+)+$/;\n',
      'utf8'
    );

    strict.strictEqual(
      (await runEngine(workspace, ['regex', '-p', '(a+)+$'])).code,
      1
    );
    strict.strictEqual(
      (await runEngine(workspace, ['regex', '-f', 'app.js'])).code,
      1
    );
    strict.strictEqual(
      (await runEngine(workspace, ['regex', '-p', '^abc$'])).code,
      0
    );
    strict.strictEqual(
      (await runEngine(workspace, ['regex', '-p', '('])).code,
      0
    );
    strict.strictEqual(
      (
        await runEngine(workspace, [
          'regex',
          '-p',
          `${'('.repeat(600)}a+${')'.repeat(600)}`,
        ])
      ).code,
      0
    );
    strict.strictEqual(
      (await runEngine(workspace, ['regex', '-d', 'src'])).code,
      0
    );
  });
});
