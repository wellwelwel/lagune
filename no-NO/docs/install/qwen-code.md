# Installer Lagune som utvidelse i Qwen Code

> Installer Lagune som utvidelse i Qwen Code, hold det oppdatert og gi motoren tillatelse på forhånd.

Kanonisk URL: https://lagune.ai/no-NO/docs/install/qwen-code
Språk: no-NO
Original: https://lagune.ai/docs/install/qwen-code
Sist oppdatert: 2026-11-09

Installer utvidelsen fra terminalen:

```bash
qwen extensions install lagune
```

## Oppdatering

Kjør følgende for å oppdatere **Lagune**:

```bash
qwen extensions update lagune
```

Installer utvidelsen med `--auto-update` for å holde den oppdatert.

## Kommandoer

Skriv inn kommandoene med navnet på utvidelsen foran, for eksempel `/lagune:lagune-charter` for `/lagune-charter`.

---

**Tillatelser**

Motoren kjører gjennom to verktøy: `lagune_read` leser bare prosjektet ditt, og `lagune_write` skriver bare til `.lagune/`. For å tillate dem på forhånd legger du til disse reglene i `.qwen/settings.json` for ett prosjekt, eller i `~/.qwen/settings.json` for alle prosjektene dine:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

Når motoren kjører via **npx**, som med **skills.sh**, tillater du også `Shell(npx --yes lagune@*)`.

## Vanlige spørsmål

### Hvordan installerer jeg Lagune i Qwen Code?

Kjør qwen extensions install lagune.

### Hvordan oppdaterer jeg Lagune i Qwen Code?

Kjør qwen extensions update lagune, eller installer utvidelsen med --auto-update.

### Hvordan kjører jeg kommandoene til Lagune i Qwen Code?

Skriv dem inn med navnet på utvidelsen foran, for eksempel /lagune:lagune-charter.

### Kan Qwen Code kjøre Lagune uten å be om tillatelse?

Ja. Tillat mcp__lagune__lagune_read og mcp__lagune__lagune_write i innstillingene til Qwen Code, og i tillegg Shell(npx --yes lagune@*) når motoren kjører via npx.
