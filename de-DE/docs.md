# Installation: Sicherheitshärtung für jeden KI-Agenten

> Installiere Lagune in jedem Projekt, als Plugin, wo dein Agent eines unterstützt, sonst mit der CLI von skills, und wähle dann die Sicherheitsspezialisierungen, die dazu passen.

Kanonische URL: https://lagune.ai/de-DE/docs
Sprache: de-DE
Original: https://lagune.ai/docs
Zuletzt aktualisiert: 2026-11-05

**Lagune** hilft deinem KI-Agenten, ein Projekt sicherer zu machen. Du setzt es auf deinen Code an, und der Agent findet heraus, was dein System tatsächlich tut, und führt dich dann durch die Sicherheitsarbeit, die dafür zählt. **Lagune** ist das erste Projekt der Methodik [Security-Driven Hardening (SDH)](https://lagune.ai/de-DE/docs/references/paper).

**Open Source unterstützen**

Gefällt dir **Lagune**? [Gib uns einen ⭐ auf **GitHub**](https://github.com/wellwelwel/lagune)

## Wähle deinen Agenten

- [Claude Code](https://lagune.ai/de-DE/docs/install/claude-code): Das agentische Coding-Tool von Anthropic
- [Codex](https://lagune.ai/de-DE/docs/install/codex): Der Coding-Agent von OpenAI
- [Cursor](https://lagune.ai/de-DE/docs/install/cursor): Der Code-Editor mit KI
- [GitHub Copilot](https://lagune.ai/de-DE/docs/install/github-copilot-cli): Der KI-Pair-Programmer von GitHub
- [Gemini CLI](https://lagune.ai/de-DE/docs/install/gemini-cli): Der Open-Source-Agent für das Terminal von Google
- [Antigravity](https://lagune.ai/de-DE/docs/install/antigravity-cli): Die agentische Entwicklungsplattform von Google
- [OpenCode](https://lagune.ai/de-DE/docs/install/opencode): Der Open-Source-Coding-Agent
- [Devin for Terminal](https://lagune.ai/de-DE/docs/install/devin-cli): Der Terminal-Agent von Cognition
- [Factory Droid](https://lagune.ai/de-DE/docs/install/factory-droid): Der Agent für Softwareentwicklung von Factory
- [Grok Build](https://lagune.ai/de-DE/docs/install/grok-build): Der Coding-Agent von xAI
- [Qwen Code](https://lagune.ai/de-DE/docs/install/qwen-code): Der Coding-Agent für das Terminal von Qwen
- [Kimi Code](https://lagune.ai/de-DE/docs/install/kimi-code): Der Coding-Agent von Moonshot AI
- [Muse Code](https://lagune.ai/de-DE/docs/install/muse-code): Der Coding-Agent von Meta
- [Pi](https://lagune.ai/de-DE/docs/install/pi): Ein minimalistischer Coding-Agent für das Terminal
- [Hermes Agent](https://lagune.ai/de-DE/docs/install/hermes-agent): Der Open-Source-Agent von Nous Research
- [Universell](https://lagune.ai/de-DE/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed und 66 weitere

**Info**

- **Lagune** läuft unter der Haube mit **Node.js**, aber du arbeitest in der Sprache deiner Wahl.
- Um **Lagune** komplett offline auszuführen, installiere es mit `npm i -D lagune@0.18.0` in deinem Projekt.

## Kategorien

Das Sicherheitswissen von **Lagune** steckt in [**Spezialisierungen**](https://lagune.ai/de-DE/docs/catalog), gruppiert in [**Kategorien**](https://lagune.ai/de-DE/docs/categories).

- **OWASP** (`owasp`): Härte deine Anwendungen gegen die Sicherheitsrisiken, die OWASP aufführt: Injection, mangelhafte Zugriffskontrolle sowie Fehler bei Authentifizierung und Kryptografie
- **Infrastruktur** (`infra`): Härte die Konfiguration von Containern, Workloads und Serverless: Dockerfile, Compose, Pod-Sicherheit, IAM und Trigger von FaaS
- **KI / LLM** (`ai`): Härte KI- und LLM-Integrationen gegen Prompt Injection und unsichere Anbindungen an Tools, Agenten, Retrieval und MCP
- **Lovable** (`lovable`): Härte KI-generierte Supabase-Apps (Lovable und ähnliche): Lücken in RLS, geleakte Schlüssel der Rolle service_role und unsichere Standardwerte
- **JavaScript** (`javascript`): Härte JavaScript und seine Laufzeitumgebungen gegen RCE über eval und child_process, Path Traversal und Prototype Pollution
- **Python** (`python`): Härte Python-Code gegen RCE durch Deserialisierung mit pickle und YAML, Traversal über Format-Strings von str.format und Class Pollution
- **Rust** (`rust`): Härte Rust-Code gegen unsound implementierte unsafe-APIs, den Missbrauch von transmute, Integer-Überläufe und undefiniertes Verhalten an der FFI-Grenze
- **Java** (`java`): Härte Java-Code gegen Gadget-Chains bei der Deserialisierung mit ObjectInputStream, die in Remotecodeausführung münden
- **Ruby** (`ruby`): Härte Ruby-Code gegen Gadget-Chains bei der Deserialisierung mit Marshal.load und YAML, die bis zur Remotecodeausführung reichen
- **PHP** (`php`): Härte PHP-Code gegen die Umgehung der Authentifizierung durch Type Juggling, Gadget-Chains über Object Injection und unsichere Standardwerte in der Konfiguration
- **Go** (`go`): Härte Go-Code gegen Typed-nil-Fehler bei Interfaces, Data Races zwischen Goroutinen und unsichere Nebenläufigkeit in sicherheitsrelevanten Codepfaden
- **C / C++** (`c-cpp`): Härte C- und C++-Code gegen Format-String-Fehler, Pufferüberläufe und Out-of-Bounds-Schreibzugriffe, die Codeausführung ermöglichen
- **.NET** (`dotnet`): Härte .NET- und C#-Code gegen RCE durch Deserialisierung mit BinaryFormatter und gegen Encoder-Umgehungen, die zu XSS führen

Führe `npx lagune write add --categories` mit den Schlüsseln der Kategorien aus, die du auswählst.

**Tipp**

Ein Projekt beginnt mit `owasp`, und [`/lagune-charter`](https://lagune.ai/de-DE/docs/commands/charter) fügt die Kategorien hinzu, für die seine Lesart des Projekts spricht.

## Voraussetzungen

Auf deinem System muss [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) installiert sein.

## Nutze ein Badge ✨

Du nutzt **Lagune**? Füge eins in deine **README** ein:

**Zweifarbig**

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

**Einfarbig**

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

## Nächster Schritt

Erfahre, was jeder der [**Skills**](https://lagune.ai/de-DE/docs/get-started/commands) von **Lagune** macht.

## Häufige Fragen

### Was ist Lagune?

Lagune ist ein Open-Source-Workflow für ausschließlich defensive Sicherheit, der deinem KI-Agenten hilft, jede Codebasis zu härten. Du setzt Lagune auf deinen Code an, es erkennt, was dein System tatsächlich tut, und führt dich dann durch die Sicherheitskorrekturen, die in diesem Kontext zählen.

### Wie installiere ich Lagune?

Wähle deinen Agenten: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI und Hermes Agent installieren Lagune als Plugin, Gemini CLI und Qwen Code als Erweiterung, Pi als Paket und alle anderen Agenten mit npx skills add wellwelwel/lagune. Es funktioniert in neuen wie in bestehenden Projekten.

### Braucht Lagune einen API-Schlüssel?

Nein. Es läuft über deinen eigenen KI-Agenten, daher brauchst du keine API-Schlüssel.

### Welche Voraussetzungen gibt es?

Auf deinem System muss Node.js (LTS) installiert sein.

### Welche Programmiersprachen unterstützt Lagune?

Alle. Lagune läuft unter der Haube mit Node.js, auditiert und härtet aber Projekte in jeder Programmiersprache.

### Was fügt Lagune meinem Projekt hinzu?

Einen Ordner .lagune/ mit dem Sicherheitszustand deines Projekts, den der erste Befehl anlegt, der etwas schreibt. Die CLI von skills installiert außerdem die Slash-Befehle im Projekt, wo dein Agent sie liest, während ein Plugin sie im Agenten selbst behält.

### Wie aktualisiere ich Lagune?

Genauso, wie du es installiert hast. Die Installationsseite jedes Agenten zeigt, wie du Lagune dort aktualisierst, und die CLI von skills aktualisiert es mit npx skills update. Deine Sicherheitsprinzipien, die Artefakte der Phasen und deine eigenen Spezialisierungen bleiben unangetastet.

### Welche Spezialisierungen nutzt ein Projekt?

Die integrierten seiner Kategorien und dazu seine eigenen. Die Phase charter hält die Kategorien fest, für die ihre Lesart des Projekts spricht, und npx lagune write add --categories ändert sie.

### Muss ich mit der Entwicklung fertig sein, bevor ich mein Projekt absichere?

Nein. Der Befehl /lagune härtet die Arbeit schon beim Schreiben: Er nimmt jeden Prompt an, setzt um, was du verlangt hast, und härtet es mit sicheren Standardwerten, geleitet von den Sicherheitsprinzipien. Der Blue-Team-Workflow in fünf Phasen auditiert, was bereits existiert.

### Kann Lagune ein bestehendes Projekt auditieren?

Ja. Der Blue-Team-Workflow in fünf Phasen auditiert, was bereits existiert: charter legt deine Sicherheitsregeln fest, detect erfasst, was das System tut und wo die Risiken liegen, plan bewertet jeden Befund und ordnet ihm eine Korrektur zu, harden setzt die Korrekturen um, und verify weist nach, dass sie greifen, und schließt sie ab.

### Was unterscheidet die Arbeit mit Lagune davon, den Agenten einfach zu bitten, Schwachstellen und Sicherheitslücken zu erfassen?

Ein Agent, der den Code auf eigene Faust liest, findet, was nach einer Schwachstelle aussieht, und übergeht, was nach einer Schutzmaßnahme aussieht. Eine Liste gesperrter Adressen wirkt, als hätte sich schon jemand um das Risiko gekümmert, also prüft niemand nach, dass ihr die meisten fehlen, und der Code wird ausgeliefert. Lagune kehrt diese Grundannahme um: Eine Schutzvorkehrung, die schon im Code steht, gilt als nicht nachgewiesen, bis sie geprüft ist, jede Spezialisierung im Katalog bekommt ein ausdrückliches Urteil, und verify fragt, ob das Risiko beseitigt ist, nicht, ob eine Schutzmaßnahme vorhanden ist. Außerdem bleibt jeder Befund über alle Durchläufe hinweg ein einziger nachverfolgter Eintrag, sodass sich sein Abschluss nachweisen lässt und er ausgetragen werden kann, während dir eine einfache Anfrage jedes Mal einen anderen Bericht liefert, ohne Vergleichsgrundlage.

### Was unterscheidet die Entwicklung mit Lagune davon, den Agenten einfach zu bitten, sicheren Code zu schreiben?

Die Bitte um sicheren Code überlässt dem Agenten, was sicher bedeutet, und setzt voraus, dass du weißt, wonach du fragen musst. Die Anforderung steckt meist schon in deiner Anfrage, ohne dass einer von euch beiden sie sieht: Wenn du eine Seite verlangst, die die Kurse zeigt, auf die ein Nutzer Zugriff hat, formulierst du damit eine Autorisierungsregel, und eine Prüfung, die nie geschrieben wird, hinterlässt im Code nichts, was auffallen könnte. Der Befehl /lagune lädt deine Sicherheitsprinzipien und die Spezialisierungen, die zu dem passen, was gleich entstehen soll, bevor die erste Zeile geschrieben ist, und prüft das Ergebnis danach noch einmal anhand der Verteidigung, die er eingesetzt hat. Die sichere Variante kostet selten mehr als die unsichere, also entscheidet das Wissen, zu welcher du greifen musst, über das Ergebnis, und genau dieses Wissen ist von Anfang an da.

### Führt Lagune DAST (Dynamic Application Security Testing) durch oder testet es meine laufende Anwendung?

Nein. Lagune liest Code und führt dein System nie aus oder schickt ihm manipulierte Anfragen. Die Phase verify bestätigt, dass eine Schutzmaßnahme im Quellcode vorhanden und korrekt ist, und das ist eine andere Frage als die, ob sie einem Angriff auf ein laufendes Ziel standhält, daher ist "cannot tell from the code" ein legitimes Urteil statt eines stillschweigenden Durchwinkens. DAST beantwortet die Frage zur Laufzeit und Lagune die Frage zum Quellcode, sodass keines das andere ersetzt. Selbst der optionale Befehl prove hält sich an diese Grenze: Seine Tests prüfen das sichere Verhalten, nie Angriffs-Payloads.

### Ersetzt Lagune einen Pentest (Penetrationstest)?

Nein, auf keinen Fall! Ein Pentest ist ein autorisierter Auftrag, bei dem eine Fachperson mit eigenem Urteilsvermögen gegen dein laufendes System vorgeht, Befunde verkettet und die Geschäftslogik untersucht, die keine Regel pro Angriffsfläche beschreibt. Befunde aus einem Pentest können in den Blue-Team-Workflow von Lagune einfließen, indem du sie der Phase detect als Anliegen übergibst, sodass das, was eine Fachperson meldet, geplant, gehärtet und überprüft wird.

## Sicherheitsrichtlinie

Bitte lies die [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md).

## Lizenz

**Lagune** steht unter der [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE).

Copyright © 2026-heute [Weslley Araújo](https://github.com/wellwelwel) und [Mitwirkende](https://github.com/wellwelwel/lagune/graphs/contributors).
