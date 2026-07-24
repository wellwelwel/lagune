import { describe, it, strict } from 'poku';
import { scanReport } from '../../../src/core/scan/driver.js';
import { SOURCE_FILTER } from '../../../src/core/scan/filters.js';
import { analyze } from '../../../src/hooks/cors/scan.js';
import { newWorkspace, writeFiles } from './__utils__.js';

await describe('cors scan surfaces bypassable origin allowlists as review leads', async () => {
  await it('flags a greedy host validator and spares sound ones and prose', async () => {
    const workspace = await newWorkspace();

    await writeFiles(workspace, {
      'cors.js': 'const ok = /^https?:\\/\\/.+\\.trusted\\.com/.test(origin);',
      'safe.js': 'const ok = /^https:\\/\\/app\\.example\\.com$/.test(origin);',
      'plain.js': 'const label = "just a message about trusted.com";',
      'notes.md': 'a regex /^https?://.+\\.trusted\\.com/ in prose',
    });

    const report = await scanReport(
      workspace,
      [workspace],
      SOURCE_FILTER,
      analyze
    );

    strict.deepStrictEqual(
      report.review.map((entry) => entry.file),
      ['cors.js']
    );
    strict.deepStrictEqual(report.findings, []);
  });

  await it('reads a bypassable allowlist across language carriers', async () => {
    const workspace = await newWorkspace();

    await writeFiles(workspace, {
      'router.go':
        'var ok = regexp.MustCompile("^https?://.+\\\\.trusted\\\\.com")',
      'auth.py': 'pattern = re.compile("^https://.*\\\\.corp\\\\.net")',
    });

    const report = await scanReport(
      workspace,
      [workspace],
      SOURCE_FILTER,
      analyze
    );

    strict.deepStrictEqual(
      report.review.map((entry) => entry.file).toSorted(),
      ['auth.py', 'router.go']
    );
    strict.deepStrictEqual(report.findings, []);
  });
});
