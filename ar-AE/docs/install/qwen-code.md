# ثبّت Lagune على Qwen Code كامتداد

> ثبّت Lagune على Qwen Code كامتداد، وحافظ على تحديثه، واسمح لمحركه مسبقًا.

Canonical: https://lagune.ai/ar-AE/docs/install/qwen-code
اللغة: ar-AE
الأصل: https://lagune.ai/docs/install/qwen-code
آخر تحديث: 2026-11-09

ثبّت الامتداد من الطرفية:

```bash
qwen extensions install lagune
```

## التحديث

لتحديث **Lagune**، شغّل:

```bash
qwen extensions update lagune
```

لإبقائه محدّثًا، ثبّته مع `--auto-update`.

## الأوامر

اكتب الأوامر تحت اسم الامتداد، مثل `/lagune:lagune-charter` بدلًا من `/lagune-charter`.

---

**الأذونات**

يعمل المحرك عبر أداتين: `lagune_read` تقرأ مشروعك فقط، و `lagune_write` تكتب في `.lagune/` فقط. وللسماح بهما مسبقًا، أضف هذه القواعد إلى `.qwen/settings.json` لمشروع واحد، أو إلى `~/.qwen/settings.json` لكل المشاريع:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

حين يعمل المحرك عبر **npx**، كما مع **skills.sh**، اسمح بـ `Shell(npx --yes lagune@*)`.

## الأسئلة الشائعة

### كيف أثبّت Lagune على Qwen Code؟

شغّل qwen extensions install lagune.

### كيف أحدّث Lagune على Qwen Code؟

شغّل qwen extensions update lagune، أو ثبّت الامتداد مع ‎--auto-update.

### كيف أشغّل أوامر Lagune على Qwen Code؟

اكتبها تحت اسم الامتداد، مثل ‎/lagune:lagune-charter.

### هل يمكن لـ Qwen Code تشغيل Lagune دون طلب إذن؟

نعم. اسمح بـ mcp__lagune__lagune_read و mcp__lagune__lagune_write في إعدادات Qwen Code، إضافة إلى Shell(npx --yes lagune@*) حين يعمل المحرك عبر npx.
