# /lagune-specialize: addestra una specializzazione di sicurezza con testo semplice

> Distilla una fonte o un tema di sicurezza che gli fornisci in una nuova specializzazione su richiesta.

Canonico: https://lagune.ai/it-IT/docs/commands/specialize
Lingua: it-IT
Originale: https://lagune.ai/docs/commands/specialize
Ultimo aggiornamento: 2026-11-05

🎓 Insegna a **Lagune** una nuova specializzazione, a partire da una fonte o da un tema che gli fornisci.

Legge il materiale e lo distilla in una specializzazione mirata ed esclusivamente difensiva, con la stessa forma di quelle [integrate](https://lagune.ai/it-IT/docs/catalog), così le fasi detect e verify la caricano poi come qualsiasi altra. Si limita a verificare e spiegare: non scrive mai input di attacco né exploit, e non tocca mai il tuo codice.

**Da un articolo**

```prompt
# Un link o un riferimento: Lagune lo distilla nella difesa
/lagune-specialize https://owasp.org/www-community/attacks/SQL_Injection
```

**Da un exploit**

```prompt
# Un attacco come fonte: la specializzazione resta comunque la difesa
/lagune-specialize "' OR 1=1 -- inserisce SQL nel testo della query"
```

**Da un tema**

```prompt
# Oppure nomina semplicemente cosa coprire
/lagune-specialize SQL injection
```

**Un attacco può essere la fonte, mai il risultato**

Puntarlo su un attacco va bene quando l'obiettivo è difendersi: la descrizione di un exploit è materiale di studio che distilla nella difesa. La specializzazione che produce verifica e spiega sempre, e non produce mai un exploit funzionante, un payload o una tecnica di evasione.

## Cosa scrive

Il risultato sono due file nel tuo progetto, versionati e revisionabili insieme al tuo codice:

- La specializzazione in `.lagune/catalog/<name>.md`, con la stessa forma di quelle [integrate](https://lagune.ai/it-IT/docs/catalog).
- La sua voce in `.lagune/configs.json`, dove il tuo progetto indicizza le proprie specializzazioni perché il catalogo le unisca a quelle integrate.

Poi elenca il catalogo per confermare che la nuova voce ci sia. Le tue specializzazioni sono sempre nel catalogo, qualunque siano le sue categorie. Non aggiungi mai un comando né tocchi il pacchetto: una nuova specialità è un file di conoscenza più una voce di indice, scritti nel tuo progetto.

## Affinare, mai sovrascrivere

Specializzare un nome che esiste già, che sia una specializzazione integrata come `regex` o una che hai specializzato in precedenza, **riconcilia** il file attuale invece di sostituirlo. Legge ciò che c'è, vi incorpora la nuova conoscenza, mantiene ciò che è ancora valido e riscrive ciò che è cambiato. Nulla viene scartato senza essere letto. Una tua specializzazione oscura quella integrata con lo stesso nome, così puoi affinare una specializzazione integrata per il tuo progetto senza perderla.

**Suggerimento**

- La nuova specializzazione si carica esattamente come una integrata: le fasi detect e verify la usano su richiesta, oppure caricala tu con `npx lagune read catalog <name>` e assegnale un compito.
- Quando il materiale ha un'origine identificabile (un articolo, un autore, un link, uno standard), la specializzazione la cita. Un semplice tema non riporta alcuna fonte.

**Nota**

**Viene eseguita solo quando la richiami:** l'agente non la avvia mai di propria iniziativa.

## Domande frequenti

### Come aggiungo una specializzazione di sicurezza personalizzata?

Esegui /lagune-specialize con una fonte o un tema. Lo distilla in una specializzazione esclusivamente difensiva, scritta in .lagune/catalog/<name>.md più la sua voce in .lagune/configs.json.

### Lagune può imparare dalla descrizione di un exploit?

Sì, come fonte, mai come risultato. Un attacco può essere la fonte, mai il prodotto. Specialize non scrive mai input di attacco né exploit.

### Specialize sovrascrive le specializzazioni integrate?

No. Affina, non sovrascrive mai.
