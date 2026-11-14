import { describe, it, strict } from 'poku';
import { readPipConfig } from '../../../src/hooks/dependency/python/pip-config.js';
import {
  readPipfile,
  readPipfileLock,
} from '../../../src/hooks/dependency/python/pipenv.js';
import { readPoetryLock } from '../../../src/hooks/dependency/python/poetry.js';
import { readPyproject } from '../../../src/hooks/dependency/python/pyproject.js';
import { readRequirements } from '../../../src/hooks/dependency/python/requirements.js';
import {
  readUvConfig,
  readUvLock,
} from '../../../src/hooks/dependency/python/uv.js';
import {
  CANNOT_JUDGE,
  CLEAN,
  coverage,
  findings,
  PLAIN,
  reported,
  UNHASHED,
} from './__utils__.js';

const EXTRA_INDEX =
  'merges package indexes, so a public package can shadow a private one';

describe('a pip requirements file flags what its options and requirements decide', () => {
  it('flags plain sources, extra indexes, and leaves every credential out of the report', () => {
    const result = readRequirements(
      'requirements.txt',
      `--index-url http://deploy:s3cret@pypi.internal/simple
--extra-index-url https://download.pytorch.org/whl/cpu
-f http://wheels.example.com/
-r http://example.com/base.txt
flask>=2.0
evil @ http://example.com/evil-1.0.tar.gz
-e git+http://github.com/me/tool.git#egg=tool
safe @ https://example.com/safe-1.0.tar.gz
`
    );

    strict.deepStrictEqual(
      reported(result),
      findings([
        `${PLAIN}: evil @ http://example.com/evil-1.0.tar.gz, git+http://github.com/me/tool.git#egg=tool, http://example.com/base.txt, http://pypi.internal/simple, http://wheels.example.com/`,
        `${EXTRA_INDEX}: https://download.pytorch.org/whl/cpu`,
      ])
    );
  });

  it('reads options the way pip does: abbreviated, joined by =, glued to a short flag, or continued with a backslash', () => {
    const result = readRequirements(
      'requirements.txt',
      `--extra-index https://a.example/simple
--extra-index-url=https://b.example/simple
-ihttp://c.example/simple
--find-links \\
    http://d.example/wheels
pkg @ https://example.com/pkg.tar.gz#sha256=abc  # a fragment, then a comment
`
    );

    strict.deepStrictEqual(
      reported(result),
      findings([
        `${PLAIN}: http://c.example/simple, http://d.example/wheels`,
        `${EXTRA_INDEX}: https://a.example/simple, https://b.example/simple`,
      ])
    );
  });

  it('demands a hash of every requirement resolved from an index once the file records any', () => {
    const results = [
      `requests==2.32.3 \\
    --hash=sha256:a
flask==3.0.3
-e .
direct @ https://example.com/direct.tar.gz
`,
      '--require-hashes\nflask==3.0.3\n',
      'flask==3.0.3\nrequests==2.32.3\n',
    ].map((content) => reported(readRequirements('requirements.txt', content)));

    strict.deepStrictEqual(results, [
      findings([`${UNHASHED}: flask==3.0.3`]),
      findings([`${UNHASHED}: flask==3.0.3`]),
      CLEAN,
    ]);
  });

  describe('pins like a lockfile only when every requirement from an index allows one version', () => {
    const cases: Array<[string, { needsLockfile: boolean; pins: boolean }]> = [
      [
        'flask==3.0.3\nrequests===2.32.3\n',
        { needsLockfile: false, pins: true },
      ],
      ['flask==3.0.3\n-e .\n', { needsLockfile: false, pins: true }],
      ['flask>=2.0\n', { needsLockfile: true, pins: false }],
      ['flask==3.*\n', { needsLockfile: true, pins: false }],
      ['flask\nrequests==2.32.3\n', { needsLockfile: true, pins: false }],
      [
        'flask (==3.0.3) ; python_version >= "3.9"\n',
        { needsLockfile: false, pins: true },
      ],
      [
        '-e .\n./vendor/pkg\nlib @ https://example.com/lib.whl\n',
        { needsLockfile: false, pins: false },
      ],
    ];

    for (const [content, expected] of cases)
      it(`reads ${JSON.stringify(content)}`, () => {
        const { needsLockfile, pins } = readRequirements(
          'requirements.txt',
          content
        );

        strict.deepStrictEqual({ needsLockfile, pins }, expected);
      });
  });
});

