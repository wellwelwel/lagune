# Installer Lagune som plugin i OpenCode

> Installer Lagune som plugin i OpenCode 1.x og 2.x og hold det oppdatert.

Kanonisk URL: https://lagune.ai/no-NO/docs/install/opencode
Språk: no-NO
Original: https://lagune.ai/docs/install/opencode
Sist oppdatert: 2026-11-09

**OpenCode 2.x**

Installer pluginen fra terminalen:

```bash
opencode plugin add lagune
```

Eller legg den til i listen `plugins` i `opencode.json`:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

Installer pluginen i prosjektet ditt fra terminalen, eller legg til `-g` for å installere den for alle prosjektene dine:

```bash
opencode plugin lagune
```

Eller legg den til i listen `plugin` i `opencode.json`:

```json
{
  "plugin": ["lagune"]
}
```

## Oppdatering

**OpenCode 2.x**

Kjør følgende for å oppdatere **Lagune**:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

Installer den nye versjonen over den gamle for å oppdatere **Lagune**, og legg til `-g` hvis du installerte den for alle prosjektene dine:

```bash
opencode plugin lagune@0.18.1 --force
```

## Kommandoer

**OpenCode 2.x**

Skriv `@` og velg kommandoen, for eksempel `@lagune-charter`, og skriv deretter teksten din i samme melding.

**OpenCode 1.x**

Skriv inn kommandoene med navn, for eksempel `/lagune-charter`. De står oppført under `/skills`, ikke i menyen `/`.

## Vanlige spørsmål

### Hvordan installerer jeg Lagune i OpenCode?

I OpenCode 2.x kjører du opencode plugin add lagune. I OpenCode 1.x kjører du opencode plugin lagune, og legger til -g for å installere den for alle prosjektene dine.

### Hvordan oppdaterer jeg Lagune i OpenCode?

I OpenCode 2.x kjører du opencode plugin update lagune, deretter opencode reload. I OpenCode 1.x kjører du opencode plugin lagune@0.18.1 --force.

### Hvordan kjører jeg kommandoene til Lagune i OpenCode?

I OpenCode 2.x skriver du @ og velger kommandoen, for eksempel @lagune-charter, og skriver deretter teksten din i samme melding. I OpenCode 1.x skriver du dem inn med navn, for eksempel /lagune-charter, eller finner dem under /skills.

### Ber OpenCode om tillatelse før Lagune kjører?

Nei. OpenCode kjører de to verktøyene til motoren, lagune_read og lagune_write, uten å spørre.
