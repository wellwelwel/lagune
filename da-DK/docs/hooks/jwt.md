# Hook jwt: find JWT-verifikation uden fastlåst algoritme

> Gennemsøg en kodebase for JWT-verifikation uden fastlåst algoritme, eller vurdér et enkelt kald, fra kommandolinjen.

Kanonisk URL: https://lagune.ai/da-DK/docs/hooks/jwt
Sprog: da-DK
Original: https://lagune.ai/docs/hooks/jwt
Sidst opdateret: 2026-11-09

Hooken `jwt` markerer **JWT-verifikation uden fastlåst algoritme**, hullet med algoritmeforvirring, hvor en verifikator stoler på tokenets egen header `alg`, og **verifikation, der er slået helt fra**. Den er **sprogbevidst** og læser hver fil efter dens eget JWT-bibliotek, og den er den deterministiske motor bag [specialiseringen `federation`](https://lagune.ai/da-DK/docs/catalog), som du selv kan køre i tilstanden **scan** eller **check**.

## Kørsel

**Scan kodebasen**

```bash
npx lagune read jwt                # scans the whole project
npx lagune read jwt --dir src      # scans a directory
npx lagune read jwt --file auth.ts # scans a single file
```

**Tjek et kald**

```bash
npx lagune read jwt --lang javascript --pattern 'jwt.verify(token, secret)'                         # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, options={"verify_signature": False})' # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, algorithms=["HS256"])'                # => safe
```

Hver linje under **Unpinned JWT verification found** er et verifikationskald, der ikke sætter nogen tilladelsesliste i `algorithms` (hvor biblioteket kræver en), accepterer en usikker (`none` eller en asymmetrisk algoritme blandet med HMAC) eller helt slår signaturtjekket fra, så det stoler på tokenets egen `alg`. Det er en bekræftet eksponering, så hooken afslutter med en kode forskellig fra nul. En ren kørsel udskriver `no unpinned JWT verification found`.

## Sådan læser du afgørelsen

| Afgørelse  | Betydning                                                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `unpinned` | Et verifikationskald uden tilladelsesliste over algoritmer (hvor der kræves en), med en usikker eller med verifikationen slået fra. |
| `safe`     | Et verifikationskald, der fastlåser en sund tilladelsesliste over algoritmer, eller hvis bibliotek fastlåser den implicit.          |
| `invalid`  | Kodeuddraget indeholder intet genkendeligt verifikationskald at vurdere.                                                            |

### CLI-indstillinger

| Indstilling | Værdi         | Beskrivelse                                                                                    |
| ----------- | ------------- | ---------------------------------------------------------------------------------------------- |
| `--pattern` | et kodeuddrag | Tjek ét kald. Gentag for at tjekke flere, én afgørelse pr. linje.                              |
| `--lang`    | et sprog      | Påkrævet med `--pattern`: et af javascript, python, go, java, kotlin, php, ruby, rust, csharp. |
| `--dir`     | en mappe      | Afgræns en scanning til en mappe. Kan gentages og kombineres med `--file`.                     |
| `--file`    | en fil        | Afgræns en scanning til en enkelt fil. Kan gentages og kombineres med `--dir`.                 |

Uden indstillinger scanner den hele projektet. `--pattern` kræver `--lang` og kan ikke kombineres med `--dir` eller `--file`.

### Vælg, hvad den scanner

Den udelader det, **Git** ignorerer. For at udelade mere, eller for at scanne det, **Git** ignorerer, så giv `jwt` sine egne indstillinger:

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

[Konfigurér hooks](https://lagune.ai/da-DK/docs/hooks/configure) beskriver alle indstillinger.

### Understøttede sprog

Scanningen læser disse biblioteker, bestemt ud fra filendelsen. Fordi nogle fastlåser algoritmen implicit (en manglende udtrykkelig liste er sund), gælder reglen "ingen tilladelsesliste ⇒ unpinned" kun dér, hvor biblioteket forventer en udtrykkelig liste, så et korrekt konfigureret kald bliver aldrig markeret.

| Sprog                       | Bibliotek               | Markerer manglende tilladelsesliste som unpinned?                        | Markerer altid                                  |
| --------------------------- | ----------------------- | ------------------------------------------------------------------------ | ----------------------------------------------- |
| **JavaScript / TypeScript** | jsonwebtoken, jose      | Ja                                                                       | `none`, blanding af asymmetrisk og HMAC         |
| **Python**                  | PyJWT, python-jose      | Ja (PyJWT kræver den, python-jose bruger som standard `algorithms=None`) | `none`, `verify_signature: False`               |
| **Go**                      | golang-jwt              | Ja (uden `WithValidMethods`)                                             | `none`, `ParseUnverified`                       |
| **Ruby**                    | ruby-jwt                | Ja                                                                       | `none`, `verify = false`                        |
| **Java / Kotlin**           | jjwt, nimbus            | Nej (udledt af nøglen)                                                   | `none`, en usigneret eller `unsecured` parser   |
| **PHP**                     | firebase/php-jwt        | Nej (`Key` bærer algoritmen)                                             | `none`                                          |
| **Rust**                    | jsonwebtoken            | Nej (`Validation` kræver en)                                             | `none`, `insecure_disable_signature_validation` |
| **C#**                      | Microsoft.IdentityModel | Nej (parametre over flere linjer)                                        | `none`, `RequireSignedTokens = false`           |

**Tip**

Hooken afgør kun fastlåsningen af algoritmen: tjek af claims, nøgler og flow er vurderinger, som [specialiseringen `federation`](https://lagune.ai/da-DK/docs/catalog) stadig dækker.

## Ofte stillede spørgsmål

### Hvad er algoritmeforvirring i JWT?

En verifikator, der læser algoritmen fra tokenets header, lader en angriber bytte RS256 ud med HS256 og signere med den offentlige nøgle. At fastlåse en sund tilladelsesliste over algoritmer i koden forhindrer det, og hooken jwt markerer et verifikationskald, der ikke sætter nogen eller sætter en usikker.
