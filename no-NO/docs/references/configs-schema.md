# Konfigurasjonsskjema

> JSON Schema for konfigurasjonen i et prosjekt med Lagune, for autofullføring og validering i editoren din, enten det følger gjeldende versjon av Lagune eller er låst til en bestemt versjon.

Kanonisk URL: https://lagune.ai/no-NO/docs/references/configs-schema
Språk: no-NO
Original: https://lagune.ai/docs/references/configs-schema
Sist oppdatert: 2026-11-09

Filen `.lagune/configs.json` registrerer [**kategoriene**](https://lagune.ai/no-NO/docs/categories) et prosjekt bruker, indekserer prosjektets egne [**spesialiseringer**](https://lagune.ai/no-NO/docs/catalog) og angir hva [**kontrollene**](https://lagune.ai/no-NO/docs/hooks/configure) skal utelate. Med JSON Schema for filen kan editoren din autofullføre hvert felt og flagge en skrivefeil eller en ukjent kategori mens du redigerer.

## Gjeldende skjema

Hver gang **Lagune** skriver filen og ikke finner noen `$schema` i den, peker den filen mot gjeldende skjema:

```json
{
  "$schema": "https://lagune.ai/schemas/configs.json",
  "categories": ["owasp", "javascript"]
}
```

Denne adressen følger alltid gjeldende versjon av **Lagune**. En fil skrevet før **Lagune** 0.16.0 får den ved neste endring, og frem til da gjør hver fase deg oppmerksom på det.

## Lås en versjon

Hver utgivelse av **Lagune** fra og med 0.16.0 inneholder skjemaet slik det var i den versjonen, publisert på **npm** og levert av **jsDelivr**. For å låse en versjon setter du versjonen etter `lagune@` i adressen i `$schema`:

```json
{
  "$schema": "https://cdn.jsdelivr.net/npm/lagune@0.16.0/schemas/configs.json"
}
```

Versjonen godtar ethvert semver-område:

| Versjon               | Skjema                             |
| --------------------- | ---------------------------------- |
| `0.16.0`              | Det fra 0.16.0                     |
| `0.16.x` eller `0.16` | Det fra den nyeste 0.16-utgivelsen |
| `0.x` eller `0`       | Det fra den nyeste 0.x-utgivelsen  |
| `latest`              | Det fra den nyeste utgivelsen      |

## Vanlige spørsmål

### Trenger Lagune skjemaet?

Nei. Skjemaet hjelper bare editoren din, og Lagune leser filen på samme måte med eller uten $schema.

### Overskriver Lagune et låst skjema?

Nei. Lagune skriver $schema bare når filen mangler det, og beholder enhver adresse du har satt.

### Når bør jeg låse en versjon?

Når prosjektet kjører en bestemt versjon av Lagune, slik at editoren din validerer filen mot det den versjonen godtar.