describe('a conda export named like a requirements file is read as conda, never as pip', () => {
  const CONDA_EXPORT = `# This file may be used to create an environment using:
# $ conda create --name <env> --file <this file>
# platform: linux-64
_libgcc_mutex=0.1=main
ca-certificates=2024.9.24=h06a4308_0
numpy=1.26.4=py311h08b1b3b_0
python=3.11.10=he870216_0
`;

  it('flags nothing and covers nothing in the file conda list --export writes, which pip refuses', () => {
    const read = readRequirements('requirements.txt', CONDA_EXPORT);

    strict.deepStrictEqual(
      [reported(read), coverage(read)],
      [CLEAN, { needsLockfile: false, pins: false, declaresWorkspace: false }]
    );
  });

  const mixed: Array<[string, string]> = [
    [
      'a conda line beside a pip requirement',
      'numpy=1.26.4=py311h08b1b3b_0\nrequests==2.32.3\n',
    ],
    [
      'a conda line beside a pip option',
      '--extra-index-url https://pypi.internal.example/simple\nnumpy=1.26.4=py311h08b1b3b_0\n',
    ],
    ['a single-equal pin without a build', 'numpy=1.26.4\n'],
  ];

  for (const [description, content] of mixed)
    it(`still refuses ${description}, which neither pip nor a conda export writes`, () => {
      strict.throws(
        () => readRequirements('requirements.txt', content),
        CANNOT_JUDGE
      );
    });
});

describe('a pip configuration file flags the indexes every section names', () => {
  it('reads keys in any section, with underscores or dashes, and values continued on indented lines', () => {
    const result = readPipConfig(
      'pip.conf',
      `[global]
index-url = http://pypi.internal/simple
; a comment
[install]
extra_index_url =
    https://private.example/simple

    http://mirror.example/simple
trusted-host = pypi.internal
`
    );

    strict.deepStrictEqual(
      reported(result),
      findings([
        `${PLAIN}: http://mirror.example/simple, http://pypi.internal/simple`,
        `${EXTRA_INDEX}: http://mirror.example/simple, https://private.example/simple`,
      ])
    );
  });
});

describe('a pyproject.toml flags what its dependency lists and its Poetry and uv tables decide', () => {
  it('reads the standard lists, the build requirements, and the uv settings, sources, and workspace', () => {
    const result = readPyproject(
      'pyproject.toml',
      `[build-system]
requires = ["hatchling", "plugin @ http://example.com/plugin.whl"]

[project]
name = "app"
dependencies = ["fastapi>=0.110", "evil @ http://example.com/evil.tar.gz"]

[project.optional-dependencies]
cli = ["typer"]

[dependency-groups]
lint = ["ruff", { include-group = "test" }]
test = ["pytest"]

[tool.uv]
index-strategy = "unsafe-best-match"
extra-index-url = ["https://private.example/simple"]

[[tool.uv.index]]
name = "mirror"
url = "http://mirror.example/simple"

[tool.uv.sources]
lib = { git = "git://github.com/me/lib.git" }
wheel = [{ url = "http://example.com/wheel.whl", marker = "sys_platform == 'linux'" }]

[tool.uv.pip]
index-strategy = "unsafe-first-match"

[tool.uv.workspace]
members = ["packages/*"]
`
    );

    strict.deepStrictEqual(
      [reported(result), coverage(result)],
      [
        findings([
          `${PLAIN}: evil @ http://example.com/evil.tar.gz, http://mirror.example/simple, lib @ git://github.com/me/lib.git, plugin @ http://example.com/plugin.whl, wheel @ http://example.com/wheel.whl`,
          `${EXTRA_INDEX}: index-strategy unsafe-best-match, index-strategy unsafe-first-match`,
        ]),
        { needsLockfile: true, pins: false, declaresWorkspace: true },
      ]
    );
  });

  it('reads the Poetry dependencies, groups, and sources, counting the Python version as no dependency', () => {
    const result = readPyproject(
      'pyproject.toml',
      `[tool.poetry.dependencies]
python = "^3.12"
fork = { git = "http://github.com/me/fork.git", branch = "main" }
split = [{ version = "1.0", python = "<3.12" }, { url = "http://example.com/split.whl", python = ">=3.12" }]

[tool.poetry.group.dev.dependencies]
pytest = "^8"

[[tool.poetry.source]]
name = "internal"
url = "http://internal.example/simple"
priority = "supplemental"
`
    );
    const interpreterOnly = readPyproject(
      'pyproject.toml',
      '[tool.poetry.dependencies]\npython = "^3.12"\n'
    );

    strict.deepStrictEqual(
      [reported(result), coverage(result), coverage(interpreterOnly)],
      [
        findings([
          `${PLAIN}: fork @ http://github.com/me/fork.git, http://internal.example/simple, split @ http://example.com/split.whl`,
        ]),
        { needsLockfile: true, pins: false, declaresWorkspace: false },
        { needsLockfile: false, pins: false, declaresWorkspace: false },
      ]
    );
  });

  it('stays silent on a project with bounded ranges over https', () => {
    const result = readPyproject(
      'pyproject.toml',
      `[project]
dependencies = ["django>=5.0,<6", "lib @ https://example.com/lib.whl"]

[tool.uv]
index-strategy = "first-index"

[[tool.uv.index]]
url = "https://private.example/simple"
explicit = true
`
    );

    strict.deepStrictEqual(reported(result), CLEAN);
  });
});

