# hook agent: اكتشف حلقات الوكلاء غير المقيّدة

> افحص قاعدة الكود بحثًا عن استدعاءات الوكلاء و LLM التي لا حد لخطواتها أو وقتها، أو قيّم استدعاءً واحدًا، من سطر الأوامر.

Canonical: https://lagune.ai/ar-AE/docs/hooks/agent
اللغة: ar-AE
الأصل: https://lagune.ai/docs/hooks/agent
آخر تحديث: 2026-11-09

ينبّه hook `agent` إلى **بيئات تشغيل الوكلاء التي تدور في حلقات دون حد للأدوار أو الميزانية أو الوقت**، وهي ثغرة الاستقلالية المنفلتة التي تحوّل مدخلًا مُصاغًا عمدًا إلى تكلفة بلا حدود أو إلى تصعيد عبر prompt injection. وهو **مدرك للغة البرمجة**، ويغطي منظومتي أطر عمل الوكلاء: **JavaScript** (بيئة التشغيل `query` في agent SDK الخاصة بـ **Claude**) و **Python** (**LangChain** و **LangGraph** و **CrewAI** و **OpenAI Agents**). وهو المحرك الحتمي خلف [التخصص `llm`](https://lagune.ai/ar-AE/docs/catalog)، ويمكنك تشغيله بنفسك في وضع **scan** أو **check**.

## التشغيل

**افحص قاعدة الكود**

```bash
npx lagune read agent                # scans the whole project
npx lagune read agent --dir src/ai   # scans a directory
npx lagune read agent --file chat.ts # scans a single file
```

**تحقق من استدعاء**

```bash
npx lagune read agent --lang javascript --pattern 'query({ prompt })'                           # => uncapped
npx lagune read agent --lang javascript --pattern 'query({ prompt, options: { maxTurns: 5 } })' # => safe
npx lagune read agent --lang python --pattern 'AgentExecutor(agent=a, max_iterations=None)'     # => uncapped
```

كل سطر تحت **Uncapped agent loops found**، في ملف يستورد agent SDK، هو إما بيئة التشغيل `query` في agent SDK الخاصة بـ Claude مستدعاة دون حد للأدوار أو الميزانية أو الوقت (JavaScript، بلا حد افتراضيًا)، وإما إزالة صريحة للحد الافتراضي لإطار العمل مثل `max_iterations=None` / `max_turns=None` (Python، بحد افتراضيًا). وأي منهما ينتهي برمز خروج غير صفري. أما `generateText`/`streamText` في Vercel AI SDK فتعملان افتراضيًا بخطوة واحدة (`stopWhen: stepCountIs(1)`)، لذلك لا يمكن للاستدعاء المجرد هناك أن يدور في حلقة ولا يُنبَّه إليه، ولا يُخلط أبدًا بين `db.query(...)` العادي واستدعاء وكيل. والتشغيل النظيف يطبع `no uncapped agent loops found`.

## كيف تقرأ الحكم

| الحكم      | المعنى                                                                                |
| ---------- | ------------------------------------------------------------------------------------- |
| `uncapped` | استدعاء لبيئة التشغيل `query` دون حد (JS)، أو إزالة صريحة للحد (`=None`، Py).         |
| `safe`     | استدعاء `query` يضع حدًا، أو توليد بخطوة واحدة، أو استدعاء لإطار عمل محدود افتراضيًا. |
| `invalid`  | لا يحتوي المقتطف على استدعاء وكيل يمكن التعرف عليه للحكم عليه.                        |

### خيارات CLI

| الخيار      | القيمة    | الوصف                                                                |
| ----------- | --------- | -------------------------------------------------------------------- |
| `--pattern` | مقتطف كود | تحقق من استدعاء واحد. كرّره للتحقق من عدة استدعاءات، بحكم في كل سطر. |
| `--lang`    | لغة برمجة | مطلوب مع `--pattern`: `javascript` أو `python`.                      |
| `--dir`     | دليل      | يحصر الفحص في دليل. يتكرر ويُجمع مع `--file`.                        |
| `--file`    | ملف       | يحصر الفحص في ملف واحد. يتكرر ويُجمع مع `--dir`.                     |

دون أي خيار، يفحص المشروع كله. ويحتاج `--pattern` إلى `--lang` ولا يمكن جمعه مع `--dir` أو `--file`.

### اختر ما يفحصه

يستثني ما يتجاهله **Git**. ولاستثناء المزيد، أو لفحص ما يتجاهله **Git**، امنح `agent` إعدادات خاصة به:

```bash
npx lagune write add --ignore test/fixtures --checker agent
```

```json
{
  "checkers": {
    "agent": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

تشرح صفحة [إعداد hooks](https://lagune.ai/ar-AE/docs/hooks/configure) كل إعداد.

**أفضل جهد، لا تغطية شاملة**

حلقة الوكيل المكتوبة يدويًا، بأي لغة، تتجاوز قدرة الفحص الثابت. تعامل مع هذا كحد أدنى قوي، لا كجرد كامل.

**نصيحة**

لا يحسم hook إلا مسألة الحد: أما تحديد نطاق القدرات، وخلط مستويات الثقة، والتفويض، فهي أحكام يظل [التخصص `llm`](https://lagune.ai/ar-AE/docs/catalog) يغطيها.

## الأسئلة الشائعة

### لماذا يجب تقييد حلقة الوكيل؟

يمكن دفع الوكيل غير المقيّد إلى تكرار بلا حدود، أو تكلفة بلا حدود، أو تصعيد عبر prompt injection. وضبط maxTurns/maxBudgetUsd/stopWhen/signal يقيّده، وينبّه hook agent إلى استدعاء بيئة التشغيل query الذي لا يضبط أيًا منها.
