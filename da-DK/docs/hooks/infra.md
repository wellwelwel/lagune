# Hook infra: find fejlkonfiguration i IaC

> Gennemsøg Terraform, Dockerfiles og GitHub Actions for fejlkonfiguration, eller vurdér et enkelt kodeuddrag, fra kommandolinjen.

Kanonisk URL: https://lagune.ai/da-DK/docs/hooks/infra
Sprog: da-DK
Original: https://lagune.ai/docs/hooks/infra
Sidst opdateret: 2026-11-09

Hooken `infra` markerer **fejlkonfiguration i infrastructure as code**, der kan afgøres ud fra filen: et netværk, der er åbent for hele verden, en tilladelse med wildcard, en secret i et manifest, en container, der kører som root, en ikke-betroet værdi i en CI-shell. Den læser kun IaC-filer (`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`). Den er den deterministiske motor bag [specialiseringen `infra`](https://lagune.ai/da-DK/docs/catalog), i tilstanden **scan** eller **check**.

## Kørsel

**Scan kodebasen**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**Tjek et kodeuddrag**

Angiv kodeuddraget med `--pattern` og dets type med `--kind` (`terraform`, `dockerfile` eller `github-actions`).

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

Scanningen udskriver op til to afsnit. **Infrastructure risks found** afslutter med en kode forskellig fra nul og indeholder de fejl, der kan afgøres (en ingress fra `0.0.0.0/0` på en følsom port, en IAM-erklæring med wildcard, en secret i et manifest, `encrypted = false`, et git-modul uden fastlåst version, et image, der udtrykkeligt kører som root, en `curl | sh`, en script injection i CI, `permissions: write-all`). **Infrastructure hardening advisories** ændrer ikke exitkoden (et foranderligt basis-tag, en action, der kun er fastlåst med et tag). En ren kørsel udskriver `no infrastructure risks found`.

## Sådan læser du afgørelsen

Tilstanden check udskriver det mest alvorlige tag, den matchede (for eksempel `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`), et tag til en anbefaling (`mutable-tag`, `unpinned-action`) eller `safe`. Kun et tag med alvorligheden fund afslutter med en kode forskellig fra nul.

### CLI-indstillinger

| Indstilling | Værdi                                           | Beskrivelse                                                                    |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------------------------ |
| `--pattern` | et kodeuddrag                                   | Tjek ét kodeuddrag. Kræver `--kind`. Gentag for flere.                         |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | Den type, kodeuddraget vurderes som.                                           |
| `--dir`     | en mappe                                        | Afgræns en scanning til en mappe. Kan gentages og kombineres med `--file`.     |
| `--file`    | en fil                                          | Afgræns en scanning til en enkelt fil. Kan gentages og kombineres med `--dir`. |

Uden indstillinger scanner den hver IaC-fil i projektet. `--pattern` kan ikke kombineres med `--dir` eller `--file`.

### Vælg, hvad den scanner

Den udelader det, **Git** ignorerer. For at udelade mere, eller for at scanne det, **Git** ignorerer, så giv `infra` sine egne indstillinger:

```bash
npx lagune write add --ignore examples --checker infra
```

```json
{
  "checkers": {
    "infra": { "gitignore": false, "ignore": ["examples"] }
  }
}
```

[Konfigurér hooks](https://lagune.ai/da-DK/docs/hooks/configure) beskriver alle indstillinger.

**Tip**

Hooken fanger de åbenlyse tilfælde, der kan afgøres: manglende kryptering, eksponering via `pull_request_target` og det rette IAM-omfang er vurderinger, som [specialiseringen `infra`](https://lagune.ai/da-DK/docs/catalog) stadig dækker.

## Ofte stillede spørgsmål

### Hvilke infrastrukturfiler læser hooken infra?

Terraform/HCL (.tf, .tf.json, .hcl), Dockerfiles samt YAML til workflows og actions i GitHub Actions under .github/. Den når de filer, selvom scannerne af kildekode springer dem over.
