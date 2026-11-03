# Hook interpreter: segnala i sink di esecuzione dinamica del codice

> Analizza una codebase alla ricerca di sink di esecuzione dinamica del codice in vari linguaggi, oppure valuta un singolo frammento, dalla riga di comando.

Canonico: https://lagune.ai/it-IT/docs/hooks/interpreter
Lingua: it-IT
Originale: https://lagune.ai/docs/hooks/interpreter
Ultimo aggiornamento: 2026-11-03

L'hook `interpreter` segnala i **sink di esecuzione dinamica del codice**: costrutti che trasformano dati in codice in esecuzione o li passano a una shell, da `eval` alla deserializzazione nativa. È consapevole del linguaggio, legge ogni file con le sue regole, ed è il motore deterministico dietro la [specializzazione `interpreter`](https://lagune.ai/it-IT/docs/catalog), che puoi eseguire tu stesso in modalità **scan** o **check**.

## Come eseguirlo

**Analizza la codebase**

```bash
npx lagune read interpreter               # scans the whole project
npx lagune read interpreter --dir src     # scans a directory
npx lagune read interpreter --file app.py # scans a single file
```

**Controlla un frammento**

```bash
npx lagune read interpreter --lang javascript --pattern 'eval(x)'   # => careful
npx lagune read interpreter --lang python --pattern 'json.loads(x)' # => safe
```

Questi sink sono a doppio uso: se un input influenzato da un attaccante ne raggiunga uno non si può stabilire con un'analisi statica, quindi ogni corrispondenza è un **avviso da rivedere**, mai un rilievo confermato. L'analisi stampa un'unica sezione **Dynamic-execution sinks to review**, raggruppata per file. Un'esecuzione pulita stampa `no dynamic-execution sinks found`.

**Leggi il codice segnalato, non eseguirlo mai!**

Ragiona su ogni sink in modo **statico**, tracciando se un input non attendibile lo raggiunge. Non eseguire mai né passare a `eval` il codice segnalato, né alcun codice remoto o scaricato a runtime che esso richiami, per "testare" cosa fa.

## Come leggere il verdetto

| Verdetto  | Significato                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `careful` | Il frammento contiene un sink di esecuzione dinamica per il suo linguaggio. Rivedilo leggendolo, mai eseguendolo. |
| `safe`    | Non è stato trovato alcun sink di esecuzione dinamica per il linguaggio indicato.                                 |

### Opzioni della CLI

| Opzione     | Valore                 | Descrizione                                                                                                  |
| ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `--pattern` | un frammento di codice | Controlla un frammento. Ripetila per controllarne diversi, un verdetto per riga.                             |
| `--lang`    | un linguaggio          | Obbligatoria con `--pattern`: uno tra javascript, python, php, ruby, java, kotlin, go, rust, c, cpp, csharp. |
| `--dir`     | una directory          | Limita l'analisi a una directory. Si ripete e si combina con `--file`.                                       |
| `--file`    | un file                | Limita l'analisi a un singolo file. Si ripete e si combina con `--dir`.                                      |

Senza opzioni analizza l'intero progetto. `--pattern` richiede `--lang` e non si può combinare con `--dir` o `--file`.

### Linguaggi supportati

L'analisi legge questi linguaggi, riconosciuti dall'estensione del file, ognuno controllato rispetto al proprio insieme di sink di esecuzione dinamica.

| #   | Linguaggio                  | Estensioni                                                                                                   | Sink che segnala                                                                                                                                                                                                             |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` | `eval()`, costruttore Function, `setTimeout`/`setInterval` con corpo stringa, modulo `vm`, exec di `child_process`, `require()` dinamico, `import()` dinamico                                                                |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                | `eval`/`exec`, `__import__()`, `os.system`/`os.popen`, `subprocess` con `shell=True`, `pickle.load`/`loads`, `yaml.load` (non sicuro)                                                                                        |
| 3   | **Ruby**                    | `.rb`                                                                                                        | famiglia eval (`instance_eval`/`class_eval`/`module_eval`/`eval`), `system`/`exec`, backtick o `%x`, `Kernel#open` / `IO.popen`/`read`/`binread` / `Open3`, `Process.spawn`, `Marshal.load`                                  |
| 4   | **Go**                      | `.go`                                                                                                        | `exec.Command`/`exec.CommandContext`, `plugin.Open`                                                                                                                                                                          |
| 5   | **PHP**                     | `.php`                                                                                                       | `eval()`, `assert()` su stringa, `create_function()`, esecuzione in shell (`system`/`exec`/`shell_exec`/`passthru`/`popen`/`proc_open`), `call_user_func`/`call_user_func_array`, `include`/`require` con percorso a runtime |
| 6   | **Rust**                    | `.rs`                                                                                                        | `Command::new`, `process::Command`                                                                                                                                                                                           |
| 7   | **Java**                    | `.java`                                                                                                      | `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                                             |
| 8   | **Kotlin**                  | `.kt`, `.kts`                                                                                                | I sink della JVM: `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                           |
| 9   | **C#**                      | `.cs`                                                                                                        | `Process.Start` / `new Process`, `BinaryFormatter`, `Assembly.Load`                                                                                                                                                          |
| 10  | **C**                       | `.c`, `.h`                                                                                                   | `system()`, `popen()`, la famiglia `exec*` (`execl`, `execve`, `execvp`, …)                                                                                                                                                  |
| 11  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 | `system()`, `popen()`, la famiglia `exec*` (`execl`, `execve`, `execvp`, …)                                                                                                                                                  |

**Al meglio delle possibilità, non esaustivo**

Legge il sorgente come testo, quindi un sink costruito a runtime, nascosto dietro un alias o scritto in una forma che non riconosce può sfuggirgli. Considera la tabella un solido punto di partenza, non un inventario completo.

**Suggerimento**

L'hook garantisce la base (questi sink esistono, e dove): se un valore non attendibile ne raggiunga davvero uno è la valutazione coperta dalla [specializzazione `interpreter`](https://lagune.ai/it-IT/docs/catalog).

## Domande frequenti

### L'hook interpreter conferma una vulnerabilità?

No. Segnala i sink di esecuzione dinamica come avviso da rivedere, mai come rilievo confermato, perché se un input influenzato da un attaccante raggiunga il sink non si può stabilire con un'analisi statica.

### Quali linguaggi copre l'hook interpreter?

Legge i linguaggi della tabella Linguaggi supportati, riconosciuti dall'estensione del file, ognuno controllato rispetto al proprio insieme di sink. Gli altri linguaggi non producono sink.
