# Встановлення Lagune у Factory Droid як плагіна

> Встановіть Lagune у Factory Droid як плагін, підтримуйте його оновленим і дозвольте інструменти його рушія.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs/install/factory-droid
Мова: uk-UA
Оригінал: https://lagune.ai/docs/install/factory-droid
Останнє оновлення: 2026-11-03

Встановіть плагін із термінала:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## Оновлення

Щоб оновити **Lagune**, виконайте:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## Команди

Вводьте команди за назвою, як-от `/lagune-charter`.

---

**Дозволи**

Рушій працює через два інструменти: `lagune_read` лише читає ваш проєкт, а `lagune_write` лише записує в `.lagune/`. Коли **Factory Droid** запитає, виберіть завжди дозволяти кожен із них. Він запитає знову після синхронізації нового коміту маркетплейсу `lagune`, що може статися під час його запуску.

## Часті запитання

### Як встановити Lagune у Factory Droid?

Виконайте droid plugin marketplace add wellwelwel/lagune, а потім droid plugin install lagune@lagune.

### Як оновити Lagune у Factory Droid?

Виконайте droid plugin marketplace update lagune, а потім droid plugin update lagune@lagune.

### Як запускати команди Lagune у Factory Droid?

Вводьте їх за назвою, як-от /lagune-charter.

### Чи може Factory Droid запускати Lagune, не питаючи дозволу?

Так. Коли Factory Droid запитає, виберіть завжди дозволяти lagune_read і lagune_write. Він запитає знову після синхронізації нового коміту маркетплейсу lagune.
