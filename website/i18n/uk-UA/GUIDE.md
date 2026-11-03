# uk-UA translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into Ukrainian. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural Ukrainian that reads as though it was written in Ukrainian from the start, as fluent as the English.
- Never translate literally. A calque keeps the English structure under Ukrainian words, and it reads stiff:
  - ❌ "Це працює в обох нових і існуючих проєктах і не потребує API ключа."
  - ✅ "Lagune працює як у нових, так і в наявних проєктах і не потребує API-ключа."
  - ❌ "Доведіть, що кожне застосоване виправлення тримається, потім закрийте ті, що роблять."
  - ✅ "Доведіть, що кожне застосоване виправлення діє, а потім зніміть з обліку ті, що пройшли перевірку."
  - ❌ "Виправлення застосовується агентом."
  - ✅ "Агент застосовує виправлення."
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Address the reader as "ви", in lowercase ("ви", "ваш", "вам"), and use the plural imperative for instructions ("Встановіть", "Виконайте"). A prompt the reader sends to the agent addresses the agent as "ти" ("Перевір", "Додай"), as people write to an assistant.
- Write complete sentences. Never cut a thought short with an em dash, a semicolon, or a full stop where the sentence calls for a comma, a colon, or parentheses. Ukrainian grammar calls for a dash between two nouns joined without a verb ("SDH — це практика"), so rephrase with a verb where one reads naturally ("SDH є практикою") and keep the dash only where the sentence needs it.
- Cut the words that add nothing, never the meaning. Prefer the verb to the noun built from it ("встановити", not "здійснити встановлення"), and prefer the active voice to a passive "застосовується агентом".
- Avoid calques and russisms: "наявний", never "існуючий" for "existing", "у 2026 році", "з відкритим кодом", "залежно від", never "в залежності від", and "вживати заходів", never "приймати міри".
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in Ukraine, keeping the English technical terms they also search for (such as OWASP, CVSS, hardening, prompt, Claude Code), and write each FAQ question the way a user in Ukraine would ask it.

## Typography

