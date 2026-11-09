# Planlagte gennemgange: Kør Lagune efter en fast tidsplan

> Planlæg en tilbagevendende gennemgang med Lagune i GitHub Actions med din egen nøgle eller i Claude Code, Codex, Cursor, Antigravity eller OpenCode, der enten rapporterer nye risici eller kører hele Blue Team-workflowet.

Kanonisk URL: https://lagune.ai/da-DK/docs/examples/scheduled-audits
Sprog: da-DK
Original: https://lagune.ai/docs/examples/scheduled-audits
Sidst opdateret: 2026-11-09

Lad **Lagune** gennemgå dit projekt på egen hånd efter en tidsplan, enten ved at rapportere fundene eller ved at køre hele Blue Team-workflowet.

## Planlægning

**Universal**

**GitHub Actions** kører gennemgangen i skyen med [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/). Motoren **Copilot CLI** kalder den modeludbyder, du vælger, med din egen nøgle, så det kræver intet abonnement på en agent:

- Installér udvidelsen med `gh extension install github/gh-aw`.
- Gem nøglen fra din udbyder som en secret i dit repository med `gh secret set PROVIDER_API_KEY`.
- Gem dette workflow som `.github/workflows/lagune-audit.md`, og erstat `<model>` med en af din udbyders modeller, der understøtter tool calling, og `<your-prompt>` med et af [eksemplerne på prompts](#prompt-examples):

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

  Åbn derefter en pull request med dine ændringer.
  ```

  | Udbyder                                                          | `<type>`    | `<url>`                                             |
  | ---------------------------------------------------------------- | ----------- | --------------------------------------------------- |
  | **OpenAI**                                                       | `openai`    | `https://api.openai.com/v1`                         |
  | **Anthropic**                                                    | `anthropic` | `https://api.anthropic.com`                         |
  | Enhver API, der er kompatibel med **OpenAI**, som **OpenRouter** | `openai`    | Dens base-URL, såsom `https://openrouter.ai/api/v1` |

- Kør `gh aw compile`, og commit workflowet sammen med filen `.lock.yml`, som det genererer.

**I skyen** kører gennemgangen, selv når din computer er slukket:

- Commit **Lagune** med den [universelle installation](https://lagune.ai/da-DK/docs/install/universal) i stedet for pluginnet.
- Skriv `/schedule` i en session i **Claude Code**, og beskriv gennemgangen, eller opret den på [claude.ai/code/routines](https://claude.ai/code/routines).

**På din computer** bruger gennemgangen det plugin, du selv har installeret:

- Opret en lokal opgave på siden **Scheduled tasks** i desktopappen.
- Tillad motoren på forhånd, som [installationssiden](https://lagune.ai/da-DK/docs/install/claude-code) viser, da ingen er til stede til at godkende dens værktøjer.
- Opgaven kører kun, mens appen er åben, og din computer ikke er i dvale.

Planlagte opgaver oprettes i desktopappen til **ChatGPT**, ikke i **Codex CLI**, og kører på din computer:

- Beskriv i en chat i **Codex** gennemgangen, hvornår den skal køre, og at hver kørsel starter en ny chat. Resultaterne havner i **Scheduled**.
- Angiv hver kommando med `$` i prompten, såsom `$lagune:lagune-detect`, så kørslen kalder den eksplicit.
- Vælg dit lokale projekt frem for et nyt worktree, der starter uden den motor, du [installerede i dit projekt](https://lagune.ai/da-DK/docs/install/codex).
- Opgaven kører kun, mens appen er åben, din computer er tændt, og projektet ligger på disken.

Automations i **Cursor** kører i skyen, selv når din computer er slukket:

- Commit **Lagune** med den [universelle installation](https://lagune.ai/da-DK/docs/install/universal) i stedet for pluginnet.
- Opret en automation på [cursor.com/automations](https://cursor.com/automations), eller beskriv den med `/automate` i en agentsession, og giv den en planlagt trigger.
- Vælg dit repository, da en planlagt trigger starter uden et.

Automations i **Antigravity** kører på din computer, hver i en ny samtale:

- Åbn fanen **Automations** i appen **Antigravity**, og opret en planlagt automation til dit projekt, eller bed agenten om at sætte den op.
- Tillad motoren på forhånd, som [installationssiden](https://lagune.ai/da-DK/docs/install/antigravity-cli) viser, da ingen er til stede til at godkende dens værktøjer.
- Brug en automation frem for `/schedule`, der kun varer, så længe samtalen gør.
- Automationen kører kun, mens **Antigravity** kører.

**OpenCode** har ingen egen planlægger, så gennemgangen kører fra **GitHub Actions** i skyen:

- Commit **Lagune** i filen `opencode.json` i dit repository, som [installationssiden](https://lagune.ai/da-DK/docs/install/opencode) viser.
- Kør `opencode github install` for at forbinde GitHub-appen til **OpenCode** og gemme nøglen fra din modeludbyder.
- Tilføj et workflow, der sender prompten til **OpenCode** efter en tidsplan, her hver mandag kl. 09:00 UTC, og udfyld `<KEY>` og `<provider>/<model>` som i det workflow, `opencode github install` oprettede, og `<your-prompt>` med et af [eksemplerne på prompts](#prompt-examples):

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

### Eksempler på prompts \{#prompt-examples}

**💧 Kun rapport**

Kortlægger nye risici, planlægger rettelserne og tjekker de allerede gennemførte sikkerhedskontroller igen uden at ændre din kode:

```md
Kør følgende kommandoer, én ad gangen: `/lagune-detect` og `/lagune-plan`. Hvis projektet har en hærdningslog, så kør også `/lagune-verify`.

Ændr ikke koden i projektet. Opsummér til sidst de nye fund og enhver gennemført kontrol, der ikke længere holder.
```

**🌊 Hel cyklus**

Gennemfører også de planlagte rettelser og påviser, at hver af dem holder, så gennemgå ændringerne, før de når din primære branch:

```md
Kør følgende kommandoer, én ad gangen: `/lagune-detect`, `/lagune-plan`, `/lagune-harden` og `/lagune-verify`.

Opsummér til sidst de gennemførte rettelser og ethvert fund, der stadig er åbent.
```
