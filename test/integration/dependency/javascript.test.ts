import type { NpmrcSettings } from '../../../src/types/hooks/dependency.js';
import type { FileAnalysis } from '../../../src/types/scan.js';
import { describe, it, strict } from 'poku';
import { analysisOf } from '../../../src/hooks/dependency/analysis.js';
import { lockedFlags } from '../../../src/hooks/dependency/javascript/lockfile.js';
import { readManifest } from '../../../src/hooks/dependency/javascript/manifest.js';
import { npmEntries } from '../../../src/hooks/dependency/javascript/npm.js';
import {
  npmrcSettingsOf,
  readNpmrc,
} from '../../../src/hooks/dependency/javascript/npmrc.js';
import { pnpmEntries } from '../../../src/hooks/dependency/javascript/pnpm.js';
import { isFloating } from '../../../src/hooks/dependency/javascript/specifier.js';
import {
  readYarnrc,
  readYarnrcYml,
} from '../../../src/hooks/dependency/javascript/yarn-config.js';
import { yarnEntries } from '../../../src/hooks/dependency/javascript/yarn.js';
import {
  CANNOT_JUDGE,
  CLEAN,
  FLOATING,
  GUARDED,
  leads,
  manifestReport,
  PLAIN,
  report,
  reported,
  UNHASHED,
} from './__utils__.js';

const REMOTE = 'fetched from outside the registry (git or a remote tarball)';
const SCRIPTS = 'runs install scripts';

const npmReport = (content: unknown): FileAnalysis =>
  analysisOf(
    lockedFlags(npmEntries('package-lock.json', JSON.stringify(content)))
  );

const pnpmReport = (content: string): FileAnalysis =>
  analysisOf(lockedFlags(pnpmEntries('pnpm-lock.yaml', content)));

const yarnReport = (content: string): FileAnalysis =>
  analysisOf(lockedFlags(yarnEntries('yarn.lock', content)));

describe('a registry specifier floats when it takes whatever is published next', () => {
  const cases: Array<[string, boolean]> = [
    ['*', true],
    ['', true],
    ['x', true],
    ['1.x || *', true],
    ['latest', true],
    ['next', true],
    ['>=1.0.0', true],
    ['^1 || >2', true],
    ['npm:other', true],
    ['npm:@scope/other@latest', true],
    ['^1.2.3', false],
    ['~1.2', false],
    ['1.x', false],
    ['1.2.3', false],
    ['v1.2.3', false],
    ['>=1.0.0 <2.0.0', false],
    ['npm:other@^2.0.0', false],
  ];

  for (const [spec, floats] of cases)
    it(`reads ${JSON.stringify(spec)} as ${floats ? 'floating' : 'bounded'}`, () => {
      strict.strictEqual(isFloating(spec), floats);
    });
});

describe('a manifest flags what its specifiers decide', () => {
  it('flags plain transport, sources outside the registry, and floating ranges, naming each package', () => {
    const result = manifestReport({
      dependencies: {
        pad: 'http://example.com/pad.tgz',
        old: 'git://github.com/me/old.git',
        fork: 'github:me/fork',
        short: 'me/short#v1',
        tarball: 'https://example.com/t.tgz',
        any: '*',
      },
      devDependencies: { tagged: 'latest' },
      optionalDependencies: { open: '>=2.0.0' },
    });

    strict.deepStrictEqual(
      result,
      report(
        [
          `${PLAIN}: old@git://github.com/me/old.git, pad@http://example.com/pad.tgz`,
        ],
        [
          `${REMOTE}: fork@github:me/fork, short@me/short#v1, tarball@https://example.com/t.tgz`,
          `${FLOATING}: any@*, open@>=2.0.0, tagged@latest`,
        ]
      )
    );
  });

  it('stays silent on bounded registry ranges, project sources, and peer ranges', () => {
    const result = manifestReport({
      dependencies: {
        ms: '^2.1.3',
        local: 'file:../local',
        sibling: 'workspace:*',
        shared: 'catalog:',
        alias: 'npm:other@^1.0.0',
      },
      peerDependencies: { react: '*' },
    });

    strict.deepStrictEqual(result, CLEAN);
  });

  it('reports whether it installs anything and whether it is a workspace root', () => {
    const reads = [
      { workspaces: ['packages/*'] },
      { workspaces: { packages: ['apps/*'] }, devDependencies: { a: '1.0.0' } },
      { peerDependencies: { react: '*' } },
    ].map((content) => readManifest('package.json', JSON.stringify(content)));

    strict.deepStrictEqual(
      reads.map(({ needsLockfile, declaresWorkspace }) => ({
        needsLockfile,
        declaresWorkspace,
      })),
      [
        { needsLockfile: false, declaresWorkspace: true },
        { needsLockfile: true, declaresWorkspace: true },
        { needsLockfile: false, declaresWorkspace: false },
      ]
    );
  });
});

