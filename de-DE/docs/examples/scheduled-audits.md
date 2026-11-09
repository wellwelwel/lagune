# Geplante Audits: Lagune regelmäßig nach Zeitplan ausführen

> Plane ein wiederkehrendes Audit mit Lagune in GitHub Actions mit deinem eigenen Schlüssel oder in Claude Code, Codex, Cursor, Antigravity oder OpenCode, das entweder neue Risiken meldet oder den gesamten Blue-Team-Workflow ausführt.

Kanonische URL: https://lagune.ai/de-DE/docs/examples/scheduled-audits
Sprache: de-DE
Original: https://lagune.ai/docs/examples/scheduled-audits
Zuletzt aktualisiert: 2026-11-09

Plane **Lagune** so ein, dass es dein Projekt eigenständig auditiert und entweder meldet, was es findet, oder den gesamten Blue-Team-Workflow ausführt.

## Zeitplan

**Universal**

**GitHub Actions** führt das Audit mit [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/) in der Cloud aus. Deren Engine **Copilot CLI** ruft den Modellanbieter deiner Wahl mit deinem eigenen Schlüssel auf, sodass du kein Abo für einen Agenten brauchst:

- Installiere die Erweiterung mit `gh extension install github/gh-aw`.
- Hinterlege den Schlüssel deines Anbieters mit `gh secret set PROVIDER_API_KEY` als Secret des Repositorys.
- Speichere diesen Workflow als `.github/workflows/lagune-audit.md` und ersetze dabei `<model>` durch ein Modell deines Anbieters, das Tool Calling unterstützt, und `<your-prompt>` durch eines der [Prompt-Beispiele](#prompt-examples):

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

  Öffne danach einen Pull Request mit deinen Änderungen.
  ```

  | Anbieter                                                | `<type>`    | `<url>`                                             |
  | ------------------------------------------------------- | ----------- | --------------------------------------------------- |
  | **OpenAI**                                              | `openai`    | `https://api.openai.com/v1`                         |
  | **Anthropic**                                           | `anthropic` | `https://api.anthropic.com`                         |
  | Jede mit **OpenAI** kompatible API, etwa **OpenRouter** | `openai`    | Ihre Basis-URL, etwa `https://openrouter.ai/api/v1` |

- Führe `gh aw compile` aus und committe den Workflow zusammen mit der Datei `.lock.yml`, die dabei entsteht.

**In der Cloud** läuft das Audit auch dann, wenn dein Computer ausgeschaltet ist:

- Committe **Lagune** mit der [universellen Installation](https://lagune.ai/de-DE/docs/install/universal) statt mit dem Plugin.
- Tippe `/schedule` in einer Sitzung von **Claude Code** ein und beschreibe das Audit, oder lege es unter [claude.ai/code/routines](https://claude.ai/code/routines) an.

**Auf deinem Computer** nutzt das Audit das Plugin, das du für dich selbst installiert hast:

- Lege auf der Seite **Scheduled tasks** der Desktop-App eine lokale Aufgabe an.
- Erlaube die Engine vorab, wie die [Installationsseite](https://lagune.ai/de-DE/docs/install/claude-code) zeigt, da niemand da ist, um ihre Tools zu genehmigen.
- Die Aufgabe läuft nur, solange die App geöffnet ist und dein Computer nicht im Ruhezustand ist.

Geplante Aufgaben legst du in der Desktop-App von **ChatGPT** an, nicht in der **Codex CLI**, und sie laufen auf deinem Computer:

- Beschreibe in einem Chat von **Codex** das Audit, wann es laufen soll und dass jeder Durchlauf einen neuen Chat startet. Die Ergebnisse landen unter **Scheduled**.
- Schreibe im Prompt jeden Befehl mit `$`, etwa `$lagune:lagune-detect`, damit der Durchlauf ihn ausdrücklich aufruft.
- Wähle dein lokales Projekt statt eines neuen Worktrees, denn dieser startet ohne die Engine, die du [in deinem Projekt installiert hast](https://lagune.ai/de-DE/docs/install/codex).
- Die Aufgabe läuft nur, solange die App geöffnet ist, dein Computer eingeschaltet ist und das Projekt auf der Festplatte liegt.

Die Automations von **Cursor** laufen in der Cloud, auch wenn dein Computer ausgeschaltet ist:

- Committe **Lagune** mit der [universellen Installation](https://lagune.ai/de-DE/docs/install/universal) statt mit dem Plugin.
- Lege unter [cursor.com/automations](https://cursor.com/automations) eine Automation an, oder beschreibe sie mit `/automate` in einer Sitzung des Agenten, und gib ihr einen zeitgesteuerten Trigger.
- Wähle dein Repository aus, da ein zeitgesteuerter Trigger ohne Repository startet.

Die Automations von **Antigravity** laufen auf deinem Computer, jede in einer neuen Unterhaltung:

- Öffne in der App von **Antigravity** den Tab **Automations** und lege eine geplante Automation für dein Projekt an, oder bitte den Agenten, sie einzurichten.
- Erlaube die Engine vorab, wie die [Installationsseite](https://lagune.ai/de-DE/docs/install/antigravity-cli) zeigt, da niemand da ist, um ihre Tools zu genehmigen.
- Nutze eine Automation statt `/schedule`, denn das besteht nur so lange wie seine Unterhaltung.
- Die Automation läuft nur, solange **Antigravity** läuft.

**OpenCode** hat keinen eigenen Scheduler, daher läuft das Audit über **GitHub Actions** in der Cloud:

- Committe **Lagune** in der Datei `opencode.json` des Repositorys, wie die [Installationsseite](https://lagune.ai/de-DE/docs/install/opencode) zeigt.
- Führe `opencode github install` aus, um die GitHub-App von **OpenCode** zu verbinden und den Schlüssel deines Modellanbieters zu hinterlegen.
- Füge einen Workflow hinzu, der den Prompt nach Zeitplan an **OpenCode** übergibt (hier jeden Montag um 09:00 UTC), fülle dabei `<KEY>` und `<provider>/<model>` wie in dem Workflow aus, den `opencode github install` erstellt hat, und ersetze `<your-prompt>` durch eines der [Prompt-Beispiele](#prompt-examples):

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

### Prompt-Beispiele \{#prompt-examples}

**💧 Nur berichten**

Erfasst neue Risiken, plant ihre Korrekturen und prüft die bereits umgesetzten Schutzmaßnahmen erneut, ohne deinen Code zu ändern:

```md
Führe die folgenden Befehle nacheinander aus: `/lagune-detect` und `/lagune-plan`. Wenn das Projekt ein Härtungsprotokoll hat, führe auch `/lagune-verify` aus.

Ändere den Code des Projekts nicht. Fasse am Ende die neuen Befunde und jede umgesetzte Schutzmaßnahme zusammen, die nicht mehr greift.
```

**🌊 Vollständiger Zyklus**

Setzt zusätzlich die geplanten Korrekturen um und weist nach, dass jede greift, also prüfe die Änderungen, bevor sie deinen Main-Branch erreichen:

```md
Führe die folgenden Befehle nacheinander aus: `/lagune-detect`, `/lagune-plan`, `/lagune-harden` und `/lagune-verify`.

Fasse am Ende die umgesetzten Korrekturen und alle noch offenen Befunde zusammen.
```
