# Встановлення Lagune в Antigravity CLI як плагіна

> Встановіть Lagune в Antigravity CLI як плагін, підтримуйте його оновленим і заздалегідь дозвольте роботу його рушія.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs/install/antigravity-cli
Мова: uk-UA
Оригінал: https://lagune.ai/docs/install/antigravity-cli
Останнє оновлення: 2026-11-05

Встановіть плагін із термінала:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Оновлення

Щоб оновити **Lagune**, встановіть його знову:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Команди

Вводьте команди з назвою плагіна, як-от `/lagune:lagune-charter` для `/lagune-charter`.

---

**Дозволи**

Рушій працює через два інструменти: `lagune_read` лише читає ваш проєкт, а `lagune_write` лише записує в `.lagune/`. Команда, надіслана першим повідомленням сесії, виконується до того, як вони завантажаться, тож натомість використовує **npx**. Щоб дозволити інструменти й **npx** заздалегідь, додайте ці правила до `~/.gemini/antigravity-cli/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## Часті запитання

### Як встановити Lagune в Antigravity CLI?

Виконайте agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Як оновити Lagune в Antigravity CLI?

Знову виконайте agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Як запускати команди Lagune в Antigravity CLI?

Вводьте їх з назвою плагіна, як-от /lagune:lagune-charter.

### Чи може Antigravity CLI запускати Lagune, не питаючи дозволу?

Так. Дозвольте mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write) і command(regex:npx --yes lagune@[0-9.]+) у налаштуваннях Antigravity CLI. Правило для npx охоплює команду, надіслану першим повідомленням сесії.
