# Installa Lagune in qualsiasi agente con skills.sh

> Installa Lagune in qualsiasi agente IA con la CLI di skills e tienilo aggiornato.

Canonico: https://lagune.ai/it-IT/docs/install/universal
Lingua: it-IT
Originale: https://lagune.ai/docs/install/universal
Ultimo aggiornamento: 2026-11-04

**Terminale**

Installa i comandi di **Lagune** dal terminale con [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune
```

**Prompt**

Incolla questo prompt nel tuo agente:

```md
Esegui `npx --yes skills add wellwelwel/lagune` e segui subito le istruzioni della skill generate. Leggi il suo output completo, reindirizzandolo prima a un file temporaneo se necessario. Risolvi i percorsi relativi partendo dalla directory dei file di supporto che indica.
```

## Aggiornamento

**Terminale**

Per aggiornare **Lagune**, esegui:

```bash
npx skills update
```

**Prompt**

Per aggiornare **Lagune**, incolla questo prompt nel tuo agente:

```md
Esegui `npx --yes skills update -y` e leggi il suo output completo, reindirizzandolo prima a un file temporaneo se necessario.
```

---

**Una sola via per agente**

Installa **Lagune** tramite **skills.sh** o tramite il suo **plugin**, mai entrambi.

**Permessi**

I comandi eseguono il motore come `npx --yes lagune@0.17.0`, e la [pagina di installazione di ogni agente](https://lagune.ai/it-IT/docs) mostra la regola che lo consente in anticipo. In una sandbox senza accesso alla rete, installa il motore nel tuo progetto dal tuo terminale, una volta e dopo ogni aggiornamento:

```bash
npm i -D lagune@0.17.0
```

## Domande frequenti

### Come installo Lagune in qualsiasi agente IA?

Esegui npx skills add wellwelwel/lagune nel tuo progetto, oppure incolla il prompt di installazione nel tuo agente.

### Come aggiorno Lagune installato con la CLI di skills?

Esegui npx skills update, oppure incolla il prompt di aggiornamento nel tuo agente.

### Posso installare Lagune sia con la CLI di skills sia con un plugin?

No. Con entrambi, l'agente elenca ogni comando due volte, oppure usa una copia e nasconde l'altra.
