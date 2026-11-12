# Installér Lagune i enhver agent med skills.sh eller GitHub CLI

> Installér Lagune i enhver AI-agent med CLI'en fra skills eller GitHub CLI, og hold det opdateret.

Kanonisk URL: https://lagune.ai/da-DK/docs/install/universal
Sprog: da-DK
Original: https://lagune.ai/docs/install/universal
Sidst opdateret: 2026-11-09

**skills.sh**

Installér kommandoerne i **Lagune** i dit projekt fra din terminal med [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune -y
```

Eller indsæt denne prompt i din agent:

```md
Kør `npx --yes skills add wellwelwel/lagune --yes`, og følg de genererede instruktioner til skillen nu. Læs hele outputtet, og omdirigér det først til en midlertidig fil, hvis det er nødvendigt. Opløs relative stier ud fra den mappe med supportfiler, som outputtet angiver.
```

**GitHub CLI**

Installér kommandoerne i **Lagune** i dit projekt fra din terminal med [**GitHub CLI**](https://cli.github.com/) 2.90.0 eller nyere:

```bash
gh skill install wellwelwel/lagune --all --scope project
```

Eller indsæt denne prompt i din agent:

```md
Kør `gh skill install wellwelwel/lagune --all --scope project`, og læs hele outputtet. Omdirigér det først til en midlertidig fil, hvis det er nødvendigt.
```

## Opdatering

**skills.sh**

Kør følgende for at opdatere **Lagune**:

```bash
npx skills update
```

Eller indsæt denne prompt i din agent:

```md
Kør `npx --yes skills update -y`, og læs hele outputtet. Omdirigér det først til en midlertidig fil, hvis det er nødvendigt.
```

**GitHub CLI**

Kør følgende for at opdatere **Lagune**:

```bash
gh skill update --all
```

Eller indsæt denne prompt i din agent:

```md
Kør `gh skill update --all`, og læs hele outputtet. Omdirigér det først til en midlertidig fil, hvis det er nødvendigt.
```

---

**Sandbox**

I en sandbox uden netværksadgang kan kommandoerne ikke downloade motoren. Installér den i dit projekt fra din egen terminal, én gang og efter hver opdatering:

```bash
npm i -D lagune@0.18.2
```

## Ofte stillede spørgsmål

### Hvordan installerer jeg Lagune i en hvilken som helst AI-agent?

Kør npx skills add wellwelwel/lagune -y eller gh skill install wellwelwel/lagune --all --scope project i dit projekt, eller indsæt installationsprompten i din agent.

### Hvordan opdaterer jeg Lagune i en hvilken som helst AI-agent?

Kør npx skills update, hvis du installerede det med skills.sh, eller gh skill update --all, hvis du installerede det med GitHub CLI. Du kan også indsætte opdateringsprompten i din agent.

### Kan jeg installere Lagune på mere end én måde?

Nej. Med to viser agenten hver kommando to gange eller bruger én kopi og skjuler den anden.