describe('an npm lockfile flags what its entries decide', () => {
  it('reads the packages map of npm 7 and later', () => {
    const result = npmReport({
      lockfileVersion: 3,
      packages: {
        '': { dependencies: { tarball: 'https://example.com/t.tgz' } },
        'node_modules/pad': {
          version: '1.0.0',
          resolved: 'http://registry.example.com/pad/-/pad-1.0.0.tgz',
          integrity: 'sha512-a',
        },
        'node_modules/nohash': {
          version: '2.0.0',
          resolved: 'https://registry.npmjs.org/nohash/-/nohash-2.0.0.tgz',
        },
        'node_modules/fork': {
          version: '1.0.0',
          resolved: 'git+ssh://git@github.com/me/fork.git#abc',
        },
        'node_modules/tarball': {
          version: '1.0.0',
          resolved: 'https://example.com/t.tgz',
          integrity: 'sha512-b',
        },
        'node_modules/a/node_modules/esbuild': {
          version: '0.20.0',
          resolved: 'https://registry.npmjs.org/esbuild/-/esbuild-0.20.0.tgz',
          integrity: 'sha512-c',
          hasInstallScript: true,
        },
      },
    });

    strict.deepStrictEqual(
      result,
      report(
        [`${PLAIN}: pad@1.0.0`, `${UNHASHED}: nohash@2.0.0`],
        [`${REMOTE}: fork@1.0.0, tarball@1.0.0`, `${SCRIPTS}: esbuild@0.20.0`]
      )
    );
  });

  it('leaves out the root, workspace folders, links, bundled packages, and local sources', () => {
    const result = npmReport({
      lockfileVersion: 3,
      packages: {
        '': { workspaces: ['packages/*'] },
        'packages/a': { version: '1.0.0' },
        'node_modules/a': { resolved: 'packages/a', link: true },
        'node_modules/inner': { version: '1.0.0', inBundle: true },
        'node_modules/local': { version: '1.0.0', resolved: 'file:../local' },
        'node_modules/ms': {
          version: '2.1.3',
          resolved: 'https://registry.npmjs.org/ms/-/ms-2.1.3.tgz',
          integrity: 'sha512-d',
        },
      },
    });

    strict.deepStrictEqual(result, CLEAN);
  });

  it('reads the nested dependencies tree of npm 6 and earlier', () => {
    const result = npmReport({
      lockfileVersion: 1,
      dependencies: {
        ms: { version: '2.1.3', integrity: 'sha512-e' },
        nohash: { version: '1.0.0', resolved: 'https://r.example/nohash.tgz' },
        parent: {
          version: '1.0.0',
          integrity: 'sha512-f',
          dependencies: {
            fork: { version: 'github:me/fork#abc' },
            pad: {
              version: '1.0.0',
              resolved: 'http://registry.example.com/pad/-/pad-1.0.0.tgz',
              integrity: 'sha512-g',
            },
            inner: { version: '1.0.0', bundled: true },
          },
        },
      },
    });

    strict.deepStrictEqual(
      result,
      report(
        [`${PLAIN}: pad@1.0.0`, `${UNHASHED}: nohash@1.0.0`],
        [`${REMOTE}: fork@github:me/fork#abc`]
      )
    );
  });
});