describe('a uv.toml flags the indexes it configures', () => {
  it('reads the settings at the top of the file and under pip', () => {
    const result = readUvConfig(
      'uv.toml',
      `index-url = "http://mirror.example/simple"

[pip]
index-strategy = "unsafe-best-match"
`
    );

    strict.deepStrictEqual(
      reported(result),
      findings([
        `${PLAIN}: http://mirror.example/simple`,
        `${EXTRA_INDEX}: index-strategy unsafe-best-match`,
      ])
    );
  });
});

describe('a Python lockfile flags each package its entries leave unprotected', () => {
  it('reads uv.lock, where a package from a remote registry needs a hash on every distribution', () => {
    const result = readUvLock(
      'uv.lock',
      `version = 1
revision = 2

[[package]]
name = "anyio"
version = "4.4.0"
source = { registry = "https://pypi.org/simple" }
sdist = { url = "https://files.pythonhosted.org/anyio-4.4.0.tar.gz", hash = "sha256:a", size = 1, upload-time = 2024-05-26T22:07:00Z }
wheels = [{ url = "https://files.pythonhosted.org/anyio-4.4.0-py3-none-any.whl", hash = "sha256:b" }]

[[package]]
name = "partial"
version = "1.0.0"
source = { registry = "https://private.example/simple" }
sdist = { url = "https://private.example/partial-1.0.0.tar.gz", hash = "sha256:c" }
wheels = [{ url = "https://private.example/partial-1.0.0-py3-none-any.whl" }]

[[package]]
name = "mirror"
version = "1.0.0"
source = { registry = "http://mirror.example/simple" }
wheels = [{ url = "http://mirror.example/mirror-1.0.0-py3-none-any.whl", hash = "sha256:d" }]

[[package]]
name = "fork"
version = "0.1.0"
source = { git = "https://github.com/me/fork?rev=main#abc" }

[[package]]
name = "vendored"
version = "1.0.0"
source = { registry = "../wheels" }
wheels = [{ path = "vendored-1.0.0-py3-none-any.whl" }]

[[package]]
name = "app"
version = "0.1.0"
source = { editable = "." }
`
    );

    strict.deepStrictEqual(
      reported(result),
      findings([`${PLAIN}: mirror==1.0.0`, `${UNHASHED}: partial==1.0.0`])
    );
  });

  it('reads poetry.lock, from the files of each package or, before Poetry 1.3, from the metadata', () => {
    const results = [
      `[[package]]
name = "certifi"
version = "2024.2.2"
files = [{file = "certifi-2024.2.2.tar.gz", hash = "sha256:a"}]

[[package]]
name = "bare"
version = "1.0"
files = []

[[package]]
name = "internal"
version = "1.0"
files = [{file = "internal-1.0.tar.gz", hash = "sha256:b"}]

[package.source]
type = "legacy"
url = "http://internal.example/simple"
reference = "internal"

[[package]]
name = "fork"
version = "0.1"
files = []

[package.source]
type = "git"
url = "https://github.com/me/fork.git"
reference = "main"
resolved_reference = "abc"

[metadata]
lock-version = "2.0"
`,
      `[[package]]
name = "Typing_Extensions"
version = "4.0"

[[package]]
name = "six"
version = "1.0"

[metadata]
lock-version = "1.1"

[metadata.files]
typing-extensions = [{file = "typing_extensions-4.0.tar.gz", hash = "sha256:c"}]
`,
    ].map((content) => reported(readPoetryLock('poetry.lock', content)));

    strict.deepStrictEqual(results, [
      findings([`${PLAIN}: internal==1.0`, `${UNHASHED}: bare==1.0`]),
      findings([`${UNHASHED}: six==1.0`]),
    ]);
  });

  it('reads Pipfile.lock, judging each package by the index it names', () => {
    const result = readPipfileLock(
      'Pipfile.lock',
      JSON.stringify({
        _meta: {
          sources: [
            { name: 'pypi', url: 'https://pypi.org/simple' },
            { name: 'internal', url: 'http://internal.example/simple' },
          ],
        },
        default: {
          requests: {
            hashes: ['sha256:a'],
            index: 'pypi',
            version: '==2.32.3',
          },
          bare: { version: '==1.0.0' },
          internal: {
            hashes: ['sha256:b'],
            index: 'internal',
            version: '==1.0',
          },
          fork: { git: 'git://github.com/me/fork.git', ref: 'abc' },
          app: { editable: true, path: '.' },
        },
        develop: {
          pytest: { hashes: ['sha256:c'], index: 'pypi', version: '==8.0.0' },
        },
      })
    );

    strict.deepStrictEqual(
      reported(result),
      findings([`${PLAIN}: fork, internal==1.0`, `${UNHASHED}: bare==1.0.0`])
    );
  });
});

