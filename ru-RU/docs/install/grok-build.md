# Установка Lagune в Grok Build как плагина

> Установите Lagune в Grok Build как плагин, поддерживайте его в актуальном состоянии и заранее разрешите его движок.

Канонический URL: https://lagune.ai/ru-RU/docs/install/grok-build
Язык: ru-RU
Оригинал: https://lagune.ai/docs/install/grok-build
Последнее обновление: 2026-11-05

Установите плагин из терминала:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## Обновление

Чтобы обновить **Lagune**, выполните:

```bash
grok plugin update lagune
```

## Команды

Вводите команды по имени, например `/lagune-charter`, или с именем плагина, например `/lagune:lagune-charter`.

---

**Разрешения**

Движок работает через два инструмента: `lagune_read` только читает ваш проект, а `lagune_write` только пишет в `.lagune/`. Чтобы разрешить их заранее, добавьте эти правила в `~/.grok/config.toml`:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

Когда движок запускается через **npx**, как в случае **skills.sh**, разрешите `Bash(npx --yes lagune@*)`.

## Частые вопросы

### Как установить Lagune в Grok Build?

Выполните grok plugin install wellwelwel/lagune@plugin-grok --trust.

### Как обновить Lagune в Grok Build?

Выполните grok plugin update lagune.

### Как запускать команды Lagune в Grok Build?

Вводите их по имени, например /lagune-charter, или с именем плагина, например /lagune:lagune-charter.

### Может ли Grok Build запускать Lagune, не спрашивая разрешения?

Да. Разрешите MCPTool(lagune__lagune_read) и MCPTool(lagune__lagune_write) в конфигурации Grok Build, а также Bash(npx --yes lagune@*), когда движок запускается через npx.
