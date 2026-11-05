# Installa Lagune su Qwen Code come estensione

> Installa Lagune su Qwen Code come estensione, tienilo aggiornato e consenti il suo motore in anticipo.

Canonico: https://lagune.ai/it-IT/docs/install/qwen-code
Lingua: it-IT
Originale: https://lagune.ai/docs/install/qwen-code
Ultimo aggiornamento: 2026-11-05

Installa l'estensione dal terminale:

```bash
qwen extensions install lagune
```

## Aggiornamento

Per aggiornare **Lagune**, esegui:

```bash
qwen extensions update lagune
```

Per tenerlo aggiornato, installalo con `--auto-update`.

## Comandi

Digita i comandi con il nome dell'estensione, come `/lagune:lagune-charter` per `/lagune-charter`.

---

**Permessi**

Il motore funziona tramite due strumenti: `lagune_read` legge soltanto il tuo progetto e `lagune_write` scrive soltanto in `.lagune/`. Per consentirli in anticipo, aggiungi queste regole a `.qwen/settings.json` per un singolo progetto, oppure a `~/.qwen/settings.json` per tutti:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

Quando il motore viene eseguito tramite **npx**, come con **skills.sh**, consenti `Shell(npx --yes lagune@*)`.

## Domande frequenti

### Come installo Lagune su Qwen Code?

Esegui qwen extensions install lagune.

### Come aggiorno Lagune su Qwen Code?

Esegui qwen extensions update lagune, oppure installa l'estensione con --auto-update.

### Come eseguo i comandi di Lagune su Qwen Code?

Digitali con il nome dell'estensione, come /lagune:lagune-charter.

### Qwen Code può eseguire Lagune senza chiedere il permesso?

Sì. Consenti mcp__lagune__lagune_read e mcp__lagune__lagune_write nelle impostazioni di Qwen Code, più Shell(npx --yes lagune@*) quando il motore viene eseguito tramite npx.
