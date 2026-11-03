# Installazione: hardening di sicurezza per qualsiasi agente IA

> Installa Lagune in qualsiasi progetto, come plugin dove il tuo agente lo supporta o altrove con la CLI di skills, poi scegli le specializzazioni di sicurezza adatte.

Canonico: https://lagune.ai/it-IT/docs
Lingua: it-IT
Originale: https://lagune.ai/docs
Ultimo aggiornamento: 2026-11-03

**Lagune** aiuta il tuo agente IA a rendere un progetto più sicuro. Lo punti sul tuo codice e l'agente capisce cosa fa davvero il tuo sistema, poi ti guida nel lavoro di sicurezza che conta per quel sistema. **Lagune** è il primo progetto della metodologia [Security-Driven Hardening (SDH)](https://lagune.ai/it-IT/docs/references/paper).

**Sostieni l'open source**

Ti piace **Lagune**? [Lasciaci una ⭐ su **GitHub**](https://github.com/wellwelwel/lagune)

## Scegli il tuo agente

- [Claude Code](https://lagune.ai/it-IT/docs/install/claude-code): Lo strumento di programmazione agentico di Anthropic
- [Codex](https://lagune.ai/it-IT/docs/install/codex): L'agente di programmazione di OpenAI
- [Cursor](https://lagune.ai/it-IT/docs/install/cursor): L'editor di codice con l'IA
- [GitHub Copilot](https://lagune.ai/it-IT/docs/install/github-copilot-cli): Il programmatore in coppia con l'IA di GitHub
- [Gemini CLI](https://lagune.ai/it-IT/docs/install/gemini-cli): L'agente da terminale open source di Google
- [Antigravity](https://lagune.ai/it-IT/docs/install/antigravity-cli): La piattaforma di sviluppo agentica di Google
- [OpenCode](https://lagune.ai/it-IT/docs/install/opencode): L'agente di programmazione open source
- [Devin for Terminal](https://lagune.ai/it-IT/docs/install/devin-cli): L'agente da terminale di Cognition
- [Factory Droid](https://lagune.ai/it-IT/docs/install/factory-droid): L'agente di sviluppo software di Factory
- [Grok Build](https://lagune.ai/it-IT/docs/install/grok-build): L'agente di programmazione di xAI
- [Qwen Code](https://lagune.ai/it-IT/docs/install/qwen-code): L'agente di programmazione da terminale di Qwen
- [Kimi Code](https://lagune.ai/it-IT/docs/install/kimi-code): L'agente di programmazione di Moonshot AI
- [Muse Code](https://lagune.ai/it-IT/docs/install/muse-code): L'agente di programmazione di Meta
- [Pi](https://lagune.ai/it-IT/docs/install/pi): Un agente di programmazione minimale da terminale
- [Hermes Agent](https://lagune.ai/it-IT/docs/install/hermes-agent): L'agente open source di Nous Research
- [Universale](https://lagune.ai/it-IT/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed e altri 66

**Info**

- **Lagune** gira su **Node.js** dietro le quinte, ma tu usi il linguaggio che preferisci.
- Per lavorare completamente offline, installa **Lagune** nel tuo progetto con `npm i -D lagune@0.16.0`.

## Categorie

Le conoscenze di sicurezza di **Lagune** arrivano come [**specializzazioni**](https://lagune.ai/it-IT/docs/catalog), raggruppate in [**categorie**](https://lagune.ai/it-IT/docs/categories).

- **OWASP** (`owasp`): Protegge dai rischi di sicurezza applicativa che OWASP monitora: injection, controllo degli accessi inefficace, falle di autenticazione e di crittografia
- **Infrastruttura** (`infra`): Mette in sicurezza la configurazione di container, workload e serverless: Dockerfile, Compose, sicurezza dei Pod, IAM e trigger FaaS
- **IA / LLM** (`ai`): Protegge le integrazioni di IA e LLM dalla prompt injection e da collegamenti non sicuri con strumenti, agenti, retrieval e MCP
- **Lovable** (`lovable`): Mette in sicurezza le app Supabase generate dall'IA (Lovable e simili): lacune nelle RLS, chiavi service_role esposte e impostazioni predefinite non sicure
- **JavaScript** (`javascript`): Protegge JavaScript e i suoi runtime dalla RCE tramite eval e child_process, dal path traversal e dalla prototype pollution
- **Python** (`python`): Protegge Python dalla RCE per deserializzazione con pickle e YAML, dall'attraversamento tramite str.format e dalla class pollution
- **Rust** (`rust`): Protegge Rust da API unsafe non corrette, uso improprio di transmute, integer overflow e comportamento indefinito al confine FFI
- **Java** (`java`): Protegge Java dalle catene di gadget di deserializzazione con ObjectInputStream che culminano nell'esecuzione di codice remoto
- **Ruby** (`ruby`): Protegge Ruby dalle catene di gadget di deserializzazione con Marshal.load e YAML che portano all'esecuzione di codice remoto
- **PHP** (`php`): Protegge PHP dall'aggiramento dell'autenticazione per type juggling, dalle catene di gadget di object injection e dalle configurazioni predefinite non sicure
- **Go** (`go`): Protegge Go da bug di interfacce con nil tipizzato, data race tra goroutine e concorrenza non sicura nei percorsi di sicurezza
- **C / C++** (`c-cpp`): Protegge C e C++ da bug di format string, buffer overflow e scritture fuori dai limiti che permettono l'esecuzione di codice
- **.NET** (`dotnet`): Protegge .NET e C# dalla RCE per deserializzazione con BinaryFormatter e dagli aggiramenti degli encoder che portano a XSS

Esegui `npx lagune write add --categories` con le chiavi delle categorie che scegli.

**Suggerimento**

Un progetto parte con `owasp`, e [`/lagune-charter`](https://lagune.ai/it-IT/docs/commands/charter) aggiunge le categorie che la sua lettura del progetto giustifica.

## Requisiti

Ti serve [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) installato sul tuo sistema.

## Usa un badge ✨

Usi **Lagune**? Aggiungine uno al tuo **README**:

**Due toni**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**Tinta unita**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## Passo successivo

Scopri cosa fa ciascuna delle [**skill**](https://lagune.ai/it-IT/docs/get-started/commands) di **Lagune**.

## Domande frequenti

### Che cos'è Lagune?

Lagune è un flusso di sicurezza open source ed esclusivamente difensivo che aiuta il tuo agente IA a mettere in sicurezza qualsiasi codebase. Lo punti sul tuo codice, rileva cosa fa davvero il tuo sistema, poi guida le correzioni di sicurezza che contano in quel contesto.

### Come si installa Lagune?

Scegli il tuo agente: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI e Hermes Agent installano Lagune come plugin, Gemini CLI e Qwen Code come estensione, Pi come pacchetto e qualsiasi altro agente con npx skills add wellwelwel/lagune. Funziona sia nei progetti nuovi sia in quelli esistenti.

### Lagune ha bisogno di una chiave API?

No. Funziona tramite il tuo agente IA, quindi non serve alcuna chiave API.

### Quali sono i requisiti?

Ti serve Node.js (LTS) installato sul tuo sistema.

### Quali linguaggi di programmazione supporta Lagune?

Tutti. Lagune gira su Node.js dietro le quinte, ma verifica e mette in sicurezza progetti scritti in qualsiasi linguaggio di programmazione.

### Cosa aggiunge Lagune al mio progetto?

Una directory .lagune/ con lo stato di sicurezza del tuo progetto, creata dal primo comando che scrive. La CLI di skills installa anche i comandi slash nel progetto, dove il tuo agente li legge, mentre un plugin li tiene dentro l'agente.

### Come si aggiorna Lagune?

Nello stesso modo in cui l'hai installato. La pagina di installazione di ogni agente mostra come aggiornare Lagune lì, e la CLI di skills lo aggiorna con npx skills update. Il tuo charter, gli artefatti delle fasi e le tue specializzazioni restano intatti.

### Quali specializzazioni usa un progetto?

Quelle integrate delle sue categorie, più le sue. Il charter registra le categorie che la sua lettura del progetto giustifica, e npx lagune write add --categories le modifica.

### Devo finire di sviluppare prima di mettere in sicurezza il mio progetto?

No. Il comando /lagune mette in sicurezza il lavoro mentre viene scritto: accetta qualsiasi prompt, costruisce ciò che hai chiesto e lo mette in sicurezza con impostazioni predefinite sicure, guidato dal charter. Il flusso Blue Team in cinque fasi verifica ciò che esiste già.

### Lagune può fare l'audit di un progetto esistente?

Sì. Il flusso Blue Team in cinque fasi verifica ciò che esiste già: charter stabilisce le tue regole di sicurezza, detect mappa cosa fa il sistema e dove sono i rischi, plan assegna un punteggio a ogni rilievo e lo abbina a una correzione, harden applica le correzioni e verify dimostra che reggono e le chiude.

### Qual è la differenza tra usare Lagune e chiedere semplicemente all'agente di mappare vulnerabilità e falle di sicurezza?

Un agente che legge da solo trova ciò che sembra una vulnerabilità e salta ciò che sembra un controllo. Un elenco di indirizzi bloccati dà l'impressione che qualcuno abbia già gestito il rischio, così nessuno verifica che ne manchi la maggior parte, e il codice va in produzione. Lagune ribalta questa impostazione: una protezione già presente nel codice è considerata non dimostrata finché non viene verificata, ogni specializzazione del catalogo riceve un verdetto esplicito e verify chiede se il rischio è sparito, non se c'è un controllo. Ogni rilievo resta inoltre un unico elemento tracciato da un'esecuzione all'altra, così può essere dimostrato chiuso e archiviato, mentre una semplice richiesta ti dà ogni volta un report diverso, senza nulla da confrontare.

### Qual è la differenza tra sviluppare con Lagune e chiedere semplicemente all'agente di scrivere codice sicuro?

Chiedere codice sicuro lascia all'agente la definizione di sicuro, e presuppone che tu sappia cosa chiedere. Il requisito di solito è già dentro la tua richiesta senza che nessuno dei due lo veda: chiedere una pagina che mostri i corsi a cui un utente ha accesso enuncia una regola di autorizzazione, e un controllo mai scritto non lascia nulla nel codice da notare. Il comando /lagune carica il tuo charter e le specializzazioni che corrispondono a ciò che sta per essere costruito prima che venga scritta la prima riga, poi rilegge il risultato confrontandolo con la difesa che ha usato. La forma sicura raramente costa più di quella non sicura, quindi a decidere l'esito è sapere quale scegliere, ed è proprio questo che arriva in anticipo.

### Lagune esegue DAST (Dynamic Application Security Testing) o testa la mia applicazione in esecuzione?

No. Lagune legge il codice e non esegue mai il tuo sistema né gli invia richieste costruite ad arte. Verify conferma che un controllo è presente e corretto nel sorgente, che è una domanda diversa dal chiedersi se resiste a un attacco su un bersaglio in esecuzione, quindi "non si può stabilire dal codice" è un verdetto legittimo invece di un via libera silenzioso. Il DAST risponde alla domanda sul runtime e Lagune a quella sul sorgente, quindi nessuno dei due sostituisce l'altro. Anche il comando facoltativo prove tiene questa linea: i suoi test verificano il comportamento sicuro, mai un payload di attacco.

### Lagune sostituisce un pentest (penetration test)?

No, assolutamente! Un pentest è un incarico autorizzato in cui un professionista esercita il proprio giudizio sul tuo sistema in esecuzione, concatenando i rilievi e sondando la logica di business che nessuna regola per singola superficie descrive. I rilievi di un pentest possono entrare nel flusso Blue Team di Lagune, nella fase detect, così ciò che un professionista segnala viene pianificato, messo in sicurezza e verificato.

## Politica di sicurezza

Consulta il file [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md).

## Licenza

**Lagune** è distribuito con la [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE).

Copyright © 2026-oggi [Weslley Araújo](https://github.com/wellwelwel) e [collaboratori](https://github.com/wellwelwel/lagune/graphs/contributors).
