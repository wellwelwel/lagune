# Hook regex: rileva i pattern ReDoS

> Analizza una codebase alla ricerca di regex esposte al ReDoS, oppure valuta un singolo pattern, dalla riga di comando.

Canonico: https://lagune.ai/it-IT/docs/hooks/regex
Lingua: it-IT
Originale: https://lagune.ai/docs/hooks/regex
Ultimo aggiornamento: 2026-11-04

L'hook `regex` è il motore deterministico di sicurezza delle regex che la [specializzazione `regex`](https://lagune.ai/it-IT/docs/catalog) esegue, e puoi eseguirlo tu stesso. Funziona in due modalità con un solo comando: uno **scan** che analizza una codebase alla ricerca di pattern esposti al **ReDoS** e costruiti a runtime, e un **check** che valuta un singolo pattern che gli fornisci.

## Analizza una codebase

Senza flag analizza l'intero progetto. `--dir` limita l'analisi a una directory, `--file` a un singolo file. Entrambi si ripetono e si combinano in un unico report, con ogni file elencato una sola volta anche quando più di un obiettivo lo copre.

**Tutto il progetto**

```bash
npx lagune read regex
```

**Una directory**

```bash
npx lagune read regex --dir src/services
```

**Un singolo file**

```bash
npx lagune read regex --file bin/import.pl
```

**Più obiettivi**

```bash
npx lagune read regex --dir core --dir workers --file Sources/App/Router.swift
```

**Con un limite**

`--limit` imposta la soglia ReDoS per l'analisi (predefinita 25), lo stesso limite che accetta la modalità check. Un limite più basso è più severo.

```bash
npx lagune read regex --dir src/services --limit 15
```

L'output è testo semplice, le cui intestazioni dicono come leggere ogni sezione. Una sezione viene mostrata solo quando ha dei rilievi.

```text
Vulnerable regular expressions found:

cmd/server/main.go
  ([a-z]+)+$ (exponential, search)

Dynamically built regular expressions (review manually by simulating a constructed regex):

app/payments.php
crates/parser/lexer.rs
lib/validate.py

Static regex wrapped in a constructor (use a literal instead):

config/token.rb
```

Quando non trova nulla, stampa una sola riga.

```bash
npx lagune read regex --dir src/clean
# => no unsafe patterns found
```

### Come leggere le sezioni

