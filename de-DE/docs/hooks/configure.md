# Hooks konfigurieren: festlegen, was sie durchsuchen

> Lege für alle Hooks, die Dateien durchsuchen, oder für einen einzelnen fest, was sie auslassen.

Kanonische URL: https://lagune.ai/de-DE/docs/hooks/configure
Sprache: de-DE
Original: https://lagune.ai/docs/hooks/configure
Zuletzt aktualisiert: 2026-11-06

Der Block `checkers` in `.lagune/configs.json` legt für alle Hooks, die Dateien durchsuchen, oder für einen einzelnen fest, was sie auslassen.

## Konfigurieren

Füge Pfade und Muster über die Kommandozeile hinzu oder entferne sie, und setze ein Muster in Anführungszeichen, damit die Shell es unverändert lässt:

```bash
npx lagune write add --ignore test/fixtures
npx lagune write add --ignore 'packages/*/dist' --checker secrets
npx lagune write remove --ignore test/fixtures
```

Oder wähle sie in den Settings des [Dashboards](https://lagune.ai/de-DE/docs/get-started/dashboard) aus, oder lege sie in der Datei fest:

```json
{
  "checkers": {
    "ignore": ["test/fixtures"],
    "secrets": { "gitignore": false, "ignore": ["test/fixtures", "temp"] }
  }
}
```

### Einstellungen

| Schlüssel   | Wert                                  | Standard | Beschreibung                                                                                       |
| ----------- | ------------------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `gitignore` | `true` oder `false`                   | `true`   | Lässt aus, was **Git** ignoriert. Eine Datei, die **Git** verfolgt, wird in jedem Fall durchsucht. |
| `ignore`    | Pfade oder Muster ab dem Projektstamm | `[]`     | Lässt aus, worauf ein Eintrag passt, samt allem darunter, selbst eine Datei, die **Git** verfolgt. |

Auf der obersten Ebene von `checkers` gilt ein Schlüssel für jedes Prüfprogramm. Unter dem Namen eines Prüfprogramms gilt er nur für dieses und ersetzt den gemeinsamen Schlüssel, deshalb durchsucht `secrets` im Beispiel, was **Git** ignoriert, und lässt `test/fixtures` und `temp` aus. Erhält ein Prüfprogramm über `write add --ignore` seine erste eigene Liste, beginnt diese als Kopie der gemeinsamen Liste.

### Muster

Ein Muster beginnt am Projektstamm, deshalb erreicht `*.generated.ts` nur die Dateien dort, während `**/*.generated.ts` sie in jeder Tiefe erreicht. Namen müssen exakt übereinstimmen, auch in der Groß- und Kleinschreibung.

| Muster              | Lässt aus                                        |
| ------------------- | ------------------------------------------------ |
| `dist`              | `dist` im Projektstamm                           |
| `packages/*/dist`   | `dist` in jedem Ordner unter `packages`          |
| `**/dist`           | jedes `dist`, in beliebiger Tiefe                |
| `**/*.generated.ts` | jede Datei, deren Name auf `.generated.ts` endet |
| `fixture-?`         | `fixture-a`, `fixture-1` und Ähnliches           |
| `[ab]-cache`        | `a-cache` und `b-cache`                          |
| `[*]x`              | `*x`, mit einem wörtlichen `*`                   |

## So liest du das Ergebnis

Der Bericht endet damit, wie viele Pfade der Durchlauf ausgelassen hat, aufgeschlüsselt danach, was sie ignoriert:

```text
Skipped 25 paths that Git ignores and 3 paths that .lagune/configs.json ignores. Name one with --dir or --file to scan it.
```

Ein Pfad, den du mit `--dir` oder `--file` angibst, wird durchsucht, ganz gleich, was die Einstellungen sagen. Eine Einstellung, die die Engine nicht lesen kann, stoppt das Prüfprogramm mit einem Fehler, der sie nennt, etwa ein Muster, das mit `!` oder einem Leerzeichen beginnt, aus dem Projekt hinausführt, eine Klammer offen lässt oder zu lange zum Abgleichen braucht.

## Häufige Fragen

### Legt Lagune diese Einstellungen für mich fest?

Nein. Die charter listet die committeten Ordner auf, die laut ihrer Analyse nicht zu dem Code gehören, den du verteidigen musst, etwa Test-Fixtures, die so geschrieben sind, dass sie verwundbar wirken, und trägt nur die ein, die du per Nummer auswählst.

### Wann sollte ein Prüfprogramm durchsuchen, was Git ignoriert?

Wenn du dem Repository nicht vertrauen kannst, weil seine eigenen .gitignore-Dateien Code verbergen könnten, oder wenn ein Build-Ordner einen Schlüssel enthalten kann, der beim Build eingebettet wurde. Setze gitignore für jedes Prüfprogramm oder für ein einzelnes auf false.
