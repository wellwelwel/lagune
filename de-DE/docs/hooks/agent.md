# Hook agent: unbegrenzte Agentenschleifen erkennen

> Durchsuche eine Codebasis nach Agenten- und LLM-Aufrufen ohne Schritt- oder Zeitlimit, oder bewerte einen einzelnen Aufruf, direkt über die Kommandozeile.

Kanonische URL: https://lagune.ai/de-DE/docs/hooks/agent
Sprache: de-DE
Original: https://lagune.ai/docs/hooks/agent
Zuletzt aktualisiert: 2026-11-04

Der Hook `agent` meldet **Agent-Runtimes, die ohne Runden-, Budget- oder Zeitlimit in einer Schleife laufen**, die Lücke einer entfesselten Autonomie, durch die eine manipulierte Eingabe unbegrenzte Kosten oder eine Eskalation per Prompt Injection auslöst. Er arbeitet **sprachspezifisch** und deckt die zwei Ökosysteme der Agent-Frameworks ab: **JavaScript** (die Runtime `query` des Agent-SDK von **Claude**) und **Python** (**LangChain**, **LangGraph**, **CrewAI**, **OpenAI Agents**). Er ist die deterministische Engine hinter der [Spezialisierung `llm`](https://lagune.ai/de-DE/docs/catalog), und du kannst ihn selbst im Modus **scan** oder **check** ausführen.

## Ausführen

**Codebasis durchsuchen**

```bash
npx lagune read agent                # scans the whole project
npx lagune read agent --dir src/ai   # scans a directory
npx lagune read agent --file chat.ts # scans a single file
```

**Aufruf prüfen**

```bash
npx lagune read agent --lang javascript --pattern 'query({ prompt })'                           # => uncapped
npx lagune read agent --lang javascript --pattern 'query({ prompt, options: { maxTurns: 5 } })' # => safe
npx lagune read agent --lang python --pattern 'AgentExecutor(agent=a, max_iterations=None)'     # => uncapped
```

Jede Zeile unter **Uncapped agent loops found** steht in einer Datei, die ein Agent-SDK importiert, und ist entweder ein Aufruf der Runtime `query` des Agent-SDK von Claude ohne Runden-, Budget- oder Zeitlimit (JavaScript, standardmäßig unbegrenzt) oder die ausdrückliche Aufhebung des Standardlimits eines Frameworks, etwa `max_iterations=None` / `max_turns=None` (Python, standardmäßig begrenzt). In beiden Fällen endet der Hook mit einem Exit-Code ungleich null. Im Vercel AI SDK arbeiten `generateText`/`streamText` standardmäßig mit einem einzigen Schritt (`stopWhen: stepCountIs(1)`), daher kann ein bloßer Aufruf dort keine Schleife bilden und wird nicht gemeldet, und ein gewöhnliches `db.query(...)` hält er nie für einen Agent-Aufruf. Findet er nichts, gibt er `no uncapped agent loops found` aus.

## So liest du das Urteil

| Urteil     | Bedeutung                                                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uncapped` | Ein Aufruf der Runtime `query` ohne Limit (JS) oder die ausdrückliche Aufhebung eines Limits (`=None`, Py).                                         |
| `safe`     | Ein Aufruf von `query`, der ein Limit setzt, eine Generierung mit einem einzigen Schritt oder ein Framework-Aufruf, der standardmäßig begrenzt ist. |
| `invalid`  | Der Codeausschnitt enthält keinen erkennbaren Agent-Aufruf, den er beurteilen könnte.                                                               |

### CLI-Optionen

| Option      | Wert               | Beschreibung                                                                                 |
| ----------- | ------------------ | -------------------------------------------------------------------------------------------- |
| `--pattern` | ein Codeausschnitt | Prüft einen Aufruf. Wiederhole die Option, um mehrere zu prüfen, ein Urteil pro Zeile.       |
| `--lang`    | eine Sprache       | Erforderlich bei `--pattern`: `javascript` oder `python`.                                    |
| `--dir`     | ein Verzeichnis    | Beschränkt den Durchlauf auf ein Verzeichnis. Wiederholbar und mit `--file` kombinierbar.    |
| `--file`    | eine Datei         | Beschränkt den Durchlauf auf eine einzelne Datei. Wiederholbar und mit `--dir` kombinierbar. |

Ohne Option durchsucht er das gesamte Projekt. `--pattern` erfordert `--lang` und lässt sich nicht mit `--dir` oder `--file` kombinieren.

### Festlegen, was er durchsucht

Er lässt aus, was **Git** ignoriert. Wenn du mehr auslassen oder auch durchsuchen willst, was **Git** ignoriert, gib `agent` eigene Einstellungen:

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

[Hooks konfigurieren](https://lagune.ai/de-DE/docs/hooks/configure) beschreibt jede Einstellung.

**Bestmöglich, aber nicht lückenlos**

Eine selbst gebaute Agentenschleife entzieht sich in jeder Sprache einem statischen Durchlauf. Betrachte das Ergebnis als solide Untergrenze, nicht als vollständige Bestandsaufnahme.

**Tipp**

Der Hook entscheidet nur über das Limit: Der Zuschnitt der Fähigkeiten, die Vermischung von Vertrauensstufen und die Autorisierung bleiben Ermessensfragen, die die [Spezialisierung `llm`](https://lagune.ai/de-DE/docs/catalog) abdeckt.

## Häufige Fragen

### Warum sollte ich die Schleife eines Agenten begrenzen?

Einen unbegrenzten Agenten kann man in endlose Rekursion, unbegrenzte Kosten oder eine Eskalation per Prompt Injection treiben. Setzt du maxTurns/maxBudgetUsd/stopWhen/signal, ist er begrenzt, und der Hook agent meldet jeden Aufruf der Runtime query, der keine dieser Grenzen setzt.
