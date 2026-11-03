# Встановлення Lagune у Muse Code як плагіна

> Встановіть Lagune у Muse Code як плагін, підтримуйте його оновленим і запускайте його рушій у пісочниці.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs/install/muse-code
Мова: uk-UA
Оригінал: https://lagune.ai/docs/install/muse-code
Останнє оновлення: 2026-11-03

Встановіть плагін із термінала:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## Оновлення

Щоб оновити **Lagune**, оновіть маркетплейс і перевстановіть плагін:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## Команди

Вводьте команди за назвою, як-от `/lagune-charter`, або з назвою плагіна, як-от `/lagune:lagune-charter`.

---

**Дозволи**

Пісочниця **Muse Code** не може завантажити рушій. Встановіть його у свій проєкт із власного термінала, один раз і після кожного оновлення:

```bash
npm i -D lagune@0.16.0
```

## Часті запитання

### Як встановити Lagune у Muse Code?

Виконайте muse plugins marketplace add lagune wellwelwel/lagune, а потім muse plugins install lagune@lagune.

### Як оновити Lagune у Muse Code?

Виконайте muse plugins marketplace update lagune, а потім перевстановіть плагін командами muse plugins remove lagune і muse plugins install lagune@lagune.

### Як запускати команди Lagune у Muse Code?

Вводьте їх за назвою, як-от /lagune-charter, або з назвою плагіна, як-от /lagune:lagune-charter.

### Чи працює Lagune у пісочниці Muse Code?

Так, щойно ви встановите рушій у свій проєкт командою npm i -D lagune@0.16.0 із власного термінала, один раз і після кожного оновлення.
