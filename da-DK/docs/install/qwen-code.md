# Installér Lagune i Qwen Code som en udvidelse

> Installér Lagune i Qwen Code som en udvidelse, hold det opdateret, og giv dets motor tilladelse på forhånd.

Kanonisk URL: https://lagune.ai/da-DK/docs/install/qwen-code
Sprog: da-DK
Original: https://lagune.ai/docs/install/qwen-code
Sidst opdateret: 2026-11-09

Installér udvidelsen fra din terminal:

```bash
qwen extensions install lagune
```

## Opdatering

Kør følgende for at opdatere **Lagune**:

```bash
qwen extensions update lagune
```

Hvis du vil holde det opdateret, så installér det med `--auto-update`.

## Kommandoer

Skriv kommandoerne under udvidelsens navn, såsom `/lagune:lagune-charter` for `/lagune-charter`.

---

**Tilladelser**

Motoren kører gennem to værktøjer: `lagune_read` læser kun dit projekt, og `lagune_write` skriver kun til `.lagune/`. Hvis du vil give dem tilladelse på forhånd, så tilføj disse regler til `.qwen/settings.json` for ét projekt eller til `~/.qwen/settings.json` for dem alle:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

Når motoren kører gennem **npx**, som med **skills.sh**, så tillad `Shell(npx --yes lagune@*)`.

## Ofte stillede spørgsmål

### Hvordan installerer jeg Lagune i Qwen Code?

Kør qwen extensions install lagune.

### Hvordan opdaterer jeg Lagune i Qwen Code?

Kør qwen extensions update lagune, eller installér udvidelsen med --auto-update.

### Hvordan kører jeg kommandoerne i Lagune i Qwen Code?

Skriv dem under udvidelsens navn, såsom /lagune:lagune-charter.

### Kan Qwen Code køre Lagune uden at bede om tilladelse?

Ja. Tillad mcp__lagune__lagune_read og mcp__lagune__lagune_write i indstillingerne for Qwen Code, plus Shell(npx --yes lagune@*), når motoren kører gennem npx.
