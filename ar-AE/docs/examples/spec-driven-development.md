# Spec-Driven Development: أمّن ما تبنيه مواصفتك

> اجمع Lagune مع Superpowers أو Spec Kit أو OpenSpec: ضع ميثاق الأمان انطلاقًا من مواصفتك، ثم نفّذها عبر ‎/lagune الذي يحصّن كل مهمة أثناء كتابة الكود.

Canonical: https://lagune.ai/ar-AE/docs/examples/spec-driven-development
اللغة: ar-AE
الأصل: https://lagune.ai/docs/examples/spec-driven-development
آخر تحديث: 2026-11-09

اجمع **Lagune** مع أداة Spec-Driven Development، مثل [**Superpowers**](https://github.com/obra/superpowers) أو [**Spec Kit**](https://github.com/github/spec-kit) أو [**OpenSpec**](https://github.com/Fission-AI/OpenSpec): تقرّر أداتك ما الذي تبنيه، ويقرّر **Lagune** كيف يبقى آمنًا.

## كيف يندمج مع أداتك

ينضم **Lagune** إلى مسار أداتك في موضعين، ويترك الباقي دون تغيير:

1. بعد أن تكتب أداتك المواصفة، يقرأها الأمر [`/lagune-charter`](https://lagune.ai/ar-AE/docs/commands/charter) ويضع مبادئ الأمان التي تتطلبها الميزة، قبل وجود أي كود.
2. عند إضافة الأمر [`/lagune`](https://lagune.ai/ar-AE/docs/commands/lagune) إلى أمر التنفيذ في أداتك، يحصّن كل مهمة وفق تلك المبادئ أثناء كتابة الكود.

**نصيحة**

استبدل مسار المواصفة في كل مثال بالملف الذي كتبته أداتك. وإن كان للمشروع ميثاق أمان بالفعل، فإن الخطوة نفسها تحدّثه بما تحتاجه الميزة الجديدة.

## أمثلة الموجّهات

أرسل الموجّهات بالترتيب، وكل موجّه بعد انتهاء الذي قبله.

```prompt
/superpowers:brainstorming إتمام الشراء كضيف مع الدفع بالبطاقة.
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
/speckit.specify إتمام الشراء كضيف مع الدفع بالبطاقة.
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
