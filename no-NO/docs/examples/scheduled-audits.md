# Planlagte revisjoner: Kjør Lagune etter en fast tidsplan

> Planlegg en gjentakende revisjon med Lagune i GitHub Actions med din egen nøkkel, eller i Claude Code, Codex, Cursor, Antigravity eller OpenCode, som enten rapporterer nye risikoer eller kjører hele Blue Team-flyten.

Kanonisk URL: https://lagune.ai/no-NO/docs/examples/scheduled-audits
Språk: no-NO
Original: https://lagune.ai/docs/examples/scheduled-audits
Sist oppdatert: 2026-11-09

La **Lagune** revidere prosjektet ditt på egen hånd etter en tidsplan, enten ved å rapportere funnene eller ved å kjøre hele Blue Team-flyten.

## Planlegging

**Universal**

**GitHub Actions** kjører revisjonen i skyen med [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/). Motoren **Copilot CLI** kaller modelleverandøren du velger, med din egen nøkkel, så det trengs ikke noe agentabonnement:

- Installer utvidelsen med `gh extension install github/gh-aw`.
- Lagre nøkkelen fra leverandøren din som en hemmelighet i repositoryet med `gh secret set PROVIDER_API_KEY`.
- Lagre denne arbeidsflyten som `.github/workflows/lagune-audit.md`, og erstatt `<model>` med en av leverandørens modeller som støtter tool calling, og `<your-prompt>` med et av [prompteksemplene](#prompt-examples):

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
    - wellwelwel/lagune@v0.18.2
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

  Åpne deretter en pull request med endringene dine.
  ```

  | Leverandør                                                        | `<type>`    | `<url>`                                                    |
  | ----------------------------------------------------------------- | ----------- | ---------------------------------------------------------- |
  | **OpenAI**                                                        | `openai`    | `https://api.openai.com/v1`                                |
  | **Anthropic**                                                     | `anthropic` | `https://api.anthropic.com`                                |
  | Ethvert API som er kompatibelt med **OpenAI**, som **OpenRouter** | `openai`    | Base-URL-en til API-et, som `https://openrouter.ai/api/v1` |

- Kjør `gh aw compile`, og commit arbeidsflyten sammen med filen `.lock.yml` som den genererer.

**I skyen** kjører revisjonen selv når datamaskinen din er av:

- Commit **Lagune** med den [universelle installasjonen](https://lagune.ai/no-NO/docs/install/universal) i stedet for pluginen.
- Skriv `/schedule` i en økt i **Claude Code** og beskriv revisjonen, eller opprett den på [claude.ai/code/routines](https://claude.ai/code/routines).

**På datamaskinen din** bruker revisjonen pluginen du installerte for deg selv:

- Opprett en lokal oppgave på siden **Scheduled tasks** i skrivebordsappen.
- Tillat motoren på forhånd, slik [installasjonssiden](https://lagune.ai/no-NO/docs/install/claude-code) viser, siden ingen er til stede for å godkjenne verktøyene dens.
- Oppgaven kjører bare mens appen er åpen og datamaskinen ikke er i hvilemodus.

Planlagte oppgaver opprettes i skrivebordsappen til **ChatGPT**, ikke i **Codex CLI**, og kjører på datamaskinen din:

- Beskriv i en chat i **Codex** revisjonen, når den skal kjøre, og at hver kjøring starter en ny chat. Resultatene havner i **Scheduled**.
- Angi hver kommando med `$` i prompten, som `$lagune:lagune-detect`, slik at kjøringen kaller den eksplisitt.
- Velg det lokale prosjektet ditt i stedet for en ny worktree, som starter uten motoren du [installerte i prosjektet ditt](https://lagune.ai/no-NO/docs/install/codex).
- Oppgaven kjører bare mens appen er åpen, datamaskinen er på og prosjektet ligger på disken.

Automations i **Cursor** kjører i skyen, selv når datamaskinen din er av:

- Commit **Lagune** med den [universelle installasjonen](https://lagune.ai/no-NO/docs/install/universal) i stedet for pluginen.
- Opprett en automation på [cursor.com/automations](https://cursor.com/automations), eller beskriv den med `/automate` i en agentøkt, og gi den en planlagt trigger.
- Velg repositoryet ditt, siden en planlagt trigger starter uten et.

Automations i **Antigravity** kjører på datamaskinen din, hver i en ny samtale:

- Åpne fanen **Automations** i appen **Antigravity** og opprett en planlagt automation for prosjektet ditt, eller be agenten sette den opp.
- Tillat motoren på forhånd, slik [installasjonssiden](https://lagune.ai/no-NO/docs/install/antigravity-cli) viser, siden ingen er til stede for å godkjenne verktøyene dens.
- Bruk en automation i stedet for `/schedule`, som bare varer så lenge samtalen varer.
- Automationen kjører bare mens **Antigravity** kjører.

**OpenCode** har ingen egen planlegger, så revisjonen kjører fra **GitHub Actions**, i skyen:

- Commit **Lagune** i `opencode.json` i repositoryet, slik [installasjonssiden](https://lagune.ai/no-NO/docs/install/opencode) viser.
- Kjør `opencode github install` for å koble til GitHub-appen til **OpenCode** og lagre nøkkelen til modelleverandøren din.
- Legg til en arbeidsflyt som sender prompten til **OpenCode** etter en tidsplan, her hver mandag kl. 09:00 UTC, og fyll ut `<KEY>` og `<provider>/<model>` som i arbeidsflyten `opencode github install` opprettet, og `<your-prompt>` med et av [prompteksemplene](#prompt-examples):

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

### Prompteksempler \{#prompt-examples}

**💧 Kun rapport**

Kartlegger nye risikoer, planlegger utbedringene og kontrollerer på nytt sikringstiltakene som allerede er tatt i bruk, uten å endre koden din:

```md
Kjør følgende kommandoer, én etter én: `/lagune-detect` og `/lagune-plan`. Hvis prosjektet har en herdingslogg, kjør også `/lagune-verify`.

Ikke endre koden i prosjektet. Oppsummer til slutt de nye funnene og eventuelle innførte tiltak som ikke lenger holder.
```

**🌊 Full syklus**

Tar også i bruk de planlagte utbedringene og beviser at hver av dem holder, så gå gjennom endringene før de når hovedbranchen din:

```md
Kjør følgende kommandoer, én etter én: `/lagune-detect`, `/lagune-plan`, `/lagune-harden` og `/lagune-verify`.

Oppsummer til slutt utbedringene som er tatt i bruk, og eventuelle funn som fortsatt er åpne.
```
