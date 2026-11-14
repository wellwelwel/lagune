import { describe, it, strict } from 'poku';
import { readCargoConfig } from '../../../src/hooks/dependency/rust/config.js';
import { readCargoLock } from '../../../src/hooks/dependency/rust/lockfile.js';
import { readCargoManifest } from '../../../src/hooks/dependency/rust/manifest.js';
import {
  CANNOT_JUDGE,
  CLEAN,
  coverage,
  findings,
  PLAIN,
  reported,
  UNHASHED,
} from './__utils__.js';

describe('a Cargo.toml flags every plain source among the dependencies it declares, overrides, or patches', () => {
  it('reads the dependency tables at the top, under each target, in the workspace, and in [patch] and [replace]', () => {
    const result = readCargoManifest(
      'Cargo.toml',
      `[package]
name = "app"
version = "0.1.0"

[dependencies]
serde = "1"
fork = { git = "http://github.com/me/fork", branch = "main" }
local = { path = "../local" }

[dev-dependencies.mock]
git = "git://github.com/me/mock"

[build_dependencies]
cc = { version = "1", registry-index = "http://index.example/" }

[target.'cfg(unix)'.dependencies]
nix = { git = "http://github.com/me/nix" }

[workspace]
members = ["crates/*"]

[workspace.dependencies]
shared = { git = "http://github.com/me/shared" }

[patch.crates-io]
serde = { git = "http://github.com/me/serde" }

[replace]
"rand:0.8.5" = { git = "http://github.com/me/rand" }
`
    );

    strict.deepStrictEqual(
      [reported(result), coverage(result)],
      [
        findings([
          `${PLAIN}: cc @ http://index.example/, fork @ http://github.com/me/fork, mock @ git://github.com/me/mock, nix @ http://github.com/me/nix, rand:0.8.5 @ http://github.com/me/rand, serde @ http://github.com/me/serde, shared @ http://github.com/me/shared`,
        ]),
        { needsLockfile: true, pins: false, declaresWorkspace: true },
      ]
    );
  });

  it('stays silent on sources over https and ssh, and roots a workspace that declares no dependency of its own', () => {
    const member = readCargoManifest(
      'Cargo.toml',
      `[package]
name = "core"
version = "0.1.0"

[dependencies]
serde = { workspace = true }
fork = { git = "https://github.com/me/fork", rev = "abc" }
tool = { git = "ssh://git@github.com/me/tool" }
`
    );
    const root = readCargoManifest(
      'Cargo.toml',
      '[workspace]\nmembers = ["crates/*"]\n\n[workspace.dependencies]\nserde = "1"\n'
    );

    strict.deepStrictEqual(
      [reported(member), reported(root), coverage(root)],
      [
        CLEAN,
        CLEAN,
        { needsLockfile: false, pins: false, declaresWorkspace: true },
      ]
    );
  });
});

describe('a Cargo configuration flags the registries and sources it reaches over plain http:// or git://', () => {
  it('reads registry indexes, replacement sources, and patches, sparse or not', () => {
    const result = readCargoConfig(
      '.cargo/config.toml',
      `[registry]
index = "http://legacy.example/index"

[registries.internal]
index = "sparse+http://cargo.internal/index/"

[registries.safe]
index = "sparse+https://cargo.example/index/"

[source.crates-io]
replace-with = "mirror"

[source.mirror]
registry = "http://mirror.example/index"

[source.forked]
git = "git://github.com/me/index"

[source.vendored]
directory = "vendor"

[patch.crates-io]
serde = { git = "http://github.com/me/serde" }
`
    );

    strict.deepStrictEqual(
      reported(result),
      findings([
        `${PLAIN}: git://github.com/me/index, http://legacy.example/index, http://mirror.example/index, serde @ http://github.com/me/serde, sparse+http://cargo.internal/index/`,
      ])
    );
  });
});

describe('a Cargo.lock flags each package its entries leave unprotected', () => {
  it('demands a checksum of every registry package, sparse or not, and flags any source over plain http:// or git://', () => {
    const result = readCargoLock(
      'Cargo.lock',
      `version = 4

[[package]]
name = "app"
version = "0.1.0"
dependencies = ["serde"]

[[package]]
name = "serde"
version = "1.0.200"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "abc"

[[package]]
name = "bare"
version = "1.0.0"
source = "sparse+https://cargo.internal/index/"

[[package]]
name = "mirror"
version = "1.0.0"
source = "sparse+http://mirror.example/index/"
checksum = "def"

[[package]]
name = "fork"
version = "0.1.0"
source = "git+https://github.com/me/fork?branch=main#abc"

[[package]]
name = "clear"
version = "0.1.0"
source = "git+http://github.com/me/clear#abc"
`
    );

    strict.deepStrictEqual(
      reported(result),
      findings([
        `${PLAIN}: clear@0.1.0, mirror@1.0.0`,
        `${UNHASHED}: bare@1.0.0`,
      ])
    );
  });

  it('reads the checksums a lockfile from before Rust 1.41 keeps under [metadata]', () => {
    const result = readCargoLock(
      'Cargo.lock',
      `[[package]]
name = "libc"
version = "0.2.66"
source = "registry+https://github.com/rust-lang/crates.io-index"

[[package]]
name = "none"
version = "1.0.0"
source = "registry+https://github.com/rust-lang/crates.io-index"

[[package]]
name = "missing"
version = "1.0.0"
source = "registry+https://github.com/rust-lang/crates.io-index"

[metadata]
"checksum libc 0.2.66 (registry+https://github.com/rust-lang/crates.io-index)" = "abc"
"checksum none 1.0.0 (registry+https://github.com/rust-lang/crates.io-index)" = "<none>"
`
    );

    strict.deepStrictEqual(
      reported(result),
      findings([`${UNHASHED}: missing@1.0.0, none@1.0.0`])
    );
  });
});

describe('a Rust dependency file the checker cannot judge is refused instead of read as clean', () => {
  const cases: Array<[string, () => unknown]> = [
    [
      'a Cargo.toml that is not TOML',
      () => readCargoManifest('Cargo.toml', '[dependencies]\nserde = \n'),
    ],
    [
      'a Cargo.toml whose dependency is a number',
      () => readCargoManifest('Cargo.toml', '[dependencies]\nserde = 1\n'),
    ],
    [
      'a Cargo.toml whose target is not a table',
      () => readCargoManifest('Cargo.toml', 'target = "x86_64"\n'),
    ],
    [
      'a Cargo.toml whose git source is not text',
      () =>
        readCargoManifest('Cargo.toml', '[dependencies]\nfork = { git = 1 }\n'),
    ],
    [
      'a Cargo.lock package with no name',
      () => readCargoLock('Cargo.lock', '[[package]]\nversion = "1.0.0"\n'),
    ],
    [
      'a Cargo.lock package from a source Cargo does not write',
      () =>
        readCargoLock(
          'Cargo.lock',
          '[[package]]\nname = "a"\nsource = "mirror+https://example.com"\n'
        ),
    ],
    [
      'a Cargo.lock package from a path source, which Cargo never writes',
      () =>
        readCargoLock(
          'Cargo.lock',
          '[[package]]\nname = "a"\nsource = "path+file:///home/me/a"\n'
        ),
    ],
    [
      'a Cargo configuration whose registry is not a table',
      () =>
        readCargoConfig(
          '.cargo/config.toml',
          '[registries]\ninternal = "https://example.com"\n'
        ),
    ],
  ];

  for (const [description, read] of cases)
    it(`refuses ${description}`, () => {
      strict.throws(read, CANNOT_JUDGE);
    });
});
