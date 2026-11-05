# Hook regex: ReDoS-Muster erkennen

> Durchsuche eine Codebasis nach ReDoS-anfälligen Regex-Mustern, oder bewerte ein einzelnes Muster, direkt über die Kommandozeile.

Kanonische URL: https://lagune.ai/de-DE/docs/hooks/regex
Sprache: de-DE
Original: https://lagune.ai/docs/hooks/regex
Zuletzt aktualisiert: 2026-11-05

Der Hook `regex` ist die deterministische Engine für sichere Regex, die die [Spezialisierung `regex`](https://lagune.ai/de-DE/docs/catalog) verwendet, und du kannst ihn selbst ausführen. Er arbeitet mit einem einzigen Befehl in zwei Modi: Im Modus **scan** durchsucht er eine Codebasis nach Mustern, die für **ReDoS** anfällig sind oder erst zur Laufzeit gebaut werden, und im Modus **check** bewertet er ein einzelnes Muster, das du ihm übergibst.

## Eine Codebasis durchsuchen

Ohne Option durchsucht er das gesamte Projekt. `--dir` beschränkt den Durchlauf auf ein Verzeichnis, `--file` auf eine einzelne Datei. Beide lassen sich wiederholen und zu einem Bericht kombinieren, in dem jede Datei nur einmal erscheint, auch wenn mehr als ein Ziel sie abdeckt.

**Gesamtes Projekt**

```bash
npx lagune read regex
```

**Ein Verzeichnis**

```bash
npx lagune read regex --dir src/services
```

**Eine einzelne Datei**

```bash
npx lagune read regex --file bin/import.pl
```

**Mehrere Ziele**

```bash
npx lagune read regex --dir core --dir workers --file Sources/App/Router.swift
```

**Mit Limit**

`--limit` legt den ReDoS-Schwellenwert für den Durchlauf fest (Standard 25), dasselbe Limit, das auch der Modus check annimmt. Ein niedrigeres Limit ist strenger.

```bash
npx lagune read regex --dir src/services --limit 15
```

Die Ausgabe ist reiner Text, dessen Überschriften sagen, wie jeder Abschnitt zu lesen ist. Ein Abschnitt erscheint nur, wenn er Befunde enthält.

```text
Vulnerable regular expressions found:

cmd/server/main.go
  ([a-z]+)+$ (exponential, search)

Dynamically built regular expressions (review manually by simulating a constructed regex):

app/payments.php
crates/parser/lexer.rs
lib/validate.py

Static regex wrapped in a constructor (use a literal instead):

config/token.rb
```

Findet er nichts, gibt er eine einzige Zeile aus.

```bash
npx lagune read regex --dir src/clean
# => no unsafe patterns found
```

### So liest du die Abschnitte

| Abschnitt                                                                                   | Bedeutung                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Vulnerable regular expressions found`                                                      | ReDoS-anfällige Muster, nach Datei gruppiert, jedes Muster eingerückt darunter, gefolgt in Klammern vom Grund, warum es unsicher ist, und, falls vorhanden, von seinem Geltungsbereich und seinen Flags. Jede Zeile ist unsicher, deshalb wird das Urteil nicht wiederholt. |
| `Regular expressions the analysis could not settle (review manually)`                       | Muster, die die Analyse innerhalb ihres Arbeitslimits nicht klären konnte, genauso aufgelistet.                                                                                                                                                                             |
| `Dynamically built regular expressions (review manually by simulating a constructed regex)` | Dateien, die eine Regex aus einer Variablen, einer Verkettung oder einer Interpolation bauen.                                                                                                                                                                               |
| `Static regex wrapped in a constructor (use a literal instead)`                             | Dateien, die einem Regex-Konstruktor ein einfaches String-Literal übergeben, wo ein Regex-Literal einfacher wäre und die Kompilierung zur Laufzeit spart.                                                                                                                   |

Der erste Abschnitt ist ein Sicherheitsbefund. Der zweite und dritte sind für sich genommen keine Befunde: Sie zeigen auf Code, den eine statische Prüfung nicht klären kann, und verlangen deshalb, dass ein Mensch ihn liest. Der vierte ist ein Hinweis zur Lesbarkeit, kein Sicherheitsbefund.

### CLI-Optionen

| Option      | Wert                         | Beschreibung                                                                                                    |
| ----------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `--pattern` | der Quelltext einer Regex    | Prüft ein Muster. Wiederhole die Option, um mehrere zu prüfen, ein Urteil pro Muster, in derselben Reihenfolge. |
| `--flags`   | Regex-Flags                  | Prüft jedes `--pattern` mit diesen Flags, etwa `im`. Gilt nur für den Modus check.                              |
| `--dir`     | ein Verzeichnis              | Beschränkt den Durchlauf auf ein Verzeichnis. Wiederholbar und mit `--file` kombinierbar.                       |
| `--file`    | eine Datei                   | Beschränkt den Durchlauf auf eine einzelne Datei. Wiederholbar und mit `--dir` kombinierbar.                    |
| `--limit`   | eine nicht negative Ganzzahl | Legt das ReDoS-Wiederholungslimit fest (Standard 25). Gilt für beide Modi. Ein niedrigeres Limit ist strenger.  |

Ohne Option durchsucht er das gesamte Projekt. `--pattern` steht für den Modus check und lässt sich nicht mit `--dir` oder `--file` kombinieren.

### Festlegen, was er durchsucht

Er lässt aus, was **Git** ignoriert. Wenn du mehr auslassen oder auch durchsuchen willst, was **Git** ignoriert, gib `regex` eigene Einstellungen:

```bash
npx lagune write add --ignore test/fixtures --checker regex
```

```json
{
  "checkers": {
    "regex": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Hooks konfigurieren](https://lagune.ai/de-DE/docs/hooks/configure) beschreibt jede Einstellung.

### Unterstützte Sprachen

Der Durchlauf liest diese Sprachen, erkannt an der Dateiendung, jede nach ihren eigenen Regeln, sodass er ein Muster aus einer Sprache nie nach den Regeln einer anderen testet. Alles andere überspringt er, statt es mit den falschen Regeln zu durchsuchen.

| #   | Sprache                     | Dateiendungen                                                                                                |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                |
| 3   | **Ruby**                    | `.rb`                                                                                                        |
| 4   | **Go**                      | `.go`                                                                                                        |
| 5   | **PHP**                     | `.php`                                                                                                       |
| 6   | **Rust**                    | `.rs`                                                                                                        |
| 7   | **Java**                    | `.java`                                                                                                      |
| 8   | **C#**                      | `.cs`                                                                                                        |
| 9   | **C**                       | `.c`, `.h`                                                                                                   |
| 10  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 |
| 11  | **Kotlin**                  | `.kt`, `.kts`                                                                                                |
| 12  | **Swift**                   | `.swift`                                                                                                     |
| 13  | **Scala**                   | `.scala`, `.sc`                                                                                              |
| 14  | **Dart**                    | `.dart`                                                                                                      |
| 15  | **PowerShell**              | `.ps1`, `.psm1`, `.psd1`                                                                                     |
| 16  | **Elixir**                  | `.ex`, `.exs`                                                                                                |
| 17  | **Objective-C**             | `.m`, `.mm`                                                                                                  |
| 18  | **R**                       | `.r`                                                                                                         |
| 19  | **Julia**                   | `.jl`                                                                                                        |
| 20  | **Clojure**                 | `.clj`, `.cljs`, `.cljc`, `.edn`                                                                             |
| 21  | **Crystal**                 | `.cr`                                                                                                        |
| 22  | **Nim**                     | `.nim`, `.nims`                                                                                              |
| 23  | **V**                       | `.v`                                                                                                         |
| 24  | **D**                       | `.d`                                                                                                         |
| 25  | **Perl**                    | `.pl`, `.pm`                                                                                                 |

**Bestmöglich, aber nicht lückenlos**

Er liest den Quellcode als Text, deshalb kann er kein Muster beurteilen, das erst zur Laufzeit zusammengesetzt wird, und ein Muster, das sich über mehrere Zeilen erstreckt, hinter einem Alias steckt oder in einer Form geschrieben ist, die er nicht erkennt, kann ihm entgehen. Betrachte die Abschnitte als soliden Ausgangspunkt, nicht als vollständige Bestandsaufnahme, und lies den Code weiterhin selbst, um zu erfassen, was sie nicht erreichen.

## Ein einzelnes Muster prüfen

Übergib `--pattern` mit dem Quelltext des Musters, um es zu bewerten. Der Hook gibt ein Wort aus: `safe`, `unsafe`, `undetermined`, wenn die Analyse ihr Arbeitslimit erreicht, bevor sie das Muster klären kann, oder `invalid regex`. Wiederhole `--pattern`, um mehrere auf einmal zu bewerten, ein Urteil pro Muster, in derselben Reihenfolge.

**Ein Muster**

```bash
npx lagune read regex --pattern '(a+)+$'
# => unsafe

npx lagune read regex --pattern '^[a-z0-9_]{3,20}$'
# => safe
```

**Mehrere Muster**

```bash
npx lagune read regex --pattern '(a+)+$' --pattern '^[a-z]+$'
# => unsafe
# => safe
```

**Mit Flags**

`--flags` prüft jedes `--pattern` des Aufrufs mit den Flags, mit denen es ausgeführt wird, denn ein Flag ändert, welche Zeichen ein Muster trifft.

```bash
npx lagune read regex --pattern '^(?:a|A)+$'
# => safe

npx lagune read regex --pattern '^(?:a|A)+$' --flags 'i'
# => unsafe
```

**Mit Limit**

`--limit` legt das Wiederholungslimit fest (Standard 25) und gilt für jedes `--pattern` des Aufrufs. Ein niedrigeres Limit ist strenger.

```bash
npx lagune read regex --pattern 'a?a?a?' --limit 2
# => unsafe
```

**Warum ein Argument in Anführungszeichen**

Jedes Muster wird als Wert einer Option übergeben und nie in den Befehl interpoliert. Ein Wert mit Anführungszeichen oder Backticks bleibt wirkungslos und kann nichts in die Shell einschleusen. Setze das Muster immer in einfache Anführungszeichen, damit deine Shell es nicht vorher expandiert.

**Tipp**

Das ist dieselbe Engine, die die [Spezialisierung `regex`](https://lagune.ai/de-DE/docs/catalog) ausführt: Der Modus scan eröffnet die ReDoS-Prüfung, der Modus check bestätigt ein Muster, das sie zutage fördert.

## Häufige Fragen

### Wie prüfe ich eine Regex über die CLI auf ReDoS?

Führe npx lagune read regex --pattern '<pattern>' aus. Der Befehl gibt safe, unsafe, undetermined oder invalid regex zurück.

### Wie durchsuche ich ein ganzes Projekt nach unsicheren Regex?

Führe den Hook regex im Modus scan über die Codebasis aus. Er meldet ReDoS-anfällige Muster in 25 unterstützten Sprachen.
