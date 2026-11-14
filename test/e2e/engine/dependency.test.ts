import type { HookRun } from '../../../src/types/test.js';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { env } from 'node:process';
import { describe, it, strict } from 'poku';
import { installEngine, newWorkspace, runEngine } from './__utils__.js';

const JAVASCRIPT_HOSTILE: Record<string, string> = {
  'package.json': JSON.stringify({
    dependencies: {
      pad: 'http://example.com/pad.tgz',
      fork: 'github:me/fork',
      any: '*',
    },
  }),
  'package-lock.json': JSON.stringify({
    lockfileVersion: 3,
    packages: {
      '': { dependencies: { pad: 'http://example.com/pad.tgz' } },
      'node_modules/pad': {
        version: '1.0.0',
        resolved: 'http://example.com/pad.tgz',
      },
      'node_modules/nohash': {
        version: '2.0.0',
        resolved: 'https://registry.npmjs.org/nohash/-/nohash-2.0.0.tgz',
      },
      'node_modules/fork': {
        version: '1.0.0',
        resolved: 'git+ssh://git@github.com/me/fork.git#abc',
      },
      'node_modules/esbuild': {
        version: '0.20.0',
        resolved: 'https://registry.npmjs.org/esbuild/-/esbuild-0.20.0.tgz',
        integrity: 'sha512-a',
        hasInstallScript: true,
      },
    },
  }),
  'tools/package.json': JSON.stringify({
    devDependencies: { tsx: '^4.0.0' },
  }),
};

const JAVASCRIPT_HOSTILE_REPORT = `Dependency risks found:

package-lock.json
  fetched over plain http:// or git://: pad@1.0.0
  no integrity hash to check the download against: nohash@2.0.0

package.json
  fetched over plain http:// or git://: pad@http://example.com/pad.tgz

Dependency hardening advisories:

package-lock.json
  fetched from outside the registry (git or a remote tarball): fork@1.0.0
  runs install scripts: esbuild@0.20.0

package.json
  fetched from outside the registry (git or a remote tarball): fork@github:me/fork
  floating specifier (such as * or latest): any@*

tools/package.json
  declares dependencies, but no lockfile covers it
`;

const JAVASCRIPT_CLEAN: Record<string, string> = {
  'package.json': JSON.stringify({
    private: true,
    workspaces: ['packages/*'],
    devDependencies: { typescript: '^5.4.0' },
  }),
  'package-lock.json': JSON.stringify({
    lockfileVersion: 3,
    packages: {
      '': { devDependencies: { typescript: '^5.4.0' } },
      'packages/a': { version: '1.0.0', dependencies: { ms: '~2.1.3' } },
      'node_modules/a': { resolved: 'packages/a', link: true },
      'node_modules/ms': {
        version: '2.1.3',
        resolved: 'https://registry.npmjs.org/ms/-/ms-2.1.3.tgz',
        integrity: 'sha512-a',
      },
      'node_modules/typescript': {
        version: '5.4.5',
        resolved:
          'https://registry.npmjs.org/typescript/-/typescript-5.4.5.tgz',
        integrity: 'sha512-b',
      },
    },
  }),
  'packages/a/package.json': JSON.stringify({ dependencies: { ms: '~2.1.3' } }),
  'pnpm/package.json': JSON.stringify({ dependencies: { lib: 'workspace:*' } }),
  'pnpm/pnpm-workspace.yaml': 'packages:\n  - libs/*\n',
  'pnpm/libs/lib/package.json': JSON.stringify({
    dependencies: { lodash: '4.17.21' },
  }),
  'pnpm/pnpm-lock.yaml': `lockfileVersion: '9.0'

importers:

  .:
    dependencies:
      lib:
        specifier: workspace:*
        version: link:libs/lib

  libs/lib:
    dependencies:
      lodash:
        specifier: 4.17.21
        version: 4.17.21

packages:

  lodash@4.17.21:
    resolution: {integrity: sha512-c}

snapshots:

  lodash@4.17.21: {}
`,
  'classic/package.json': JSON.stringify({ dependencies: { ms: '^2.1.0' } }),
  'classic/yarn.lock': `# yarn lockfile v1


ms@^2.1.0:
  version "2.1.3"
  resolved "https://registry.yarnpkg.com/ms/-/ms-2.1.3.tgz#574c8138ce1d2b5861f0b44579dbadd60c6615b2"
  integrity sha512-d
`,
  'berry/package.json': JSON.stringify({ dependencies: { ms: '^2.1.0' } }),
  'berry/yarn.lock': `__metadata:
  version: 8
  cacheKey: 10c0

"berry@workspace:.":
  version: 0.0.0-use.local
  resolution: "berry@workspace:."
  languageName: unknown
  linkType: soft

"ms@npm:^2.1.0":
  version: 2.1.3
  resolution: "ms@npm:2.1.3"
  checksum: 10c0/abc
  languageName: node
  linkType: hard
`,
  'bun/package.json': JSON.stringify({ dependencies: { ms: '^2.1.0' } }),
  'bun/bun.lock': '{}\n',
};

