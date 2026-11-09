# /lagune-verify: Bevis at sikringstiltakene holder

> Bevis at hver utbedring som er tatt i bruk, holder, og lukk deretter de som gjør det.

Kanonisk URL: https://lagune.ai/no-NO/docs/commands/verify
Språk: no-NO
Original: https://lagune.ai/docs/commands/verify
Sist oppdatert: 2026-11-09

⚖️ Bevis at hver utbedring som er tatt i bruk, holder, ved å lese koden og holde den opp mot det harden registrerte, og lukk deretter de som gjør det.

## Bruk

**Verifiser alt**

```prompt
/lagune-verify
```

**Oppgi stier**

```prompt
/lagune-verify src/routes/upload.ts
```

**Etter prioritet**

```prompt
/lagune-verify kritisk og høy prioritet
```

## Slik fungerer det

Fasen leser koden på hvert sted harden registrerte, og bekrefter at den virkelig stemmer med påstanden. Beviset ligger i nettopp dette: koden holdt opp mot loggen. Hvert sikringstiltak får én av tre konklusjoner:

| Konklusjon                   | Betydning                                                                 |
| ---------------------------- | ------------------------------------------------------------------------- |
| ✅ Risk closed               | Koden gjør nøyaktig det loggen påstår.                                    |
| ❌ Risk not closed           | Sikringstiltaket er fortsatt åpent. Verify sender deg tilbake til harden. |
| ❓ Cannot tell from the code | Belegget er ikke synlig i koden alene.                                    |

En risiko som er bevist lukket, blir deretter tatt ut av kjeden, med din bekreftelse. For eksempel:

- **Filopplasting** (Konklusjon: **✅ Risk closed**)
  - _Hvordan det ble bevist:_ Verify leste opplastingshandleren og så at den finner filens faktiske type ut fra innholdet, håndhever en størrelsesgrense og avviser alt annet, nøyaktig slik loggen påstår.
  - _Belegg:_ funksjonen `handleUpload`, som finner den faktiske filtypen ut fra innholdet.

Er risikoen ikke lukket, sier verify det rett ut og sender deg tilbake til [`/lagune-harden`](https://lagune.ai/no-NO/docs/commands/harden), siden utbedringen fortsatt er åpen.

**Tips**

- Fasen bygger helt på herdingsloggen.
- Den leser bare koden din for å vurdere den, og svekker aldri et sikringstiltak eller skriver om koden for å få en konklusjon til å gå gjennom.
- Kjører du den på nytt, blir konklusjonene avstemt: Utdaterte faller bort, og en risiko som ikke lenger er lukket, blir flagget igjen.
- Når en risiko er bevist lukket, spør den én gang og fjerner deretter funnet fra hele kjeden (detect, plan, harden og sporingen).
- Den skriver ingen egen rapport: Hver konklusjon ligger i blokken for sikringstiltaket i `.lagune/memory/harden.md`, der harden leser den ved neste kjøring.

**Avhenger av harden**

Verify bygger på [`/lagune-harden`](https://lagune.ai/no-NO/docs/commands/harden).

## Syklusen lukkes

Når alt innenfor omfanget er tatt ut, er syklusen i ro. Den åpnes igjen bare når koden endres. Sikkerhet er lukkbar, så flyten har en sluttilstand, ikke en endeløs løkke.

## Vanlige spørsmål

### Hvordan verifiserer Lagune en utbedring?

/lagune-verify leser koden og holder den opp mot det harden registrerte, og gir én av tre konklusjoner: Risk closed, Risk not closed eller Cannot tell from the code.

### Hva vil det si å ta ut et funn?

Når verify beviser at en risiko er lukket, blir funnet tatt ut: fjernet fra hele kjeden, med din bekreftelse, slik at det ikke blir behandlet på nytt.

### Kan sikkerhetsarbeid noen gang bli ferdig?

Ja. SDH er lukkbar: Et funn som er bevist lukket, blir tatt ut, så flyten har en sluttilstand, ikke en endeløs løkke.
