# Audits planifiés : exécuter Lagune de façon récurrente

> Planifiez un audit Lagune récurrent dans GitHub Actions avec votre propre clé, ou dans Claude Code, Codex, Cursor, Antigravity ou OpenCode, qui signale les nouveaux risques ou exécute tout le flux Blue Team.

Canonique: https://lagune.ai/fr-FR/docs/examples/scheduled-audits
Langue: fr-FR
Original: https://lagune.ai/docs/examples/scheduled-audits
Dernière mise à jour: 2026-11-09

Planifiez **Lagune** pour qu'il audite votre projet de lui-même, soit en signalant ce qu'il trouve, soit en exécutant tout le flux Blue Team.

## Planification

**Universal**

**GitHub Actions** exécute l'audit dans le cloud avec [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/). Son moteur **Copilot CLI** appelle le fournisseur de modèles de votre choix avec votre propre clé, sans abonnement à un agent :

- Installez l'extension avec `gh extension install github/gh-aw`.
- Enregistrez la clé de votre fournisseur comme secret du dépôt avec `gh secret set PROVIDER_API_KEY`.
- Enregistrez ce workflow sous `.github/workflows/lagune-audit.md`, en remplaçant `<model>` par un modèle de votre fournisseur qui prend en charge l'appel d'outils, et `<your-prompt>` par l'un des [exemples de prompts](#prompt-examples) :

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

  Ouvre ensuite une pull request avec tes modifications.
  ```

  | Fournisseur                                           | `<type>`    | `<url>`                                               |
  | ----------------------------------------------------- | ----------- | ----------------------------------------------------- |
  | **OpenAI**                                            | `openai`    | `https://api.openai.com/v1`                           |
  | **Anthropic**                                         | `anthropic` | `https://api.anthropic.com`                           |
  | Toute API compatible **OpenAI**, comme **OpenRouter** | `openai`    | Son URL de base, comme `https://openrouter.ai/api/v1` |

- Exécutez `gh aw compile` et committez le workflow avec le fichier `.lock.yml` qu'il génère.

**Dans le cloud**, l'audit s'exécute même quand votre ordinateur est éteint :

- Committez **Lagune** avec l'[installation universelle](https://lagune.ai/fr-FR/docs/install/universal) plutôt qu'avec le plugin.
- Tapez `/schedule` dans une session **Claude Code** et décrivez l'audit, ou créez-le sur [claude.ai/code/routines](https://claude.ai/code/routines).

**Sur votre ordinateur**, l'audit utilise le plugin que vous avez installé pour vous-même :

- Créez une tâche locale sur la page **Scheduled tasks** de l'application de bureau.
- Autorisez le moteur à l'avance, comme l'indique la [page d'installation](https://lagune.ai/fr-FR/docs/install/claude-code), puisque personne n'est là pour approuver ses outils.
- La tâche ne s'exécute que lorsque l'application est ouverte et que votre ordinateur n'est pas en veille.

Les tâches planifiées se créent dans l'application de bureau **ChatGPT**, pas dans **Codex CLI**, et s'exécutent sur votre ordinateur :

- Dans une conversation **Codex**, décrivez l'audit, quand il doit s'exécuter, et précisez que chaque exécution démarre une nouvelle conversation. Ses résultats arrivent dans **Scheduled**.
- Dans le prompt, nommez chaque commande avec `$`, comme `$lagune:lagune-detect`, pour que l'exécution l'invoque explicitement.
- Choisissez votre projet local plutôt qu'un nouveau worktree, qui démarre sans le moteur que vous avez [installé dans votre projet](https://lagune.ai/fr-FR/docs/install/codex).
- La tâche ne s'exécute que lorsque l'application est ouverte, que votre ordinateur est allumé et que le projet se trouve sur le disque.

Les Automations de **Cursor** s'exécutent dans le cloud, même quand votre ordinateur est éteint :

- Committez **Lagune** avec l'[installation universelle](https://lagune.ai/fr-FR/docs/install/universal) plutôt qu'avec le plugin.
- Créez une automation sur [cursor.com/automations](https://cursor.com/automations), ou décrivez-la avec `/automate` dans une session d'agent, en lui donnant un déclencheur planifié.
- Sélectionnez votre dépôt, puisqu'un déclencheur planifié démarre sans dépôt.

Les Automations d'**Antigravity** s'exécutent sur votre ordinateur, chacune dans une nouvelle conversation :

- Ouvrez l'onglet **Automations** dans l'application **Antigravity** et créez une automation planifiée pour votre projet, ou demandez à l'agent de la configurer.
- Autorisez le moteur à l'avance, comme l'indique la [page d'installation](https://lagune.ai/fr-FR/docs/install/antigravity-cli), puisque personne n'est là pour approuver ses outils.
- Utilisez une automation plutôt que `/schedule`, qui ne dure que le temps de sa conversation.
- L'automation ne s'exécute que lorsque **Antigravity** est en cours d'exécution.

**OpenCode** n'a pas de planificateur propre, donc l'audit s'exécute depuis **GitHub Actions**, dans le cloud :

- Committez **Lagune** dans le fichier `opencode.json` du dépôt, comme l'indique la [page d'installation](https://lagune.ai/fr-FR/docs/install/opencode).
- Exécutez `opencode github install` pour connecter l'application GitHub d'**OpenCode** et enregistrer la clé de votre fournisseur de modèles.
- Ajoutez un workflow qui transmet le prompt à **OpenCode** selon un calendrier, ici chaque lundi à 09:00 UTC, en renseignant `<KEY>` et `<provider>/<model>` comme dans le workflow créé par `opencode github install`, et `<your-prompt>` avec l'un des [exemples de prompts](#prompt-examples) :

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

### Exemples de prompts \{#prompt-examples}

**💧 Signaler uniquement**

Cartographie les nouveaux risques, planifie leurs correctifs et revérifie les mesures de protection déjà appliquées, sans modifier votre code :

```md
Exécute les commandes suivantes, une par une : `/lagune-detect` et `/lagune-plan`. Si le projet a un registre de durcissement, exécute aussi `/lagune-verify`.

Ne modifie pas le code du projet. À la fin, résume les nouveaux constats et toute mesure de protection appliquée qui n'est plus efficace.
```

**🌊 Cycle complet**

Applique aussi les correctifs prévus et prouve que chacun est efficace, alors relisez ses modifications avant qu'elles n'atteignent votre branche principale :

```md
Exécute les commandes suivantes, une par une : `/lagune-detect`, `/lagune-plan`, `/lagune-harden` et `/lagune-verify`.

À la fin, résume les correctifs appliqués et tout constat encore ouvert.
```
