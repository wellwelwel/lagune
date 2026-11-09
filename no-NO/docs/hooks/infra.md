# Hook infra: Oppdag feilkonfigurasjon i IaC

> Skann Terraform, Dockerfiles og GitHub Actions etter feilkonfigurasjon, eller vurder ett enkelt kodeutdrag, rett fra kommandolinjen.

Kanonisk URL: https://lagune.ai/no-NO/docs/hooks/infra
Språk: no-NO
Original: https://lagune.ai/docs/hooks/infra
Sist oppdatert: 2026-11-09

Hooken `infra` flagger **feilkonfigurasjon i infrastruktur som kode** som kan avgjøres ut fra selve filen: et nettverk som er åpent for hele verden, en tillatelse med jokertegn, en hemmelighet i et manifest, en container som kjører som root, en ikke-klarert verdi i et CI-skall. Den leser bare IaC-filer (`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`). Den er den deterministiske motoren bak [spesialiseringen `infra`](https://lagune.ai/no-NO/docs/catalog), i modusen **scan** eller **check**.

## Kjør

**Skann kodebasen**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**Sjekk et kodeutdrag**

Oppgi kodeutdraget med `--pattern` og typen med `--kind` (`terraform`, `dockerfile` eller `github-actions`).

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

Gjennomgangen skriver ut opptil to seksjoner. **Infrastructure risks found** avslutter med en exit-kode som ikke er null, og inneholder feilene som kan avgjøres (en ingress fra `0.0.0.0/0` på en sensitiv port, en IAM-setning med jokertegn, en hemmelighet i et manifest, `encrypted = false`, en git-modul som ikke er låst til en versjon, et image som eksplisitt kjører som root, en `curl | sh`, en skriptinjeksjon i CI, `permissions: write-all`). **Infrastructure hardening advisories** endrer ikke exit-koden (en foranderlig basistagg, en action som bare er låst til en tagg). Finner den ingenting, skriver den ut `no infrastructure risks found`.

## Slik leser du konklusjonen

Modusen check skriver ut taggen med høyest alvorlighetsgrad som den traff (for eksempel `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`), en anbefalingstagg (`mutable-tag`, `unpinned-action`) eller `safe`. Bare en tagg med alvorlighetsgraden til et funn avslutter med en exit-kode som ikke er null.

### CLI-alternativer

| Alternativ  | Verdi                                           | Beskrivelse                                                                 |
| ----------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| `--pattern` | et kodeutdrag                                   | Sjekk ett kodeutdrag. Krever `--kind`. Gjenta for flere.                    |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | Typen kodeutdraget vurderes som.                                            |
| `--dir`     | en mappe                                        | Avgrens gjennomgangen til en mappe. Kan gjentas og kombineres med `--file`. |
| `--file`    | en fil                                          | Avgrens gjennomgangen til én fil. Kan gjentas og kombineres med `--dir`.    |

Uten alternativer skanner den alle IaC-filer i prosjektet. `--pattern` kan ikke kombineres med `--dir` eller `--file`.

### Velg hva den skanner

Den utelater det **Git** ignorerer. For å utelate mer, eller for å skanne det **Git** ignorerer, gi `infra` egne innstillinger:

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

[Konfigurer hookene](https://lagune.ai/no-NO/docs/hooks/configure) dekker alle innstillingene.

**Tips**

Hooken fanger de opplagte tilfellene som kan avgjøres: Manglende kryptering, eksponering via `pull_request_target` og riktig IAM-omfang er vurderinger som [spesialiseringen `infra`](https://lagune.ai/no-NO/docs/catalog) fortsatt dekker.

## Vanlige spørsmål

### Hvilke infrastrukturfiler leser hooken infra?

Terraform og HCL (.tf, .tf.json, .hcl), Dockerfiles og workflow- og action-YAML for GitHub Actions under .github/. Den når disse filene selv om skannerne for kildekode hopper over dem.
