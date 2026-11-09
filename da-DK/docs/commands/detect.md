# /lagune-detect: Kortlæg dit system og dets risici

> Læs din kode, og kortlæg, hvad dit system gør, og hvor risiciene er.

Kanonisk URL: https://lagune.ai/da-DK/docs/commands/detect
Sprog: da-DK
Original: https://lagune.ai/docs/commands/detect
Sidst opdateret: 2026-11-09

🔬 Find ud af, hvad dit system virkelig gør, og hvor risiciene er.

Detect læser koden og registrerer kun det, den faktisk finder, med det belæg, de senere faser har brug for. Dens styrende instruks er at opdage, ikke at opfinde.

## Brug

**Fuld scanning**

```prompt
/lagune-detect
```

**Angiv stier**

```prompt
/lagune-detect src/routes/ src/auth.ts
```

**Beskriv en bekymring**

```prompt
/lagune-detect sørg for, at kundedata aldrig bliver eksponeret
```

## Hvad den kortlægger

**Lagune** læser koden og kortlægger det, den finder. Hvert fund indeholder, hvad det er, hvorfor det betyder noget, og belægget. For eksempel:

- **Filupload**, systemet tager imod filer fra brugerne:
  - _Hvorfor det betyder noget:_ en fil forklædt som et billede kan skjule ondsindet kode.
  - _Belæg:_ handleren til `POST /upload` stoler på den MIME-type, klienten sender, uden at tjekke filens reelle type.
- **Login og sessioner**, brugerne logger ind for at nå deres konto:
  - _Hvorfor det betyder noget:_ svag håndtering af sessioner gør det muligt for én konto at blive overtaget af en anden.
  - _Belæg:_ logikken, der udsteder sessioner, hvor sessionerne udstedes uden udløbstid.

Undervejs giver detect hver specialisering i dit projekts [katalog](https://lagune.ai/da-DK/docs/catalog) en afgørelse op mod koden, anvender dem, hvis kontekst er til stede, og registrerer dem under **Applied specializations**, den liste, harden og verify genbruger.

Derfra har du et klart kort over, hvad dit system gør, og hvor risiciene ligger, klar til at de næste trin kan handle på det.

**Tip**

- Når du kører den igen, bliver kortlægningen opdateret: løste fund forsvinder, og nye kommer til.
- Kortlægningen ligger i `.lagune/memory/detect.md`.

## Næste trin

Gør kortlægningen til en plan: [`/lagune-plan`](https://lagune.ai/da-DK/docs/commands/plan).

## Ofte stillede spørgsmål

### Hvad gør /lagune-detect?

Den læser din kode og kortlægger, hvad dit system gør, og hvor risiciene er, og registrerer kun det, den faktisk finder. Dens regel er at opdage, ikke at opfinde.

### Hvad er et fund i Lagune?

Et fund er én opdaget risiko med det, den er, hvorfor den betyder noget, og belægget i koden. Det er den sporede enhed, som plan, harden og verify fører videre.

### Hvor bliver kortlægningen gemt?

I .lagune/memory/detect.md.

### Hvilke specialiseringer bruger detect?

Hver specialisering i dit projekts katalog får en afgørelse op mod koden. Detect anvender dem, hvis kontekst er til stede, og registrerer dem under Applied specializations.