describe('a pnpm lockfile flags what its packages decide', () => {
  it('reads every resolution form across lockfile versions', () => {
    const result = pnpmReport(`lockfileVersion: '6.0'

packages:

  /a@1.0.0:
    resolution: {integrity: sha512-x}
    requiresBuild: true

  /nohash@1.0.0:
    resolution: {}

  github.com/me/repo/abc123:
    resolution: {tarball: https://codeload.github.com/me/repo/tar.gz/abc123}
    name: repo
    version: 1.0.0

  /plain@1.0.0:
    resolution: {integrity: sha512-y, tarball: http://registry.example.com/plain/-/plain-1.0.0.tgz}

  git@https://github.com/me/git.git#abc:
    resolution: {commit: abc, repo: https://github.com/me/git.git, type: git}

  local@file:../local:
    resolution: {directory: ../local, type: directory}
`);

    strict.deepStrictEqual(
      result,
      report(
        [`${PLAIN}: plain@1.0.0`, `${UNHASHED}: nohash@1.0.0`],
        [
          `${REMOTE}: git@https://github.com/me/git.git#abc, github.com/me/repo/abc123`,
          `${SCRIPTS}: a@1.0.0`,
        ]
      )
    );
  });

  it('reads block resolutions and every document of the file', () => {
    const result = pnpmReport(`---
lockfileVersion: '9.0'

packages:

  pnpm@10.0.0:
    resolution: {integrity: sha512-p}
---
lockfileVersion: '9.0'

importers:

  .:
    dependencies:
      lodash:
        specifier: ^4.17.21
        version: 4.17.21

packages:

  '@scope/thing@1.0.0':
    resolution:
      integrity: sha512-q
      revision: 1

  lodash@4.17.21:
    resolution:
      revision: 1

snapshots:

  lodash@4.17.21: {}
`);

    strict.deepStrictEqual(result, report([`${UNHASHED}: lodash@4.17.21`], []));
  });
});

describe('a Yarn lockfile flags what its entries decide', () => {
  it('reads Yarn 1, where a hash after the resolved URL counts as the integrity', () => {
    const result =
      yarnReport(`# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1


"a@^1.0.0", a@^1.1.0:
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/a/-/a-1.1.0.tgz"
  dependencies:
    b "^1.0.0"

b@^1.0.0:
  version "1.0.0"
  resolved "http://registry.example.com/b/-/b-1.0.0.tgz#0123456789abcdef0123456789abcdef01234567"

c@user/c:
  version "1.0.0"
  resolved "https://codeload.github.com/user/c/tar.gz/abc"

d@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/d/-/d-2.0.0.tgz"
  integrity sha512-d

e@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/e/-/e-3.0.0.tgz#0123456789abcdef0123456789abcdef01234567"
`);

    strict.deepStrictEqual(
      result,
      report(
        [`${PLAIN}: b@1.0.0`, `${UNHASHED}: a@1.1.0`],
        [`${REMOTE}: c@1.0.0`]
      )
    );
  });

  it('reads Yarn 2 and later, where registry entries carry a checksum unless Yarn locks them with conditions, which it never checksums', () => {
    const result = yarnReport(`__metadata:
  version: 8
  cacheKey: 10c0

"a@npm:^1.0.0":
  version: 1.0.0
  resolution: "a@npm:1.0.0"
  languageName: node
  linkType: hard

"b@npm:^2.0.0":
  version: 2.0.0
  resolution: "b@npm:2.0.0"
  checksum: 10c0/abc
  languageName: node
  linkType: hard

"g@https://github.com/u/g.git#commit=abc":
  version: 1.0.0
  resolution: "g@https://github.com/u/g.git#commit=abc"

"h@http://example.com/h.tgz":
  version: 1.0.0
  resolution: "h@http://example.com/h.tgz"

"app@workspace:.":
  version: 0.0.0-use.local
  resolution: "app@workspace:."

"@esbuild/linux-x64@npm:0.25.0":
  version: 0.25.0
  resolution: "@esbuild/linux-x64@npm:0.25.0"
  conditions: os=linux & cpu=x64
  languageName: node
  linkType: hard
`);

    strict.deepStrictEqual(
      result,
      report(
        [`${PLAIN}: h@1.0.0`, `${UNHASHED}: a@1.0.0`],
        [`${REMOTE}: g@1.0.0`]
      )
    );
  });

  it('reads an empty yarn.lock as nothing locked yet', () => {
    strict.deepStrictEqual(yarnReport('\n'), CLEAN);
  });
});

