# Installa Lagune su Antigravity CLI come plugin

> Installa Lagune su Antigravity CLI come plugin, tienilo aggiornato e consenti il suo motore in anticipo.

Canonico: https://lagune.ai/it-IT/docs/install/antigravity-cli
Lingua: it-IT
Originale: https://lagune.ai/docs/install/antigravity-cli
Ultimo aggiornamento: 2026-11-03

Installa il plugin dal terminale:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Aggiornamento

Per aggiornare **Lagune**, installalo di nuovo:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Comandi

Digita i comandi con il nome del plugin, come `/lagune:lagune-charter` per `/lagune-charter`.

---

**Permessi**

Il motore funziona tramite due strumenti: `lagune_read` legge soltanto il tuo progetto e `lagune_write` scrive soltanto in `.lagune/`. Un comando inviato come primo messaggio di una sessione viene eseguito prima che si carichino, quindi usa **npx** al loro posto. Per consentire in anticipo gli strumenti e **npx**, aggiungi queste regole a `~/.gemini/antigravity-cli/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## Domande frequenti

### Come installo Lagune su Antigravity CLI?

Esegui agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Come aggiorno Lagune su Antigravity CLI?

Esegui di nuovo agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Come eseguo i comandi di Lagune su Antigravity CLI?

Digitali con il nome del plugin, come /lagune:lagune-charter.

### Antigravity CLI può eseguire Lagune senza chiedere il permesso?

Sì. Consenti mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write) e command(regex:npx --yes lagune@[0-9.]+) nelle impostazioni di Antigravity CLI. La regola per npx copre un comando inviato come primo messaggio di una sessione.
