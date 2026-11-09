# ar-AE translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into Arabic for readers in the United Arab Emirates. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write clear, contemporary Modern Standard Arabic in a neutral, professional register that reads as though it was written in Arabic from the start, as fluent as the English. Never write in a dialect or in Arabizi.
- Prefer the Arabic that developers and tech readers in the Gulf actually use. Where an Arabic word is in everyday use, write it ("الأمان", "ثغرة", "مخاطر", "إصلاح", "أمر", "ملف", "مجلد"). Where developers keep the English term, keep it in Latin letters, unitalicized ("hook", "commit", "branch"), and keep acronyms as they are ("CLI", "MCP", "API").
- Never translate literally. A calque keeps the English structure under Arabic words, and it reads stiff:
  - ❌ "إنه يعمل في كل من المشاريع الجديدة والموجودة ولا يتطلب أي مفاتيح API."
  - ✅ "يعمل **Lagune** مع المشاريع الجديدة والقائمة، دون الحاجة إلى مفتاح API."
  - ❌ "يتم تطبيق الإصلاحات من قبل الوكيل."
  - ✅ "يطبّق الوكيل الإصلاحات."
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Address the reader in the second person singular. Write instructions in the plain imperative ("ثبّت", "شغّل", "اطّلع على"), never padded with "يرجى" or "الرجاء". Titles, headings, sidebar labels, buttons, and table cells use a short noun phrase or a verbal noun ("البدء", "آلية العمل", "التثبيت").
- A prompt the reader sends to the agent addresses the agent in the imperative ("افحص", "أضف", "أصلح"), as people write to an assistant.
- Prefer the active voice with the verb first ("يطبّق الوكيل الإصلاحات"). Avoid "يتم" and "من قبل", and cut translationese such as a needless "إن", "حيث إن", "قام بـ", or "بشكل" where an adverb or a plain verb does the job.
- Keep the gender of a term the same everywhere, so verbs and adjectives agree: **Lagune**, الوكيل, المحرك, المشروع, الإصلاح, الضابط, الأمر, الملف, and the phase names are masculine. المرحلة, الثغرة, الملاحظة, المهارة, الإضافة, الفئة, السلسلة, الخطة, and the categories' names are feminine.
- Write complete sentences. Never cut a thought short where the sentence calls for a connector ("و", "لكن", "لذلك", "لأن").
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in the Gulf, keeping the English technical terms they also search for (such as OWASP, CVSS, PoC, Claude Code, security hardening), and write each FAQ question the way an Arabic-speaking user would ask it ("هل يمكنني ...؟", "ما هو ...؟").

## Typography

