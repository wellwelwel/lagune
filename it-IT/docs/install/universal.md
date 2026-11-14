# Installa Lagune in qualsiasi agente con skills.sh o GitHub CLI

> Installa Lagune in qualsiasi agente IA con la CLI di skills o con GitHub CLI e tienilo aggiornato.

Canonico: https://lagune.ai/it-IT/docs/install/universal
Lingua: it-IT
Originale: https://lagune.ai/docs/install/universal
Ultimo aggiornamento: 2026-11-09

**skills.sh**

Installa i comandi di **Lagune** nel tuo progetto dal terminale con [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune -y
```

Oppure incolla questo prompt nel tuo agente:

```md
Esegui `npx --yes skills add wellwelwel/lagune --yes` e segui subito le istruzioni della skill generate. Leggi il suo output completo, reindirizzandolo prima a un file temporaneo se necessario. Risolvi i percorsi relativi partendo dalla directory dei file di supporto che indica.
```

**GitHub CLI**

Installa i comandi di **Lagune** nel tuo progetto dal terminale con [**GitHub CLI**](https://cli.github.com/) 2.90.0 o versioni successive:

```bash
gh skill install wellwelwel/lagune --all --scope project
```

Oppure incolla questo prompt nel tuo agente:

```md
Esegui `gh skill install wellwelwel/lagune --all --scope project` e leggi il suo output completo, reindirizzandolo prima a un file temporaneo se necessario.
```

## Aggiornamento

**skills.sh**

Per aggiornare **Lagune**, esegui:

```bash
npx skills update
```

Oppure incolla questo prompt nel tuo agente:

```md
Esegui `npx --yes skills update -y` e leggi il suo output completo, reindirizzandolo prima a un file temporaneo se necessario.
```

**GitHub CLI**

Per aggiornare **Lagune**, esegui:

```bash
gh skill update --all
```

Oppure incolla questo prompt nel tuo agente:

```md
Esegui `gh skill update --all` e leggi il suo output completo, reindirizzandolo prima a un file temporaneo se necessario.
```

---

**Sandbox**

In una sandbox senza accesso alla rete, i comandi non possono scaricare il motore. Installalo nel tuo progetto dal tuo terminale, una volta e dopo ogni aggiornamento:

```bash
npm i -D lagune@0.19.0
```

## Domande frequenti

### Come installo Lagune in qualsiasi agente IA?

Esegui npx skills add wellwelwel/lagune -y o gh skill install wellwelwel/lagune --all --scope project nel tuo progetto, oppure incolla il prompt di installazione nel tuo agente.

### Come aggiorno Lagune in qualsiasi agente IA?

Esegui npx skills update se l'hai installato con skills.sh, oppure gh skill update --all se l'hai installato con GitHub CLI. Puoi anche incollare il prompt di aggiornamento nel tuo agente.

### Posso installare Lagune in più di un modo?

No. Con due, l'agente elenca ogni comando due volte, oppure usa una copia e nasconde l'altra.
