# Hook cors: Revider CORS-origins

> Skann kildekoden for en tillatelsesliste for CORS-origins som kan omgås, eller vurder om én enkelt origin-verdi gir for vid tilgang, rett fra kommandolinjen.

Kanonisk URL: https://lagune.ai/no-NO/docs/hooks/cors
Språk: no-NO
Original: https://lagune.ai/docs/hooks/cors
Sist oppdatert: 2026-11-09

Hooken `cors` er den deterministiske motoren bak [spesialiseringen `http-request`](https://lagune.ai/no-NO/docs/catalog), og du kan kjøre den selv. Den har to moduser i én kommando: modusen **scan** skanner kildekoden for en **tillatelsesliste for origins som kan omgås** (en regex for vertsvalidering som en angripers vert slipper forbi), og modusen **score** vurderer én enkelt **CORS-origin**-verdi som `wildcard`, `null` eller `safe`.

## Skann en kodebase

Uten flagg skanner den hele prosjektet.

**Hele prosjektet**

```bash
npx lagune read cors
```

**En mappe**

```bash
npx lagune read cors --dir src/server
```

**Én enkelt fil**

```bash
npx lagune read cors --file internal/auth/origin.go
```

Den lister hver tillatelsesliste som kan omgås under én overskrift, gruppert etter fil. En vertsvalidator der `.+`/`.*` står i authority-delen av URL-en foran suffikset til den klarerte verten (`^https?://.+\.trusted\.com`), slipper gjennom en angripervert som `your-site.com.attacker.com`.

```text
Origin-allowlist patterns with a greedy wildcard (bypassable, review):

internal/auth/origin.go
  ^https?://.+\.trusted\.com
```

Dette er et spor å undersøke, ikke et avsluttet funn: om regexen styrer en reell tillitsbeslutning, kan ikke avgjøres ut fra teksten, så en gjennomgang endrer aldri avslutningskoden. Les hvert treff og bekreft at tillatelseslisten sammenligner på full likhet. Når den ikke finner noe, skriver den ut én enkelt linje.

```bash
npx lagune read cors --dir src/clean
# => no bypassable origin allowlist found
```

## Vurder en origin

Send hver origin med `--origin`. Hooken skriver ut ett ord per origin og avslutter med en kode som ikke er null ved hver `wildcard` eller `null`.

**Én origin**

```bash
npx lagune read cors --origin '*'                       # => wildcard
npx lagune read cors --origin 'null'                    # => null
npx lagune read cors --origin 'https://app.example.com' # => safe
```

**Flere origins**

Gjenta `--origin` for å vurdere en hel tillatelsesliste i ett kall, én konklusjon per linje, i samme rekkefølge.

```bash
npx lagune read cors \
  --origin 'https://app.example.com' \
  --origin '*' \
  --origin 'null'
# => safe
# => wildcard
# => null
```

| Konklusjon | Betydning                                                                                          |
| ---------- | -------------------------------------------------------------------------------------------------- |
| `safe`     | Verken `*`, `null` eller en glob med `*`. Det garanterer ikke en korrekt utformet origin.          |
| `wildcard` | `*` eller en glob for underdomene, vert eller port: alle nettsteder (eller mange) kan lese svaret. |
| `null`     | Originen `null`, som iframes i sandkasse og videresendinger kan forfalske.                         |

Bare `safe` betyr tillatelse, og `--origin` er et orakel for verdier: det vurderer verdien, ikke handleren, så bekreft handleren med spesialiseringen `http-request`.

### CLI-alternativer

| Alternativ | Verdi     | Beskrivelse                                                                      |
| ---------- | --------- | -------------------------------------------------------------------------------- |
| `--origin` | en origin | Vurder én origin-verdi. Gjenta for å vurdere flere, én per linje.                |
| `--dir`    | en mappe  | Avgrens en gjennomgang til en mappe. Kan gjentas og kombineres med `--file`.     |
| `--file`   | en fil    | Avgrens en gjennomgang til én enkelt fil. Kan gjentas og kombineres med `--dir`. |

Uten alternativ skanner den hele prosjektet. `--origin` er modusen score og kan ikke kombineres med `--dir` eller `--file`.

### Velg hva den skanner

Den utelater det **Git** ignorerer. For å utelate mer, eller for å skanne det **Git** ignorerer, gi `cors` egne innstillinger:

```bash
npx lagune write add --ignore test/fixtures --checker cors
```

```json
{
  "checkers": {
    "cors": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Konfigurer hookene](https://lagune.ai/no-NO/docs/hooks/configure) beskriver hver innstilling.

**Hva den ikke dekker**

Gjennomgangen gjenkjenner formen til en **regex som kan omgås**, og `--origin` vurderer **verdier** for origins. To mønstre i kildekoden er utenfor rekkevidde: speiling av `Origin` fra forespørselen (serveren sender den innkommende `Origin` tilbake uendret, eller kombinerer den med påloggingsdetaljer), og en for romslig tillatelsesliste basert på `endsWith` eller delstrenger. Gjenkjenn dem i koden og håndter dem slik [spesialiseringen `http-request`](https://lagune.ai/no-NO/docs/catalog) beskriver.

## Vanlige spørsmål

### Hvorfor er CORS-originen null farlig?

Iframes i sandkasse og enkelte videresendinger sender Origin: null, så en tillatelsesliste som stoler på null, gir disse kontekstene lesetilgang. Hooken cors flagger det sammen med wildcard.

### Hvordan finner jeg en tillatelsesliste for CORS-origins som kan omgås?

Kjør npx lagune read cors over kodebasen. Den flagger en regex for vertsvalidering der et grådig wildcard står foran det klarerte suffikset, slik at en angripervert som your-site.com.attacker.com slipper forbi.
