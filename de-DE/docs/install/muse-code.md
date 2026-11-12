# Lagune als Plugin in Muse Code installieren

> Installiere Lagune als Plugin in Muse Code, halte es aktuell und führe die Engine in der Sandbox aus.

Kanonische URL: https://lagune.ai/de-DE/docs/install/muse-code
Sprache: de-DE
Original: https://lagune.ai/docs/install/muse-code
Zuletzt aktualisiert: 2026-11-07

Installiere das Plugin über dein Terminal:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## Aktualisierung

Um **Lagune** zu aktualisieren, lade den Marketplace neu und installiere das Plugin erneut:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## Befehle

Gib die Befehle mit ihrem Namen ein, etwa `/lagune-charter`, oder mit vorangestelltem Plugin-Namen, etwa `/lagune:lagune-charter`.

---

**Sandbox**

Die Sandbox von **Muse Code** kann die Engine nicht herunterladen. Installiere sie über dein eigenes Terminal in deinem Projekt, einmal und nach jeder Aktualisierung erneut:

```bash
npm i -D lagune@0.18.2
```

## Häufige Fragen

### Wie installiere ich Lagune in Muse Code?

Führe muse plugins marketplace add lagune wellwelwel/lagune aus, dann muse plugins install lagune@lagune.

### Wie aktualisiere ich Lagune in Muse Code?

Führe muse plugins marketplace update lagune aus und installiere das Plugin dann mit muse plugins remove lagune und muse plugins install lagune@lagune neu.

### Wie führe ich die Befehle von Lagune in Muse Code aus?

Gib sie mit ihrem Namen ein, etwa /lagune-charter, oder mit vorangestelltem Plugin-Namen, etwa /lagune:lagune-charter.

### Funktioniert Lagune in der Sandbox von Muse Code?

Ja, sobald du die Engine mit npm i -D lagune@0.18.2 über dein eigenes Terminal in deinem Projekt installierst, einmal und nach jeder Aktualisierung erneut.
