# Lagune als Erweiterung in Gemini CLI installieren

> Installiere Lagune als Erweiterung in Gemini CLI, halte sie aktuell und gib die Engine vorab frei.

Kanonische URL: https://lagune.ai/de-DE/docs/install/gemini-cli
Sprache: de-DE
Original: https://lagune.ai/docs/install/gemini-cli
Zuletzt aktualisiert: 2026-11-05

Installiere die Erweiterung über dein Terminal:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## Aktualisierung

Um **Lagune** zu aktualisieren, führe Folgendes aus:

```bash
gemini extensions update lagune
```

Für automatische Aktualisierungen installiere die Erweiterung mit `--auto-update`.

## Befehle

Gib die Befehle mit vorangestelltem Namen der Erweiterung ein, etwa `/lagune:lagune-charter` für `/lagune-charter`.

---

**Berechtigungen**

Die Engine läuft über zwei Tools: `lagune_read` liest nur dein Projekt und `lagune_write` schreibt nur in `.lagune/`. **Gemini CLI** startet sie nur in einem vertrauenswürdigen Ordner. Um sie vorab zu erlauben, speichere diese Regel als `~/.gemini/policies/lagune.toml`:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

Läuft die Engine über **npx**, wie bei **skills.sh**, ergänze dieselbe Datei um diese Regel:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## Häufige Fragen

### Wie installiere ich Lagune in Gemini CLI?

Führe gemini extensions install https://github.com/wellwelwel/lagune aus.

### Wie aktualisiere ich Lagune in Gemini CLI?

Führe gemini extensions update lagune aus oder installiere die Erweiterung mit --auto-update.

### Wie führe ich die Befehle von Lagune in Gemini CLI aus?

Gib sie mit vorangestelltem Namen der Erweiterung ein, etwa /lagune:lagune-charter.

### Kann Gemini CLI Lagune ohne Rückfrage ausführen?

Ja. Füge eine Policy-Regel hinzu, die die Tools lagune_read und lagune_write des Servers lagune erlaubt, dazu eine für run_shell_command mit npx --yes lagune@ und einer Version, wenn die Engine über npx läuft.
