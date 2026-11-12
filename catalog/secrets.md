# Hardcoded-secret vulnerabilities

> - This knowledge extends your judgment. Apply what fits the project and keep reasoning beyond the list.
> - Source: OWASP, <https://cheatsheetseries.owasp.org/>, with GitHub Docs, "Removing sensitive data from a repository".

## Rules

- This specialization audits and explains.
- By default, it never rewrites your code.

## What to look for

A **secret compiled into the artifact** is a credential (an API key, a token, a password, a private key) that lives in the source instead of in the environment or a secret store. It ships to everyone with repo access and stays in history forever, so a single leak of the code is a leak of the credential. The defect is decidable from the shape of the assignment alone: a literal, not a lookup. Two neighbours belong elsewhere: a secret in a `.tf`/Kubernetes manifest is `infra` (its `secrets-in-data` check), and how a validated secret is stored or rotated is `crypto` (key management).

### Deterministic pre-pass

Run the secrets hook first. It is deterministic and its verdict is literal: it keys on **provenance** (a literal versus an environment lookup), not on the value's contents, so it does not depend on an exhaustive catalog of provider prefixes and produces almost no false positives.

Call `lagune_read` with `command` set to `secrets` to scan the whole project, or add `arguments` set to `["--dir", "<DIR>"]` for a directory or `["--file", "<FILE>"]` for a single file.

It prints up to two sections. **Hardcoded secrets found** is the finding set and exits non-zero, holding the cases whose shape is decisive: a hardcoded fallback for an environment secret (`process.env.X ?? "..."`), a credential embedded in a connection string, or a value matching a curated provider format (AWS `AKIA...`, GitHub `ghp_...`, Stripe `sk_live_...`, a PEM private key). **Secret handling to review manually** is the lead set: a plain literal bound to a secret-named identifier, whose name and shape cannot prove it is a real credential rather than a hash, public key, or non-secret token, and a secret-named value flowing into a log or response sink. Read each by hand. A clean run prints a single line.

Flagging a committed secret by its format is standard defensive tooling (gitleaks, trufflehog, and GitHub push-protection do the same), shipping detection signatures, never a live secret.

### Reading beyond the hook

- **Split or obfuscated literals:** a token assembled from concatenated parts (`"ghp_" + "..."`) or base64-wrapped to dodge a scanner is the same defect. Treat the assembly as a lead and confirm by resolving it.
- **Secrets in the wrong file:** a `.env` committed to the repo, a credential in a checked-in config, or a key beside the data it protects. The hook skips `.env` and config formats by design (they are expected to be gitignored). Confirm they actually are.
- **A secret that reached a client bundle:** a key inlined into front-end code is public the moment it ships. A `NEXT_PUBLIC_`/`VITE_`-prefixed secret is exposed on purpose and must never be a real credential.

Safer shape: keep every credential out of source, config, and version control, and read it from the environment or a secrets manager at runtime. A credential that ever reached a commit stays burned after that fix, and only rotating it where it was issued ends the exposure. Purging it from the history is the user's decision, never part of a fix: the purge rewrites the commit that leaked it and every one after, forces every collaborator to rebase or re-clone, and still misses every clone, fork, and mirror already taken.

Does not close it: moving the literal into a committed `.env` or a checked-in config, or keeping it as the hardcoded fallback of an environment lookup. Either way the working tree still holds the literal.

## How to act on the result

- **In detect (detection):** each provider token, environment fallback, and connection-string credential the hook reports is a finding. Record what it is (a committed credential), why it matters (anyone who can read the code holds the secret), and the evidence (the file and the identifier). A bare literal bound to a secret-named identifier, and a secret flowing into a sink, are leads to confirm, not automatic findings. Confirmed leads flow through detect's normal steps and are tracked like any other finding. For each credential finding, also record a side quest under Not determined asking whether that credential has been rotated: name it by what it unlocks, never by its value or the finding's name, so the side quest outlives the finding.
- **In verify (proof):** the control holds once the code reads the credential from the environment or a secret store and the working tree no longer holds the literal in any form, except in a gitignored `.env`. Neither the history nor the credential's rotation keeps the finding open, not even as inconclusive, since both lie outside the working tree. Instead, point the summary at detect's rotation side quest, so the user never mistakes a closed finding for a safe credential. If the risk is not closed, record it as such and point back to harden.
