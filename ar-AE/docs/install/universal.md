# ثبّت Lagune في أي وكيل عبر skills.sh أو GitHub CLI

> ثبّت Lagune في أي وكيل ذكاء اصطناعي عبر skills CLI أو GitHub CLI، وحافظ على تحديثه.

Canonical: https://lagune.ai/ar-AE/docs/install/universal
اللغة: ar-AE
الأصل: https://lagune.ai/docs/install/universal
آخر تحديث: 2026-11-09

**skills.sh**

ثبّت أوامر **Lagune** في مشروعك من الطرفية عبر [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune -y
```

أو الصق هذا الموجّه في وكيلك:

```md
شغّل `npx --yes skills add wellwelwel/lagune --yes` واتبع تعليمات المهارة التي يولّدها الآن. اقرأ مخرجاته كاملة، مع إعادة توجيهها إلى ملف مؤقت أولًا إن لزم الأمر. وحلّ المسارات النسبية انطلاقًا من دليل الملفات المساندة الذي يوفّره.
```

**GitHub CLI**

ثبّت أوامر **Lagune** في مشروعك من الطرفية عبر [**GitHub CLI**](https://cli.github.com/) بالإصدار 2.90.0 أو أحدث:

```bash
gh skill install wellwelwel/lagune --all --scope project
```

أو الصق هذا الموجّه في وكيلك:

```md
شغّل `gh skill install wellwelwel/lagune --all --scope project` واقرأ مخرجاته كاملة، مع إعادة توجيهها إلى ملف مؤقت أولًا إن لزم الأمر.
```

## التحديث

**skills.sh**

لتحديث **Lagune**، شغّل:

```bash
npx skills update
```

أو الصق هذا الموجّه في وكيلك:

```md
شغّل `npx --yes skills update -y` واقرأ مخرجاته كاملة، مع إعادة توجيهها إلى ملف مؤقت أولًا إن لزم الأمر.
```

**GitHub CLI**

لتحديث **Lagune**، شغّل:

```bash
gh skill update --all
```

أو الصق هذا الموجّه في وكيلك:

```md
شغّل `gh skill update --all` واقرأ مخرجاته كاملة، مع إعادة توجيهها إلى ملف مؤقت أولًا إن لزم الأمر.
```

---

**بيئة العزل**

في بيئة عزل دون وصول إلى الشبكة، لا تستطيع الأوامر تنزيل المحرك. ثبّته في مشروعك من طرفيتك، مرة واحدة وبعد كل تحديث:

```bash
npm i -D lagune@0.19.0
```

## الأسئلة الشائعة

### كيف أثبّت Lagune في أي وكيل ذكاء اصطناعي؟

شغّل npx skills add wellwelwel/lagune -y أو gh skill install wellwelwel/lagune --all --scope project في مشروعك، أو الصق موجّه التثبيت في وكيلك.

### كيف أحدّث Lagune في أي وكيل ذكاء اصطناعي؟

شغّل npx skills update إن كنت ثبّته عبر skills.sh، أو gh skill update --all إن كنت ثبّته عبر GitHub CLI. ويمكنك أيضًا لصق موجّه التحديث في وكيلك.

### هل يمكنني تثبيت Lagune بأكثر من طريقة؟

لا. مع طريقتين، يسرد الوكيل كل أمر مرتين، أو يستخدم نسخة ويخفي الأخرى.
