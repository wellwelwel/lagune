# Catalogo: specializzazioni di sicurezza su richiesta

> Come vengono caricate le specializzazioni del catalogo del tuo progetto, da una fase su richiesta e da te direttamente.

Canonico: https://lagune.ai/it-IT/docs/catalog
Lingua: it-IT
Originale: https://lagune.ai/docs/catalog
Ultimo aggiornamento: 2026-11-03

🧠 Le specializzazioni di **Lagune** sono moduli di conoscenza di sicurezza mirati e indipendenti dal linguaggio, che si caricano solo su richiesta, mai per impostazione predefinita. Non sono comandi. Il catalogo del tuo progetto è l'insieme che usa: le specializzazioni integrate delle sue [categorie](https://lagune.ai/it-IT/docs/categories) più le sue. Le fasi detect e verify vi attingono durante l'esecuzione, e tu puoi caricarne una direttamente in qualsiasi momento.

**Panoramica**

*La panoramica interattiva del catalogo si trova nella pagina web. Ogni specializzazione integrata è nella tabella qui sotto.*

**Come funziona**

## Usala da solo

Per usare direttamente una specializzazione, chiedi al tuo agente di caricarla con `read catalog <name>` e scrivi il compito nello stesso prompt. La conoscenza agisce allora su ciò che hai chiesto. Funziona in qualsiasi prompt, anche in uno che non ha nulla a che fare con il flusso di **Lagune**.

Per esempio, un prompt diretto e libero per generare una raccolta sicura di **RegExp** con **Python**:

```prompt
Carica la specializzazione regex con `npx lagune read catalog regex`, poi crea in @src/utils/regex.py una raccolta di espressioni regolari per validare email e nomi utente.
```

Questo usa un hook deterministico per testare ogni **RegExp** contro il **ReDoS**, mantiene quelle sicure e produce qualcosa del genere:

```python
import re

EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
USERNAME = re.compile(r"^[a-zA-Z0-9_]{3,20}$")

def is_email(value: str) -> bool:
    return EMAIL.match(value) is not None

def is_username(value: str) -> bool:
    return USERNAME.match(value) is not None
```

**Prova il ReDoS checker**

