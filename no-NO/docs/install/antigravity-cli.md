# Installer Lagune som plugin i Antigravity CLI

> Installer Lagune som plugin i Antigravity CLI, hold den oppdatert og tillat motoren på forhånd.

Kanonisk URL: https://lagune.ai/no-NO/docs/install/antigravity-cli
Språk: no-NO
Original: https://lagune.ai/docs/install/antigravity-cli
Sist oppdatert: 2026-11-09

Installer pluginen fra terminalen:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Oppdatering

Oppdater **Lagune** ved å installere den på nytt:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Kommandoer

Skriv kommandoene med navnet på pluginen foran, for eksempel `/lagune:lagune-charter` for `/lagune-charter`.

---

**Tillatelser**

Motoren kjører via to verktøy: `lagune_read` leser bare prosjektet ditt, og `lagune_write` skriver bare til `.lagune/`. En kommando som sendes som første melding i en økt, kjører før verktøyene er lastet inn, og bruker derfor **npx** i stedet. Du tillater verktøyene og **npx** på forhånd ved å legge til disse reglene i `~/.gemini/antigravity-cli/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## Vanlige spørsmål

### Hvordan installerer jeg Lagune i Antigravity CLI?

Kjør agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Hvordan oppdaterer jeg Lagune i Antigravity CLI?

Kjør agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity på nytt.

### Hvordan kjører jeg kommandoene til Lagune i Antigravity CLI?

Skriv dem med navnet på pluginen foran, for eksempel /lagune:lagune-charter.

### Kan Antigravity CLI kjøre Lagune uten å be om tillatelse?

Ja. Tillat mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write) og command(regex:npx --yes lagune@[0-9.]+) i innstillingene for Antigravity CLI. Regelen for npx dekker en kommando som sendes som første melding i en økt.
