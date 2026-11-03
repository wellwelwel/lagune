# Встановлення Lagune у Grok Build як плагіна

> Встановіть Lagune у Grok Build як плагін, підтримуйте його оновленим і заздалегідь дозвольте роботу його рушія.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs/install/grok-build
Мова: uk-UA
Оригінал: https://lagune.ai/docs/install/grok-build
Останнє оновлення: 2026-11-03

Встановіть плагін із термінала:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## Оновлення

Щоб оновити **Lagune**, виконайте:

```bash
grok plugin update lagune
```

## Команди

Вводьте команди за назвою, як-от `/lagune-charter`, або з назвою плагіна, як-от `/lagune:lagune-charter`.

---

**Дозволи**

Рушій працює через два інструменти: `lagune_read` лише читає ваш проєкт, а `lagune_write` лише записує в `.lagune/`. Щоб дозволити їх заздалегідь, додайте ці правила до `~/.grok/config.toml`:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

Коли рушій працює через **npx**, як із **skills.sh**, дозвольте `Bash(npx --yes lagune@*)`.

## Часті запитання

### Як встановити Lagune у Grok Build?

Виконайте grok plugin install wellwelwel/lagune@plugin-grok --trust.

### Як оновити Lagune у Grok Build?

Виконайте grok plugin update lagune.

### Як запускати команди Lagune у Grok Build?

Вводьте їх за назвою, як-от /lagune-charter, або з назвою плагіна, як-от /lagune:lagune-charter.

### Чи може Grok Build запускати Lagune, не питаючи дозволу?

Так. Дозвольте MCPTool(lagune__lagune_read) і MCPTool(lagune__lagune_write) у конфігурації Grok Build, а також Bash(npx --yes lagune@*), коли рушій працює через npx.
