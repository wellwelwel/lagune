# Kategorier

> De kategorier af specialiseringer, et Lagune-projekt kan bruge, fra OWASP til hærdning pr. sprog for JavaScript, Python, Go og Rust, og hvordan du ændrer dem.

Kanonisk URL: https://lagune.ai/da-DK/docs/categories
Sprog: da-DK
Original: https://lagune.ai/docs/categories
Sidst opdateret: 2026-11-09

**Lagune** grupperer sine indbyggede [**specialiseringer**](https://lagune.ai/da-DK/docs/catalog) i **13 kategorier**. De kategorier, et projekt bruger, afgør, hvilke indbyggede der kommer med i dets [**katalog**](https://lagune.ai/da-DK/docs/catalog), og de falder i to grupper: hvad systemet gør, og hvad det er skrevet i.

Så længe der ikke er registreret nogen kategori, bruger et projekt kun `owasp`. [`/lagune-charter`](https://lagune.ai/da-DK/docs/commands/charter) registrerer hver kategori, som læsningen af projektet understøtter, og du kan selv ændre dem når som helst.

## Hvad systemet gør

| Kategori      | Nøgle     | Hvad den hærder                                                                                                                     |
| ------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| OWASP         | `owasp`   | De risici for applikationssikkerhed, som OWASP følger: injection, mangelfuld adgangskontrol, autentificering og kryptografiske fejl |
| Infrastruktur | `infra`   | Konfigurationen af containere, workloads og serverless: Dockerfile, Compose, Pod-sikkerhed, IAM og triggere til FaaS                |
| AI / LLM      | `ai`      | AI- og LLM-integrationer, mod prompt injection og usikker opkobling af værktøjer, agenter, retrieval og MCP                         |
| Lovable       | `lovable` | AI-genererede Supabase-apps (Lovable og lignende): huller i RLS, lækkede nøgler til `service_role` og usikre standardindstillinger  |

## Hvad det er skrevet i

| Kategori   | Nøgle        | Hvad den hærder                                                                                                                     |
| ---------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| JavaScript | `javascript` | RCE via `eval` og `child_process`, path traversal og prototype pollution på tværs af dets runtimes                                  |
| Python     | `python`     | RCE via deserialisering med `pickle` og YAML, traversal i strenge med `str.format` og class pollution                               |
| Rust       | `rust`       | Usunde `unsafe`-API'er, misbrug af `transmute`, heltalsoverløb og udefineret adfærd ved FFI-grænsen                                 |
| C / C++    | `c-cpp`      | Format string-fejl, bufferoverløb og skrivninger uden for grænserne, der giver mulighed for kodeafvikling                           |
| PHP        | `php`        | Omgåelse af autentificering via type juggling, gadget chains ved object injection og usikre standardindstillinger i konfigurationen |
| Go         | `go`         | Fejl med typede nil-interfaces, data races i goroutines og usikker samtidighed på sikkerhedskritiske stier                          |
| Java       | `java`       | Gadget chains ved deserialisering med `ObjectInputStream`, der ender i fjernafvikling af kode                                       |
| Ruby       | `ruby`       | Gadget chains ved deserialisering med `Marshal.load` og YAML, der fører til fjernafvikling af kode                                  |
| .NET / C#  | `dotnet`     | RCE via deserialisering med `BinaryFormatter` og de omgåelser af encodere, der fører til XSS                                        |

**Tip**

**Lagune** er sprogneutralt: hele workflowet læser det, dit projekt er skrevet i, og disse kategorier tilføjer kun dybde om de faldgruber, der er specifikke for ét sprog.

## Tilføj og fjern når som helst

En kategori er et udgangspunkt, ikke en forpligtelse. Brug det, der passer til projektet nu, og ændr det når som helst ud fra nøglen med `write add` og `write remove`. `--categories` uden værdi åbner en interaktiv vælger i en terminal (mellemrum for at slå til og fra, enter for at bekræfte, tomt for at springe over). Uden for en terminal angiver du kategorierne efter den.

**Tilføj**

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

Den første `write add` eller `write remove` starter fra `owasp`, så hvis du fjerner alle kategorier, står du tilbage med en tom liste, aldrig standarden. Hver ændring havner i `.lagune/configs.json`, så hele teamet arbejder med det samme sæt.

## Se, hvad et projekt bruger

`read list --categories` viser hver kategori, og om projektet bruger den:

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

Se [**Katalog**](https://lagune.ai/da-DK/docs/catalog) for, hvilke specialiseringer hver kategori indeholder. Dine egne specialiseringer, skrevet med [`/lagune-specialize`](https://lagune.ai/da-DK/docs/commands/specialize), kommer med i kataloget uanset kategorierne.

## Ofte stillede spørgsmål

### Hvordan tilføjer jeg en kategori?

Angiv kategoriens nøgle til --categories, for eksempel npx lagune write add --categories javascript. Charter registrerer også de kategorier, som læsningen af projektet understøtter, så længe der ikke er registreret nogen.

### Kan jeg bruge mere end én kategori?

Ja. Skriv dem på samme linje, den ene efter den anden.

### Hvilken kategori skal et projekt bruge?

Start med owasp, standarden, og tilføj derefter den til dit sprog eller din stak. Specialiseringer indlæses kun efter behov, så en kategori koster intet, før en fase har brug for en af dens specialiseringer.
