# Installér Lagune i Codex CLI som et plugin

> Installér Lagune i Codex CLI som et plugin, hold det opdateret, og kør dets motor inde i sandboxen.

Kanonisk URL: https://lagune.ai/da-DK/docs/install/codex
Sprog: da-DK
Original: https://lagune.ai/docs/install/codex
Sidst opdateret: 2026-11-09

Installér pluginnet fra din terminal:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## Opdatering

Kør følgende for at opdatere **Lagune**:

```bash
codex plugin marketplace upgrade lagune
```

## Kommandoer

Skriv `$` og kommandoen under pluginnets navn efterfulgt af dit input, såsom `$lagune:lagune-charter` for `/lagune-charter`. Når du skriver `$`, vises kommandoerne, og når du vælger en, indsættes dens fulde navn.

---

**Sandbox**

Sandboxen i **Codex** har ingen netværksadgang. Installér motoren i dit projekt fra din egen terminal, én gang og efter hver opdatering:

```bash
npm i -D lagune@0.18.1
```

## Ofte stillede spørgsmål

### Hvordan installerer jeg Lagune i Codex CLI?

Kør codex plugin marketplace add wellwelwel/lagune og derefter codex plugin add lagune@lagune.

### Hvordan opdaterer jeg Lagune i Codex CLI?

Kør codex plugin marketplace upgrade lagune.

### Hvordan kører jeg kommandoerne i Lagune i Codex CLI?

Skriv $ og kommandoen under pluginnets navn efterfulgt af dit input, såsom $lagune:lagune-charter.

### Virker Lagune inde i sandboxen i Codex?

Ja, når du har installeret motoren i dit projekt med npm i -D lagune@0.18.1 fra din egen terminal, én gang og efter hver opdatering.
