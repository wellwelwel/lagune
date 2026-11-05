# Lagune als Paket in Pi installieren

> Installiere Lagune als Paket in Pi, über npm oder GitHub, und halte es aktuell.

Kanonische URL: https://lagune.ai/de-DE/docs/install/pi
Sprache: de-DE
Original: https://lagune.ai/docs/install/pi
Zuletzt aktualisiert: 2026-11-05

**npm**

Installiere das Paket über dein Terminal:

```bash
pi install npm:lagune
```

**GitHub**

Installiere den neuesten Commit von **GitHub**, der die Engine über **npx** startet:

```bash
pi install git:github.com/wellwelwel/lagune
```

## Aktualisierung

**npm**

Um **Lagune** zu aktualisieren, führe Folgendes aus:

```bash
pi update npm:lagune
```

**GitHub**

Um **Lagune** zu aktualisieren, führe Folgendes aus:

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` aktualisiert jedes Paket, das du installiert hast, während `pi update` allein nur **Pi** aktualisiert.

## Befehle

Gib die Befehle mit dem Präfix `skill:` ein, etwa `/skill:lagune-charter` für `/lagune-charter`.

## Häufige Fragen

### Wie installiere ich Lagune in Pi?

Führe pi install npm:lagune aus, oder pi install git:github.com/wellwelwel/lagune für den neuesten Commit von GitHub.

### Wie aktualisiere ich Lagune in Pi?

Führe pi update npm:lagune aus, oder pi update git:github.com/wellwelwel/lagune bei einer Installation von GitHub. pi update --extensions aktualisiert jedes Paket, das du installiert hast.

### Wie führe ich die Befehle von Lagune in Pi aus?

Gib sie mit dem Präfix skill: ein, etwa /skill:lagune-charter.