| Sezione                                                                                     | Significato                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Vulnerable regular expressions found`                                                      | Pattern esposti al ReDoS, raggruppati per file con ogni pattern rientrato sotto, seguito tra parentesi dal motivo per cui non è sicuro e, quando li ha, dal suo ambito e dai suoi flag. Ogni riga è non sicura, quindi il verdetto non viene ripetuto. |
| `Regular expressions the analysis could not settle (review manually)`                       | Pattern che l'analisi non è riuscita a definire entro il suo limite di lavoro, elencati nello stesso modo.                                                                                                                                             |
| `Dynamically built regular expressions (review manually by simulating a constructed regex)` | File che costruiscono una regex a partire da una variabile, una concatenazione o un'interpolazione.                                                                                                                                                    |
| `Static regex wrapped in a constructor (use a literal instead)`                             | File che passano un semplice letterale stringa a un costruttore di regex dove un letterale regex è più semplice ed evita una compilazione a runtime.                                                                                                   |

La prima sezione è un rilievo di sicurezza. La seconda e la terza non sono rilievi di per sé: indicano codice che un controllo statico non può definire, quindi richiedono una lettura umana. La quarta è un suggerimento di chiarezza, non un rilievo di sicurezza.

### Opzioni della CLI

| Opzione     | Valore                   | Descrizione                                                                                                                   |
| ----------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `--pattern` | il sorgente di una regex | Controlla un pattern. Ripetila per controllarne diversi, un verdetto per pattern, nell'ordine.                                |
| `--flags`   | flag della regex         | Controlla ogni `--pattern` con questi flag, come `im`. Si applica solo alla modalità check.                                   |
| `--dir`     | una directory            | Limita l'analisi a una directory. Si ripete e si combina con `--file`.                                                        |
| `--file`    | un file                  | Limita l'analisi a un singolo file. Si ripete e si combina con `--dir`.                                                       |
| `--limit`   | un intero non negativo   | Imposta il limite di ripetizione ReDoS (predefinito 25). Si applica a entrambe le modalità. Un limite più basso è più severo. |

Senza opzioni analizza l'intero progetto. `--pattern` è la modalità check e non si può combinare con `--dir` o `--file`.

### Scegli cosa analizza

Lascia fuori ciò che **Git** ignora. Per lasciare fuori altro, o per analizzare ciò che **Git** ignora, assegna impostazioni proprie a `regex`:

```bash
npx lagune write add --ignore test/fixtures --checker regex
```

```json
{
  "checkers": {
    "regex": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

Tutte le impostazioni sono in [Configura gli hook](https://lagune.ai/it-IT/docs/hooks/configure).

### Linguaggi supportati

L'analisi legge questi linguaggi, riconosciuti dall'estensione del file, ognuno con le sue regole, così un pattern di un linguaggio non viene mai testato con le regole di un altro. Tutto il resto viene saltato invece di essere analizzato con le regole sbagliate.

| #   | Linguaggio                  | Estensioni                                                                                                   |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                |
| 3   | **Ruby**                    | `.rb`                                                                                                        |
| 4   | **Go**                      | `.go`                                                                                                        |
| 5   | **PHP**                     | `.php`                                                                                                       |
| 6   | **Rust**                    | `.rs`                                                                                                        |
| 7   | **Java**                    | `.java`                                                                                                      |
| 8   | **C#**                      | `.cs`                                                                                                        |
| 9   | **C**                       | `.c`, `.h`                                                                                                   |
| 10  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 |
| 11  | **Kotlin**                  | `.kt`, `.kts`                                                                                                |
| 12  | **Swift**                   | `.swift`                                                                                                     |
| 13  | **Scala**                   | `.scala`, `.sc`                                                                                              |
| 14  | **Dart**                    | `.dart`                                                                                                      |
| 15  | **PowerShell**              | `.ps1`, `.psm1`, `.psd1`                                                                                     |
| 16  | **Elixir**                  | `.ex`, `.exs`                                                                                                |
| 17  | **Objective-C**             | `.m`, `.mm`                                                                                                  |
| 18  | **R**                       | `.r`                                                                                                         |
| 19  | **Julia**                   | `.jl`                                                                                                        |
| 20  | **Clojure**                 | `.clj`, `.cljs`, `.cljc`, `.edn`                                                                             |
| 21  | **Crystal**                 | `.cr`                                                                                                        |
| 22  | **Nim**                     | `.nim`, `.nims`                                                                                              |
| 23  | **V**                       | `.v`                                                                                                         |
| 24  | **D**                       | `.d`                                                                                                         |
| 25  | **Perl**                    | `.pl`, `.pm`                                                                                                 |

**Al meglio delle possibilità, non esaustivo**

Legge il sorgente come testo, quindi non può giudicare un pattern costruito a runtime, e un pattern distribuito su più righe, nascosto dietro un alias o scritto in una forma che non riconosce può sfuggirgli. Considera le sezioni un solido punto di partenza, non un inventario completo, e continua a leggere il codice per ciò che non riescono a raggiungere.

## Controlla un singolo pattern

Passa `--pattern` con il sorgente del pattern per valutarlo. L'hook stampa una parola: `safe`, `unsafe`, `undetermined` quando l'analisi raggiunge il suo limite di lavoro prima di definire il pattern, oppure `invalid regex`. Ripeti `--pattern` per valutarne diversi insieme, un verdetto per pattern, nell'ordine.

**Un pattern**

```bash
npx lagune read regex --pattern '(a+)+$'
# => unsafe

npx lagune read regex --pattern '^[a-z0-9_]{3,20}$'
# => safe
```

**Più pattern**

```bash
npx lagune read regex --pattern '(a+)+$' --pattern '^[a-z]+$'
# => unsafe
# => safe
```

**Con i flag**

`--flags` controlla ogni `--pattern` della chiamata con i flag con cui viene eseguito, perché un flag cambia quali caratteri un pattern riconosce.

```bash
npx lagune read regex --pattern '^(?:a|A)+$'
# => safe

npx lagune read regex --pattern '^(?:a|A)+$' --flags 'i'
# => unsafe
```

**Con un limite**

`--limit` imposta il limite di ripetizione (predefinito 25) e si applica a ogni `--pattern` della chiamata. Un limite più basso è più severo.

```bash
npx lagune read regex --pattern 'a?a?a?' --limit 2
# => unsafe
```

**Perché un argomento tra apici**

Ogni pattern viene passato come valore di un flag, mai interpolato nel comando. Un valore con virgolette o backtick resta inerte e non può iniettare nulla nella shell. Racchiudi sempre il pattern tra apici singoli, così la tua shell non lo espande prima.

**Suggerimento**

È lo stesso motore che esegue la [specializzazione `regex`](https://lagune.ai/it-IT/docs/catalog): lo scan avvia un passaggio ReDoS, il check conferma un pattern che fa emergere.

## Domande frequenti

### Come controllo una regex contro il ReDoS dalla CLI?

Esegui npx lagune read regex --pattern '<pattern>'. Restituisce safe, unsafe, undetermined o invalid regex.

### Come analizzo un intero progetto alla ricerca di regex non sicure?

Esegui l'hook regex in modalità scan sulla codebase. Segnala i pattern esposti al ReDoS in 25 linguaggi supportati.
