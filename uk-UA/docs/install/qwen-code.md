# Встановлення Lagune у Qwen Code як розширення

> Встановіть Lagune у Qwen Code як розширення, підтримуйте його оновленим і заздалегідь дозвольте роботу його рушія.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs/install/qwen-code
Мова: uk-UA
Оригінал: https://lagune.ai/docs/install/qwen-code
Останнє оновлення: 2026-11-05

Встановіть розширення з термінала:

```bash
qwen extensions install lagune
```

## Оновлення

Щоб оновити **Lagune**, виконайте:

```bash
qwen extensions update lagune
```

Щоб оновлення відбувалися автоматично, встановіть його з `--auto-update`.

## Команди

Вводьте команди з назвою розширення, як-от `/lagune:lagune-charter` для `/lagune-charter`.

---

**Дозволи**

Рушій працює через два інструменти: `lagune_read` лише читає ваш проєкт, а `lagune_write` лише записує в `.lagune/`. Щоб дозволити їх заздалегідь, додайте ці правила до `.qwen/settings.json` для одного проєкту або до `~/.qwen/settings.json` для всіх:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

Коли рушій працює через **npx**, як із **skills.sh**, дозвольте `Shell(npx --yes lagune@*)`.

## Часті запитання

### Як встановити Lagune у Qwen Code?

Виконайте qwen extensions install lagune.

### Як оновити Lagune у Qwen Code?

Виконайте qwen extensions update lagune або встановіть розширення з --auto-update.

### Як запускати команди Lagune у Qwen Code?

Вводьте їх з назвою розширення, як-от /lagune:lagune-charter.

### Чи може Qwen Code запускати Lagune, не питаючи дозволу?

Так. Дозвольте mcp__lagune__lagune_read і mcp__lagune__lagune_write у налаштуваннях Qwen Code, а також Shell(npx --yes lagune@*), коли рушій працює через npx.
