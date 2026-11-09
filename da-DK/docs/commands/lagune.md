# /lagune: Sikr koden, mens din AI skriver den

> Byg det, du beder om, og hærd det, mens det bliver skrevet, styret af sikkerhedsprincipperne og uden et workflow at følge.

Kanonisk URL: https://lagune.ai/da-DK/docs/commands/lagune
Sprog: da-DK
Original: https://lagune.ai/docs/commands/lagune
Sidst opdateret: 2026-11-09

⌨️ Få udført det arbejde, du bad om, sikret mens det bliver skrevet. **`/lagune`** tager imod enhver prompt i enhver fase, bygger det, du ønskede, og hærder det med sikre standardindstillinger, før den afleverer det.

## Brug

Tilføj **`/lagune`** til en hvilken som helst prompt, og beskriv arbejdet, som du plejer.

**📘 Instruktioner til agenten**

```md
# Mine projektinstruktioner til agenter

<!-- ... -->

## Sikkerhed

- Brug skillen `/lagune`, hver gang du bygger eller ændrer kode, så den forbedrer sikkerheden som standard.
```

    - For eksempel: **AGENTS.md**, **CLAUDE.md**, **.github/copilot-instructions.md**, **.cursorrules** osv.

**💬 En funktion**

```prompt
/lagune lad brugerne uploade et eget billede på deres profil.
```

**💬 En rettelse**

```prompt
/lagune der sker ingenting, når brugeren sender formularen. Undersøg, hvad det kan være, og ret det.
```

**💬 En refaktorering**

```prompt
/lagune afkobl og forbedr payload-logikken
```

**Charter er valgfrit, men bedre med**

**`/lagune`** kører med eller uden sikkerhedsprincipper. Med dem former dit projekts egne regler hvert build. Fastlæg dem én gang med [`/lagune-charter`](https://lagune.ai/da-DK/docs/commands/charter).

## Sådan virker det

Den indrammer arbejdet i tre trin uden at skrive noget til Lagune:

1. Den indlæser dine sikkerhedsprincipper, hvis de findes, og de styrer hele buildet, og når du endnu ikke har nogen, falder den tilbage på et grundlag, der er sikkert som standard.
2. Den oplister dit projekts [katalog](https://lagune.ai/da-DK/docs/catalog) og indlæser kun de specialiseringer, dit arbejde berører, den samme viden efter behov, som gennemgangen bruger.
3. Den anvender forsvaret, mens koden bliver skrevet, og læser derefter sit eget resultat igen for at bekræfte, at kontrollerne faktisk holder, før den afleverer arbejdet.

Resultatet er fungerende kode i dit projekt, sikker fra første linje.

**Brug den når som helst**

Ingen detect, ingen plan, ingen oprydning bagefter. **`/lagune`** passer lige så godt til et nyt skelet som til en ændring i en moden kodebase, og den hærder arbejdet undervejs, ikke senere.

## Hvad den ikke gør

- Den skriver intet til mappen `.lagune`, hverken artefakter eller sporing, så det eneste, den producerer, er den hærdede kode, du bad om.
- Den svækker ikke en regel for at imødekomme en prompt, så hvis det, du bad om, ville bryde et princip i charter, stopper den og fortæller dig det først i stedet for direkte at bygge det usikkert.

## Ofte stillede spørgsmål

### Hvad gør /lagune?

Den tager imod enhver prompt i enhver fase, bygger det, du bad om, og hærder det med sikre standardindstillinger, før den afleverer det. Forsvaret anvendes, mens koden bliver skrevet, ikke senere.

### Skal jeg have sikkerhedsprincipper for at bruge /lagune?

Nej. Den kører med eller uden. Med sikkerhedsprincipper former dit projekts egne regler hvert build. Uden dem falder den tilbage på et grundlag, der er sikkert som standard.

### Hvad er forskellen på /lagune og Blue Team-workflowet?

/lagune sikrer nyt arbejde, mens du skriver det, uden et workflow at følge. Blue Team-workflowet kører de fem faser af gennemgangen i rækkefølge over et eksisterende projekt.

### Sporer /lagune fund eller skriver artefakter?

Nej. Den skriver intet til mappen .lagune, hverken artefakter eller sporing. Det eneste, den producerer, er den hærdede kode, du bad om.

### Hvordan får jeg min agent til at bruge /lagune automatisk?

Tilføj en instruktion til din agents instruktionsfil (AGENTS.md, CLAUDE.md, .cursorrules og lignende), der beder den bruge skillen /lagune, hver gang den bygger eller ændrer kode.
