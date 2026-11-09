# /lagune-harden: Gennemfør sikkerhedsrettelser i din kode

> Gennemfør planens rettelser i din kode, sikkert og én ad gangen.

Kanonisk URL: https://lagune.ai/da-DK/docs/commands/harden
Sprog: da-DK
Original: https://lagune.ai/docs/commands/harden
Sidst opdateret: 2026-11-09

🔧 Gennemfør planens rettelser i din kode, sikkert og én ad gangen.

## Brug

**Gennemfør alt**

```prompt
/lagune-harden
```

**Angiv stier**

```prompt
/lagune-harden src/routes/upload.ts
```

**Efter prioritet**

```prompt
/lagune-harden Critical og High
```

## Sådan virker det

Planen har allerede besluttet hver rettelse, så harden gennemfører den blot. Da det er den eneste fase, der rører din kode, går den forsigtigt frem: den gennemfører én rettelse ad gangen, så hver ændring forbliver nem at gennemse, og den svækker aldrig en kontrol for at få en rettelse til at passe. For eksempel rettelsen af uploaden:

- **Filupload** (status: **Applied**)
  - _Hvad der ændrede sig:_ tjekker filens reelle type og størrelse, afviser alt uventet, omdøber den ved lagring og gemmer den et sted, hvor den ikke kan køres som kode.
  - _Hvor:_ funktionen `handleUpload` samt den lagringshjælper, den kalder.

Hvis en rettelse ikke kan gennemføres fuldt ud, gør harden det, den sikkert kan, og markerer resten som **Partial** eller **Blocked**, så den forbliver åben.

**Applied er ikke verificeret**

Applied betyder ikke, at den er påvist endnu. Det er, hvad [verify](https://lagune.ai/da-DK/docs/commands/verify) er til.

**Tip**

- Den bygger udelukkende på planen. Hvis en rettelse eller en fil aldrig er blevet planlagt, beder den dig om først at køre `/lagune-plan` på den.
- Når du kører den igen, bliver hærdningsloggen afstemt: tilbagerullede ændringer forsvinder, og nyligt gennemførte rettelser kommer til.
- Hærdningsloggen ligger i `.lagune/memory/harden.md`.

**Afhænger af plan og ændrer din kode**

Harden bygger på [`/lagune-plan`](https://lagune.ai/da-DK/docs/commands/plan). Det er den eneste fase, der ændrer din kode.

## Næste trin

Påvis, at hver rettelse holder: [`/lagune-verify`](https://lagune.ai/da-DK/docs/commands/verify).

## Ofte stillede spørgsmål

### Ændrer /lagune-harden min kode?

Ja. Det er den eneste fase, der rører din kode, og den gennemfører planens rettelser én ad gangen.

### Hvad betyder Applied, Partial og Blocked?

Det er den status, Lagune registrerer for hver rettelse. Applied betyder, at rettelsen er gennemført, Partial, at kun en del af den er, og Blocked, at den ikke kunne gennemføres. Applied betyder ikke, at den er påvist endnu.

### Gennemfører Lagune rettelser uden at spørge?

Om en ændring kræver din godkendelse, afgøres af din agent og den tilladelsestilstand, du kører den i, ikke af Lagune, som ikke tilføjer nogen bekræftelse af sin egen. Den svækker dog aldrig en kontrol for at opfylde en rettelse, og hvis en rettelse ville komme i konflikt med en regel i charter, stopper den og fortæller dig det først.