const PYTHON_HOSTILE: Record<string, string> = {
  'requirements.txt': `--index-url http://deploy:s3cret@pypi.internal/simple
--extra-index-url https://download.pytorch.org/whl/cpu
flask>=2.0
`,
  'pip.conf': '[global]\nextra-index-url = https://private.example/simple\n',
  'pyproject.toml': `[project]
name = "app"
version = "0.1.0"
dependencies = ["httpx>=0.27"]

[tool.uv]
index-strategy = "unsafe-best-match"
`,
  'uv.lock': `version = 1
revision = 2

[[package]]
name = "httpx"
version = "0.27.0"
source = { registry = "https://private.example/simple" }
wheels = [{ url = "https://private.example/httpx-0.27.0-py3-none-any.whl" }]

[[package]]
name = "mirror"
version = "1.0.0"
source = { registry = "http://mirror.example/simple" }
wheels = [{ url = "http://mirror.example/mirror-1.0.0-py3-none-any.whl", hash = "sha256:a" }]
`,
  'poetry/pyproject.toml': `[tool.poetry.dependencies]
python = "^3.12"
requests = "^2.32"

[[tool.poetry.source]]
name = "internal"
url = "http://internal.example/simple"
`,
  'pipenv/Pipfile': '[packages]\nrequests = "*"\n',
  'pipenv/Pipfile.lock': JSON.stringify({
    _meta: { sources: [{ name: 'pypi', url: 'https://pypi.org/simple' }] },
    default: { requests: { index: 'pypi', version: '==2.32.3' } },
    develop: Object.create(null),
  }),
};

const PYTHON_HOSTILE_REPORT = `Dependency risks found:

pip.conf
  merges package indexes, so a public package can shadow a private one: https://private.example/simple

pipenv/Pipfile.lock
  no integrity hash to check the download against: requests==2.32.3

poetry/pyproject.toml
  fetched over plain http:// or git://: http://internal.example/simple

pyproject.toml
  merges package indexes, so a public package can shadow a private one: index-strategy unsafe-best-match

requirements.txt
  fetched over plain http:// or git://: http://pypi.internal/simple
  merges package indexes, so a public package can shadow a private one: https://download.pytorch.org/whl/cpu

uv.lock
  fetched over plain http:// or git://: mirror==1.0.0
  no integrity hash to check the download against: httpx==0.27.0

Dependency hardening advisories:

poetry/pyproject.toml
  declares dependencies, but no lockfile covers it

requirements.txt
  declares dependencies, but no lockfile covers it
`;

const PYTHON_CLEAN: Record<string, string> = {
  'pyproject.toml': `[project]
name = "app"
version = "0.1.0"
dependencies = ["lib", "anyio>=4"]

[tool.uv.sources]
lib = { workspace = true }

[tool.uv.workspace]
members = ["packages/*"]
`,
  'packages/lib/pyproject.toml':
    '[project]\nname = "lib"\nversion = "0.1.0"\ndependencies = ["anyio>=4"]\n',
  'uv.lock': `version = 1
revision = 2

[[package]]
name = "anyio"
version = "4.4.0"
source = { registry = "https://pypi.org/simple" }
sdist = { url = "https://files.pythonhosted.org/anyio-4.4.0.tar.gz", hash = "sha256:a", size = 1, upload-time = 2024-05-26T22:07:00Z }

[[package]]
name = "app"
version = "0.1.0"
source = { virtual = "." }

[[package]]
name = "lib"
version = "0.1.0"
source = { editable = "packages/lib" }
`,
  'poetry/pyproject.toml':
    '[tool.poetry.dependencies]\npython = "^3.12"\nrequests = "^2.32"\n',
  'poetry/poetry.lock': `[[package]]
name = "requests"
version = "2.32.3"
files = [{file = "requests-2.32.3.tar.gz", hash = "sha256:b"}]

[metadata]
lock-version = "2.1"
`,
  'pipenv/Pipfile': '[packages]\nrequests = "*"\n',
  'pipenv/Pipfile.lock': JSON.stringify({
    _meta: { sources: [{ name: 'pypi', url: 'https://pypi.org/simple' }] },
    default: {
      requests: { hashes: ['sha256:c'], index: 'pypi', version: '==2.32.3' },
    },
    develop: Object.create(null),
  }),
  'compiled/pyproject.toml':
    '[project]\nname = "svc"\nversion = "1"\ndependencies = ["flask"]\n',
  'compiled/requirements.txt':
    'flask==3.0.3 \\\n    --hash=sha256:d\nwerkzeug==3.0.3 --hash=sha256:e\n-e .\n',
  'cookie/pyproject.toml':
    '[project]\nname = "cookie"\nversion = "1"\ndependencies = ["django"]\n',
  'cookie/requirements/base.txt': 'django==5.0.6  # pinned\n',
  'pdm/pyproject.toml':
    '[project]\nname = "pdm"\nversion = "1"\ndependencies = ["rich"]\n',
  'pdm/pdm.lock': '',
  'pylock/requirements.txt': 'rich>=13\n',
  'pylock/pylock.toml': 'lock-version = "1.0"\n',
};

const RUST_GO_HOSTILE: Record<string, string> = {
  'Cargo.toml': `[package]
name = "app"
version = "0.1.0"

[dependencies]
serde = "1"
fork = { git = "http://github.com/me/fork", branch = "main" }
`,
  'Cargo.lock': `version = 4

[[package]]
name = "app"
version = "0.1.0"

[[package]]
name = "fork"
version = "0.1.0"
source = "git+http://github.com/me/fork?branch=main#abc"

[[package]]
name = "serde"
version = "1.0.200"
source = "registry+https://github.com/rust-lang/crates.io-index"
`,
  '.cargo/config.toml':
    '[registries.internal]\nindex = "sparse+http://deploy:s3cret@cargo.internal/index/"\n',
  'tools/Cargo.toml':
    '[package]\nname = "tool"\nversion = "0.1.0"\n\n[dependencies]\nclap = "4"\n',
  'go.mod': `module example.com/app

go 1.22

require (
	github.com/google/uuid v1.6.0
	golang.org/x/text v0.14.0 // indirect
)
`,
  'go.sum':
    'github.com/google/uuid v1.6.0 h1:a=\ngithub.com/google/uuid v1.6.0/go.mod h1:b=\n',
  'svc/go.mod':
    'module example.com/svc\n\ngo 1.22\n\nrequire github.com/google/uuid v1.6.0\n',
};

