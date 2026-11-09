# /lagune: sikker kode mens KI-en din skriver den

> Bygg det du ber om, og herd det mens det skrives, styrt av sikkerhetsprinsippene dine og uten noen flyt å følge.

Kanonisk URL: https://lagune.ai/no-NO/docs/commands/lagune
Språk: no-NO
Original: https://lagune.ai/docs/commands/lagune
Sist oppdatert: 2026-11-09

⌨️ Få gjort arbeidet du ba om, sikret mens det skrives. **`/lagune`** tar imot hvilken som helst prompt på hvilket som helst stadium, bygger det du ville ha, og herder det med sikre standardinnstillinger før du får det tilbake.

## Bruk

Merk en hvilken som helst prompt med **`/lagune`**, og beskriv arbeidet slik du alltid ville gjort.

**📘 Instruksjoner for agenter**

```md
# Prosjektinstruksjonene mine for agenter

<!-- ... -->

## Sikkerhet

- Bruk skillen `/lagune` hver gang du bygger eller endrer kode, slik at den gjør koden sikrere som standard.
```

    - For eksempel: **AGENTS.md**, **CLAUDE.md**, **.github/copilot-instructions.md**, **.cursorrules** osv.

**💬 En funksjon**

```prompt
/lagune la brukerne laste opp et eget bilde på profilen sin.
```

**💬 En feilretting**

```prompt
/lagune ingenting skjer når brukeren sender inn skjemaet. Finn ut hva det kan være, og rett det.
```

**💬 En refaktorering**

```prompt
/lagune frikoble og forbedre payload-logikken
```

**Sikkerhetsprinsipper er valgfrie, men bedre å ha**

**`/lagune`** fungerer med eller uten sikkerhetsprinsipper. Har du dem, former prosjektets egne regler alt som bygges. Fastsett dem én gang med [`/lagune-charter`](https://lagune.ai/no-NO/docs/commands/charter).

## Slik fungerer det

Kommandoen pakker inn arbeidet i tre steg, uten å skrive noe til Lagune:

1. Den laster inn sikkerhetsprinsippene dine, hvis de finnes, og lar dem styre hele byggingen. Har du ingen ennå, faller den tilbake på et grunnlag som er sikkert som standard.
2. Den lister opp [katalogen](https://lagune.ai/no-NO/docs/catalog) for prosjektet ditt og laster bare inn spesialiseringene arbeidet ditt berører, den samme kunnskapen ved behov som revisjonsflyten bruker.
3. Den tar i bruk forsvaret mens koden skrives, og leser deretter sitt eget resultat på nytt for å bekrefte at sikringstiltakene faktisk holder, før du får arbeidet tilbake.

Resultatet er fungerende kode i prosjektet ditt, sikker fra første linje.

**Bruk den når som helst**

Ingen detect, ingen plan, ingen opprydding etterpå. **`/lagune`** passer like godt til et helt nytt prosjektskjelett som til en endring i en moden kodebase, og den herder arbeidet underveis, ikke senere.

## Hva den ikke gjør

- Den skriver ingenting til mappen `.lagune`, verken artefakter eller sporing, så det eneste den produserer, er den herdede koden du ba om.
- Den svekker ikke en regel for å etterkomme en prompt, så hvis det du ba om, ville bryte et av sikkerhetsprinsippene dine, stopper den og sier fra til deg først i stedet for å bygge det usikkert.

## Vanlige spørsmål

### Hva gjør /lagune?

Den tar imot hvilken som helst prompt på hvilket som helst stadium, bygger det du ba om, og herder det med sikre standardinnstillinger før du får det tilbake. Forsvaret blir tatt i bruk mens koden skrives, ikke senere.

### Trenger jeg sikkerhetsprinsipper for å bruke /lagune?

Nei. Den fungerer med eller uten. Med sikkerhetsprinsipper former prosjektets egne regler alt som bygges. Uten faller den tilbake på et grunnlag som er sikkert som standard.

### Hva er forskjellen på /lagune og Blue Team-flyten?

/lagune sikrer nytt arbeid mens du skriver det, uten noen flyt å følge. Blue Team-flyten kjører de fem revisjonsfasene i rekkefølge over et eksisterende prosjekt.

### Sporer /lagune funn eller skriver artefakter?

Nei. Den skriver ingenting til mappen .lagune, verken artefakter eller sporing. Det eneste den produserer, er den herdede koden du ba om.

### Hvordan får jeg agenten min til å bruke /lagune automatisk?

Legg til en instruksjon i instruksjonsfilen til agenten din (AGENTS.md, CLAUDE.md, .cursorrules og lignende) som ber den bruke skillen /lagune hver gang den bygger eller endrer kode.
