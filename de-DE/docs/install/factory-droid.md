# Lagune als Plugin in Factory Droid installieren

> Installiere Lagune als Plugin in Factory Droid, halte es aktuell und erlaube die Tools der Engine.

Kanonische URL: https://lagune.ai/de-DE/docs/install/factory-droid
Sprache: de-DE
Original: https://lagune.ai/docs/install/factory-droid
Zuletzt aktualisiert: 2026-11-05

Installiere das Plugin über dein Terminal:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## Aktualisierung

Um **Lagune** zu aktualisieren, führe Folgendes aus:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## Befehle

Gib die Befehle mit ihrem Namen ein, etwa `/lagune-charter`.

---

**Berechtigungen**

Die Engine läuft über zwei Tools: `lagune_read` liest nur dein Projekt und `lagune_write` schreibt nur in `.lagune/`. Wenn **Factory Droid** nachfragt, erlaube jedes davon dauerhaft. Es fragt erneut, nachdem es einen neuen Commit im Marketplace `lagune` synchronisiert hat, was beim Start passieren kann.

## Häufige Fragen

### Wie installiere ich Lagune in Factory Droid?

Führe droid plugin marketplace add wellwelwel/lagune aus, dann droid plugin install lagune@lagune.

### Wie aktualisiere ich Lagune in Factory Droid?

Führe droid plugin marketplace update lagune aus, dann droid plugin update lagune@lagune.

### Wie führe ich die Befehle von Lagune in Factory Droid aus?

Gib sie mit ihrem Namen ein, etwa /lagune-charter.

### Kann Factory Droid Lagune ohne Rückfrage ausführen?

Ja. Erlaube lagune_read und lagune_write dauerhaft, wenn Factory Droid nachfragt. Es fragt erneut, nachdem es einen neuen Commit im Marketplace lagune synchronisiert hat.
