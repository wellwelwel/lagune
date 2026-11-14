# dependency hook: Detect loosely resolved dependencies

> Sweep a project's manifests, lockfiles, and index settings for dependencies fetched in the clear, without a hash, without a lockfile, or from merged package indexes, from the command line.

Canonical: https://lagune.ai/docs/hooks/dependency
Last updated: 2026-11-14

The `dependency` hook flags **how a project's dependencies resolve and install** wherever the files alone decide it. It reads only dependency files, and it is the deterministic engine behind the [`dependency` specialization](https://lagune.ai/docs/catalog).

## Run it

```bash
npx lagune read dependency                       # scans the whole project
npx lagune read dependency --dir packages/api    # scans a directory
npx lagune read dependency --file package.json   # scans a single file
```

The scan prints up to three sections, each line naming the packages or indexes it applies to. **Dependency risks found** exits non-zero and holds what the files alone decide: a dependency, an index, or the build tool a wrapper downloads reached over plain `http://` or `git://` from another machine, a registry entry with no integrity hash, a setting that merges package indexes, so a public package can shadow a private one, and a **Yarn** setting that accepts a package whose checksum does not match. **Dependency risks to review manually** does not change the exit code and holds what the files cannot settle: a URL in the clear that the package manager refuses unless a setting outside the project allows it, a file the hook cannot read, and one entry naming why a **Git** state it cannot read leaves lockfile coverage unconfirmed. **Dependency hardening advisories** does not change the exit code either: a manifest with dependencies and no lockfile covering it, a source outside the registry (git or a remote tarball), a package the lockfile marks as running install scripts, a floating specifier such as `*` or `latest`, a wrapper download in the clear whose checksum the wrapper pins, and a Go module with no checksum in `go.sum`. A clean run prints `no dependency risks found`, and a URL it names never carries the user name or password written in it.

A file it cannot read or parse is a lead that names the file, never a clean result, and the scan goes on with every other file. So is an XML file that declares a document type, since an entity it declares could hide a URL or expand without bound. A URL on the machine itself, written as `localhost`, a `127.x.x.x` address, or `[::1]`, crosses no network, so the hook never reads it as fetched in the clear.

### Ecosystem coverage

It reads the dependency files of **npm**, **pnpm**, **Yarn**, **pip**, **Poetry**, **Pipenv**, **uv**, **Cargo**, Go modules, **Bundler**, **Composer**, **NuGet**, **Maven**, and **Gradle**, and each one gets only the rules its files decide. A rule an ecosystem's table leaves out is not checked there.

**JavaScript**

| Rule                     | **npm**                                       | **pnpm**                                   | **Yarn**                                                                |
| ------------------------ | --------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------- |
| Plain `http://`/`git://` | `package-lock.json`, `package.json`, `.npmrc` | `pnpm-lock.yaml`, `package.json`, `.npmrc` | `yarn.lock`, `package.json`, `.yarnrc`, `.yarnrc.yml`                   |
| No integrity hash        | `package-lock.json`                           | `pnpm-lock.yaml`                           | `yarn.lock`: integrity or URL hash (**Yarn** 1), checksum (**Yarn** 2+) |
| Accepted checksum        | Not checked                                   | Not checked                                | `checksumBehavior` in `.yarnrc.yml`                                     |
| Outside the registry     | `package-lock.json`, `package.json`           | `pnpm-lock.yaml`, `package.json`           | `yarn.lock`, `package.json`                                             |
| Install scripts          | `package-lock.json` from **npm** 7 on         | `pnpm-lock.yaml` with `requiresBuild`      | Not recorded in the lockfile                                            |
| No lockfile              | `package.json`                                | `package.json`                             | `package.json`                                                          |
| Floating specifier       | `package.json`                                | `package.json`                             | `package.json`                                                          |

`npm-shrinkwrap.json` reads as `package-lock.json`. A lockfile covers the manifest beside it and, at a workspace root, every manifest below it, along with each project the `angular.json` beside it lists and each folder holding an **Nx** `project.json` below an `nx.json`. A **Bun** or **Deno** lockfile covers its manifest too, though its entries are not read.

A URL the lockfile records on the public registry is judged the way its package manager fetches it: **npm** swaps it for the registry it is configured with unless the `.npmrc` beside the lockfile sets `replace-registry-host` to keep it, and **Yarn** 1 always moves the `yarnpkg.com` and `npmjs.org` hosts to `https://`. **Yarn** 2 and later refuse a registry over `http://` unless `unsafeHttpWhitelist` allows its host, so one the `.yarnrc.yml` does not allow is a lead, and they never checksum a package they lock with `conditions`, built for some platforms only, so such an entry needs no hash. An `.npmrc` that sets `ignore-scripts` switches off the install scripts of the lockfile beside it.

**Python**

