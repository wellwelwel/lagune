# Hardcoded-secret vulnerabilities

> - This knowledge extends your judgment. Apply what fits the project and keep reasoning beyond the list.
> - Source: OWASP, <https://cheatsheetseries.owasp.org/>, with **GitHub** Docs, "Removing sensitive data from a repository".

## Rules

- This specialization audits and explains.
- By default, it never rewrites your code.

## What to look for

A **secret compiled into the artifact** is a credential (an API key, a token, a password, a private key) that lives in the source instead of in the environment or a secret store, or a file committed with the code that exists to hold one, such as a key file, a keystore, or a **Terraform** state, which records the secrets of the resources it manages in plain text. It ships to everyone with repo access and stays in history forever, so a single leak of the code is a leak of the credential. The defect is decidable from the repository alone: a literal, not a lookup, or a credential file **Git** tracks. Two neighbours belong elsewhere: a secret in a `.tf`/**Kubernetes** manifest is `infra` (its `secrets-in-data` check), and how a validated secret is stored or rotated is `crypto` (key management).

### Deterministic pre-pass

Run the secrets hook first. It is deterministic and its verdict is literal. In the source, it keys on **provenance** (a literal versus an environment lookup), not on the value's contents, so it does not depend on an exhaustive catalog of provider prefixes and produces almost no false positives. For a credential or environment file, it keys on the file's name, on its content where the name alone cannot tell, and on whether **Git** tracks or ignores it.

Call `lagune_read` with `command` set to `secrets` to scan the whole project, or add `arguments` set to `["--dir", "<DIR>"]` for a directory or `["--file", "<FILE>"]` for a single file.

It prints up to three sections. **Hardcoded secrets found** is the finding set and exits non-zero, holding the decisive cases: a hardcoded fallback for an environment secret (`process.env.X ?? "..."`), a credential embedded in a connection string, a value matching a curated provider format (**AWS** `AKIA...`, **GitHub** `ghp_...`, **Stripe** `sk_live_...`, a PEM private key), a credential file **Git** tracks (a private key or keystore, cloud or service account credentials, a **Terraform** state, or an `.npmrc`, `.pypirc`, or kubeconfig that holds a credential), or an environment file **Git** tracks that is meant to stay local (`.env.local`, `.env.production.local`) or sets a secret (a secret-named variable, such as `DB_PASSWORD`, or a value in a curated provider format).

**Secret handling to review manually** is the lead set: a plain literal bound to a secret-named identifier (its name and shape cannot prove it a real credential rather than a hash, a public key, or a non-secret token), a secret-named value flowing into a log or response sink, and a credential or environment file the hook could not read, or found in a project whose **Git** repository it cannot read, since whether **Git** tracks the file is then unknown. Read each by hand.

**Secret handling advisories** does not change the exit code: a credential or environment file the hook would report as a finding, but that **Git** neither tracks nor ignores, so the next `git add` stages it, and any other environment file **Git** tracks, since **Next.js** and **Vite** projects commit `.env` files with public defaults on purpose. A clean run prints a single line.

Flagging a committed secret by its format is standard defensive tooling (**gitleaks**, **trufflehog**, and **GitHub** push protection do the same), shipping detection signatures, never a live secret.

### Reading beyond the hook

- **Split or obfuscated literals:** a token assembled from concatenated parts (`"ghp_" + "..."`) or base64-wrapped to dodge a scanner is the same defect. Treat the assembly as a lead and confirm by resolving it.
- **Secrets in the wrong file:** a credential in a checked-in config or in a template such as `.env.example`, or a key beside the data it protects. The hook skips templates and other config formats by design, so read them for a real value. It also misses a credential under a name it does not know, such as a renamed copy of a key, or a password inside a `DATABASE_URL`.
- **A secret that reached a client bundle:** a key inlined into front-end code is public the moment it ships. A `NEXT_PUBLIC_`/`VITE_`-prefixed secret is exposed on purpose and must never be a real credential.

Safer shape: keep every credential out of source, config, and version control, and read it from the environment or a secrets manager at runtime. A credential file stays where the tool that reads it expects it, untracked with `git rm --cached` and covered by a `.gitignore` rule, so no later commit adds it back. An environment file **Git** tracks holds only public defaults, and every secret lives in a local variant **Git** ignores, such as `.env.local`. A credential that ever reached a commit stays burned after the fix, and only rotating it where it was issued ends the exposure. Purging it from the history is the user's decision, never part of a fix: the purge rewrites the commit that leaked it and every one after, forces every collaborator to rebase or re-clone, and still misses every clone, fork, and mirror already taken.

Does not close it: moving the literal into a committed `.env`, a template such as `.env.example`, or a checked-in config, or keeping it as the hardcoded fallback of an environment lookup, since the working tree still holds the literal either way. Nor does a `.gitignore` rule alone, since it never untracks a file **Git** already tracks.

## How to act on the result

- **In detect (detection):** each provider token, environment fallback, connection-string credential, credential file, and environment file **Git** tracks that the hook reports is a finding. Record what it is (a committed credential), why it matters (anyone who can read the code holds the secret), and the evidence (the file, and the identifier when there is one). A file the hook reports both for a value and as a credential file **Git** tracks is one finding, since untracking and ignoring the file closes both. A bare literal bound to a secret-named identifier, a secret flowing into a sink, and a credential or environment file the hook could not read are leads to confirm, not automatic findings. An advisory is not a finding either. For a tracked environment file, read it and record a finding for any value it sets that is not meant to be public. A file **Git** would commit is posture to raise with the user, since nothing is committed yet: name the `.gitignore` rule that keeps it out. Confirmed leads flow through detect's normal steps and are tracked like any other finding. A credential or environment file the hook lists because it cannot read the project's **Git** repository is not a finding the code can settle: record it under Not determined, asking whether the file is committed. For each credential finding, also record a side quest under Not determined asking whether that credential has been rotated: name it by what it unlocks, never by its value or the finding's name, so the side quest outlives the finding.
- **In verify (proof):** the control holds once the code reads the credential from the environment or a secret store and the working tree no longer holds the literal in any form, except in a file **Git** ignores and does not track, such as `.env.local`. For a credential or environment file, it holds once the hook reports neither that file nor the local file its secret moved to, whether as a finding or as a file **Git** would commit. Neither the history nor the credential's rotation keeps the finding open, not even as inconclusive, since both lie outside the working tree. Instead, point the summary at detect's rotation side quest, so the user never mistakes a closed finding for a safe credential. If the risk is not closed, record it as such and point back to harden.
