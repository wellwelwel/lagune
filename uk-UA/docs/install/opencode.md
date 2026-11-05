# Встановлення Lagune в OpenCode як плагіна

> Встановіть Lagune в OpenCode 1.x і 2.x як плагін і підтримуйте його оновленим.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs/install/opencode
Мова: uk-UA
Оригінал: https://lagune.ai/docs/install/opencode
Останнє оновлення: 2026-11-05

**OpenCode 2.x**

Встановіть плагін із термінала:

```bash
opencode plugin add lagune
```

Або додайте його до списку `plugins` в `opencode.json`:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

Встановіть плагін у свій проєкт із термінала або додайте `-g`, щоб встановити його для всіх своїх проєктів:

```bash
opencode plugin lagune
```

Або додайте його до списку `plugin` в `opencode.json`:

```json
{
  "plugin": ["lagune"]
}
```

## Оновлення

**OpenCode 2.x**

Щоб оновити **Lagune**, виконайте:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

Щоб оновити **Lagune**, встановіть новий реліз поверх старого, додавши `-g`, якщо ви встановлювали його для всіх своїх проєктів:

```bash
opencode plugin lagune@0.18.0 --force
```

## Команди

**OpenCode 2.x**

Введіть `@` і виберіть команду, як-от `@lagune-charter`, а потім напишіть свої вхідні дані в тому самому повідомленні.

**OpenCode 1.x**

Вводьте команди за назвою, як-от `/lagune-charter`. Вони перелічені в `/skills`, а не в меню `/`.

---

**Дозволи**

Рушій працює через два інструменти: `lagune_read` лише читає ваш проєкт, а `lagune_write` лише записує в `.lagune/`. **OpenCode** запускає їх, не питаючи.

## Часті запитання

### Як встановити Lagune в OpenCode?

В OpenCode 2.x виконайте opencode plugin add lagune. В OpenCode 1.x виконайте opencode plugin lagune, додавши -g, щоб встановити його для всіх своїх проєктів.

### Як оновити Lagune в OpenCode?

В OpenCode 2.x виконайте opencode plugin update lagune, а потім opencode reload. В OpenCode 1.x виконайте opencode plugin lagune@0.18.0 --force.

### Як запускати команди Lagune в OpenCode?

В OpenCode 2.x введіть @ і виберіть команду, як-от @lagune-charter, а потім напишіть свої вхідні дані в тому самому повідомленні. В OpenCode 1.x вводьте їх за назвою, як-от /lagune-charter, або знайдіть їх у /skills.

### Чи питає OpenCode дозволу, перш ніж запустити Lagune?

Ні. OpenCode запускає два інструменти рушія, lagune_read і lagune_write, не питаючи.
