# Lagune als Plugin in OpenCode installieren

> Installiere Lagune als Plugin in OpenCode 1.x und 2.x und halte es aktuell.

Kanonische URL: https://lagune.ai/de-DE/docs/install/opencode
Sprache: de-DE
Original: https://lagune.ai/docs/install/opencode
Zuletzt aktualisiert: 2026-11-07

**OpenCode 2.x**

Installiere das Plugin über dein Terminal:

```bash
opencode plugin add lagune
```

Oder füge es der Liste `plugins` in `opencode.json` hinzu:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

Installiere das Plugin über dein Terminal in deinem Projekt oder ergänze `-g`, um es für alle deine Projekte zu installieren:

```bash
opencode plugin lagune
```

Oder füge es der Liste `plugin` in `opencode.json` hinzu:

```json
{
  "plugin": ["lagune"]
}
```

## Aktualisierung

**OpenCode 2.x**

Um **Lagune** zu aktualisieren, führe Folgendes aus:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

Um **Lagune** zu aktualisieren, installiere die neue Version über die alte und ergänze `-g`, falls du das Plugin für alle deine Projekte installiert hast:

```bash
opencode plugin lagune@0.18.2 --force
```

## Befehle

**OpenCode 2.x**

Gib `@` ein, wähle den Befehl, etwa `@lagune-charter`, und schreibe deine Eingabe dann in dieselbe Nachricht.

**OpenCode 1.x**

Gib die Befehle mit ihrem Namen ein, etwa `/lagune-charter`. Sie stehen unter `/skills`, nicht im Menü `/`.

## Häufige Fragen

### Wie installiere ich Lagune in OpenCode?

Führe in OpenCode 2.x opencode plugin add lagune aus. Führe in OpenCode 1.x opencode plugin lagune aus und ergänze -g, um das Plugin für alle deine Projekte zu installieren.

### Wie aktualisiere ich Lagune in OpenCode?

Führe in OpenCode 2.x opencode plugin update lagune aus, dann opencode reload. Führe in OpenCode 1.x opencode plugin lagune@0.18.2 --force aus.

### Wie führe ich die Befehle von Lagune in OpenCode aus?

Gib in OpenCode 2.x @ ein, wähle den Befehl, etwa @lagune-charter, und schreibe deine Eingabe dann in dieselbe Nachricht. Gib sie in OpenCode 1.x mit ihrem Namen ein, etwa /lagune-charter, oder finde sie unter /skills.

### Fragt OpenCode um Erlaubnis, bevor Lagune läuft?

Nein. OpenCode führt die beiden Tools der Engine, lagune_read und lagune_write, ohne Rückfrage aus.
