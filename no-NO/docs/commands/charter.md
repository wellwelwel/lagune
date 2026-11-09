# /lagune-charter: Fastsett sikkerhetsprinsippene dine

> Fastsett sikkerhetsprinsippene for prosjektet ditt, reglene hver senere fase følger, og registrer spesialiseringskategoriene som gjennomgangen av prosjektet støtter.

Kanonisk URL: https://lagune.ai/no-NO/docs/commands/charter
Språk: no-NO
Original: https://lagune.ai/docs/commands/charter
Sist oppdatert: 2026-11-09

🧬 Fortell **Lagune** hva prosjektet ditt er, så gjør det dette om til sikkerhetsreglene dine (eller, uten en beskrivelse, utleder dem fra prosjektet alene).

Charter er det overordnede laget: et sett sikkerhetsprinsipper der sikkerheten kommer først, og som hver senere fase må respektere. Tenk på det som en kompileringskontroll av sikkerhetsnivået i prosjektet ditt.

## Bruk

**Beskriv det**

```prompt
/lagune-charter Prosjektet mitt er en nettbutikk som selger videospill. Kundene legger produkter i en handlekurv og betaler med kredittkort eller faktura. De kan se bestillingene sine og statusen for hver enkelt.
```

**La Lagune foreslå**

```prompt
/lagune-charter
```

> _Jeg ser et betalingsbibliotek, et innloggingsoppsett og en bestillingsmodell knyttet til en kunde. Dette ser ut som en nettbutikk som selger noe. Kundene betaler og følger med på sine egne bestillinger..._ ☁️

## Hva fasen utleder

**Lagune** bruker beskrivelsen din eller et **PRD** som retning og utleder hva den betyr for sikkerheten, og leser deretter prosjektet for å gå lenger enn det du nevnte. For eksempel:

- En handlekurv som holder bestillinger, betyr at det finnes en **database**:
  - f.eks. `"Hvor ligger dataene?"`, `"Hvem kan nå dem?"`, `"Lekker de?"`.
- At kundene kan se sine egne bestillinger, betyr at det finnes en form for **innlogging eller tilgangskontroll**:
  - f.eks. `"Kan én kunde nå en annen kundes bestillinger?"`, `"Er øktene beskyttet?"`.
- At prosjektet tar imot betaling med kort og faktura, betyr at **penger og sensitive data er involvert**:
  - f.eks. `"Lagres kortdata?"`, `"Blir betalingene verifisert?"`.

Beskrivelsen din og prosjektet utfyller hverandre: Beskrivelsen din angir hensikten, og en gjennomgang av avhengighetene, README-filen og konfigurasjonen avdekker det du ikke nevnte. Er noe viktig fortsatt uklart, stiller **Lagune** et kort, enkelt spørsmål i stedet for å gjette.

Ut fra dette bygger **Lagune** et skreddersydd sett sikkerhetsregler for prosjektet, som du kan gå gjennom og justere når du trenger det.

**Få mest mulig ut av det**

- Du kan også definere dine egne sikkerhetsregler for prosjektet.
- Jo flere relevante detaljer du gir, desto bedre blir den endelige rapporten:
  - Forklar prosjektet, hvordan det fungerer og hva som skjer under panseret.
  - Hvem er sluttbrukeren? Hva kan brukerne gjøre, og hva kan de ikke gjøre?
  - Detaljer om oppførsel er like verdifulle som tekniske detaljer.
- Minnet for charter ligger i `.lagune/memory/charter.md`.

## Kategoriene den registrerer

Spesialiseringer, sikkerhetskunnskapen de senere fasene laster inn ved behov, kommer inn i [katalogen](https://lagune.ai/no-NO/docs/catalog) for prosjektet ditt etter [kategori](https://lagune.ai/no-NO/docs/categories). Så lenge prosjektet ditt ikke har registrert noen kategori, registrerer charter hver kategori som gjennomgangen støtter, for eksempel språket i prosjektet, kall til en LLM eller containere, og nevner dem i oppsummeringen.

Når kategorier er registrert, lar charter dem være som de er og nevner bare en kategori prosjektet ditt ikke bruker ennå. Du kan endre dem selv når som helst:

```bash
npx lagune write add --categories python
npx lagune write remove --categories python
```

## Mappene den tilbyr å utelate

Finner charter under gjennomgangen mapper i repositoryet som ikke er kode prosjektet ditt skal forsvare, for eksempel testfixtures skrevet for å se sårbare ut, lister den dem opp med nummer på slutten av oppsummeringen. Den utelater aldri en mappe på egen hånd, siden et fiendtlig repository kan få koden sin til å se ut som fixtures, så bare numrene du svarer med, blir registrert. [Konfigurer hookene](https://lagune.ai/no-NO/docs/hooks/configure) viser hvordan du endrer dem selv.

## Neste steg

Når reglene er fastsatt, kartlegg hva systemet ditt faktisk gjør: [`/lagune-detect`](https://lagune.ai/no-NO/docs/commands/detect).

## Vanlige spørsmål

### Hva er en charter i Lagune?

Charter er det overordnede laget i Lagune, et sett sikkerhetsprinsipper der sikkerheten kommer først, og som hver senere fase må respektere. Tenk på det som en kompileringskontroll av sikkerhetsnivået i prosjektet ditt.

### Hvor lagres charter?

I .lagune/memory/charter.md.

### Kan jeg skrive mine egne regler i charter?

Ja. Lagune foreslår regler ut fra beskrivelsen og koden din, og du kan omformulere, fjerne, legge til eller avgrense dem.

### Velger charter spesialiseringskategoriene mine?

Bare så lenge ingen er registrert. Da registrerer den hver kategori som gjennomgangen støtter, for eksempel språket ditt eller kall til en LLM. Når kategorier er registrert, endrer den dem aldri.
