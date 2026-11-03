# Установка Lagune в Hermes Agent как плагина

> Установите Lagune в Hermes Agent как плагин и поддерживайте его в актуальном состоянии.

Канонический URL: https://lagune.ai/ru-RU/docs/install/hermes-agent
Язык: ru-RU
Оригинал: https://lagune.ai/docs/install/hermes-agent
Последнее обновление: 2026-11-03

Установите плагин из терминала:

```bash
hermes plugins install wellwelwel/lagune --enable
```

- Когда **Hermes Agent** попросит подтвердить плагин не из своего каталога, **подтвердите**.
- Когда он предложит установить зависимости **Node.js** из репозитория, **откажитесь**.

## Обновление

Чтобы обновить **Lagune**, выполните:

```bash
hermes plugins update lagune
```

## Команды

Вводите команды с именем плагина, например `/lagune:lagune-charter` для `/lagune-charter` и `/lagune:lagune` для `/lagune`.

## Частые вопросы

### Как установить Lagune в Hermes Agent?

Выполните hermes plugins install wellwelwel/lagune --enable. Подтвердите плагин, когда вас попросят, и откажитесь от установки зависимостей Node.js из репозитория.

### Как обновить Lagune в Hermes Agent?

Выполните hermes plugins update lagune.

### Как запускать команды Lagune в Hermes Agent?

Вводите их с именем плагина, например /lagune:lagune-charter и /lagune:lagune.
