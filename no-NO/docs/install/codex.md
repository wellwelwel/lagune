# Installer Lagune som plugin i Codex CLI

> Installer Lagune som plugin i Codex CLI, hold den oppdatert og kjør motoren i sandkassen.

Kanonisk URL: https://lagune.ai/no-NO/docs/install/codex
Språk: no-NO
Original: https://lagune.ai/docs/install/codex
Sist oppdatert: 2026-11-09

Installer pluginen fra terminalen:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## Oppdatering

Oppdater **Lagune** ved å kjøre:

```bash
codex plugin marketplace upgrade lagune
```

## Kommandoer

Skriv `$` og kommandoen med navnet på pluginen foran, etterfulgt av teksten din, for eksempel `$lagune:lagune-charter` for `/lagune-charter`. Når du skriver `$`, vises en liste over kommandoene, og velger du én, settes hele navnet inn.

---

**Sandkasse**

Sandkassen i **Codex** har ingen nettverkstilgang. Installer motoren i prosjektet ditt fra din egen terminal, én gang og etter hver oppdatering:

```bash
npm i -D lagune@0.18.1
```

## Vanlige spørsmål

### Hvordan installerer jeg Lagune i Codex CLI?

Kjør codex plugin marketplace add wellwelwel/lagune og deretter codex plugin add lagune@lagune.

### Hvordan oppdaterer jeg Lagune i Codex CLI?

Kjør codex plugin marketplace upgrade lagune.

### Hvordan kjører jeg kommandoene til Lagune i Codex CLI?

Skriv $ og kommandoen med navnet på pluginen foran, etterfulgt av teksten din, for eksempel $lagune:lagune-charter.

### Fungerer Lagune i sandkassen til Codex?

Ja, når du har installert motoren i prosjektet ditt med npm i -D lagune@0.18.1 fra din egen terminal, én gang og etter hver oppdatering.
