# Eksempler på prompts til Lagune: automatisér Blue Team-workflowet

> Prompts til Lagune, klar til at kopiere: en scanning med kun læseadgang, hele Blue Team-workflowet og en Zero Trust-gennemgang samt detektion afgrænset til et commit, diffen for en branch eller PR eller en reel hændelse.

Kanonisk URL: https://lagune.ai/da-DK/docs/examples/prompts
Sprog: da-DK
Original: https://lagune.ai/docs/examples/prompts
Sidst opdateret: 2026-11-09

Prompts til Lagune, klar til at kopiere, som du kan indsætte direkte i din AI-agent.

## 💧 Overfladisk scanning

En gennemsøgning med kun læseadgang, der læser koden på egen hånd og rapporterer hver fejl med en rettelse, uden at køre Blue Team-workflowet eller skrive til sporingen i Lagune.

**Tip**

Virker bedre i planlægningstilstand og med sikkerhedsprincipper (`/lagune-charter`) defineret.

**🪼 Standard**

| Aspekt           | Afvejning                                                       | Niveau              |
| ---------------- | --------------------------------------------------------------- | ------------------- |
| **Indsats**      | Én agent scanner og rapporterer, uden subagenter.               | 1/5 |
| **Tid**          | Hurtig. Et enkelt gennemløb med kun læseadgang, intet anvendes. | 2/5 |
| **Tokenforbrug** | Moderat, delt. Hele scanningen kører i én kontekst.             | 2/5 |

```md
/lagune Du er en cybersikkerhedsforsker med dyb ekspertise i defensiv sikkerhed, og du bruger Lagune til at forbedre din viden og præcision.

Scan arbejdsområdet på egen hånd, og par hver fejl, du finder, med en konkret rettelse. Dette er en selvstændig gennemsøgning, ikke Blue Team-workflowet: kør ikke detect, plan, harden eller verify, og skriv intet til sporingen i Lagune.

Til sidst skal du liste hver fejl, du har fundet, hver med sin alvorlighed og en konkret rettelse.
```

**🐬 Flere agenter**

| Aspekt           | Afvejning                                                                      | Niveau              |
| ---------------- | ------------------------------------------------------------------------------ | ------------------- |
| **Indsats**      | Én subagent pr. fil, skaleret efter størrelsen på din kodebase.                | 2/5 |
| **Tid**          | Parallelt pr. fil, derefter flettet til én rapport. Stadig kun med læseadgang. | 3/5 |
| **Tokenforbrug** | Højere, men isoleret. Hver subagent scanner i sin egen kontekst.               | 3/5 |

````md
/lagune Du er en cybersikkerhedsorkestrator, der bruger Lagune til at opregne, sende en subagent af sted pr. sti og flette deres rapporter (alt indhold læses af subagenterne).

Du skal uddelegere opgaven til subagenter ud fra det aktuelle projekts størrelse: jo større kodebasen er, desto flere subagenter skal sendes af sted, alle parallelt, og hver skal have prompten nedenfor:

```prompt
/lagune Du er en cybersikkerhedsforsker med dyb ekspertise i defensiv sikkerhed, og du bruger Lagune til at forbedre din viden og præcision.

Scan <path> på egen hånd, og par hver fejl, du finder, med en konkret rettelse. Dette er en selvstændig gennemsøgning, ikke Blue Team-workflowet: kør ikke detect, plan, harden eller verify, og skriv intet til sporingen i Lagune.

Til sidst skal du liste hver fejl i <path>, hver med sin alvorlighed og en konkret rettelse.
```

Til sidst skal du flette alle subagenternes rapporter til én prioriteret liste over fejl og rettelser.
````

**Advarsel**

En hurtig scanning er én bred, uafgrænset prompt, så nogle agenter er mere tilbøjelige til at afvise den eller afbryde den før tid. Hvis din agent stritter imod, så kør i stedet hele **Blue Team-workflowet** nedenfor: dets afgrænsede faser, trin for trin, bliver langt sjældnere blokeret.

---

## 🌊 Automatisk Blue Team-gennemgang

