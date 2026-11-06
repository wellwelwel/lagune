# Skill di sicurezza per agenti IA

> Le skill che il tuo agente IA sblocca con Lagune: fai l'audit di un progetto esistente o proteggi il nuovo lavoro mentre sviluppi, sempre sotto il governo del charter.

Canonico: https://lagune.ai/it-IT/docs/get-started/commands
Lingua: it-IT
Originale: https://lagune.ai/docs/get-started/commands
Ultimo aggiornamento: 2026-11-03

Una volta [installato](https://lagune.ai/it-IT/docs) **Lagune**, il tuo agente **IA** sblocca una serie di skill. Ci sono due modi di usarle, ed entrambi sono governati dal **charter**: proteggere il nuovo lavoro mentre lo costruisci, oppure eseguire l'audit completo su un progetto.

**⌨️ Costruzione e sviluppo**

Non devi finire il tuo lavoro prima di metterlo in sicurezza. Usa [**`/lagune`**](https://lagune.ai/it-IT/docs/commands/lagune) per il lavoro che stai scrivendo **in questo momento**:

| Skill                                         | Cosa fa per te                                                                              |
| --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [**/lagune-charter**](https://lagune.ai/it-IT/docs/commands/charter) | Definisce le regole di sicurezza del tuo progetto, la base su cui `/lagune` costruisce      |
| [**/lagune**](https://lagune.ai/it-IT/docs/commands/lagune)          | Costruisce ciò che chiedi e lo mette in sicurezza mentre viene scritto, guidato dal charter |

**Usalo quando vuoi**

[**`/lagune`**](https://lagune.ai/it-IT/docs/commands/lagune) rispetta le regole del tuo charter ogni volta che viene eseguito. Accetta qualsiasi prompt, costruisce ciò che hai chiesto e lo mette in sicurezza con impostazioni predefinite sicure strada facendo, non dopo.

---

#### Skill speciali

| Skill                                               | Cosa fa                                                                                  |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/it-IT/docs/commands/specialize) | Insegna a **Lagune** una nuova specializzazione di sicurezza da articoli, exploit o temi |

**🔬 Audit: flusso Blue Team**

Il **flusso Blue Team** completo: leggere cosa fa un progetto, mapparne i rischi e chiuderli. Ogni fase si basa sulla precedente, quindi basta seguire l'elenco dall'alto verso il basso:

| #   | Skill                                         | Cosa fa per te                                                                                 |
| --- | --------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | [**/lagune-charter**](https://lagune.ai/it-IT/docs/commands/charter) | Definisce le regole di sicurezza del tuo progetto, proposte per te o modellate su ciò che dici |
| 2   | [**/lagune-detect**](https://lagune.ai/it-IT/docs/commands/detect)   | Legge il tuo codice e mappa cosa fa il sistema e dove sono i rischi                            |
| 3   | [**/lagune-plan**](https://lagune.ai/it-IT/docs/commands/plan)       | Trasforma ciò che detect ha trovato in un piano di difesa, con una correzione per ogni rilievo |
| 4   | [**/lagune-harden**](https://lagune.ai/it-IT/docs/commands/harden)   | Applica al tuo codice le correzioni del piano, in sicurezza e una alla volta                   |
| 5   | [**/lagune-verify**](https://lagune.ai/it-IT/docs/commands/verify)   | Dimostra che ogni correzione applicata regge e chiude quelle che reggono                       |

---

#### Skill speciali

| Skill                                               | Cosa fa                                                                                                                 |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/it-IT/docs/commands/specialize) | Insegna a **Lagune** una nuova specializzazione di sicurezza da articoli, exploit o temi                                |
| [**/lagune-prove**](https://lagune.ai/it-IT/docs/commands/prove)           | Trasforma ogni rilievo individuato in una prova eseguibile ed esclusivamente difensiva per la divulgazione responsabile |

---

#### Skill interne

| Skill                                       | Cosa fa                                      |
| ------------------------------------------- | -------------------------------------------- |
| [**/lagune-repair**](https://lagune.ai/it-IT/docs/commands/repair) | Ripara il tracciamento interno di **Lagune** |

**Suggerimento**

La sicurezza non è un costo, è un investimento: ciò che metti all'inizio lo risparmi molte volte negli incidenti che non avrai mai 🙋🏻‍♂️

## Domande frequenti

### Quali skill aggiunge Lagune?

/lagune per mettere in sicurezza il lavoro mentre lo costruisci, e il flusso di audit Blue Team in cinque fasi: /lagune-charter, /lagune-detect, /lagune-plan, /lagune-harden, /lagune-verify. Più /lagune-specialize e /lagune-prove.

### Che cos'è il flusso Blue Team di Lagune?

Un audit in cinque fasi: charter (definire le regole), detect (mappare i rischi), plan (assegnare un punteggio e pianificare le correzioni), harden (applicare le correzioni), verify (dimostrare che reggono e chiuderle).

### Qual è la differenza tra /lagune e il flusso di audit?

/lagune protegge il nuovo lavoro mentre lo scrivi, senza alcun flusso da seguire. Il flusso di audit esegue le cinque fasi in ordine su un progetto esistente.