const RUST_GO_HOSTILE_REPORT = `Dependency risks found:

.cargo/config.toml
  fetched over plain http:// or git://: sparse+http://cargo.internal/index/

Cargo.lock
  fetched over plain http:// or git://: fork@0.1.0
  no integrity hash to check the download against: serde@1.0.200

Cargo.toml
  fetched over plain http:// or git://: fork @ http://github.com/me/fork

Dependency hardening advisories:

go.sum
  no go.sum checksum, so Go builds nothing from it until go mod tidy records one from the checksum database: golang.org/x/text@v0.14.0

svc/go.mod
  declares dependencies, but no lockfile covers it

tools/Cargo.toml
  declares dependencies, but no lockfile covers it
`;

const RUST_GO_CLEAN: Record<string, string> = {
  'Cargo.toml': `[workspace]
members = ["crates/*"]
resolver = "2"

[workspace.dependencies]
serde = "1"
`,
  'Cargo.lock': `version = 4

[[package]]
name = "core"
version = "0.1.0"
dependencies = ["fork", "serde"]

[[package]]
name = "fork"
version = "0.1.0"
source = "git+https://github.com/me/fork?rev=abc#abc"

[[package]]
name = "serde"
version = "1.0.200"
source = "sparse+https://mirror.example/index/"
checksum = "abc"
`,
  'crates/core/Cargo.toml': `[package]
name = "core"
version = "0.1.0"

[dependencies]
serde = { workspace = true }
fork = { git = "https://github.com/me/fork", rev = "abc" }
`,
  '.cargo/config.toml': `[source.crates-io]
replace-with = "mirror"

[source.mirror]
registry = "sparse+https://mirror.example/index/"
`,
  'vendor/serde/Cargo.toml':
    '[package]\nname = "serde"\nversion = "1.0.200"\n\n[dependencies.serde_derive]\nversion = "1"\noptional = true\n',
  'vendor/serde/.cargo-checksum.json': '{"files":{},"package":"abc"}',
  'go/go.mod': `module example.com/app

go 1.22

require (
	example.com/lib v0.0.0-00010101000000-000000000000
	github.com/google/uuid v1.6.0
	golang.org/x/text v0.14.0 // indirect
	rsc.io/quote v1.5.0
)

replace example.com/lib => "../my lib"

replace rsc.io/quote v1.5.0 => rsc.io/quote v1.5.1
`,
  'go/go.sum': `github.com/google/uuid v1.6.0 h1:a=
github.com/google/uuid v1.6.0/go.mod h1:b=
golang.org/x/text v0.14.0/go.mod h1:c=
rsc.io/quote v1.5.1 h1:d=
rsc.io/quote v1.5.1/go.mod h1:e=
`,
  'my lib/go.mod': 'module example.com/lib\n\ngo 1.22\n',
};

const RUBY_PHP_HOSTILE: Record<string, string> = {
  Gemfile: `source "http://deploy:s3cret@gems.internal/"

gem "rack"
gem "fork", git: "git://github.com/me/fork.git"
`,
  'Gemfile.lock': `GIT
  remote: git://github.com/me/fork.git
  revision: abc
  specs:
    fork (0.1.0)

GEM
  remote: http://gems.internal/
  specs:
    rack (3.0.8)

PLATFORMS
  ruby

DEPENDENCIES
  fork!
  rack
`,
  'tools/Gemfile': 'source "https://rubygems.org"\n\ngem "rubocop"\n',
  'composer.json': JSON.stringify({
    require: { 'monolog/monolog': '^3.5', 'me/zip': '^1.0' },
    repositories: [{ type: 'composer', url: 'http://satis.internal' }],
    config: { 'secure-http': false },
  }),
  'composer.lock': JSON.stringify({
    packages: [
      {
        name: 'monolog/monolog',
        version: '3.5.0',
        dist: {
          type: 'zip',
          url: 'https://api.github.com/repos/Seldaek/monolog/zipball/abc',
        },
      },
      {
        name: 'me/zip',
        version: '1.0.0',
        dist: { type: 'zip', url: 'http://satis.internal/dist/zip.zip' },
      },
    ],
    'packages-dev': [],
  }),
  'plugin/composer.json': JSON.stringify({
    require: { php: '>=8.1', 'guzzlehttp/guzzle': '^7.8' },
  }),
};

const RUBY_PHP_HOSTILE_REPORT = `Dependency risks found:

composer.json
  fetched over plain http:// or git://: http://satis.internal

composer.lock
  fetched over plain http:// or git://: me/zip (1.0.0)

Gemfile
  fetched over plain http:// or git://: git://github.com/me/fork.git, http://gems.internal/

Gemfile.lock
  fetched over plain http:// or git://: fork (0.1.0), rack (3.0.8)

Dependency hardening advisories:

plugin/composer.json
  declares dependencies, but no lockfile covers it

tools/Gemfile
  declares dependencies, but no lockfile covers it
`;

