# Installa Lagune su Muse Code come plugin

> Installa Lagune su Muse Code come plugin, tienilo aggiornato ed esegui il suo motore dentro la sandbox.

Canonico: https://lagune.ai/it-IT/docs/install/muse-code
Lingua: it-IT
Originale: https://lagune.ai/docs/install/muse-code
Ultimo aggiornamento: 2026-11-07

Installa il plugin dal terminale:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## Aggiornamento

Per aggiornare **Lagune**, aggiorna il marketplace e reinstalla il plugin:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## Comandi

Digita i comandi per nome, come `/lagune-charter`, oppure con il nome del plugin, come `/lagune:lagune-charter`.

---

**Sandbox**

La sandbox di **Muse Code** non può scaricare il motore. Installalo nel tuo progetto dal tuo terminale, una volta e dopo ogni aggiornamento:

```bash
npm i -D lagune@0.18.1
```

## Domande frequenti

### Come installo Lagune su Muse Code?

Esegui muse plugins marketplace add lagune wellwelwel/lagune, poi muse plugins install lagune@lagune.

### Come aggiorno Lagune su Muse Code?

Esegui muse plugins marketplace update lagune, poi reinstalla con muse plugins remove lagune e muse plugins install lagune@lagune.

### Come eseguo i comandi di Lagune su Muse Code?

Digitali per nome, come /lagune-charter, oppure con il nome del plugin, come /lagune:lagune-charter.

### Lagune funziona dentro la sandbox di Muse Code?

Sì, una volta installato il motore nel tuo progetto con npm i -D lagune@0.18.1 dal tuo terminale, una volta e dopo ogni aggiornamento.
