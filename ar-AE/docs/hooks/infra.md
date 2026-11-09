# hook infra: اكتشف أخطاء إعداد IaC

> افحص ملفات Terraform و Dockerfiles و GitHub Actions بحثًا عن أخطاء الإعداد، أو قيّم مقتطفًا واحدًا، من سطر الأوامر.

Canonical: https://lagune.ai/ar-AE/docs/hooks/infra
اللغة: ar-AE
الأصل: https://lagune.ai/docs/hooks/infra
آخر تحديث: 2026-11-09

ينبّه hook `infra` إلى **أخطاء إعداد البنية التحتية ككود** التي يمكن الحسم فيها من الملف نفسه: شبكة مفتوحة للعالم، أو صلاحية wildcard، أو سر في ملف manifest، أو حاوية تعمل بصلاحيات root، أو قيمة غير موثوقة في صدفة CI. ولا يقرأ إلا ملفات IaC (`.tf`/`.tf.json`/`.hcl`، و `Dockerfile*`، و `.github/workflows/**`). وهو المحرك الحتمي خلف [التخصص `infra`](https://lagune.ai/ar-AE/docs/catalog)، في وضع **scan** أو **check**.

## التشغيل

**افحص قاعدة الكود**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**تحقق من مقتطف**

مرّر المقتطف عبر `--pattern` ونوعه عبر `--kind` (`terraform` أو `dockerfile` أو `github-actions`).

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

يطبع الفحص قسمين على الأكثر. **Infrastructure risks found** ينتهي برمز خروج غير صفري ويضم العيوب التي يمكن الحسم فيها (دخول `0.0.0.0/0` على منفذ حساس، أو عبارة IAM بصلاحية wildcard، أو سر في manifest، أو `encrypted = false`، أو وحدة git غير مثبّتة الإصدار، أو صورة تعمل صراحة بصلاحيات root، أو `curl | sh`، أو حقن في سكربت CI، أو `permissions: write-all`). أما **Infrastructure hardening advisories** فلا يغيّر رمز الخروج (وسم أساس قابل للتغيير، أو action مثبّت بوسم). والتشغيل النظيف يطبع `no infrastructure risks found`.

## كيف تقرأ الحكم

يطبع وضع check الوسم الأعلى خطورة الذي طابقه (مثل `public-ingress` و `iam-wildcard` و `root-user` و `curl-pipe` و `script-injection` و `write-all`)، أو وسمًا استشاريًا (`mutable-tag` و `unpinned-action`)، أو `safe`. ولا ينتهي برمز خروج غير صفري إلا الوسم الذي بمستوى ملاحظة.

### خيارات CLI

| الخيار      | القيمة                                          | الوصف                                                   |
| ----------- | ----------------------------------------------- | ------------------------------------------------------- |
| `--pattern` | مقتطف                                           | تحقق من مقتطف واحد. يتطلب `--kind`. كرّره لعدة مقتطفات. |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | النوع الذي يُحكم على المقتطف بناءً عليه.                |
| `--dir`     | دليل                                            | يحصر الفحص في دليل. يتكرر ويُجمع مع `--file`.           |
| `--file`    | ملف                                             | يحصر الفحص في ملف واحد. يتكرر ويُجمع مع `--dir`.        |

دون أي خيار، يفحص كل ملفات IaC في المشروع. ولا يمكن جمع `--pattern` مع `--dir` أو `--file`.

### اختر ما يفحصه

يستثني ما يتجاهله **Git**. ولاستثناء المزيد، أو لفحص ما يتجاهله **Git**، امنح `infra` إعدادات خاصة به:

```bash
npx lagune write add --ignore examples --checker infra
```

```json
{
  "checkers": {
    "infra": { "gitignore": false, "ignore": ["examples"] }
  }
}
```

تشرح صفحة [إعداد hooks](https://lagune.ai/ar-AE/docs/hooks/configure) كل إعداد.

**نصيحة**

يلتقط hook الحالات الصريحة التي يمكن الحسم فيها: أما غياب التشفير، والانكشاف عبر `pull_request_target`، والنطاق الصحيح لصلاحيات IAM، فهي أحكام يظل [التخصص `infra`](https://lagune.ai/ar-AE/docs/catalog) يغطيها.

## الأسئلة الشائعة

### ما ملفات البنية التحتية التي يقرؤها hook infra؟

ملفات Terraform/HCL (‎.tf و ‎.tf.json و ‎.hcl)، و Dockerfiles، وملفات YAML الخاصة بسير عمل GitHub Actions والـ actions تحت ‎.github/‎. ويصل إلى هذه الملفات رغم أن فاحصات الكود المصدري تتخطاها.
