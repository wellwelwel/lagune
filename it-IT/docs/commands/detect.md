# /lagune-detect: mappa il tuo sistema e i suoi rischi

> Legge il tuo codice e mappa cosa fa il sistema e dove sono i rischi.

Canonico: https://lagune.ai/it-IT/docs/commands/detect
Lingua: it-IT
Originale: https://lagune.ai/docs/commands/detect
Ultimo aggiornamento: 2026-11-05

🔬 Scopri cosa fa davvero il tuo sistema e dove sono i rischi.

Detect legge il codice e registra solo ciò che trova davvero, con le evidenze di cui hanno bisogno le fasi successive. La sua regola guida è rilevare, non inventare.

## Come usarlo

**Analisi completa**

```prompt
/lagune-detect
```

**Indica i percorsi**

```prompt
/lagune-detect src/routes/ src/auth.ts
```

**Descrivi una preoccupazione**

```prompt
/lagune-detect assicurati che i dati dei clienti non vengano mai esposti
```

## Cosa mappa

**Lagune** legge il codice e mappa ciò che trova. Ogni rilievo indica cos'è, perché conta e l'evidenza. Per esempio:

- **Caricamento di file**, il sistema accetta file dagli utenti:
  - _Perché conta:_ un file camuffato da immagine può nascondere codice malevolo.
  - _Evidenza:_ l'handler di `POST /upload` si fida del tipo MIME inviato dal client, senza controllare il tipo reale del file.
- **Login e sessioni**, gli utenti accedono per raggiungere il proprio account:
  - _Perché conta:_ una gestione debole delle sessioni permette a qualcuno di prendere il controllo di un account altrui.
  - _Evidenza:_ la logica di emissione delle sessioni, dove le sessioni vengono emesse senza alcuna scadenza.

Strada facendo, detect dà a ogni specializzazione del [catalogo](https://lagune.ai/it-IT/docs/catalog) del tuo progetto un verdetto confrontandola con il codice, applica quelle il cui contesto è presente e le registra sotto **Applied specializations**, l'elenco che harden e verify riutilizzano.

Da lì hai una mappa chiara di cosa fa il tuo sistema e di dove si trovano i rischi, pronta perché i passi successivi agiscano.

**Suggerimento**

- Eseguirlo di nuovo aggiorna la mappa: i rilievi risolti escono, quelli nuovi entrano.
- La mappa di detect si trova in `.lagune/memory/detect.md`.

## Passo successivo

Trasforma la mappa in un piano: [`/lagune-plan`](https://lagune.ai/it-IT/docs/commands/plan).

## Domande frequenti

### Cosa fa /lagune-detect?

Legge il tuo codice e mappa cosa fa il sistema e dove sono i rischi, registrando solo ciò che trova davvero. La sua regola è rilevare, non inventare.

### Che cos'è un rilievo in Lagune?

Un rilievo è un singolo rischio individuato, che indica cos'è, perché conta e l'evidenza nel codice. È l'unità tracciata che plan, harden e verify portano avanti.

### Dove viene salvata la mappa di detect?

In .lagune/memory/detect.md.

### Quali specializzazioni usa detect?

Ognuna di quelle nel catalogo del tuo progetto riceve un verdetto confrontato con il codice. Detect applica quelle il cui contesto è presente e le registra sotto Applied specializations.
