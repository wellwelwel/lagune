# Installér Lagune i Grok Build som et plugin

> Installér Lagune i Grok Build som et plugin, hold det opdateret, og giv dets motor tilladelse på forhånd.

Kanonisk URL: https://lagune.ai/da-DK/docs/install/grok-build
Sprog: da-DK
Original: https://lagune.ai/docs/install/grok-build
Sidst opdateret: 2026-11-09

Installér pluginnet fra din terminal:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## Opdatering

Kør følgende for at opdatere **Lagune**:

```bash
grok plugin update lagune
```

## Kommandoer

Skriv kommandoerne ved deres navn, såsom `/lagune-charter`, eller under pluginnets navn, såsom `/lagune:lagune-charter`.

---

**Tilladelser**

Motoren kører gennem to værktøjer: `lagune_read` læser kun dit projekt, og `lagune_write` skriver kun til `.lagune/`. Hvis du vil give dem tilladelse på forhånd, så tilføj disse regler til `~/.grok/config.toml`:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

Når motoren kører gennem **npx**, som med **skills.sh**, så tillad `Bash(npx --yes lagune@*)`.

## Ofte stillede spørgsmål

### Hvordan installerer jeg Lagune i Grok Build?

Kør grok plugin install wellwelwel/lagune@plugin-grok --trust.

### Hvordan opdaterer jeg Lagune i Grok Build?

Kør grok plugin update lagune.

### Hvordan kører jeg kommandoerne i Lagune i Grok Build?

Skriv dem ved deres navn, såsom /lagune-charter, eller under pluginnets navn, såsom /lagune:lagune-charter.

### Kan Grok Build køre Lagune uden at bede om tilladelse?

Ja. Tillad MCPTool(lagune__lagune_read) og MCPTool(lagune__lagune_write) i konfigurationen for Grok Build, plus Bash(npx --yes lagune@*), når motoren kører gennem npx.
