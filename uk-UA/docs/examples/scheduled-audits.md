# Аудит за розкладом: запускайте Lagune регулярно

> Налаштуйте регулярний аудит Lagune у GitHub Actions із власним ключем або в Claude Code, Codex, Cursor, Antigravity чи OpenCode, щоб він повідомляв про нові ризики або запускав увесь процес Blue Team.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs/examples/scheduled-audits
Мова: uk-UA
Оригінал: https://lagune.ai/docs/examples/scheduled-audits
Останнє оновлення: 2026-11-09

Налаштуйте **Lagune** так, щоб він сам перевіряв ваш проєкт за розкладом і або повідомляв про знайдене, або запускав увесь процес Blue Team.

## Розклад

**Universal**

**GitHub Actions** запускає аудит у хмарі через [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/). Його рушій **Copilot CLI** звертається до вибраного вами постачальника моделей із вашим власним ключем, тож підписка на агента не потрібна:

- Встановіть розширення командою `gh extension install github/gh-aw`.
- Збережіть ключ свого постачальника як секрет репозиторію командою `gh secret set PROVIDER_API_KEY`.
- Збережіть цей робочий процес як `.github/workflows/lagune-audit.md`, замінивши `<model>` на одну з моделей вашого постачальника з підтримкою викликів інструментів, а `<your-prompt>` на один із [прикладів промптів](#prompt-examples):

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

  Потім відкрий pull request зі своїми змінами.
  ```

  | Постачальник                                                   | `<type>`    | `<url>`                                                          |
  | -------------------------------------------------------------- | ----------- | ---------------------------------------------------------------- |
  | **OpenAI**                                                     | `openai`    | `https://api.openai.com/v1`                                      |
  | **Anthropic**                                                  | `anthropic` | `https://api.anthropic.com`                                      |
  | Будь-який API, сумісний з **OpenAI**, наприклад **OpenRouter** | `openai`    | Його базова URL-адреса, наприклад `https://openrouter.ai/api/v1` |

- Виконайте `gh aw compile` і закомітьте робочий процес разом із файлом `.lock.yml`, який згенерує ця команда.

**У хмарі** аудит виконується, навіть коли ваш комп'ютер вимкнено:

- Закомітьте **Lagune** через [універсальне встановлення](https://lagune.ai/uk-UA/docs/install/universal) замість плагіна.
- Введіть `/schedule` у сесії **Claude Code** і опишіть аудит або створіть його на [claude.ai/code/routines](https://claude.ai/code/routines).

**На вашому комп'ютері** аудит використовує плагін, який ви встановили для себе:

- Створіть локальне завдання на сторінці **Scheduled tasks** у десктопному застосунку.
- Заздалегідь дозвольте рушій, як показано на [сторінці встановлення](https://lagune.ai/uk-UA/docs/install/claude-code), бо поруч не буде нікого, хто схвалить його інструменти.
- Завдання виконується, лише поки застосунок відкритий, а комп'ютер не перебуває в режимі сну.

Завдання за розкладом створюються в десктопному застосунку **ChatGPT**, а не в **Codex CLI**, і виконуються на вашому комп'ютері:

- У чаті **Codex** опишіть аудит, коли він має запускатися і що кожен запуск починає новий чат. Його результати з'являтимуться в **Scheduled**.
- У промпті називайте кожну команду через `$`, наприклад `$lagune:lagune-detect`, щоб запуск викликав її явно.
- Виберіть свій локальний проєкт, а не новий worktree, який стартує без рушія, [встановленого у вашому проєкті](https://lagune.ai/uk-UA/docs/install/codex).
- Завдання виконується, лише поки застосунок відкритий, комп'ютер увімкнено, а проєкт є на диску.

Automations у **Cursor** виконуються в хмарі, навіть коли ваш комп'ютер вимкнено:

- Закомітьте **Lagune** через [універсальне встановлення](https://lagune.ai/uk-UA/docs/install/universal) замість плагіна.
- Створіть автоматизацію на [cursor.com/automations](https://cursor.com/automations) або опишіть її через `/automate` у сесії агента, задавши їй тригер за розкладом.
- Виберіть свій репозиторій, бо тригер за розкладом запускається без нього.

Automations в **Antigravity** виконуються на вашому комп'ютері, кожна в новій розмові:

- Відкрийте вкладку **Automations** у застосунку **Antigravity** і створіть автоматизацію за розкладом для свого проєкту або попросіть агента налаштувати її.
- Заздалегідь дозвольте рушій, як показано на [сторінці встановлення](https://lagune.ai/uk-UA/docs/install/antigravity-cli), бо поруч не буде нікого, хто схвалить його інструменти.
- Використовуйте автоматизацію, а не `/schedule`, який діє лише доти, доки триває його розмова.
- Автоматизація виконується, лише поки **Antigravity** запущено.

**OpenCode** не має власного планувальника, тому аудит запускається з **GitHub Actions** у хмарі:

- Закомітьте **Lagune** в `opencode.json` репозиторію, як показано на [сторінці встановлення](https://lagune.ai/uk-UA/docs/install/opencode).
- Виконайте `opencode github install`, щоб підключити застосунок **OpenCode** для GitHub і зберегти ключ свого постачальника моделей.
- Додайте робочий процес, який передає промпт **OpenCode** за розкладом, тут щопонеділка о 09:00 UTC, заповнивши `<KEY>` і `<provider>/<model>` так, як у робочому процесі, що його створила `opencode github install`, а `<your-prompt>` одним із [прикладів промптів](#prompt-examples):

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

### Приклади промптів \{#prompt-examples}

**💧 Лише звіт**

Визначає нові ризики, планує їх виправлення й повторно перевіряє вже застосовані засоби захисту, не змінюючи ваш код:

```md
Виконай такі команди по черзі: `/lagune-detect` і `/lagune-plan`. Якщо в проєкті є журнал посилення захисту, також виконай `/lagune-verify`.

Не змінюй код проєкту. Наприкінці підсумуй нові знахідки й кожен застосований засіб захисту, який більше не діє.
```

**🌊 Повний цикл**

Також застосовує заплановані виправлення й доводить, що кожне з них діє, тож перегляньте його зміни, перш ніж вони потраплять у вашу основну гілку:

```md
Виконай такі команди по черзі: `/lagune-detect`, `/lagune-plan`, `/lagune-harden` і `/lagune-verify`.

Наприкінці підсумуй застосовані виправлення й кожну знахідку, яка ще залишається відкритою.
```
