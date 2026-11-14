# ثبّت Lagune على Muse Code كإضافة

> ثبّت Lagune على Muse Code كإضافة، وحافظ على تحديثه، وشغّل محركه داخل بيئة العزل.

Canonical: https://lagune.ai/ar-AE/docs/install/muse-code
اللغة: ar-AE
الأصل: https://lagune.ai/docs/install/muse-code
آخر تحديث: 2026-11-09

ثبّت الإضافة من الطرفية:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## التحديث

لتحديث **Lagune**، حدّث السوق وأعد تثبيت الإضافة:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## الأوامر

اكتب الأوامر بأسمائها، مثل `/lagune-charter`، أو تحت اسم الإضافة، مثل `/lagune:lagune-charter`.

---

**بيئة العزل**

لا تستطيع بيئة العزل في **Muse Code** تنزيل المحرك. ثبّته في مشروعك من طرفيتك، مرة واحدة وبعد كل تحديث:

```bash
npm i -D lagune@0.19.0
```

## الأسئلة الشائعة

### كيف أثبّت Lagune على Muse Code؟

شغّل muse plugins marketplace add lagune wellwelwel/lagune، ثم muse plugins install lagune@lagune.

### كيف أحدّث Lagune على Muse Code؟

شغّل muse plugins marketplace update lagune، ثم أعد التثبيت عبر muse plugins remove lagune و muse plugins install lagune@lagune.

### كيف أشغّل أوامر Lagune على Muse Code؟

اكتبها بأسمائها، مثل ‎/lagune-charter، أو تحت اسم الإضافة، مثل ‎/lagune:lagune-charter.

### هل يعمل Lagune داخل بيئة العزل في Muse Code؟

نعم، بعد أن تثبّت المحرك في مشروعك عبر npm i -D lagune@0.19.0 من طرفيتك، مرة واحدة وبعد كل تحديث.
