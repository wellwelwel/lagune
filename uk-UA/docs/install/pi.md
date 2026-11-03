# Встановлення Lagune у Pi як пакета

> Встановіть Lagune у Pi як пакет з npm чи GitHub і підтримуйте його оновленим.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs/install/pi
Мова: uk-UA
Оригінал: https://lagune.ai/docs/install/pi
Останнє оновлення: 2026-11-03

**npm**

Встановіть пакет із термінала:

```bash
pi install npm:lagune
```

**GitHub**

Встановіть останній коміт із **GitHub**, який запускає рушій через **npx**:

```bash
pi install git:github.com/wellwelwel/lagune
```

## Оновлення

**npm**

Щоб оновити **Lagune**, виконайте:

```bash
pi update npm:lagune
```

**GitHub**

Щоб оновити **Lagune**, виконайте:

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` оновлює кожен встановлений вами пакет, а `pi update` сам по собі оновлює лише **Pi**.

## Команди

Вводьте команди з префіксом `skill:`, як-от `/skill:lagune-charter` для `/lagune-charter`.

## Часті запитання

### Як встановити Lagune у Pi?

Виконайте pi install npm:lagune або pi install git:github.com/wellwelwel/lagune, щоб отримати останній коміт із GitHub.

### Як оновити Lagune у Pi?

Виконайте pi update npm:lagune або pi update git:github.com/wellwelwel/lagune для встановлення з GitHub. pi update --extensions оновлює кожен встановлений вами пакет.

### Як запускати команди Lagune у Pi?

Вводьте їх з префіксом skill:, як-от /skill:lagune-charter.
