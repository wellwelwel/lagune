# ثبّت Lagune على Cursor كإضافة

> ثبّت Lagune على Cursor و Cursor CLI كإضافة، وحافظ على تحديثه، واسمح لمحركه مسبقًا.

Canonical: https://lagune.ai/ar-AE/docs/install/cursor
اللغة: ar-AE
الأصل: https://lagune.ai/docs/install/cursor
آخر تحديث: 2026-11-09

**Cursor**

- افتح **Customize**.
- اختر **From GitHub Repository** وأدخل `https://github.com/wellwelwel/lagune`.
- اختر **Install** على **Lagune** وحدد نطاق المشروع أو المستخدم.

**Cursor CLI**

- أضف السوق من الطرفية:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- اكتب `/plugins` في جلسة `agent`.
- ثبّت **Lagune**.

إن كان **Lagune** مثبّتًا بالفعل في **Claude Code**، يحمّله **Cursor CLI** من هناك.

## التحديث

**Cursor**

- افتح **Customize**.
- اختر **Refresh** على السوق `lagune`.

**Cursor CLI**

- استبدل السوق من الطرفية:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- اكتب `/plugins` في جلسة `agent`.
- ثبّت **Lagune** مجددًا.

## الأوامر

اكتب الأوامر بأسمائها، مثل `/lagune-charter`.

---

**الأذونات**

في **Cursor**، تشغّل الأوامر المحرك عبر **npx**، ويسمح به وضع Auto-review الافتراضي دون أن يسأل.

في **Cursor CLI**، يعمل المحرك عبر أداتين: `lagune_read` تقرأ مشروعك فقط، و `lagune_write` تكتب في `.lagune/` فقط. وللسماح بهما مسبقًا، أضف هذه القواعد إلى `.cursor/cli.json` لمشروع واحد، أو إلى `~/.cursor/cli-config.json` لكل المشاريع:

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

حين يعمل المحرك عبر **npx**، كما مع **skills.sh**، اسمح بـ `Shell(npx:--yes lagune@*)`.

## الأسئلة الشائعة

### كيف أثبّت Lagune على Cursor؟

في Cursor، افتح Customize، واختر From GitHub Repository، وأدخل https://github.com/wellwelwel/lagune ثم ثبّت Lagune. وفي Cursor CLI، شغّل agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor، ثم ثبّت Lagune من ‎/plugins.

### كيف أحدّث Lagune على Cursor؟

في Cursor، اختر Refresh على السوق lagune في Customize. وفي Cursor CLI، أزل السوق lagune، وأضفه مجددًا، ثم ثبّت Lagune مجددًا من ‎/plugins.

### كيف أشغّل أوامر Lagune على Cursor؟

اكتبها بأسمائها، مثل /lagune-charter.

### هل يمكن لـ Cursor تشغيل Lagune دون طلب إذن؟

نعم. يسمح به وضع Auto-review الافتراضي في Cursor بالفعل. وفي Cursor CLI، اسمح بـ Mcp(plugin-lagune-lagune:lagune_read) و Mcp(plugin-lagune-lagune:lagune_write)، إضافة إلى Shell(npx:--yes lagune@*) حين يعمل المحرك عبر npx.
