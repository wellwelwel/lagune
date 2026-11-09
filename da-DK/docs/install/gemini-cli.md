# Installér Lagune i Gemini CLI som en udvidelse

> Installér Lagune i Gemini CLI som en udvidelse, hold det opdateret, og giv dets motor tilladelse på forhånd.

Kanonisk URL: https://lagune.ai/da-DK/docs/install/gemini-cli
Sprog: da-DK
Original: https://lagune.ai/docs/install/gemini-cli
Sidst opdateret: 2026-11-09

Installér udvidelsen fra din terminal:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## Opdatering

Kør følgende for at opdatere **Lagune**:

```bash
gemini extensions update lagune
```

Hvis du vil holde det opdateret, så installér det med `--auto-update`.

## Kommandoer

Skriv kommandoerne under udvidelsens navn, såsom `/lagune:lagune-charter` for `/lagune-charter`.

---

**Tilladelser**

Motoren kører gennem to værktøjer: `lagune_read` læser kun dit projekt, og `lagune_write` skriver kun til `.lagune/`. **Gemini CLI** starter dem kun i en betroet mappe. Hvis du vil give dem tilladelse på forhånd, så gem denne regel som `~/.gemini/policies/lagune.toml`:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

Når motoren kører gennem **npx**, som med **skills.sh**, så tilføj denne regel til samme fil:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## Ofte stillede spørgsmål

### Hvordan installerer jeg Lagune i Gemini CLI?

Kør gemini extensions install https://github.com/wellwelwel/lagune.

### Hvordan opdaterer jeg Lagune i Gemini CLI?

Kør gemini extensions update lagune, eller installér udvidelsen med --auto-update.

### Hvordan kører jeg kommandoerne i Lagune i Gemini CLI?

Skriv dem under udvidelsens navn, såsom /lagune:lagune-charter.

### Kan Gemini CLI køre Lagune uden at bede om tilladelse?

Ja. Tilføj en policy-regel, der tillader værktøjerne lagune_read og lagune_write fra serveren lagune, plus en til run_shell_command med npx --yes lagune@ og en version, når motoren kører gennem npx.
