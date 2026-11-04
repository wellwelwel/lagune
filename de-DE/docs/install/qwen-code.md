# Lagune als Erweiterung in Qwen Code installieren

> Installiere Lagune als Erweiterung in Qwen Code, halte sie aktuell und gib die Engine vorab frei.

Kanonische URL: https://lagune.ai/de-DE/docs/install/qwen-code
Sprache: de-DE
Original: https://lagune.ai/docs/install/qwen-code
Zuletzt aktualisiert: 2026-11-04

Installiere die Erweiterung über dein Terminal:

```bash
qwen extensions install lagune
```

## Aktualisierung

Um **Lagune** zu aktualisieren, führe Folgendes aus:

```bash
qwen extensions update lagune
```

Für automatische Aktualisierungen installiere die Erweiterung mit `--auto-update`.

## Befehle

Gib die Befehle mit vorangestelltem Namen der Erweiterung ein, etwa `/lagune:lagune-charter` für `/lagune-charter`.

---

**Berechtigungen**

Die Engine läuft über zwei Tools: `lagune_read` liest nur dein Projekt und `lagune_write` schreibt nur in `.lagune/`. Um sie vorab zu erlauben, füge diese Regeln für ein einzelnes Projekt zu `.qwen/settings.json` hinzu oder für alle Projekte zu `~/.qwen/settings.json`:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

Läuft die Engine über **npx**, wie bei **skills.sh**, erlaube `Shell(npx --yes lagune@*)`.

## Häufige Fragen

### Wie installiere ich Lagune in Qwen Code?

Führe qwen extensions install lagune aus.

### Wie aktualisiere ich Lagune in Qwen Code?

Führe qwen extensions update lagune aus oder installiere die Erweiterung mit --auto-update.

### Wie führe ich die Befehle von Lagune in Qwen Code aus?

Gib sie mit vorangestelltem Namen der Erweiterung ein, etwa /lagune:lagune-charter.

### Kann Qwen Code Lagune ohne Rückfrage ausführen?

Ja. Erlaube mcp__lagune__lagune_read und mcp__lagune__lagune_write in den Einstellungen von Qwen Code, dazu Shell(npx --yes lagune@*), wenn die Engine über npx läuft.
