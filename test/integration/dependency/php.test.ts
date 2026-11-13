import type { DependencyRead } from '../../../src/types/hooks/dependency.js';
import { describe, it, strict } from 'poku';
import { readComposerLock } from '../../../src/hooks/dependency/php/lockfile.js';
import { readComposerManifest } from '../../../src/hooks/dependency/php/manifest.js';
import { CANNOT_JUDGE, CLEAN, findings, PLAIN, reported } from './__utils__.js';

const manifestRead = (manifest: Record<string, unknown>): DependencyRead =>
  readComposerManifest('composer.json', JSON.stringify(manifest));

describe('a composer.json flags every repository URL it fetches over plain http:// or git://', () => {
  it('reads the repositories it lists or names and the packages a package repository defines', () => {
    const listed = manifestRead({
      require: { 'monolog/monolog': '^3.0' },
      repositories: [
        { type: 'composer', url: 'http://satis.internal' },
        { type: 'vcs', url: 'git://github.com/me/fork' },
        { type: 'vcs', url: 'https://github.com/me/safe' },
        { type: 'path', url: '../lib' },
        { 'packagist.org': false },
        {
          type: 'package',
          package: {
            name: 'me/zip',
            version: '1.0.0',
            dist: { type: 'zip', url: 'http://example.com/zip.zip' },
          },
        },
        {
          type: 'package',
          package: [
            {
              name: 'me/clone',
              version: '1.0.0',
              source: {
                type: 'git',
                url: 'git://example.com/clone.git',
                reference: 'main',
              },
            },
          ],
        },
      ],
    });
    const named = manifestRead({
      repositories: {
        internal: { type: 'composer', url: 'http://composer.internal' },
        'packagist.org': false,
      },
    });

    strict.deepStrictEqual(
      [reported(listed), reported(named)],
      [
        findings([
          `${PLAIN}: git://example.com/clone.git, git://github.com/me/fork, http://example.com/zip.zip, http://satis.internal`,
        ]),
        findings([`${PLAIN}: http://composer.internal`]),
      ]
    );
  });

  it('declares dependencies only through a package a repository resolves, never a platform package such as php or an extension', () => {
    const results = [
      { require: { php: '>=8.1', 'ext-json': '*', 'monolog/monolog': '^3' } },
      {
        require: { php: '>=8.1' },
        'require-dev': { 'phpunit/phpunit': '^10' },
      },
      { require: { php: '>=8.1', 'ext-mbstring': '*' } },
      { name: 'me/app' },
    ].map((manifest) => manifestRead(manifest).needsLockfile);

    strict.deepStrictEqual(results, [true, true, false, false]);
  });
});

describe('a composer.lock flags each package it locks from a URL over plain http:// or git://', () => {
  it('reads the dist and source URLs of every package, for production and development', () => {
    const result = readComposerLock(
      'composer.lock',
      JSON.stringify({
        'content-hash': 'abc',
        packages: [
          {
            name: 'monolog/monolog',
            version: '3.5.0',
            source: {
              type: 'git',
              url: 'https://github.com/Seldaek/monolog.git',
              reference: 'abc',
            },
            dist: {
              type: 'zip',
              url: 'https://api.github.com/repos/Seldaek/monolog/zipball/abc',
              reference: 'abc',
              shasum: '',
            },
          },
          {
            name: 'me/zip',
            version: '1.0.0',
            dist: { type: 'zip', url: 'http://example.com/zip.zip' },
          },
          {
            name: 'me/lib',
            version: 'dev-main',
            dist: { type: 'path', url: '../lib', reference: 'def' },
          },
        ],
        'packages-dev': [
          {
            name: 'me/clone',
            version: 'dev-main',
            source: { type: 'git', url: 'git://example.com/clone.git' },
          },
        ],
      })
    );

    strict.deepStrictEqual(
      reported(result),
      findings([`${PLAIN}: me/clone (dev-main), me/zip (1.0.0)`])
    );
  });

  it('stays silent on a lockfile that locks nothing yet', () => {
    const result = readComposerLock(
      'composer.lock',
      '{"packages": [], "packages-dev": []}'
    );

    strict.deepStrictEqual(reported(result), CLEAN);
  });
});

describe('a PHP dependency file the checker cannot judge stops it instead of reading as clean', () => {
  const cases: Array<[string, () => unknown]> = [
    [
      'a composer.json that is not JSON',
      () => readComposerManifest('composer.json', '{"require": {'),
    ],
    [
      'a composer.json whose require is not an object',
      () => manifestRead({ require: [] }),
    ],
    [
      'a composer.json whose repositories are a URL',
      () => manifestRead({ repositories: 'http://satis.internal' }),
    ],
    [
      'a composer.json repository that is a URL instead of a repository',
      () => manifestRead({ repositories: ['http://satis.internal'] }),
    ],
    [
      'a composer.json repository whose URL is not text',
      () => manifestRead({ repositories: [{ type: 'composer', url: 1 }] }),
    ],
    [
      'a composer.lock with no list of packages',
      () => readComposerLock('composer.lock', '{"content-hash": "abc"}'),
    ],
    [
      'a composer.lock package with no name',
      () =>
        readComposerLock(
          'composer.lock',
          '{"packages": [{"version": "1.0.0"}]}'
        ),
    ],
    [
      'a composer.lock package whose dist is a URL instead of a table',
      () =>
        readComposerLock(
          'composer.lock',
          '{"packages": [{"name": "me/zip", "dist": "http://example.com/zip.zip"}]}'
        ),
    ],
  ];

  for (const [description, read] of cases)
    it(`refuses ${description}`, () => {
      strict.throws(read, CANNOT_JUDGE);
    });
});
