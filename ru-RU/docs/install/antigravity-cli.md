# Установка Lagune в Antigravity CLI как плагина

> Установите Lagune в Antigravity CLI как плагин, поддерживайте его в актуальном состоянии и заранее разрешите его движок.

Канонический URL: https://lagune.ai/ru-RU/docs/install/antigravity-cli
Язык: ru-RU
Оригинал: https://lagune.ai/docs/install/antigravity-cli
Последнее обновление: 2026-11-04

Установите плагин из терминала:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Обновление

Чтобы обновить **Lagune**, установите его снова:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Команды

Вводите команды с именем плагина, например `/lagune:lagune-charter` для `/lagune-charter`.

---

**Разрешения**

Движок работает через два инструмента: `lagune_read` только читает ваш проект, а `lagune_write` только пишет в `.lagune/`. Команда, отправленная первым сообщением сессии, выполняется до их загрузки, поэтому использует **npx**. Чтобы разрешить инструменты и **npx** заранее, добавьте эти правила в `~/.gemini/antigravity-cli/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## Частые вопросы

### Как установить Lagune в Antigravity CLI?

Выполните agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Как обновить Lagune в Antigravity CLI?

Снова выполните agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Как запускать команды Lagune в Antigravity CLI?

Вводите их с именем плагина, например /lagune:lagune-charter.

### Может ли Antigravity CLI запускать Lagune, не спрашивая разрешения?

Да. Разрешите mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write) и command(regex:npx --yes lagune@[0-9.]+) в настройках Antigravity CLI. Правило для npx охватывает команду, отправленную первым сообщением сессии.
