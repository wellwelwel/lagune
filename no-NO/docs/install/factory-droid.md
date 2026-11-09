# Installer Lagune som plugin i Factory Droid

> Installer Lagune som plugin i Factory Droid, hold den oppdatert og tillat verktøyene til motoren.

Kanonisk URL: https://lagune.ai/no-NO/docs/install/factory-droid
Språk: no-NO
Original: https://lagune.ai/docs/install/factory-droid
Sist oppdatert: 2026-11-09

Installer pluginen fra terminalen:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## Oppdatering

Oppdater **Lagune** ved å kjøre:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## Kommandoer

Skriv kommandoene med navnet deres, for eksempel `/lagune-charter`.

## Vanlige spørsmål

### Hvordan installerer jeg Lagune i Factory Droid?

Kjør droid plugin marketplace add wellwelwel/lagune og deretter droid plugin install lagune@lagune.

### Hvordan oppdaterer jeg Lagune i Factory Droid?

Kjør droid plugin marketplace update lagune og deretter droid plugin update lagune@lagune.

### Hvordan kjører jeg kommandoene til Lagune i Factory Droid?

Skriv dem med navnet deres, for eksempel /lagune-charter.

### Kan Factory Droid kjøre Lagune uten å be om tillatelse?

Ja. Velg å alltid tillate lagune_read og lagune_write når Factory Droid spør. Den spør på nytt etter at en ny commit av markedsplassen lagune er synkronisert.
