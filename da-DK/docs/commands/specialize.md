# /lagune-specialize: Træn en sikkerhedsspecialisering med almindelig tekst

> Destillér en sikkerhedskilde eller et emne, du giver den, til en ny specialisering, der indlæses efter behov.

Kanonisk URL: https://lagune.ai/da-DK/docs/commands/specialize
Sprog: da-DK
Original: https://lagune.ai/docs/commands/specialize
Sidst opdateret: 2026-11-09

🎓 Lær **Lagune** en ny specialisering ud fra en kilde eller et emne, du giver den.

Den læser materialet og destillerer det til en fokuseret, udelukkende defensiv specialisering, formet præcis som de [indbyggede](https://lagune.ai/da-DK/docs/catalog), så faserne detect og verify efterfølgende indlæser den som enhver anden. Den gennemgår og forklarer kun: den skriver aldrig angrebsinput eller exploits, og den rører aldrig din kode.

**Fra en artikel**

```prompt
# Et link eller en reference: Lagune destillerer det til forsvaret
/lagune-specialize https://owasp.org/www-community/attacks/SQL_Injection
```

**Fra et exploit**

```prompt
# Et angreb som kilde: specialiseringen er stadig forsvaret
/lagune-specialize "' OR 1=1 -- splejser SQL ind i forespørgselsteksten"
```

**Fra et emne**

```prompt
# Eller nævn blot, hvad den skal dække
/lagune-specialize SQL injection
```

**Et angreb kan være kilden, aldrig resultatet**

Det er fint at pege den mod et angreb, når målet er at forsvare sig mod det: en beskrivelse af et exploit er studiemateriale, som den destillerer til forsvaret. Den specialisering, den producerer, gennemgår og forklarer altid og producerer aldrig et fungerende exploit, en payload eller en omgåelse.

## Hvad den skriver

Resultatet er to filer i dit projekt, committet og til at gennemse sammen med din kode:

- Specialiseringen i `.lagune/catalog/<name>.md`, formet som de [indbyggede](https://lagune.ai/da-DK/docs/catalog).
- Dens post i `.lagune/configs.json`, hvor dit projekt indekserer sine egne specialiseringer, så kataloget kan flette dem med de indbyggede.

Derefter oplister den kataloget for at bekræfte, at den nye post er der. Dine egne specialiseringer er altid i kataloget, uanset dets kategorier. Du tilføjer aldrig en kommando eller rører pakken: en ny specialisering er én vidensfil plus én indekspost, skrevet ind i dit eget projekt.

## Forfin, overskriv aldrig

Når du specialiserer et navn, der allerede findes, hvad enten det er en indbygget som `regex` eller en, du tidligere har specialiseret, bliver den nuværende fil **afstemt** i stedet for erstattet. Den læser det, der står, folder den nye viden ind, beholder det, der stadig holder, og omskriver det, der har ændret sig. Intet bliver kasseret usét. En af dine egne specialiseringer overskygger en indbygget med samme navn, så du kan skærpe en indbygget til dit eget projekt uden at miste den.

**Tip**

- Den nye specialisering indlæses præcis som en indbygget: faserne detect og verify henter den efter behov, eller du kan selv indlæse den med `npx lagune read catalog <name>` og give den en opgave.
- Når materialet har en identificerbar oprindelse (en artikel, en forfatter, et link, en standard), krediterer specialiseringen den. Et rent emne har ingen kilde.

**Bemærk**

**Den kører kun, når du kalder den:** agenten starter den aldrig af sig selv.

## Ofte stillede spørgsmål

### Hvordan tilføjer jeg en egen sikkerhedsspecialisering?

Kør /lagune-specialize med en kilde eller et emne. Den destillerer det til en udelukkende defensiv specialisering, skrevet til .lagune/catalog/<name>.md, samt dens post i .lagune/configs.json.

### Kan Lagune lære af en beskrivelse af et exploit?

Ja, som kilde, aldrig som resultat. Et angreb kan være kilden, aldrig produktet. Specialize skriver aldrig angrebsinput eller exploits.

### Overskriver specialize de indbyggede specialiseringer?

Nej. Den forfiner, den overskriver aldrig.
