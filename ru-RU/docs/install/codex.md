# Установка Lagune в Codex CLI как плагина

> Установите Lagune в Codex CLI как плагин, поддерживайте его в актуальном состоянии и запускайте его движок внутри песочницы.

Канонический URL: https://lagune.ai/ru-RU/docs/install/codex
Язык: ru-RU
Оригинал: https://lagune.ai/docs/install/codex
Последнее обновление: 2026-11-07

Установите плагин из терминала:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## Обновление

Чтобы обновить **Lagune**, выполните:

```bash
codex plugin marketplace upgrade lagune
```

## Команды

Введите `$` и команду с именем плагина, а за ней свой запрос, например `$lagune:lagune-charter` для `/lagune-charter`. Если ввести `$`, появится список команд, и при выборе одной из них подставится ее полное имя.

---

**Песочница**

У песочницы **Codex** нет доступа к сети. Установите движок в проект из своего терминала, один раз и после каждого обновления:

```bash
npm i -D lagune@0.18.0
```

## Частые вопросы

### Как установить Lagune в Codex CLI?

Выполните codex plugin marketplace add wellwelwel/lagune, затем codex plugin add lagune@lagune.

### Как обновить Lagune в Codex CLI?

Выполните codex plugin marketplace upgrade lagune.

### Как запускать команды Lagune в Codex CLI?

Введите $ и команду с именем плагина, а за ней свой запрос, например $lagune:lagune-charter.

### Работает ли Lagune внутри песочницы Codex?

Да, если установить движок в проект командой npm i -D lagune@0.18.0 из своего терминала, один раз и после каждого обновления.
