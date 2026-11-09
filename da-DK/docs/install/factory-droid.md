# Installér Lagune i Factory Droid som et plugin

> Installér Lagune i Factory Droid som et plugin, hold det opdateret, og giv dets motors værktøjer tilladelse.

Kanonisk URL: https://lagune.ai/da-DK/docs/install/factory-droid
Sprog: da-DK
Original: https://lagune.ai/docs/install/factory-droid
Sidst opdateret: 2026-11-09

Installér pluginnet fra din terminal:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## Opdatering

Kør følgende for at opdatere **Lagune**:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## Kommandoer

Skriv kommandoerne ved deres navn, såsom `/lagune-charter`.

## Ofte stillede spørgsmål

### Hvordan installerer jeg Lagune i Factory Droid?

Kør droid plugin marketplace add wellwelwel/lagune og derefter droid plugin install lagune@lagune.

### Hvordan opdaterer jeg Lagune i Factory Droid?

Kør droid plugin marketplace update lagune og derefter droid plugin update lagune@lagune.

### Hvordan kører jeg kommandoerne i Lagune i Factory Droid?

Skriv dem ved deres navn, såsom /lagune-charter.

### Kan Factory Droid køre Lagune uden at bede om tilladelse?

Ja. Vælg altid at tillade lagune_read og lagune_write, når Factory Droid spørger. Den spørger igen, efter at den har synkroniseret et nyt commit fra markedspladsen lagune.
