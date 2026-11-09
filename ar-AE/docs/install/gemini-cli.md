# ثبّت Lagune على Gemini CLI كامتداد

> ثبّت Lagune على Gemini CLI كامتداد، وحافظ على تحديثه، واسمح لمحركه مسبقًا.

Canonical: https://lagune.ai/ar-AE/docs/install/gemini-cli
اللغة: ar-AE
الأصل: https://lagune.ai/docs/install/gemini-cli
آخر تحديث: 2026-11-09

ثبّت الامتداد من الطرفية:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## التحديث

لتحديث **Lagune**، شغّل:

```bash
gemini extensions update lagune
```

لإبقائه محدّثًا، ثبّته مع `--auto-update`.

## الأوامر

اكتب الأوامر تحت اسم الامتداد، مثل `/lagune:lagune-charter` بدلًا من `/lagune-charter`.

---

**الأذونات**

يعمل المحرك عبر أداتين: `lagune_read` تقرأ مشروعك فقط، و `lagune_write` تكتب في `.lagune/` فقط. ولا يشغّلهما **Gemini CLI** إلا في مجلد موثوق. وللسماح بهما مسبقًا، احفظ هذه القاعدة باسم `~/.gemini/policies/lagune.toml`:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

حين يعمل المحرك عبر **npx**، كما مع **skills.sh**، أضف هذه القاعدة إلى الملف نفسه:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## الأسئلة الشائعة

### كيف أثبّت Lagune على Gemini CLI؟

شغّل gemini extensions install https://github.com/wellwelwel/lagune .

### كيف أحدّث Lagune على Gemini CLI؟

شغّل gemini extensions update lagune، أو ثبّت الامتداد مع ‎--auto-update.

### كيف أشغّل أوامر Lagune على Gemini CLI؟

اكتبها تحت اسم الامتداد، مثل ‎/lagune:lagune-charter.

### هل يمكن لـ Gemini CLI تشغيل Lagune دون طلب إذن؟

نعم. أضف قاعدة سياسة تسمح بالأداتين lagune_read و lagune_write في الخادم lagune، إضافة إلى قاعدة لـ run_shell_command مع npx --yes lagune@ ورقم إصدار حين يعمل المحرك عبر npx.
