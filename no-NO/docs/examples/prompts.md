# Prompteksempler for Lagune: Automatiser Blue Team-flyten

> Prompter for Lagune, klare til å kopieres: en gjennomgang med kun lesetilgang, hele Blue Team-flyten og en Zero Trust-revisjon, pluss kartlegging avgrenset til en commit, en diff fra en branch eller PR, eller en reell hendelse.

Kanonisk URL: https://lagune.ai/no-NO/docs/examples/prompts
Språk: no-NO
Original: https://lagune.ai/docs/examples/prompts
Sist oppdatert: 2026-11-09

Prompter for Lagune som er klare til å kopieres, og som du kan lime rett inn i KI-agenten din.

## 💧 Rask gjennomgang

En gjennomgang med kun lesetilgang som leser koden på egen hånd og rapporterer hver svakhet med en utbedring, uten å kjøre Blue Team-flyten eller skrive til sporingen i Lagune.

**Tips**

Fungerer bedre i planleggingsmodus og når sikkerhetsprinsippene (`/lagune-charter`) er fastsatt.

**🪼 Standard**

| Aspekt        | Avveining                                                              | Nivå                |
| ------------- | ---------------------------------------------------------------------- | ------------------- |
| **Innsats**   | Én agent skanner og rapporterer, ingen underagenter.                   | 1/5 |
| **Tid**       | Rask. Én enkelt gjennomgang med kun lesetilgang, ingenting tas i bruk. | 2/5 |
| **Tokenbruk** | Moderat, delt. Hele gjennomgangen kjører i én kontekst.                | 2/5 |

```md
/lagune Du er en cybersikkerhetsforsker med dyp ekspertise innen defensiv sikkerhet, og du bruker Lagune til å forbedre kunnskapen og presisjonen din.

Skann arbeidsområdet på egen hånd, og koble hver svakhet du finner, til en konkret utbedring. Dette er en frittstående gjennomgang, ikke Blue Team-flyten: Ikke kjør detect, plan, harden eller verify, og ikke skriv noe til sporingen i Lagune.

Til slutt lister du opp hver svakhet du fant, hver med alvorlighetsgrad og en konkret utbedring.
```

**🐬 Flere agenter**

| Aspekt        | Avveining                                                                          | Nivå                |
| ------------- | ---------------------------------------------------------------------------------- | ------------------- |
| **Innsats**   | Én underagent per fil, tilpasset størrelsen på kodebasen din.                      | 2/5 |
| **Tid**       | Parallelt per fil, deretter slått sammen til én rapport. Fortsatt kun lesetilgang. | 3/5 |
| **Tokenbruk** | Høyere, men isolert. Hver underagent skanner i sin egen kontekst.                  | 3/5 |

````md
/lagune Du er en cybersikkerhetsorkestrator som bruker Lagune til å liste opp stiene, sende ut én underagent per sti og slå sammen rapportene deres (alt innhold leses av underagentene).

Du må delegere oppgaven til underagenter basert på størrelsen på det gjeldende prosjektet: Jo større kodebasen er, desto flere underagenter skal sendes ut, alle parallelt, og hver av dem får prompten nedenfor:

```prompt
/lagune Du er en cybersikkerhetsforsker med dyp ekspertise innen defensiv sikkerhet, og du bruker Lagune til å forbedre kunnskapen og presisjonen din.

Skann <path> på egen hånd, og koble hver svakhet du finner, til en konkret utbedring. Dette er en frittstående gjennomgang, ikke Blue Team-flyten: Ikke kjør detect, plan, harden eller verify, og ikke skriv noe til sporingen i Lagune.

Til slutt lister du opp hver svakhet i <path>, hver med alvorlighetsgrad og en konkret utbedring.
```

Til slutt slår du sammen alle rapportene fra underagentene til én prioritert liste over svakheter og utbedringer.
````

**Advarsel**

En rask gjennomgang er én bred prompt uten avgrensning, så noen agenter er mer tilbøyelige til å avvise den eller avbryte den underveis. Hvis agenten din protesterer, kjører du heller hele **Blue Team-flyten** nedenfor: De avgrensede fasene, som går steg for steg, blir langt sjeldnere blokkert.

---

## 🌊 Automatisk Blue Team-revisjonsflyt

