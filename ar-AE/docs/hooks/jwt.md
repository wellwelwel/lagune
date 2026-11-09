# hook jwt: اكتشف التحقق من JWT دون تثبيت الخوارزمية

> افحص قاعدة الكود بحثًا عن التحقق من JWT دون تثبيت الخوارزمية، أو قيّم استدعاءً واحدًا، من سطر الأوامر.

Canonical: https://lagune.ai/ar-AE/docs/hooks/jwt
اللغة: ar-AE
الأصل: https://lagune.ai/docs/hooks/jwt
آخر تحديث: 2026-11-09

ينبّه hook `jwt` إلى **التحقق من JWT دون تثبيت الخوارزمية**، وهي ثغرة الخلط بين الخوارزميات حيث يثق المتحقق في ترويسة `alg` الخاصة بالرمز نفسه، وإلى **التحقق المعطّل كليًا**. وهو **مدرك للغة البرمجة**، يقرأ كل ملف وفق مكتبة JWT الخاصة به، وهو المحرك الحتمي خلف [التخصص `federation`](https://lagune.ai/ar-AE/docs/catalog)، ويمكنك تشغيله بنفسك في وضع **scan** أو **check**.

## التشغيل

**افحص قاعدة الكود**

```bash
npx lagune read jwt                # scans the whole project
npx lagune read jwt --dir src      # scans a directory
npx lagune read jwt --file auth.ts # scans a single file
```

**تحقق من استدعاء**

```bash
npx lagune read jwt --lang javascript --pattern 'jwt.verify(token, secret)'                         # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, options={"verify_signature": False})' # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, algorithms=["HS256"])'                # => safe
```

كل سطر تحت **Unpinned JWT verification found** هو استدعاء تحقق لا يضع قائمة سماح `algorithms` (حيث تحتاج المكتبة إليها)، أو يقبل قائمة غير آمنة (`none`، أو خوارزمية غير متماثلة ممزوجة مع HMAC)، أو يعطّل فحص التوقيع تمامًا، فيثق في `alg` الخاص بالرمز نفسه. وهذا انكشاف مؤكد، لذلك ينتهي hook برمز خروج غير صفري. والتشغيل النظيف يطبع `no unpinned JWT verification found`.

## كيف تقرأ الحكم

| الحكم      | المعنى                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------- |
| `unpinned` | استدعاء تحقق دون قائمة سماح للخوارزميات (حيث تلزم)، أو بقائمة غير آمنة، أو مع تعطيل التحقق. |
| `safe`     | استدعاء تحقق يثبّت قائمة سماح سليمة للخوارزميات، أو تثبّتها مكتبته ضمنيًا.                  |
| `invalid`  | لا يحتوي المقتطف على استدعاء تحقق يمكن التعرف عليه للحكم عليه.                              |

### خيارات CLI

| الخيار      | القيمة    | الوصف                                                                                                 |
| ----------- | --------- | ----------------------------------------------------------------------------------------------------- |
| `--pattern` | مقتطف كود | تحقق من استدعاء واحد. كرّره للتحقق من عدة استدعاءات، بحكم في كل سطر.                                  |
| `--lang`    | لغة برمجة | مطلوب مع `--pattern`: واحدة من javascript و python و go و java و kotlin و php و ruby و rust و csharp. |
| `--dir`     | دليل      | يحصر الفحص في دليل. يتكرر ويُجمع مع `--file`.                                                         |
| `--file`    | ملف       | يحصر الفحص في ملف واحد. يتكرر ويُجمع مع `--dir`.                                                      |

دون أي خيار، يفحص المشروع كله. ويحتاج `--pattern` إلى `--lang` ولا يمكن جمعه مع `--dir` أو `--file`.

### اختر ما يفحصه

يستثني ما يتجاهله **Git**. ولاستثناء المزيد، أو لفحص ما يتجاهله **Git**، امنح `jwt` إعدادات خاصة به:

```bash
npx lagune write add --ignore test/fixtures --checker jwt
```

```json
{
  "checkers": {
    "jwt": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

تشرح صفحة [إعداد hooks](https://lagune.ai/ar-AE/docs/hooks/configure) كل إعداد.

### اللغات المدعومة

يقرأ الفحص هذه المكتبات، بحسب امتداد الملف. ولأن بعضها يثبّت الخوارزمية ضمنيًا (فغياب القائمة الصريحة سليم)، لا تنطبق قاعدة "لا قائمة سماح ⇒ unpinned" إلا حيث تتوقع المكتبة قائمة صريحة، لذلك لا يُنبَّه أبدًا إلى استدعاء مُعدّ بشكل صحيح.

| اللغة                       | المكتبة                 | هل ينبّه إلى غياب قائمة السماح على أنه unpinned؟                    | ينبّه دائمًا إلى                                  |
| --------------------------- | ----------------------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| **JavaScript / TypeScript** | jsonwebtoken, jose      | نعم                                                                 | `none`، ومزج خوارزمية غير متماثلة مع HMAC         |
| **Python**                  | PyJWT, python-jose      | نعم (تتطلبها PyJWT، وقيمة python-jose الافتراضية `algorithms=None`) | `none`، و `verify_signature: False`               |
| **Go**                      | golang-jwt              | نعم (دون `WithValidMethods`)                                        | `none`، و `ParseUnverified`                       |
| **Ruby**                    | ruby-jwt                | نعم                                                                 | `none`، و `verify = false`                        |
| **Java / Kotlin**           | jjwt, nimbus            | لا (مشتقة من المفتاح)                                               | `none`، ومحلل unsigned/`unsecured`                |
| **PHP**                     | firebase/php-jwt        | لا (يحمل `Key` الخوارزمية)                                          | `none`                                            |
| **Rust**                    | jsonwebtoken            | لا (يتطلب `Validation` واحدة)                                       | `none`، و `insecure_disable_signature_validation` |
| **C#**                      | Microsoft.IdentityModel | لا (معاملات متعددة الأسطر)                                          | `none`، و `RequireSignedTokens = false`           |

**نصيحة**

لا يحسم hook إلا تثبيت الخوارزمية: أما فحوص الادعاءات والمفاتيح والمسار، فهي أحكام يظل [التخصص `federation`](https://lagune.ai/ar-AE/docs/catalog) يغطيها.

## الأسئلة الشائعة

### ما هو الخلط بين خوارزميات JWT؟

المتحقق الذي يقرأ الخوارزمية من ترويسة الرمز يسمح للمهاجم باستبدال RS256 بـ HS256 والتوقيع بالمفتاح العام. ويمنع ذلك تثبيتُ قائمة سماح سليمة للخوارزميات في الكود، وينبّه hook jwt إلى استدعاء التحقق الذي لا يضع قائمة أو يضع قائمة غير آمنة.
