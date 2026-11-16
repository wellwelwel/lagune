# Hardcoded-secret vulnerabilities

> - This knowledge extends your judgment. Apply what fits the project and keep reasoning beyond the list.
> - Source: OWASP, <https://cheatsheetseries.owasp.org/>, with **GitHub** Docs, "Removing sensitive data from a repository", the **Next.js**, **Nuxt**, **Expo**, **SvelteKit**, **Astro**, **Vite**, **Create React App**, **Vue CLI**, and **Gatsby** documentation on the variables they ship to the browser, the **Android** documentation on the debug keystore, and the **dotenvx** documentation on encrypted environment files.

## Rules

- This specialization audits and explains.
- By default, it never rewrites your code.

## What to look for

This terrain is a **credential the code exposes**: an API key, a token, a password, or a private key written as a literal where an environment or secret-store lookup belongs, committed in a file that exists to hold one, shipped to the browser, or written to a log or a response. A secret in a `.tf` or **Kubernetes** manifest is `infra` (its `secrets-in-data` check), and how a secret is stored or rotated is `crypto` (key management).

### Deterministic pre-pass

Run the secrets hook first: call `lagune_read` with `command` set to `secrets` to scan the whole project, or add `arguments` set to `["--dir", "<DIR>"]` for a directory or `["--file", "<FILE>"]` for a single file. **Hardcoded secrets found** is proof, and the hook exits non-zero. **Secret handling to review manually** holds leads to read by hand. **Secret handling advisories** holds a risk not yet exposed, such as a credential file the next `git add` would stage.

### Credential in source or config

The code holds a literal where a lookup belongs: a value in a provider's format (**AWS** `AKIA...`, **GitHub** `ghp_...`, **Stripe** `sk_live_...`, a PEM private key), a literal bound to a secret-named identifier, a password inside a connection string, or the hardcoded fallback of an environment lookup (`process.env.X ?? "..."`). The hook reads no checked-in config (JSON, YAML, TOML, XML) and misses a token split across concatenated parts (`"ghp_" + "..."`) or wrapped in base64: read the configs, and resolve an assembled value before judging it.

Safer shape: read the credential from the environment or a secrets manager at runtime.

Does not close it: keeping the literal as the fallback of an environment lookup, or moving it into a committed `.env`, a template such as `.env.example`, or a checked-in config.

### Credential file under version control

**Git** tracks a file that exists to hold a credential: a private key or keystore, cloud or service account credentials, a **Terraform** state, or an `.npmrc`, `.pypirc`, kubeconfig, or **dotenvx** `.env.keys` holding a credential. The hook knows these by name and content, so read for a renamed copy. **Android**'s `debug.keystore` and a **Keynote** deck saved as `.key` are not credentials.

Safer shape: keep the file where the tool that reads it expects it, untracked with `git rm --cached` and covered by a `.gitignore` rule.

Does not close it: a `.gitignore` rule alone, which never untracks a file **Git** already tracks.

### Environment file under version control

An environment file **Git** tracks holds a real credential, a template such as `.env.example` holds one where a stand-in belongs, or **Git** tracks or would commit a local variant such as `.env.local`. The hook flags a value only by a provider format, a connection string, or a secret-named variable, and in a template only as a lead, so read every tracked environment file and template for a value not meant to be public. A committed `.env` of public defaults, a provider's documented sample key in a template, and a **dotenvx** ciphertext are not secrets.

Safer shape: a tracked environment file holds only public defaults or **dotenvx** ciphertext, whose `.env.keys` stays out of **Git**, a template holds only stand-ins, and every secret lives in a local variant **Git** ignores, such as `.env.local`.

### Credential shipped to the browser

A key inlined into front-end code is public once it ships, and so is any variable under a prefix its framework ships to the browser: `NEXT_PUBLIC_`, `NUXT_PUBLIC_`, `EXPO_PUBLIC_`, `PUBLIC_`, `VITE_`, `REACT_APP_`, `VUE_APP_`, `GATSBY_`. The hook never flags such a variable by its prefix, so read each one yourself.

Safer shape: keep the call that needs the credential on the server, and give the browser only a key its provider issues for public use.

Does not close it: moving the key into a variable under one of these prefixes.

### Credential written to a log or response

The code writes a credential, whatever its source, to a log, an error message, or a response body. The hook flags only some of these, as leads, so read every log, error, and response that carries configuration, headers, or environment values.

Safer shape: redact the credential before it reaches any sink, and log only that it is set.

### Credential in the Git history

Deleting a secret from the code leaves it in every commit that held it. The history pass applies the hook's rules to every version of every file in the history: call it with `arguments` set to `["--history"]`. When **Git history the checker did not read** says the walk stopped at a bound, call it again with `arguments` set to `["--history", "--before", "<COMMIT>"]` and the commit it names.

Safer shape: rotate the credential where it was issued. Purging it from the history is the user's decision, never part of a fix.

Does not close it: removing the literal from the code, or purging the history, which still misses every clone, fork, and mirror already taken.

## How to act on the result

- **In detect (detection):** each entry under **Hardcoded secrets found** is a finding, and so is each lead you confirm as a real credential by reading its value and how the code uses it, never a development default or a key made only for tests. An advisory is never a finding: raise it with the user along with the change it names. Record the entry the hook prints when it cannot read the project's **Git** state once under Not determined, never once per file it lists. For each credential finding, also record a side quest under Not determined asking whether that credential has been rotated, named by what it unlocks, never by its value or the finding's name.

  Run the history pass on the run that creates the detect map, and whenever the input asks about secrets or the history. Continue a stopped walk at most three times, and record what the walk did not read once under Not determined. No history entry is a finding. Record each entry of **Secrets in the Git history** as a side quest under Not determined asking that the credential be rotated where it was issued, named by what it unlocks and by the file and commit the hook prints, and fold it into the rotation side quest of a finding that names the same credential. Gather the entries of **Possible secrets in the Git history to review manually** into one side quest asking which, if any, holds a real credential to rotate, leaving out any whose file the scan of the working tree also lists. An entry under **Secrets only a stash holds** is an advisory, never a side quest: tell the user it needs no rotation while the stash is neither committed nor pushed under a name of its own.

  For a credential file in a test folder that only the tests use, and for a settled history entry whose file the project no longer has, tell the user its path can be left out in the project's configs, and leave that choice to them.

- **In verify (proof):** the control holds once the code reads the credential from the environment or a secret store and the working tree no longer holds the literal in any form, except in a file **Git** ignores and does not track, such as `.env.local`, or as a **dotenvx** ciphertext. The code must also never ship it to the browser through a public variable, nor write it to a log, an error, or a response. For a credential or environment file, it holds once the hook reports neither that file nor the local file its secret moved to, as a finding or an advisory. A lead the hook still prints for either keeps the finding open only once you confirm it is a real credential still exposed. One you cannot confirm, such as the entry for a **Git** state the hook cannot read, never keeps it open, not even as inconclusive: name it in the summary as unconfirmed, so the user settles it before confirming the stand-down. Neither the history nor the credential's rotation keeps it open: point the summary at detect's rotation side quest, since a closed finding is not a safe credential.
