# /lagune-harden: Ta i bruk sikkerhetsutbedringer i koden din

> Ta i bruk utbedringene fra planen i koden din, trygt og én om gangen.

Kanonisk URL: https://lagune.ai/no-NO/docs/commands/harden
Språk: no-NO
Original: https://lagune.ai/docs/commands/harden
Sist oppdatert: 2026-11-09

🔧 Ta i bruk utbedringene fra planen i koden din, trygt og én om gangen.

## Bruk

**Ta i bruk alt**

```prompt
/lagune-harden
```

**Oppgi stier**

```prompt
/lagune-harden src/routes/upload.ts
```

**Etter prioritet**

```prompt
/lagune-harden kritisk og høy prioritet
```

## Slik fungerer det

Planen har allerede bestemt hver utbedring, så harden tar dem bare i bruk. Siden dette er den eneste fasen som rører koden din, går den forsiktig frem: Den tar i bruk én utbedring om gangen, slik at hver endring er lett å gå gjennom, og den svekker aldri et sikringstiltak for å få en utbedring til å passe. For eksempel utbedringen for opplastingen:

- **Filopplasting** (Status: **Applied**)
  - _Hva som ble endret:_ sjekker filens faktiske type og størrelse, avviser alt uventet, gir den nytt navn ved lagring og lagrer den der den ikke kan kjøres som kode.
  - _Hvor:_ funksjonen `handleUpload`, pluss lagringshjelperen den kaller.

Kan en utbedring ikke tas fullt i bruk, gjør harden det som trygt lar seg gjøre, og markerer resten som **Partial** eller **Blocked**, slik at utbedringen står åpen.

**Applied er ikke verifisert**

Applied betyr ikke at noe er bevist ennå. Det er det [verify](https://lagune.ai/no-NO/docs/commands/verify) er til for.

**Tips**

- Fasen bygger helt på planen. Er en utbedring eller fil aldri blitt planlagt, ber den deg kjøre `/lagune-plan` på den først.
- Kjører du den på nytt, blir loggen avstemt: Endringer som er rullet tilbake, faller bort, og utbedringer som nettopp er tatt i bruk, kommer til.
- Herdingsloggen ligger i `.lagune/memory/harden.md`.

**Avhenger av plan og endrer koden din**

Harden bygger på [`/lagune-plan`](https://lagune.ai/no-NO/docs/commands/plan). Det er den eneste fasen som endrer koden din.

## Neste steg

Bevis at hver utbedring holder: [`/lagune-verify`](https://lagune.ai/no-NO/docs/commands/verify).

## Vanlige spørsmål

### Endrer /lagune-harden koden min?

Ja. Det er den eneste fasen som rører koden din, og den tar i bruk utbedringene fra planen én om gangen.

### Hva betyr Applied, Partial og Blocked?

Det er statusen Lagune registrerer for hver utbedring. Applied betyr at utbedringen ble gjort, Partial at bare en del av den ble gjort, og Blocked at den ikke kunne tas i bruk. Applied betyr ikke at noe er bevist ennå.

### Tar Lagune i bruk utbedringer uten å spørre?

Om en endring trenger godkjenningen din, avgjør agenten din og tillatelsesmodusen du kjører den i, ikke Lagune, som ikke legger til noe eget bekreftelsestrinn. Den svekker likevel aldri et sikringstiltak for å oppfylle en utbedring, og hvis en utbedring ville komme i konflikt med en regel i charter, stopper den og sier fra til deg først.
