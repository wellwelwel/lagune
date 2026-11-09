# Installer Lagune som pakke i Pi

> Installer Lagune som pakke i Pi, fra npm eller GitHub, og hold det oppdatert.

Kanonisk URL: https://lagune.ai/no-NO/docs/install/pi
Språk: no-NO
Original: https://lagune.ai/docs/install/pi
Sist oppdatert: 2026-11-09

**npm**

Installer pakken fra terminalen:

```bash
pi install npm:lagune
```

**GitHub**

Installer den nyeste commiten fra **GitHub**, som kjører motoren via **npx**:

```bash
pi install git:github.com/wellwelwel/lagune
```

## Oppdatering

**npm**

Kjør følgende for å oppdatere **Lagune**:

```bash
pi update npm:lagune
```

**GitHub**

Kjør følgende for å oppdatere **Lagune**:

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` oppdaterer alle pakkene du har installert, mens `pi update` alene bare oppdaterer **Pi**.

## Kommandoer

Skriv inn kommandoene med prefikset `skill:`, for eksempel `/skill:lagune-charter` for `/lagune-charter`.

## Vanlige spørsmål

### Hvordan installerer jeg Lagune i Pi?

Kjør pi install npm:lagune, eller pi install git:github.com/wellwelwel/lagune for den nyeste commiten fra GitHub.

### Hvordan oppdaterer jeg Lagune i Pi?

Kjør pi update npm:lagune, eller pi update git:github.com/wellwelwel/lagune for en installasjon fra GitHub. pi update --extensions oppdaterer alle pakkene du har installert.

### Hvordan kjører jeg kommandoene til Lagune i Pi?

Skriv dem inn med prefikset skill:, for eksempel /skill:lagune-charter.