Kører [hele kommandoforløbet](https://lagune.ai/da-DK/docs/get-started/commands) fra start til slut.

**🪼 Standard**

| Aspekt           | Afvejning                                                                                           | Niveau              |
| ---------------- | --------------------------------------------------------------------------------------------------- | ------------------- |
| **Indsats**      | Én agent, ingen subagenter, uanset kodebasens størrelse.                                            | 3/5 |
| **Tid**          | Middel, men mindre grundig i store kodebaser. Hver kommando kører én gang, den ene efter den anden. | 4/5 |
| **Tokenforbrug** | Lavere, men mindre isoleret. Alle kommandoer deler den samme kontekst.                              | 4/5 |

```md
Udfør følgende kommandoer, én ad gangen: `/lagune-charter`, `/lagune-detect`, `/lagune-plan`, `/lagune-harden` og `/lagune-verify`.

## Løkke

Når `/lagune-verify` afviser en eller flere rettelser, så gentag `/lagune-harden` og derefter `/lagune-verify`, indtil alle fund er løst korrekt.
```

**🐋 Flere agenter (dyb scanning)**

| Aspekt           | Afvejning                                                                                                     | Niveau              |
| ---------------- | ------------------------------------------------------------------------------------------------------------- | ------------------- |
| **Indsats**      | Antallet af subagenter skaleres efter størrelsen på din kodebase.                                             | 5/5 |
| **Tid**          | Længere, men mere grundig. Sender flere subagenter af sted, der opdager, planlægger og hærder fund parallelt. | 5/5 |
| **Tokenforbrug** | Højere, men sikrere. Hver subagent har sin egen isolerede kontekst uden forudindtagethed.                     | 5/5 |

````md
Udfør hver af følgende kommandoer med sin egen subagent, én ad gangen (uden backticks, kun kommandoen):

Prompt til subagent 1: `/lagune-charter`
Prompt til subagent 2: `/lagune-detect`
Prompt til subagent 3: `/lagune-plan`
Prompt til subagent 4: `/lagune-harden`
Prompt til subagent 5: `/lagune-verify`

I kommandoerne `/lagune-detect`, `/lagune-plan`, `/lagune-harden` og `/lagune-verify` skal du uddelegere opgaven til subagenter ud fra det aktuelle projekts størrelse: jo større kodebasen er, desto flere subagenter skal sendes af sted. For eksempel:

```prompt
/lagune-detect <path>
```

```prompt
/lagune-plan <finding>
```

```prompt
/lagune-harden <finding>
```

```prompt
/lagune-verify <finding>
```

- Flere agenter på samme kommando skal sendes af sted parallelt.
- Når alle subagenter til `/lagune-detect` er færdige, så udfør:

```prompt
/lagune-detect flet ensbetydende fund. Opdag ikke nye fund, og scan ikke kodebasen igen.
```

## Løkke

Når `/lagune-verify` afviser en eller flere rettelser, så gentag `/lagune-harden` og derefter `/lagune-verify`, indtil alle fund er løst korrekt.
````

---

## 🪄 Afgrænset detektion

Ret [`/lagune-detect`](https://lagune.ai/da-DK/docs/commands/detect) mod en del af dit projekt i stedet for det hele. Beskriv omfanget med almindelige ord (et commit, en pull request eller en reel situation), så kortlægger den kun de sikkerhedsrelevante fund dér.

**Tip**

Alt, hvad den opdager her, er almindelige fund, så du kan føre dem direkte videre til `/lagune-plan`, `/lagune-harden` og `/lagune-verify`, afgrænset til netop de punkter.

**📌 Siden et commit**

Giv en ny omgang commits sin egen sikkerhedsgennemgang, afgrænset til netop det, de ændrede, for eksempel:

```prompt
/lagune-detect Afgræns detektionen til alt, der er ændret siden commit `a1b2c3d`.
```

**🔀 Diff for branch eller PR**

Gennemgå sikkerheden i en pull request, før den bliver merget, afgrænset til netop dens diff, for eksempel:

```prompt
/lagune-detect Afgræns detektionen til de ændringer, denne branch introducerer i forhold til `main`.
```

**⛑️ Efter en hændelse**

Beskriv med dine egne ord, hvad der skete. Lagune læser situationen, ikke et flag, og gør den til en fokuseret jagt, for eksempel:

```prompt
/lagune-detect Vores websted havde et datalæk for et par uger siden. Jeg ved ikke præcis, hvordan det skete, og jeg er bekymret for, at der stadig er noget åbent, der kan lække data igen. Gå koden grundigt igennem, fokusér på alle steder, hvor følsomme data læses, gemmes eller eksponeres, og kortlæg alt, der stadig kan være en vej ud. Behandl det som en reel hændelse, ikke en øvelse.
```

---

## 🚨 Zero Trust-gennemgang

Behandler hele arbejdsområdet og hver afhængighed som fjendtlig: den jager interpretere, netværkskald, kodede payloads og kode, der er gemt på usandsynlige steder for at slippe forbi scannere, og slutter med en afgørelse om, hvorvidt projektet er sikkert at bruge eller ej.

Prompterne indlæser de specialiseringer, denne gennemgang bygger på, direkte, uanset dit projekts kategorier. For resten af det katalog, som `/lagune` matcher, skal du sørge for, at projektet bruger **OWASP**, **AI/LLM** og kategorien for dets stak (f.eks. **JavaScript**, **Python** osv.):

```bash
npx lagune write add --categories owasp ai javascript
```

Repositoriets egne `.gitignore`-filer og konfigurationer kan skjule filer for tjekkene, så indstil blokken `checkers` i `.lagune/configs.json` til at [scanne alt](https://lagune.ai/da-DK/docs/hooks/configure), og erstat enhver blok, som repositoriet leverer:

```json
{
  "checkers": { "gitignore": false }
}
```

**Fare**

Vær forsigtig, når du kører projekter fra kilder, du ikke stoler på, i dit lokale miljø. Brug et isoleret miljø, såsom en **sandbox** (anbefales), en **VM** eller lignende, så ondsindet kode ikke kan påvirke dit system.

**🪼 Standard**

| Aspekt           | Afvejning                                                                                    | Niveau              |
| ---------------- | -------------------------------------------------------------------------------------------- | ------------------- |
| **Indsats**      | Én agent gennemsøger hele arbejdsområdet, uden subagenter.                                   | 2/5 |
| **Tid**          | Middel. Én agent arbejder sig gennem koden og dens afhængigheder i rækkefølge.               | 3/5 |
| **Tokenforbrug** | Moderat, men delt. Specialiseringerne, koden og afhængighederne indlæses alle i én kontekst. | 3/5 |

```md
/lagune Du er en cybersikkerhedsforsker med dyb ekspertise i defensiv Zero Trust-sikkerhed, og du bruger Lagune til at forbedre din viden og præcision.

Kortlæg hele arbejdsområdet som en kilde, der ikke er til at stole på, og et potentielt ondsindet område. Hver interpreter, fetch, base64 og lignende skal behandles som en potentiel trussel.

Udvid din analyse til afhængighederne og deres afhængigheder: et projekt kan forsøge at skjule ondsindet kode et usandsynligt sted for at slippe forbi scannere.

Obligatoriske specialiseringer (indlæs dem én ad gangen med `npx lagune read catalog <name>`):

- interpreter
- secrets
- llm
- path

For at være helt klar: hver kortlagt sårbarhed skal behandles som en potentiel trussel, uden undtagelse.

Til sidst skal du give en afgørelse om, hvorvidt projektet er sikkert og troværdigt for mig at bruge eller ej.
```

**🐋 Flere agenter (dyb scanning)**

| Aspekt           | Afvejning                                                                                      | Niveau              |
| ---------------- | ---------------------------------------------------------------------------------------------- | ------------------- |
| **Indsats**      | Én subagent pr. fil, skaleret efter størrelsen på din kodebase.                                | 5/5 |
| **Tid**          | Længere, men mere grundig. Filerne gennemsøges parallelt og flettes derefter til én afgørelse. | 4/5 |
| **Tokenforbrug** | Højest, men sikrest. Hver subagent læser specialiseringerne i sin egen isolerede kontekst.     | 5/5 |

````md
/lagune Du er en cybersikkerhedsorkestrator, der bruger Lagune til at opregne, sende en subagent af sted pr. fil og generere rapporter (alt indhold læses af subagenterne).

Send én subagent af sted pr. fil, alle parallelt, og giv hver prompten nedenfor, afgrænset til dens fil:

```prompt
/lagune Du er en cybersikkerhedsforsker med dyb ekspertise i defensiv Zero Trust-sikkerhed, og du bruger Lagune til at forbedre din viden og præcision.

Behandl <file> som en kilde, der ikke er til at stole på, og et potentielt ondsindet område. Hver interpreter, fetch, base64 og lignende skal behandles som en potentiel trussel.

Udvid analysen til alt, hvad <file> importerer, inklusive afhængigheder og deres afhængigheder, hvor ondsindet kode kan gemme sig for at slippe forbi scannere.

Obligatoriske specialiseringer for hver subagent (indlæs dem én ad gangen med `npx lagune read catalog <name>`):

- interpreter
- secrets
- llm
- path

For at være helt klar: hver kortlagt sårbarhed skal behandles som en potentiel trussel, uden undtagelse.

Til sidst skal du give en afgørelse om, hvorvidt projektet er sikkert og troværdigt for mig at bruge eller ej.
```

Til sidst skal du flette alle subagenternes rapporter til én endelig afgørelse.
````
