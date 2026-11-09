# Installer Lagune som plugin i Grok Build

> Installer Lagune som plugin i Grok Build, hold det oppdatert og gi motoren tillatelse på forhånd.

Kanonisk URL: https://lagune.ai/no-NO/docs/install/grok-build
Språk: no-NO
Original: https://lagune.ai/docs/install/grok-build
Sist oppdatert: 2026-11-09

Installer pluginen fra terminalen:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## Oppdatering

Kjør følgende for å oppdatere **Lagune**:

```bash
grok plugin update lagune
```

## Kommandoer

Skriv inn kommandoene med navn, for eksempel `/lagune-charter`, eller med navnet på pluginen foran, for eksempel `/lagune:lagune-charter`.

---

**Tillatelser**

Motoren kjører gjennom to verktøy: `lagune_read` leser bare prosjektet ditt, og `lagune_write` skriver bare til `.lagune/`. For å tillate dem på forhånd legger du til disse reglene i `~/.grok/config.toml`:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

Når motoren kjører via **npx**, som med **skills.sh**, tillater du også `Bash(npx --yes lagune@*)`.

## Vanlige spørsmål

### Hvordan installerer jeg Lagune i Grok Build?

Kjør grok plugin install wellwelwel/lagune@plugin-grok --trust.

### Hvordan oppdaterer jeg Lagune i Grok Build?

Kjør grok plugin update lagune.

### Hvordan kjører jeg kommandoene til Lagune i Grok Build?

Skriv dem inn med navn, for eksempel /lagune-charter, eller med navnet på pluginen foran, for eksempel /lagune:lagune-charter.

### Kan Grok Build kjøre Lagune uten å be om tillatelse?

Ja. Tillat MCPTool(lagune__lagune_read) og MCPTool(lagune__lagune_write) i konfigurasjonen til Grok Build, og i tillegg Bash(npx --yes lagune@*) når motoren kjører via npx.
