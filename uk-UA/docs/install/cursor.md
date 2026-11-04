# Встановлення Lagune у Cursor як плагіна

> Встановіть Lagune у Cursor і Cursor CLI як плагін, підтримуйте його оновленим і заздалегідь дозвольте роботу його рушія.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs/install/cursor
Мова: uk-UA
Оригінал: https://lagune.ai/docs/install/cursor
Останнє оновлення: 2026-11-04

**Cursor**

- Відкрийте **Customize**.
- Виберіть **From GitHub Repository** і введіть `https://github.com/wellwelwel/lagune`.
- Натисніть **Install** біля **Lagune** і виберіть область проєкту чи користувача.

**Cursor CLI**

- Додайте маркетплейс із термінала:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Введіть `/plugins` у сесії `agent`.
- Встановіть **Lagune**.

Якщо **Lagune** уже встановлено в **Claude Code**, **Cursor CLI** завантажує його звідти.

## Оновлення

**Cursor**

- Відкрийте **Customize**.
- Натисніть **Refresh** біля маркетплейсу `lagune`.

**Cursor CLI**

- Замініть маркетплейс із термінала:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Введіть `/plugins` у сесії `agent`.
- Знову встановіть **Lagune**.

## Команди

Вводьте команди за назвою, як-от `/lagune-charter`.

---

**Дозволи**

У **Cursor** команди запускають рушій через **npx**, що його режим Auto-review за замовчуванням дозволяє, не питаючи.

У **Cursor CLI** рушій працює через два інструменти: `lagune_read` лише читає ваш проєкт, а `lagune_write` лише записує в `.lagune/`. Щоб дозволити їх заздалегідь, додайте ці правила до `.cursor/cli.json` для одного проєкту або до `~/.cursor/cli-config.json` для всіх:

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

Коли рушій працює через **npx**, як із **skills.sh**, дозвольте `Shell(npx:--yes lagune@*)`.

## Часті запитання

### Як встановити Lagune у Cursor?

У Cursor відкрийте Customize, виберіть From GitHub Repository, введіть https://github.com/wellwelwel/lagune і встановіть Lagune. У Cursor CLI виконайте agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor, а потім встановіть Lagune через /plugins.

### Як оновити Lagune у Cursor?

У Cursor натисніть Refresh біля маркетплейсу lagune у Customize. У Cursor CLI видаліть маркетплейс lagune, додайте його знову, а потім знову встановіть Lagune через /plugins.

### Як запускати команди Lagune у Cursor?

Вводьте їх за назвою, як-от /lagune-charter.

### Чи може Cursor запускати Lagune, не питаючи дозволу?

Так. Режим Auto-review у Cursor за замовчуванням уже це дозволяє. У Cursor CLI дозвольте Mcp(plugin-lagune-lagune:lagune_read) і Mcp(plugin-lagune-lagune:lagune_write), а також Shell(npx:--yes lagune@*), коли рушій працює через npx.
