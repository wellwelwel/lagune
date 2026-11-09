# Audit programmati: esegui Lagune a intervalli regolari

> Programma un audit ricorrente di Lagune in GitHub Actions con la tua chiave, oppure in Claude Code, Codex, Cursor, Antigravity o OpenCode, che segnala i nuovi rischi o esegue l'intero flusso Blue Team.

Canonico: https://lagune.ai/it-IT/docs/examples/scheduled-audits
Lingua: it-IT
Originale: https://lagune.ai/docs/examples/scheduled-audits
Ultimo aggiornamento: 2026-11-09

Programma **Lagune** perché faccia l'audit del tuo progetto da solo, limitandosi a riferire ciò che trova oppure eseguendo l'intero flusso Blue Team.

## Pianificazione

**Universal**

**GitHub Actions** esegue l'audit nel cloud con [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/). Il suo motore **Copilot CLI** chiama il provider di modelli che scegli con la tua chiave, quindi non serve alcun abbonamento a un agente:

- Installa l'estensione con `gh extension install github/gh-aw`.
- Salva la chiave del tuo provider come segreto del repository con `gh secret set PROVIDER_API_KEY`.
- Salva questo workflow come `.github/workflows/lagune-audit.md`, sostituendo `<model>` con uno dei modelli del tuo provider che supportano il tool calling e `<your-prompt>` con uno degli [esempi di prompt](#prompt-examples):

  ```md
  ---
  on:
    schedule:
      - cron: '0 9 * * 1'
  permissions:
    contents: read
  engine:
    id: copilot
    model: <model>
    env:
      COPILOT_PROVIDER_TYPE: <type>
      COPILOT_PROVIDER_BASE_URL: <url>
      COPILOT_PROVIDER_API_KEY: ${{ secrets.PROVIDER_API_KEY }}
  skills:
    - wellwelwel/lagune@v0.18.1
  network:
    allowed:
      - defaults
      - node
  tools:
    edit:
    bash: [npx]
  safe-outputs:
    create-pull-request:
  ---

  <your-prompt>

  Poi apri una pull request con le tue modifiche.
  ```

  | Provider                                                      | `<type>`    | `<url>`                                                 |
  | ------------------------------------------------------------- | ----------- | ------------------------------------------------------- |
  | **OpenAI**                                                    | `openai`    | `https://api.openai.com/v1`                             |
  | **Anthropic**                                                 | `anthropic` | `https://api.anthropic.com`                             |
  | Qualsiasi API compatibile con **OpenAI**, come **OpenRouter** | `openai`    | Il suo URL di base, come `https://openrouter.ai/api/v1` |

- Esegui `gh aw compile` e fai il commit del workflow insieme al file `.lock.yml` che genera.

**Nel cloud**, l'audit viene eseguito anche a computer spento:

- Fai il commit di **Lagune** con l'[installazione universale](https://lagune.ai/it-IT/docs/install/universal) invece del plugin.
- Digita `/schedule` in una sessione di **Claude Code** e descrivi l'audit, oppure crealo su [claude.ai/code/routines](https://claude.ai/code/routines).

**Sul tuo computer**, l'audit usa il plugin che hai installato per te:

- Crea un'attività locale nella pagina **Scheduled tasks** dell'app desktop.
- Autorizza il motore in anticipo, come mostra la [pagina di installazione](https://lagune.ai/it-IT/docs/install/claude-code), perché non c'è nessuno ad approvarne gli strumenti.
- L'attività viene eseguita solo mentre l'app è aperta e il computer non è in sospensione.

Le attività pianificate si creano nell'app desktop di **ChatGPT**, non nella **Codex CLI**, e vengono eseguite sul tuo computer:

- In una chat di **Codex**, descrivi l'audit, quando deve essere eseguito e che ogni esecuzione deve avviare una nuova chat. I risultati arrivano in **Scheduled**.
- Nel prompt, indica ogni comando con `$`, come `$lagune:lagune-detect`, così l'esecuzione lo invoca esplicitamente.
- Scegli il tuo progetto locale invece di un nuovo worktree, che parte senza il motore che hai [installato nel progetto](https://lagune.ai/it-IT/docs/install/codex).
- L'attività viene eseguita solo mentre l'app è aperta, il computer è acceso e il progetto è sul disco.

Le Automations di **Cursor** vengono eseguite nel cloud, anche a computer spento:

- Fai il commit di **Lagune** con l'[installazione universale](https://lagune.ai/it-IT/docs/install/universal) invece del plugin.
- Crea un'automazione su [cursor.com/automations](https://cursor.com/automations), oppure descrivila con `/automate` in una sessione dell'agente, assegnandole un trigger pianificato.
- Seleziona il tuo repository, perché un trigger pianificato parte senza.

Le Automations di **Antigravity** vengono eseguite sul tuo computer, ciascuna in una nuova conversazione:

- Apri la scheda **Automations** nell'app **Antigravity** e crea un'automazione pianificata per il tuo progetto, oppure chiedi all'agente di configurarla.
- Autorizza il motore in anticipo, come mostra la [pagina di installazione](https://lagune.ai/it-IT/docs/install/antigravity-cli), perché non c'è nessuno ad approvarne gli strumenti.
- Usa un'automazione invece di `/schedule`, che dura solo quanto la sua conversazione.
- L'automazione viene eseguita solo mentre **Antigravity** è in esecuzione.

**OpenCode** non ha un proprio pianificatore, quindi l'audit viene eseguito da **GitHub Actions**, nel cloud:

- Fai il commit di **Lagune** nel file `opencode.json` del repository, come mostra la [pagina di installazione](https://lagune.ai/it-IT/docs/install/opencode).
- Esegui `opencode github install` per collegare l'app GitHub di **OpenCode** e salvare la chiave del tuo provider di modelli.
- Aggiungi un workflow che passa il prompt a **OpenCode** a intervalli programmati, qui ogni lunedì alle 09:00 UTC, compilando `<KEY>` e `<provider>/<model>` come nel workflow creato da `opencode github install`, e `<your-prompt>` con uno degli [esempi di prompt](#prompt-examples):

  ```yaml
  name: Lagune Audit

  on:
    schedule:
      - cron: '0 9 * * 1'

  jobs:
    audit:
      runs-on: ubuntu-latest
      permissions:
        id-token: write
        contents: read
      steps:
        - uses: actions/checkout@v6
          with:
            persist-credentials: false

        - uses: anomalyco/opencode/github@latest
          env:
            <KEY>: ${{ secrets.<KEY> }}
          with:
            model: <provider>/<model>
            prompt: |
              <your-prompt>
  ```

### Esempi di prompt \{#prompt-examples}

**💧 Solo report**

Mappa i nuovi rischi, pianifica le loro correzioni e ricontrolla i controlli già applicati, senza modificare il tuo codice:

```md
Esegui i seguenti comandi, uno alla volta: `/lagune-detect` e `/lagune-plan`. Se il progetto ha un registro di hardening, esegui anche `/lagune-verify`.

Non modificare il codice del progetto. Alla fine, riassumi i nuovi rilievi e ogni controllo applicato che non regge più.
```

**🌊 Ciclo completo**

Applica anche le correzioni pianificate e dimostra che ognuna regge, quindi rivedi le sue modifiche prima che arrivino al tuo branch principale:

```md
Esegui i seguenti comandi, uno alla volta: `/lagune-detect`, `/lagune-plan`, `/lagune-harden` e `/lagune-verify`.

Alla fine, riassumi le correzioni applicate e ogni rilievo ancora aperto.
```
