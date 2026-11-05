# Hook secrets: rileva i segreti scritti nel codice

> Analizza una codebase alla ricerca di credenziali scritte nel codice, dalla riga di comando.

Canonico: https://lagune.ai/it-IT/docs/hooks/secrets
Lingua: it-IT
Originale: https://lagune.ai/docs/hooks/secrets
Ultimo aggiornamento: 2026-11-05

L'hook `secrets` segnala le **credenziali compilate nel sorgente** invece che lette dall'ambiente. Si basa sulla **provenienza** (un letterale contro una lettura dall'ambiente), non sul contenuto del valore, quindi non ha bisogno di un catalogo esaustivo dei prefissi dei fornitori e non produce quasi falsi positivi. È il motore deterministico dietro la [specializzazione `secrets`](https://lagune.ai/it-IT/docs/catalog).

Le firme dei formati dei fornitori, le credenziali nelle stringhe di connessione e un letterale associato a un identificatore dal nome di segreto sono **indipendenti dal linguaggio**: la stessa stringa si legge allo stesso modo in qualsiasi file. Le due euristiche che dipendono dalla sintassi, una lettura dall'ambiente con un valore predefinito scritto nel codice e un segreto che finisce in un sink di log, sono **consapevoli del linguaggio**, così un `console.log` di JavaScript non viene mai letto in un file Rust e `os.getenv("X", "default")` di Python viene riconosciuto per quello che è.

## Come eseguirlo

```bash
npx lagune read secrets                  # scans the whole project
npx lagune read secrets --dir src        # scans a directory
npx lagune read secrets --file config.ts # scans a single file
```

L'analisi stampa fino a due sezioni. **Hardcoded secrets found** è l'insieme dei rilievi (un valore predefinito scritto nel codice per una variabile d'ambiente dal nome di segreto, una credenziale incorporata in una stringa di connessione o un valore che corrisponde a un formato di fornitore selezionato), quindi l'hook esce con un codice diverso da zero. **Secret handling to review manually** è un insieme di piste: un semplice letterale associato a un identificatore dal nome di segreto (la sua provenienza si può stabilire, ma se il valore sia davvero un segreto no) e un valore dal nome di segreto che finisce in un sink di log o di risposta. Un'esecuzione pulita stampa `no hardcoded secrets found`.

### Opzioni della CLI

| Opzione  | Valore        | Descrizione                                                             |
| -------- | ------------- | ----------------------------------------------------------------------- |
| `--dir`  | una directory | Limita l'analisi a una directory. Si ripete e si combina con `--file`.  |
| `--file` | un file       | Limita l'analisi a un singolo file. Si ripete e si combina con `--dir`. |

Senza opzioni analizza l'intero progetto.

### Scegli cosa analizza

Lascia fuori ciò che **Git** ignora. Per lasciare fuori altro, o per analizzare ciò che **Git** ignora, assegna impostazioni proprie a `secrets`:

```bash
npx lagune write add --ignore test/fixtures --checker secrets
```

```json
{
  "checkers": {
    "secrets": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

Tutte le impostazioni sono in [Configura gli hook](https://lagune.ai/it-IT/docs/hooks/configure).

### Copertura dei linguaggi

Il rilievo sul valore predefinito dell'ambiente e la pista sui sink di log leggono un insieme di forme per ogni linguaggio, quindi coprono i linguaggi qui sotto e restano in silenzio altrove. Gli altri tre segnali vengono eseguiti su **ogni** file.

| Segnale                          | Linguaggi                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------- |
| Valore predefinito dell'ambiente | JavaScript/TypeScript, Python, Ruby, PHP, Kotlin, Java, Go (`cmp.Or`), Rust, C# |
| Sink di log o di risposta        | JavaScript/TypeScript, Python, Ruby, PHP, Java, Kotlin, Go, Rust, C, C++, C#    |

**È un problema di policy?**

No. Riconoscere il formato di un segreto per avvisare che è finito in un commit è uno strumento difensivo standard, la stessa operazione che svolgono gitleaks, trufflehog e la push protection di GitHub. L'hook include firme di rilevamento (i **formati** pubblici dei token), mai un segreto reale, e verifica e spiega invece di esfiltrare.

## Domande frequenti

### Come evita i falsi positivi l'hook secrets?

Si basa sulla provenienza, non sul contenuto del valore. I formati ad alta affidabilità (token dei fornitori, valori predefiniti dell'ambiente, stringhe di connessione) sono rilievi che escono con un codice diverso da zero. Un semplice letterale associato a un identificatore dal nome di segreto è una pista da confermare, e lo stesso identificatore letto da process.env non viene segnalato affatto.