describe('a lockfile URL on the public registry is judged by how its package manager fetches it', () => {
  const npmLockfile = (resolved: string): string =>
    JSON.stringify({
      lockfileVersion: 3,
      packages: {
        'node_modules/pad': {
          version: '1.0.0',
          resolved,
          integrity: 'sha512-a',
        },
      },
    });

  const npmCases: Array<[string, string, boolean, boolean]> = [
    [
      'swaps the public registry for the registry it is configured with',
      'http://registry.npmjs.org/pad/-/pad-1.0.0.tgz',
      false,
      false,
    ],
    [
      'swaps it whatever port the URL names',
      'http://registry.npmjs.org:80/pad/-/pad-1.0.0.tgz',
      false,
      false,
    ],
    [
      'fetches it as written once replace-registry-host keeps lockfile URLs',
      'http://registry.npmjs.org/pad/-/pad-1.0.0.tgz',
      true,
      true,
    ],
    [
      'fetches a host that only begins like the public registry as written',
      'http://registry.npmjs.org.evil.example/pad.tgz',
      false,
      true,
    ],
    [
      'fetches a path that names the public registry as written',
      'http://evil.example/registry.npmjs.org/pad.tgz',
      false,
      true,
    ],
  ];

  for (const [behavior, resolved, keepsUrls, plain] of npmCases)
    it(`npm ${behavior}`, () => {
      const result = analysisOf(
        lockedFlags(
          npmEntries('package-lock.json', npmLockfile(resolved), keepsUrls)
        )
      );

      strict.deepStrictEqual(
        result,
        plain ? report([`${PLAIN}: pad@1.0.0`], []) : CLEAN
      );
    });

  const yarnCases: Array<[string, string, boolean]> = [
    [
      'moves its own registry to https',
      'http://registry.yarnpkg.com/b/-/b-1.0.0.tgz',
      false,
    ],
    [
      'moves the npm registry to https',
      'http://registry.npmjs.org/b/-/b-1.0.0.tgz',
      false,
    ],
    [
      'moves any npmjs.com host to https',
      'http://cdn.npmjs.com/b/-/b-1.0.0.tgz',
      false,
    ],
    [
      'keeps a URL that names a port, as its own match requires a slash after the host',
      'http://registry.npmjs.org:80/b/-/b-1.0.0.tgz',
      true,
    ],
    [
      'keeps a host spelled in capitals, as its own match is case-sensitive',
      'http://REGISTRY.YARNPKG.COM/b/-/b-1.0.0.tgz',
      true,
    ],
    [
      'keeps a host that only begins like its registry',
      'http://registry.yarnpkg.com.evil.example/b.tgz',
      true,
    ],
  ];

  for (const [behavior, resolved, plain] of yarnCases)
    it(`Yarn 1 ${behavior}`, () => {
      const result = yarnReport(`# yarn lockfile v1


b@^1.0.0:
  version "1.0.0"
  resolved "${resolved}"
  integrity sha512-b
`);

      strict.deepStrictEqual(
        result,
        plain ? report([`${PLAIN}: b@1.0.0`], []) : CLEAN
      );
    });
});

describe('an .npmrc flags each registry npm fetches from over plain http://', () => {
  it('reads the registry and every scoped registry the way npm reads the file, before its first section', () => {
    const result = readNpmrc(
      '.npmrc',
      [
        '; a comment',
        '# another comment',
        'registry=http://registry.example.com/ # the default',
        '@acme:registry = "http://npm.acme.example/"',
        '@safe:registry=https://npm.safe.example/',
        '@local:registry=http://localhost:4873/',
        '//npm.acme.example/:_authToken=${NPM_TOKEN}',
        'cache=http://not.a.registry.example/',
        '[section]',
        'registry=http://after.a.section.example/',
      ].join('\n')
    );

    strict.deepStrictEqual(
      reported(result),
      report(
        [`${PLAIN}: http://npm.acme.example/, http://registry.example.com/`],
        []
      )
    );
  });

  const settings: Array<[string, NpmrcSettings]> = [
    ['', { ignoresScripts: false, keepsLockedRegistryUrls: false }],
    [
      'ignore-scripts=true',
      { ignoresScripts: true, keepsLockedRegistryUrls: false },
    ],
    [
      'ignore-scripts',
      { ignoresScripts: true, keepsLockedRegistryUrls: false },
    ],
    [
      'ignore-scripts = "true"',
      { ignoresScripts: true, keepsLockedRegistryUrls: false },
    ],
    [
      'ignore-scripts=false',
      { ignoresScripts: false, keepsLockedRegistryUrls: false },
    ],
    [
      '[section]\nignore-scripts=true',
      { ignoresScripts: false, keepsLockedRegistryUrls: false },
    ],
    [
      'replace-registry-host=npmjs',
      { ignoresScripts: false, keepsLockedRegistryUrls: false },
    ],
    [
      'replace-registry-host=always',
      { ignoresScripts: false, keepsLockedRegistryUrls: false },
    ],
    [
      'replace-registry-host=registry.npmjs.org',
      { ignoresScripts: false, keepsLockedRegistryUrls: false },
    ],
    [
      'replace-registry-host=https://registry.npmjs.org/',
      { ignoresScripts: false, keepsLockedRegistryUrls: false },
    ],
    [
      'replace-registry-host=never',
      { ignoresScripts: false, keepsLockedRegistryUrls: true },
    ],
    [
      'replace-registry-host=npm.acme.example',
      { ignoresScripts: false, keepsLockedRegistryUrls: true },
    ],
  ];

  for (const [content, expected] of settings)
    it(`settles ${JSON.stringify(content)} for the lockfile beside it as npm does`, () => {
      strict.deepStrictEqual(npmrcSettingsOf(content), expected);
    });
});

