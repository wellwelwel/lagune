# Hook cors: gennemgå CORS-origins

> Scan kildekoden for en tilladelsesliste over CORS-origins, der kan omgås, eller vurdér, om en enkelt origin-værdi giver for bred adgang, fra kommandolinjen.

Kanonisk URL: https://lagune.ai/da-DK/docs/hooks/cors
Sprog: da-DK
Original: https://lagune.ai/docs/hooks/cors
Sidst opdateret: 2026-11-09

Hooken `cors` er den deterministiske motor bag [specialiseringen `http-request`](https://lagune.ai/da-DK/docs/catalog), og du kan selv køre den. Den virker i to tilstande fra én kommando: en **scanning**, der gennemsøger kildekoden for en **tilladelsesliste over origins, der kan omgås** (et regex til validering af værter, som en angribers vært slipper forbi), og en **vurdering**, der klassificerer en enkelt **CORS-origin** som `wildcard`, `null` eller `safe`.

## Scan en kodebase

Uden flag scanner den hele projektet.

**Hele projektet**

```bash
npx lagune read cors
```

**En mappe**

```bash
npx lagune read cors --dir src/server
```

**En enkelt fil**

```bash
npx lagune read cors --file internal/auth/origin.go
```

Den oplister hver tilladelsesliste, der kan omgås, under én overskrift, grupperet efter fil. En værtsvalidator, hvis `.+` eller `.*` står i authority-delen før suffikset for den betroede vært (`^https?://.+\.trusted\.com`), lader en angribers vært som `your-site.com.attacker.com` slippe forbi.

```text
Origin-allowlist patterns with a greedy wildcard (bypassable, review):

internal/auth/origin.go
  ^https?://.+\.trusted\.com
```

Det er et spor at gennemgå, ikke et lukket fund: om regexet styrer en reel tillidsbeslutning, kan ikke afgøres ud fra teksten, så en scanning ændrer aldrig exitkoden. Læs hver enkelt, og bekræft, at tilladelseslisten sammenligner med fuld lighed. Når intet bliver fundet, udskriver den en enkelt linje.

```bash
npx lagune read cors --dir src/clean
# => no bypassable origin allowlist found
```

## Vurdér en origin

Angiv hver origin med `--origin`. Hooken udskriver ét ord pr. origin og afslutter med en kode forskellig fra nul ved enhver `wildcard` eller `null`.

**Én origin**

```bash
npx lagune read cors --origin '*'                       # => wildcard
npx lagune read cors --origin 'null'                    # => null
npx lagune read cors --origin 'https://app.example.com' # => safe
```

**Flere origins**

Gentag `--origin` for at vurdere en hel tilladelsesliste i ét kald, én afgørelse pr. linje, i rækkefølge.

```bash
npx lagune read cors \
  --origin 'https://app.example.com' \
  --origin '*' \
  --origin 'null'
# => safe
# => wildcard
# => null
```

| Afgørelse  | Betydning                                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| `safe`     | Hverken `*`, `null` eller et glob med `*`. Det garanterer ikke en velformet origin.                        |
| `wildcard` | `*` eller et glob for underdomæne, vært eller port: ethvert websted (eller en bred mængde) må læse svaret. |
| `null`     | Origin `null`, som iframes i sandbox og omdirigeringer kan forfalske.                                      |

Kun `safe` er en tilladelse, og `--origin` er et orakel for værdier: det vurderer værdien, ikke handleren, så bekræft handleren med specialiseringen `http-request`.

### CLI-indstillinger

| Indstilling | Værdi     | Beskrivelse                                                                    |
| ----------- | --------- | ------------------------------------------------------------------------------ |
| `--origin`  | en origin | Vurdér én origin-værdi. Gentag for at vurdere flere, én pr. linje.             |
| `--dir`     | en mappe  | Afgræns en scanning til en mappe. Kan gentages og kombineres med `--file`.     |
| `--file`    | en fil    | Afgræns en scanning til en enkelt fil. Kan gentages og kombineres med `--dir`. |

Uden indstillinger scanner den hele projektet. `--origin` er vurderingstilstanden og kan ikke kombineres med `--dir` eller `--file`.

### Vælg, hvad den scanner

Den udelader det, **Git** ignorerer. For at udelade mere, eller for at scanne det, **Git** ignorerer, så giv `cors` sine egne indstillinger:

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

[Konfigurér hooks](https://lagune.ai/da-DK/docs/hooks/configure) beskriver alle indstillinger.

**Hvad den ikke dækker**

Scanningen læser formen med **regex, der kan omgås**, og `--origin` vurderer **værdier** af origins. To mønstre i kildekoden forbliver uden for rækkevidde: spejling af forespørgslens `Origin` (serveren sender den indkommende `Origin` uændret tilbage eller kombinerer den med loginoplysninger) og en eftergivende tilladelsesliste baseret på `endsWith` eller delstrenge. Genkend dem i koden, og behandl dem, som [specialiseringen `http-request`](https://lagune.ai/da-DK/docs/catalog) beskriver.

## Ofte stillede spørgsmål

### Hvorfor er en CORS-origin null farlig?

Iframes i sandbox og visse omdirigeringer sender Origin: null, så en tilladelsesliste, der stoler på null, giver de kontekster læseadgang. Hooken cors markerer den sammen med wildcard.

### Hvordan fanger jeg en tilladelsesliste over CORS-origins, der kan omgås?

Kør npx lagune read cors over kodebasen. Den markerer et regex til validering af værter, hvis grådige wildcard står før det betroede suffiks, så en angribers vært som your-site.com.attacker.com slipper forbi.
