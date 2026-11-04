# Установка Lagune в Pi как пакета

> Установите Lagune в Pi как пакет, из npm или из GitHub, и поддерживайте его в актуальном состоянии.

Канонический URL: https://lagune.ai/ru-RU/docs/install/pi
Язык: ru-RU
Оригинал: https://lagune.ai/docs/install/pi
Последнее обновление: 2026-11-04

**npm**

Установите пакет из терминала:

```bash
pi install npm:lagune
```

**GitHub**

Установите последний коммит из **GitHub**, который запускает движок через **npx**:

```bash
pi install git:github.com/wellwelwel/lagune
```

## Обновление

**npm**

Чтобы обновить **Lagune**, выполните:

```bash
pi update npm:lagune
```

**GitHub**

Чтобы обновить **Lagune**, выполните:

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` обновляет все установленные вами пакеты, а `pi update` без флагов обновляет только **Pi**.

## Команды

Вводите команды с префиксом `skill:`, например `/skill:lagune-charter` для `/lagune-charter`.

## Частые вопросы

### Как установить Lagune в Pi?

Выполните pi install npm:lagune или pi install git:github.com/wellwelwel/lagune, чтобы получить последний коммит из GitHub.

### Как обновить Lagune в Pi?

Выполните pi update npm:lagune или pi update git:github.com/wellwelwel/lagune для установки из GitHub. pi update --extensions обновляет все установленные вами пакеты.

### Как запускать команды Lagune в Pi?

Вводите их с префиксом skill:, например /skill:lagune-charter.
