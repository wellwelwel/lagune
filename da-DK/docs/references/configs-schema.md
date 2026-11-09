# Skema for configs

> JSON Schema for konfigurationen af et Lagune-projekt, til autofuldførelse og validering i din editor, der følger den aktuelle version af Lagune eller er fastlåst til en bestemt version.

Kanonisk URL: https://lagune.ai/da-DK/docs/references/configs-schema
Sprog: da-DK
Original: https://lagune.ai/docs/references/configs-schema
Sidst opdateret: 2026-11-09

`.lagune/configs.json` registrerer de [**kategorier**](https://lagune.ai/da-DK/docs/categories), et projekt bruger, indekserer dets egne [**specialiseringer**](https://lagune.ai/da-DK/docs/catalog) og bestemmer, hvad [**tjekkene**](https://lagune.ai/da-DK/docs/hooks/configure) udelader. Dets JSON Schema lader din editor autofuldføre hvert felt og markere en tastefejl eller en ukendt kategori, mens du redigerer filen.

## Det aktuelle skema

Hver gang **Lagune** skriver filen og ikke finder nogen `$schema` i den, peger det filen mod det aktuelle skema:

```json
{
  "$schema": "https://lagune.ai/schemas/configs.json",
  "categories": ["owasp", "javascript"]
}
```

Denne adresse følger altid den aktuelle version af **Lagune**. En fil, der er skrevet før **Lagune** 0.16.0, får den ved sin næste ændring, og hver fase gør opmærksom på det indtil da.

## Fastlås en version

Hver udgivelse af **Lagune** fra 0.16.0 og frem indeholder skemaet, som det var i den version, udgivet på **npm** og leveret af **jsDelivr**. Hvis du vil fastlåse en, så sæt versionen efter `lagune@` i adressen i `$schema`:

```json
{
  "$schema": "https://cdn.jsdelivr.net/npm/lagune@0.16.0/schemas/configs.json"
}
```

Versionen accepterer ethvert semver-interval:

| Version               | Skema                                 |
| --------------------- | ------------------------------------- |
| `0.16.0`              | Det fra 0.16.0                        |
| `0.16.x` eller `0.16` | Det fra den seneste udgivelse af 0.16 |
| `0.x` eller `0`       | Det fra den seneste udgivelse af 0.x  |
| `latest`              | Det fra den seneste udgivelse         |

## Ofte stillede spørgsmål

### Har Lagune brug for skemaet?

Nej. Skemaet hjælper kun din editor, og Lagune læser filen på samme måde med eller uden $schema.

### Overskriver Lagune et fastlåst skema?

Nej. Lagune skriver kun $schema, når filen ikke har noget, og beholder enhver adresse, du angiver.

### Hvornår skal jeg fastlåse en version?

Når projektet kører en bestemt version af Lagune, så din editor validerer filen mod det, den version accepterer.
