# Installer Lagune som utvidelse i Gemini CLI

> Installer Lagune som utvidelse i Gemini CLI, hold den oppdatert og tillat motoren på forhånd.

Kanonisk URL: https://lagune.ai/no-NO/docs/install/gemini-cli
Språk: no-NO
Original: https://lagune.ai/docs/install/gemini-cli
Sist oppdatert: 2026-11-09

Installer utvidelsen fra terminalen:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## Oppdatering

Oppdater **Lagune** ved å kjøre:

```bash
gemini extensions update lagune
```

For automatisk oppdatering installerer du den med `--auto-update`.

## Kommandoer

Skriv kommandoene med navnet på utvidelsen foran, for eksempel `/lagune:lagune-charter` for `/lagune-charter`.

---

**Tillatelser**

Motoren kjører via to verktøy: `lagune_read` leser bare prosjektet ditt, og `lagune_write` skriver bare til `.lagune/`. **Gemini CLI** starter dem bare i en klarert mappe. Du tillater dem på forhånd ved å lagre denne regelen som `~/.gemini/policies/lagune.toml`:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

Når motoren kjører via **npx**, som med **skills.sh**, legger du til denne regelen i samme fil:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## Vanlige spørsmål

### Hvordan installerer jeg Lagune i Gemini CLI?

Kjør gemini extensions install https://github.com/wellwelwel/lagune.

### Hvordan oppdaterer jeg Lagune i Gemini CLI?

Kjør gemini extensions update lagune, eller installer utvidelsen med --auto-update.

### Hvordan kjører jeg kommandoene til Lagune i Gemini CLI?

Skriv dem med navnet på utvidelsen foran, for eksempel /lagune:lagune-charter.

### Kan Gemini CLI kjøre Lagune uten å be om tillatelse?

Ja. Legg til en policyregel som tillater verktøyene til serveren lagune, lagune_read og lagune_write, og i tillegg en regel for run_shell_command med npx --yes lagune@ og en versjon når motoren kjører via npx.
