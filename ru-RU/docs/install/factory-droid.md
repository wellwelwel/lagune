# Установка Lagune в Factory Droid как плагина

> Установите Lagune в Factory Droid как плагин, поддерживайте его в актуальном состоянии и разрешите инструменты его движка.

Канонический URL: https://lagune.ai/ru-RU/docs/install/factory-droid
Язык: ru-RU
Оригинал: https://lagune.ai/docs/install/factory-droid
Последнее обновление: 2026-11-03

Установите плагин из терминала:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## Обновление

Чтобы обновить **Lagune**, выполните:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## Команды

Вводите команды по имени, например `/lagune-charter`.

---

**Разрешения**

Движок работает через два инструмента: `lagune_read` только читает ваш проект, а `lagune_write` только пишет в `.lagune/`. Когда **Factory Droid** спросит, выберите всегда разрешать каждый из них. Он спросит снова после синхронизации нового коммита маркетплейса `lagune`, что может произойти при запуске.

## Частые вопросы

### Как установить Lagune в Factory Droid?

Выполните droid plugin marketplace add wellwelwel/lagune, затем droid plugin install lagune@lagune.

### Как обновить Lagune в Factory Droid?

Выполните droid plugin marketplace update lagune, затем droid plugin update lagune@lagune.

### Как запускать команды Lagune в Factory Droid?

Вводите их по имени, например /lagune-charter.

### Может ли Factory Droid запускать Lagune, не спрашивая разрешения?

Да. Когда Factory Droid спросит, выберите всегда разрешать lagune_read и lagune_write. Он спросит снова после синхронизации нового коммита маркетплейса lagune.
