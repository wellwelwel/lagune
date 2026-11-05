# Встановлення Lagune у Claude Code як плагіна

> Встановіть Lagune у Claude Code як плагін у терміналі, розширенні чи десктопному застосунку, підтримуйте його оновленим і заздалегідь дозвольте роботу його рушія.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs/install/claude-code
Мова: uk-UA
Оригінал: https://lagune.ai/docs/install/claude-code
Останнє оновлення: 2026-11-05

**Термінал**

Встановіть плагін із термінала:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

Або із сесії **Claude Code**:

```text
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**Розширення**

- Введіть `/plugin` і виберіть **Manage plugins**.
- Додайте `wellwelwel/lagune` на вкладці **Marketplaces**.
- Встановіть `lagune` на вкладці **Plugins**.

**Десктоп**

- Встановіть **Lagune** з термінала чи розширення, вибравши в розширенні **Install for you**.
- Почніть нову сесію в десктопному застосунку, який завантажує плагіни, встановлені вами для себе.

## Оновлення

**Термінал**

Щоб оновити **Lagune**, виконайте:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

Щоб оновлення відбувалися автоматично, виберіть **Enable auto-update** для маркетплейсу `lagune` у `/plugin`.

**Розширення**

- Введіть `/plugin` і виберіть **Manage plugins**.
- Відкрийте вкладку **Marketplaces**.
- Натисніть значок оновлення біля `lagune`.

**Десктоп**

- Оновіть **Lagune** з термінала чи розширення.
- Почніть нову сесію в десктопному застосунку.

## Команди

Вводьте команди за назвою, як-от `/lagune-charter`, або з назвою плагіна, як-от `/lagune:lagune-charter`.

---

**Дозволи**

Рушій працює через два інструменти: `lagune_read` лише читає ваш проєкт, а `lagune_write` лише записує в `.lagune/`. Щоб дозволити їх заздалегідь, додайте ці правила до `.claude/settings.json` для одного проєкту або до `~/.claude/settings.json` для всіх:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

Коли рушій працює через **npx**, як із **skills.sh**, дозвольте `Bash(npx --yes lagune@*)`. Якщо ввімкнено пісочницю, також додайте `registry.npmjs.org` до `sandbox.network.allowedDomains`.

## Часті запитання

### Як встановити Lagune у Claude Code?

Виконайте claude plugin install lagune --marketplace wellwelwel/lagune. У сесії чи розширенні додайте маркетплейс wellwelwel/lagune у менеджері плагінів і встановіть lagune. Десктопний застосунок завантажує його, щойно ви встановите його для себе в терміналі чи розширенні.

### Як оновити Lagune у Claude Code?

Виконайте claude plugin marketplace update lagune, а потім claude plugin update lagune@lagune, або виберіть Enable auto-update для маркетплейсу lagune у /plugin. У розширенні відкрийте Manage plugins через /plugin і натисніть значок оновлення біля маркетплейсу lagune. Десктопний застосунок завантажує оновлення в наступній сесії.

### Як запускати команди Lagune у Claude Code?

Вводьте їх за назвою, як-от /lagune-charter, або з назвою плагіна, як-от /lagune:lagune-charter.

### Чи може Claude Code запускати Lagune, не питаючи дозволу?

Так. Дозвольте mcp__plugin_lagune_lagune__lagune_read і mcp__plugin_lagune_lagune__lagune_write у налаштуваннях Claude Code, а також Bash(npx --yes lagune@*), коли рушій працює через npx.
