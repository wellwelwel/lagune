# /lagune-specialize: Tren en sikkerhetsspesialisering med vanlig tekst

> Destiller en sikkerhetskilde eller et sikkerhetstema du gir den, til en ny spesialisering som lastes inn ved behov.

Kanonisk URL: https://lagune.ai/no-NO/docs/commands/specialize
Språk: no-NO
Original: https://lagune.ai/docs/commands/specialize
Sist oppdatert: 2026-11-09

🎓 Lær **Lagune** en ny spesialisering, ut fra en kilde eller et tema du gir den.

Kommandoen leser materialet og destillerer det til en fokusert, kun defensiv spesialisering, bygd opp nøyaktig som de [innebygde](https://lagune.ai/no-NO/docs/catalog), slik at fasene detect og verify laster den inn etterpå som alle andre. Den reviderer og forklarer bare: Den skriver aldri angrepsinndata eller exploits, og den rører aldri koden din.

**Fra en artikkel**

```prompt
# En lenke eller referanse: Lagune destillerer den til forsvaret
/lagune-specialize https://owasp.org/www-community/attacks/SQL_Injection
```

**Fra en exploit**

```prompt
# Et angrep som kilde: Spesialiseringen er fortsatt forsvaret
/lagune-specialize "' OR 1=1 -- skjøter SQL inn i spørringsteksten"
```

**Fra et tema**

```prompt
# Eller bare si hva den skal dekke
/lagune-specialize SQL injection
```

**Et angrep kan være kilden, aldri resultatet**

Det er greit å peke kommandoen mot et angrep når målet er å forsvare seg mot det: En beskrivelse av en exploit er studiemateriale den destillerer til forsvaret. Spesialiseringen den produserer, reviderer og forklarer alltid, og den produserer aldri en fungerende exploit, payload eller omgåelse.

## Hva den skriver

Resultatet er to filer i prosjektet ditt, committet og mulige å gå gjennom sammen med koden din:

- Spesialiseringen i `.lagune/catalog/<name>.md`, bygd opp som de [innebygde](https://lagune.ai/no-NO/docs/catalog).
- Oppføringen for den i `.lagune/configs.json`, der prosjektet ditt indekserer sine egne spesialiseringer, slik at katalogen kan slå dem sammen med de innebygde.

Deretter lister den opp katalogen for å bekrefte at den nye oppføringen er der. Dine egne spesialiseringer er alltid i katalogen, uansett hvilke kategorier den har. Du legger aldri til en kommando eller rører pakken: Et nytt spesialfelt er én kunnskapsfil pluss én indeksoppføring, skrevet inn i ditt eget prosjekt.

## Forbedre, aldri overskrive

Spesialiserer du et navn som allerede finnes, enten en innebygd som `regex` eller en du har spesialisert før, blir den gjeldende filen **avstemt** i stedet for erstattet. Den leser det som finnes, arbeider inn den nye kunnskapen, beholder det som fortsatt gjelder, og skriver om det som har endret seg. Ingenting blir forkastet uten at det er sett. En spesialisering du har laget, overstyrer en innebygd med samme navn, så du kan skjerpe en innebygd for ditt eget prosjekt uten å miste den.

**Tips**

- Den nye spesialiseringen lastes inn nøyaktig som en innebygd: Fasene detect og verify henter den ved behov, eller du laster den inn selv med `npx lagune read catalog <name>` og gir den en oppgave.
- Når materialet har et identifiserbart opphav (en artikkel, en forfatter, en lenke, en standard), krediterer spesialiseringen det. Et rent tema har ingen kilde.

**Merk**

**Den kjører bare når du kaller den:** Agenten starter den aldri på egen hånd.

## Vanlige spørsmål

### Hvordan legger jeg til en egen sikkerhetsspesialisering?

Kjør /lagune-specialize med en kilde eller et tema. Den destillerer det til en kun defensiv spesialisering, skrevet til .lagune/catalog/<name>.md, pluss oppføringen for den i .lagune/configs.json.

### Kan Lagune lære av en beskrivelse av en exploit?

Ja, som kilde, aldri som resultat. Et angrep kan være kilden, aldri produktet. Specialize skriver aldri angrepsinndata eller exploits.

### Overskriver specialize de innebygde spesialiseringene?

Nei. Den forbedrer og overskriver aldri.