describe('a Pipfile flags its sources and packages', () => {
  it('reads every category of packages, leaving out its settings', () => {
    const result = readPipfile(
      'Pipfile',
      `[[source]]
url = "http://internal.example/simple"
verify_ssl = true
name = "internal"

[packages]
requests = "*"
fork = { git = "http://github.com/me/fork.git", ref = "main" }

[docs]
mkdocs = "*"

[requires]
python_version = "3.12"
`
    );
    const settingsOnly = readPipfile(
      'Pipfile',
      '[requires]\npython_version = "3.12"\n\n[dev-packages]\n'
    );

    strict.deepStrictEqual(
      [reported(result), coverage(result), coverage(settingsOnly)],
      [
        findings([
          `${PLAIN}: fork @ http://github.com/me/fork.git, http://internal.example/simple`,
        ]),
        { needsLockfile: true, pins: false, declaresWorkspace: false },
        { needsLockfile: false, pins: false, declaresWorkspace: false },
      ]
    );
  });
});

describe('a Python dependency file the checker cannot judge is refused instead of read as clean', () => {
  const cases: Array<[string, () => unknown]> = [
    [
      'a pyproject.toml that is not TOML',
      () =>
        readPyproject('pyproject.toml', '[project]\ndependencies = ["a",\n'),
    ],
    [
      'a pyproject.toml that sets a key twice',
      () =>
        readPyproject('pyproject.toml', '[project]\nname = "a"\nname = "b"\n'),
    ],
    [
      'a pyproject.toml whose __proto__ key would reach a prototype',
      () => readPyproject('pyproject.toml', '[tool.uv]\n"__proto__" = "x"\n'),
    ],
    [
      'a pyproject.toml whose dependencies are not a list of text',
      () => readPyproject('pyproject.toml', '[project]\ndependencies = "a"\n'),
    ],
    [
      'a pyproject.toml whose index strategy is a date',
      () =>
        readPyproject(
          'pyproject.toml',
          '[tool.uv]\nindex-strategy = 2024-01-01\n'
        ),
    ],
    [
      'a pyproject.toml with a requirement that is not PEP 508',
      () =>
        readPyproject(
          'pyproject.toml',
          '[project]\ndependencies = ["flask >> 2"]\n'
        ),
    ],
    [
      'a Pipfile whose package is a number',
      () => readPipfile('Pipfile', '[packages]\nrequests = 1\n'),
    ],
    [
      'a uv.lock with no version',
      () => readUvLock('uv.lock', '[[package]]\nname = "a"\n'),
    ],
    [
      'a uv.lock package with no source',
      () => readUvLock('uv.lock', 'version = 1\n[[package]]\nname = "a"\n'),
    ],
    [
      'a poetry.lock with no metadata',
      () => readPoetryLock('poetry.lock', '[[package]]\nname = "a"\n'),
    ],
    [
      'a Pipfile.lock that is not JSON',
      () => readPipfileLock('Pipfile.lock', '{'),
    ],
    [
      'a JSON file that is not a Pipfile.lock',
      () => readPipfileLock('Pipfile.lock', '{"default":{}}'),
    ],
    [
      'a Pipfile.lock package from an index it does not list',
      () =>
        readPipfileLock(
          'Pipfile.lock',
          '{"_meta":{"sources":[]},"default":{"a":{"version":"==1","index":"x","hashes":["h"]}}}'
        ),
    ],
    [
      'a requirements file with an option pip does not know',
      () => readRequirements('requirements.txt', '--trust-everything\n'),
    ],
    [
      'a requirements file with an option missing its value',
      () => readRequirements('requirements.txt', '--index-url\n'),
    ],
    [
      'a requirements file with a line that is not a requirement',
      () => readRequirements('requirements.txt', 'pip install flask\n'),
    ],
    [
      'a pip.conf with a key before any section',
      () => readPipConfig('pip.conf', 'index-url = https://a.example\n'),
    ],
    [
      'a pip.conf that sets a key twice in a section',
      () =>
        readPipConfig(
          'pip.conf',
          '[global]\nindex-url = https://a.example\nindex-url = https://b.example\n'
        ),
    ],
  ];

  for (const [description, read] of cases)
    it(`refuses ${description}`, () => {
      strict.throws(read, CANNOT_JUDGE);
    });
});