- Use sentence case for titles and labels, never English title case ("Початок роботи", "Безпека для будь-якого ШІ-агента").
- After a colon, start the next word in lowercase unless it is a proper name or a command ("/lagune-detect: визначте, що робить ваша система").
- Quote with straight double quotes (`"`), never the Ukrainian angle quotes (`«»`) or curly quotes, and write the apostrophe inside Ukrainian words as a straight apostrophe ("пам'ять", "об'єкт"). In frontmatter, wrap a value that holds an apostrophe in double quotes, since a single-quoted YAML value ends at the apostrophe.
- Join a compound with a hyphen where one part is an abbreviation ("ШІ-агент", "API-ключ", "CVSS-оцінка" or "оцінка CVSS"). Where one part is a bold product name, rephrase instead of compounding ("плагін для **Claude Code**").
- Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write counts the Ukrainian way, with no separator in a four-digit number ("1200 файлів") and a space in a longer one ("12 000").
- Avoid a count that forces a plural form the sentence cannot know, such as a placeholder count, by rephrasing ("Інші агенти: {count}").
- Titles and labels carry no trailing full stop, and tab labels and buttons use the infinitive or a noun ("Вказати шляхи", "Встановити").
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a user in Ukraine would type, addressing the agent as "ти" ("перевір", "додай"), while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("і/або", a date such as "03/11"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                           | uk-UA                                                                                                                          |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                           | unchanged and never declined ("команди **Lagune**"), masculine where agreement needs a gender ("**Lagune** працює", "він")     |
| `/lagune-charter` and every other command                                                         | unchanged                                                                                                                      |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                   | unchanged                                                                                                                      |
| hardening (noun), security hardening                                                              | посилення захисту, keeping "hardening" in keywords                                                                             |
| harden (verb)                                                                                     | посилювати захист, захищати                                                                                                    |
| charter (the principles it holds)                                                                 | принципи безпеки                                                                                                               |
| charter, detect, plan, harden, verify (as phase names)                                            | unchanged and feminine, as "фаза" is, with "фаза" where the sentence needs it ("фаза charter", "verify доводить", "її аналіз") |
| governing layer, convention (SDH as one)                                                          | керівний рівень, конвенція                                                                                                     |
| engine                                                                                            | рушій ("детермінований рушій")                                                                                                 |
| deterministic                                                                                     | детермінований                                                                                                                 |
| Development flow, Blue Team flow, workflow                                                        | процес розробки, процес Blue Team, робочий процес                                                                              |
| universal (the `/lagune` command, the install route)                                              | універсальний                                                                                                                  |
| context, context-aware                                                                            | контекст, з урахуванням контексту                                                                                              |
| audit                                                                                             | перевіряти, аудит                                                                                                              |
| map (what the system does, its risks)                                                             | визначати                                                                                                                      |
| record (a finding, a category)                                                                    | записувати, фіксувати                                                                                                          |
| finding                                                                                           | знахідка                                                                                                                       |
| concern (one the user describes to detect)                                                        | занепокоєння                                                                                                                   |
| evidence                                                                                          | доказ                                                                                                                          |
| fix                                                                                               | виправлення                                                                                                                    |
| control                                                                                           | засіб захисту                                                                                                                  |
| hold (a control, a fix)                                                                           | діяти                                                                                                                          |
| prove, proof, proof of concept                                                                    | довести, доведення, Proof of Concept (PoC)                                                                                     |
| verdict                                                                                           | вердикт                                                                                                                        |
| confront (the code with the record)                                                               | зіставляти                                                                                                                     |
| reconcile                                                                                         | узгоджувати                                                                                                                    |
| detect map, defense plan, hardening record                                                        | карта виявлення, план захисту, журнал посилення захисту                                                                        |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels)    | unchanged, since the artifacts write them in English                                                                           |
| specialization, catalog, category                                                                 | спеціалізація, каталог, категорія                                                                                              |
| built-in (specialization)                                                                         | вбудований                                                                                                                     |
| distill, shadow (a built-in, with a specialization of your own)                                   | стисло викладати, перекривати                                                                                                  |
| stand down, close out                                                                             | знімати з обліку ("знімає з обліку в усьому ланцюжку"), закривати                                                              |
| closable, closability (security)                                                                  | безпеку можна закрити, закриваність                                                                                            |
| at rest, settled (the cycle)                                                                      | у стані спокою                                                                                                                 |
| artifact, memory (the phase artifacts)                                                            | артефакт, пам'ять                                                                                                              |
| chain (the phase artifacts together)                                                              | ланцюжок ("увесь ланцюжок")                                                                                                    |
| tracking, tracking map, tracked item                                                              | відстеження, карта відстеження, відстежуваний елемент                                                                          |
| vulnerability, risk, exploit                                                                      | вразливість, ризик, експлойт                                                                                                   |
| prompt injection, path traversal, prototype pollution, data races, type juggling, class pollution | unchanged and lowercase, as Ukrainian security writing keeps them                                                              |
| broken access control                                                                             | порушення контролю доступу, as **OWASP** writes it in Ukrainian                                                                |
| crafted, untrusted, hardcoded                                                                     | підроблений, недовірений, жорстко закодований                                                                                  |
| score, rate (a finding)                                                                           | оцінювати                                                                                                                      |
| false positive, sink                                                                              | хибне спрацьовування, sink                                                                                                     |
| attack vector, attack surface                                                                     | вектор атаки, поверхня атаки                                                                                                   |
| severity                                                                                          | критичність ("критична", "висока", "середня", "низька" in prose, unchanged in command output)                                  |
| authentication, authorization, access control                                                     | автентифікація, авторизація, контроль доступу                                                                                  |
| secret, credential                                                                                | секрет, облікові дані                                                                                                          |
| login, file uploads, payments                                                                     | вхід, завантаження файлів, платежі                                                                                             |
| file, folder, directory, path, link                                                               | файл, папка, каталог, шлях, посилання                                                                                          |
| scan, check (hook modes)                                                                          | unchanged as mode names ("режим scan")                                                                                         |
| sweep, scan (verb and noun)                                                                       | перевіряти, перевірка                                                                                                          |
| flag (verb)                                                                                       | позначати                                                                                                                      |
| snippet                                                                                           | фрагмент коду                                                                                                                  |
| codebase                                                                                          | кодова база, or проєкт where it reads better                                                                                   |
| AI agent, coding agent, agent                                                                     | ШІ-агент, агент для програмування, агент                                                                                       |
| prompt, plugin, hook, payload, handler, dashboard                                                 | промпт, плагін, хук, payload, обробник, дашборд                                                                                |
| skill                                                                                             | навичка                                                                                                                        |
| skills CLI, CLI, terminal                                                                         | CLI **skills**, keeping "skills CLI" in keywords, CLI, термінал                                                                |
| session, tool (the engine's MCP tools)                                                            | сесія, інструмент                                                                                                              |
| slash command                                                                                     | slash-команда                                                                                                                  |
| test (what a test runner runs)                                                                    | тест, kept apart from "доведення", which means proof                                                                           |
| branch, commit, pull request, diff                                                                | гілка, коміт, pull request, diff                                                                                               |
| report, template, library, header                                                                 | звіт, шаблон, бібліотека, заголовок                                                                                            |
| deploy                                                                                            | розгортати                                                                                                                     |
| deprecated                                                                                        | застарілий                                                                                                                     |
| live (view, dashboard)                                                                            | наживо ("огляд наживо")                                                                                                        |
| badge                                                                                             | бейдж                                                                                                                          |
| extension, package                                                                                | розширення, пакет                                                                                                              |
| defense-only, defensive security                                                                  | суто оборонний, оборонна безпека                                                                                               |
| security posture                                                                                  | рівень захищеності                                                                                                             |
| advisory, responsible disclosure                                                                  | бюлетень безпеки, відповідальне розкриття                                                                                      |
| on demand                                                                                         | на вимогу                                                                                                                      |
| scope (of a run), in scope, out of scope                                                          | обсяг, в межах обсягу, поза обсягом                                                                                            |
| safe by default, safe defaults                                                                    | безпечний за замовчуванням, безпечні налаштування за замовчуванням                                                             |
| open-source                                                                                       | з відкритим кодом                                                                                                              |
| Get Started, Install                                                                              | Початок роботи, Встановлення                                                                                                   |
| Run it, Next (headings)                                                                           | Використання on a command page, Запуск on a hook page, Далі                                                                    |
| How it works, Update, Permissions (headings)                                                      | Як це працює, Оновлення, Дозволи                                                                                               |
| Get the most out of it (tip title)                                                                | Як отримати максимум                                                                                                           |
| Frequently Asked Questions                                                                        | Часті запитання                                                                                                                |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
