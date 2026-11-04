# Installa Lagune su Cursor come plugin

> Installa Lagune su Cursor e sulla Cursor CLI come plugin, tienilo aggiornato e consenti il suo motore in anticipo.

Canonico: https://lagune.ai/it-IT/docs/install/cursor
Lingua: it-IT
Originale: https://lagune.ai/docs/install/cursor
Ultimo aggiornamento: 2026-11-04

**Cursor**

- Apri **Customize**.
- Seleziona **From GitHub Repository** e inserisci `https://github.com/wellwelwel/lagune`.
- Seleziona **Install** su **Lagune** e scegli l'ambito di progetto o di utente.

**Cursor CLI**

- Aggiungi il marketplace dal terminale:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Digita `/plugins` in una sessione di `agent`.
- Installa **Lagune**.

Se **Lagune** è già installato in **Claude Code**, la **Cursor CLI** lo carica da lì.

## Aggiornamento

**Cursor**

- Apri **Customize**.
- Seleziona **Refresh** sul marketplace `lagune`.

**Cursor CLI**

- Sostituisci il marketplace dal terminale:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Digita `/plugins` in una sessione di `agent`.
- Installa di nuovo **Lagune**.

## Comandi

Digita i comandi per nome, come `/lagune-charter`.

---

**Permessi**

In **Cursor**, i comandi eseguono il motore tramite **npx**, che la modalità Auto-review predefinita consente senza chiedere.

Nella **Cursor CLI**, il motore funziona tramite due strumenti: `lagune_read` legge soltanto il tuo progetto e `lagune_write` scrive soltanto in `.lagune/`. Per consentirli in anticipo, aggiungi queste regole a `.cursor/cli.json` per un singolo progetto, oppure a `~/.cursor/cli-config.json` per tutti:

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

Quando il motore viene eseguito tramite **npx**, come con **skills.sh**, consenti `Shell(npx:--yes lagune@*)`.

## Domande frequenti

### Come installo Lagune su Cursor?

In Cursor, apri Customize, seleziona From GitHub Repository, inserisci https://github.com/wellwelwel/lagune e installa Lagune. Nella Cursor CLI, esegui agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor, poi installa Lagune da /plugins.

### Come aggiorno Lagune su Cursor?

In Cursor, seleziona Refresh sul marketplace lagune in Customize. Nella Cursor CLI, rimuovi il marketplace lagune, aggiungilo di nuovo, poi installa di nuovo Lagune da /plugins.

### Come eseguo i comandi di Lagune su Cursor?

Digitali per nome, come /lagune-charter.

### Cursor può eseguire Lagune senza chiedere il permesso?

Sì. La modalità Auto-review predefinita di Cursor lo consente già. Nella Cursor CLI, consenti Mcp(plugin-lagune-lagune:lagune_read) e Mcp(plugin-lagune-lagune:lagune_write), più Shell(npx:--yes lagune@*) quando il motore viene eseguito tramite npx.
