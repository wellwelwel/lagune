# hook crypto: اكتشف التشفير الضعيف

> افحص قاعدة الكود بحثًا عن عناصر التشفير الضعيفة، أو قيّم مقتطفًا واحدًا، من سطر الأوامر.

Canonical: https://lagune.ai/ar-AE/docs/hooks/crypto
اللغة: ar-AE
الأصل: https://lagune.ai/docs/hooks/crypto
آخر تحديث: 2026-11-09

ينبّه hook `crypto` إلى **عناصر التشفير الضعيفة** في موضع الاستدعاء: خوارزمية تشفير مُهملة، أو وضع غير آمن، أو دالة تجزئة مكسورة. وهو **مدرك للغة البرمجة**، يقرأ كل ملف بقواعده الخاصة فلا يُنبَّه أبدًا إلى بنية Python في ملف Rust، وهو المحرك الحتمي خلف [التخصص `crypto`](https://lagune.ai/ar-AE/docs/catalog)، ويمكنك تشغيله بنفسك في وضع **scan** أو **check**.

## التشغيل

**افحص قاعدة الكود**

```bash
npx lagune read crypto                # scans the whole project
npx lagune read crypto --dir src      # scans a directory
npx lagune read crypto --file hash.ts # scans a single file
```

**تحقق من مقتطف**

```bash
npx lagune read crypto --lang javascript --pattern 'createCipher("aes-256-cbc", k)' # => weak
npx lagune read crypto --lang python --pattern 'hashlib.md5(data)'                  # => review
npx lagune read crypto --lang go --pattern 'sha256.Sum256(data)'                    # => safe
```

يطبع الفحص قسمين على الأكثر. **Weak cryptography found** هو مجموعة الملاحظات (DES/3DES/RC4/Blowfish/RC2، ووضع ECB): كل منها عنصر تشفير مكسور، لذلك ينتهي hook برمز خروج غير صفري. و **Cryptography to review manually** مجموعة مؤشرات لا يستطيع الحكم عليها وحده: دالة تجزئة MD5/SHA-1 (مكسورة للاستخدام الأمني، لكنها مشروعة كمجموع اختباري عادي، فالنية هي التي تحسم)، أو مولّد أرقام عشوائية غير تشفيري في سياق أمني، أو مقارنة غير آمنة من حيث التوقيت. والتشغيل النظيف يطبع `no weak cryptography found`.

## كيف تقرأ الحكم

| الحكم     | المعنى                                                                                      |
| --------- | ------------------------------------------------------------------------------------------- |
| `weak`    | يستخدم المقتطف عنصر تشفير مكسورًا (DES/3DES، أو RC4، أو Blowfish، أو RC2، أو وضع ECB).      |
| `review`  | عنصر يعتمد على النية: دالة تجزئة MD5/SHA-1، أو مولّد أرقام عشوائية غير تشفيري في سياق أمني. |
| `safe`    | يستخدم المقتطف التشفير، ولم يُعثر على عنصر ضعيف.                                            |
| `invalid` | لا يحتوي المقتطف على بنية تشفير يمكن التعرف عليها للحكم عليها.                              |

### خيارات CLI

| الخيار      | القيمة    | الوصف                                                                                                           |
| ----------- | --------- | --------------------------------------------------------------------------------------------------------------- |
| `--pattern` | مقتطف كود | تحقق من مقتطف واحد. كرّره للتحقق من عدة مقتطفات، بحكم في كل سطر.                                                |
| `--lang`    | لغة برمجة | مطلوب مع `--pattern`: واحدة من javascript و python و go و java و kotlin و php و ruby و rust و csharp و c و cpp. |
| `--dir`     | دليل      | يحصر الفحص في دليل. يتكرر ويُجمع مع `--file`.                                                                   |
| `--file`    | ملف       | يحصر الفحص في ملف واحد. يتكرر ويُجمع مع `--dir`.                                                                |

دون أي خيار، يفحص المشروع كله. ويحتاج `--pattern` إلى `--lang` ولا يمكن جمعه مع `--dir` أو `--file`.

### اختر ما يفحصه

يستثني ما يتجاهله **Git**. ولاستثناء المزيد، أو لفحص ما يتجاهله **Git**، امنح `crypto` إعدادات خاصة به:

```bash
npx lagune write add --ignore test/fixtures --checker crypto
```

```json
{
  "checkers": {
    "crypto": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

تشرح صفحة [إعداد hooks](https://lagune.ai/ar-AE/docs/hooks/configure) كل إعداد.

### اللغات المدعومة

يقرأ الفحص هذه اللغات، بحسب امتداد الملف، ويُفحص كل منها مقابل واجهات التشفير البرمجية الخاصة به.

| اللغة                       | خوارزميات التشفير الضعيفة (ملاحظة) ودوال التجزئة و RNG (مراجعة)                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **JavaScript / TypeScript** | `createCipher`, `CryptoJS.DES/RC4`، و `*-ecb` بين علامتي اقتباس؛ MD5/SHA-1 `createHash`/`subtle.digest`; `Math.random()` |
| **Python**                  | pycryptodome `DES/ARC4/Blowfish.new`, `algorithms.TripleDES`, `MODE_ECB`; `hashlib.md5/sha1`; `random.*`                 |
| **Go**                      | `des.NewCipher`, `rc4.NewCipher`, `blowfish.NewCipher`, `NewECBEncrypter`; `md5/sha1.Sum`; `math/rand`                   |
| **Java / Kotlin**           | `Cipher.getInstance("DES"/…/ECB")`; `MessageDigest.getInstance("MD5")`, `HmacMD5`; `java.util.Random`                    |
| **PHP**                     | `openssl_encrypt("des-…"/"…-ecb")`, `mcrypt_*`; `md5()`/`sha1()`, `hash("md5", …)`; `rand()`/`mt_rand()`                 |
| **Ruby**                    | `OpenSSL::Cipher.new("des-…")`, `:ECB`; `Digest::MD5/SHA1`; `rand()`/`Random`                                            |
| **Rust**                    | `Rc4::`, `Blowfish::`, `des::`, `ecb::`; `Md5::`, `Sha1::`, `Hmac<Md5>`; `SmallRng`/`XorShiftRng`                        |
| **C#**                      | `DES/TripleDES/RC2.Create`, `CipherMode.ECB`; `MD5/SHA1.Create`, `HMACMD5`; `new Random()`                               |
| **C / C++**                 | OpenSSL `DES_*`/`RC4`/`EVP_des_*`, `EVP_*_ecb`; `MD5()`/`SHA1()`, `EVP_md5`; `rand()`/`random()`                         |

**أفضل جهد، لا تغطية شاملة**

يقرأ الكود المصدري كنص، لذلك قد يفلت منه عنصر يُجمَّع وقت التشغيل، أو يختبئ خلف اسم بديل، أو يُكتب بصيغة لا يتعرف عليها. تعامل مع الجدول كنقطة بداية قوية، لا كجرد كامل.

**نصيحة**

يضمن hook الحد الأدنى (وجود هذه البنى): أما إدارة المفاتيح، وإعادة استخدام IV، وحشو RSA، فهي أحكام يظل [التخصص `crypto`](https://lagune.ai/ar-AE/docs/catalog) يغطيها.

## الأسئلة الشائعة

### كيف أفحص قاعدة الكود بحثًا عن التشفير الضعيف؟

شغّل hook crypto دون أي خيار. خوارزميات التشفير المكسورة ووضع ECB ملاحظات تنتهي برمز خروج غير صفري. أما دالة التجزئة MD5/SHA-1 فمؤشر للمراجعة، لأنها مكسورة للاستخدام الأمني لكنها مشروعة كمجموع اختباري عادي.

### هل ينبّه hook crypto إلى Math.random()؟

فقط كمؤشر للمراجعة في سياق أمني، لا كملاحظة تلقائية أبدًا، لأن العشوائية مشروعة لإضافة تفاوت زمني أو لترتيب عناصر الواجهة.
