# Hook regex: find ReDoS-mønstre

> Gennemsøg en kodebase for regex, der er sårbare over for ReDoS, eller vurdér et enkelt mønster, fra kommandolinjen.

Kanonisk URL: https://lagune.ai/da-DK/docs/hooks/regex
Sprog: da-DK
Original: https://lagune.ai/docs/hooks/regex
Sidst opdateret: 2026-11-09

Hooken `regex` er den deterministiske motor til regex-sikkerhed, som [specialiseringen `regex`](https://lagune.ai/da-DK/docs/catalog) kører, og du kan selv køre den. Den virker i to tilstande fra én kommando: en **scanning**, der gennemsøger en kodebase for mønstre, der er sårbare over for **ReDoS** eller bygges under kørslen, og et **tjek**, der vurderer et enkelt mønster, du giver den.

## Scan en kodebase

Uden flag scanner den hele projektet. `--dir` afgrænser scanningen til en mappe, `--file` til en enkelt fil. Begge kan gentages og kombineres i én rapport, hvor hver fil kun står én gang, selv når mere end ét mål dækker den.

**Hele projektet**

```bash
npx lagune read regex
```

**En mappe**

```bash
npx lagune read regex --dir src/services
```

**En enkelt fil**

```bash
npx lagune read regex --file bin/import.pl
```

**Flere mål**

```bash
npx lagune read regex --dir core --dir workers --file Sources/App/Router.swift
```

**Med en grænse**

`--limit` sætter tærsklen for ReDoS i gennemsøgningen (standard 25), den samme grænse, som tilstanden check tager. En lavere grænse er strengere.

```bash
npx lagune read regex --dir src/services --limit 15
```

Outputtet er rå tekst, hvis overskrifter fortæller, hvordan hvert afsnit skal læses. Et afsnit vises kun, når det har fund.

```text
Vulnerable regular expressions found:

cmd/server/main.go
  ([a-z]+)+$ (exponential, search)

Dynamically built regular expressions (review manually by simulating a constructed regex):

app/payments.php
crates/parser/lexer.rs
lib/validate.py

Static regex wrapped in a constructor (use a literal instead):

config/token.rb
```

Når intet bliver fundet, udskriver den en enkelt linje.

```bash
npx lagune read regex --dir src/clean
# => no unsafe patterns found
```

### Sådan læser du afsnittene

| Afsnit                                                                                      | Betydning                                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Vulnerable regular expressions found`                                                      | Mønstre, der er sårbare over for ReDoS, grupperet efter fil med hvert mønster indrykket nedenunder, efterfulgt i parentes af, hvorfor det er usikkert, og, når de findes, dets omfang og dets flag. Hver linje er usikker, så afgørelsen gentages ikke. |
| `Regular expressions the analysis could not settle (review manually)`                       | Mønstre, som analysen ikke kunne afgøre inden for sin arbejdsgrænse, oplistet på samme måde.                                                                                                                                                            |
| `Dynamically built regular expressions (review manually by simulating a constructed regex)` | Filer, der bygger et regex ud fra en variabel, en sammenkædning eller en interpolation.                                                                                                                                                                 |
| `Static regex wrapped in a constructor (use a literal instead)`                             | Filer, der giver en almindelig strengliteral til en regex-konstruktør, hvor en regex-literal er enklere og sparer en kompilering under kørslen.                                                                                                         |

Det første afsnit er et sikkerhedsfund. Det andet og tredje er ikke fund i sig selv: de peger på kode, som et statisk tjek ikke kan afgøre, så de kræver, at et menneske læser den. Det fjerde er et hint om klarhed, ikke et sikkerhedsfund.

### CLI-indstillinger

| Indstilling | Værdi                   | Beskrivelse                                                                                               |
| ----------- | ----------------------- | --------------------------------------------------------------------------------------------------------- |
| `--pattern` | en regex-kilde          | Tjek ét mønster. Gentag for at tjekke flere, én afgørelse pr. mønster, i rækkefølge.                      |
| `--flags`   | regex-flag              | Tjek hvert `--pattern` med disse flag, såsom `im`. Gælder kun tilstanden check.                           |
| `--dir`     | en mappe                | Afgræns en scanning til en mappe. Kan gentages og kombineres med `--file`.                                |
| `--file`    | en fil                  | Afgræns en scanning til en enkelt fil. Kan gentages og kombineres med `--dir`.                            |
| `--limit`   | et ikke-negativt heltal | Sæt grænsen for gentagelser i ReDoS (standard 25). Gælder begge tilstande. En lavere grænse er strengere. |

Uden indstillinger scanner den hele projektet. `--pattern` er tilstanden check og kan ikke kombineres med `--dir` eller `--file`.

### Vælg, hvad den scanner

Den udelader det, **Git** ignorerer. For at udelade mere, eller for at scanne det, **Git** ignorerer, så giv `regex` sine egne indstillinger:

```bash
npx lagune write add --ignore test/fixtures --checker regex
```

```json
{
  "checkers": {
    "regex": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Konfigurér hooks](https://lagune.ai/da-DK/docs/hooks/configure) beskriver alle indstillinger.

### Understøttede sprog

Scanningen læser disse sprog, bestemt ud fra filendelsen, hvert efter dets egne regler, så et mønster fra ét sprog aldrig testes mod et andet. Alt andet springes over i stedet for at blive scannet med de forkerte regler.

| #   | Sprog                       | Filendelser                                                                                                  |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                |
| 3   | **Ruby**                    | `.rb`                                                                                                        |
| 4   | **Go**                      | `.go`                                                                                                        |
| 5   | **PHP**                     | `.php`                                                                                                       |
| 6   | **Rust**                    | `.rs`                                                                                                        |
| 7   | **Java**                    | `.java`                                                                                                      |
| 8   | **C#**                      | `.cs`                                                                                                        |
| 9   | **C**                       | `.c`, `.h`                                                                                                   |
| 10  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 |
| 11  | **Kotlin**                  | `.kt`, `.kts`                                                                                                |
| 12  | **Swift**                   | `.swift`                                                                                                     |
| 13  | **Scala**                   | `.scala`, `.sc`                                                                                              |
| 14  | **Dart**                    | `.dart`                                                                                                      |
| 15  | **PowerShell**              | `.ps1`, `.psm1`, `.psd1`                                                                                     |
| 16  | **Elixir**                  | `.ex`, `.exs`                                                                                                |
| 17  | **Objective-C**             | `.m`, `.mm`                                                                                                  |
| 18  | **R**                       | `.r`                                                                                                         |
| 19  | **Julia**                   | `.jl`                                                                                                        |
| 20  | **Clojure**                 | `.clj`, `.cljs`, `.cljc`, `.edn`                                                                             |
| 21  | **Crystal**                 | `.cr`                                                                                                        |
| 22  | **Nim**                     | `.nim`, `.nims`                                                                                              |
| 23  | **V**                       | `.v`                                                                                                         |
| 24  | **D**                       | `.d`                                                                                                         |
| 25  | **Perl**                    | `.pl`, `.pm`                                                                                                 |

**Efter bedste evne, ikke udtømmende**

Den læser kildekoden som tekst, så den kan ikke vurdere et mønster, der sættes sammen under kørslen, og et mønster, der er spredt over flere linjer, skjult bag et alias eller skrevet i en form, den ikke genkender, kan slippe forbi. Betragt afsnittene som et solidt udgangspunkt, ikke en komplet oversigt, og bliv ved med at læse koden for det, de ikke kan nå.

## Tjek et enkelt mønster

Angiv `--pattern` med mønsterets kilde for at vurdere det. Hooken udskriver ét ord: `safe`, `unsafe`, `undetermined`, når analysen når sin arbejdsgrænse, før mønsteret er afgjort, eller `invalid regex`. Gentag `--pattern` for at vurdere flere på én gang, én afgørelse pr. mønster, i rækkefølge.

**Ét mønster**

```bash
npx lagune read regex --pattern '(a+)+$'
# => unsafe

npx lagune read regex --pattern '^[a-z0-9_]{3,20}$'
# => safe
```

**Flere mønstre**

```bash
npx lagune read regex --pattern '(a+)+$' --pattern '^[a-z]+$'
# => unsafe
# => safe
```

**Med flag**

`--flags` tjekker hvert `--pattern` i kaldet med de flag, det kører med, da et flag ændrer, hvilke tegn et mønster matcher.

```bash
npx lagune read regex --pattern '^(?:a|A)+$'
# => safe

npx lagune read regex --pattern '^(?:a|A)+$' --flags 'i'
# => unsafe
```

**Med en grænse**

`--limit` sætter grænsen for gentagelser (standard 25) og gælder for hvert `--pattern` i kaldet. En lavere grænse er strengere.

```bash
npx lagune read regex --pattern 'a?a?a?' --limit 2
# => unsafe
```

**Hvorfor et argument i anførselstegn**

Hvert mønster angives som værdi til et flag og indsættes aldrig i selve kommandoen. En værdi med anførselstegn eller backticks forbliver uskadelig og kan ikke injicere noget i shellen. Sæt altid mønsteret i enkelte anførselstegn, så din shell ikke ekspanderer det først.

**Tip**

Det er den samme motor, som [specialiseringen `regex`](https://lagune.ai/da-DK/docs/catalog) kører: scanningen indleder en gennemgang for ReDoS, og tjekket bekræfter et mønster, den bringer frem.

## Ofte stillede spørgsmål

### Hvordan tjekker jeg et regex for ReDoS fra CLI'en?

Kør npx lagune read regex --pattern '<pattern>'. Den returnerer safe, unsafe, undetermined eller invalid regex.

### Hvordan scanner jeg et helt projekt for usikre regex?

Kør hooken regex i tilstanden scan over kodebasen. Den rapporterer mønstre, der er sårbare over for ReDoS, på tværs af 25 understøttede sprog.
