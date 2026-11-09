# Installer Lagune som plugin i Muse Code

> Installer Lagune som plugin i Muse Code, hold det oppdatert og kjør motoren i sandkassen.

Kanonisk URL: https://lagune.ai/no-NO/docs/install/muse-code
Språk: no-NO
Original: https://lagune.ai/docs/install/muse-code
Sist oppdatert: 2026-11-09

Installer pluginen fra terminalen:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## Oppdatering

Frisk opp markedsplassen og installer pluginen på nytt for å oppdatere **Lagune**:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## Kommandoer

Skriv inn kommandoene med navn, for eksempel `/lagune-charter`, eller med navnet på pluginen foran, for eksempel `/lagune:lagune-charter`.

---

**Sandkasse**

Sandkassen i **Muse Code** kan ikke laste ned motoren. Installer den i prosjektet ditt fra din egen terminal, først én gang og deretter etter hver oppdatering:

```bash
npm i -D lagune@0.18.1
```

## Vanlige spørsmål

### Hvordan installerer jeg Lagune i Muse Code?

Kjør muse plugins marketplace add lagune wellwelwel/lagune, deretter muse plugins install lagune@lagune.

### Hvordan oppdaterer jeg Lagune i Muse Code?

Kjør muse plugins marketplace update lagune, og installer deretter på nytt med muse plugins remove lagune og muse plugins install lagune@lagune.

### Hvordan kjører jeg kommandoene til Lagune i Muse Code?

Skriv dem inn med navn, for eksempel /lagune-charter, eller med navnet på pluginen foran, for eksempel /lagune:lagune-charter.

### Fungerer Lagune i sandkassen til Muse Code?

Ja, når du installerer motoren i prosjektet ditt med npm i -D lagune@0.18.1 fra din egen terminal, først én gang og deretter etter hver oppdatering.
