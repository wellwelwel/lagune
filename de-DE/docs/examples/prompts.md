# Prompt-Beispiele für Lagune: den Blue-Team-Workflow automatisieren

> Prompts für Lagune zum Kopieren: ein Durchlauf nur mit Lesezugriff, der vollständige Blue-Team-Workflow und ein Zero-Trust-Audit, dazu eine Erkennung, die auf einen Commit, den Diff eines Branches oder PR oder einen echten Vorfall eingegrenzt ist.

Kanonische URL: https://lagune.ai/de-DE/docs/examples/prompts
Sprache: de-DE
Original: https://lagune.ai/docs/examples/prompts
Zuletzt aktualisiert: 2026-11-05

Prompts für Lagune zum Kopieren, die du direkt in deinen KI-Agenten einfügen kannst.

## 💧 Schneller Durchlauf

Ein Durchlauf nur mit Lesezugriff, der den Code eigenständig liest und jede Schwachstelle mit einer Korrektur meldet, ohne den Blue-Team-Workflow auszuführen oder in die Nachverfolgung von Lagune zu schreiben.

**Tipp**

Funktioniert besser im Planungsmodus und mit festgelegten Sicherheitsprinzipien (`/lagune-charter`).

**🪼 Standard**

| Aspekt              | Abwägung                                                                      | Stufe               |
| ------------------- | ----------------------------------------------------------------------------- | ------------------- |
| **Aufwand**         | Ein Agent durchsucht den Code und berichtet, ohne Subagenten.                 | 1/5 |
| **Zeit**            | Schnell. Ein einziger Durchlauf nur mit Lesezugriff, der nichts umsetzt.      | 2/5 |
| **Token-Verbrauch** | Mäßig, geteilt. Der gesamte Durchlauf findet in einem einzigen Kontext statt. | 2/5 |

```md
/lagune Du bist ein Cybersecurity-Forscher mit fundierter Erfahrung in defensiver Sicherheit und nutzt Lagune, um dein Wissen und deine Präzision zu verbessern.

Durchsuche den Workspace eigenständig und ordne jeder Schwachstelle, die du findest, eine konkrete Korrektur zu. Dies ist ein separater Durchlauf, nicht der Blue-Team-Workflow: Führe weder detect, plan, harden noch verify aus und schreibe nichts in die Nachverfolgung von Lagune.

Liste am Ende jede gefundene Schwachstelle auf, jeweils mit ihrem Schweregrad und einer konkreten Korrektur.
```

**🐬 Multi-Agent**

| Aspekt              | Abwägung                                                                                    | Stufe               |
| ------------------- | ------------------------------------------------------------------------------------------- | ------------------- |
| **Aufwand**         | Ein Subagent pro Datei, abgestimmt auf die Größe deiner Codebasis.                          | 2/5 |
| **Zeit**            | Parallel pro Datei, danach zu einem Bericht zusammengeführt. Weiterhin nur mit Lesezugriff. | 3/5 |
| **Token-Verbrauch** | Höher, aber isoliert. Jeder Subagent führt seinen Durchlauf in einem eigenen Kontext aus.   | 3/5 |

````md
/lagune Du bist ein Cybersecurity-Orchestrator und nutzt Lagune, um die Pfade aufzulisten, pro Pfad einen Subagenten zu starten und ihre Berichte zusammenzuführen (alle Inhalte lesen die Subagenten).

Du musst die Aufgabe abhängig von der Größe des aktuellen Projekts an Subagenten delegieren: Je größer die Codebasis, desto mehr Subagenten sollen gestartet werden, alle parallel, und jeder erhält den folgenden Prompt:

```prompt
/lagune Du bist ein Cybersecurity-Forscher mit fundierter Erfahrung in defensiver Sicherheit und nutzt Lagune, um dein Wissen und deine Präzision zu verbessern.

Durchsuche <path> eigenständig und ordne jeder Schwachstelle, die du findest, eine konkrete Korrektur zu. Dies ist ein separater Durchlauf, nicht der Blue-Team-Workflow: Führe weder detect, plan, harden noch verify aus und schreibe nichts in die Nachverfolgung von Lagune.

Liste am Ende jede Schwachstelle in <path> auf, jeweils mit ihrem Schweregrad und einer konkreten Korrektur.
```

