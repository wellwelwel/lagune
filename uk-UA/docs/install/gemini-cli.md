# Встановлення Lagune в Gemini CLI як розширення

> Встановіть Lagune в Gemini CLI як розширення, підтримуйте його оновленим і заздалегідь дозвольте роботу його рушія.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs/install/gemini-cli
Мова: uk-UA
Оригінал: https://lagune.ai/docs/install/gemini-cli
Останнє оновлення: 2026-11-05

Встановіть розширення з термінала:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## Оновлення

Щоб оновити **Lagune**, виконайте:

```bash
gemini extensions update lagune
```

Щоб оновлення відбувалися автоматично, встановіть його з `--auto-update`.

## Команди

Вводьте команди з назвою розширення, як-от `/lagune:lagune-charter` для `/lagune-charter`.

---

**Дозволи**

Рушій працює через два інструменти: `lagune_read` лише читає ваш проєкт, а `lagune_write` лише записує в `.lagune/`. **Gemini CLI** запускає їх лише в довіреній папці. Щоб дозволити їх заздалегідь, збережіть це правило як `~/.gemini/policies/lagune.toml`:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

Коли рушій працює через **npx**, як із **skills.sh**, додайте до того самого файлу це правило:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## Часті запитання

### Як встановити Lagune в Gemini CLI?

Виконайте gemini extensions install https://github.com/wellwelwel/lagune.

### Як оновити Lagune в Gemini CLI?

Виконайте gemini extensions update lagune або встановіть розширення з --auto-update.

### Як запускати команди Lagune в Gemini CLI?

Вводьте їх з назвою розширення, як-от /lagune:lagune-charter.

### Чи може Gemini CLI запускати Lagune, не питаючи дозволу?

Так. Додайте правило політики, що дозволяє інструменти lagune_read і lagune_write сервера lagune, а також правило для run_shell_command з npx --yes lagune@ і версією, коли рушій працює через npx.
