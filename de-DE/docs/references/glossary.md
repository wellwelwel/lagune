# Glossar zu Lagune: SDH, charter, Befunde und Schutzmaßnahmen

> Alle Begriffe von Lagune und Security-Driven Hardening in einfacher Sprache erklärt: SDH, charter, detect, Befund, Schutzmaßnahme, harden, verify, austragen, Abschließbarkeit, Spezialisierungen, Kategorien und der Katalog.

Kanonische URL: https://lagune.ai/de-DE/docs/references/glossary
Sprache: de-DE
Original: https://lagune.ai/docs/references/glossary
Zuletzt aktualisiert: 2026-11-05

Jeder zentrale Begriff von Lagune und der Methodik Security-Driven Hardening, einmal definiert und in einfacher Sprache.

### Security-Driven Hardening (SDH)

Die Methodik, die Lagune umsetzt: eine kontextbezogene Blue-Team-Konvention, die den Kontext eines Systems erkennt, die Risiken dieses Kontexts priorisiert und die Korrekturen anleitet. Das Sicherheitswissen steckt in der Spezifikation und ihren Spezialisierungen, die bei Bedarf geladen werden, sodass Entwickler und Nicht-Entwickler denselben Workflow nutzen.

### Lagune

Die Referenzimplementierung von SDH: neun Agentenbefehle, jeweils mit der Vorlage, die sie ausfüllen, mit denen ein KI-Agent eine Codebasis härtet. Jeder Agent installiert sie über seinen eigenen Plugin-Installer oder über [**skills.sh**](https://www.skills.sh/wellwelwel/lagune), wie die [Installationsseite](https://lagune.ai/de-DE/docs) zeigt, und sie führen für jeden deterministischen Schritt die Engine von Lagune aus.

### Charter

Die übergeordnete Ebene von Lagune: Prinzipien, die Sicherheit an erste Stelle setzen und die jede spätere Phase einhalten muss. Stell sie dir als Prüfung zur Kompilierzeit für das Sicherheitsniveau eines Projekts vor. Gespeichert sind sie unter `.lagune/memory/charter.md`.

### Entwicklungs-Workflow

Der universelle Befehl `/lagune`, der die Arbeit härtet, während sie entsteht. Er nimmt jeden Prompt zu jedem Zeitpunkt an, baut, was du verlangt hast, und härtet es mit sicheren Standardwerten, bevor er es zurückgibt, geleitet von den Sicherheitsprinzipien, sofern es welche gibt. Er schreibt nichts in die Nachverfolgung von Lagune, sein einziges Ergebnis ist also der gehärtete Code. Zusammen mit der Phase charter (davor) und dem Blue-Team-Workflow (danach) ist er der Weg, auf dem Lagune während der Entwicklung schützt.

### Blue-Team-Workflow

Das Audit in fünf Phasen im Kern von Lagune: charter, detect, plan, harden, verify. Jede Phase baut auf der vorherigen auf. "Blue Team" ist die Tradition der Verteidiger in der Sicherheit, im Gegensatz zum offensiven Red Team.

### Befund

Ein erkanntes Risiko. Jeder Befund hält fest, worum es sich handelt, warum es wichtig ist und welche Belege es dafür im Code gibt. Ein Befund ist die einzelne nachverfolgte Einheit, die plan, harden und verify weitertragen und die in jedem Artefakt über ihren Namen identifiziert wird.

### Schutzmaßnahme

Eine Sicherheitsmaßnahme, die umgesetzt wird, um ein Risiko zu schließen. Die Phase harden setzt Schutzmaßnahmen um, verify weist nach, dass sie greifen. Lagune schwächt nie eine Schutzmaßnahme ab, nur um einem Prompt zu entsprechen.

### Detect

Die Phase, die den Code liest und erfasst, was das System tut und wo die Risiken liegen. Ihre oberste Regel lautet erkennen, nicht erfinden: Sie hält nur fest, was der Code belegt.

### Harden

Die einzige Phase, die deinen Code anfasst. Sie setzt die Korrekturen der Phase plan nacheinander um und hält jede als Applied, Partial oder Blocked fest. Applied heißt noch nicht nachgewiesen.

### Verify

Die Phase, die nachweist, dass jede umgesetzte Korrektur greift, indem sie den Code liest und ihm gegenüberstellt, was harden festgehalten hat. Sie liefert eines von drei Urteilen: Risk closed, Risk not closed oder Cannot tell from the code.

### Austragen

Wenn verify nachweist, dass ein Risiko geschlossen ist, wird der Befund ausgetragen: Er wird mit deiner Bestätigung aus der gesamten Kette entfernt und danach nicht mehr erneut verarbeitet.

### Abschließbarkeit

Die Eigenschaft, dass Sicherheitsarbeit einen Endzustand hat. Weil ein nachweislich geschlossener Befund ausgetragen wird, kann der Workflow in den Ruhezustand übergehen und wird erst wieder geöffnet, wenn sich der Code ändert. SDH ist abschließbar und keine Endlosschleife.

### Engine

Das Paket `lagune` auf **npm**, das die Befehle für jeden deterministischen Schritt über `npx` ausführen: die Hooks, den Katalog und die Kategorien.

### Spezialisierung

Ein fokussiertes, sprachunabhängiges Modul mit Sicherheitswissen, das nur bei Bedarf geladen wird, nie standardmäßig. Eine Spezialisierung ist kein Befehl. Lade eine mit `read catalog <name>` der Engine in einen beliebigen Prompt, zum Beispiel `npx lagune read catalog regex`.

### Kategorie

Eine benannte Gruppe integrierter Spezialisierungen, von `owasp` bis zu sprachspezifischen wie `javascript`, `python`, `go` und `rust`. Die Kategorien, die ein Projekt nutzt und in `.lagune/configs.json` festhält, bestimmen, welche integrierten Spezialisierungen in seinen Katalog aufgenommen werden. Solange keine festgehalten ist, nutzt das Projekt nur `owasp`.

### Katalog

Die Menge der Spezialisierungen, die ein Projekt nutzt: die integrierten seiner Kategorien plus die eigenen, mit `/lagune-specialize` geschrieben. Die Engine listet ihn mit `read catalog` auf, und die Phasen vergleichen ihn mit dem Code.

### Prompt bei Bedarf

Das Prinzip, dass das relevante Sicherheitswissen passend zu dem geladen wird, was das Projekt tatsächlich ist, statt standardmäßig jede Prüfung auszuführen.

### Identität über den Namen

Das Nachverfolgungsmodell von Lagune: Der Name jedes Befunds, in jedem Artefakt identisch als Abschnittstitel geschrieben, ist seine Identität in der gesamten Kette. Die Tracking-Map (`.lagune/tracking.json`) enthält nur Daten zur Nachverfolgung, nie Fließtext.

## Häufige Fragen

### Was ist Security-Driven Hardening (SDH)?

SDH ist eine kontextbezogene Blue-Team-Methodik für die Sicherheit. Sie erkennt den Kontext eines Systems, priorisiert die Risiken dieses Kontexts und leitet die Korrekturen an, wobei jeder Befund in einfacher Sprache bleibt. Lagune ist ihre Referenzimplementierung.

### Was sind die Sicherheitsprinzipien (charter) in Lagune?

Die Sicherheitsprinzipien sind die übergeordnete Ebene von Lagune: Prinzipien, die Sicherheit an erste Stelle setzen und die jede spätere Phase einhalten muss. Sie liegen unter .lagune/memory/charter.md.

### Was bedeutet es, einen Befund auszutragen?

Wenn verify nachweist, dass ein Risiko geschlossen ist, wird der Befund ausgetragen: Er wird mit deiner Bestätigung aus der gesamten Kette entfernt und danach nicht mehr erneut verarbeitet.
