# Configura gli hook: scegli cosa analizzano

> Scegli cosa lasciano fuori gli hook che analizzano i file, per tutti o per uno solo.

Canonico: https://lagune.ai/it-IT/docs/hooks/configure
Lingua: it-IT
Originale: https://lagune.ai/docs/hooks/configure
Ultimo aggiornamento: 2026-11-06

Il blocco `checkers` di `.lagune/configs.json` stabilisce cosa lasciano fuori gli hook che analizzano i file, per tutti o per uno solo.

## Come configurarlo

Aggiungi o rimuovi percorsi e pattern dalla riga di comando, mettendo ogni pattern tra virgolette perché la shell lo lasci così com'è scritto:

```bash
npx lagune write add --ignore test/fixtures
npx lagune write add --ignore 'packages/*/dist' --checker secrets
npx lagune write remove --ignore test/fixtures
```

Oppure sceglili nella sezione Settings della [dashboard](https://lagune.ai/it-IT/docs/get-started/dashboard), o impostali nel file:

```json
{
  "checkers": {
    "ignore": ["test/fixtures"],
    "secrets": { "gitignore": false, "ignore": ["test/fixtures", "temp"] }
  }
}
```

### Impostazioni

| Chiave      | Valore                                       | Predefinito | Descrizione                                                                                             |
| ----------- | -------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| `gitignore` | `true` o `false`                             | `true`      | Lascia fuori ciò che **Git** ignora. Un file tracciato da **Git** viene analizzato comunque.            |
| `ignore`    | percorsi o pattern dalla radice del progetto | `[]`        | Lascia fuori ciò che corrisponde a ognuno e tutto ciò che contiene, anche un file tracciato da **Git**. |

Al primo livello di `checkers`, una chiave vale per ogni checker. Sotto il nome di un checker, vale solo per quel checker e sostituisce quella condivisa, quindi nell'esempio `secrets` analizza ciò che **Git** ignora e lascia fuori `test/fixtures` e `temp`. Quando `write add --ignore` assegna a un checker la prima lista tutta sua, quella lista parte come copia di quella condivisa.

### Pattern

Un pattern parte dalla radice del progetto, quindi `*.generated.ts` raggiunge solo i file che si trovano lì e `**/*.generated.ts` li raggiunge a qualsiasi profondità. I nomi devono corrispondere esattamente, maiuscole e minuscole comprese.

| Pattern             | Lascia fuori                                      |
| ------------------- | ------------------------------------------------- |
| `dist`              | `dist` nella radice del progetto                  |
| `packages/*/dist`   | `dist` in ogni cartella dentro `packages`         |
| `**/dist`           | ogni `dist`, a qualsiasi profondità               |
| `**/*.generated.ts` | ogni file il cui nome termina con `.generated.ts` |
| `fixture-?`         | `fixture-a`, `fixture-1` e simili                 |
| `[ab]-cache`        | `a-cache` e `b-cache`                             |
| `[*]x`              | `*x`, con un `*` letterale                        |

## Come leggere il risultato

Il report si chiude indicando quanti percorsi l'analisi ha lasciato fuori, in base a cosa li ignora:

```text
Skipped 25 paths that Git ignores and 3 paths that .lagune/configs.json ignores. Name one with --dir or --file to scan it.
```

Un percorso indicato con `--dir` o `--file` viene analizzato qualunque cosa dicano le impostazioni. Un'impostazione che il motore non riesce a leggere ferma il checker con un errore che la nomina, come un pattern che inizia con `!` o con uno spazio, esce dal progetto, lascia una parentesi quadra aperta o richiede troppo tempo per essere confrontato.

## Domande frequenti

### Lagune le imposta al posto mio?

No. Il charter elenca le cartelle versionate che, secondo la sua lettura, non sono codice tuo da difendere, come le fixture di test scritte per sembrare vulnerabili, e registra solo quelle che scegli tramite il numero.

### Quando un checker dovrebbe analizzare ciò che Git ignora?

Quando non hai motivo di fidarti del repository, dato che i suoi file .gitignore potrebbero nascondere codice, oppure quando una cartella di build potrebbe contenere una chiave inserita in fase di build. Imposta gitignore a false per tutti i checker o per uno solo.
