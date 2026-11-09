# ثبّت Lagune على Claude Code كإضافة

> ثبّت Lagune على Claude Code كإضافة، في الطرفية أو الامتداد أو تطبيق سطح المكتب، وحافظ على تحديثه، واسمح لمحركه مسبقًا.

Canonical: https://lagune.ai/ar-AE/docs/install/claude-code
اللغة: ar-AE
الأصل: https://lagune.ai/docs/install/claude-code
آخر تحديث: 2026-11-09

**الطرفية**

ثبّت الإضافة من الطرفية:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

أو من جلسة **Claude Code**:

```prompt
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**الامتداد**

- اكتب `/plugin` واختر **Manage plugins**.
- أضف `wellwelwel/lagune` في تبويب **Marketplaces**.
- ثبّت `lagune` في تبويب **Plugins**.

**سطح المكتب**

- ثبّت **Lagune** من الطرفية أو الامتداد، مع اختيار **Install for you** في الامتداد.
- ابدأ جلسة جديدة في تطبيق سطح المكتب، الذي يحمّل الإضافات التي تثبّتها لنفسك.

## التحديث

**الطرفية**

لتحديث **Lagune**، شغّل:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

لإبقائه محدّثًا، اختر **Enable auto-update** للسوق `lagune` تحت `/plugin`.

**الامتداد**

- اكتب `/plugin` واختر **Manage plugins**.
- افتح تبويب **Marketplaces**.
- اختر أيقونة التحديث على `lagune`.

**سطح المكتب**

- حدّث **Lagune** من الطرفية أو الامتداد.
- ابدأ جلسة جديدة في تطبيق سطح المكتب.

## الأوامر

اكتب الأوامر بأسمائها، مثل `/lagune-charter`، أو تحت اسم الإضافة، مثل `/lagune:lagune-charter`.

---

**الأذونات**

يعمل المحرك عبر أداتين: `lagune_read` تقرأ مشروعك فقط، و `lagune_write` تكتب في `.lagune/` فقط. وللسماح بهما مسبقًا، أضف هذه القواعد إلى `.claude/settings.json` لمشروع واحد، أو إلى `~/.claude/settings.json` لكل المشاريع:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

حين يعمل المحرك عبر **npx**، كما مع **skills.sh**، اسمح بـ `Bash(npx --yes lagune@*)`. ومع تفعيل بيئة العزل، أضف أيضًا `registry.npmjs.org` إلى `sandbox.network.allowedDomains`.

## الأسئلة الشائعة

### كيف أثبّت Lagune على Claude Code؟

شغّل claude plugin install lagune --marketplace wellwelwel/lagune. وفي الجلسة أو الامتداد، أضف السوق wellwelwel/lagune من مدير الإضافات وثبّت lagune. ويحمّله تطبيق سطح المكتب بعد أن تثبّته لنفسك في الطرفية أو الامتداد.

### كيف أحدّث Lagune على Claude Code؟

شغّل claude plugin marketplace update lagune، ثم claude plugin update lagune@lagune، أو اختر Enable auto-update للسوق lagune تحت ‎/plugin. وفي الامتداد، افتح Manage plugins من ‎/plugin واختر أيقونة التحديث على السوق lagune. ويحمّل تطبيق سطح المكتب التحديث في جلسته التالية.

### كيف أشغّل أوامر Lagune على Claude Code؟

اكتبها بأسمائها، مثل ‎/lagune-charter، أو تحت اسم الإضافة، مثل ‎/lagune:lagune-charter.

### هل يمكن لـ Claude Code تشغيل Lagune دون طلب إذن؟

نعم. اسمح بـ mcp__plugin_lagune_lagune__lagune_read و mcp__plugin_lagune_lagune__lagune_write في إعدادات Claude Code، إضافة إلى Bash(npx --yes lagune@*) حين يعمل المحرك عبر npx.
