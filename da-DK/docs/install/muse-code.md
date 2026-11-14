# Installér Lagune i Muse Code som et plugin

> Installér Lagune i Muse Code som et plugin, hold det opdateret, og kør dets motor inde i sandboxen.

Kanonisk URL: https://lagune.ai/da-DK/docs/install/muse-code
Sprog: da-DK
Original: https://lagune.ai/docs/install/muse-code
Sidst opdateret: 2026-11-09

Installér pluginnet fra din terminal:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## Opdatering

Opdatér markedspladsen, og geninstallér pluginnet for at opdatere **Lagune**:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## Kommandoer

Skriv kommandoerne ved deres navn, såsom `/lagune-charter`, eller under pluginnets navn, såsom `/lagune:lagune-charter`.

---

**Sandbox**

Sandboxen i **Muse Code** kan ikke downloade motoren. Installér den i dit projekt fra din egen terminal, én gang og efter hver opdatering:

```bash
npm i -D lagune@0.19.0
```

## Ofte stillede spørgsmål

### Hvordan installerer jeg Lagune i Muse Code?

Kør muse plugins marketplace add lagune wellwelwel/lagune og derefter muse plugins install lagune@lagune.

### Hvordan opdaterer jeg Lagune i Muse Code?

Kør muse plugins marketplace update lagune, og geninstallér derefter med muse plugins remove lagune og muse plugins install lagune@lagune.

### Hvordan kører jeg kommandoerne i Lagune i Muse Code?

Skriv dem ved deres navn, såsom /lagune-charter, eller under pluginnets navn, såsom /lagune:lagune-charter.

### Virker Lagune inde i sandboxen i Muse Code?

Ja, når du har installeret motoren i dit projekt med npm i -D lagune@0.19.0 fra din egen terminal, én gang og efter hver opdatering.
