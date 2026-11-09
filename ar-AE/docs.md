# التثبيت: التحصين الأمني لأي وكيل ذكاء اصطناعي

> ثبّت Lagune في أي مشروع، كإضافة حين يدعمها وكيلك أو عبر skills CLI في غيره، ثم اختر تخصصات الأمان المناسبة له.

Canonical: https://lagune.ai/ar-AE/docs
اللغة: ar-AE
الأصل: https://lagune.ai/docs
آخر تحديث: 2026-11-09

يساعد **Lagune** وكيل الذكاء الاصطناعي على جعل المشروع أكثر أمانًا. توجّهه إلى الكود، فيكتشف الوكيل ما يفعله نظامك فعلًا، ثم يرشدك خلال العمل الأمني المهم له. و **Lagune** أول مشروع في منهجية [Security-Driven Hardening (SDH)](https://lagune.ai/ar-AE/docs/references/paper).

**ادعم المشروع المفتوح المصدر**

هل أعجبك **Lagune**؟ [امنحنا ⭐ على **GitHub**](https://github.com/wellwelwel/lagune)

## اختر وكيلك

- [Claude Code](https://lagune.ai/ar-AE/docs/install/claude-code): أداة البرمجة بالوكلاء من Anthropic
- [Codex](https://lagune.ai/ar-AE/docs/install/codex): وكيل البرمجة من OpenAI
- [Cursor](https://lagune.ai/ar-AE/docs/install/cursor): محرر الكود بالذكاء الاصطناعي
- [GitHub Copilot](https://lagune.ai/ar-AE/docs/install/github-copilot-cli): شريك البرمجة بالذكاء الاصطناعي من GitHub
- [Gemini CLI](https://lagune.ai/ar-AE/docs/install/gemini-cli): وكيل الطرفية المفتوح المصدر من Google
- [Antigravity](https://lagune.ai/ar-AE/docs/install/antigravity-cli): منصة Google للتطوير بالوكلاء
- [OpenCode](https://lagune.ai/ar-AE/docs/install/opencode): وكيل البرمجة المفتوح المصدر
- [Devin for Terminal](https://lagune.ai/ar-AE/docs/install/devin-cli): وكيل الطرفية من Cognition
- [Factory Droid](https://lagune.ai/ar-AE/docs/install/factory-droid): وكيل تطوير البرمجيات من Factory
- [Grok Build](https://lagune.ai/ar-AE/docs/install/grok-build): وكيل البرمجة من xAI
- [Qwen Code](https://lagune.ai/ar-AE/docs/install/qwen-code): وكيل الطرفية للبرمجة من Qwen
- [Kimi Code](https://lagune.ai/ar-AE/docs/install/kimi-code): وكيل البرمجة من Moonshot AI
- [Muse Code](https://lagune.ai/ar-AE/docs/install/muse-code): وكيل البرمجة من Meta
- [Pi](https://lagune.ai/ar-AE/docs/install/pi): وكيل برمجة بسيط للطرفية
- [Hermes Agent](https://lagune.ai/ar-AE/docs/install/hermes-agent): الوكيل المفتوح المصدر من Nous Research
- [Universal](https://lagune.ai/ar-AE/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed و 66 وكيلًا آخر

**معلومة**

- يعمل **Lagune** على **Node.js** في الخلفية، لكنك تستخدم أي لغة برمجة تريدها.
- للعمل دون اتصال بالإنترنت تمامًا، ثبّت **Lagune** في مشروعك عبر `npm i -D lagune@0.18.1`.

## الفئات

تأتي المعرفة الأمنية في **Lagune** على شكل [**تخصصات**](https://lagune.ai/ar-AE/docs/catalog)، مجمّعة في [**فئات**](https://lagune.ai/ar-AE/docs/categories).

- **OWASP** (`owasp`): حصّن ضد مخاطر أمان التطبيقات التي يتتبعها OWASP: الحقن، وخلل التحكم في الوصول، والمصادقة، وإخفاقات التشفير
- **البنية التحتية** (`infra`): حصّن إعدادات الحاويات وأحمال العمل والحوسبة بلا خادم: Dockerfile و Compose وأمان Pod وصلاحيات IAM ومشغّلات FaaS
- **AI / LLM** (`ai`): حصّن تكاملات الذكاء الاصطناعي و LLM ضد prompt injection وضد الربط غير الآمن للأدوات والوكلاء والاسترجاع و MCP
- **Lovable** (`lovable`): حصّن تطبيقات Supabase المولّدة بالذكاء الاصطناعي (Lovable وما يشبهها): ثغرات RLS، ومفاتيح service_role المسرّبة، والإعدادات الافتراضية غير الآمنة
- **JavaScript** (`javascript`): حصّن JavaScript وبيئات تشغيلها ضد تنفيذ الكود عن بُعد عبر eval و child_process، و path traversal، و prototype pollution
- **Python** (`python`): حصّن Python ضد تنفيذ الكود عن بُعد عبر إلغاء تسلسل pickle و YAML، والتنقل عبر سلاسل str.format، و class pollution
- **Rust** (`rust`): حصّن Rust ضد واجهات unsafe غير السليمة، وسوء استخدام transmute، وتجاوز سعة الأعداد الصحيحة، والسلوك غير المعرّف عند حدود FFI
- **Java** (`java`): حصّن Java ضد سلاسل gadget في إلغاء تسلسل ObjectInputStream التي تنتهي بتنفيذ الكود عن بُعد
- **Ruby** (`ruby`): حصّن Ruby ضد سلاسل gadget في إلغاء تسلسل Marshal.load و YAML التي تصل إلى تنفيذ الكود عن بُعد
- **PHP** (`php`): حصّن PHP ضد تجاوز المصادقة عبر type juggling، وسلاسل gadget في حقن الكائنات، والإعدادات الافتراضية غير الآمنة
- **Go** (`go`): حصّن Go ضد أخطاء الواجهات ذات قيمة nil المحددة النوع، و data races بين goroutines، والتزامن غير الآمن في المسارات الأمنية
- **C / C++** (`c-cpp`): حصّن C و C++ ضد أخطاء سلاسل التنسيق وتجاوز سعة المخزن المؤقت والكتابة خارج الحدود التي تتيح تنفيذ الكود
- **.NET** (`dotnet`): حصّن .NET و C# ضد تنفيذ الكود عن بُعد عبر إلغاء تسلسل BinaryFormatter وضد تجاوزات الترميز التي تصل إلى XSS

شغّل `npx lagune write add --categories` مع مفاتيح الفئات التي تختارها.

**نصيحة**

يبدأ المشروع بالفئة `owasp`، ثم يضيف الأمر [`/lagune-charter`](https://lagune.ai/ar-AE/docs/commands/charter) الفئات التي تدعمها قراءته للمشروع.

## المتطلبات

ستحتاج إلى تثبيت [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) على نظامك.

## استخدم شارة ✨

هل تستخدم **Lagune**؟ أضف شارة إلى ملف **README**:

**لونان**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**لون واحد**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## التالي

اطّلع على ما تفعله كل [**مهارة**](https://lagune.ai/ar-AE/docs/get-started/commands) من مهارات **Lagune**.

## الأسئلة الشائعة

### ما هو Lagune؟

Lagune سير عمل أمني مفتوح المصدر، للدفاع فقط، يساعد وكيل الذكاء الاصطناعي على تحصين أي قاعدة كود. توجّهه إلى الكود، فيرصد ما يفعله نظامك فعلًا، ثم يوجّه إصلاحات الأمان المهمة في هذا السياق.

### كيف أثبّت Lagune؟

اختر وكيلك: يثبّت Claude Code و GitHub Copilot CLI و Muse Code و Antigravity CLI و Cursor و Kimi Code و OpenCode و Codex CLI و Factory Droid و Grok Build و Devin CLI و Hermes Agent أداة Lagune كإضافة، ويثبّته Gemini CLI و Qwen Code كامتداد، و Pi كحزمة، وأي وكيل آخر عبر npx skills add wellwelwel/lagune. يعمل مع المشاريع الجديدة والقائمة.

### هل يحتاج Lagune إلى مفتاح API؟

لا. يعمل عبر وكيل الذكاء الاصطناعي الخاص بك، لذلك لا يحتاج إلى أي مفتاح API.

### ما هي المتطلبات؟

تحتاج إلى تثبيت Node.js (LTS) على نظامك.

### ما لغات البرمجة التي يدعمها Lagune؟

أي لغة. يعمل Lagune على Node.js في الخلفية، لكنه يدقّق المشاريع المكتوبة بأي لغة برمجة ويحصّنها.

### ماذا يضيف Lagune إلى مشروعي؟

مجلد ‎.lagune/‎ يحفظ الحالة الأمنية لمشروعك، ينشئه أول أمر يكتب فيه. ويثبّت skills CLI أيضًا أوامر slash داخل المشروع، حيث يقرؤها وكيلك، بينما تُبقيها الإضافة داخل الوكيل.

### كيف أحدّث Lagune؟

بالطريقة نفسها التي ثبّته بها. تعرض صفحة التثبيت الخاصة بكل وكيل طريقة تحديث Lagune فيه، ويحدّثه skills CLI عبر npx skills update. ويبقى ميثاق الأمان ومُخرَجات المراحل وتخصصاتك الخاصة كما هي.

### ما التخصصات التي يستخدمها المشروع؟

التخصصات المدمجة في فئاته، إضافة إلى تخصصاته الخاصة. يسجّل ميثاق الأمان الفئات التي تدعمها قراءته للمشروع، ويغيّرها الأمر npx lagune write add --categories.

### هل يجب أن أنتهي من البناء قبل تأمين مشروعي؟

لا. يحصّن الأمر ‎/lagune العمل أثناء كتابته: يأخذ أي موجّه، ويبني ما طلبته، ويحصّنه بإعدادات افتراضية آمنة، مسترشدًا بميثاق الأمان. أما مسار الفريق الأزرق ذو المراحل الخمس فيدقّق ما هو موجود بالفعل.

### هل يمكن لـ Lagune تدقيق مشروع قائم؟

نعم. يدقّق مسار الفريق الأزرق ذو المراحل الخمس ما هو موجود بالفعل: تضع مرحلة charter قواعد الأمان الخاصة بك، وترصد مرحلة detect ما يفعله النظام وأين تكمن المخاطر، وتقيّم مرحلة plan كل ملاحظة وتقرنها بإصلاح، وتطبّق مرحلة harden الإصلاحات، وتُثبت مرحلة verify أنها تصمد ثم تغلقها.

### ما الفرق بين استخدام Lagune ومجرد مطالبة الوكيل برصد الثغرات والعيوب الأمنية؟

الوكيل الذي يقرأ الكود وحده يجد ما يبدو ثغرة ويتجاوز ما يبدو ضابطًا أمنيًا. قائمة العناوين المحظورة توحي بأن أحدًا تعامل مع الخطر بالفعل، فلا يتحقق أحد من أنها تُفلت معظمها، ويُشحن الكود. يقلب Lagune هذا الافتراض: الحماية الموجودة في الكود تُعدّ غير مُثبتة حتى تُفحص، وكل تخصص في الكتالوج يحصل على حكم صريح، وتسأل مرحلة verify هل زال الخطر، لا هل يوجد ضابط. وتبقى كل ملاحظة عنصرًا متتبَّعًا واحدًا عبر مرات التشغيل، فيمكن إثبات إغلاقها وإخراجها من السلسلة، بينما يمنحك الطلب العادي تقريرًا مختلفًا في كل مرة دون شيء تقارنه به.

### ما الفرق بين التطوير باستخدام Lagune ومجرد مطالبة الوكيل بكتابة كود آمن؟

طلب كود آمن يترك تعريف الأمان للوكيل، ويفترض أنك تعرف ما يجب أن تطلبه. وغالبًا ما يكون المتطلب موجودًا في طلبك دون أن يلاحظه أي منكما: طلب صفحة تعرض الدورات التي يملك المستخدم صلاحية الوصول إليها ينص على قاعدة تفويض، والفحص الذي لا يُكتب أبدًا لا يترك في الكود شيئًا يُلفت الانتباه. يحمّل الأمر ‎/lagune ميثاق الأمان والتخصصات المطابقة لما سيُبنى قبل كتابة السطر الأول، ثم يعيد قراءة النتيجة مقابل الدفاع الذي استخدمه. نادرًا ما يكلّف الشكل الآمن أكثر من غير الآمن، فما يحسم النتيجة هو معرفة أيهما تختار، وهذا ما يصل مسبقًا.

### هل يشغّل Lagune اختبار DAST (Dynamic Application Security Testing) أو يختبر تطبيقي أثناء تشغيله؟

لا. يقرأ Lagune الكود ولا يشغّل نظامك أبدًا ولا يرسل إليه طلبات مُصاغة عمدًا. تؤكد مرحلة verify أن الضابط موجود وصحيح في الكود المصدري، وهذا سؤال مختلف عن صموده أمام هجوم على نظام يعمل، لذلك فإن "cannot tell from the code" حكم مشروع وليس نجاحًا صامتًا. يجيب DAST عن سؤال وقت التشغيل ويجيب Lagune عن سؤال الكود المصدري، فلا يغني أحدهما عن الآخر. وحتى الأمر الاختياري prove يلتزم بهذا الحد: اختباراته تتحقق من السلوك الآمن، ولا تستخدم payload هجوميًا أبدًا.

### هل يغني Lagune عن Pentest (اختبار الاختراق)؟

لا، بالتأكيد لا! اختبار الاختراق مهمة مصرّح بها يمارس فيها محترف تقديره على نظامك الحي، فيربط الملاحظات ببعضها ويختبر منطق الأعمال الذي لا تصفه أي قاعدة خاصة بسطح بعينه. ويمكن أن تدخل ملاحظات اختبار الاختراق مسار الفريق الأزرق في Lagune كمصادر قلق تسلّمها لمرحلة detect، فيُخطَّط لما يبلّغ عنه المحترف ويُحصَّن ويُتحقق منه.

## سياسة الأمان

اطّلع على [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md).

## الترخيص

يُتاح **Lagune** بموجب [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE).

حقوق النشر © 2026 حتى الآن، [Weslley Araújo](https://github.com/wellwelwel) و [المساهمون](https://github.com/wellwelwel/lagune/graphs/contributors).
