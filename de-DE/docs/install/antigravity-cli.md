# Lagune als Plugin in Antigravity CLI installieren

> Installiere Lagune als Plugin in Antigravity CLI, halte es aktuell und gib die Engine vorab frei.

Kanonische URL: https://lagune.ai/de-DE/docs/install/antigravity-cli
Sprache: de-DE
Original: https://lagune.ai/docs/install/antigravity-cli
Zuletzt aktualisiert: 2026-11-03

Installiere das Plugin über dein Terminal:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Aktualisierung

Um **Lagune** zu aktualisieren, installiere das Plugin erneut:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Befehle

Gib die Befehle mit vorangestelltem Plugin-Namen ein, etwa `/lagune:lagune-charter` für `/lagune-charter`.

---

**Berechtigungen**

Die Engine läuft über zwei Tools: `lagune_read` liest nur dein Projekt und `lagune_write` schreibt nur in `.lagune/`. Ein Befehl, den du als erste Nachricht einer Sitzung sendest, läuft, bevor sie geladen sind, und nutzt deshalb stattdessen **npx**. Um die Tools und **npx** vorab zu erlauben, füge diese Regeln zu `~/.gemini/antigravity-cli/settings.json` hinzu:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## Häufige Fragen

### Wie installiere ich Lagune in Antigravity CLI?

Führe agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity aus.

### Wie aktualisiere ich Lagune in Antigravity CLI?

Führe agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity erneut aus.

### Wie führe ich die Befehle von Lagune in Antigravity CLI aus?

Gib sie mit vorangestelltem Plugin-Namen ein, etwa /lagune:lagune-charter.

### Kann Antigravity CLI Lagune ohne Rückfrage ausführen?

Ja. Erlaube mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write) und command(regex:npx --yes lagune@[0-9.]+) in den Einstellungen von Antigravity CLI. Die Regel für npx deckt einen Befehl ab, den du als erste Nachricht einer Sitzung sendest.