Testa tu stesso un pattern su [**devina.io/redos-checker**](https://devina.io/redos-checker).

## Le specializzazioni integrate

Le specializzazioni integrate sono raggruppate in [**categorie**](https://lagune.ai/it-IT/docs/categories). Questo è l'insieme fornito con **Lagune**:

| Specializzazione      | Categoria                   | Ambito                                                                                                                  |
| --------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `regex`               | `owasp`                     | **ReDoS:** pattern che esplodono con input costruiti ad arte.                                                           |
| `network`             | `owasp`                     | **SSRF e redirect:** destinazioni di richieste o redirect fornite dall'utente.                                          |
| `interpreter`         | `owasp`, `lovable`          | **Code injection:** `eval`, include dinamico, dispatch per nome.                                                        |
| `sql`                 | `owasp`                     | **Database relazionali:** injection, chiamate ORM grezze, privilegi, portata del motore.                                |
| `path`                | `owasp`                     | **Percorsi del file system:** path traversal, byte nullo, stream NTFS, planting.                                        |
| `upload`              | `owasp`                     | **Caricamento di file:** tipo/firma, contenuto malevolo, archiviazione, limiti.                                         |
| `access-control`      | `owasp`, `lovable`          | **Autenticazione, autorizzazione e sessione:** IDOR, mass assignment, tenant, sessioni.                                 |
| `credential-endpoint` | `owasp`, `lovable`          | **Tentativi e bot:** brute force, password spraying, credential stuffing, limitazione dei tentativi.                    |
| `federation`          | `owasp`                     | **Fiducia nei token:** OAuth/OIDC, SAML, validazione dei JWT, login con QR.                                             |
| `http-request`        | `owasp`                     | **Provenienza delle richieste:** CSRF, CORS mal configurato, IP del client falsificato.                                 |
| `transport`           | `owasp`                     | **Sicurezza del canale:** configurazione TLS, HTTPS/testo in chiaro, HSTS, pinning.                                     |
| `crypto`              | `owasp`, `lovable`          | **Crittografia dei dati a riposo:** algoritmi deboli o fatti in casa, CSPRNG, gestione delle chiavi.                    |
| `secrets`             | `owasp`, `lovable`          | **Credenziali scritte nel codice:** chiavi, token e password in chiaro nel sorgente.                                    |
| `api-endpoint`        | `owasp`                     | **Superfici non REST:** GraphQL, gRPC, autorizzazione WebSocket, DoS, schema.                                           |
| `payment`             | `owasp`, `lovable`          | **Flusso di checkout:** verifica del gateway lato server, callback firmate, idempotenza.                                |
| `xml`                 | `owasp`                     | **Parsing XML:** XXE, entità esterne, espansione billion laughs.                                                        |
| `csv`                 | `owasp`                     | **Formula injection:** celle di foglio di calcolo che iniziano con `=`/`+`/`-`/`@`.                                     |
| `container`           | `owasp`, `infra`            | **Configurazione dei container:** root, capability, montaggio del socket, hardening dell'immagine.                      |
| `infra`               | `infra`                     | **Infrastructure as code:** Terraform, Dockerfile, GitHub Actions.                                                      |
| `serverless`          | `owasp`, `infra`, `lovable` | **Funzioni FaaS:** IAM con privilegio minimo, input degli eventi, contesto, segreti.                                    |
| `llm`                 | `ai`, `lovable`             | **Rischi di IA e LLM:** prompt injection, agency, RAG, MCP, output.                                                     |
| `supabase`            | `lovable`                   | **Backend Supabase:** RLS disattivata per impostazione predefinita, policy generate male dall'IA, modello delle chiavi. |
| `browser`             | `javascript`, `lovable`     | **Rischi lato client:** XSS, CSP, framing, storage, ecc.                                                                |
| `javascript`          | `javascript`                | **Rischi del linguaggio:** RCE, prototype pollution, ecc.                                                               |
| `python`              | `python`                    | **Rischi del linguaggio:** RCE con `pickle`, class pollution, `-O`, ecc.                                                |
| `rust`                | `rust`                      | **Solidità di `unsafe`:** UB da chiamanti sicuri, `transmute`, overflow.                                                |
| `java`                | `java`                      | **Deserializzazione e codice mobile:** catene di `readObject`, dirottamento di oggetti.                                 |
| `ruby`                | `ruby`                      | **Deserializzazione e `open`:** ricostruzione con `Marshal`/YAML, la stranezza delle pipe.                              |
| `php`                 | `php`                       | **Type juggling e `unserialize`:** magic hash, catene POP.                                                              |
| `go`                  | `go`                        | **Nil tipizzato e data race:** `nil != nil`, goroutine con memoria condivisa.                                           |
| `c-cpp`               | `c-cpp`                     | **Format string:** `printf(user_input)`, scrittura arbitraria (write-what-where) con `%n`.                              |
| `dotnet`              | `dotnet`                    | **Rischi della piattaforma:** RCE con `BinaryFormatter`, `@Html.Raw`, lacune negli enum.                                |

La maggior parte della conoscenza integrata è distillata da OWASP. Consulta [**Fonti OWASP**](https://lagune.ai/it-IT/docs/references/owasp-sources) per la corrispondenza completa tra ogni specializzazione e le sue pagine canoniche di attacco e di Cheat Sheet di OWASP. Alcuni moduli specifici per uno stack attingono invece alle indicazioni del fornitore: `supabase`, per esempio, deriva dalla documentazione di Supabase e dalla CVE-2025-48757.

## Le tue specializzazioni

Le specializzazioni integrate crescono aggiungendo un file di conoscenza più una riga di indice, mai un nuovo comando. Tu aggiungi le tue nello stesso modo, con [`/lagune-specialize`](https://lagune.ai/it-IT/docs/commands/specialize): puntalo su un articolo o un tema e distilla una nuova specializzazione nel tuo progetto, il file in `.lagune/catalog/` e la sua voce in `.lagune/configs.json`. Le tue sono sempre nel catalogo, qualunque siano le sue categorie, e una delle tue oscura quella integrata con lo stesso nome.

**Internamente, Lagune carica le specializzazioni in automatico, su richiesta**

Quando la fase detect o verify incontra un contesto coperto da una specializzazione, carica da sola quella specializzazione con `read catalog <name>`. Succede in automatico, come parte della fase. Non devi farlo a mano perché funzioni.

## Scopri cosa è disponibile

Per elencare dal terminale il catalogo del tuo progetto, una specializzazione per riga con i suoi tag:

```bash
npx lagune read catalog
# regex: Regular Expression [required]
# network: Requests, Webhook, URL Fetch, Socket, IMDS, Redirect
# interpreter: Evaluator, Sink, Shell, Dynamic Execution
# ...
```

Una specializzazione `[required]` si applica sempre, qualunque sia il lavoro. Quali specializzazioni integrate contenga l'elenco dipende dalle [**categorie**](https://lagune.ai/it-IT/docs/categories) del tuo progetto.

**Le specializzazioni non si caricano per impostazione predefinita**

La conoscenza pertinente viene richiamata per ciò che il progetto è davvero, invece di eseguire ogni controllo per impostazione predefinita.

## Domande frequenti

### Che cos'è una specializzazione di Lagune?

Un modulo di conoscenza di sicurezza mirato e indipendente dal linguaggio, che si carica solo su richiesta, mai per impostazione predefinita. Non è un comando come le skill dell'agente.

### Che cos'è il catalogo di un progetto?

Le specializzazioni che il progetto usa: quelle integrate delle sue categorie più le sue. Finché non è registrata alcuna categoria, usa solo OWASP.

### Le specializzazioni si caricano per impostazione predefinita?

No. Si caricano solo su richiesta, per ciò che il progetto è davvero.

### Come carico direttamente una specializzazione?

Nello stesso prompt del compito, chiedi al tuo agente di eseguire npx lagune read catalog <name>.