- The page reads right to left. Latin runs, inline code, numbers, and links keep their own direction inside the Arabic sentence, so never reorder them to look right in an editor that shows the raw text left to right.
- End a sentence with a period. Use the Arabic comma "،" and the Arabic question mark "؟", and avoid the semicolon, as in English. A colon introduces a list, an example, or an explanation.
- Quote with straight double quotes (`"`), never curly quotes or guillemets, and use straight apostrophes.
- Write numbers in Western digits ("0" to "9"), as is standard in the UAE, never Eastern Arabic digits. Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write counts with a thousands comma ("1,200 ملف") and the percent sign after the number ("50%").
- Put a space before and after every run of Latin letters, inline code, bold product name, link, and number inside Arabic text. A prefix such as "و", "ب", "ل", or "ال" never touches a Latin run or inline code: restructure the sentence or write "و" as its own word ("شغّل `/lagune-detect` و `/lagune-plan`"). A bare URL is always followed by a space, since Markdown and the check read any letter or punctuation after it as part of the URL.
- A slash command or a path written as plain text, outside inline code, as in a heading, a frontmatter field, or a message, starts with an invisible left-to-right mark (U+200E), or the browser moves its leading slash to the other end ("يأخذ الأمر ‎/lagune أي موجّه"). Inline code and sidebar labels need none, since the site isolates them.
- Write a sequence joined by arrows with "←" in place of "→" ("`charter` ← `detect`"), so the flow points the way the line reads. Mermaid edges keep their own arrows.
- Write no tatweel, and no diacritics beyond a shadda that keeps a verb from being misread ("شغّل", "ثبّت", "حصّن").
- Never start or end a bold or italic span with punctuation or inline code when a letter touches it, since Markdown then fails to close the span. Keep the punctuation outside ("**قاعدة البيانات**:").
- Inline code keeps the English order, and the check compares the spans one by one, so restructure the sentence around them instead of reordering them.
- Give inline code a head noun where the sentence needs one ("شغّل الأمر `/lagune-detect`", "hook `secrets`").
- Titles and labels carry no trailing punctuation, and product names keep their own case.
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what an Arabic-speaking user would type, while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("و/أو", a date such as "11/03"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                           | ar-AE                                                                                 |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                           | unchanged                                                                             |
| `/lagune-charter` and every other command                                                         | unchanged, with "الأمر" where the sentence needs a noun ("شغّل الأمر `/lagune-plan`") |
| CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                                        | unchanged                                                                             |
| Blue Team, Red Team                                                                               | الفريق الأزرق, الفريق الأحمر, keeping "Blue Team" in keywords                         |
| hardening (noun), security hardening                                                              | التحصين, التحصين الأمني, keeping "security hardening" in keywords                     |
| harden (verb)                                                                                     | يحصّن                                                                                 |
| charter (the principles it holds)                                                                 | ميثاق الأمان, مبادئ الأمان                                                            |
| charter, detect, plan, harden, verify (as phase names)                                            | unchanged, with "مرحلة" where the sentence needs it ("مرحلة detect")                  |
| phase                                                                                             | مرحلة                                                                                 |
| governing layer, convention (SDH as one)                                                          | الطبقة الحاكمة, منهجية                                                                |
| engine                                                                                            | المحرك                                                                                |
| spec                                                                                              | المواصفة, keeping "spec-driven development" in keywords                               |
| deterministic                                                                                     | حتمي ("خطوة حتمية")                                                                   |
| development flow, Blue Team flow, workflow                                                        | مسار التطوير, مسار الفريق الأزرق, سير العمل                                           |
| universal (the `/lagune` command, the install route)                                              | الشامل                                                                                |
| context, context-aware, context window                                                            | السياق, مدرك للسياق, نافذة السياق (an LLM's)                                          |
| audit (noun), audit (verb)                                                                        | تدقيق, يدقّق                                                                          |
| map (what the system does, its risks)                                                             | يرصد                                                                                  |
| record (a finding, a category)                                                                    | يسجّل                                                                                 |
| finding                                                                                           | ملاحظة (plural ملاحظات)                                                               |
| concern (one the user describes to detect)                                                        | مصدر قلق                                                                              |
| evidence (behind a finding, and what prove writes)                                                | الدليل, الأدلة                                                                        |
| fix                                                                                               | إصلاح                                                                                 |
| control                                                                                           | ضابط أمني (plural ضوابط أمنية), ضابط                                                  |
| hold (a control, a fix)                                                                           | يصمد, يبقى فعّالًا                                                                    |
| prove, proof, proof of concept                                                                    | يُثبت, إثبات, إثبات المفهوم (PoC)                                                     |
| verdict                                                                                           | الحكم                                                                                 |
| confront (the code with the record)                                                               | يقابل                                                                                 |
| reconcile                                                                                         | يوائم مع الواقع الحالي                                                                |
| detect map, defense plan, hardening record                                                        | خريطة detect, خطة الدفاع, سجل التحصين                                                 |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels)    | unchanged, since the artifacts write them in English                                  |
| specialization, catalog, category                                                                 | تخصص (plural تخصصات), الكتالوج, فئة                                                   |
| built-in (specialization)                                                                         | مدمج                                                                                  |
| distill, shadow (a built-in, with a specialization of your own)                                   | يستخلص, يحل محل                                                                       |
| stand down, close out                                                                             | يُخرج ("يُخرجها من السلسلة كلها"), يُغلق نهائيًا                                      |
| closable, closability (security)                                                                  | قابل للإغلاق, قابلية الإغلاق                                                          |
| at rest, settled (the cycle)                                                                      | تستقر ("تستقر الدورة")                                                                |
| cycle                                                                                             | الدورة                                                                                |
| artifact, memory (the phase artifacts)                                                            | مُخرَج (plural مُخرَجات), الذاكرة                                                     |
| chain (the phase artifacts together)                                                              | السلسلة ("السلسلة كلها")                                                              |
| tracking, tracking map, tracked item                                                              | التتبع, خريطة التتبع, عنصر متتبَّع                                                    |
| vulnerability, risk, exploit                                                                      | ثغرة, خطر (plural مخاطر), استغلال, keeping "vulnerability" in keywords                |
| prompt injection, path traversal, prototype pollution, data races, type juggling, class pollution | unchanged                                                                             |
| broken access control                                                                             | خلل التحكم في الوصول (Broken Access Control) on first mention                         |
| crafted, untrusted, hardcoded                                                                     | مُصاغ عمدًا, غير موثوق, مكتوب مباشرة في الكود                                         |
| score, rate (a finding)                                                                           | يقيّم                                                                                 |
| allowlist, denylist                                                                               | قائمة السماح, قائمة الحظر                                                             |
| false positive, sink                                                                              | إيجابية كاذبة, sink                                                                   |
| attack vector, attack surface                                                                     | متجه الهجوم, سطح الهجوم                                                               |
| severity                                                                                          | الخطورة ("حرجة", "عالية", "متوسطة", "منخفضة" in prose, unchanged in command output)   |
| authentication, authorization, access control                                                     | المصادقة, التفويض, التحكم في الوصول                                                   |
| secret, credential                                                                                | سر (plural أسرار), بيانات الاعتماد                                                    |
| login, file uploads, payments                                                                     | تسجيل الدخول, رفع الملفات, المدفوعات                                                  |
| file, folder, directory, path, link                                                               | ملف, مجلد, دليل, مسار, رابط                                                           |
| scan, check (hook modes)                                                                          | unchanged as mode names ("وضع scan")                                                  |
| checker (what a hook runs)                                                                        | الفاحص                                                                                |
| sweep, scan (verb and noun)                                                                       | يفحص, فحص                                                                             |
| flag (verb)                                                                                       | ينبّه إلى                                                                             |
| snippet                                                                                           | مقتطف                                                                                 |
| repository, dependency, sub-agent, workspace                                                      | المستودع, اعتمادية (plural اعتماديات), وكيل فرعي, مساحة العمل                         |
| codebase, code                                                                                    | قاعدة الكود, الكود                                                                    |
| project                                                                                           | المشروع                                                                               |
| AI agent, coding agent, agent                                                                     | وكيل ذكاء اصطناعي, وكيل برمجة, الوكيل                                                 |
| prompt                                                                                            | الموجّه (plural الموجّهات)                                                            |
| hook, payload, handler                                                                            | unchanged                                                                             |
| plugin                                                                                            | إضافة                                                                                 |
| dashboard                                                                                         | لوحة التحكم                                                                           |
| skill                                                                                             | مهارة (plural مهارات)                                                                 |
| skills CLI, CLI, terminal                                                                         | **skills** CLI, CLI, الطرفية                                                          |
| session, tool (the engine's MCP tools)                                                            | جلسة, أداة                                                                            |
| command, slash command                                                                            | أمر (plural أوامر), أمر slash                                                         |
| test (what a test runner runs)                                                                    | اختبار, kept apart from "إثبات", which means proof                                    |
| branch, commit, pull request, diff                                                                | unchanged                                                                             |
| report, template, library, header                                                                 | تقرير, قالب, مكتبة, header                                                            |
| deploy                                                                                            | ينشر, نشر                                                                             |
| deprecated                                                                                        | مُهمَل                                                                                |
| live (view, dashboard)                                                                            | مباشر ("عرض مباشر")                                                                   |
| badge                                                                                             | شارة                                                                                  |
| extension, package                                                                                | امتداد, حزمة                                                                          |
| install, update (verbs)                                                                           | يثبّت, يحدّث                                                                          |
| run (a command)                                                                                   | يشغّل                                                                                 |
| defense-only, defensive security                                                                  | للدفاع فقط, الأمن الدفاعي                                                             |
| security posture                                                                                  | الوضع الأمني                                                                          |
| advisory, responsible disclosure                                                                  | نشرة أمنية, الإفصاح المسؤول                                                           |
| prompt-on-demand, methodology                                                                     | prompt-on-demand, منهجية                                                              |
| on demand                                                                                         | عند الحاجة                                                                            |
| scope (of a run), in scope, out of scope                                                          | النطاق, ضمن النطاق, خارج النطاق                                                       |
| safe by default, safe defaults                                                                    | آمن افتراضيًا, إعدادات افتراضية آمنة                                                  |
| open-source                                                                                       | مفتوح المصدر                                                                          |
| Get Started, Install                                                                              | البدء, التثبيت                                                                        |
| Run it, Next (headings)                                                                           | طريقة الاستخدام on a command page, التشغيل on a hook page, التالي                     |
| How it works, Update, Permissions (headings)                                                      | آلية العمل, التحديث, الأذونات                                                         |
| Get the most out of it (tip title)                                                                | استفد منه إلى أقصى حد                                                                 |
| Frequently Asked Questions                                                                        | الأسئلة الشائعة                                                                       |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
