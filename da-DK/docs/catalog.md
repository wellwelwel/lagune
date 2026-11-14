# Katalog: sikkerhedsspecialiseringer efter behov

> Denne side er forældet i forhold til den engelske version. [Læs den originale version](https://lagune.ai/docs/catalog).

> Sådan indlæses specialiseringerne i dit projekts katalog, af en fase efter behov og af dig direkte.

Kanonisk URL: https://lagune.ai/da-DK/docs/catalog
Sprog: da-DK
Original: https://lagune.ai/docs/catalog
Sidst opdateret: 2026-11-09

🧠 Specialiseringerne i **Lagune** er fokuserede, sprogneutrale moduler med sikkerhedsviden, der kun indlæses efter behov, aldrig som standard. De er ikke kommandoer. Dit projekts katalog er det sæt, det bruger: de indbyggede specialiseringer i dets [kategorier](https://lagune.ai/da-DK/docs/categories) plus dets egne. Faserne detect og verify griber efter dem, mens de kører, og du kan selv indlæse en direkte når som helst.

**Overblik**

*Det interaktive overblik over kataloget findes på websiden. Alle indbyggede specialiseringer står i tabellen nedenfor.*

**Sådan virker det**

## Brug den selv

Hvis du vil bruge en specialisering direkte, så bed din agent om at indlæse den med `read catalog <name>`, og skriv opgaven i samme prompt. Viden virker så på det, du bad om. Det virker i enhver prompt, også en, der ikke har noget med workflowet i **Lagune** at gøre.

For eksempel en direkte, fri prompt, der genererer en sikker samling af **RegExp** med **Python**:

```prompt
Indlæs specialiseringen regex med `npx lagune read catalog regex`, og lav derefter en samling regulære udtryk i @src/utils/regex.py, der validerer e-mailadresser og brugernavne.
```

Den bruger en deterministisk hook til at teste hvert **RegExp** mod **ReDoS**, beholder de sikre og producerer noget i stil med:

```python
import re

EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
USERNAME = re.compile(r"^[a-zA-Z0-9_]{3,20}$")

def is_email(value: str) -> bool:
    return EMAIL.match(value) is not None

def is_username(value: str) -> bool:
    return USERNAME.match(value) is not None
```

**Prøv ReDoS-tjekket**

Test selv et mønster på [**devina.io/redos-checker**](https://devina.io/redos-checker).

## De indbyggede specialiseringer

De indbyggede specialiseringer er grupperet i [**kategorier**](https://lagune.ai/da-DK/docs/categories). Dette er det sæt, der følger med **Lagune**:

| Specialisering        | Kategori                    | Fokus                                                                                           |
| --------------------- | --------------------------- | ----------------------------------------------------------------------------------------------- |
| `regex`               | `owasp`                     | **ReDoS:** mønstre, der eksploderer ved manipuleret input.                                      |
| `network`             | `owasp`                     | **SSRF og omdirigeringer:** hente- eller omdirigeringsmål, som brugeren angiver.                |
| `interpreter`         | `owasp`, `lovable`          | **Code injection:** `eval`, dynamisk include, dispatch efter navn.                              |
| `sql`                 | `owasp`                     | **Relationelle databaser:** injection, rå ORM-kald, rettigheder, databasemotorens rækkevidde.   |
| `path`                | `owasp`                     | **Filsystemstier:** traversal, null-byte, NTFS-streams, planting.                               |
| `upload`              | `owasp`                     | **Filupload:** type/signatur, ondsindet indhold, lagring, grænser.                              |
| `access-control`      | `owasp`, `lovable`          | **Autentificering, autorisation, session:** IDOR, mass assignment, tenants, sessioner.          |
| `credential-endpoint` | `owasp`, `lovable`          | **Gæt og bots:** brute force, password spraying, credential stuffing, throttling.               |
| `federation`          | `owasp`                     | **Tillid til tokens:** OAuth/OIDC, SAML, validering af JWT, login med QR-kode.                  |
| `http-request`        | `owasp`                     | **Forespørgslers oprindelse:** CSRF, fejlkonfigureret CORS, forfalsket klient-IP.               |
| `transport`           | `owasp`                     | **Kanalsikkerhed:** TLS-konfiguration, HTTPS/klartekst, HSTS, pinning.                          |
| `crypto`              | `owasp`, `lovable`          | **Kryptografi for lagrede data:** svage eller hjemmelavede algoritmer, CSPRNG, nøglehåndtering. |
| `secrets`             | `owasp`, `lovable`          | **Hardcodede loginoplysninger:** nøgler, tokens, adgangskoder som literaler i kildekoden.       |
| `api-endpoint`        | `owasp`                     | **Flader ud over REST:** GraphQL, gRPC, autorisation af WebSocket, DoS, skema.                  |
| `payment`             | `owasp`, `lovable`          | **Checkout-flow:** verificér gatewayen på serveren, signerede callbacks, idempotens.            |
| `xml`                 | `owasp`                     | **XML-parsing:** XXE, eksterne entiteter, billion laughs-ekspansion.                            |
| `csv`                 | `owasp`                     | **Formula injection:** regnearksceller, der starter med `=`/`+`/`-`/`@`.                        |
| `container`           | `owasp`, `infra`            | **Containerkonfiguration:** root, capabilities, socket-mount, hærdning af imaget.               |
| `infra`               | `infra`                     | **Infrastructure as code:** Terraform, Dockerfile, GitHub Actions.                              |
| `serverless`          | `owasp`, `infra`, `lovable` | **FaaS-funktioner:** IAM med mindste privilegium, hændelsesinput, kontekst, secrets.            |
| `llm`                 | `ai`, `lovable`             | **AI- og LLM-risici:** prompt injection, agency, RAG, MCP, output.                              |
| `supabase`            | `lovable`                   | **Supabase-backend:** RLS slået fra som standard, policies fejlgenereret af AI, nøglemodel.     |
| `browser`             | `javascript`, `lovable`     | **Risici på klientsiden:** XSS, CSP, framing, lagring osv.                                      |
| `javascript`          | `javascript`                | **Risici på sprogniveau:** RCE, prototype pollution osv.                                        |
| `python`              | `python`                    | **Risici på sprogniveau:** RCE via `pickle`, class pollution, `-O` osv.                         |
| `rust`                | `rust`                      | **Soundness i `unsafe`:** UB fra sikre kaldere, `transmute`, overløb.                           |
| `java`                | `java`                      | **Deserialisering og mobil kode:** kæder via `readObject`, kapring af objekter.                 |
| `ruby`                | `ruby`                      | **Deserialisering og `open`:** genoplivning via `Marshal`/YAML, særheden med pipes.             |
| `php`                 | `php`                       | **Type juggling og `unserialize`:** magic hashes, POP-kæder.                                    |
| `go`                  | `go`                        | **Typed nil og data races:** `nil != nil`, goroutines med delt hukommelse.                      |
| `c-cpp`               | `c-cpp`                     | **Format strings:** `printf(user_input)`, write-what-where via `%n`.                            |
| `dotnet`              | `dotnet`                    | **Risici på platformsniveau:** RCE via `BinaryFormatter`, `@Html.Raw`, huller i enums.          |

Det meste af den indbyggede viden er destilleret fra OWASP. Se [**OWASP-kilder**](https://lagune.ai/da-DK/docs/references/owasp-sources) for den fulde kobling mellem hver specialisering og dens kanoniske sider om angreb og Cheat Sheets hos OWASP. Nogle få stakspecifikke moduler bygger i stedet på leverandørens egen vejledning: `supabase` kommer for eksempel fra dokumentationen til Supabase og CVE-2025-48757.

## Dine egne specialiseringer

De indbyggede vokser ved at tilføje én vidensfil plus én indeksrække, aldrig en ny kommando. Du tilføjer dine egne på samme måde med [`/lagune-specialize`](https://lagune.ai/da-DK/docs/commands/specialize): peg den mod en artikel eller et emne, så destillerer den en ny specialisering ind i dit projekt, filen under `.lagune/catalog/` og dens post i `.lagune/configs.json`. Dine egne er altid i kataloget, uanset dets kategorier, og en af dine overskygger en indbygget med samme navn.

**Internt indlæser Lagune specialiseringer automatisk, efter behov**

Når fasen detect eller verify rammer en kontekst, som en specialisering dækker, indlæser den selv specialiseringen med `read catalog <name>`. Det sker automatisk som en del af fasen. Du skal ikke gøre det manuelt, for at det virker.

## Find ud af, hvad der er tilgængeligt

Sådan oplister du dit projekts katalog fra terminalen, én specialisering pr. linje med dens tags:

```bash
npx lagune read catalog
# regex: Regular Expression [required]
# network: Requests, Webhook, URL Fetch, Socket, IMDS, Redirect
# interpreter: Evaluator, Sink, Shell, Dynamic Execution
# ...
```

En specialisering med `[required]` gælder altid, uanset arbejdet. Hvilke indbyggede listen indeholder, afhænger af dit projekts [**kategorier**](https://lagune.ai/da-DK/docs/categories).

**Specialiseringer indlæses ikke som standard**

Den relevante viden hentes ind til det, projektet rent faktisk er, i stedet for at alle tjek kører som standard.

## Ofte stillede spørgsmål

### Hvad er en specialisering i Lagune?

Et fokuseret, sprogneutralt modul med sikkerhedsviden, der kun indlæses efter behov, aldrig som standard. Det er ikke en kommando som agentens skills.

### Hvad er et projekts katalog?

De specialiseringer, projektet bruger: de indbyggede i dets kategorier plus dets egne. Så længe der ikke er registreret nogen kategori, bruger det kun OWASP.

### Indlæses specialiseringer som standard?

Nej. De indlæses kun efter behov, til det, projektet rent faktisk er.

### Hvordan indlæser jeg en specialisering direkte?

Bed din agent om at køre npx lagune read catalog <name> i samme prompt som opgaven.
