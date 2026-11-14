# Installer Lagune i enhver agent med skills.sh eller GitHub CLI

> Installer Lagune i enhver KI-agent med CLI-en til skills eller med GitHub CLI, og hold det oppdatert.

Kanonisk URL: https://lagune.ai/no-NO/docs/install/universal
Språk: no-NO
Original: https://lagune.ai/docs/install/universal
Sist oppdatert: 2026-11-09

**skills.sh**

Installer kommandoene til **Lagune** i prosjektet ditt fra terminalen med [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune -y
```

Eller lim inn denne prompten i agenten din:

```md
Kjør `npx --yes skills add wellwelwel/lagune --yes` og følg de genererte skill-instruksjonene nå. Les alle utdataene, om nødvendig etter å ha omdirigert dem til en midlertidig fil først. Løs opp relative stier ut fra mappen for støttefiler som utdataene oppgir.
```

**GitHub CLI**

Installer kommandoene til **Lagune** i prosjektet ditt fra terminalen med [**GitHub CLI**](https://cli.github.com/) 2.90.0 eller nyere:

```bash
gh skill install wellwelwel/lagune --all --scope project
```

Eller lim inn denne prompten i agenten din:

```md
Kjør `gh skill install wellwelwel/lagune --all --scope project` og les alle utdataene, om nødvendig etter å ha omdirigert dem til en midlertidig fil først.
```

## Oppdatering

**skills.sh**

Kjør følgende for å oppdatere **Lagune**:

```bash
npx skills update
```

Eller lim inn denne prompten i agenten din:

```md
Kjør `npx --yes skills update -y` og les alle utdataene, om nødvendig etter å ha omdirigert dem til en midlertidig fil først.
```

**GitHub CLI**

Kjør følgende for å oppdatere **Lagune**:

```bash
gh skill update --all
```

Eller lim inn denne prompten i agenten din:

```md
Kjør `gh skill update --all` og les alle utdataene, om nødvendig etter å ha omdirigert dem til en midlertidig fil først.
```

---

**Sandkasse**

I en sandkasse uten nettverkstilgang kan ikke kommandoene laste ned motoren. Installer den i prosjektet ditt fra din egen terminal, først én gang og deretter etter hver oppdatering:

```bash
npm i -D lagune@0.19.0
```

## Vanlige spørsmål

### Hvordan installerer jeg Lagune i en hvilken som helst KI-agent?

Kjør npx skills add wellwelwel/lagune -y eller gh skill install wellwelwel/lagune --all --scope project i prosjektet ditt, eller lim inn installasjonsprompten i agenten din.

### Hvordan oppdaterer jeg Lagune i en hvilken som helst KI-agent?

Kjør npx skills update hvis du installerte det med skills.sh, eller gh skill update --all hvis du installerte det med GitHub CLI. Du kan også lime inn oppdateringsprompten i agenten din.

### Kan jeg installere Lagune på mer enn én måte?

Nei. Med to måter viser agenten hver kommando to ganger, eller den bruker én kopi og skjuler den andre.
