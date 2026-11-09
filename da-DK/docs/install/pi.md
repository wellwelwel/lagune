# Installér Lagune i Pi som en pakke

> Installér Lagune i Pi som en pakke, fra npm eller fra GitHub, og hold det opdateret.

Kanonisk URL: https://lagune.ai/da-DK/docs/install/pi
Sprog: da-DK
Original: https://lagune.ai/docs/install/pi
Sidst opdateret: 2026-11-09

**npm**

Installér pakken fra din terminal:

```bash
pi install npm:lagune
```

**GitHub**

Installér det seneste commit fra **GitHub**, som kører motoren gennem **npx**:

```bash
pi install git:github.com/wellwelwel/lagune
```

## Opdatering

**npm**

Kør følgende for at opdatere **Lagune**:

```bash
pi update npm:lagune
```

**GitHub**

Kør følgende for at opdatere **Lagune**:

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` opdaterer alle de pakker, du har installeret, mens `pi update` alene kun opdaterer **Pi**.

## Kommandoer

Skriv kommandoerne med præfikset `skill:`, såsom `/skill:lagune-charter` for `/lagune-charter`.

## Ofte stillede spørgsmål

### Hvordan installerer jeg Lagune i Pi?

Kør pi install npm:lagune, eller pi install git:github.com/wellwelwel/lagune for at få det seneste commit fra GitHub.

### Hvordan opdaterer jeg Lagune i Pi?

Kør pi update npm:lagune, eller pi update git:github.com/wellwelwel/lagune for en installation fra GitHub. pi update --extensions opdaterer alle de pakker, du har installeret.

### Hvordan kører jeg kommandoerne i Lagune i Pi?

Skriv dem med præfikset skill:, såsom /skill:lagune-charter.
