# Installer Lagune som plugin i Claude Code

> Installer Lagune som plugin i Claude Code, i terminalen, utvidelsen eller skrivebordsappen, hold den oppdatert og tillat motoren på forhånd.

Kanonisk URL: https://lagune.ai/no-NO/docs/install/claude-code
Språk: no-NO
Original: https://lagune.ai/docs/install/claude-code
Sist oppdatert: 2026-11-09

**Terminal**

Installer pluginen fra terminalen:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

Eller fra en økt i **Claude Code**:

```prompt
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**Utvidelse**

- Skriv `/plugin` og velg **Manage plugins**.
- Legg til `wellwelwel/lagune` i fanen **Marketplaces**.
- Installer `lagune` i fanen **Plugins**.

**Skrivebord**

- Installer **Lagune** fra terminalen eller utvidelsen, og velg **Install for you** i utvidelsen.
- Start en ny økt i skrivebordsappen, som laster inn pluginene du installerer for deg selv.

## Oppdatering

**Terminal**

Oppdater **Lagune** ved å kjøre:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

For automatisk oppdatering velger du **Enable auto-update** for markedsplassen `lagune` under `/plugin`.

**Utvidelse**

- Skriv `/plugin` og velg **Manage plugins**.
- Åpne fanen **Marketplaces**.
- Velg oppdateringsikonet på `lagune`.

**Skrivebord**

- Oppdater **Lagune** fra terminalen eller utvidelsen.
- Start en ny økt i skrivebordsappen.

## Kommandoer

Skriv kommandoene med navnet deres, for eksempel `/lagune-charter`, eller med navnet på pluginen foran, for eksempel `/lagune:lagune-charter`.

---

**Tillatelser**

Motoren kjører via to verktøy: `lagune_read` leser bare prosjektet ditt, og `lagune_write` skriver bare til `.lagune/`. Du tillater dem på forhånd ved å legge til disse reglene i `.claude/settings.json` for ett prosjekt, eller i `~/.claude/settings.json` for alle prosjektene:

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

Når motoren kjører via **npx**, som med **skills.sh**, tillater du `Bash(npx --yes lagune@*)`. Er sandkassen slått på, legger du også til `registry.npmjs.org` i `sandbox.network.allowedDomains`.

## Vanlige spørsmål

### Hvordan installerer jeg Lagune i Claude Code?

Kjør claude plugin install lagune --marketplace wellwelwel/lagune. I en økt eller i utvidelsen legger du til markedsplassen wellwelwel/lagune fra pluginbehandleren og installerer lagune. Skrivebordsappen laster den inn så snart du har installert den for deg selv i terminalen eller utvidelsen.

### Hvordan oppdaterer jeg Lagune i Claude Code?

Kjør claude plugin marketplace update lagune og deretter claude plugin update lagune@lagune, eller velg Enable auto-update for markedsplassen lagune under /plugin. I utvidelsen åpner du Manage plugins fra /plugin og velger oppdateringsikonet på markedsplassen lagune. Skrivebordsappen laster inn oppdateringen i neste økt.

### Hvordan kjører jeg kommandoene til Lagune i Claude Code?

Skriv dem med navnet deres, for eksempel /lagune-charter, eller med navnet på pluginen foran, for eksempel /lagune:lagune-charter.

### Kan Claude Code kjøre Lagune uten å be om tillatelse?

Ja. Tillat mcp__plugin_lagune_lagune__lagune_read og mcp__plugin_lagune_lagune__lagune_write i innstillingene for Claude Code, og i tillegg Bash(npx --yes lagune@*) når motoren kjører via npx.
