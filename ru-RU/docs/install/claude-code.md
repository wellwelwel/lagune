# Установка Lagune в Claude Code как плагина

> Установите Lagune в Claude Code как плагин, в терминале, расширении или десктопном приложении, поддерживайте его в актуальном состоянии и заранее разрешите его движок.

Канонический URL: https://lagune.ai/ru-RU/docs/install/claude-code
Язык: ru-RU
Оригинал: https://lagune.ai/docs/install/claude-code
Последнее обновление: 2026-11-03

**Терминал**

Установите плагин из терминала:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

Или из сессии **Claude Code**:

```text
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**Расширение**

- Введите `/plugin` и выберите **Manage plugins**.
- Добавьте `wellwelwel/lagune` на вкладке **Marketplaces**.
- Установите `lagune` на вкладке **Plugins**.

**Десктоп**

- Установите **Lagune** из терминала или расширения, выбрав в расширении **Install for you**.
- Начните новую сессию в десктопном приложении, которое загружает плагины, установленные вами для себя.

## Обновление

**Терминал**

Чтобы обновить **Lagune**, выполните:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

Чтобы он обновлялся сам, выберите **Enable auto-update** для маркетплейса `lagune` в `/plugin`.

**Расширение**

- Введите `/plugin` и выберите **Manage plugins**.
- Откройте вкладку **Marketplaces**.
- Нажмите значок обновления у `lagune`.

**Десктоп**

- Обновите **Lagune** из терминала или расширения.
- Начните новую сессию в десктопном приложении.

## Команды

Вводите команды по имени, например `/lagune-charter`, или с именем плагина, например `/lagune:lagune-charter`.

---

**Разрешения**

Движок работает через два инструмента: `lagune_read` только читает ваш проект, а `lagune_write` только пишет в `.lagune/`. Чтобы разрешить их заранее, добавьте эти правила в `.claude/settings.json` для одного проекта или в `~/.claude/settings.json` для всех:

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

Когда движок запускается через **npx**, как в случае **skills.sh**, разрешите `Bash(npx --yes lagune@*)`. Если включена песочница, также добавьте `registry.npmjs.org` в `sandbox.network.allowedDomains`.

## Частые вопросы

### Как установить Lagune в Claude Code?

Выполните claude plugin install lagune --marketplace wellwelwel/lagune. В сессии или расширении добавьте маркетплейс wellwelwel/lagune через менеджер плагинов и установите lagune. Десктопное приложение загружает его, как только вы установите его для себя в терминале или расширении.

### Как обновить Lagune в Claude Code?

Выполните claude plugin marketplace update lagune, затем claude plugin update lagune@lagune, или выберите Enable auto-update для маркетплейса lagune в /plugin. В расширении откройте Manage plugins из /plugin и нажмите значок обновления у маркетплейса lagune. Десктопное приложение загружает обновление в следующей сессии.

### Как запускать команды Lagune в Claude Code?

Вводите их по имени, например /lagune-charter, или с именем плагина, например /lagune:lagune-charter.

### Может ли Claude Code запускать Lagune, не спрашивая разрешения?

Да. Разрешите mcp__plugin_lagune_lagune__lagune_read и mcp__plugin_lagune_lagune__lagune_write в настройках Claude Code, а также Bash(npx --yes lagune@*), когда движок запускается через npx.
