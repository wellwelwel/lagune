# Аудит по расписанию: регулярный запуск Lagune

> Настройте регулярный аудит Lagune в GitHub Actions с собственным ключом либо в Claude Code, Codex, Cursor, Antigravity или OpenCode: он будет сообщать о новых рисках или запускать весь процесс Blue Team.

Канонический URL: https://lagune.ai/ru-RU/docs/examples/scheduled-audits
Язык: ru-RU
Оригинал: https://lagune.ai/docs/examples/scheduled-audits
Последнее обновление: 2026-11-09

Настройте **Lagune** так, чтобы он сам проверял ваш проект по расписанию и либо сообщал о найденном, либо запускал весь процесс Blue Team.

## Расписание

**Universal**

**GitHub Actions** запускает аудит в облаке через [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/). Его движок **Copilot CLI** обращается к выбранному вами провайдеру моделей с вашим собственным ключом, поэтому подписка на агента не нужна:

- Установите расширение командой `gh extension install github/gh-aw`.
- Сохраните ключ своего провайдера как секрет репозитория командой `gh secret set PROVIDER_API_KEY`.
- Сохраните этот рабочий процесс как `.github/workflows/lagune-audit.md`, заменив `<model>` на одну из моделей вашего провайдера с поддержкой вызова инструментов, а `<your-prompt>` на один из [примеров промптов](#prompt-examples):

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

  Затем открой pull request со своими изменениями.
  ```

  | Провайдер                                                    | `<type>`    | `<url>`                                                  |
  | ------------------------------------------------------------ | ----------- | -------------------------------------------------------- |
  | **OpenAI**                                                   | `openai`    | `https://api.openai.com/v1`                              |
  | **Anthropic**                                                | `anthropic` | `https://api.anthropic.com`                              |
  | Любой API, совместимый с **OpenAI**, например **OpenRouter** | `openai`    | Его базовый URL, например `https://openrouter.ai/api/v1` |

- Выполните `gh aw compile` и закоммитьте рабочий процесс вместе с файлом `.lock.yml`, который создаст эта команда.

**В облаке** аудит выполняется, даже когда ваш компьютер выключен:

- Закоммитьте **Lagune** через [универсальную установку](https://lagune.ai/ru-RU/docs/install/universal) вместо плагина.
- Введите `/schedule` в сессии **Claude Code** и опишите аудит или создайте его на [claude.ai/code/routines](https://claude.ai/code/routines).

**На вашем компьютере** аудит использует плагин, который вы установили для себя:

- Создайте локальную задачу на странице **Scheduled tasks** в десктопном приложении.
- Заранее разрешите движок, как показано на [странице установки](https://lagune.ai/ru-RU/docs/install/claude-code), ведь рядом не будет никого, кто одобрит его инструменты.
- Задача выполняется, только пока приложение открыто, а компьютер не в спящем режиме.

Задачи по расписанию создаются в десктопном приложении **ChatGPT**, а не в **Codex CLI**, и выполняются на вашем компьютере:

- В чате **Codex** опишите аудит, когда он должен запускаться и что каждый запуск начинает новый чат. Его результаты появятся в **Scheduled**.
- В промпте называйте каждую команду через `$`, например `$lagune:lagune-detect`, чтобы запуск вызывал ее явно.
- Выберите свой локальный проект, а не новый worktree, который запускается без движка, [установленного в вашем проекте](https://lagune.ai/ru-RU/docs/install/codex).
- Задача выполняется, только пока приложение открыто, компьютер включен, а проект находится на диске.

Automations в **Cursor** выполняются в облаке, даже когда ваш компьютер выключен:

- Закоммитьте **Lagune** через [универсальную установку](https://lagune.ai/ru-RU/docs/install/universal) вместо плагина.
- Создайте автоматизацию на [cursor.com/automations](https://cursor.com/automations) или опишите ее через `/automate` в сессии агента, задав ей триггер по расписанию.
- Выберите свой репозиторий, так как триггер по расписанию запускается без него.

Automations в **Antigravity** выполняются на вашем компьютере, каждая в новом разговоре:

- Откройте вкладку **Automations** в приложении **Antigravity** и создайте автоматизацию по расписанию для своего проекта или попросите агента настроить ее.
- Заранее разрешите движок, как показано на [странице установки](https://lagune.ai/ru-RU/docs/install/antigravity-cli), ведь рядом не будет никого, кто одобрит его инструменты.
- Используйте автоматизацию, а не `/schedule`, который действует, только пока длится его разговор.
- Автоматизация выполняется, только пока **Antigravity** запущен.

У **OpenCode** нет собственного планировщика, поэтому аудит запускается из **GitHub Actions** в облаке:

- Закоммитьте **Lagune** в `opencode.json` репозитория, как показано на [странице установки](https://lagune.ai/ru-RU/docs/install/opencode).
- Выполните `opencode github install`, чтобы подключить приложение **OpenCode** для GitHub и сохранить ключ своего провайдера моделей.
- Добавьте рабочий процесс, который передает промпт **OpenCode** по расписанию, здесь каждый понедельник в 09:00 UTC, заполнив `<KEY>` и `<provider>/<model>` так же, как в рабочем процессе, созданном `opencode github install`, а `<your-prompt>` одним из [примеров промптов](#prompt-examples):

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

### Примеры промптов \{#prompt-examples}

**💧 Только отчет**

Выявляет новые риски, планирует их исправления и заново проверяет уже примененные меры защиты, не меняя ваш код:

```md
Выполни следующие команды одну за другой: `/lagune-detect` и `/lagune-plan`. Если в проекте есть журнал усиления защиты, также выполни `/lagune-verify`.

Не меняй код проекта. В конце кратко перечисли новые находки и все примененные меры защиты, которые больше не действуют.
```

**🌊 Полный цикл**

Также применяет запланированные исправления и доказывает, что каждое из них действует, поэтому проверьте его изменения, прежде чем они попадут в вашу основную ветку:

```md
Выполни следующие команды одну за другой: `/lagune-detect`, `/lagune-plan`, `/lagune-harden` и `/lagune-verify`.

В конце кратко перечисли примененные исправления и все находки, которые еще остаются открытыми.
```
