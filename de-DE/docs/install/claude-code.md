# Lagune als Plugin in Claude Code installieren

> Installiere Lagune als Plugin in Claude Code, im Terminal, in der Erweiterung oder in der Desktop-App, halte es aktuell und gib die Engine vorab frei.

Kanonische URL: https://lagune.ai/de-DE/docs/install/claude-code
Sprache: de-DE
Original: https://lagune.ai/docs/install/claude-code
Zuletzt aktualisiert: 2026-11-04

**Terminal**

Installiere das Plugin über dein Terminal:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

Oder in einer Sitzung von **Claude Code**:

```text
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**Erweiterung**

- Gib `/plugin` ein und wähle **Manage plugins**.
- Füge `wellwelwel/lagune` im Tab **Marketplaces** hinzu.
- Installiere `lagune` im Tab **Plugins**.

**Desktop**

- Installiere **Lagune** über das Terminal oder die Erweiterung und wähle in der Erweiterung **Install for you**.
- Starte eine neue Sitzung in der Desktop-App: Sie lädt die Plugins, die du für dich selbst installierst.

## Aktualisierung

**Terminal**

Um **Lagune** zu aktualisieren, führe Folgendes aus:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

Für automatische Aktualisierungen wähle beim Marketplace `lagune` unter `/plugin` die Option **Enable auto-update**.

**Erweiterung**

- Gib `/plugin` ein und wähle **Manage plugins**.
- Öffne den Tab **Marketplaces**.
- Wähle das Aktualisierungssymbol bei `lagune`.

**Desktop**

- Aktualisiere **Lagune** über das Terminal oder die Erweiterung.
- Starte eine neue Sitzung in der Desktop-App.

## Befehle

Gib die Befehle mit ihrem Namen ein, etwa `/lagune-charter`, oder mit vorangestelltem Plugin-Namen, etwa `/lagune:lagune-charter`.

---

**Berechtigungen**

Die Engine läuft über zwei Tools: `lagune_read` liest nur dein Projekt und `lagune_write` schreibt nur in `.lagune/`. Um sie vorab zu erlauben, füge diese Regeln für ein einzelnes Projekt zu `.claude/settings.json` hinzu oder für alle Projekte zu `~/.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

Läuft die Engine über **npx**, wie bei **skills.sh**, erlaube `Bash(npx --yes lagune@*)`. Ist die Sandbox aktiv, füge außerdem `registry.npmjs.org` zu `sandbox.network.allowedDomains` hinzu.

## Häufige Fragen

### Wie installiere ich Lagune in Claude Code?

Führe claude plugin install lagune --marketplace wellwelwel/lagune aus. In einer Sitzung oder in der Erweiterung fügst du über die Plugin-Verwaltung den Marketplace wellwelwel/lagune hinzu und installierst lagune. Die Desktop-App lädt das Plugin, sobald du es im Terminal oder in der Erweiterung für dich selbst installierst.

### Wie aktualisiere ich Lagune in Claude Code?

Führe claude plugin marketplace update lagune aus, dann claude plugin update lagune@lagune, oder wähle beim Marketplace lagune unter /plugin die Option Enable auto-update. In der Erweiterung öffnest du über /plugin den Bereich Manage plugins und wählst das Aktualisierungssymbol beim Marketplace lagune. Die Desktop-App lädt die Aktualisierung in ihrer nächsten Sitzung.

### Wie führe ich die Befehle von Lagune in Claude Code aus?

Gib sie mit ihrem Namen ein, etwa /lagune-charter, oder mit vorangestelltem Plugin-Namen, etwa /lagune:lagune-charter.

### Kann Claude Code Lagune ohne Rückfrage ausführen?

Ja. Erlaube mcp__plugin_lagune_lagune__lagune_read und mcp__plugin_lagune_lagune__lagune_write in den Einstellungen von Claude Code, dazu Bash(npx --yes lagune@*), wenn die Engine über npx läuft.