| Rule                     | **pip**                                                    | **Poetry**                      | **Pipenv**                | **uv**                                                     |
| ------------------------ | ---------------------------------------------------------- | ------------------------------- | ------------------------- | ---------------------------------------------------------- |
| Plain `http://`/`git://` | Requirements files, `pip.conf`, `pip.ini`                  | `poetry.lock`, `pyproject.toml` | `Pipfile.lock`, `Pipfile` | `uv.lock`, `pyproject.toml`, `uv.toml`                     |
| No integrity hash        | Requirements files that record any hash                    | `poetry.lock`                   | `Pipfile.lock`            | `uv.lock`                                                  |
| Merged indexes           | `--extra-index-url`, or its key in `pip.conf` or `pip.ini` | Not checked                     | Not checked               | `unsafe-first-match` or `unsafe-best-match` index strategy |
| No lockfile              | Requirements files                                         | `pyproject.toml`                | `Pipfile`                 | `pyproject.toml`                                           |

A requirements file is a `.txt` whose name holds the word `requirements`, or any `.txt` in a `requirements` folder, except the export `conda list --export` writes, whose every line pins a package as `name=version=build` and which **pip** refuses. One that pins every requirement it takes from an index to a single version with `==` or `===` counts as a lockfile: it raises no advisory and covers the `pyproject.toml` beside it, or beside its `requirements` folder. A `pyproject.toml` is also covered by a `poetry.lock`, a `uv.lock`, a **PDM** `pdm.lock`, or a PEP 751 `pylock.toml`, a `Pipfile` only by its `Pipfile.lock`, and a requirements file that floats only by a `pylock.toml`. A `uv.lock` at a **uv** workspace root covers every `pyproject.toml` below it, never a `Pipfile` or a requirements file. The entries of `pdm.lock` and `pylock.toml` are not read.

**Rust**

| Rule                     | **Cargo**                                        |
| ------------------------ | ------------------------------------------------ |
| Plain `http://`/`git://` | `Cargo.lock`, `Cargo.toml`, `.cargo/config.toml` |
| No integrity hash        | `Cargo.lock`                                     |
| No lockfile              | `Cargo.toml`                                     |

`.cargo/config` reads as `.cargo/config.toml`. A `Cargo.lock` covers the `Cargo.toml` beside it and, at a workspace root, every `Cargo.toml` below it, and a crate `cargo vendor` copied, marked by the `.cargo-checksum.json` beside it, needs none.

**Go**

| Rule                   | Go modules |
| ---------------------- | ---------- |
| No checksum (advisory) | `go.sum`   |
| No lockfile            | `go.mod`   |

A `go.sum` covers the `go.mod` beside it and records a checksum, of the whole module or of its `go.mod`, for every module that `go.mod` requires once its `replace` directives apply, except one a folder replaces. A missing one is an advisory, since Go refuses to build from that module until `go mod tidy` records its checksum from the checksum database. Go names a module by its path alone and takes the transport it fetches over from the environment (`GOPROXY`, `GOINSECURE`), never from its files. Each Go module is judged as it builds on its own, since a workspace's `go.work` and `go.work.sum` are not read.

**Ruby**

| Rule                     | **Bundler**               |
| ------------------------ | ------------------------- |
| Plain `http://`/`git://` | `Gemfile.lock`, `Gemfile` |
| No lockfile              | `Gemfile`                 |

`gems.rb` reads as `Gemfile` and `gems.locked` as `Gemfile.lock`. A `Gemfile` is read with **Prism**, Ruby's own parser, so every string counts as Ruby reads it, escapes included: a URL written as a quoted string or symbol, a percent literal such as `%q()` or `%w[]`, a heredoc, or any line of one, is a source whatever call takes it, and so is `source :rubygems`, which **Bundler** 2 fetches over `http://`. Reading stops at `__END__`, and a URL the code assembles at runtime, such as one read from the environment, is not read. A `Gemfile.lock` covers the `Gemfile` beside it. Its checksums are not read, and neither is `.bundle/config`.

**PHP**

| Rule                     | **Composer**                     |
| ------------------------ | -------------------------------- |
| Plain `http://`/`git://` | `composer.lock`, `composer.json` |
| No lockfile              | `composer.json`                  |

A `composer.lock` covers the `composer.json` beside it, and a package **Composer** installed, marked by the `composer/installed.json` of the vendor folder it sits in, needs none. **Composer** refuses a URL in the clear while `secure-http` stays on, so such a URL is a lead unless the `composer.json`, or the one beside a `composer.lock`, sets `secure-http` to false or `disable-tls` to true. A `composer.json` that requires only platform packages, such as `php` or `ext-json`, declares no dependencies. The dist checksums **Composer** often leaves empty are not read.

**.NET**

| Rule                     | **NuGet**                     |
| ------------------------ | ----------------------------- |
| Plain `http://`/`git://` | `nuget.config`, MSBuild files |
| No lockfile              | Project files                 |