const RUBY_PHP_CLEAN: Record<string, string> = {
  Gemfile: `source "https://rubygems.org"

gem "rails", "~> 7.1"
gem "fork", git: "https://github.com/me/fork.git", ref: "abc"
gem "engine", path: "engine"
`,
  'Gemfile.lock': `GIT
  remote: https://github.com/me/fork.git
  revision: abc
  ref: abc
  specs:
    fork (0.1.0)

PATH
  remote: engine
  specs:
    engine (0.1.0)

GEM
  remote: https://rubygems.org/
  specs:
    rails (7.1.3)

PLATFORMS
  ruby

DEPENDENCIES
  engine!
  fork!
  rails (~> 7.1)

BUNDLED WITH
   2.5.6
`,
  'engine/gems.rb': 'source "https://rubygems.org"\n\ngemspec\n',
  'engine/gems.locked': `PATH
  remote: .
  specs:
    engine (0.1.0)

GEM
  remote: https://rubygems.org/
  specs:

PLATFORMS
  ruby

DEPENDENCIES
  engine!
`,
  'composer.json': JSON.stringify({
    require: { php: '>=8.1', 'monolog/monolog': '^3.5', 'me/lib': '*' },
    repositories: [{ type: 'path', url: 'lib' }],
  }),
  'composer.lock': JSON.stringify({
    packages: [
      {
        name: 'monolog/monolog',
        version: '3.5.0',
        source: {
          type: 'git',
          url: 'https://github.com/Seldaek/monolog.git',
        },
        dist: {
          type: 'zip',
          url: 'https://api.github.com/repos/Seldaek/monolog/zipball/abc',
          shasum: '',
        },
      },
      {
        name: 'me/lib',
        version: 'dev-main',
        dist: { type: 'path', url: 'lib', reference: 'def' },
      },
    ],
    'packages-dev': [],
  }),
  'vendor/composer/installed.json': '{"packages": []}',
  'vendor/psr/log/composer.json': JSON.stringify({
    require: { php: '>=8.0.0' },
    'require-dev': { 'phpunit/phpunit': '^9' },
  }),
  'tools/composer.json': JSON.stringify({ require: { php: '>=8.1' } }),
};

const NUGET_LOCK = JSON.stringify({
  version: 1,
  dependencies: {
    'net8.0': {
      Serilog: {
        type: 'Direct',
        requested: '[3.1.1, )',
        resolved: '3.1.1',
        contentHash: 'abc==',
      },
    },
  },
});

const msbuildProject = (body: string): string =>
  `<Project Sdk="Microsoft.NET.Sdk">\n${body}\n</Project>\n`;

const SERILOG_REFERENCE =
  '  <ItemGroup>\n    <PackageReference Include="Serilog" Version="3.1.1" />\n  </ItemGroup>';

const DOTNET_JVM_HOSTILE: Record<string, string> = {
  'nuget.config': `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
    <add key="internal" value="http://ci:s3cret@feed.internal/v3/index.json" />
  </packageSources>
</configuration>
`,
  'src/Api/Api.csproj': msbuildProject(
    `  <PropertyGroup>
    <RestoreAdditionalProjectSources>http://extra.internal/nuget</RestoreAdditionalProjectSources>
  </PropertyGroup>
${SERILOG_REFERENCE}`
  ),
  'src/Api/packages.lock.json': NUGET_LOCK,
  'src/Worker/Worker.csproj': msbuildProject(SERILOG_REFERENCE),
  'pom.xml': `<project>
  <repositories>
    <repository><id>internal</id><url>http://maven.internal/releases</url></repository>
  </repositories>
</project>
`,
  '.mvn/wrapper/maven-wrapper.properties':
    'distributionUrl=http\\://repo.internal/maven/apache-maven-3.9.6-bin.zip\n',
  'build.gradle': `repositories {
  maven { url 'http://gradle.internal/releases' }
}

dependencies {
  implementation 'com.google.guava:guava:33.0.0-jre'
}
`,
  'gradle/wrapper/gradle-wrapper.properties':
    'distributionUrl=http\\://services.gradle.org/distributions/gradle-8.5-bin.zip\n',
  'app/build.gradle.kts':
    'dependencies {\n    implementation("org.slf4j:slf4j-api:2.0.9")\n}\n',
  'app/gradle.lockfile':
    'org.slf4j:slf4j-api:2.0.9=compileClasspath, runtimeClasspath\nempty=\n',
};

const DOTNET_JVM_HOSTILE_REPORT = `Dependency risks found:

.mvn/wrapper/maven-wrapper.properties
  fetched over plain http:// or git://: http://repo.internal/maven/apache-maven-3.9.6-bin.zip

build.gradle
  fetched over plain http:// or git://: http://gradle.internal/releases

gradle/wrapper/gradle-wrapper.properties
  fetched over plain http:// or git://: http://services.gradle.org/distributions/gradle-8.5-bin.zip

nuget.config
  fetched over plain http:// or git://: http://feed.internal/v3/index.json

pom.xml
  fetched over plain http:// or git://: http://maven.internal/releases

src/Api/Api.csproj
  fetched over plain http:// or git://: http://extra.internal/nuget

Dependency hardening advisories:

build.gradle
  declares dependencies, but no lockfile covers it

src/Worker/Worker.csproj
  declares dependencies, but no lockfile covers it
`;

