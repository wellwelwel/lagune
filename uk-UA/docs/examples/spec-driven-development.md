# Spec-Driven Development: захистіть те, що будує ваша специфікація

> Поєднайте Lagune із Superpowers, Spec Kit чи OpenSpec: визначте принципи безпеки на основі своєї специфікації, а потім реалізуйте її з /lagune, щоб захист кожного завдання посилювався ще під час написання коду.

Канонічна URL-адреса: https://lagune.ai/uk-UA/docs/examples/spec-driven-development
Мова: uk-UA
Оригінал: https://lagune.ai/docs/examples/spec-driven-development
Останнє оновлення: 2026-11-09

Поєднайте **Lagune** з інструментом Spec-Driven Development, таким як [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit) чи [**OpenSpec**](https://github.com/Fission-AI/OpenSpec): ваш інструмент вирішує, що будувати, а **Lagune** вирішує, як зберегти це безпечним.

## Як це вписується в процес

**Lagune** долучається до процесу вашого інструмента у двох точках і не змінює решту:

1. Щойно ваш інструмент напише специфікацію, [`/lagune-charter`](https://lagune.ai/uk-UA/docs/commands/charter) читає її та визначає принципи безпеки, яких потребує функція, ще до появи будь-якого коду.
2. Якщо додати [`/lagune`](https://lagune.ai/uk-UA/docs/commands/lagune) до команди реалізації вашого інструмента, вона посилює захист кожного завдання відповідно до цих принципів ще під час написання коду.

**Порада**

Замініть шлях до специфікації в кожному прикладі на файл, який написав ваш інструмент. Якщо в проєкті вже є принципи безпеки, цей самий крок оновить їх тим, чого потребує нова функція.

## Приклади промптів

Надсилайте промпти по черзі, кожен після завершення попереднього.

```prompt
/superpowers:brainstorming Оформлення замовлення без реєстрації з оплатою карткою.
```

```prompt
/lagune-charter docs/superpowers/specs/2026-11-09-guest-checkout-design.md
```

```prompt
/superpowers:writing-plans
```

```prompt
/superpowers:executing-plans /lagune
```

```prompt
/speckit.specify Оформлення замовлення без реєстрації з оплатою карткою.
```

```prompt
/lagune-charter specs/001-guest-checkout/spec.md
```

```prompt
/speckit.plan
```

```prompt
/speckit.tasks
```

```prompt
/speckit.implement /lagune
```

```prompt
/opsx:propose add-guest-checkout
```

```prompt
/lagune-charter openspec/changes/add-guest-checkout/proposal.md
```

```prompt
/opsx:apply /lagune
```

```prompt
/opsx:archive
```
