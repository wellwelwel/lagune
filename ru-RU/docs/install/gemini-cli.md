# Установка Lagune в Gemini CLI как расширения

> Установите Lagune в Gemini CLI как расширение, поддерживайте его в актуальном состоянии и заранее разрешите его движок.

Канонический URL: https://lagune.ai/ru-RU/docs/install/gemini-cli
Язык: ru-RU
Оригинал: https://lagune.ai/docs/install/gemini-cli
Последнее обновление: 2026-11-05

Установите расширение из терминала:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## Обновление

Чтобы обновить **Lagune**, выполните:

```bash
gemini extensions update lagune
```

Чтобы он обновлялся сам, установите его с `--auto-update`.

## Команды

Вводите команды с именем расширения, например `/lagune:lagune-charter` для `/lagune-charter`.

---

**Разрешения**

Движок работает через два инструмента: `lagune_read` только читает ваш проект, а `lagune_write` только пишет в `.lagune/`. **Gemini CLI** запускает их только в доверенной папке. Чтобы разрешить их заранее, сохраните это правило как `~/.gemini/policies/lagune.toml`:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

Когда движок запускается через **npx**, как в случае **skills.sh**, добавьте в тот же файл это правило:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## Частые вопросы

### Как установить Lagune в Gemini CLI?

Выполните gemini extensions install https://github.com/wellwelwel/lagune.

### Как обновить Lagune в Gemini CLI?

Выполните gemini extensions update lagune или установите расширение с --auto-update.

### Как запускать команды Lagune в Gemini CLI?

Вводите их с именем расширения, например /lagune:lagune-charter.

### Может ли Gemini CLI запускать Lagune, не спрашивая разрешения?

Да. Добавьте правило политики, которое разрешает инструменты lagune_read и lagune_write сервера lagune, а также правило для run_shell_command с npx --yes lagune@ и версией, когда движок запускается через npx.
