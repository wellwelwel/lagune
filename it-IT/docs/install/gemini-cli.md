# Installa Lagune su Gemini CLI come estensione

> Installa Lagune su Gemini CLI come estensione, tienilo aggiornato e consenti il suo motore in anticipo.

Canonico: https://lagune.ai/it-IT/docs/install/gemini-cli
Lingua: it-IT
Originale: https://lagune.ai/docs/install/gemini-cli
Ultimo aggiornamento: 2026-11-04

Installa l'estensione dal terminale:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## Aggiornamento

Per aggiornare **Lagune**, esegui:

```bash
gemini extensions update lagune
```

Per tenerlo aggiornato, installalo con `--auto-update`.

## Comandi

Digita i comandi con il nome dell'estensione, come `/lagune:lagune-charter` per `/lagune-charter`.

---

**Permessi**

Il motore funziona tramite due strumenti: `lagune_read` legge soltanto il tuo progetto e `lagune_write` scrive soltanto in `.lagune/`. **Gemini CLI** li avvia solo in una cartella attendibile. Per consentirli in anticipo, salva questa regola come `~/.gemini/policies/lagune.toml`:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

Quando il motore viene eseguito tramite **npx**, come con **skills.sh**, aggiungi questa regola allo stesso file:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## Domande frequenti

### Come installo Lagune su Gemini CLI?

Esegui gemini extensions install https://github.com/wellwelwel/lagune.

### Come aggiorno Lagune su Gemini CLI?

Esegui gemini extensions update lagune, oppure installa l'estensione con --auto-update.

### Come eseguo i comandi di Lagune su Gemini CLI?

Digitali con il nome dell'estensione, come /lagune:lagune-charter.

### Gemini CLI può eseguire Lagune senza chiedere il permesso?

Sì. Aggiungi una regola di policy che consenta gli strumenti lagune_read e lagune_write del server lagune, più una per run_shell_command con npx --yes lagune@ e una versione quando il motore viene eseguito tramite npx.
