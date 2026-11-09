# ثبّت Lagune على Hermes Agent كإضافة

> ثبّت Lagune على Hermes Agent كإضافة، وحافظ على تحديثه.

Canonical: https://lagune.ai/ar-AE/docs/install/hermes-agent
اللغة: ar-AE
الأصل: https://lagune.ai/docs/install/hermes-agent
آخر تحديث: 2026-11-09

ثبّت الإضافة من الطرفية:

```bash
hermes plugins install wellwelwel/lagune --enable
```

- حين يطلب منك **Hermes Agent** تأكيد إضافة من خارج كتالوجه، **أكّدها**.
- حين يعرض تثبيت اعتماديات **Node.js** الخاصة بالمستودع، **ارفض**.

## التحديث

لتحديث **Lagune**، شغّل:

```bash
hermes plugins update lagune
```

## الأوامر

اكتب الأوامر تحت اسم الإضافة، مثل `/lagune:lagune-charter` بدلًا من `/lagune-charter` و `/lagune:lagune` بدلًا من `/lagune`.

## الأسئلة الشائعة

### كيف أثبّت Lagune على Hermes Agent؟

شغّل hermes plugins install wellwelwel/lagune --enable. أكّد الإضافة حين يُطلب منك ذلك، وارفض تثبيت اعتماديات Node.js الخاصة بالمستودع.

### كيف أحدّث Lagune على Hermes Agent؟

شغّل hermes plugins update lagune.

### كيف أشغّل أوامر Lagune على Hermes Agent؟

اكتبها تحت اسم الإضافة، مثل ‎/lagune:lagune-charter و ‎/lagune:lagune.
