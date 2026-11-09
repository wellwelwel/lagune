# Spec-Driven Development: Sikre det som spesifikasjonen din bygger

> Kombiner Lagune med Superpowers, Spec Kit eller OpenSpec: fastsett sikkerhetsprinsippene ut fra spesifikasjonen, og implementer den deretter med /lagune, slik at hver oppgave herdes mens koden skrives.

Kanonisk URL: https://lagune.ai/no-NO/docs/examples/spec-driven-development
Språk: no-NO
Original: https://lagune.ai/docs/examples/spec-driven-development
Sist oppdatert: 2026-11-09

Kombiner **Lagune** med et verktøy for Spec-Driven Development, som [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit) eller [**OpenSpec**](https://github.com/Fission-AI/OpenSpec): verktøyet ditt bestemmer hva som skal bygges, og **Lagune** bestemmer hvordan det forblir sikkert.

## Slik passer det inn

**Lagune** kobler seg på flyten i verktøyet ditt på to punkter og lar resten være uendret:

1. Når verktøyet ditt har skrevet spesifikasjonen, leser [`/lagune-charter`](https://lagune.ai/no-NO/docs/commands/charter) den og fastsetter sikkerhetsprinsippene funksjonen krever, før det finnes noe kode.
2. Når du merker implementeringskommandoen i verktøyet ditt med [`/lagune`](https://lagune.ai/no-NO/docs/commands/lagune), herder den hver oppgave etter disse prinsippene mens koden skrives.

**Tips**

Erstatt stien til spesifikasjonen i hvert eksempel med filen verktøyet ditt skrev. Når prosjektet allerede har sikkerhetsprinsipper, oppdaterer det samme steget dem med det den nye funksjonen trenger.

## Prompteksempler

Send promptene i rekkefølge, hver først når den forrige er ferdig.

```prompt
/superpowers:brainstorming Kjøp som gjest med kortbetaling.
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
/speckit.specify Kjøp som gjest med kortbetaling.
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
