# Hook agent: find agentløkker uden loft

> Gennemsøg en kodebase for agent- og LLM-kald uden loft over trin eller tid, eller vurdér et enkelt kald, fra kommandolinjen.

Kanonisk URL: https://lagune.ai/da-DK/docs/hooks/agent
Sprog: da-DK
Original: https://lagune.ai/docs/hooks/agent
Sidst opdateret: 2026-11-09

Hooken `agent` markerer **agent-runtimes, der kører i løkke uden loft over ture, budget eller tid**, det hul i form af løbsk autonomi, der gør et manipuleret input til ubegrænsede omkostninger eller eskalering via prompt injection. Den er **sprogbevidst** og dækker de to økosystemer af agent-frameworks: **JavaScript** (runtimen `query` i agent-SDK'et fra **Claude**) og **Python** (**LangChain**, **LangGraph**, **CrewAI**, **OpenAI Agents**). Den er den deterministiske motor bag [specialiseringen `llm`](https://lagune.ai/da-DK/docs/catalog), som du selv kan køre i tilstanden **scan** eller **check**.

## Kørsel

**Scan kodebasen**

```bash
npx lagune read agent                # scans the whole project
npx lagune read agent --dir src/ai   # scans a directory
npx lagune read agent --file chat.ts # scans a single file
```

**Tjek et kald**

```bash
npx lagune read agent --lang javascript --pattern 'query({ prompt })'                           # => uncapped
npx lagune read agent --lang javascript --pattern 'query({ prompt, options: { maxTurns: 5 } })' # => safe
npx lagune read agent --lang python --pattern 'AgentExecutor(agent=a, max_iterations=None)'     # => uncapped
```

Hver linje under **Uncapped agent loops found** er, i en fil, der importerer et agent-SDK, enten runtimen `query` fra agent-SDK'et til Claude kaldt uden loft over ture, budget eller tid (JavaScript, ubegrænset som standard), eller en udtrykkelig fjernelse af et frameworks standardloft såsom `max_iterations=None` / `max_turns=None` (Python, med loft som standard). Begge afslutter med en kode forskellig fra nul. `generateText`/`streamText` i Vercel AI SDK bruger som standard et enkelt trin (`stopWhen: stepCountIs(1)`), så et bart kald dér kan ikke køre i løkke og bliver ikke markeret, og et almindeligt `db.query(...)` forveksles aldrig med et agentkald. En ren kørsel udskriver `no uncapped agent loops found`.

## Sådan læser du afgørelsen

| Afgørelse  | Betydning                                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| `uncapped` | Et kald til runtimen `query` uden loft (JS), eller en udtrykkelig fjernelse af loftet (`=None`, Py).                   |
| `safe`     | Et kald til `query`, der sætter et loft, en generering i ét trin eller et kald til et framework med loft som standard. |
| `invalid`  | Kodeuddraget indeholder intet genkendeligt agentkald at vurdere.                                                       |

### CLI-indstillinger

| Indstilling | Værdi         | Beskrivelse                                                                    |
| ----------- | ------------- | ------------------------------------------------------------------------------ |
| `--pattern` | et kodeuddrag | Tjek ét kald. Gentag for at tjekke flere, én afgørelse pr. linje.              |
| `--lang`    | et sprog      | Påkrævet med `--pattern`: `javascript` eller `python`.                         |
| `--dir`     | en mappe      | Afgræns en scanning til en mappe. Kan gentages og kombineres med `--file`.     |
| `--file`    | en fil        | Afgræns en scanning til en enkelt fil. Kan gentages og kombineres med `--dir`. |

Uden indstillinger scanner den hele projektet. `--pattern` kræver `--lang` og kan ikke kombineres med `--dir` eller `--file`.

### Vælg, hvad den scanner

Den udelader det, **Git** ignorerer. For at udelade mere, eller for at scanne det, **Git** ignorerer, så giv `agent` sine egne indstillinger:

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

[Konfigurér hooks](https://lagune.ai/da-DK/docs/hooks/configure) beskriver alle indstillinger.

**Efter bedste evne, ikke udtømmende**

En håndskrevet agentløkke, i et hvilket som helst sprog, ligger uden for en statisk scanning. Betragt dette som et solidt minimum, ikke en komplet oversigt.

**Tip**

Hooken afgør kun loftet: afgrænsning af kapabiliteter, sammenblanding af tillid og autorisation er vurderinger, som [specialiseringen `llm`](https://lagune.ai/da-DK/docs/catalog) stadig dækker.

## Ofte stillede spørgsmål

### Hvorfor sætte et loft over en agentløkke?

En agent uden loft kan drives ud i ubegrænset rekursion, ubegrænsede omkostninger eller eskalering via prompt injection. Ved at sætte maxTurns/maxBudgetUsd/stopWhen/signal begrænses den, og hooken agent markerer et kald til runtimen query, der ikke sætter nogen af dem.
