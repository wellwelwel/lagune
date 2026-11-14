# التدقيق المجدول: شغّل Lagune وفق جدول متكرر

> جدول تدقيقًا متكررًا عبر Lagune في GitHub Actions بمفتاحك الخاص، أو في Claude Code أو Codex أو Cursor أو Antigravity أو OpenCode، ليبلّغ عن المخاطر الجديدة أو يشغّل مسار الفريق الأزرق كاملًا.

Canonical: https://lagune.ai/ar-AE/docs/examples/scheduled-audits
اللغة: ar-AE
الأصل: https://lagune.ai/docs/examples/scheduled-audits
آخر تحديث: 2026-11-09

جدول **Lagune** ليدقّق مشروعك تلقائيًا، فإما أن يبلّغ عمّا يجده أو يشغّل مسار الفريق الأزرق كاملًا.

## الجدولة

**Universal**

يشغّل **GitHub Actions** التدقيق في السحابة عبر [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/). ويستدعي محركه **Copilot CLI** مزوّد النماذج الذي تختاره بمفتاحك الخاص، لذا لا يحتاج إلى أي اشتراك في وكيل:

- ثبّت الامتداد عبر `gh extension install github/gh-aw`.
- خزّن مفتاح المزوّد كسرّ في المستودع عبر `gh secret set PROVIDER_API_KEY`.
- احفظ سير العمل هذا باسم `.github/workflows/lagune-audit.md`، مع استبدال `<model>` بأحد نماذج مزوّدك التي تدعم استدعاء الأدوات، و `<your-prompt>` بأحد [أمثلة الموجّهات](#prompt-examples):

  ```md
  ---
  on:
    schedule:
      - cron: '0 9 * * 1'
  permissions:
    contents: read
  engine:
    id: copilot
    model: <model>
    env:
      COPILOT_PROVIDER_TYPE: <type>
      COPILOT_PROVIDER_BASE_URL: <url>
      COPILOT_PROVIDER_API_KEY: ${{ secrets.PROVIDER_API_KEY }}
  skills:
    - wellwelwel/lagune@v0.19.0
  network:
    allowed:
      - defaults
      - node
  tools:
    edit:
    bash: [npx]
  safe-outputs:
    create-pull-request:
  ---

  <your-prompt>

  ثم افتح pull request بتغييراتك.
  ```

  | المزوّد                                                | `<type>`    | `<url>`                                             |
  | ------------------------------------------------------ | ----------- | --------------------------------------------------- |
  | **OpenAI**                                             | `openai`    | `https://api.openai.com/v1`                         |
  | **Anthropic**                                          | `anthropic` | `https://api.anthropic.com`                         |
  | أي واجهة API متوافقة مع **OpenAI**، مثل **OpenRouter** | `openai`    | عنوانها الأساسي، مثل `https://openrouter.ai/api/v1` |

- شغّل `gh aw compile`، ثم أجرِ commit لسير العمل مع ملف `.lock.yml` الذي يولّده.

**في السحابة**، يعمل التدقيق حتى وجهازك مطفأ:

- ثبّت **Lagune** عبر [التثبيت الشامل](https://lagune.ai/ar-AE/docs/install/universal) بدلًا من الإضافة، وأجرِ commit له في المستودع.
- اكتب `/schedule` في جلسة **Claude Code** وصِف التدقيق، أو أنشئه من [claude.ai/code/routines](https://claude.ai/code/routines).

**على جهازك**، يستخدم التدقيق الإضافة التي ثبّتها لنفسك:

- أنشئ مهمة محلية في صفحة **Scheduled tasks** في تطبيق سطح المكتب.
- اسمح للمحرك مسبقًا، كما توضح [صفحة التثبيت](https://lagune.ai/ar-AE/docs/install/claude-code)، إذ لن يكون أحد حاضرًا للموافقة على أدواته.
- لا تعمل المهمة إلا عندما يكون التطبيق مفتوحًا وجهازك غير نائم.

تُنشأ المهام المجدولة في تطبيق **ChatGPT** لسطح المكتب، لا في **Codex CLI**، وتعمل على جهازك:

- في محادثة **Codex**، صِف التدقيق، ومتى يجب أن يعمل، وأن كل تشغيل يبدأ محادثة جديدة. وتظهر نتائجه في **Scheduled**.
- في الموجّه، اكتب اسم كل أمر بعد الرمز `$`، مثل `$lagune:lagune-detect`، ليستدعيه التشغيل صراحةً.
- اختر مشروعك المحلي بدلًا من worktree جديدة، لأنها تبدأ دون المحرك الذي [ثبّته في مشروعك](https://lagune.ai/ar-AE/docs/install/codex).
- لا تعمل المهمة إلا عندما يكون التطبيق مفتوحًا، وجهازك قيد التشغيل، والمشروع موجودًا على القرص.

تعمل Automations في **Cursor** في السحابة، حتى وجهازك مطفأ:

- ثبّت **Lagune** عبر [التثبيت الشامل](https://lagune.ai/ar-AE/docs/install/universal) بدلًا من الإضافة، وأجرِ commit له في المستودع.
- أنشئ أتمتة من [cursor.com/automations](https://cursor.com/automations)، أو صِفها عبر `/automate` في جلسة وكيل، مع منحها مشغّلًا مجدولًا.
- اختر مستودعك، لأن المشغّل المجدول يبدأ دون مستودع.

تعمل Automations في **Antigravity** على جهازك، وكل منها في محادثة جديدة:

- افتح تبويب **Automations** في تطبيق **Antigravity** وأنشئ أتمتة مجدولة لمشروعك، أو اطلب من الوكيل إعدادها.
- اسمح للمحرك مسبقًا، كما توضح [صفحة التثبيت](https://lagune.ai/ar-AE/docs/install/antigravity-cli)، إذ لن يكون أحد حاضرًا للموافقة على أدواته.
- استخدم أتمتة بدلًا من الأمر `/schedule`، الذي لا يدوم إلا ما دامت محادثته.
- لا تعمل الأتمتة إلا أثناء تشغيل **Antigravity**.

لا يملك **OpenCode** أداة جدولة خاصة به، لذا يعمل التدقيق من **GitHub Actions** في السحابة:

- أضف **Lagune** إلى ملف `opencode.json` في المستودع وأجرِ commit له، كما توضح [صفحة التثبيت](https://lagune.ai/ar-AE/docs/install/opencode).
- شغّل `opencode github install` لربط تطبيق **OpenCode** على GitHub وتخزين مفتاح مزوّد النماذج.
- أضف سير عمل يمرّر الموجّه إلى **OpenCode** وفق جدول، هنا كل يوم اثنين الساعة 09:00 UTC، مع ملء `<KEY>` و `<provider>/<model>` كما في سير العمل الذي أنشأه `opencode github install`، و `<your-prompt>` بأحد [أمثلة الموجّهات](#prompt-examples):

  ```yaml
  name: Lagune Audit

  on:
    schedule:
      - cron: '0 9 * * 1'

  jobs:
    audit:
      runs-on: ubuntu-latest
      permissions:
        id-token: write
        contents: read
      steps:
        - uses: actions/checkout@v6
          with:
            persist-credentials: false

        - uses: anomalyco/opencode/github@latest
          env:
            <KEY>: ${{ secrets.<KEY> }}
          with:
            model: <provider>/<model>
            prompt: |
              <your-prompt>
  ```

### أمثلة الموجّهات \{#prompt-examples}

**💧 تقرير فقط**

يرصد المخاطر الجديدة، ويخطط لإصلاحاتها، ويعيد فحص الضوابط الأمنية المطبقة بالفعل، دون تغيير الكود الخاص بك:

```md
نفّذ الأوامر التالية واحدًا تلو الآخر: `/lagune-detect` و `/lagune-plan`. وإن كان للمشروع سجل تحصين، فنفّذ `/lagune-verify` أيضًا.

لا تغيّر كود المشروع. في النهاية، لخّص الملاحظات الجديدة وأي ضابط أمني مطبق لم يعد يصمد.
```

**🌊 دورة كاملة**

يطبّق أيضًا الإصلاحات المخطط لها ويثبت أن كل إصلاح منها يصمد، لذا راجع تغييراته قبل أن تصل إلى فرعك الرئيسي:

```md
نفّذ الأوامر التالية واحدًا تلو الآخر: `/lagune-detect` و `/lagune-plan` و `/lagune-harden` و `/lagune-verify`.

في النهاية، لخّص الإصلاحات المطبقة وأي ملاحظة لا تزال مفتوحة.
```
