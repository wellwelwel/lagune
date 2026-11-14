import type { ScanDetail } from '../../../src/types/scan.js';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { scanSecrets } from '../../../src/hooks/secrets/scan.js';
import { hideUserHome, trackedRepository } from '../scan/__utils__.js';
import { reported } from './__utils__.js';

hideUserHome();

const UNIGNORED_KEY: readonly ScanDetail[] = [
  {
    file: 'id_rsa',
    detail:
      'private key that Git does not ignore: add it to .gitignore, so the next git add cannot commit it',
  },
];

const SCAN_IGNORED = JSON.stringify({
  checkers: { secrets: { gitignore: false } },
});

await describe('the secrets checker warns about a credential file Git would commit, by every ignore rule Git reads', async () => {
  const cases: [
    name: string,
    files: Readonly<Record<string, string>>,
    tracked: readonly string[],
    target: string,
    advisory: readonly ScanDetail[],
  ][] = [
    [
      'warns when nothing ignores it',
      { 'README.md': '', id_rsa: 'fixture\n' },
      ['README.md'],
      '.',
      UNIGNORED_KEY,
    ],
    [
      'stays silent when a .gitignore in its folder ignores it',
      {
        'README.md': '',
        'keys/.gitignore': 'id_rsa\n',
        'keys/id_rsa': 'fixture\n',
      },
      ['README.md'],
      '.',
      [],
    ],
    [
      'stays silent when the local exclude file ignores it',
      { 'README.md': '', '.git/info/exclude': 'id_rsa\n', id_rsa: 'fixture\n' },
      ['README.md'],
      '.',
      [],
    ],
    [
      'warns when a later rule takes it back',
      { 'README.md': '', '.gitignore': 'id_*\n!id_rsa\n', id_rsa: 'fixture\n' },
      ['README.md'],
      '.',
      UNIGNORED_KEY,
    ],
    [
      'stays silent inside an ignored folder that still holds a tracked file',
      {
        '.gitignore': 'secrets/\n',
        'secrets/README.md': '',
        'secrets/id_rsa': 'fixture\n',
      },
      ['secrets/README.md'],
      '.',
      [],
    ],
    [
      'stays silent when the checker also scans what Git ignores',
      {
        'README.md': '',
        '.gitignore': 'id_rsa\n',
        '.lagune/configs.json': SCAN_IGNORED,
        id_rsa: 'fixture\n',
      },
      ['README.md'],
      '.',
      [],
    ],
    [
      'warns when the checker also scans what Git ignores and nothing ignores it',
      {
        'README.md': '',
        '.lagune/configs.json': SCAN_IGNORED,
        id_rsa: 'fixture\n',
      },
      ['README.md'],
      '.',
      UNIGNORED_KEY,
    ],
    [
      'stays silent when the scan names a file Git ignores',
      { 'README.md': '', '.gitignore': 'id_rsa\n', id_rsa: 'fixture\n' },
      ['README.md'],
      'id_rsa',
      [],
    ],
  ];

  for (const [name, files, tracked, target, advisory] of cases)
    await it(name, async () => {
      const workspace = await trackedRepository(
        ['init', '--quiet'],
        files,
        tracked
      );

      const report = await scanSecrets(workspace, [join(workspace, target)]);

      strict.deepStrictEqual(reported(report), {
        findings: [],
        review: [],
        advisory,
      });
    });
});