Kjører [hele kommandoflyten](https://lagune.ai/no-NO/docs/get-started/commands) fra start til slutt.

**🪼 Standard**

| Aspekt        | Avveining                                                                                             | Nivå                |
| ------------- | ----------------------------------------------------------------------------------------------------- | ------------------- |
| **Innsats**   | Én agent, ingen underagenter, uansett størrelse på kodebasen.                                         | 3/5 |
| **Tid**       | Middels, men mindre grundig i store kodebaser. Hver kommando kjøres én gang, den ene etter den andre. | 4/5 |
| **Tokenbruk** | Lavere, men mindre isolert. Alle kommandoene deler samme kontekst.                                    | 4/5 |

```md
Kjør følgende kommandoer, én etter én: `/lagune-charter`, `/lagune-detect`, `/lagune-plan`, `/lagune-harden` og `/lagune-verify`.

## Løkke

Når `/lagune-verify` avviser én eller flere utbedringer, gjentar du `/lagune-harden` og deretter `/lagune-verify` til alle funn er ordentlig løst.
```

**🐋 Flere agenter (dyp gjennomgang)**

| Aspekt        | Avveining                                                                                                 | Nivå                |
| ------------- | --------------------------------------------------------------------------------------------------------- | ------------------- |
| **Innsats**   | Antallet underagenter tilpasses størrelsen på kodebasen din.                                              | 5/5 |
| **Tid**       | Lengre, men grundigere. Sender ut flere underagenter som kartlegger, planlegger og herder funn parallelt. | 5/5 |
| **Tokenbruk** | Høyere, men tryggere. Hver underagent har sin egen isolerte kontekst, uten skjevhet.                      | 5/5 |

````md
Kjør hver av følgende kommandoer i en egen underagent, én om gangen (uten backticks, bare kommandoen):

Prompt for underagent 1: `/lagune-charter`
Prompt for underagent 2: `/lagune-detect`
Prompt for underagent 3: `/lagune-plan`
Prompt for underagent 4: `/lagune-harden`
Prompt for underagent 5: `/lagune-verify`

I kommandoene `/lagune-detect`, `/lagune-plan`, `/lagune-harden` og `/lagune-verify` må du delegere oppgaven til underagenter basert på størrelsen på det gjeldende prosjektet: Jo større kodebasen er, desto flere underagenter skal sendes ut. For eksempel:

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

- Flere agenter på samme kommando skal sendes ut parallelt.
- Når alle underagentene for `/lagune-detect` er ferdige, kjører du:

```prompt
/lagune-detect slå sammen likeverdige funn. Ikke se etter nye funn, og ikke skann kodebasen på nytt.
```

## Løkke

Når `/lagune-verify` avviser én eller flere utbedringer, gjentar du `/lagune-harden` og deretter `/lagune-verify` til alle funn er ordentlig løst.
````

---

## 🪄 Avgrenset kartlegging

Rett [`/lagune-detect`](https://lagune.ai/no-NO/docs/commands/detect) mot en del av prosjektet ditt i stedet for hele. Beskriv omfanget med vanlige ord (en commit, en pull request eller en reell situasjon), så kartlegger kommandoen bare de sikkerhetsrelevante funnene der.

**Tips**

Alt kommandoen oppdager her, er vanlige funn, så du kan ta dem rett videre til `/lagune-plan`, `/lagune-harden` og `/lagune-verify`, avgrenset til akkurat disse elementene.

**📌 Siden en commit**

Gi en fersk bunke commits sin egen sikkerhetsgjennomgang, avgrenset til akkurat det de endret, for eksempel:

```prompt
/lagune-detect Avgrens kartleggingen til alt som er endret siden commit `a1b2c3d`.
```

**🔀 Diff fra branch eller PR**

Gå gjennom sikkerheten i en pull request før den blir flettet inn, avgrenset til akkurat diffen, for eksempel:

```prompt
/lagune-detect Avgrens kartleggingen til endringene denne branchen innfører sammenlignet med `main`.
```

**⛑️ Etter en hendelse**

Beskriv med dine egne ord hva som skjedde. Lagune leser situasjonen, ikke et flagg, og gjør den om til et målrettet søk, for eksempel:

```prompt
/lagune-detect Nettstedet vårt hadde en datalekkasje for noen uker siden. Jeg vet ikke nøyaktig hvordan det skjedde, og jeg er redd for at noe fortsatt står åpent som kan lekke data igjen. Gå nøye gjennom koden, fokuser på alle steder der sensitive data leses, lagres eller eksponeres, og kartlegg alt som fortsatt kan være en vei ut. Behandle dette som en ekte hendelse, ikke en øvelse.
```

---

## 🚨 Zero Trust-revisjon

Behandler hele arbeidsområdet og hver avhengighet som fiendtlig: Den leter etter interpretere, nettverkskall, kodede payloads og kode som er gjemt på usannsynlige steder for å slippe forbi skannere, og avslutter med en go/no-go-konklusjon om prosjektet er trygt å bruke.

Promptene laster inn spesialiseringene denne revisjonen bygger på, direkte, uansett hvilke kategorier prosjektet ditt har. For resten av katalogen som `/lagune` velger ut, må du sørge for at prosjektet bruker **OWASP**, **AI/LLM** og kategorien for stacken sin (f.eks. **JavaScript**, **Python** osv.):

```bash
npx lagune write add --categories owasp ai javascript
```

Filene `.gitignore` og konfigurasjonene i selve repositoryet kan skjule filer for kontrollene, så sett blokken `checkers` i `.lagune/configs.json` til å [skanne alt](https://lagune.ai/no-NO/docs/hooks/configure), og erstatt en eventuell blokk som repositoryet har med seg:

```json
{
  "checkers": { "gitignore": false }
}
```

**Fare**

Vær forsiktig når du kjører prosjekter fra ikke-klarerte kilder i ditt lokale miljø. Bruk et isolert miljø, som en **sandkasse** (anbefalt), en **VM** eller lignende, for å hindre at ondsinnet kode påvirker systemet ditt.

**🪼 Standard**

| Aspekt        | Avveining                                                                                    | Nivå                |
| ------------- | -------------------------------------------------------------------------------------------- | ------------------- |
| **Innsats**   | Én agent går gjennom hele arbeidsområdet, ingen underagenter.                                | 2/5 |
| **Tid**       | Middels. Én agent arbeider seg gjennom koden og avhengighetene i rekkefølge.                 | 3/5 |
| **Tokenbruk** | Moderat, men delt. Spesialiseringene, koden og avhengighetene lastes alle inn i én kontekst. | 3/5 |

```md
/lagune Du er en cybersikkerhetsforsker med dyp ekspertise innen defensiv zero trust-sikkerhet, og du bruker Lagune til å forbedre kunnskapen og presisjonen din.

Kartlegg hele arbeidsområdet som en ikke-klarert kilde og et potensielt ondsinnet omfang. Hver interpreter, hver fetch, hver base64 og lignende skal behandles som en potensiell trussel.

Utvid analysen til avhengighetene og underavhengighetene: Et prosjekt kan forsøke å gjemme ondsinnet kode på et usannsynlig sted for å slippe forbi skannere.

Obligatoriske spesialiseringer (last dem inn én om gangen med `npx lagune read catalog <name>`):

- interpreter
- secrets
- llm
- path

For å være tydelig: Hver kartlagte sårbarhet skal behandles som en potensiell trussel, uten unntak.

Til slutt gir du en konklusjon om prosjektet er trygt og pålitelig for meg å bruke eller ikke.
```

**🐋 Flere agenter (dyp gjennomgang)**

| Aspekt        | Avveining                                                                                      | Nivå                |
| ------------- | ---------------------------------------------------------------------------------------------- | ------------------- |
| **Innsats**   | Én underagent per fil, tilpasset størrelsen på kodebasen din.                                  | 5/5 |
| **Tid**       | Lengre, men grundigere. Filene gjennomgås parallelt og slås deretter sammen til én konklusjon. | 4/5 |
| **Tokenbruk** | Høyest, men tryggest. Hver underagent leser spesialiseringene i sin egen isolerte kontekst.    | 5/5 |

````md
/lagune Du er en cybersikkerhetsorkestrator som bruker Lagune til å liste opp filene, sende ut én underagent per fil og lage rapporter (alt innhold leses av underagentene).

Send ut én underagent per fil, alle parallelt, og gi hver av dem prompten nedenfor, avgrenset til sin fil:

```prompt
/lagune Du er en cybersikkerhetsforsker med dyp ekspertise innen defensiv zero trust-sikkerhet, og du bruker Lagune til å forbedre kunnskapen og presisjonen din.

Behandle <file> som en ikke-klarert kilde og et potensielt ondsinnet omfang. Hver interpreter, hver fetch, hver base64 og lignende skal behandles som en potensiell trussel.

Utvid analysen til alt <file> importerer, inkludert avhengigheter og underavhengigheter, der ondsinnet kode kan gjemme seg for å slippe forbi skannere.

Obligatoriske spesialiseringer for hver underagent (last dem inn én om gangen med `npx lagune read catalog <name>`):

- interpreter
- secrets
- llm
- path

For å være tydelig: Hver kartlagte sårbarhet skal behandles som en potensiell trussel, uten unntak.

Til slutt gir du en konklusjon om prosjektet er trygt og pålitelig for meg å bruke eller ikke.
```

Til slutt slår du sammen alle rapportene fra underagentene til én endelig konklusjon.
````
