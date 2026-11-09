# ثبّت Lagune على Grok Build كإضافة

> ثبّت Lagune على Grok Build كإضافة، وحافظ على تحديثه، واسمح لمحركه مسبقًا.

Canonical: https://lagune.ai/ar-AE/docs/install/grok-build
اللغة: ar-AE
الأصل: https://lagune.ai/docs/install/grok-build
آخر تحديث: 2026-11-09

ثبّت الإضافة من الطرفية:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## التحديث

لتحديث **Lagune**، شغّل:

```bash
grok plugin update lagune
```

## الأوامر

اكتب الأوامر بأسمائها، مثل `/lagune-charter`، أو تحت اسم الإضافة، مثل `/lagune:lagune-charter`.

---

**الأذونات**

يعمل المحرك عبر أداتين: `lagune_read` تقرأ مشروعك فقط، و `lagune_write` تكتب في `.lagune/` فقط. وللسماح بهما مسبقًا، أضف هذه القواعد إلى `~/.grok/config.toml`:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

حين يعمل المحرك عبر **npx**، كما مع **skills.sh**، اسمح بـ `Bash(npx --yes lagune@*)`.

## الأسئلة الشائعة

### كيف أثبّت Lagune على Grok Build؟

شغّل grok plugin install wellwelwel/lagune@plugin-grok --trust.

### كيف أحدّث Lagune على Grok Build؟

شغّل grok plugin update lagune.

### كيف أشغّل أوامر Lagune على Grok Build؟

اكتبها بأسمائها، مثل ‎/lagune-charter، أو تحت اسم الإضافة، مثل ‎/lagune:lagune-charter.

### هل يمكن لـ Grok Build تشغيل Lagune دون طلب إذن؟

نعم. اسمح بـ MCPTool(lagune__lagune_read) و MCPTool(lagune__lagune_write) في إعدادات Grok Build، إضافة إلى Bash(npx --yes lagune@*) حين يعمل المحرك عبر npx.
