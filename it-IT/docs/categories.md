# Categorie

> Le categorie di specializzazioni che un progetto Lagune può usare, da OWASP all'hardening per linguaggio di JavaScript, Python, Go e Rust, e come modificarle.

Canonico: https://lagune.ai/it-IT/docs/categories
Lingua: it-IT
Originale: https://lagune.ai/docs/categories
Ultimo aggiornamento: 2026-11-05

**Lagune** raggruppa le sue [**specializzazioni**](https://lagune.ai/it-IT/docs/catalog) integrate in **13 categorie**. Le categorie usate da un progetto decidono quali specializzazioni integrate entrano nel suo [**catalogo**](https://lagune.ai/it-IT/docs/catalog), e si dividono in due: ciò che fa il sistema e ciò in cui è scritto.

Finché non è registrata alcuna categoria, un progetto usa solo `owasp`. [`/lagune-charter`](https://lagune.ai/it-IT/docs/commands/charter) registra ogni categoria che la sua lettura del progetto giustifica, e tu puoi modificarle in qualsiasi momento.

## Ciò che fa il sistema

| Categoria      | Chiave    | Cosa mette in sicurezza                                                                                                                        |
| -------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| OWASP          | `owasp`   | I rischi di sicurezza applicativa che OWASP monitora: injection, controllo degli accessi inefficace, falle di autenticazione e di crittografia |
| Infrastruttura | `infra`   | La configurazione di container, workload e serverless: Dockerfile, Compose, sicurezza dei Pod, IAM e trigger FaaS                              |
| IA / LLM       | `ai`      | Le integrazioni di IA e LLM, contro la prompt injection e i collegamenti non sicuri con strumenti, agenti, retrieval e MCP                     |
| Lovable        | `lovable` | Le app Supabase generate dall'IA (Lovable e simili): lacune nelle RLS, chiavi `service_role` esposte e impostazioni predefinite non sicure     |

## Ciò in cui è scritto

| Categoria  | Chiave       | Cosa mette in sicurezza                                                                                                         |
| ---------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| JavaScript | `javascript` | RCE tramite `eval` e `child_process`, path traversal e prototype pollution, in tutti i suoi runtime                             |
| Python     | `python`     | RCE per deserializzazione con `pickle` e YAML, attraversamento tramite `str.format` e class pollution                           |
| Rust       | `rust`       | API `unsafe` non corrette, uso improprio di `transmute`, integer overflow e comportamento indefinito al confine FFI             |
| C / C++    | `c-cpp`      | Bug di format string, buffer overflow e scritture fuori dai limiti che permettono l'esecuzione di codice                        |
| PHP        | `php`        | Aggiramento dell'autenticazione per type juggling, catene di gadget di object injection e configurazioni predefinite non sicure |
| Go         | `go`         | Bug di interfacce con nil tipizzato, data race tra goroutine e concorrenza non sicura nei percorsi di sicurezza                 |
| Java       | `java`       | Catene di gadget di deserializzazione con `ObjectInputStream` che culminano nell'esecuzione di codice remoto                    |
| Ruby       | `ruby`       | Catene di gadget di deserializzazione con `Marshal.load` e YAML che portano all'esecuzione di codice remoto                     |
| .NET / C#  | `dotnet`     | RCE per deserializzazione con `BinaryFormatter` e gli aggiramenti degli encoder che portano a XSS                               |

**Suggerimento**

**Lagune** è indipendente dal linguaggio: l'intero flusso legge qualunque linguaggio usi il tuo progetto, e queste categorie aggiungono solo profondità sulle insidie tipiche di un linguaggio.

## Aggiungi e rimuovi quando vuoi

Una categoria è un punto di partenza, non un impegno. Usa ciò che si adatta al progetto adesso e cambialo in qualsiasi momento per chiave, con `write add` e `write remove`. `--categories` senza valore apre in un terminale un selettore interattivo (spazio per selezionare, invio per confermare, vuoto per saltare). Fuori da un terminale, passa le categorie dopo l'opzione.

**Aggiungi**

```bash
npx lagune write add --categories # interactive
npx lagune write add --categories owasp
npx lagune write add --categories owasp rust
```

**Rimuovi**

```bash
npx lagune write remove --categories # interactive
npx lagune write remove --categories owasp
npx lagune write remove --categories owasp rust
```

Il primo `write add` o `write remove` parte da `owasp`, quindi rimuovere tutte le categorie lascia un elenco vuoto, mai quello predefinito. Ogni modifica finisce in `.lagune/configs.json`, così tutto il team lavora con lo stesso insieme.

## Guarda cosa usa un progetto

`read list --categories` mostra ogni categoria e se il progetto la usa:

```bash
npx lagune read list --categories
# Categories
#   • owasp       [used]       Harden against the application security risks OWASP tracks
#   • javascript  [available]  Harden JavaScript and its runtimes
#   • php         [available]  Harden PHP against type-juggling auth bypass
#   • go          [available]  Harden Go against typed-nil interface bugs
#   ...
#
# No category is recorded yet, so this project uses the default: owasp.
```

Consulta il [**Catalogo**](https://lagune.ai/it-IT/docs/catalog) per sapere quali specializzazioni porta ogni categoria. Le tue specializzazioni, scritte con [`/lagune-specialize`](https://lagune.ai/it-IT/docs/commands/specialize), entrano nel catalogo qualunque siano le categorie.

## Domande frequenti

### Come aggiungo una categoria?

Passa la chiave della categoria a --categories, per esempio npx lagune write add --categories javascript. Anche il charter registra le categorie che la sua lettura del progetto giustifica, finché non ne è registrata nessuna.

### Posso usare più di una categoria?

Sì. Elencale sulla stessa riga, una dopo l'altra.

### Quale categoria dovrebbe usare un progetto?

Inizia con owasp, quella predefinita, poi aggiungi quella del tuo linguaggio o del tuo stack. Le specializzazioni si caricano solo su richiesta, quindi una categoria non costa nulla finché una fase non ha bisogno di una delle sue specializzazioni.
