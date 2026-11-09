# Hook jwt: Oppdag JWT-verifisering uten låst algoritme

> Skann en kodebase etter JWT-verifisering uten låst algoritme, eller vurder ett enkelt kall, rett fra kommandolinjen.

Kanonisk URL: https://lagune.ai/no-NO/docs/hooks/jwt
Språk: no-NO
Original: https://lagune.ai/docs/hooks/jwt
Sist oppdatert: 2026-11-09

Hooken `jwt` flagger **JWT-verifisering uten låst algoritme**, hullet for algorithm confusion der en verifikator stoler på tokenets egen header `alg`, og **verifisering som er slått helt av**. Den er **språkbevisst** og leser hver fil ut fra JWT-biblioteket den bruker. Den er den deterministiske motoren bak [spesialiseringen `federation`](https://lagune.ai/no-NO/docs/catalog), og du kan kjøre hooken selv i modusen **scan** eller **check**.

## Kjør

**Skann kodebasen**

```bash
npx lagune read jwt                # scans the whole project
npx lagune read jwt --dir src      # scans a directory
npx lagune read jwt --file auth.ts # scans a single file
```

**Sjekk et kall**

```bash
npx lagune read jwt --lang javascript --pattern 'jwt.verify(token, secret)'                         # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, options={"verify_signature": False})' # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, algorithms=["HS256"])'                # => safe
```

Hver linje under **Unpinned JWT verification found** er et verifiseringskall som ikke angir noen tillatelsesliste `algorithms` (der biblioteket trenger en), som godtar en usikker liste (`none`, eller en asymmetrisk algoritme blandet med HMAC), eller som slår av signatursjekken helt og dermed stoler på tokenets egen `alg`. Det er en bekreftet eksponering, så hooken avslutter med en exit-kode som ikke er null. Finner den ingenting, skriver den ut `no unpinned JWT verification found`.

## Slik leser du konklusjonen

| Konklusjon | Betydning                                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `unpinned` | Et verifiseringskall uten tillatelsesliste for algoritmer (der en trengs), med en usikker liste eller med verifisering slått av. |
| `safe`     | Et verifiseringskall som låser en trygg tillatelsesliste for algoritmer, eller der biblioteket låser den implisitt.              |
| `invalid`  | Kodeutdraget inneholder ikke noe gjenkjennelig verifiseringskall å vurdere.                                                      |

### CLI-alternativer

| Alternativ  | Verdi         | Beskrivelse                                                                                    |
| ----------- | ------------- | ---------------------------------------------------------------------------------------------- |
| `--pattern` | et kodeutdrag | Sjekk ett kall. Gjenta for å sjekke flere, én konklusjon per linje.                            |
| `--lang`    | et språk      | Påkrevd med `--pattern`: ett av javascript, python, go, java, kotlin, php, ruby, rust, csharp. |
| `--dir`     | en mappe      | Avgrens gjennomgangen til en mappe. Kan gjentas og kombineres med `--file`.                    |
| `--file`    | en fil        | Avgrens gjennomgangen til én fil. Kan gjentas og kombineres med `--dir`.                       |

Uten alternativer skanner den hele prosjektet. `--pattern` krever `--lang` og kan ikke kombineres med `--dir` eller `--file`.

### Velg hva den skanner

Den utelater det **Git** ignorerer. For å utelate mer, eller for å skanne det **Git** ignorerer, gi `jwt` egne innstillinger:

```bash
npx lagune write add --ignore test/fixtures --checker jwt
```

```json
{
  "checkers": {
    "jwt": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Konfigurer hookene](https://lagune.ai/no-NO/docs/hooks/configure) dekker alle innstillingene.

### Støttede språk

Gjennomgangen leser disse bibliotekene, gjenkjent etter filendelse. Fordi noen av dem låser algoritmen implisitt (der holder det uten en eksplisitt liste), gjelder regelen "ingen tillatelsesliste ⇒ unpinned" bare der biblioteket forventer en eksplisitt liste, så et riktig konfigurert kall blir aldri flagget.

| Språk                       | Bibliotek               | Flagger manglende tillatelsesliste som unpinned?                      | Flagger alltid                                    |
| --------------------------- | ----------------------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| **JavaScript / TypeScript** | jsonwebtoken, jose      | Ja                                                                    | `none`, blanding av asymmetrisk og HMAC           |
| **Python**                  | PyJWT, python-jose      | Ja (PyJWT krever den, python-jose har `algorithms=None` som standard) | `none`, `verify_signature: False`                 |
| **Go**                      | golang-jwt              | Ja (uten `WithValidMethods`)                                          | `none`, `ParseUnverified`                         |
| **Ruby**                    | ruby-jwt                | Ja                                                                    | `none`, `verify = false`                          |
| **Java / Kotlin**           | jjwt, nimbus            | Nei (utledet fra nøkkelen)                                            | `none`, en parser uten signatur eller `unsecured` |
| **PHP**                     | firebase/php-jwt        | Nei (`Key` bærer algoritmen)                                          | `none`                                            |
| **Rust**                    | jsonwebtoken            | Nei (`Validation` krever en)                                          | `none`, `insecure_disable_signature_validation`   |
| **C#**                      | Microsoft.IdentityModel | Nei (parametere over flere linjer)                                    | `none`, `RequireSignedTokens = false`             |

**Tips**

Hooken avgjør bare om algoritmen er låst: Sjekkene av claims, nøkler og flyt er vurderinger som [spesialiseringen `federation`](https://lagune.ai/no-NO/docs/catalog) fortsatt dekker.

## Vanlige spørsmål

### Hva er algorithm confusion i JWT?

En verifikator som leser algoritmen fra headeren i tokenet, lar en angriper bytte RS256 med HS256 og signere med den offentlige nøkkelen. En trygg tillatelsesliste for algoritmer, låst i koden, hindrer det, og hooken jwt flagger et verifiseringskall som ikke angir noen liste, eller som angir en usikker liste.
