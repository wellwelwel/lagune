# Lagune als Plugin in Cursor installieren

> Installiere Lagune als Plugin in Cursor und in der Cursor CLI, halte es aktuell und gib die Engine vorab frei.

Kanonische URL: https://lagune.ai/de-DE/docs/install/cursor
Sprache: de-DE
Original: https://lagune.ai/docs/install/cursor
Zuletzt aktualisiert: 2026-11-03

**Cursor**

- Öffne **Customize**.
- Wähle **From GitHub Repository** und gib `https://github.com/wellwelwel/lagune` ein.
- Wähle bei **Lagune** die Option **Install** und lege als Geltungsbereich das Projekt oder den Benutzer fest.

**Cursor CLI**

- Füge den Marketplace über dein Terminal hinzu:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Gib `/plugins` in einer Sitzung von `agent` ein.
- Installiere **Lagune**.

Ist **Lagune** bereits in **Claude Code** installiert, lädt die **Cursor CLI** das Plugin von dort.

## Aktualisierung

**Cursor**

- Öffne **Customize**.
- Wähle beim Marketplace `lagune` die Option **Refresh**.

**Cursor CLI**

- Ersetze den Marketplace über dein Terminal:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Gib `/plugins` in einer Sitzung von `agent` ein.
- Installiere **Lagune** erneut.

## Befehle

Gib die Befehle mit ihrem Namen ein, etwa `/lagune-charter`.

---

**Berechtigungen**

In **Cursor** starten die Befehle die Engine über **npx**, und der Standardmodus Auto-review erlaubt das ohne Rückfrage.

In der **Cursor CLI** läuft die Engine über zwei Tools: `lagune_read` liest nur dein Projekt und `lagune_write` schreibt nur in `.lagune/`. Um sie vorab zu erlauben, füge diese Regeln für ein einzelnes Projekt zu `.cursor/cli.json` hinzu oder für alle Projekte zu `~/.cursor/cli-config.json`:

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

Läuft die Engine über **npx**, wie bei **skills.sh**, erlaube `Shell(npx:--yes lagune@*)`.

## Häufige Fragen

### Wie installiere ich Lagune in Cursor?

Öffne in Cursor Customize, wähle From GitHub Repository, gib https://github.com/wellwelwel/lagune ein und installiere Lagune. Führe in der Cursor CLI agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor aus und installiere Lagune dann über /plugins.

### Wie aktualisiere ich Lagune in Cursor?

Wähle in Cursor unter Customize beim Marketplace lagune die Option Refresh. Entferne in der Cursor CLI den Marketplace lagune, füge ihn erneut hinzu und installiere Lagune dann über /plugins neu.

### Wie führe ich die Befehle von Lagune in Cursor aus?

Gib sie mit ihrem Namen ein, etwa /lagune-charter.

### Kann Cursor Lagune ohne Rückfrage ausführen?

Ja. Der Standardmodus Auto-review von Cursor erlaubt das bereits. Erlaube in der Cursor CLI Mcp(plugin-lagune-lagune:lagune_read) und Mcp(plugin-lagune-lagune:lagune_write), dazu Shell(npx:--yes lagune@*), wenn die Engine über npx läuft.