describe('a .yarnrc flags each registry Yarn 1 fetches from over plain http://', () => {
  it('reads every top-level key, leaving out the hosts Yarn 1 moves to https', () => {
    const result = readYarnrc(
      '.yarnrc',
      [
        '# THIS IS AN AUTOGENERATED FILE.',
        'registry "http://registry.example.com"',
        '"@acme:registry" "http://npm.acme.example" # internal',
        '"@public:registry" "http://registry.yarnpkg.com"',
        'yarn-path ".yarn/releases/yarn-1.22.22.cjs"',
        'lastUpdateCheck 1700000000000',
        'nested:',
        '  registry "http://never.read.example"',
      ].join('\n')
    );

    strict.deepStrictEqual(
      reported(result),
      report(
        [`${PLAIN}: http://npm.acme.example, http://registry.example.com`],
        []
      )
    );
  });
});

describe('a .yarnrc.yml flags a registry over plain http:// and a checksum behavior that accepts a mismatch', () => {
  const SKIPPED =
    'accepts a package that does not match the checksum its lockfile records';

  it('reads a registry its whitelist allows over http:// as fetched in the clear, and any other as one Yarn refuses', () => {
    const result = readYarnrcYml(
      '.yarnrc.yml',
      `nodeLinker: node-modules
npmRegistryServer: "http://npm.internal.example"
npmScopes:
  acme:
    npmRegistryServer: http://npm.acme.example # internal
    npmAlwaysAuth: true
  safe:
    npmRegistryServer: "https://npm.safe.example"
  local:
    npmRegistryServer: "http://localhost:4873"
unsafeHttpWhitelist:
  - "*.internal.example"
checksumBehavior: ignore
`
    );

    strict.deepStrictEqual(reported(result), {
      findings: [
        `${PLAIN}: http://npm.internal.example`,
        `${SKIPPED}: checksumBehavior ignore`,
      ],
      review: [`${GUARDED}: http://npm.acme.example`],
      advisory: [],
    });
  });

  const whitelists: Array<[string, string, boolean]> = [
    ['["*.internal.example"]', 'npm.internal.example', true],
    ['["*.internal.example"]', 'internal.example', false],
    ['["npm.?.example"]', 'npm.a.example', true],
    ["['npm.acme.example', '*.other.example']", 'npm.acme.example', true],
    ['["NPM.ACME.EXAMPLE"]', 'npm.acme.example', false],
    ['["*"]', 'npm.acme.example', true],
    ['[]', 'npm.acme.example', false],
    [`["${'*a'.repeat(120)}b"]`, 'a'.repeat(200), false],
  ];

  for (const [whitelist, host, allowed] of whitelists)
    it(`reads http://${host.length > 40 ? `${host.slice(0, 12)}...` : host} as ${allowed ? 'allowed' : 'refused'} by ${whitelist.length > 40 ? 'a pattern built to stall a match' : whitelist}`, () => {
      const result = readYarnrcYml(
        '.yarnrc.yml',
        `npmRegistryServer: "http://${host}"\nunsafeHttpWhitelist: ${whitelist}\n`
      );

      strict.deepStrictEqual(
        reported(result),
        allowed
          ? report([`${PLAIN}: http://${host}`], [])
          : leads([`${GUARDED}: http://${host}`])
      );
    });

  const behaviors: Array<[string, boolean]> = [
    ['throw', false],
    ['reset', false],
    ['update', true],
    ['ignore', true],
  ];

  for (const [behavior, skips] of behaviors)
    it(`reads checksumBehavior ${behavior} as ${skips ? 'accepting' : 'refusing'} a mismatch`, () => {
      const result = readYarnrcYml(
        '.yarnrc.yml',
        `checksumBehavior: "${behavior}"\n`
      );

      strict.deepStrictEqual(
        reported(result),
        skips ? report([`${SKIPPED}: checksumBehavior ${behavior}`], []) : CLEAN
      );
    });
});

