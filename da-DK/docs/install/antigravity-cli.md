# Installér Lagune i Antigravity CLI som et plugin

> Installér Lagune i Antigravity CLI som et plugin, hold det opdateret, og giv dets motor tilladelse på forhånd.

Kanonisk URL: https://lagune.ai/da-DK/docs/install/antigravity-cli
Sprog: da-DK
Original: https://lagune.ai/docs/install/antigravity-cli
Sidst opdateret: 2026-11-09

Installér pluginnet fra din terminal:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Opdatering

Installér **Lagune** igen for at opdatere det:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Kommandoer

Skriv kommandoerne under pluginnets navn, såsom `/lagune:lagune-charter` for `/lagune-charter`.

---

**Tilladelser**

Motoren kører gennem to værktøjer: `lagune_read` læser kun dit projekt, og `lagune_write` skriver kun til `.lagune/`. En kommando, der sendes som en sessions første besked, kører, før de er indlæst, så den bruger **npx** i stedet. Hvis du vil give værktøjerne og **npx** tilladelse på forhånd, så tilføj disse regler til `~/.gemini/antigravity-cli/settings.json`:

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

## Ofte stillede spørgsmål

### Hvordan installerer jeg Lagune i Antigravity CLI?

Kør agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Hvordan opdaterer jeg Lagune i Antigravity CLI?

Kør agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity igen.

### Hvordan kører jeg kommandoerne i Lagune i Antigravity CLI?

Skriv dem under pluginnets navn, såsom /lagune:lagune-charter.

### Kan Antigravity CLI køre Lagune uden at bede om tilladelse?

Ja. Tillad mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write) og command(regex:npx --yes lagune@[0-9.]+) i indstillingerne for Antigravity CLI. Reglen for npx dækker en kommando, der sendes som en sessions første besked.
