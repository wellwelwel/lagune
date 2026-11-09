# ثبّت Lagune على Factory Droid كإضافة

> ثبّت Lagune على Factory Droid كإضافة، وحافظ على تحديثه، واسمح بأدوات محركه.

Canonical: https://lagune.ai/ar-AE/docs/install/factory-droid
اللغة: ar-AE
الأصل: https://lagune.ai/docs/install/factory-droid
آخر تحديث: 2026-11-09

ثبّت الإضافة من الطرفية:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## التحديث

لتحديث **Lagune**، شغّل:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## الأوامر

اكتب الأوامر بأسمائها، مثل `/lagune-charter`.

## الأسئلة الشائعة

### كيف أثبّت Lagune على Factory Droid؟

شغّل droid plugin marketplace add wellwelwel/lagune، ثم droid plugin install lagune@lagune.

### كيف أحدّث Lagune على Factory Droid؟

شغّل droid plugin marketplace update lagune، ثم droid plugin update lagune@lagune.

### كيف أشغّل أوامر Lagune على Factory Droid؟

اكتبها بأسمائها، مثل /lagune-charter.

### هل يمكن لـ Factory Droid تشغيل Lagune دون طلب إذن؟

نعم. اختر السماح الدائم بـ lagune_read و lagune_write حين يسألك Factory Droid. ويسأل مجددًا بعد مزامنة commit جديد من السوق lagune.
