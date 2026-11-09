# Spec-Driven Development: Sikr det, som din spec bygger

> Kombinér Lagune med Superpowers, Spec Kit eller OpenSpec: fastlæg sikkerhedsprincipperne ud fra din spec, og implementér den derefter med /lagune, så hver opgave hærdes, mens koden skrives.

Kanonisk URL: https://lagune.ai/da-DK/docs/examples/spec-driven-development
Sprog: da-DK
Original: https://lagune.ai/docs/examples/spec-driven-development
Sidst opdateret: 2026-11-09

Kombinér **Lagune** med et værktøj til Spec-Driven Development, såsom [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit) eller [**OpenSpec**](https://github.com/Fission-AI/OpenSpec): dit værktøj bestemmer, hvad der skal bygges, og **Lagune** bestemmer, hvordan det forbliver sikkert.

## Sådan passer det ind

**Lagune** træder ind i dit værktøjs workflow to steder og lader resten være uændret:

1. Når dit værktøj har skrevet specen, læser [`/lagune-charter`](https://lagune.ai/da-DK/docs/commands/charter) den og fastlægger de sikkerhedsprincipper, som funktionen kræver, før der findes nogen kode.
2. Når du tilføjer [`/lagune`](https://lagune.ai/da-DK/docs/commands/lagune) til dit værktøjs implementeringskommando, hærder den hver opgave efter de principper, mens koden skrives.

**Tip**

Erstat stien til specen i hvert eksempel med den fil, dit værktøj har skrevet. Har projektet allerede sikkerhedsprincipper, opdaterer det samme trin dem med det, den nye funktion kræver.

## Eksempler på prompts

Send prompterne i rækkefølge, hver først når den forrige er færdig.

```prompt
/superpowers:brainstorming Køb som gæst med kortbetaling.
```

```prompt
/lagune-charter docs/superpowers/specs/2026-11-09-guest-checkout-design.md
```

```prompt
/superpowers:writing-plans
```

```prompt
/superpowers:executing-plans /lagune
```

```prompt
/speckit.specify Køb som gæst med kortbetaling.
```

```prompt
/lagune-charter specs/001-guest-checkout/spec.md
```

```prompt
/speckit.plan
```

```prompt
/speckit.tasks
```

```prompt
/speckit.implement /lagune
```

```prompt
/opsx:propose add-guest-checkout
```

```prompt
/lagune-charter openspec/changes/add-guest-checkout/proposal.md
```

```prompt
/opsx:apply /lagune
```

```prompt
/opsx:archive
```