const DOTNET_JVM_CLEAN: Record<string, string> = {
  'NuGet.Config': `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <clear />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
    <add key="local" value="./packages" />
  </packageSources>
</configuration>
`,
  'Directory.Build.props': msbuildProject(
    '  <PropertyGroup>\n    <RestoreSources>$(RestoreSources);https://feed.internal/v3/index.json</RestoreSources>\n    <RestorePackagesWithLockFile>true</RestorePackagesWithLockFile>\n  </PropertyGroup>'
  ),
  'src/Api/Api.csproj': msbuildProject(SERILOG_REFERENCE),
  'src/Api/packages.lock.json': NUGET_LOCK,
  'src/My App/My App.csproj': msbuildProject(SERILOG_REFERENCE),
  'src/My App/packages.My_App.lock.json': NUGET_LOCK,
  'src/Lib/Lib.csproj': msbuildProject(
    '  <ItemGroup>\n    <ProjectReference Include="../Api/Api.csproj" />\n  </ItemGroup>'
  ),
  'pom.xml': `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <url>http://example.com/project</url>
  <licenses>
    <license><url>http://www.apache.org/licenses/LICENSE-2.0.txt</url></license>
  </licenses>
  <repositories>
    <repository><id>central</id><url>https://repo.maven.apache.org/maven2</url></repository>
  </repositories>
</project>
`,
  '.mvn/wrapper/maven-wrapper.properties':
    'wrapperVersion=3.3.2\ndistributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip\n',
  'settings.gradle.kts': `pluginManagement {
    repositories { gradlePluginPortal() }
}

dependencyResolutionManagement {
    repositories { mavenCentral() }
}

rootProject.name = "app"
include("app")
`,
  'app/build.gradle.kts': `plugins {
    \`java-library\`
    \`maven-publish\`
}

dependencies {
    implementation("com.google.guava:guava:33.0.0-jre")
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            pom { url = "http://example.com/project" }
        }
    }
}
`,
  'app/gradle.lockfile':
    '# This is a Gradle generated file for dependency locking.\ncom.google.guava:guava:33.0.0-jre=compileClasspath, runtimeClasspath\nempty=annotationProcessor\n',
  'gradle/wrapper/gradle-wrapper.properties':
    'distributionBase=GRADLE_USER_HOME\ndistributionUrl=https\\://services.gradle.org/distributions/gradle-8.5-bin.zip\n',
};

const UNJUDGED_REMEDY =
  'so the checker cannot judge it: fix it, or, when another tool reads it as it is, such as a template or a test fixture, leave it out with npx lagune write add --ignore <path> --checker dependency';

const writeProject = async (
  workspace: string,
  files: Record<string, string>
): Promise<void> => {
  await Promise.all(
    Object.entries(files).map(async ([path, content]) => {
      await mkdir(dirname(join(workspace, path)), { recursive: true });
      await writeFile(join(workspace, path), content);
    })
  );
};

const isolatedEnv = (workspace: string): NodeJS.ProcessEnv => ({
  ...env,
  HOME: workspace,
  USERPROFILE: workspace,
  XDG_CONFIG_HOME: join(workspace, 'config'),
});

/** A temporary project at the root of a Git repository of its own, out of reach of the global excludes of the machine running the tests */
const newRepository = async (): Promise<string> => {
  const workspace = await newWorkspace();

  await mkdir(join(workspace, '.git'));

  return workspace;
};

const runDependency = (
  workspace: string,
  ...args: string[]
): Promise<HookRun> =>
  runEngine(workspace, ['read', 'dependency', ...args], {
    env: isolatedEnv(workspace),
  });

