# Installa Lagune su Codex CLI come plugin

> Installa Lagune su Codex CLI come plugin, tienilo aggiornato ed esegui il suo motore dentro la sandbox.

Canonico: https://lagune.ai/it-IT/docs/install/codex
Lingua: it-IT
Originale: https://lagune.ai/docs/install/codex
Ultimo aggiornamento: 2026-11-05

Installa il plugin dal terminale:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## Aggiornamento

Per aggiornare **Lagune**, esegui:

```bash
codex plugin marketplace upgrade lagune
```

## Comandi

Digita `$` e il comando con il nome del plugin, seguito dal tuo input, come `$lagune:lagune-charter` per `/lagune-charter`. Digitando `$` vengono elencati i comandi, e sceglierne uno ne inserisce il nome completo.

---

**Permessi**

La sandbox di **Codex** non ha accesso alla rete. Installa il motore nel tuo progetto dal tuo terminale, una volta e dopo ogni aggiornamento:

```bash
npm i -D lagune@0.18.0
```

## Domande frequenti

### Come installo Lagune su Codex CLI?

Esegui codex plugin marketplace add wellwelwel/lagune, poi codex plugin add lagune@lagune.

### Come aggiorno Lagune su Codex CLI?

Esegui codex plugin marketplace upgrade lagune.

### Come eseguo i comandi di Lagune su Codex CLI?

Digita $ e il comando con il nome del plugin, seguito dal tuo input, come $lagune:lagune-charter.

### Lagune funziona dentro la sandbox di Codex?

Sì, una volta installato il motore nel tuo progetto con npm i -D lagune@0.18.0 dal tuo terminale, una volta e dopo ogni aggiornamento.
