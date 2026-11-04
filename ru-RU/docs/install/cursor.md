# Установка Lagune в Cursor как плагина

> Установите Lagune в Cursor и Cursor CLI как плагин, поддерживайте его в актуальном состоянии и заранее разрешите его движок.

Канонический URL: https://lagune.ai/ru-RU/docs/install/cursor
Язык: ru-RU
Оригинал: https://lagune.ai/docs/install/cursor
Последнее обновление: 2026-11-04

**Cursor**

- Откройте **Customize**.
- Выберите **From GitHub Repository** и введите `https://github.com/wellwelwel/lagune`.
- Нажмите **Install** у **Lagune** и выберите область проекта или пользователя.

**Cursor CLI**

- Добавьте маркетплейс из терминала:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Введите `/plugins` в сессии `agent`.
- Установите **Lagune**.

Если **Lagune** уже установлен в **Claude Code**, **Cursor CLI** загружает его оттуда.

## Обновление

**Cursor**

- Откройте **Customize**.
- Нажмите **Refresh** у маркетплейса `lagune`.

**Cursor CLI**

- Замените маркетплейс из терминала:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Введите `/plugins` в сессии `agent`.
- Снова установите **Lagune**.

## Команды

Вводите команды по имени, например `/lagune-charter`.

---

**Разрешения**

В **Cursor** команды запускают движок через **npx**, что режим Auto-review по умолчанию разрешает без вопросов.

В **Cursor CLI** движок работает через два инструмента: `lagune_read` только читает ваш проект, а `lagune_write` только пишет в `.lagune/`. Чтобы разрешить их заранее, добавьте эти правила в `.cursor/cli.json` для одного проекта или в `~/.cursor/cli-config.json` для всех:

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

Когда движок запускается через **npx**, как в случае **skills.sh**, разрешите `Shell(npx:--yes lagune@*)`.

## Частые вопросы

### Как установить Lagune в Cursor?

В Cursor откройте Customize, выберите From GitHub Repository, введите https://github.com/wellwelwel/lagune и установите Lagune. В Cursor CLI выполните agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor, затем установите Lagune из /plugins.

### Как обновить Lagune в Cursor?

В Cursor нажмите Refresh у маркетплейса lagune в Customize. В Cursor CLI удалите маркетплейс lagune, добавьте его снова, а затем снова установите Lagune из /plugins.

### Как запускать команды Lagune в Cursor?

Вводите их по имени, например /lagune-charter.

### Может ли Cursor запускать Lagune, не спрашивая разрешения?

Да. Режим Auto-review в Cursor по умолчанию уже это разрешает. В Cursor CLI разрешите Mcp(plugin-lagune-lagune:lagune_read) и Mcp(plugin-lagune-lagune:lagune_write), а также Shell(npx:--yes lagune@*), когда движок запускается через npx.
