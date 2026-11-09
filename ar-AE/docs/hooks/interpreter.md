# hook interpreter: نبّه إلى نقاط sink لتنفيذ الكود الديناميكي

> افحص قاعدة الكود بحثًا عن نقاط sink لتنفيذ الكود الديناميكي في لغات مختلفة، أو قيّم مقتطفًا واحدًا، من سطر الأوامر.

Canonical: https://lagune.ai/ar-AE/docs/hooks/interpreter
اللغة: ar-AE
الأصل: https://lagune.ai/docs/hooks/interpreter
آخر تحديث: 2026-11-09

ينبّه hook `interpreter` إلى **نقاط sink لتنفيذ الكود الديناميكي**: بنى تحوّل البيانات إلى كود يعمل أو تسلّمها إلى صدفة، من `eval` إلى إلغاء التسلسل الأصلي. وهو مدرك للغة البرمجة، يقرأ كل ملف بقواعده الخاصة، وهو المحرك الحتمي خلف [التخصص `interpreter`](https://lagune.ai/ar-AE/docs/catalog)، ويمكنك تشغيله بنفسك في وضع **scan** أو **check**.

## التشغيل

**افحص قاعدة الكود**

```bash
npx lagune read interpreter               # scans the whole project
npx lagune read interpreter --dir src     # scans a directory
npx lagune read interpreter --file app.py # scans a single file
```

**تحقق من مقتطف**

```bash
npx lagune read interpreter --lang javascript --pattern 'eval(x)'   # => careful
npx lagune read interpreter --lang python --pattern 'json.loads(x)' # => safe
```

هذه النقاط مزدوجة الاستخدام: لا يستطيع الفحص الثابت الحسم في ما إذا كان مدخل يتأثر به المهاجم يصل إلى إحداها، لذلك كل تطابق **تنبيه للمراجعة**، لا ملاحظة مؤكدة أبدًا. ويطبع الفحص قسمًا واحدًا هو **Dynamic-execution sinks to review**، مجمّعًا حسب الملف. والتشغيل النظيف يطبع `no dynamic-execution sinks found`.

**اقرأ الكود المُنبَّه إليه، ولا تشغّله أبدًا!**

حلّل كل نقطة sink **بشكل ثابت**، بتتبّع ما إذا كان مدخل غير موثوق يصل إليها. ولا تنفّذ أبدًا الكود المُنبَّه إليه أو تمرّره إلى `eval`، ولا أي كود بعيد أو يُجلب وقت التشغيل يستدعيه، بهدف "اختبار" ما يفعله.

## كيف تقرأ الحكم

| الحكم     | المعنى                                                                                     |
| --------- | ------------------------------------------------------------------------------------------ |
| `careful` | يحتوي المقتطف على نقطة sink للتنفيذ الديناميكي في لغته. راجعه بالقراءة، لا بالتشغيل أبدًا. |
| `safe`    | لم يُعثر على نقطة sink للتنفيذ الديناميكي في اللغة المحددة.                                |

### خيارات CLI

| الخيار      | القيمة    | الوصف                                                                                                           |
| ----------- | --------- | --------------------------------------------------------------------------------------------------------------- |
| `--pattern` | مقتطف كود | تحقق من مقتطف واحد. كرّره للتحقق من عدة مقتطفات، بحكم في كل سطر.                                                |
| `--lang`    | لغة برمجة | مطلوب مع `--pattern`: واحدة من javascript و python و php و ruby و java و kotlin و go و rust و c و cpp و csharp. |
| `--dir`     | دليل      | يحصر الفحص في دليل. يتكرر ويُجمع مع `--file`.                                                                   |
| `--file`    | ملف       | يحصر الفحص في ملف واحد. يتكرر ويُجمع مع `--dir`.                                                                |

دون أي خيار، يفحص المشروع كله. ويحتاج `--pattern` إلى `--lang` ولا يمكن جمعه مع `--dir` أو `--file`.

### اختر ما يفحصه

يستثني ما يتجاهله **Git**. ولاستثناء المزيد، أو لفحص ما يتجاهله **Git**، امنح `interpreter` إعدادات خاصة به:

```bash
npx lagune write add --ignore test/fixtures --checker interpreter
```

```json
{
  "checkers": {
    "interpreter": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

تشرح صفحة [إعداد hooks](https://lagune.ai/ar-AE/docs/hooks/configure) كل إعداد.

### اللغات المدعومة

يقرأ الفحص هذه اللغات، بحسب امتداد الملف، ويُفحص كل منها مقابل مجموعة نقاط sink للتنفيذ الديناميكي الخاصة به.

| #   | اللغة                       | الامتدادات                                                                                                   | نقاط sink التي ينبّه إليها                                                                                                                                                                                                         |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` | `eval()`، والمُنشئ Function، و `setTimeout`/`setInterval` بجسم نصي، والوحدة `vm`، والتنفيذ عبر `child_process`، و `require()` الديناميكي، و `import()` الديناميكي                                                                  |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                | `eval`/`exec`، و `__import__()`، و `os.system`/`os.popen`، و `subprocess` مع `shell=True`، و `pickle.load`/`loads`، و `yaml.load` (غير الآمن)                                                                                      |
| 3   | **Ruby**                    | `.rb`                                                                                                        | عائلة eval (`instance_eval`/`class_eval`/`module_eval`/`eval`)، و `system`/`exec`، و backticks أو `%x`، و `Kernel#open` / `IO.popen`/`read`/`binread` / `Open3`، و `Process.spawn`، و `Marshal.load`                               |
| 4   | **Go**                      | `.go`                                                                                                        | `exec.Command`/`exec.CommandContext`، و `plugin.Open`                                                                                                                                                                              |
| 5   | **PHP**                     | `.php`                                                                                                       | `eval()`، و `assert()` على نص، و `create_function()`، والتنفيذ في الصدفة (`system`/`exec`/`shell_exec`/`passthru`/`popen`/`proc_open`)، و `call_user_func`/`call_user_func_array`، و `include`/`require` بمسار يُحدَّد وقت التشغيل |
| 6   | **Rust**                    | `.rs`                                                                                                        | `Command::new`، و `process::Command`                                                                                                                                                                                               |
| 7   | **Java**                    | `.java`                                                                                                      | `Runtime.exec`، و `ProcessBuilder`، و `ScriptEngine`، و `ObjectInputStream.readObject`                                                                                                                                             |
| 8   | **Kotlin**                  | `.kt`, `.kts`                                                                                                | نقاط sink في JVM: `Runtime.exec`، و `ProcessBuilder`، و `ScriptEngine`، و `ObjectInputStream.readObject`                                                                                                                           |
| 9   | **C#**                      | `.cs`                                                                                                        | `Process.Start` / `new Process`، و `BinaryFormatter`، و `Assembly.Load`                                                                                                                                                            |
| 10  | **C**                       | `.c`, `.h`                                                                                                   | `system()`، و `popen()`، وعائلة `exec*` (`execl`، و `execve`، و `execvp`، …)                                                                                                                                                       |
| 11  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 | `system()`، و `popen()`، وعائلة `exec*` (`execl`، و `execve`، و `execvp`، …)                                                                                                                                                       |

**أفضل جهد، لا تغطية شاملة**

يقرأ الكود المصدري كنص، لذلك قد تفلت منه نقطة sink تُجمَّع وقت التشغيل، أو تختبئ خلف اسم بديل، أو تُكتب بصيغة لا يتعرف عليها. تعامل مع الجدول كنقطة بداية قوية، لا كجرد كامل.

**نصيحة**

يضمن hook الحد الأدنى (وجود هذه النقاط ومواضعها): أما ما إذا كانت قيمة غير موثوقة تصل إلى إحداها فعلًا، فهو الحكم الذي يغطيه [التخصص `interpreter`](https://lagune.ai/ar-AE/docs/catalog).

## الأسئلة الشائعة

### هل يؤكد hook interpreter وجود ثغرة؟

لا. ينبّه إلى نقاط sink للتنفيذ الديناميكي كتنبيه للمراجعة، لا كملاحظة مؤكدة أبدًا، لأن الفحص الثابت لا يستطيع الحسم في ما إذا كان مدخل يتأثر به المهاجم يصل إلى نقطة sink.

### ما اللغات التي يغطيها hook interpreter؟

يقرأ اللغات الواردة في جدول اللغات المدعومة، بحسب امتداد الملف، ويُفحص كل منها مقابل مجموعة نقاط sink الخاصة به. ولا تنتج اللغات الأخرى أي نقاط sink.