await describe('the dependency hook runs through the engine', async () => {
  await it('reports what the files decide across lockfiles and manifests, failing on a finding', async () => {
    const workspace = await newRepository();

    await writeProject(workspace, JAVASCRIPT_HOSTILE);

    const run = await runDependency(workspace);

    strict.deepStrictEqual(run, {
      stdout: JAVASCRIPT_HOSTILE_REPORT,
      stderr: '',
      code: 1,
    });
  });

  await it('stays silent on a clean npm workspace beside pnpm, Yarn, and Bun projects, even scanning one folder', async () => {
    const workspace = await newRepository();

    await writeProject(workspace, JAVASCRIPT_CLEAN);

    const runs = await Promise.all([
      runDependency(workspace),
      runDependency(workspace, '--dir', 'packages/a'),
      runDependency(workspace, '--file', 'pnpm/libs/lib/package.json'),
    ]);

    strict.deepStrictEqual(
      runs,
      runs.map(() => ({
        stdout: 'no dependency risks found\n',
        stderr: '',
        code: 0,
      }))
    );
  });

  await it('counts no lockfile Git ignores as covering its manifest', async () => {
    const workspace = await newRepository();

    await writeProject(workspace, {
      '.gitignore': 'package-lock.json\n',
      'package.json': JAVASCRIPT_CLEAN['packages/a/package.json'],
      'package-lock.json': JAVASCRIPT_CLEAN['package-lock.json'],
    });

    const run = await runDependency(workspace);

    strict.deepStrictEqual(run, {
      stdout:
        'Dependency hardening advisories:\n\npackage.json\n  declares dependencies, but no lockfile covers it\n\nSkipped 1 path that Git ignores. Name one with --dir or --file to scan it.\n',
      stderr: '',
      code: 0,
    });
  });

  await it('reports what Python files decide across pip, Poetry, Pipenv, and uv, never repeating a credential', async () => {
    const workspace = await newRepository();

    await writeProject(workspace, PYTHON_HOSTILE);

    const run = await runDependency(workspace);

    strict.deepStrictEqual(run, {
      stdout: PYTHON_HOSTILE_REPORT,
      stderr: '',
      code: 1,
    });
  });

  await it('stays silent on clean uv, Poetry, Pipenv, pip, PDM, and PEP 751 projects, even scanning one folder or file', async () => {
    const workspace = await newRepository();

    await writeProject(workspace, PYTHON_CLEAN);

    const runs = await Promise.all([
      runDependency(workspace),
      runDependency(workspace, '--dir', 'packages/lib'),
      runDependency(workspace, '--file', 'compiled/pyproject.toml'),
      runDependency(workspace, '--file', 'cookie/pyproject.toml'),
    ]);

    strict.deepStrictEqual(
      runs,
      runs.map(() => ({
        stdout: 'no dependency risks found\n',
        stderr: '',
        code: 0,
      }))
    );
  });

  await it('lets a uv workspace root cover only the pyproject.toml files below it, never a Pipfile or a requirements file', async () => {
    const workspace = await newRepository();

    await writeProject(workspace, {
      'pyproject.toml': PYTHON_CLEAN['pyproject.toml'],
      'uv.lock': PYTHON_CLEAN['uv.lock'],
      'packages/lib/pyproject.toml':
        PYTHON_CLEAN['packages/lib/pyproject.toml'],
      'sub/Pipfile': '[packages]\nrequests = "*"\n',
      'docs/requirements.txt': 'sphinx>=7\n',
    });

    const run = await runDependency(workspace);

    strict.deepStrictEqual(run, {
      stdout:
        'Dependency hardening advisories:\n\ndocs/requirements.txt\n  declares dependencies, but no lockfile covers it\n\nsub/Pipfile\n  declares dependencies, but no lockfile covers it\n',
      stderr: '',
      code: 0,
    });
  });

  await it('reports what Rust and Go files decide across Cargo and Go modules, never repeating a credential', async () => {
    const workspace = await newRepository();

    await writeProject(workspace, RUST_GO_HOSTILE);

    const run = await runDependency(workspace);

    strict.deepStrictEqual(run, {
      stdout: RUST_GO_HOSTILE_REPORT,
      stderr: '',
      code: 1,
    });
  });

  await it('stays silent on a clean Cargo workspace with a vendored crate and a Go module, even scanning one folder or file', async () => {
    const workspace = await newRepository();

    await writeProject(workspace, RUST_GO_CLEAN);

    const runs = await Promise.all([
      runDependency(workspace),
      runDependency(workspace, '--dir', 'crates/core'),
      runDependency(workspace, '--file', 'go/go.sum'),
    ]);

    strict.deepStrictEqual(
      runs,
      runs.map(() => ({
        stdout: 'no dependency risks found\n',
        stderr: '',
        code: 0,
      }))
    );
  });

  await it('reports what Ruby and PHP files decide across Bundler and Composer, never repeating a credential', async () => {
    const workspace = await newRepository();

    await writeProject(workspace, RUBY_PHP_HOSTILE);

    const run = await runDependency(workspace);

    strict.deepStrictEqual(run, {
      stdout: RUBY_PHP_HOSTILE_REPORT,
      stderr: '',
      code: 1,
    });
  });

  await it('stays silent on clean Bundler and Composer projects and the packages Composer installed, even scanning one folder or file', async () => {
    const workspace = await newRepository();

    await writeProject(workspace, RUBY_PHP_CLEAN);

    const runs = await Promise.all([
      runDependency(workspace),
      runDependency(workspace, '--dir', 'vendor/psr/log'),
      runDependency(workspace, '--file', 'engine/gems.rb'),
    ]);

    strict.deepStrictEqual(
      runs,
      runs.map(() => ({
        stdout: 'no dependency risks found\n',
        stderr: '',
        code: 0,
      }))
    );
  });

  await it('stops when the Ruby parser it ships cannot start, naming the Gemfile without blaming it', async () => {
    const [engine, workspace] = await Promise.all([
      installEngine(),
      newWorkspace(),
    ]);

    await Promise.all([
      writeFile(join(dirname(engine), 'prism.wasm'), 'not WebAssembly'),
      writeProject(workspace, { Gemfile: RUBY_PHP_HOSTILE['tools/Gemfile'] }),
    ]);

    const run = await runEngine(workspace, ['read', 'dependency'], { engine });

    strict.deepStrictEqual([run.stdout, run.code], ['', 1]);
    strict.match(
      run.stderr,
      /^Lagune's Ruby parser could not start to read Gemfile \(.+\): reinstall Lagune, then run this again\.\n$/
    );
  });

  await it('reports what .NET and JVM files decide across NuGet, Maven, and Gradle, never repeating a credential', async () => {
    const workspace = await newRepository();

    await writeProject(workspace, DOTNET_JVM_HOSTILE);

    const run = await runDependency(workspace);

    strict.deepStrictEqual(run, {
      stdout: DOTNET_JVM_HOSTILE_REPORT,
      stderr: '',
      code: 1,
    });
  });

  await it('reads a settings.xml only where Maven looks for one, leaving one another tool keeps alone even when it cannot be read', async () => {
    const workspace = await newRepository();
    const mavenSettings = (mirror: string): string =>
      `<settings><mirrors><mirror><id>all</id><mirrorOf>*</mirrorOf><url>${mirror}</url></mirror></mirrors></settings>\n`;

    await writeProject(workspace, {
      'pom.xml': '<project><modelVersion>4.0.0</modelVersion></project>\n',
      'settings.xml': mavenSettings('http://beside.internal/maven'),
      '.mvn/settings.xml': mavenSettings('http://mvn.internal/maven'),
      '.m2/settings.xml': mavenSettings('http://m2.internal/maven'),
      'editor/settings.xml': '<settings><mirrors>\n',
      'tools/settings.xml':
        '<!DOCTYPE settings [<!ENTITY url "http://hidden.internal/">]>\n<settings>&url;</settings>\n',
    });

    const runs = await Promise.all([
      runDependency(workspace),
      runDependency(workspace, '--file', 'editor/settings.xml'),
    ]);

    strict.deepStrictEqual(runs, [
      {
        stdout: `Dependency risks found:

.m2/settings.xml
  fetched over plain http:// or git://: http://m2.internal/maven

.mvn/settings.xml
  fetched over plain http:// or git://: http://mvn.internal/maven

settings.xml
  fetched over plain http:// or git://: http://beside.internal/maven
`,
        stderr: '',
        code: 1,
      },
      { stdout: 'no dependency risks found\n', stderr: '', code: 0 },
    ]);
  });

  await it('stays silent on clean NuGet, Maven, and Gradle projects, even scanning one folder or file', async () => {
    const workspace = await newRepository();

    await writeProject(workspace, DOTNET_JVM_CLEAN);

    const runs = await Promise.all([
      runDependency(workspace),
      runDependency(workspace, '--dir', 'src/My App'),
      runDependency(workspace, '--file', 'app/build.gradle.kts'),
    ]);

    strict.deepStrictEqual(
      runs,
      runs.map(() => ({
        stdout: 'no dependency risks found\n',
        stderr: '',
        code: 0,
      }))
    );
  });

  await it('names each dependency file it cannot read as a lead to check by hand, instead of a clean result', async () => {
    const unreadable: Array<[string, string, string]> = [
      [
        'Cargo.lock',
        '[[package]]\nname = "clap"\nsource = "registry+https://github.com/rust-lang/crates.io-index\n',
        'is not valid TOML at line 3, column 10',
      ],
      [
        'go.mod',
        'module example.com/app\n\nrequire (\n\tgithub.com/google/uuid v1.6.0\n',
        'never closes its "require" block',
      ],
      [
        'Gemfile.lock',
        'GEM\n   remote: http://rubygems.org/\n  specs:\n',
        'holds a line Bundler never writes in a source section: "   remote: http://rubygems.org/"',
      ],
      ['composer.lock', '{"packages": [', 'is not valid JSON'],
      [
        'pom.xml',
        '<project>\n  <repositories>\n</project>\n',
        'is not well-formed XML at line 3, column 1',
      ],
      [
        'nuget.config',
        '<!DOCTYPE configuration [<!ENTITY feed "http://feed.internal/">]>\n<configuration><packageSources><add key="feed" value="&feed;" /></packageSources></configuration>\n',
        'is XML the checker cannot read (it declares a document type)',
      ],
      [
        'build.gradle.kts',
        'repositories {\n    maven("http://gradle.internal/releases")\n',
        'never closes every block it opens',
      ],
      [
        'pyproject.toml',
        '[project]\ndependencies = ["flask",\n',
        'is not valid TOML at line 2, column 16',
      ],
      [
        'pnpm-lock.yaml',
        'lockfileVersion: 9.0\npackages:\n  a@1.0.0:\n    engines: {}\n',
        'locks "a@1.0.0" with no resolution',
      ],
    ];
    const workspaces = await Promise.all(unreadable.map(() => newRepository()));

    await Promise.all(
      unreadable.map(([file, content], index) =>
        writeProject(workspaces[index], { [file]: content })
      )
    );

    const runs = await Promise.all(
      workspaces.map((workspace) => runDependency(workspace))
    );

    strict.deepStrictEqual(
      runs,
      unreadable.map(([file, , problem]) => ({
        stdout: `Dependency risks to review manually:\n\n${file}\n  ${problem}, ${UNJUDGED_REMEDY}\n`,
        stderr: '',
        code: 0,
      }))
    );
  });

  await it('keeps judging every other file beside a template it cannot read', async () => {
    const workspace = await newRepository();

    await writeProject(workspace, {
      'generators/app/templates/package.json':
        '{\n  "name": "<%= name %>",\n  "dependencies": {<% if (express) { %>\n    "express": "^4.21.1"<% } %>\n  }\n}\n',
      'web/package.json': JSON.stringify({
        dependencies: { widget: 'git://github.com/acme/widget.git' },
      }),
    });

    const run = await runDependency(workspace);

    strict.deepStrictEqual(run, {
      stdout: `Dependency risks found:

web/package.json
  fetched over plain http:// or git://: widget@git://github.com/acme/widget.git

Dependency risks to review manually:

generators/app/templates/package.json
  is not valid JSON, ${UNJUDGED_REMEDY}

Dependency hardening advisories:

web/package.json
  declares dependencies, but no lockfile covers it
`,
      stderr: '',
      code: 1,
    });
  });

  await it('reads the .npmrc beside a lockfile as npm does, switching its install scripts off or keeping a public registry URL as written', async () => {
    const [switchedOff, kept, swapped] = await Promise.all([
      newRepository(),
      newRepository(),
      newRepository(),
    ]);
    const manifest = JSON.stringify({ dependencies: { esbuild: '0.25.0' } });
    const publicRegistryUrl =
      'http://registry.npmjs.org/esbuild/-/esbuild-0.25.0.tgz';
    const lockfile = (resolved: string): string =>
      JSON.stringify({
        lockfileVersion: 3,
        packages: {
          'node_modules/esbuild': {
            version: '0.25.0',
            resolved,
            integrity: 'sha512-a',
            hasInstallScript: true,
          },
        },
      });

    await Promise.all([
      writeProject(switchedOff, {
        '.npmrc': 'ignore-scripts=true\n',
        'package.json': manifest,
        'package-lock.json': lockfile(
          'https://registry.npmjs.org/esbuild/-/esbuild-0.25.0.tgz'
        ),
      }),
      writeProject(kept, {
        '.npmrc': 'ignore-scripts=true\nreplace-registry-host=never\n',
        'package.json': manifest,
        'package-lock.json': lockfile(publicRegistryUrl),
      }),
      writeProject(swapped, {
        'package.json': manifest,
        'package-lock.json': lockfile(publicRegistryUrl),
      }),
    ]);

    const runs = await Promise.all([
      runDependency(switchedOff),
      runDependency(kept),
      runDependency(swapped),
    ]);

    strict.deepStrictEqual(runs, [
      { stdout: 'no dependency risks found\n', stderr: '', code: 0 },
      {
        stdout:
          'Dependency risks found:\n\npackage-lock.json\n  fetched over plain http:// or git://: esbuild@0.25.0\n',
        stderr: '',
        code: 1,
      },
      {
        stdout:
          'Dependency hardening advisories:\n\npackage-lock.json\n  runs install scripts: esbuild@0.25.0\n',
        stderr: '',
        code: 0,
      },
    ]);
  });

  await it('leaves a Composer URL in the clear as a lead, in the lockfile too, while the composer.json keeps secure-http on', async () => {
    const workspace = await newRepository();

    await writeProject(workspace, {
      'composer.json': JSON.stringify({
        require: { 'me/zip': '^1.0' },
        repositories: [{ type: 'composer', url: 'http://satis.internal' }],
      }),
      'composer.lock': JSON.stringify({
        packages: [
          {
            name: 'me/zip',
            version: '1.0.0',
            dist: { type: 'zip', url: 'http://satis.internal/dist/zip.zip' },
          },
        ],
        'packages-dev': [],
      }),
    });

    const run = await runDependency(workspace);

    strict.deepStrictEqual(run, {
      stdout: `Dependency risks to review manually:

composer.json
  fetched over plain http:// or git://, which the package manager refuses unless a setting outside the project allows it: http://satis.internal

composer.lock
  fetched over plain http:// or git://, which the package manager refuses unless a setting outside the project allows it: me/zip (1.0.0)
`,
      stderr: '',
      code: 0,
    });
  });

  await it('counts a project Angular or Nx builds from the root install as covered by the lockfile there, and no other folder', async () => {
    const workspace = await newRepository();
    const library = JSON.stringify({ dependencies: { tslib: '^2.3.0' } });

    await writeProject(workspace, {
      'package.json': library,
      'package-lock.json': JAVASCRIPT_CLEAN['package-lock.json'],
      'angular.json': JSON.stringify({
        projects: {
          app: { root: '' },
          'ui-kit': { root: 'projects/ui-kit/' },
          escape: { root: '../outside' },
        },
      }),
      'projects/ui-kit/package.json': library,
      'nx.json': '{}',
      'libs/data/project.json': '{}',
      'libs/data/package.json': library,
      'scripts/package.json': library,
    });

    const run = await runDependency(workspace);

    strict.deepStrictEqual(run, {
      stdout:
        'Dependency hardening advisories:\n\nscripts/package.json\n  declares dependencies, but no lockfile covers it\n',
      stderr: '',
      code: 0,
    });
  });

  await it('gathers under one lead the lockfile coverage a Git state it cannot read leaves unconfirmed', async () => {
    const [absent, pointer] = await Promise.all([
      newWorkspace(),
      newWorkspace(),
    ]);
    const files = {
      'package.json': JAVASCRIPT_CLEAN['packages/a/package.json'],
      'package-lock.json': JAVASCRIPT_CLEAN['package-lock.json'],
      'tools/package.json': JSON.stringify({
        devDependencies: { tsx: '^4.0.0' },
      }),
    };

    await Promise.all([
      writeProject(absent, files),
      writeProject(pointer, {
        ...files,
        '.git': 'gitdir: ../elsewhere/.git/worktrees/app\n',
      }),
    ]);

    const runs = await Promise.all([
      runDependency(absent),
      runDependency(pointer),
    ]);

    strict.deepStrictEqual(runs, [
      {
        stdout: `Dependency risks to review manually:

.git
  lockfile coverage the checker cannot confirm without a .git at the project root, since Git may ignore the lockfile or a workspace above the project may hold one (run the check from the repository root): package.json, tools/package.json
`,
        stderr: '',
        code: 0,
      },
      {
        stdout: `Dependency risks to review manually:

.git
  lockfile coverage the checker cannot confirm through a .git that points elsewhere, as a worktree or submodule does, since Git may ignore the lockfile (confirm in this checkout with git check-ignore): package.json

Dependency hardening advisories:

tools/package.json
  declares dependencies, but no lockfile covers it
`,
        stderr: '',
        code: 0,
      },
    ]);
  });
});
