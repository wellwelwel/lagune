# Hook agent: Oppdag agentløkker uten grense

> Skann en kodebase for agent- og LLM-kall uten grense for steg eller tid, eller vurder ett enkelt kall, rett fra kommandolinjen.

Kanonisk URL: https://lagune.ai/no-NO/docs/hooks/agent
Språk: no-NO
Original: https://lagune.ai/docs/hooks/agent
Sist oppdatert: 2026-11-09

Hooken `agent` flagger **agentkjøretider som går i løkke uten grense for runder, budsjett eller tid**, hullet for løpsk autonomi som gjør en manipulert inndata om til ubegrensede kostnader eller eskalering via prompt injection. Den er **språkbevisst** og dekker de to økosystemene for agentrammeverk: **JavaScript** (kjøretiden `query` i agent-SDK-en til **Claude**) og **Python** (**LangChain**, **LangGraph**, **CrewAI**, **OpenAI Agents**). Den er den deterministiske motoren bak [spesialiseringen `llm`](https://lagune.ai/no-NO/docs/catalog), som du kan kjøre selv i modusen **scan** eller **check**.

## Kjør

**Skann kodebasen**

```bash
npx lagune read agent                # scans the whole project
npx lagune read agent --dir src/ai   # scans a directory
npx lagune read agent --file chat.ts # scans a single file
```

**Sjekk et kall**

```bash
npx lagune read agent --lang javascript --pattern 'query({ prompt })'                           # => uncapped
npx lagune read agent --lang javascript --pattern 'query({ prompt, options: { maxTurns: 5 } })' # => safe
npx lagune read agent --lang python --pattern 'AgentExecutor(agent=a, max_iterations=None)'     # => uncapped
```

Hver linje under **Uncapped agent loops found** er, i en fil som importerer en agent-SDK, enten et kall til kjøretiden `query` i agent-SDK-en til Claude uten grense for runder, budsjett eller tid (JavaScript, ubegrenset som standard), eller en eksplisitt fjerning av standardgrensen i et rammeverk, for eksempel `max_iterations=None` / `max_turns=None` (Python, begrenset som standard). Begge avslutter med en kode som ikke er null. I Vercel AI SDK bruker `generateText`/`streamText` ett enkelt steg som standard (`stopWhen: stepCountIs(1)`), så et kall uten innstillinger der kan ikke gå i løkke og flagges ikke, og et vanlig `db.query(...)` forveksles aldri med et agentkall. En gjennomgang uten funn skriver ut `no uncapped agent loops found`.

## Slik leser du konklusjonen

| Konklusjon | Betydning                                                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `uncapped` | Et kall til kjøretiden `query` uten grense (JS), eller en eksplisitt fjerning av grensen (`=None`, Py).                             |
| `safe`     | Et kall til `query` som setter en grense, en generering med ett enkelt steg, eller et rammeverkskall som er begrenset som standard. |
| `invalid`  | Kodeutdraget inneholder ikke noe gjenkjennelig agentkall å vurdere.                                                                 |

### CLI-alternativer

| Alternativ  | Verdi         | Beskrivelse                                                                      |
| ----------- | ------------- | -------------------------------------------------------------------------------- |
| `--pattern` | et kodeutdrag | Sjekk ett kall. Gjenta for å sjekke flere, én konklusjon per linje.              |
| `--lang`    | et språk      | Påkrevd med `--pattern`: `javascript` eller `python`.                            |
| `--dir`     | en mappe      | Avgrens en gjennomgang til en mappe. Kan gjentas og kombineres med `--file`.     |
| `--file`    | en fil        | Avgrens en gjennomgang til én enkelt fil. Kan gjentas og kombineres med `--dir`. |

Uten alternativ skanner den hele prosjektet. `--pattern` krever `--lang` og kan ikke kombineres med `--dir` eller `--file`.

### Velg hva den skanner

Den utelater det **Git** ignorerer. For å utelate mer, eller for å skanne det **Git** ignorerer, gi `agent` egne innstillinger:

```bash
npx lagune write add --ignore test/fixtures --checker agent
```

```json
{
  "checkers": {
    "agent": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Konfigurer hookene](https://lagune.ai/no-NO/docs/hooks/configure) beskriver hver innstilling.

**Etter beste evne, ikke uttømmende**

En egenutviklet agentløkke, i et hvilket som helst språk, er utenfor rekkevidden til en statisk gjennomgang. Se på dette som et solid minimum, ikke en fullstendig oversikt.

**Tips**

Hooken avgjør bare grensen: avgrensning av hva agenten kan gjøre, blanding av tillitsnivåer og autorisasjon er skjønnsvurderinger som [spesialiseringen `llm`](https://lagune.ai/no-NO/docs/catalog) fortsatt dekker.

## Vanlige spørsmål

### Hvorfor bør en agentløkke ha en grense?

En agent uten grense kan drives inn i ubegrenset rekursjon, ubegrensede kostnader eller eskalering via prompt injection. Å sette maxTurns/maxBudgetUsd/stopWhen/signal begrenser den, og hooken agent flagger et kall til kjøretiden query som ikke setter noen av dem.