A project file is a `.csproj`, an `.fsproj`, or a `.vbproj`, and it is read with `Directory.Build.props`, `Directory.Build.targets`, and `Directory.Packages.props` for the sources `RestoreSources` and `RestoreAdditionalProjectSources` add. A `nuget.config`, whatever the case of its name, is read for every source its `packageSources` keeps once each add, remove, and clear applies, except one its `disabledPackageSources` switches off. A project file that holds a `PackageReference` declares dependencies, and the `packages.lock.json` beside it, or the `packages.<project>.lock.json` named after it, covers it, but not a lockfile `NuGetLockFilePath` moves elsewhere. The entries of `packages.lock.json` and `packages.config` are not read.

**JVM**

| Rule                     | **Maven**                                             | **Gradle**                                |
| ------------------------ | ----------------------------------------------------- | ----------------------------------------- |
| Plain `http://`/`git://` | `pom.xml`, `settings.xml`, `maven-wrapper.properties` | Every script, `gradle-wrapper.properties` |
| No lockfile              | Not checked                                           | `build.gradle`                            |

In a `pom.xml`, the repositories and plugin repositories of the project and its profiles are read, never the `distributionManagement` repository it deploys to. A `settings.xml` adds its mirrors, except one it blocks, such as the one **Maven**'s own settings ship against external repositories over `http://`, and it is read only where a project keeps one for **Maven**: in `.mvn` or `.m2`, or beside a `pom.xml`, for the `-s` option to pass. One anywhere else, or whose root element is not `settings`, belongs to another tool and is left alone. **Maven** writes no lockfile, so it raises no advisory.

In every **Gradle** script, Groovy or Kotlin, a URL written as one string inside a `repositories`, `maven`, `ivy`, or `sourceControl` block is a source, except under `publishing` or the `uploadArchives` of **Gradle** 6 and earlier, while a URL a variable or a property holds is not read. A `build.gradle` or `build.gradle.kts` declares dependencies once a `dependencies` block holds anything outside `buildscript` and `subprojects`, and the `gradle.lockfile` beside it covers it, never one `dependencyLocking` moves elsewhere. Slashy and dollar-slashy strings are not read, and a quote or a brace inside one can throw the reader off, which most often ends in refusing a valid script. A `gradle.lockfile` records no checksum, and `gradle/verification-metadata.xml` is not read. A wrapper's properties are read the way Java reads them, escapes included, for the `distributionUrl` it downloads the build tool from and the `wrapperUrl` of the **Maven** wrapper, and a download in the clear whose checksum `distributionSha256Sum` or `wrapperSha256Sum` pins is an advisory, since the wrapper rejects any other file.

A lockfile covers a manifest even when the scan names only a folder beneath it, but one the scan leaves out, such as one **Git** ignores, covers nothing. Where the hook cannot read the project's **Git** state, as in a worktree or a folder below the repository root, it gathers the manifests whose coverage that leaves unconfirmed under one lead. The other ecosystems (**Swift Package Manager**, **CocoaPods**, **Dart** pub, **Mix**, **Paket**, and **sbt**) are not read, and neither are **Conda**, `setup.py`, and `setup.cfg`.

### CLI options

| Option   | Value       | Description                                                       |
| -------- | ----------- | ----------------------------------------------------------------- |
| `--dir`  | a directory | Scope a scan to a directory. Repeats and combines with `--file`.  |
| `--file` | a file      | Scope a scan to a single file. Repeats and combines with `--dir`. |

With no option it scans the whole project.

### Choose what it scans

It leaves out what **Git** ignores. To leave out more, or to scan what **Git** ignores, give `dependency` settings of its own:

```bash
npx lagune write add --ignore examples --checker dependency
```

```json
{
  "checkers": {
    "dependency": { "gitignore": false, "ignore": ["examples"] }
  }
}
```

[Configure the hooks](https://lagune.ai/docs/hooks/configure) covers every setting.

**Tip**

The hook reads the files, never the registry: whether a package is a typosquat, whether a version has a known vulnerability, and whether CI installs from the lockfile are judgment the [`dependency` specialization](https://lagune.ai/docs/catalog) still covers.

## Frequently Asked Questions

### Does the dependency hook reach the network or run the package manager?

No. It reads the dependency files on disk and nothing else, so it answers offline and never installs, audits, or changes a dependency.

### Why is every --extra-index-url a finding?

pip merges every index it searches and installs the highest version it finds anywhere, so whoever can publish a package of the same name on any of those indexes decides what installs. uv's default index strategy stops at the first index that has the package, which is why only its unsafe strategies count.

### Why is an advisory not a finding?

A git source, an install script, or a floating range is how many projects legitimately work. It becomes a risk once someone outside the project can change what it resolves to, which the specialization weighs against the rest of the code.
