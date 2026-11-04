# Встановлення Lagune в Codex CLI як плагіна

> Встановіть Lagune в Codex CLI як плагін, підтримуйте його оновленим і запускайте його рушій у пісочниці.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs/install/codex
Мова: uk-UA
Оригінал: https://lagune.ai/docs/install/codex
Останнє оновлення: 2026-11-04

Встановіть плагін із термінала:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## Оновлення

Щоб оновити **Lagune**, виконайте:

```bash
codex plugin marketplace upgrade lagune
```

## Команди

Введіть `$` і команду з назвою плагіна, а потім свої вхідні дані, як-от `$lagune:lagune-charter` для `/lagune-charter`. Якщо ввести `$`, з'явиться список команд, а вибір однієї з них вставляє її повну назву.

---

**Дозволи**

Пісочниця **Codex** не має доступу до мережі. Встановіть рушій у свій проєкт із власного термінала, один раз і після кожного оновлення:

```bash
npm i -D lagune@0.17.0
```

## Часті запитання

### Як встановити Lagune в Codex CLI?

Виконайте codex plugin marketplace add wellwelwel/lagune, а потім codex plugin add lagune@lagune.

### Як оновити Lagune в Codex CLI?

Виконайте codex plugin marketplace upgrade lagune.

### Як запускати команди Lagune в Codex CLI?

Введіть $ і команду з назвою плагіна, а потім свої вхідні дані, як-от $lagune:lagune-charter.

### Чи працює Lagune у пісочниці Codex?

Так, щойно ви встановите рушій у свій проєкт командою npm i -D lagune@0.17.0 із власного термінала, один раз і після кожного оновлення.
