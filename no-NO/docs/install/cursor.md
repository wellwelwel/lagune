# Installer Lagune som plugin i Cursor

> Installer Lagune som plugin i Cursor og Cursor CLI, hold den oppdatert og tillat motoren på forhånd.

Kanonisk URL: https://lagune.ai/no-NO/docs/install/cursor
Språk: no-NO
Original: https://lagune.ai/docs/install/cursor
Sist oppdatert: 2026-11-09

**Cursor**

- Åpne **Customize**.
- Velg **From GitHub Repository** og skriv inn `https://github.com/wellwelwel/lagune`.
- Velg **Install** på **Lagune**, og velg prosjekt- eller brukeromfang.

**Cursor CLI**

- Legg til markedsplassen fra terminalen:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Skriv `/plugins` i en økt med `agent`.
- Installer **Lagune**.

Er **Lagune** allerede installert i **Claude Code**, laster **Cursor CLI** den inn derfra.

## Oppdatering

**Cursor**

- Åpne **Customize**.
- Velg **Refresh** på markedsplassen `lagune`.

**Cursor CLI**

- Bytt ut markedsplassen fra terminalen:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Skriv `/plugins` i en økt med `agent`.
- Installer **Lagune** på nytt.

## Kommandoer

Skriv kommandoene med navnet deres, for eksempel `/lagune-charter`.

---

**Tillatelser**

I **Cursor** kjører kommandoene motoren via **npx**, noe standardmodusen Auto-review tillater uten å spørre.

I **Cursor CLI** kjører motoren via to verktøy: `lagune_read` leser bare prosjektet ditt, og `lagune_write` skriver bare til `.lagune/`. Du tillater dem på forhånd ved å legge til disse reglene i `.cursor/cli.json` for ett prosjekt, eller i `~/.cursor/cli-config.json` for alle prosjektene:

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

Når motoren kjører via **npx**, som med **skills.sh**, tillater du `Shell(npx:--yes lagune@*)`.

## Vanlige spørsmål

### Hvordan installerer jeg Lagune i Cursor?

Åpne Customize i Cursor, velg From GitHub Repository, skriv inn https://github.com/wellwelwel/lagune og installer Lagune. I Cursor CLI kjører du agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor og installerer deretter Lagune fra /plugins.

### Hvordan oppdaterer jeg Lagune i Cursor?

Velg Refresh på markedsplassen lagune under Customize i Cursor. I Cursor CLI fjerner du markedsplassen lagune, legger den til på nytt og installerer deretter Lagune på nytt fra /plugins.

### Hvordan kjører jeg kommandoene til Lagune i Cursor?

Skriv dem med navnet deres, for eksempel /lagune-charter.

### Kan Cursor kjøre Lagune uten å be om tillatelse?

Ja. Standardmodusen Auto-review i Cursor tillater det allerede. I Cursor CLI tillater du Mcp(plugin-lagune-lagune:lagune_read) og Mcp(plugin-lagune-lagune:lagune_write), og i tillegg Shell(npx:--yes lagune@*) når motoren kjører via npx.
