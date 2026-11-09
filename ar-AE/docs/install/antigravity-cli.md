# ثبّت Lagune على Antigravity CLI كإضافة

> ثبّت Lagune على Antigravity CLI كإضافة، وحافظ على تحديثه، واسمح لمحركه مسبقًا.

Canonical: https://lagune.ai/ar-AE/docs/install/antigravity-cli
اللغة: ar-AE
الأصل: https://lagune.ai/docs/install/antigravity-cli
آخر تحديث: 2026-11-09

ثبّت الإضافة من الطرفية:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## التحديث

لتحديث **Lagune**، ثبّته مجددًا:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## الأوامر

اكتب الأوامر تحت اسم الإضافة، مثل `/lagune:lagune-charter` بدلًا من `/lagune-charter`.

---

**الأذونات**

يعمل المحرك عبر أداتين: `lagune_read` تقرأ مشروعك فقط، و `lagune_write` تكتب في `.lagune/` فقط. والأمر المُرسل كأول رسالة في الجلسة يعمل قبل تحميلهما، لذلك يستخدم **npx** بدلًا منهما. وللسماح بالأداتين و **npx** مسبقًا، أضف هذه القواعد إلى `~/.gemini/antigravity-cli/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## الأسئلة الشائعة

### كيف أثبّت Lagune على Antigravity CLI؟

شغّل agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity .

### كيف أحدّث Lagune على Antigravity CLI؟

شغّل agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity مجددًا.

### كيف أشغّل أوامر Lagune على Antigravity CLI؟

اكتبها تحت اسم الإضافة، مثل ‎/lagune:lagune-charter.

### هل يمكن لـ Antigravity CLI تشغيل Lagune دون طلب إذن؟

نعم. اسمح بـ mcp(lagune_lagune/lagune_read) و mcp(lagune_lagune/lagune_write) و command(regex:npx --yes lagune@[0-9.]+) في إعدادات Antigravity CLI. وتغطي قاعدة npx الأمر المُرسل كأول رسالة في الجلسة.
