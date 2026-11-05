# /lagune-prove: proof of concept esclusivamente difensiva

> Trasforma ogni rilievo individuato in una proof of concept (PoC) eseguibile ed esclusivamente difensiva e in un bollettino per la divulgazione responsabile.

Canonico: https://lagune.ai/it-IT/docs/commands/prove
Lingua: it-IT
Originale: https://lagune.ai/docs/commands/prove
Ultimo aggiornamento: 2026-11-05

🧪 Trasforma ogni rilievo individuato in un'evidenza eseguibile ed esclusivamente difensiva per la divulgazione responsabile.

Per ogni rilievo presente nella mappa di detect, scrive un bollettino autosufficiente e un test che verifica il **percorso sicuro**, così il test fallisce finché il problema è presente e passa non appena il codice viene corretto.

**Suggerimento**

I test di **Lagune** restano isolati in `.lagune/`, separati dalla tua suite.

## Come usarlo

**Ogni rilievo**

```prompt
/lagune-prove
```

**Un rilievo per nome**

Guarda i rilievi già tracciati per nome:

```prompt
npx lagune read list --findings

# Findings
#   ...
#   • SQL injection in user lookup
#   ...
```

```prompt
# Poi dimostrane uno
/lagune-prove SQL injection in user lookup
```

## Come funziona

Legge il sorgente a cui punta ogni rilievo e scrive una directory per ogni rilievo dimostrato in `.lagune/proofs/`, con esattamente due file:

| File                         | Che cos'è                                                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `report.test.mjs` (o `.cjs`) | Il test. Gira su Poku quando il tuo progetto lo usa già, altrimenti sul runner nativo di Node.js, quindi non richiede nulla di installato. |
| `report.md`                  | Un bollettino autosufficiente: gravità, impatto, come si riproduce e il comando per eseguirlo, leggibile da solo.                          |

Le prove sono sempre in JavaScript, così restano portabili qualunque sia il linguaggio del tuo progetto. Un indice `README.md` collega ogni prova e fornisce un unico comando per eseguirle tutte.

**Suggerimento**

- È **facoltativo e autonomo**: non è una delle cinque fasi e non fa parte della catena di tracciamento.
- Scrive solo in `.lagune/proofs/` e non tocca mai gli artefatti delle fasi né il tuo codice, che si limita a leggere.
- Un rilievo il cui test non riproduce il problema non riceve alcuna prova, e ti dice di eseguire [`/lagune-detect`](https://lagune.ai/it-IT/docs/commands/detect) su quel punto per riconciliare.
- Eseguirlo di nuovo riconcilia le prove: un rilievo che non c'è più o che non si riproduce più perde la sua directory.

**Nota**

**Viene eseguito solo quando lo richiami:** l'agente non lo avvia mai di propria iniziativa.

**Si basa su detect**

Prove legge la mappa di detect prodotta da [`/lagune-detect`](https://lagune.ai/it-IT/docs/commands/detect), quindi esegui prima detect.

## Solo difesa, e con autorizzazione

Prima di generare qualsiasi cosa, conferma che tu sia autorizzato a testare il bersaglio, e rifiuta qualsiasi richiesta di exploit funzionante, payload di attacco o elusione del rilevamento. Una prova dimostra il comportamento sicuro e non emette mai un input di attacco.

## Dalla prova alla divulgazione

I due file di ogni rilievo dimostrato vanno insieme in un **GitHub Gist privato** per segnalare la vulnerabilità. Sono l'evidenza di un problema presente e non ancora divulgato, quindi un `.gitignore` dentro `.lagune/proofs/` li tiene fuori da ogni commit: condividili solo tramite quel Gist finché i maintainer non l'hanno risolto.

Chiudere un rilievo nella catena di **Lagune** resta compito di [`/lagune-harden`](https://lagune.ai/it-IT/docs/commands/harden) e [`/lagune-verify`](https://lagune.ai/it-IT/docs/commands/verify): prove produce evidenze, non chiude nulla.

## Domande frequenti

### Lagune genera exploit?

No. /lagune-prove scrive evidenze esclusivamente difensive: un test che verifica il percorso sicuro, così fallisce finché il problema è presente e passa non appena il codice viene corretto, più un bollettino per la divulgazione responsabile.

### Cosa produce prove?

Due file per rilievo: un test (report.test.mjs o .cjs) e un bollettino (report.md).

### Come divulgo in modo responsabile un bug trovato da Lagune?

Prove scrive un bollettino autosufficiente che puoi condividere tramite un canale privato, come un GitHub Gist privato, seguendo la divulgazione responsabile.
