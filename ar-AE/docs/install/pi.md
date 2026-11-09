# ثبّت Lagune على Pi كحزمة

> ثبّت Lagune على Pi كحزمة، من npm أو من GitHub، وحافظ على تحديثه.

Canonical: https://lagune.ai/ar-AE/docs/install/pi
اللغة: ar-AE
الأصل: https://lagune.ai/docs/install/pi
آخر تحديث: 2026-11-09

**npm**

ثبّت الحزمة من الطرفية:

```bash
pi install npm:lagune
```

**GitHub**

ثبّت أحدث commit من **GitHub**، وهو يشغّل المحرك عبر **npx**:

```bash
pi install git:github.com/wellwelwel/lagune
```

## التحديث

**npm**

لتحديث **Lagune**، شغّل:

```bash
pi update npm:lagune
```

**GitHub**

لتحديث **Lagune**، شغّل:

```bash
pi update git:github.com/wellwelwel/lagune
```

يحدّث `pi update --extensions` كل حزمة ثبّتها، بينما لا يحدّث `pi update` وحده إلا **Pi**.

## الأوامر

اكتب الأوامر مع البادئة `skill:`، مثل `/skill:lagune-charter` بدلًا من `/lagune-charter`.

## الأسئلة الشائعة

### كيف أثبّت Lagune على Pi؟

شغّل pi install npm:lagune، أو pi install git:github.com/wellwelwel/lagune للحصول على أحدث commit من GitHub.

### كيف أحدّث Lagune على Pi؟

شغّل pi update npm:lagune، أو pi update git:github.com/wellwelwel/lagune لتثبيت من GitHub. ويحدّث pi update --extensions كل حزمة ثبّتها.

### كيف أشغّل أوامر Lagune على Pi؟

اكتبها مع البادئة skill:، مثل ‎/skill:lagune-charter.
