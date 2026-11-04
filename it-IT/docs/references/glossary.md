# Glossario di Lagune: SDH, charter, rilievi e controlli

> Definizioni in linguaggio semplice di ogni termine di Lagune e del Security-Driven Hardening: SDH, charter, detect, rilievo, controllo, harden, verify, archiviazione, chiudibilità, specializzazioni, categorie e catalogo.

Canonico: https://lagune.ai/it-IT/docs/references/glossary
Lingua: it-IT
Originale: https://lagune.ai/docs/references/glossary
Ultimo aggiornamento: 2026-11-04

Ogni termine portante di Lagune e della metodologia Security-Driven Hardening, definito una sola volta, in linguaggio semplice.

### Security-Driven Hardening (SDH)

La metodologia che Lagune implementa: una convenzione blue team sensibile al contesto che rileva il contesto di un sistema, classifica i rischi che quel contesto comporta e guida le correzioni. Le conoscenze di sicurezza risiedono nella specifica e nelle sue specializzazioni su richiesta, così uno sviluppatore e chi non lo è vengono serviti attraverso lo stesso flusso.

### Lagune

L'implementazione di riferimento di SDH: nove comandi per agenti, ognuno con il template che compila, che un agente IA esegue per mettere in sicurezza una codebase. Ogni agente li installa tramite il proprio installer di plugin o tramite [**skills.sh**](https://www.skills.sh/wellwelwel/lagune), come mostra la [pagina di installazione](https://lagune.ai/it-IT/docs), ed eseguono il motore di Lagune per ogni passo deterministico.

### Charter

Il livello di governo di Lagune: un insieme di principi con la sicurezza al primo posto che ogni fase successiva deve rispettare. Consideralo il controllo in fase di compilazione della postura di sicurezza di un progetto. Viene salvato in `.lagune/memory/charter.md`.

### Flusso di sviluppo

Il comando universale `/lagune`, che mette in sicurezza il lavoro mentre viene scritto. Accetta qualsiasi prompt in qualsiasi fase, costruisce ciò che hai chiesto e lo mette in sicurezza con impostazioni predefinite sicure prima di restituirtelo, guidato dal charter quando ne esiste uno. Non scrive nulla nel tracciamento di Lagune, quindi il suo unico prodotto è il codice messo in sicurezza. Insieme al charter (prima) e al flusso Blue Team (dopo), è il modo in cui Lagune protegge durante lo sviluppo.

### Flusso Blue Team

L'audit in cinque fasi al centro di Lagune: charter, detect, plan, harden, verify. Ogni fase si basa sulla precedente. "Blue Team" è la tradizione di sicurezza dei difensori, in contrapposizione al Red Team offensivo.

### Rilievo

Un singolo rischio individuato. Ogni rilievo indica cos'è, perché conta e l'evidenza nel codice. Un rilievo è l'unica unità tracciata che plan, harden e verify portano avanti, identificata per nome in ogni artefatto.

### Controllo

Una misura di sicurezza applicata per chiudere un rischio. Harden applica i controlli, verify dimostra che reggono. Lagune non indebolisce mai un controllo per soddisfare un prompt.

### Detect

La fase che legge il codice e mappa cosa fa il sistema e dove sono i rischi. La sua regola guida è rilevare, non inventare: registra solo ciò che il codice sostiene.

### Harden

L'unica fase che tocca il tuo codice. Applica le correzioni del piano una alla volta e registra ognuna come Applied, Partial o Blocked. Applied non significa ancora dimostrata.

### Verify

La fase che dimostra che ogni correzione applicata regge, leggendo il codice e confrontandolo con ciò che harden ha registrato. Restituisce uno di tre verdetti: Risk closed, Risk not closed o Cannot tell from the code.

### Archiviazione

Quando verify dimostra che un rischio è chiuso, il rilievo viene archiviato: rimosso da tutta la catena, con la tua conferma, così smette di essere rielaborato.

### Chiudibilità

La proprietà per cui il lavoro di sicurezza ha uno stato finale. Dato che un rilievo dimostrato chiuso viene archiviato, il flusso può arrivare a riposo, e si riapre solo quando il codice cambia. SDH si può chiudere, non è un ciclo infinito.

### Motore

Il pacchetto `lagune` su **npm**, che i comandi eseguono tramite `npx` per ogni passo deterministico: gli hook, il catalogo e le categorie.

### Specializzazione

Un modulo di conoscenza di sicurezza mirato e indipendente dal linguaggio, che si carica solo su richiesta, mai per impostazione predefinita. Una specializzazione non è un comando. Caricane una in qualsiasi prompt con `read catalog <name>` del motore, per esempio `npx lagune read catalog regex`.

### Categoria

Un gruppo con nome di specializzazioni integrate, da `owasp` a quelle per linguaggio come `javascript`, `python`, `go` e `rust`. Le categorie usate da un progetto, registrate in `.lagune/configs.json`, decidono quali specializzazioni integrate entrano nel suo catalogo. Finché non ne è registrata nessuna, il progetto usa solo `owasp`.

### Catalogo

L'insieme delle specializzazioni che un progetto usa: quelle integrate delle sue categorie più le sue, scritte con `/lagune-specialize`. `read catalog` del motore lo elenca, e le fasi lo confrontano con il codice.

### Prompt su richiesta

Il principio per cui la conoscenza di sicurezza pertinente viene richiamata per ciò che il progetto è davvero, invece di eseguire ogni controllo per impostazione predefinita.

### Identità per nome

Il modello di tracciamento di Lagune: il nome di ogni rilievo, scritto in modo identico come titolo di sezione in ogni artefatto, è la sua identità in tutta la catena. La mappa di tracciamento (`.lagune/tracking.json`) contiene solo il tracciamento, mai prosa.

## Domande frequenti

### Che cos'è il Security-Driven Hardening (SDH)?

SDH è una metodologia di sicurezza blue team sensibile al contesto. Rileva il contesto di un sistema, classifica i rischi che quel contesto comporta e guida le correzioni, esprimendo ogni rilievo in linguaggio semplice. Lagune ne è l'implementazione di riferimento.

### Che cos'è un charter in Lagune?

Il charter è il livello di governo di Lagune, un insieme di principi con la sicurezza al primo posto che ogni fase successiva deve rispettare. Viene salvato in .lagune/memory/charter.md.

### Cosa significa archiviare un rilievo?

Quando verify dimostra che un rischio è chiuso, il rilievo viene archiviato: rimosso da tutta la catena con la tua conferma, così smette di essere rielaborato.
