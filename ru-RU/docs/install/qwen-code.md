# Установка Lagune в Qwen Code как расширения

> Установите Lagune в Qwen Code как расширение, поддерживайте его в актуальном состоянии и заранее разрешите его движок.

Канонический URL: https://lagune.ai/ru-RU/docs/install/qwen-code
Язык: ru-RU
Оригинал: https://lagune.ai/docs/install/qwen-code
Последнее обновление: 2026-11-04

Установите расширение из терминала:

```bash
qwen extensions install lagune
```

## Обновление

Чтобы обновить **Lagune**, выполните:

```bash
qwen extensions update lagune
```

Чтобы он обновлялся сам, установите его с `--auto-update`.

## Команды

Вводите команды с именем расширения, например `/lagune:lagune-charter` для `/lagune-charter`.

---

**Разрешения**

Движок работает через два инструмента: `lagune_read` только читает ваш проект, а `lagune_write` только пишет в `.lagune/`. Чтобы разрешить их заранее, добавьте эти правила в `.qwen/settings.json` для одного проекта или в `~/.qwen/settings.json` для всех:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

Когда движок запускается через **npx**, как в случае **skills.sh**, разрешите `Shell(npx --yes lagune@*)`.

## Частые вопросы

### Как установить Lagune в Qwen Code?

Выполните qwen extensions install lagune.

### Как обновить Lagune в Qwen Code?

Выполните qwen extensions update lagune или установите расширение с --auto-update.

### Как запускать команды Lagune в Qwen Code?

Вводите их с именем расширения, например /lagune:lagune-charter.

### Может ли Qwen Code запускать Lagune, не спрашивая разрешения?

Да. Разрешите mcp__lagune__lagune_read и mcp__lagune__lagune_write в настройках Qwen Code, а также Shell(npx --yes lagune@*), когда движок запускается через npx.
