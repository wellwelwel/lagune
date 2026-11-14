# Installasjon: sikkerhetsherding for alle KI-agenter

> Installer Lagune i ethvert prosjekt, som plugin der agenten din støtter det og ellers med CLI-en til skills, og velg deretter sikkerhetsspesialiseringene som passer prosjektet.

Kanonisk URL: https://lagune.ai/no-NO/docs
Språk: no-NO
Original: https://lagune.ai/docs
Sist oppdatert: 2026-11-09

**Lagune** hjelper KI-agenten din med å gjøre et prosjekt sikrere. Du peker det mot koden din, og agenten finner ut hva systemet ditt faktisk gjør, og leder deg deretter gjennom sikkerhetsarbeidet som betyr noe for det. **Lagune** er det første prosjektet i metodikken [Security-Driven Hardening (SDH)](https://lagune.ai/no-NO/docs/references/paper).

**Støtt åpen kildekode**

Liker du **Lagune**? [Gi oss en ⭐ på **GitHub**](https://github.com/wellwelwel/lagune)

## Velg agenten din

- [Claude Code](https://lagune.ai/no-NO/docs/install/claude-code): Det agentbaserte kodeverktøyet fra Anthropic
- [Codex](https://lagune.ai/no-NO/docs/install/codex): Kodeagenten fra OpenAI
- [Cursor](https://lagune.ai/no-NO/docs/install/cursor): Kodeeditoren med KI
- [GitHub Copilot](https://lagune.ai/no-NO/docs/install/github-copilot-cli): KI-parprogrammereren fra GitHub
- [Gemini CLI](https://lagune.ai/no-NO/docs/install/gemini-cli): Terminalagenten med åpen kildekode fra Google
- [Antigravity](https://lagune.ai/no-NO/docs/install/antigravity-cli): Den agentbaserte utviklingsplattformen fra Google
- [OpenCode](https://lagune.ai/no-NO/docs/install/opencode): Kodeagenten med åpen kildekode
- [Devin for Terminal](https://lagune.ai/no-NO/docs/install/devin-cli): Terminalagenten fra Cognition
- [Factory Droid](https://lagune.ai/no-NO/docs/install/factory-droid): Agenten for programvareutvikling fra Factory
- [Grok Build](https://lagune.ai/no-NO/docs/install/grok-build): Kodeagenten fra xAI
- [Qwen Code](https://lagune.ai/no-NO/docs/install/qwen-code): Kodeagenten for terminalen fra Qwen
- [Kimi Code](https://lagune.ai/no-NO/docs/install/kimi-code): Kodeagenten fra Moonshot AI
- [Muse Code](https://lagune.ai/no-NO/docs/install/muse-code): Kodeagenten fra Meta
- [Pi](https://lagune.ai/no-NO/docs/install/pi): En minimalistisk kodeagent for terminalen
- [Hermes Agent](https://lagune.ai/no-NO/docs/install/hermes-agent): Agenten med åpen kildekode fra Nous Research
- [Universell](https://lagune.ai/no-NO/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed og 66 til

**Info**

- **Lagune** kjører på **Node.js** i bakgrunnen, men du bruker det språket du vil.
- Vil du kjøre helt offline, installerer du **Lagune** i prosjektet ditt med `npm i -D lagune@0.19.0`.

## Kategorier

Sikkerhetskunnskapen i **Lagune** kommer som [**spesialiseringer**](https://lagune.ai/no-NO/docs/catalog), gruppert i [**kategorier**](https://lagune.ai/no-NO/docs/categories).

- **OWASP** (`owasp`): Herd mot sikkerhetsrisikoene i applikasjoner som OWASP følger med på: injection, brutt tilgangskontroll og feil i autentisering og kryptografi
- **Infrastruktur** (`infra`): Herd konfigurasjonen av containere, arbeidslaster og serverless: Dockerfile, Compose, Pod-sikkerhet, IAM og triggere for FaaS
- **KI / LLM** (`ai`): Herd KI- og LLM-integrasjoner mot prompt injection og usikker kobling til verktøy, agenter, datahenting og MCP
- **Lovable** (`lovable`): Herd KI-genererte Supabase-apper (Lovable og lignende): hull i RLS, lekkede nøkler for service_role og usikre standardinnstillinger
- **JavaScript** (`javascript`): Herd JavaScript og kjøremiljøene mot RCE via eval og child_process, path traversal og prototype pollution
- **Python** (`python`): Herd Python mot RCE via deserialisering med pickle og YAML, traversal via formatstrenger i str.format og class pollution
- **Rust** (`rust`): Herd Rust mot usunne unsafe-API-er, feil bruk av transmute, heltallsoverflyt og udefinert oppførsel ved FFI-grensen
- **Java** (`java`): Herd Java mot gadget chains ved deserialisering med ObjectInputStream som ender i fjernkjøring av kode
- **Ruby** (`ruby`): Herd Ruby mot gadget chains ved deserialisering med Marshal.load og YAML som fører til fjernkjøring av kode
- **PHP** (`php`): Herd PHP mot omgåelse av autentisering via type juggling, gadget chains via object injection og usikre standardinnstillinger i konfigurasjonen
- **Go** (`go`): Herd Go mot typed nil-feil i interfaces, data races mellom goroutiner og usikker samtidighet i sikkerhetskritiske kodestier
- **C / C++** (`c-cpp`): Herd C og C++ mot formatstrengfeil, bufferoverflyt og skriving utenfor minnegrensene som åpner for kodekjøring
- **.NET** (`dotnet`): Herd .NET og C# mot RCE via deserialisering med BinaryFormatter og omgåelse av enkodere som fører til XSS

Kjør `npx lagune write add --categories` med nøklene til kategoriene du velger.

**Tips**

Et prosjekt starter med `owasp`, og [`/lagune-charter`](https://lagune.ai/no-NO/docs/commands/charter) legger til kategoriene som vurderingen av prosjektet gir grunnlag for.

## Krav

Du trenger [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) installert på systemet ditt.

## Bruk et merke ✨

Bruker du **Lagune**? Legg til et merke i **README**:

**To farger**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**Ensfarget**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## Neste steg

Se hva hver av [**skillene**](https://lagune.ai/no-NO/docs/get-started/commands) i **Lagune** gjør.

## Vanlige spørsmål

### Hva er Lagune?

Lagune er en arbeidsflyt med åpen kildekode for kun defensiv sikkerhet, som hjelper KI-agenten din med å herde enhver kodebase. Du peker det mot koden din, det oppdager hva systemet ditt faktisk gjør, og deretter leder det deg gjennom sikkerhetsutbedringene som betyr noe i den konteksten.

### Hvordan installerer jeg Lagune?

Velg agenten din: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI og Hermes Agent installerer Lagune som plugin, Gemini CLI og Qwen Code som utvidelse, Pi som pakke, og alle andre agenter med npx skills add wellwelwel/lagune -y. Det fungerer i nye og eksisterende prosjekter.

### Trenger Lagune en API-nøkkel?

Nei. Det kjører gjennom din egen KI-agent, så du trenger ingen API-nøkler.

### Hvilke krav er det?

Du trenger Node.js (LTS) installert på systemet ditt.

### Hvilke programmeringsspråk støtter Lagune?

Alle. Lagune kjører på Node.js i bakgrunnen, men reviderer og herder prosjekter skrevet i alle programmeringsspråk.

### Hva legger Lagune til i prosjektet mitt?

En mappe .lagune/ med sikkerhetstilstanden til prosjektet ditt, som den første kommandoen som skriver noe, oppretter. CLI-en til skills installerer også skråstrekkommandoene i prosjektet, der agenten din leser dem, mens en plugin holder dem inne i agenten.

### Hvordan oppdaterer jeg Lagune?

På samme måte som du installerte det. Installasjonssiden for hver agent viser hvordan du oppdaterer Lagune der, og CLI-en til skills oppdaterer det med npx skills update. Sikkerhetsprinsippene dine, artefaktene fra fasene og dine egne spesialiseringer forblir urørt.

### Hvilke spesialiseringer bruker et prosjekt?

De innebygde i kategoriene prosjektet har, pluss sine egne. Fasen charter registrerer kategoriene som vurderingen av prosjektet gir grunnlag for, og npx lagune write add --categories endrer dem.

### Må jeg bli ferdig med å bygge før jeg sikrer prosjektet mitt?

Nei. Kommandoen /lagune herder arbeidet mens det skrives: Den tar imot en hvilken som helst prompt, bygger det du ba om, og herder det med sikre standardinnstillinger, veiledet av sikkerhetsprinsippene. Blue Team-flyten i fem faser reviderer det som allerede finnes.

### Kan Lagune revidere et eksisterende prosjekt?

Ja. Blue Team-flyten i fem faser reviderer det som allerede finnes: charter fastsetter sikkerhetsreglene dine, detect kartlegger hva systemet gjør og hvor risikoene ligger, plan vurderer hvert funn og kobler det til en utbedring, harden tar i bruk utbedringene, og verify beviser at de holder, og lukker dem.

### Hva er forskjellen på å bruke Lagune og å bare be agenten kartlegge sårbarheter og sikkerhetshull?

En agent som leser på egen hånd, finner det som ser ut som en sårbarhet, og hopper over det som ser ut som et sikringstiltak. En liste over blokkerte adresser ser ut som om noen allerede har håndtert risikoen, så ingen sjekker at den mangler de fleste av dem, og koden går i produksjon. Lagune snur denne standarden: Et vern som allerede finnes i koden, regnes som ubevist til det er sjekket, hver spesialisering i katalogen får en eksplisitt konklusjon, og verify spør om risikoen er borte, ikke om et sikringstiltak er der. Hvert funn forblir dessuten ett sporet element på tvers av kjøringer, slik at det kan bevises lukket og tas ut, mens en vanlig forespørsel gir deg en ny rapport hver gang, uten noe å sammenligne med.

### Hva er forskjellen på å utvikle med Lagune og å bare be agenten skrive sikker kode?

Ber du om sikker kode, overlater du til agenten å avgjøre hva sikker betyr, og det forutsetter at du vet hva du skal be om. Kravet ligger som regel allerede i forespørselen din uten at noen av dere ser det: Ber du om en side som viser kursene en bruker har tilgang til, uttrykker du en autorisasjonsregel, og en sjekk som aldri blir skrevet, etterlater ingenting i koden som kan legges merke til. Kommandoen /lagune laster inn sikkerhetsprinsippene dine og spesialiseringene som passer til det som skal bygges, før den første linjen er skrevet, og leser deretter resultatet på nytt opp mot forsvaret den brukte. Den sikre løsningen koster sjelden mer enn den usikre, så det som avgjør utfallet, er å vite hvilken du skal velge, og nettopp det får du på forhånd.

### Kjører Lagune DAST (Dynamic Application Security Testing) eller tester det applikasjonen min mens den kjører?

Nei. Lagune leser kode og kjører aldri systemet ditt eller sender det manipulerte forespørsler. Fasen verify bekrefter at et sikringstiltak finnes og er riktig i kildekoden, og det er et annet spørsmål enn om det tåler et angrep mot et live mål, så "cannot tell from the code" er en legitim konklusjon i stedet for en stille godkjenning. DAST besvarer spørsmålet om kjøretiden og Lagune spørsmålet om kildekoden, så ingen av dem erstatter den andre. Selv den valgfrie kommandoen prove holder seg innenfor denne grensen: Testene dens bekrefter den sikre oppførselen, aldri en angreps-payload.

### Erstatter Lagune en pentest (penetrasjonstest)?

Nei, absolutt ikke! En pentest er et autorisert oppdrag der en fagperson bruker eget skjønn mot det kjørende systemet ditt, kobler sammen funn og undersøker forretningslogikken som ingen regel per angrepsflate beskriver. Funn fra en pentest kan gå inn i Blue Team-flyten i Lagune som problemstillinger du gir til detect, slik at det en fagperson rapporterer, blir planlagt, herdet og verifisert.

## Sikkerhetspolicy

Se [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md).

## Lisens

**Lagune** er lisensiert under [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE).

Copyright © 2026-i dag [Weslley Araújo](https://github.com/wellwelwel) og [bidragsytere](https://github.com/wellwelwel/lagune/graphs/contributors).
