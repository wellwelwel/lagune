# Lagune als Plugin in Codex CLI installieren

> Installiere Lagune als Plugin in Codex CLI, halte es aktuell und führe die Engine in der Sandbox aus.

Kanonische URL: https://lagune.ai/de-DE/docs/install/codex
Sprache: de-DE
Original: https://lagune.ai/docs/install/codex
Zuletzt aktualisiert: 2026-11-03

Installiere das Plugin über dein Terminal:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## Aktualisierung

Um **Lagune** zu aktualisieren, führe Folgendes aus:

```bash
codex plugin marketplace upgrade lagune
```

## Befehle

Gib `$` und den Befehl mit vorangestelltem Plugin-Namen ein, gefolgt von deiner Eingabe, etwa `$lagune:lagune-charter` für `/lagune-charter`. Gibst du `$` ein, erscheinen die Befehle in einer Liste, und wählst du einen aus, wird sein vollständiger Name eingefügt.

---

**Berechtigungen**

Die Sandbox von **Codex** hat keinen Netzwerkzugriff. Installiere die Engine über dein eigenes Terminal in deinem Projekt, einmal und nach jeder Aktualisierung erneut:

```bash
npm i -D lagune@0.18.0
```

## Häufige Fragen

### Wie installiere ich Lagune in Codex CLI?

Führe codex plugin marketplace add wellwelwel/lagune aus, dann codex plugin add lagune@lagune.

### Wie aktualisiere ich Lagune in Codex CLI?

Führe codex plugin marketplace upgrade lagune aus.

### Wie führe ich die Befehle von Lagune in Codex CLI aus?

Gib $ und den Befehl mit vorangestelltem Plugin-Namen ein, gefolgt von deiner Eingabe, etwa $lagune:lagune-charter.

### Funktioniert Lagune in der Sandbox von Codex?

Ja, sobald du die Engine mit npm i -D lagune@0.18.0 über dein eigenes Terminal in deinem Projekt installierst, einmal und nach jeder Aktualisierung erneut.
