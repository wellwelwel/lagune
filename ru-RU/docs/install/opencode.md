# Установка Lagune в OpenCode как плагина

> Установите Lagune в OpenCode 1.x и 2.x как плагин и поддерживайте его в актуальном состоянии.

Канонический URL: https://lagune.ai/ru-RU/docs/install/opencode
Язык: ru-RU
Оригинал: https://lagune.ai/docs/install/opencode
Последнее обновление: 2026-11-07

**OpenCode 2.x**

Установите плагин из терминала:

```bash
opencode plugin add lagune
```

Или добавьте его в список `plugins` в `opencode.json`:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

Установите плагин в проект из терминала или добавьте `-g`, чтобы установить его для всех своих проектов:

```bash
opencode plugin lagune
```

Или добавьте его в список `plugin` в `opencode.json`:

```json
{
  "plugin": ["lagune"]
}
```

## Обновление

**OpenCode 2.x**

Чтобы обновить **Lagune**, выполните:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

Чтобы обновить **Lagune**, установите новый релиз поверх старого, добавив `-g`, если вы устанавливали его для всех своих проектов:

```bash
opencode plugin lagune@0.18.0 --force
```

## Команды

**OpenCode 2.x**

Введите `@` и выберите команду, например `@lagune-charter`, затем напишите свой запрос в том же сообщении.

**OpenCode 1.x**

Вводите команды по имени, например `/lagune-charter`. Они перечислены в `/skills`, а не в меню `/`.

## Частые вопросы

### Как установить Lagune в OpenCode?

В OpenCode 2.x выполните opencode plugin add lagune. В OpenCode 1.x выполните opencode plugin lagune, добавив -g, чтобы установить его для всех своих проектов.

### Как обновить Lagune в OpenCode?

В OpenCode 2.x выполните opencode plugin update lagune, затем opencode reload. В OpenCode 1.x выполните opencode plugin lagune@0.18.0 --force.

### Как запускать команды Lagune в OpenCode?

В OpenCode 2.x введите @ и выберите команду, например @lagune-charter, затем напишите свой запрос в том же сообщении. В OpenCode 1.x вводите их по имени, например /lagune-charter, или найдите их в /skills.

### Спрашивает ли OpenCode разрешение перед запуском Lagune?

Нет. OpenCode запускает два инструмента движка, lagune_read и lagune_write, без вопросов.
