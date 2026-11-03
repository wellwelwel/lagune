# infra hook: Detect IaC misconfiguration

> Sweep Terraform, Dockerfiles, and GitHub Actions for misconfiguration, or score a single snippet, from the command line.

Canonical: https://lagune.ai/docs/hooks/infra
Last updated: 2026-11-03

The `infra` hook flags **infrastructure-as-code misconfiguration** that is decidable from the file: a network open to the world, a wildcard permission, a secret in a manifest, a root container, an untrusted value in a CI shell. It reads only IaC files (`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`). It is the deterministic engine behind the [`infra` specialization](https://lagune.ai/docs/catalog), in **scan** or **check** mode.

## Run it

**Scan the codebase**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**Check a snippet**

Pass the snippet with `--pattern` and its kind with `--kind` (`terraform`, `dockerfile`, or `github-actions`).

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

The scan prints up to two sections. **Infrastructure risks found** exits non-zero and holds the decidable defects (a `0.0.0.0/0` ingress on a sensitive port, a wildcard IAM statement, a manifest secret, `encrypted = false`, an unpinned git module, an image that explicitly runs as root, a `curl | sh`, a CI script injection, `permissions: write-all`). **Infrastructure hardening advisories** does not change the exit code (a mutable base tag, a tag-pinned action). A clean run prints `no infrastructure risks found`.

## How to read the verdict

The check mode prints the highest-severity tag it matched (for example `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`), an advisory tag (`mutable-tag`, `unpinned-action`), or `safe`. Only a finding-severity tag exits non-zero.

### CLI options

| Option      | Value                                           | Description                                                       |
| ----------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| `--pattern` | a snippet                                       | Check one snippet. Requires `--kind`. Repeat for several.         |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | The kind the snippet is judged as.                                |
| `--dir`     | a directory                                     | Scope a scan to a directory. Repeats and combines with `--file`.  |
| `--file`    | a file                                          | Scope a scan to a single file. Repeats and combines with `--dir`. |

With no option it scans every IaC file in the project. `--pattern` cannot be combined with `--dir` or `--file`.

**Tip**

The hook catches the blunt, decidable cases: absent encryption, `pull_request_target` exposure, and the right IAM scope are judgment the [`infra` specialization](https://lagune.ai/docs/catalog) still covers.

## Frequently Asked Questions

### What infrastructure files does the infra hook read?

Terraform/HCL (.tf, .tf.json, .hcl), Dockerfiles, and GitHub Actions workflow and action YAML under .github/. It reaches those files even though the source scanners skip them.
