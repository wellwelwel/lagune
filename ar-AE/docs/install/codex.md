# ثبّت Lagune على Codex CLI كإضافة

> ثبّت Lagune على Codex CLI كإضافة، وحافظ على تحديثه، وشغّل محركه داخل بيئة العزل.

Canonical: https://lagune.ai/ar-AE/docs/install/codex
اللغة: ar-AE
الأصل: https://lagune.ai/docs/install/codex
آخر تحديث: 2026-11-09

ثبّت الإضافة من الطرفية:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## التحديث

لتحديث **Lagune**، شغّل:

```bash
codex plugin marketplace upgrade lagune
```

## الأوامر

اكتب `$` ثم الأمر تحت اسم الإضافة، متبوعًا بمدخلك، مثل `$lagune:lagune-charter` بدلًا من `/lagune-charter`. وكتابة `$` تسرد الأوامر، واختيار أحدها يُدرج اسمه الكامل.

---

**بيئة العزل**

لا تملك بيئة العزل في **Codex** وصولًا إلى الشبكة. ثبّت المحرك في مشروعك من طرفيتك، مرة واحدة وبعد كل تحديث:

```bash
npm i -D lagune@0.18.1
```

## الأسئلة الشائعة

### كيف أثبّت Lagune على Codex CLI؟

شغّل codex plugin marketplace add wellwelwel/lagune، ثم codex plugin add lagune@lagune.

### كيف أحدّث Lagune على Codex CLI؟

شغّل codex plugin marketplace upgrade lagune.

### كيف أشغّل أوامر Lagune على Codex CLI؟

اكتب ‎$ ثم الأمر تحت اسم الإضافة، متبوعًا بمدخلك، مثل ‎$lagune:lagune-charter.

### هل يعمل Lagune داخل بيئة العزل في Codex؟

نعم، بعد أن تثبّت المحرك في مشروعك عبر npm i -D lagune@0.18.1 من طرفيتك، مرة واحدة وبعد كل تحديث.
