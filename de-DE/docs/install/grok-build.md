# Lagune als Plugin in Grok Build installieren

> Installiere Lagune als Plugin in Grok Build, halte es aktuell und gib die Engine vorab frei.

Kanonische URL: https://lagune.ai/de-DE/docs/install/grok-build
Sprache: de-DE
Original: https://lagune.ai/docs/install/grok-build
Zuletzt aktualisiert: 2026-11-04

Installiere das Plugin über dein Terminal:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## Aktualisierung

Um **Lagune** zu aktualisieren, führe Folgendes aus:

```bash
grok plugin update lagune
```

## Befehle

Gib die Befehle mit ihrem Namen ein, etwa `/lagune-charter`, oder mit vorangestelltem Plugin-Namen, etwa `/lagune:lagune-charter`.

---

**Berechtigungen**

Die Engine läuft über zwei Tools: `lagune_read` liest nur dein Projekt und `lagune_write` schreibt nur in `.lagune/`. Um sie vorab zu erlauben, füge diese Regeln zu `~/.grok/config.toml` hinzu:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

Läuft die Engine über **npx**, wie bei **skills.sh**, erlaube `Bash(npx --yes lagune@*)`.

## Häufige Fragen

### Wie installiere ich Lagune in Grok Build?

Führe grok plugin install wellwelwel/lagune@plugin-grok --trust aus.

### Wie aktualisiere ich Lagune in Grok Build?

Führe grok plugin update lagune aus.

### Wie führe ich die Befehle von Lagune in Grok Build aus?

Gib sie mit ihrem Namen ein, etwa /lagune-charter, oder mit vorangestelltem Plugin-Namen, etwa /lagune:lagune-charter.

### Kann Grok Build Lagune ohne Rückfrage ausführen?

Ja. Erlaube MCPTool(lagune__lagune_read) und MCPTool(lagune__lagune_write) in der Konfiguration von Grok Build, dazu Bash(npx --yes lagune@*), wenn die Engine über npx läuft.
