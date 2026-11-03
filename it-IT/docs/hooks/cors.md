# Hook cors: verifica le origini CORS

> Analizza il sorgente alla ricerca di una allowlist di origini CORS aggirabile, oppure valuta un singolo valore di origine troppo permissivo, dalla riga di comando.

Canonico: https://lagune.ai/it-IT/docs/hooks/cors
Lingua: it-IT
Originale: https://lagune.ai/docs/hooks/cors
Ultimo aggiornamento: 2026-11-03

L'hook `cors` è il motore deterministico dietro la [specializzazione `http-request`](https://lagune.ai/it-IT/docs/catalog), e puoi eseguirlo tu stesso. Funziona in due modalità con un solo comando: uno **scan** che analizza il sorgente alla ricerca di una **allowlist di origini aggirabile** (una regex di validazione dell'host che un host malevolo riesce a superare) e uno **score** che classifica un singolo valore di **origine CORS** come `wildcard`, `null` o `safe`.

## Analizza una codebase

Senza flag analizza l'intero progetto.

**Tutto il progetto**

```bash
npx lagune read cors
```

**Una directory**

```bash
npx lagune read cors --dir src/server
```

**Un singolo file**

```bash
npx lagune read cors --file internal/auth/origin.go
```

Elenca ogni allowlist aggirabile sotto un'unica intestazione, raggruppata per file. Un validatore di host il cui `.+`/`.*` si trova nel segmento authority prima del suffisso dell'host fidato (`^https?://.+\.trusted\.com`) lascia passare un host malevolo come `your-site.com.attacker.com`.

```text
Origin-allowlist patterns with a greedy wildcard (bypassable, review):

internal/auth/origin.go
  ^https?://.+\.trusted\.com
```

È una pista da verificare, non un rilievo chiuso: se la regex governi davvero una decisione di fiducia non si può stabilire dal testo, quindi uno scan non cambia mai il codice di uscita. Leggile una per una e conferma che l'allowlist confronti per uguaglianza completa. Quando non trova nulla, stampa una sola riga.

```bash
npx lagune read cors --dir src/clean
# => no bypassable origin allowlist found
```

## Valuta un'origine

Passa ogni origine con `--origin`. L'hook stampa una parola per origine ed esce con un codice diverso da zero se trova un `wildcard` o un `null`.

**Un**

```bash
npx lagune read cors --origin '*'                       # => wildcard
npx lagune read cors --origin 'null'                    # => null
npx lagune read cors --origin 'https://app.example.com' # => safe
```

**Più origini**

Ripeti `--origin` per valutare un'intera allowlist in una sola chiamata, un verdetto per riga, nell'ordine.

```bash
npx lagune read cors \
  --origin 'https://app.example.com' \
  --origin '*' \
  --origin 'null'
# => safe
# => wildcard
# => null
```

| Verdetto   | Significato                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| `safe`     | Non è `*`, `null` né un glob con `*`. Non garantisce che l'origine sia ben formata.                   |
| `wildcard` | `*`, un glob di sottodominio/host/porta: qualsiasi sito (o un ampio insieme) può leggere la risposta. |
| `null`     | L'origine `null`, che gli iframe in sandbox e i redirect possono falsificare.                         |

Solo `safe` è un via libera, e `--origin` è un oracolo dei valori: giudica il valore, non l'handler, quindi conferma l'handler con la specializzazione `http-request`.

### Opzioni della CLI

| Opzione    | Valore        | Descrizione                                                                |
| ---------- | ------------- | -------------------------------------------------------------------------- |
| `--origin` | un'origine    | Valuta un valore di origine. Ripetila per valutarne diversi, uno per riga. |
| `--dir`    | una directory | Limita l'analisi a una directory. Si ripete e si combina con `--file`.     |
| `--file`   | un file       | Limita l'analisi a un singolo file. Si ripete e si combina con `--dir`.    |

Senza opzioni analizza l'intero progetto. `--origin` è la modalità score e non si può combinare con `--dir` o `--file`.

**Cosa non copre**

Lo scan legge la forma della **regex aggirabile**, e `--origin` valuta i **valori** di origine. Due schemi a livello di sorgente restano fuori portata: la riflessione dell'`Origin` della richiesta (il server rimanda indietro l'`Origin` in arrivo, o lo abbina alle credenziali) e una allowlist permissiva basata su `endsWith` o sottostringhe. Riconoscili nel codice e trattali come descrive la [specializzazione `http-request`](https://lagune.ai/it-IT/docs/catalog).

## Domande frequenti

### Perché un'origine CORS null è pericolosa?

Gli iframe in sandbox e alcuni redirect inviano Origin: null, quindi una allowlist che si fida di null concede a quei contesti l'accesso in lettura. L'hook cors la segnala insieme al wildcard.

### Come individuo una allowlist di origini CORS aggirabile?

Esegui npx lagune read cors sulla codebase. Segnala una regex di validazione dell'host il cui wildcard greedy si trova prima del suffisso fidato, così un host malevolo come your-site.com.attacker.com riesce a passare.
