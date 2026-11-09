# ثبّت Lagune على OpenCode كإضافة

> ثبّت Lagune على OpenCode 1.x و 2.x كإضافة، وحافظ على تحديثه.

Canonical: https://lagune.ai/ar-AE/docs/install/opencode
اللغة: ar-AE
الأصل: https://lagune.ai/docs/install/opencode
آخر تحديث: 2026-11-09

**OpenCode 2.x**

ثبّت الإضافة من الطرفية:

```bash
opencode plugin add lagune
```

أو أضفها إلى القائمة `plugins` في `opencode.json`:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

ثبّت الإضافة في مشروعك من الطرفية، أو أضف `-g` لتثبيتها لكل مشاريعك:

```bash
opencode plugin lagune
```

أو أضفها إلى القائمة `plugin` في `opencode.json`:

```json
{
  "plugin": ["lagune"]
}
```

## التحديث

**OpenCode 2.x**

لتحديث **Lagune**، شغّل:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

لتحديث **Lagune**، ثبّت الإصدار الجديد فوق القديم، مع إضافة `-g` إن كنت ثبّته لكل مشاريعك:

```bash
opencode plugin lagune@0.18.1 --force
```

## الأوامر

**OpenCode 2.x**

اكتب `@` واختر الأمر، مثل `@lagune-charter`، ثم اكتب مدخلك في الرسالة نفسها.

**OpenCode 1.x**

اكتب الأوامر بأسمائها، مثل `/lagune-charter`. وهي مسرودة تحت `/skills`، لا في قائمة `/`.

## الأسئلة الشائعة

### كيف أثبّت Lagune على OpenCode؟

في OpenCode 2.x، شغّل opencode plugin add lagune. وفي OpenCode 1.x، شغّل opencode plugin lagune، مع إضافة ‎-g لتثبيته لكل مشاريعك.

### كيف أحدّث Lagune على OpenCode؟

في OpenCode 2.x، شغّل opencode plugin update lagune، ثم opencode reload. وفي OpenCode 1.x، شغّل opencode plugin lagune@0.18.1 --force.

### كيف أشغّل أوامر Lagune على OpenCode؟

في OpenCode 2.x، اكتب ‎@ واختر الأمر، مثل ‎@lagune-charter، ثم اكتب مدخلك في الرسالة نفسها. وفي OpenCode 1.x، اكتبها بأسمائها، مثل ‎/lagune-charter، أو ابحث عنها تحت ‎/skills.

### هل يطلب OpenCode إذنًا قبل تشغيل Lagune؟

لا. يشغّل OpenCode أداتي المحرك، lagune_read و lagune_write، دون أن يسأل.
