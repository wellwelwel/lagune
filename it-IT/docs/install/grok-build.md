# Installa Lagune su Grok Build come plugin

> Installa Lagune su Grok Build come plugin, tienilo aggiornato e consenti il suo motore in anticipo.

Canonico: https://lagune.ai/it-IT/docs/install/grok-build
Lingua: it-IT
Originale: https://lagune.ai/docs/install/grok-build
Ultimo aggiornamento: 2026-11-04

Installa il plugin dal terminale:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## Aggiornamento

Per aggiornare **Lagune**, esegui:

```bash
grok plugin update lagune
```

## Comandi

Digita i comandi per nome, come `/lagune-charter`, oppure con il nome del plugin, come `/lagune:lagune-charter`.

---

**Permessi**

Il motore funziona tramite due strumenti: `lagune_read` legge soltanto il tuo progetto e `lagune_write` scrive soltanto in `.lagune/`. Per consentirli in anticipo, aggiungi queste regole a `~/.grok/config.toml`:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

Quando il motore viene eseguito tramite **npx**, come con **skills.sh**, consenti `Bash(npx --yes lagune@*)`.

## Domande frequenti

### Come installo Lagune su Grok Build?

Esegui grok plugin install wellwelwel/lagune@plugin-grok --trust.

### Come aggiorno Lagune su Grok Build?

Esegui grok plugin update lagune.

### Come eseguo i comandi di Lagune su Grok Build?

Digitali per nome, come /lagune-charter, oppure con il nome del plugin, come /lagune:lagune-charter.

### Grok Build può eseguire Lagune senza chiedere il permesso?

Sì. Consenti MCPTool(lagune__lagune_read) e MCPTool(lagune__lagune_write) nella configurazione di Grok Build, più Bash(npx --yes lagune@*) quando il motore viene eseguito tramite npx.
