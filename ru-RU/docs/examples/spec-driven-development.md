# Spec-Driven Development: защитите то, что строит ваша спецификация

> Используйте Lagune вместе с Superpowers, Spec Kit или OpenSpec: задайте принципы безопасности на основе своей спецификации, а затем реализуйте ее с /lagune, чтобы защита каждой задачи усиливалась прямо во время написания кода.

Канонический URL: https://lagune.ai/ru-RU/docs/examples/spec-driven-development
Язык: ru-RU
Оригинал: https://lagune.ai/docs/examples/spec-driven-development
Последнее обновление: 2026-11-09

Используйте **Lagune** вместе с инструментом Spec-Driven Development, например [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit) или [**OpenSpec**](https://github.com/Fission-AI/OpenSpec): ваш инструмент решает, что строить, а **Lagune** решает, как сохранить это безопасным.

## Как это встраивается в процесс

**Lagune** подключается к процессу вашего инструмента в двух точках и не меняет остальное:

1. Как только ваш инструмент напишет спецификацию, [`/lagune-charter`](https://lagune.ai/ru-RU/docs/commands/charter) читает ее и задает принципы безопасности, которые нужны функции, еще до появления какого-либо кода.
2. Если добавить [`/lagune`](https://lagune.ai/ru-RU/docs/commands/lagune) к команде реализации вашего инструмента, он усиливает защиту каждой задачи в соответствии с этими принципами прямо во время написания кода.

**Совет**

Замените путь к спецификации в каждом примере на файл, который написал ваш инструмент. Если у проекта уже есть принципы безопасности, этот же шаг обновит их с учетом того, что нужно новой функции.

## Примеры промптов

Отправляйте промпты по порядку, каждый после завершения предыдущего.

```prompt
/superpowers:brainstorming Оформление заказа без регистрации с оплатой картой.
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
/speckit.specify Оформление заказа без регистрации с оплатой картой.
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
