# Installation: sikkerhedshærdning til enhver AI-agent

> Installér Lagune i ethvert projekt, som et plugin, hvor din agent understøtter det, og ellers med CLI'en fra skills, og vælg derefter de sikkerhedsspecialiseringer, der passer til det.

Kanonisk URL: https://lagune.ai/da-DK/docs
Sprog: da-DK
Original: https://lagune.ai/docs
Sidst opdateret: 2026-11-09

**Lagune** hjælper din AI-agent med at gøre et projekt mere sikkert. Du peger det mod din kode, og agenten finder ud af, hvad dit system rent faktisk gør, og guider dig derefter gennem det sikkerhedsarbejde, der betyder noget for det. **Lagune** er det første projekt i metoden [Security-Driven Hardening (SDH)](https://lagune.ai/da-DK/docs/references/paper).

**Støt open source**

Kan du lide **Lagune**? [Giv os en ⭐ på **GitHub**](https://github.com/wellwelwel/lagune)

## Vælg din agent

- [Claude Code](https://lagune.ai/da-DK/docs/install/claude-code): Anthropics agentiske kodeværktøj
- [Codex](https://lagune.ai/da-DK/docs/install/codex): OpenAIs kodeagent
- [Cursor](https://lagune.ai/da-DK/docs/install/cursor): AI-kodeeditoren
- [GitHub Copilot](https://lagune.ai/da-DK/docs/install/github-copilot-cli): GitHubs AI-makker til parprogrammering
- [Gemini CLI](https://lagune.ai/da-DK/docs/install/gemini-cli): Googles open source-terminalagent
- [Antigravity](https://lagune.ai/da-DK/docs/install/antigravity-cli): Googles agentiske udviklingsplatform
- [OpenCode](https://lagune.ai/da-DK/docs/install/opencode): Kodeagenten med åben kildekode
- [Devin for Terminal](https://lagune.ai/da-DK/docs/install/devin-cli): Cognitions terminalagent
- [Factory Droid](https://lagune.ai/da-DK/docs/install/factory-droid): Factorys agent til softwareudvikling
- [Grok Build](https://lagune.ai/da-DK/docs/install/grok-build): xAIs kodeagent
- [Qwen Code](https://lagune.ai/da-DK/docs/install/qwen-code): Qwens kodeagent til terminalen
- [Kimi Code](https://lagune.ai/da-DK/docs/install/kimi-code): Moonshot AIs kodeagent
- [Muse Code](https://lagune.ai/da-DK/docs/install/muse-code): Metas kodeagent
- [Pi](https://lagune.ai/da-DK/docs/install/pi): En minimal kodeagent til terminalen
- [Hermes Agent](https://lagune.ai/da-DK/docs/install/hermes-agent): Nous Researchs open source-agent
- [Universel](https://lagune.ai/da-DK/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed og 66 mere

**Info**

- **Lagune** kører på **Node.js** bag kulisserne, men du bruger det sprog, du vil.
- Hvis du vil køre helt offline, så installér **Lagune** i dit projekt med `npm i -D lagune@0.19.0`.

## Kategorier

Sikkerhedsviden i **Lagune** kommer som [**specialiseringer**](https://lagune.ai/da-DK/docs/catalog), grupperet i [**kategorier**](https://lagune.ai/da-DK/docs/categories).

- **OWASP** (`owasp`): Hærd mod de risici for applikationssikkerhed, som OWASP følger: injection, mangelfuld adgangskontrol, autentificering og kryptografiske fejl
- **Infrastruktur** (`infra`): Hærd konfigurationen af containere, workloads og serverless: Dockerfile, Compose, Pod-sikkerhed, IAM og triggere til FaaS
- **AI / LLM** (`ai`): Hærd AI- og LLM-integrationer mod prompt injection og usikker opkobling af værktøjer, agenter, retrieval og MCP
- **Lovable** (`lovable`): Hærd AI-genererede Supabase-apps (Lovable og lignende): huller i RLS, lækkede nøgler til service_role og usikre standardindstillinger
- **JavaScript** (`javascript`): Hærd JavaScript og dets runtimes mod RCE via eval og child_process, path traversal og prototype pollution
- **Python** (`python`): Hærd Python mod RCE via deserialisering med pickle og YAML, traversal i str.format-strenge og class pollution
- **Rust** (`rust`): Hærd Rust mod usunde unsafe-API'er, misbrug af transmute, heltalsoverløb og udefineret adfærd ved FFI-grænsen
- **Java** (`java`): Hærd Java mod gadget chains ved deserialisering med ObjectInputStream, der ender i fjernafvikling af kode
- **Ruby** (`ruby`): Hærd Ruby mod gadget chains ved deserialisering med Marshal.load og YAML, der fører til fjernafvikling af kode
- **PHP** (`php`): Hærd PHP mod omgåelse af autentificering via type juggling, gadget chains ved object injection og usikre standardindstillinger i konfigurationen
- **Go** (`go`): Hærd Go mod fejl med typede nil-interfaces, data races i goroutines og usikker samtidighed på sikkerhedskritiske stier
- **C / C++** (`c-cpp`): Hærd C og C++ mod format string-fejl, bufferoverløb og skrivninger uden for grænserne, der giver mulighed for kodeafvikling
- **.NET** (`dotnet`): Hærd .NET og C# mod RCE via deserialisering med BinaryFormatter og de omgåelser af encodere, der fører til XSS

Kør `npx lagune write add --categories` med nøglerne for de kategorier, du vælger.

**Tip**

Et projekt starter med `owasp`, og [`/lagune-charter`](https://lagune.ai/da-DK/docs/commands/charter) tilføjer de kategorier, som dets læsning af projektet understøtter.

## Krav

Du skal have [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) installeret på dit system.

## Brug et badge ✨

Bruger du **Lagune**? Tilføj et til din **README**:

**To farver**

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

**Ensfarvet**

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

## Næste trin

Se, hvad hver af [**Skills**](https://lagune.ai/da-DK/docs/get-started/commands) i **Lagune** gør.

## Ofte stillede spørgsmål

### Hvad er Lagune?

Lagune er et open source og udelukkende defensivt sikkerhedsworkflow, der hjælper din AI-agent med at hærde enhver kodebase. Du peger det mod din kode, det finder ud af, hvad dit system rent faktisk gør, og guider derefter de sikkerhedsrettelser, der betyder noget i netop den kontekst.

### Hvordan installerer jeg Lagune?

Vælg din agent: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI og Hermes Agent installerer Lagune som et plugin, Gemini CLI og Qwen Code som en udvidelse, Pi som en pakke og alle andre agenter med npx skills add wellwelwel/lagune -y. Det virker i nye såvel som eksisterende projekter.

### Kræver Lagune en API-nøgle?

Nej. Det kører gennem din egen AI-agent, så der kræves ingen API-nøgler.

### Hvad er kravene?

Du skal have Node.js (LTS) installeret på dit system.

### Hvilke programmeringssprog understøtter Lagune?

Alle. Lagune kører på Node.js bag kulisserne, men det gennemgår og hærder projekter skrevet i ethvert programmeringssprog.

### Hvad tilføjer Lagune til mit projekt?

En mappe .lagune/ med dit projekts sikkerhedstilstand, oprettet af den første kommando, der skriver. CLI'en fra skills installerer også slash-kommandoerne i projektet, hvor din agent læser dem, mens et plugin holder dem inde i agenten.

### Hvordan opdaterer jeg Lagune?

På samme måde, som du installerede det. Installationssiden for hver agent viser, hvordan du opdaterer Lagune dér, og CLI'en fra skills opdaterer det med npx skills update. Dine sikkerhedsprincipper, faseartefakter og egne specialiseringer forbliver uberørte.

### Hvilke specialiseringer bruger et projekt?

De indbyggede i dets kategorier plus dets egne. Charter registrerer de kategorier, som dets læsning af projektet understøtter, og npx lagune write add --categories ændrer dem.

### Skal jeg være færdig med at bygge, før jeg sikrer mit projekt?

Nej. Kommandoen /lagune hærder arbejdet, mens det bliver skrevet: den tager imod enhver prompt, bygger det, du bad om, og hærder det med sikre standardindstillinger, styret af sikkerhedsprincipperne. Blue Team-workflowet i fem faser gennemgår det, der allerede findes.

### Kan Lagune gennemgå et eksisterende projekt?

Ja. Blue Team-workflowet i fem faser gennemgår det, der allerede findes: charter fastlægger dine sikkerhedsregler, detect kortlægger, hvad systemet gør, og hvor risiciene er, plan vurderer hvert fund og parrer det med en rettelse, harden gennemfører rettelserne, og verify påviser, at de holder, og afslutter dem.

### Hvad er forskellen på at bruge Lagune og blot bede agenten om at kortlægge sårbarheder og sikkerhedsfejl?

En agent, der læser på egen hånd, finder det, der ligner en sårbarhed, og springer det over, der ligner en kontrol. En liste over blokerede adresser ser ud, som om nogen allerede har håndteret risikoen, så ingen tjekker, at den overser de fleste af dem, og koden bliver udgivet. Lagune vender den standard om: en beskyttelse, der allerede står i koden, anses for ubevist, indtil den er tjekket, hver specialisering i kataloget får en udtrykkelig afgørelse, og verify spørger, om risikoen er væk, ikke om der er en kontrol. Hvert fund forbliver desuden ét sporet punkt på tværs af kørsler, så det kan påvises lukket og tages ud, hvor en almindelig forespørgsel giver dig en ny rapport hver gang uden noget at sammenligne med.

### Hvad er forskellen på at udvikle med Lagune og blot bede agenten om at skrive sikker kode?

At bede om sikker kode overlader definitionen af sikker til agenten, og det forudsætter, at du ved, hvad du skal bede om. Kravet ligger som regel allerede i din forespørgsel, uden at nogen af jer ser det: at bede om en side, der viser de kurser, en bruger har adgang til, udtrykker en autorisationsregel, og et tjek, der aldrig bliver skrevet, efterlader intet i koden at lægge mærke til. Kommandoen /lagune indlæser dine sikkerhedsprincipper og de specialiseringer, der passer til det, der skal bygges, før den første linje bliver skrevet, og læser derefter resultatet igen op mod det forsvar, den brugte. Den sikre form koster sjældent mere end den usikre, så det, der afgør resultatet, er at vide, hvilken man skal gribe efter, og det er netop det, der er på plads fra starten.

### Kører Lagune DAST (Dynamic Application Security Testing) eller tester min kørende applikation?

Nej. Lagune læser kode og kører aldrig dit system eller sender det manipulerede forespørgsler. Verify bekræfter, at en kontrol findes og er korrekt i kildekoden, hvilket er et andet spørgsmål end, om den overlever et angreb mod et kørende mål, så "cannot tell from the code" er en legitim afgørelse i stedet for en stille godkendelse. DAST besvarer spørgsmålet om kørsel, og Lagune besvarer spørgsmålet om kildekoden, så ingen af dem erstatter den anden. Selv den valgfrie kommando prove holder den linje: dens tests bekræfter den sikre adfærd, aldrig en angrebspayload.

### Erstatter Lagune en pentest (penetrationstest)?

Nej, bestemt ikke! En pentest er en autoriseret opgave, hvor en professionel bruger sin dømmekraft mod dit kørende system, kæder fund sammen og afprøver den forretningslogik, som ingen regel pr. overflade beskriver. Fund fra en pentest kan komme ind i Blue Team-workflowet i Lagune som bekymringer, du giver til detect, så det, en professionel rapporterer, bliver planlagt, hærdet og verificeret.

## Sikkerhedspolitik

Læs venligst [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md).

## Licens

**Lagune** er udgivet under [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE).

Copyright © 2026-nu [Weslley Araújo](https://github.com/wellwelwel) og [bidragydere](https://github.com/wellwelwel/lagune/graphs/contributors).
