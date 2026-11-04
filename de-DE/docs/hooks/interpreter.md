# Hook interpreter: Sinks für dynamische Codeausführung melden

> Durchsuche eine Codebasis sprachübergreifend nach Sinks für dynamische Codeausführung, oder bewerte einen einzelnen Codeausschnitt, direkt über die Kommandozeile.

Kanonische URL: https://lagune.ai/de-DE/docs/hooks/interpreter
Sprache: de-DE
Original: https://lagune.ai/docs/hooks/interpreter
Zuletzt aktualisiert: 2026-11-04

Der Hook `interpreter` meldet **Sinks für dynamische Codeausführung**: Konstrukte, die Daten in ausgeführten Code verwandeln oder an eine Shell übergeben, von `eval` bis zur nativen Deserialisierung. Er arbeitet sprachspezifisch und liest jede Datei nach ihren eigenen Regeln. Er ist die deterministische Engine hinter der [Spezialisierung `interpreter`](https://lagune.ai/de-DE/docs/catalog), und du kannst ihn selbst im Modus **scan** oder **check** ausführen.

## Ausführen

**Codebasis durchsuchen**

```bash
npx lagune read interpreter               # scans the whole project
npx lagune read interpreter --dir src     # scans a directory
npx lagune read interpreter --file app.py # scans a single file
```

**Codeausschnitt prüfen**

```bash
npx lagune read interpreter --lang javascript --pattern 'eval(x)'   # => careful
npx lagune read interpreter --lang python --pattern 'json.loads(x)' # => safe
```

Diese Sinks sind Dual-Use: Ob eine vom Angreifer beeinflusste Eingabe einen davon erreicht, kann ein statischer Durchlauf nicht entscheiden, deshalb ist jeder Treffer eine **Warnung zur Prüfung**, nie ein bestätigter Befund. Der Durchlauf gibt einen einzigen Abschnitt **Dynamic-execution sinks to review** aus, nach Datei gruppiert. Findet er nichts, gibt er `no dynamic-execution sinks found` aus.

**Lies den gemeldeten Code, führe ihn nie aus!**

Analysiere jeden Sink **statisch** und verfolge, ob nicht vertrauenswürdige Eingaben ihn erreichen. Führe den gemeldeten Code nie aus und übergib ihn nie an `eval`, ebenso wenig entfernten oder erst zur Laufzeit geladenen Code, den er nachlädt, um zu "testen", was er tut.

## So liest du das Urteil

| Urteil    | Bedeutung                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `careful` | Der Codeausschnitt enthält einen Sink für dynamische Ausführung in seiner Sprache. Prüfe ihn durch Lesen, nie durch Ausführen. |
| `safe`    | Für die angegebene Sprache wurde kein Sink für dynamische Ausführung gefunden.                                                 |

### CLI-Optionen

| Option      | Wert               | Beschreibung                                                                                                  |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `--pattern` | ein Codeausschnitt | Prüft einen Codeausschnitt. Wiederhole die Option, um mehrere zu prüfen, ein Urteil pro Zeile.                |
| `--lang`    | eine Sprache       | Erforderlich bei `--pattern`: eine von javascript, python, php, ruby, java, kotlin, go, rust, c, cpp, csharp. |
| `--dir`     | ein Verzeichnis    | Beschränkt den Durchlauf auf ein Verzeichnis. Wiederholbar und mit `--file` kombinierbar.                     |
| `--file`    | eine Datei         | Beschränkt den Durchlauf auf eine einzelne Datei. Wiederholbar und mit `--dir` kombinierbar.                  |

Ohne Option durchsucht er das gesamte Projekt. `--pattern` erfordert `--lang` und lässt sich nicht mit `--dir` oder `--file` kombinieren.

### Festlegen, was er durchsucht

Er lässt aus, was **Git** ignoriert. Wenn du mehr auslassen oder auch durchsuchen willst, was **Git** ignoriert, gib `interpreter` eigene Einstellungen:

```bash
npx lagune write add --ignore test/fixtures --checker interpreter
```

```json
{
  "checkers": {
    "interpreter": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Hooks konfigurieren](https://lagune.ai/de-DE/docs/hooks/configure) beschreibt jede Einstellung.

### Unterstützte Sprachen

Der Durchlauf liest diese Sprachen, erkannt an der Dateiendung, und prüft jede gegen ihre eigene Menge an Sinks für dynamische Ausführung.

| #   | Sprache                     | Dateiendungen                                                                                                | Gemeldete Sinks                                                                                                                                                                                                                                 |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` | `eval()`, Function-Konstruktor, `setTimeout`/`setInterval` mit einem String als Rumpf, Modul `vm`, exec von `child_process`, dynamisches `require()`, dynamisches `import()`                                                                    |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                | `eval`/`exec`, `__import__()`, `os.system`/`os.popen`, `subprocess` `shell=True`, `pickle.load`/`loads`, `yaml.load` (unsicher)                                                                                                                 |
| 3   | **Ruby**                    | `.rb`                                                                                                        | eval-Familie (`instance_eval`/`class_eval`/`module_eval`/`eval`), `system`/`exec`, Backticks oder `%x`, `Kernel#open` / `IO.popen`/`read`/`binread` / `Open3`, `Process.spawn`, `Marshal.load`                                                  |
| 4   | **Go**                      | `.go`                                                                                                        | `exec.Command`/`exec.CommandContext`, `plugin.Open`                                                                                                                                                                                             |
| 5   | **PHP**                     | `.php`                                                                                                       | `eval()`, `assert()` auf einem String, `create_function()`, Shell-Ausführung (`system`/`exec`/`shell_exec`/`passthru`/`popen`/`proc_open`), `call_user_func`/`call_user_func_array`, `include`/`require` mit einem zur Laufzeit gebildeten Pfad |
| 6   | **Rust**                    | `.rs`                                                                                                        | `Command::new`, `process::Command`                                                                                                                                                                                                              |
| 7   | **Java**                    | `.java`                                                                                                      | `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                                                                |
| 8   | **Kotlin**                  | `.kt`, `.kts`                                                                                                | Die JVM-Sinks: `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                                                 |
| 9   | **C#**                      | `.cs`                                                                                                        | `Process.Start` / `new Process`, `BinaryFormatter`, `Assembly.Load`                                                                                                                                                                             |
| 10  | **C**                       | `.c`, `.h`                                                                                                   | `system()`, `popen()`, die Familie `exec*` (`execl`, `execve`, `execvp`, …)                                                                                                                                                                     |
| 11  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 | `system()`, `popen()`, die Familie `exec*` (`execl`, `execve`, `execvp`, …)                                                                                                                                                                     |

**Bestmöglich, aber nicht lückenlos**

Er liest den Quellcode als Text, deshalb kann ihm ein Sink entgehen, der erst zur Laufzeit zusammengesetzt wird, hinter einem Alias steckt oder in einer Form geschrieben ist, die er nicht erkennt. Betrachte die Tabelle als soliden Ausgangspunkt, nicht als vollständige Bestandsaufnahme.

**Tipp**

Der Hook garantiert das Minimum (dass diese Sinks existieren und wo): Ob ein nicht vertrauenswürdiger Wert tatsächlich einen davon erreicht, ist die Ermessensfrage, die die [Spezialisierung `interpreter`](https://lagune.ai/de-DE/docs/catalog) abdeckt.

## Häufige Fragen

### Bestätigt der Hook interpreter eine Schwachstelle?

Nein. Er meldet Sinks für dynamische Ausführung als Warnung zur Prüfung, nie als bestätigten Befund, weil ein statischer Durchlauf nicht entscheiden kann, ob eine vom Angreifer beeinflusste Eingabe den Sink erreicht.

### Welche Sprachen deckt der Hook interpreter ab?

Er liest die Sprachen aus der Tabelle "Unterstützte Sprachen", erkannt an der Dateiendung, und prüft jede gegen ihre eigene Menge an Sinks. Andere Sprachen ergeben keine Sinks.
