# /lagune: codice sicuro mentre la tua IA lo scrive

> Costruisce ciò che chiedi e lo mette in sicurezza mentre viene scritto, guidato dal charter, senza alcun flusso da seguire.

Canonico: https://lagune.ai/it-IT/docs/commands/lagune
Lingua: it-IT
Originale: https://lagune.ai/docs/commands/lagune
Ultimo aggiornamento: 2026-11-03

⌨️ Fai il lavoro che hai chiesto, protetto mentre viene scritto. **`/lagune`** accetta qualsiasi prompt in qualsiasi fase, costruisce ciò che volevi e lo mette in sicurezza con impostazioni predefinite sicure prima di restituirtelo.

## Come usarlo

Aggiungi **`/lagune`** a qualsiasi prompt e descrivi il lavoro come faresti sempre.

**📘 Istruzioni per l**

```md
# Le istruzioni del mio progetto per gli agenti

<!-- ... -->

## Sicurezza

- Usa la skill `/lagune` ogni volta che costruisci o modifichi codice, così migliora la sicurezza per impostazione predefinita.
```

    - Per esempio: **AGENTS.md**, **CLAUDE.md**, **.github/copilot-instructions.md**, **.cursorrules** e così via.

**💬 Una funzionalità**

```prompt
/lagune permetti agli utenti di caricare una foto personalizzata nel loro profilo.
```

**💬 Una correzione**

```prompt
/lagune quando l'utente invia il modulo non succede nulla. Scopri quale può essere la causa e correggila.
```

**💬 Un refactoring**

```prompt
/lagune disaccoppia e migliora la logica del payload
```

**Il charter è facoltativo, ma è meglio averlo**

**`/lagune`** funziona con o senza charter. Se c'è, le regole del tuo progetto plasmano ogni costruzione. Definiscile una volta con [`/lagune-charter`](https://lagune.ai/it-IT/docs/commands/charter).

## Come funziona

Avvolge il lavoro in tre movimenti, senza scrivere nulla in Lagune:

1. Carica il tuo charter, se esiste, e i suoi principi governano l'intera costruzione, ripiegando su una base sicura per impostazione predefinita quando non ne hai ancora uno.
2. Elenca il [catalogo](https://lagune.ai/it-IT/docs/catalog) del tuo progetto e carica solo le specializzazioni che il tuo lavoro tocca, la stessa conoscenza su richiesta che usa il flusso di audit.
3. Applica la difesa mentre il codice viene scritto, poi rilegge il proprio risultato per confermare che i controlli reggano davvero prima di restituirti il lavoro.

Il risultato è codice funzionante nel tuo progetto, sicuro fin dalla prima riga.

**Usalo quando vuoi**

Niente detect, niente plan, niente pulizia a posteriori. **`/lagune`** si adatta allo stesso modo a uno scaffold appena creato o a una modifica su una codebase matura, e mette in sicurezza il lavoro strada facendo, non dopo.

## Cosa non fa

- Non scrive nulla nella directory `.lagune`, né artefatti né tracciamento, quindi l'unica cosa che produce è il codice messo in sicurezza che hai chiesto.
- Non indebolisce una regola per soddisfare un prompt: se ciò che hai chiesto violasse un principio del charter, si ferma e te lo dice prima, invece di costruirlo direttamente in modo non sicuro.

## Domande frequenti

### Cosa fa /lagune?

Accetta qualsiasi prompt in qualsiasi fase, costruisce ciò che hai chiesto e lo mette in sicurezza con impostazioni predefinite sicure prima di restituirtelo. La difesa viene applicata mentre il codice viene scritto, non dopo.

### Mi serve un charter per usare /lagune?

No. Funziona con o senza. Con un charter, le regole del tuo progetto plasmano ogni costruzione. Senza, ripiega su una base sicura per impostazione predefinita.

### Qual è la differenza tra /lagune e il flusso Blue Team?

/lagune protegge il nuovo lavoro mentre lo scrivi, senza alcun flusso da seguire. Il flusso Blue Team esegue le cinque fasi di audit in ordine su un progetto esistente.

### /lagune traccia i rilievi o scrive artefatti?

No. Non scrive nulla nella directory .lagune, né artefatti né tracciamento. L'unica cosa che produce è il codice messo in sicurezza che hai chiesto.

### Come faccio a far usare /lagune automaticamente al mio agente?

Aggiungi un'istruzione al file di istruzioni del tuo agente (AGENTS.md, CLAUDE.md, .cursorrules e simili) che gli dica di usare la skill /lagune ogni volta che costruisce o modifica codice.
