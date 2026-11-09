# /lagune-detect: Kartlegg systemet ditt og risikoene

> Les koden din og kartlegg hva systemet gjør og hvor risikoene ligger.

Kanonisk URL: https://lagune.ai/no-NO/docs/commands/detect
Språk: no-NO
Original: https://lagune.ai/docs/commands/detect
Sist oppdatert: 2026-11-09

🔬 Finn ut hva systemet ditt egentlig gjør og hvor risikoene ligger.

Detect leser koden og registrerer bare det den faktisk finner, med belegget de senere fasene trenger. Det overordnede prinsippet er å oppdage, ikke å finne på.

## Bruk

**Full gjennomgang**

```prompt
/lagune-detect
```

**Oppgi stier**

```prompt
/lagune-detect src/routes/ src/auth.ts
```

**Beskriv en problemstilling**

```prompt
/lagune-detect sørg for at kundedata aldri blir eksponert
```

## Hva fasen kartlegger

**Lagune** leser koden og kartlegger det den finner. Hvert funn sier hva det er, hvorfor det er viktig og hva belegget er. For eksempel:

- **Filopplasting**, systemet tar imot filer fra brukerne:
  - _Hvorfor det er viktig:_ En fil forkledd som et bilde kan skjule skadelig kode.
  - _Belegg:_ Handleren for `POST /upload` stoler på MIME-typen klienten sender, uten å sjekke den faktiske filtypen.
- **Innlogging og økter**, brukerne logger inn for å nå kontoen sin:
  - _Hvorfor det er viktig:_ Svak økthåndtering gjør det mulig for én konto å bli overtatt av en annen.
  - _Belegg:_ logikken som utsteder økter, der øktene utstedes uten noen utløpstid.

Underveis gir detect hver spesialisering i [katalogen](https://lagune.ai/no-NO/docs/catalog) for prosjektet ditt en konklusjon ut fra koden, tar i bruk dem der konteksten finnes, og registrerer dem under **Applied specializations**, listen som harden og verify bruker på nytt.

Deretter har du et klart kart over hva systemet ditt gjør og hvor risikoene ligger, klart for at de neste stegene kan handle ut fra det.

**Tips**

- Kjører du den på nytt, blir kartet oppdatert: Løste funn faller bort, og nye kommer til.
- Kartleggingen fra detect ligger i `.lagune/memory/detect.md`.

## Neste steg

Gjør kartleggingen om til en plan: [`/lagune-plan`](https://lagune.ai/no-NO/docs/commands/plan).

## Vanlige spørsmål

### Hva gjør /lagune-detect?

Den leser koden din og kartlegger hva systemet gjør og hvor risikoene ligger, og registrerer bare det den faktisk finner. Regelen er å oppdage, ikke å finne på.

### Hva er et funn i Lagune?

Et funn er én oppdaget risiko, med hva den er, hvorfor den er viktig og belegget i koden. Det er den sporede enheten som plan, harden og verify tar videre.

### Hvor lagres kartleggingen fra detect?

I .lagune/memory/detect.md.

### Hvilke spesialiseringer bruker detect?

Hver spesialisering i katalogen for prosjektet ditt får en konklusjon ut fra koden. Detect tar i bruk dem der konteksten finnes, og registrerer dem under Applied specializations.
