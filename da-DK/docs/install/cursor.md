# Installér Lagune i Cursor som et plugin

> Installér Lagune i Cursor og Cursor CLI som et plugin, hold det opdateret, og giv dets motor tilladelse på forhånd.

Kanonisk URL: https://lagune.ai/da-DK/docs/install/cursor
Sprog: da-DK
Original: https://lagune.ai/docs/install/cursor
Sidst opdateret: 2026-11-09

**Cursor**

- Åbn **Customize**.
- Vælg **From GitHub Repository**, og angiv `https://github.com/wellwelwel/lagune`.
- Vælg **Install** ved **Lagune**, og vælg et omfang for projektet eller brugeren.

**Cursor CLI**

- Tilføj markedspladsen fra din terminal:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Skriv `/plugins` i en session med `agent`.
- Installér **Lagune**.

Hvis **Lagune** allerede er installeret i **Claude Code**, indlæser **Cursor CLI** det derfra.

## Opdatering

**Cursor**

- Åbn **Customize**.
- Vælg **Refresh** ved markedspladsen `lagune`.

**Cursor CLI**

- Udskift markedspladsen fra din terminal:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Skriv `/plugins` i en session med `agent`.
- Installér **Lagune** igen.

## Kommandoer

Skriv kommandoerne ved deres navn, såsom `/lagune-charter`.

---

**Tilladelser**

I **Cursor** kører kommandoerne motoren gennem **npx**, som standardtilstanden Auto-review tillader uden at spørge.

I **Cursor CLI** kører motoren gennem to værktøjer: `lagune_read` læser kun dit projekt, og `lagune_write` skriver kun til `.lagune/`. Hvis du vil give dem tilladelse på forhånd, så tilføj disse regler til `.cursor/cli.json` for ét projekt eller til `~/.cursor/cli-config.json` for dem alle:

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

Når motoren kører gennem **npx**, som med **skills.sh**, så tillad `Shell(npx:--yes lagune@*)`.

## Ofte stillede spørgsmål

### Hvordan installerer jeg Lagune i Cursor?

I Cursor åbner du Customize, vælger From GitHub Repository, angiver https://github.com/wellwelwel/lagune og installerer Lagune. I Cursor CLI kører du agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor og installerer derefter Lagune fra /plugins.

### Hvordan opdaterer jeg Lagune i Cursor?

I Cursor vælger du Refresh ved markedspladsen lagune under Customize. I Cursor CLI fjerner du markedspladsen lagune, tilføjer den igen og installerer derefter Lagune igen fra /plugins.

### Hvordan kører jeg kommandoerne i Lagune i Cursor?

Skriv dem ved deres navn, såsom /lagune-charter.

### Kan Cursor køre Lagune uden at bede om tilladelse?

Ja. Standardtilstanden Auto-review i Cursor tillader det allerede. I Cursor CLI tillader du Mcp(plugin-lagune-lagune:lagune_read) og Mcp(plugin-lagune-lagune:lagune_write), plus Shell(npx:--yes lagune@*), når motoren kører gennem npx.