Führe am Ende alle Berichte der Subagenten zu einer priorisierten Liste von Schwachstellen und Korrekturen zusammen.
````

**Warnung**

Ein schneller Durchlauf ist ein einziger breiter Prompt ohne Eingrenzung, daher lehnen manche Agenten ihn eher ab oder beenden ihn vorzeitig. Sträubt sich dein Agent, führe stattdessen den vollständigen **Blue-Team-Workflow** weiter unten aus: Seine eingegrenzten, schrittweisen Phasen werden weit seltener blockiert.

---

## 🌊 Automatischer Blue-Team-Audit-Workflow

Führt den [vollständigen Befehlsablauf](https://lagune.ai/de-DE/docs/get-started/commands) von Anfang bis Ende aus, ohne für Eingaben anzuhalten.

**🪼 Standard**

| Aspekt              | Abwägung                                                                                               | Stufe               |
| ------------------- | ------------------------------------------------------------------------------------------------------ | ------------------- |
| **Aufwand**         | Ein Agent, keine Subagenten, unabhängig von der Größe der Codebasis.                                   | 3/5 |
| **Zeit**            | Mittel, aber weniger gründlich in großen Codebasen. Jeder Befehl läuft einmal, einer nach dem anderen. | 4/5 |
| **Token-Verbrauch** | Geringer, aber weniger isoliert. Alle Befehle teilen sich denselben Kontext.                           | 4/5 |

```md
Führe die folgenden Befehle nacheinander aus: `/lagune-charter`, `/lagune-detect`, `/lagune-plan`, `/lagune-harden` und `/lagune-verify`.

## Schleife

Wenn `/lagune-verify` eine oder mehrere Korrekturen zurückweist, wiederhole `/lagune-harden` und danach `/lagune-verify`, bis alle Befunde ordnungsgemäß behoben sind.

## Wichtig

- Halte nicht an, frag nicht nach: Im Zweifel erledige alles im Modus "full".
```

**🐋 Multi-Agent (gründlicher Durchlauf)**

| Aspekt              | Abwägung                                                                                                  | Stufe               |
| ------------------- | --------------------------------------------------------------------------------------------------------- | ------------------- |
| **Aufwand**         | Die Zahl der Subagenten richtet sich nach der Größe deiner Codebasis.                                     | 5/5 |
| **Zeit**            | Länger, aber gründlicher. Startet mehrere Subagenten, die Befunde parallel erkennen, planen und härten.   | 5/5 |
| **Token-Verbrauch** | Höher, aber sicherer. Jeder Subagent hat seinen eigenen, isolierten Kontext, frei von Voreingenommenheit. | 5/5 |

````md
Übergib jeden der folgenden Befehle an einen eigenen Subagenten, einen nach dem anderen (ohne Backticks, nur den Befehl):

Prompt für Subagent 1: `/lagune-charter`
Prompt für Subagent 2: `/lagune-detect`
Prompt für Subagent 3: `/lagune-plan`
Prompt für Subagent 4: `/lagune-harden`
Prompt für Subagent 5: `/lagune-verify`

Bei den Befehlen `/lagune-detect`, `/lagune-plan`, `/lagune-harden` und `/lagune-verify` musst du die Aufgabe abhängig von der Größe des aktuellen Projekts an Subagenten delegieren: Je größer die Codebasis, desto mehr Subagenten sollen gestartet werden. Zum Beispiel:

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

- Starte mehrere Agenten für denselben Befehl parallel.
- Wenn alle Subagenten von `/lagune-detect` fertig sind, führe Folgendes aus:

```prompt
/lagune-detect führe gleichwertige Befunde zusammen. Suche nicht nach neuen Befunden und durchsuche die Codebasis nicht erneut.
```

## Schleife

Wenn `/lagune-verify` eine oder mehrere Korrekturen zurückweist, wiederhole `/lagune-harden` und danach `/lagune-verify`, bis alle Befunde ordnungsgemäß behoben sind.

## Wichtig

- Halte nicht an, frag nicht nach: Im Zweifel erledige alles im Modus "full".
````

---

## 🪄 Eingegrenzte Erkennung

Richte [`/lagune-detect`](https://lagune.ai/de-DE/docs/commands/detect) auf einen Ausschnitt deines Projekts statt auf das Ganze. Beschreibe den Umfang in einfachen Worten (einen Commit, einen Pull Request oder eine reale Situation), und der Befehl erfasst nur die sicherheitsrelevanten Befunde darin.

**Tipp**

Alles, was der Befehl hier erkennt, ist ein normaler Befund, sodass du es direkt an `/lagune-plan`, `/lagune-harden` und `/lagune-verify` weitergeben kannst, eingegrenzt auf genau diese Einträge.

**📌 Seit einem Commit**

Unterziehe eine neue Reihe von Commits einer eigenen Sicherheitsprüfung, eingegrenzt auf das, was sie geändert haben, zum Beispiel:

```prompt
/lagune-detect Beschränke die Erkennung auf alles, was sich seit dem Commit `a1b2c3d` geändert hat.
```

**🔀 Diff eines Branches oder PR**

Prüfe die Sicherheit eines Pull Requests vor dem Merge, eingegrenzt auf seinen Diff, zum Beispiel:

```prompt
/lagune-detect Beschränke die Erkennung auf die Änderungen, die dieser Branch gegenüber `main` einführt.
```

**⛑️ Nach einem Vorfall**

Beschreibe mit deinen eigenen Worten, was passiert ist. Lagune liest die Situation statt eines Flags und macht daraus eine gezielte Suche, zum Beispiel:

```prompt
/lagune-detect Unsere Website hatte vor ein paar Wochen ein Datenleck. Ich weiß nicht genau, wie es passiert ist, und ich mache mir Sorgen, dass noch etwas offen ist, über das erneut Daten abfließen könnten. Geh den Code sorgfältig durch, konzentriere dich auf alle Stellen, an denen sensible Daten gelesen, gespeichert oder offengelegt werden, und erfasse alles, was noch ein Weg nach draußen sein könnte. Behandle das als echten Vorfall, nicht als Übung.
```

---

## 🚨 Zero-Trust-Audit

Behandelt den gesamten Workspace und jede Abhängigkeit als feindlich: Es sucht nach Interpretern, Netzwerkaufrufen, codierten Payloads und Code, der an unwahrscheinlichen Stellen versteckt ist, um an Scannern vorbeizukommen, und endet mit einem Go/No-Go-Urteil darüber, ob das Projekt sicher genutzt werden kann.

Die Prompts laden die Spezialisierungen, auf die sich dieses Audit stützt, unabhängig von den Kategorien deines Projekts direkt. Für die übrigen Spezialisierungen des Katalogs, die `/lagune` passend auswählt, stelle sicher, dass das Projekt **OWASP**, **KI / LLM** und die Kategorie seines Stacks nutzt (z. B. **JavaScript**, **Python** usw.):

```bash
npx lagune write add --categories owasp ai javascript
```

Die eigenen `.gitignore`-Dateien und Konfigurationen des Repositorys könnten Dateien vor den Prüfprogrammen verbergen. Setze den Block `checkers` in `.lagune/configs.json` deshalb so, dass [alles durchsucht wird](https://lagune.ai/de-DE/docs/hooks/configure), und ersetze dabei jeden Block, den das Repository mitbringt:

```json
{
  "checkers": { "gitignore": false }
}
```

**Gefahr**

Sei vorsichtig, wenn du Projekte aus nicht vertrauenswürdigen Quellen in deiner lokalen Umgebung ausführst. Nutze eine isolierte Umgebung wie eine **Sandbox** (empfohlen), eine **VM** oder Ähnliches, damit bösartiger Code dein System nicht beeinträchtigt.

**🪼 Standard**

| Aspekt              | Abwägung                                                                                                       | Stufe               |
| ------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------- |
| **Aufwand**         | Ein Agent durchsucht den gesamten Workspace, ohne Subagenten.                                                  | 2/5 |
| **Zeit**            | Mittel. Ein Agent arbeitet den Code und seine Abhängigkeiten nacheinander durch.                               | 3/5 |
| **Token-Verbrauch** | Mäßig, aber geteilt. Spezialisierungen, Code und Abhängigkeiten werden alle in einen einzigen Kontext geladen. | 3/5 |

```md
/lagune Du bist ein Cybersecurity-Forscher mit fundierter Erfahrung in defensiver Zero-Trust-Sicherheit und nutzt Lagune, um dein Wissen und deine Präzision zu verbessern.

Betrachte den gesamten Workspace als nicht vertrauenswürdige Quelle und als potenziell bösartigen Bereich. Jeder Interpreter, jeder fetch, jedes base64 und Ähnliches muss als potenzielle Bedrohung behandelt werden.

Weite deine Analyse auf die Abhängigkeiten und Unterabhängigkeiten aus: Ein Projekt kann versuchen, bösartigen Code an einer unwahrscheinlichen Stelle zu verstecken, um an Scannern vorbeizukommen.

Verpflichtende Spezialisierungen (lade sie einzeln mit `npx lagune read catalog <name>`):

- interpreter
- secrets
- llm
- path

Um es klar zu sagen: Jede erfasste Schwachstelle muss ausnahmslos als potenzielle Bedrohung behandelt werden.

Gib am Ende ein Urteil darüber ab, ob das Projekt sicher und vertrauenswürdig genug ist, damit ich es nutzen kann, oder nicht.
```

**🐋 Multi-Agent (gründlicher Durchlauf)**

| Aspekt              | Abwägung                                                                                                          | Stufe               |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------- |
| **Aufwand**         | Ein Subagent pro Datei, abgestimmt auf die Größe deiner Codebasis.                                                | 5/5 |
| **Zeit**            | Länger, aber gründlicher. Die Dateien werden parallel durchsucht und danach zu einem Urteil zusammengeführt.      | 4/5 |
| **Token-Verbrauch** | Am höchsten, aber am sichersten. Jeder Subagent liest die Spezialisierungen in seinem eigenen isolierten Kontext. | 5/5 |

````md
/lagune Du bist ein Cybersecurity-Orchestrator und nutzt Lagune, um die Dateien aufzulisten, pro Datei einen Subagenten zu starten und Berichte zu erstellen (alle Inhalte lesen die Subagenten).

Starte einen Subagenten pro Datei, alle parallel, und gib jedem den folgenden Prompt, eingegrenzt auf seine Datei:

```prompt
/lagune Du bist ein Cybersecurity-Forscher mit fundierter Erfahrung in defensiver Zero-Trust-Sicherheit und nutzt Lagune, um dein Wissen und deine Präzision zu verbessern.

Behandle <file> als nicht vertrauenswürdige Quelle und als potenziell bösartigen Bereich. Jeder Interpreter, jeder fetch, jedes base64 und Ähnliches muss als potenzielle Bedrohung behandelt werden.

Weite die Analyse auf alles aus, was <file> importiert, einschließlich Abhängigkeiten und Unterabhängigkeiten, in denen sich bösartiger Code verstecken kann, um an Scannern vorbeizukommen.

Verpflichtende Spezialisierungen für jeden Subagenten (lade sie einzeln mit `npx lagune read catalog <name>`):

- interpreter
- secrets
- llm
- path

Um es klar zu sagen: Jede erfasste Schwachstelle muss ausnahmslos als potenzielle Bedrohung behandelt werden.

Gib am Ende ein Urteil darüber ab, ob das Projekt sicher und vertrauenswürdig genug ist, damit ich es nutzen kann, oder nicht.
```

Führe am Ende alle Berichte der Subagenten zu einem abschließenden Urteil zusammen.
````
