# Установка Lagune в Muse Code как плагина

> Установите Lagune в Muse Code как плагин, поддерживайте его в актуальном состоянии и запускайте его движок внутри песочницы.

Канонический URL: https://lagune.ai/ru-RU/docs/install/muse-code
Язык: ru-RU
Оригинал: https://lagune.ai/docs/install/muse-code
Последнее обновление: 2026-11-03

Установите плагин из терминала:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## Обновление

Чтобы обновить **Lagune**, обновите маркетплейс и переустановите плагин:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## Команды

Вводите команды по имени, например `/lagune-charter`, или с именем плагина, например `/lagune:lagune-charter`.

---

**Разрешения**

Песочница **Muse Code** не может скачать движок. Установите его в проект из своего терминала, один раз и после каждого обновления:

```bash
npm i -D lagune@0.16.0
```

## Частые вопросы

### Как установить Lagune в Muse Code?

Выполните muse plugins marketplace add lagune wellwelwel/lagune, затем muse plugins install lagune@lagune.

### Как обновить Lagune в Muse Code?

Выполните muse plugins marketplace update lagune, затем переустановите плагин командами muse plugins remove lagune и muse plugins install lagune@lagune.

### Как запускать команды Lagune в Muse Code?

Вводите их по имени, например /lagune-charter, или с именем плагина, например /lagune:lagune-charter.

### Работает ли Lagune внутри песочницы Muse Code?

Да, если установить движок в проект командой npm i -D lagune@0.16.0 из своего терминала, один раз и после каждого обновления.
