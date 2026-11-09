# Kategorier

> Spesialiseringskategoriene et Lagune-prosjekt kan bruke, fra OWASP til språkspesifikk herding for JavaScript, Python, Go og Rust, og hvordan du endrer dem.

Kanonisk URL: https://lagune.ai/no-NO/docs/categories
Språk: no-NO
Original: https://lagune.ai/docs/categories
Sist oppdatert: 2026-11-09

**Lagune** grupperer de innebygde [**spesialiseringene**](https://lagune.ai/no-NO/docs/catalog) sine i **13 kategorier**. Kategoriene et prosjekt bruker, avgjør hvilke innebygde som kommer med i [**katalogen**](https://lagune.ai/no-NO/docs/catalog) til prosjektet, og de deler seg i to: hva systemet gjør, og hva det er skrevet i.

Så lenge ingen kategori er registrert, bruker et prosjekt bare `owasp`. [`/lagune-charter`](https://lagune.ai/no-NO/docs/commands/charter) registrerer hver kategori som analysen av prosjektet støtter, og du kan når som helst endre dem selv.

## Hva systemet gjør

| Kategori      | Nøkkel    | Hva den herder                                                                                                                   |
| ------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| OWASP         | `owasp`   | Applikasjonssikkerhetsrisikoene OWASP følger med på: injeksjon, brutt tilgangskontroll og svikt i autentisering og kryptografi   |
| Infrastruktur | `infra`   | Konfigurasjon av containere, arbeidslaster og serverless: Dockerfile, Compose, Pod-sikkerhet, IAM og triggere for FaaS           |
| KI / LLM      | `ai`      | Integrasjoner med KI og LLM, mot prompt injection og usikker kobling av verktøy, agenter, gjenfinning og MCP                     |
| Lovable       | `lovable` | KI-genererte Supabase-apper (Lovable og lignende): hull i RLS, lekkede nøkler for `service_role` og usikre standardinnstillinger |

## Hva det er skrevet i

| Kategori   | Nøkkel       | Hva den herder                                                                                                   |
| ---------- | ------------ | ---------------------------------------------------------------------------------------------------------------- |
| JavaScript | `javascript` | RCE via `eval` og `child_process`, path traversal og prototype pollution, på tvers av kjøremiljøene              |
| Python     | `python`     | RCE ved deserialisering med `pickle` og YAML, string traversal via `str.format` og class pollution               |
| Rust       | `rust`       | Usunne API-er med `unsafe`, feilbruk av `transmute`, heltallsoverflyt og udefinert oppførsel ved FFI-grensen     |
| C / C++    | `c-cpp`      | Formatstrengfeil, bufferoverflyt og skriving utenfor grensene som muliggjør kodekjøring                          |
| PHP        | `php`        | Omgåelse av autentisering via type juggling, gadget-kjeder for objektinjeksjon og usikre standardkonfigurasjoner |
| Go         | `go`         | Typed nil-feil i interfaces, data races mellom goroutiner og usikker samtidighet på sikkerhetskritiske stier     |
| Java       | `java`       | Gadget-kjeder ved deserialisering med `ObjectInputStream` som ender i fjernkjøring av kode                       |
| Ruby       | `ruby`       | Gadget-kjeder ved deserialisering med `Marshal.load` og YAML som når fram til fjernkjøring av kode               |
| .NET / C#  | `dotnet`     | RCE ved deserialisering med `BinaryFormatter` og omgåelser av encoderen som fører til XSS                        |

**Tips**

**Lagune** er språkuavhengig: Hele flyten leser prosjektet ditt, uansett hva det er skrevet i, og disse kategoriene går bare dypere inn i fallgruvene som er særegne for ett språk.

## Legg til og fjern når som helst

En kategori er et utgangspunkt, ikke en forpliktelse. Bruk det som passer prosjektet nå, og endre det når som helst via nøkkelen, med `write add` og `write remove`. `--categories` uten verdi åpner en interaktiv velger i en terminal (mellomrom for å slå av og på, enter for å bekrefte, tomt for å hoppe over). Utenfor en terminal oppgir du kategoriene rett etter.

**Legg til**

```bash
npx lagune write add --categories # interactive
npx lagune write add --categories owasp
npx lagune write add --categories owasp rust
```

**Fjern**

```bash
npx lagune write remove --categories # interactive
npx lagune write remove --categories owasp
npx lagune write remove --categories owasp rust
```

Den første `write add` eller `write remove` tar utgangspunkt i `owasp`, så fjerner du alle kategorier, står du igjen med en tom liste, aldri standardverdien. Hver endring havner i `.lagune/configs.json`, så hele teamet jobber med det samme utvalget.

## Se hva et prosjekt bruker

`read list --categories` viser hver kategori og om prosjektet bruker den:

```bash
npx lagune read list --categories
# Categories
#   • owasp       [used]       Harden against the application security risks OWASP tracks
#   • javascript  [available]  Harden JavaScript and its runtimes
#   • php         [available]  Harden PHP against type-juggling auth bypass
#   • go          [available]  Harden Go against typed-nil interface bugs
#   ...
#
# No category is recorded yet, so this project uses the default: owasp.
```

I [**Katalog**](https://lagune.ai/no-NO/docs/catalog) ser du hvilke spesialiseringer hver kategori inneholder. Dine egne spesialiseringer, skrevet med [`/lagune-specialize`](https://lagune.ai/no-NO/docs/commands/specialize), kommer med i katalogen uansett kategorier.

## Vanlige spørsmål

### Hvordan legger jeg til en kategori?

Gi nøkkelen til kategorien til --categories, for eksempel npx lagune write add --categories javascript. Så lenge ingen er registrert, registrerer også charter kategoriene som analysen av prosjektet støtter.

### Kan jeg bruke mer enn én kategori?

Ja. Skriv dem på samme linje, den ene etter den andre.

### Hvilken kategori bør et prosjekt bruke?

Start med owasp, som er standard, og legg deretter til den for språket eller stakken din. Spesialiseringer lastes bare ved behov, så en kategori koster ingenting før en fase trenger en av spesialiseringene i den.