describe('a file the checker cannot judge is refused instead of read as clean', () => {
  const cases: Array<[string, () => unknown]> = [
    [
      'a package.json that is not JSON',
      () => readManifest('package.json', '{ broken'),
    ],
    [
      'a package.json whose dependencies are not names to specifiers',
      () => readManifest('package.json', '{"dependencies":{"a":1}}'),
    ],
    [
      'a package.json whose workspaces are text',
      () => readManifest('package.json', '{"workspaces":"packages/*"}'),
    ],
    [
      'an npm lockfile that is not JSON',
      () => npmEntries('package-lock.json', '{'),
    ],
    [
      'a JSON file that is not an npm lockfile',
      () => npmEntries('package-lock.json', '{}'),
    ],
    [
      'an npm lockfile entry with an integrity that is not text',
      () =>
        npmEntries(
          'package-lock.json',
          '{"lockfileVersion":3,"packages":{"node_modules/a":{"version":"1.0.0","integrity":1}}}'
        ),
    ],
    [
      'an npm lockfile whose packages are a list',
      () =>
        npmEntries('package-lock.json', '{"lockfileVersion":3,"packages":[]}'),
    ],
    [
      'a .yarnrc line that holds a key and no value',
      () => readYarnrc('.yarnrc', 'registry\n'),
    ],
    [
      'a .yarnrc.yml whitelist item that does not open with a dash',
      () =>
        readYarnrcYml('.yarnrc.yml', 'unsafeHttpWhitelist:\n  host.example\n'),
    ],
    [
      'a .yarnrc.yml value whose quote never closes',
      () => readYarnrcYml('.yarnrc.yml', 'npmRegistryServer: "http://a\n'),
    ],
    [
      'a YAML file that is not a pnpm lockfile',
      () => pnpmEntries('pnpm-lock.yaml', 'packages:\n'),
    ],
    [
      'a pnpm package with no resolution',
      () =>
        pnpmEntries(
          'pnpm-lock.yaml',
          "lockfileVersion: '9.0'\npackages:\n  a@1.0.0:\n    engines: {node: '>=18'}\n"
        ),
    ],
    [
      'a pnpm lockfile indented with a tab',
      () =>
        pnpmEntries(
          'pnpm-lock.yaml',
          "lockfileVersion: '9.0'\npackages:\n\ta@1.0.0:\n"
        ),
    ],
    [
      'a pnpm resolution that never closes',
      () =>
        pnpmEntries(
          'pnpm-lock.yaml',
          "lockfileVersion: '9.0'\npackages:\n  a@1.0.0:\n    resolution: {integrity: sha512-x\n"
        ),
    ],
    [
      'a yarn.lock with no version marker',
      () => yarnEntries('yarn.lock', 'a@^1.0.0:\n  version "1.0.0"\n'),
    ],
    [
      'a Yarn 1 entry with a field that has no value',
      () =>
        yarnEntries(
          'yarn.lock',
          '# yarn lockfile v1\n\na@^1.0.0:\n  version\n'
        ),
    ],
    [
      'a Yarn 2 entry with no resolution',
      () =>
        yarnEntries(
          'yarn.lock',
          '__metadata:\n  version: 8\n\n"a@npm:^1.0.0":\n  version: 1.0.0\n'
        ),
    ],
  ];

  for (const [description, read] of cases)
    it(`refuses ${description}`, () => {
      strict.throws(read, CANNOT_JUDGE);
    });
});
