# Installér Lagune i Claude Code som et plugin

> Installér Lagune i Claude Code som et plugin, i terminalen, udvidelsen eller desktopappen, hold det opdateret, og giv dets motor tilladelse på forhånd.

Kanonisk URL: https://lagune.ai/da-DK/docs/install/claude-code
Sprog: da-DK
Original: https://lagune.ai/docs/install/claude-code
Sidst opdateret: 2026-11-09

**Terminal**

Installér pluginnet fra din terminal:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

Eller fra en session i **Claude Code**:

```prompt
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**Udvidelse**

- Skriv `/plugin`, og vælg **Manage plugins**.
- Tilføj `wellwelwel/lagune` under fanen **Marketplaces**.
- Installér `lagune` under fanen **Plugins**.

**Desktop**

- Installér **Lagune** fra terminalen eller udvidelsen, og vælg **Install for you** i udvidelsen.
- Start en ny session i desktopappen, som indlæser de plugins, du installerer til dig selv.

## Opdatering

**Terminal**

Kør følgende for at opdatere **Lagune**:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

Hvis du vil holde det opdateret, så vælg **Enable auto-update** for markedspladsen `lagune` under `/plugin`.

**Udvidelse**

- Skriv `/plugin`, og vælg **Manage plugins**.
- Åbn fanen **Marketplaces**.
- Vælg opdateringsikonet ved `lagune`.

**Desktop**

- Opdatér **Lagune** fra terminalen eller udvidelsen.
- Start en ny session i desktopappen.

## Kommandoer

Skriv kommandoerne ved deres navn, såsom `/lagune-charter`, eller under pluginnets navn, såsom `/lagune:lagune-charter`.

---

**Tilladelser**

Motoren kører gennem to værktøjer: `lagune_read` læser kun dit projekt, og `lagune_write` skriver kun til `.lagune/`. Hvis du vil give dem tilladelse på forhånd, så tilføj disse regler til `.claude/settings.json` for ét projekt eller til `~/.claude/settings.json` for dem alle:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

Når motoren kører gennem **npx**, som med **skills.sh**, så tillad `Bash(npx --yes lagune@*)`. Med sandboxen slået til skal du også tilføje `registry.npmjs.org` til `sandbox.network.allowedDomains`.

## Ofte stillede spørgsmål

### Hvordan installerer jeg Lagune i Claude Code?

Kør claude plugin install lagune --marketplace wellwelwel/lagune. I en session eller i udvidelsen tilføjer du markedspladsen wellwelwel/lagune fra pluginhåndteringen og installerer lagune. Desktopappen indlæser det, når du har installeret det til dig selv i terminalen eller udvidelsen.

### Hvordan opdaterer jeg Lagune i Claude Code?

Kør claude plugin marketplace update lagune og derefter claude plugin update lagune@lagune, eller vælg Enable auto-update for markedspladsen lagune under /plugin. I udvidelsen åbner du Manage plugins fra /plugin og vælger opdateringsikonet ved markedspladsen lagune. Desktopappen indlæser opdateringen i sin næste session.

### Hvordan kører jeg kommandoerne i Lagune i Claude Code?

Skriv dem ved deres navn, såsom /lagune-charter, eller under pluginnets navn, såsom /lagune:lagune-charter.

### Kan Claude Code køre Lagune uden at bede om tilladelse?

Ja. Tillad mcp__plugin_lagune_lagune__lagune_read og mcp__plugin_lagune_lagune__lagune_write i dine indstillinger for Claude Code, plus Bash(npx --yes lagune@*), når motoren kører gennem npx.
