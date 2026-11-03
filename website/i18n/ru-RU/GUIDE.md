# ru-RU translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into Russian. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural Russian that reads as though it was written in Russian from the start, as fluent as the English.
- Never translate literally. A calque keeps the English structure under Russian words, and it reads stiff:
  - ❌ "Это работает в обоих новых и существующих проектах и не нуждается в API ключе."
  - ✅ "Lagune работает и в новых, и в существующих проектах и не требует API-ключа."
  - ❌ "Докажите, что каждое примененное исправление держится, затем закройте те, которые делают."
  - ✅ "Докажите, что каждое примененное исправление действует, и закройте те, что прошли проверку."
  - ❌ "Исправление применяется агентом."
  - ✅ "Агент применяет исправление."
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Address the reader as "вы", in lowercase ("вы", "ваш", "вам"), and use the plural imperative for instructions ("Установите", "Выполните"). A prompt the user types to the agent addresses the agent as "ты" ("проверь", "добавь"), the way people write to an assistant.
- Write complete sentences. Russian grammar calls for a dash between subject and predicate ("X — это Y"), but the site uses no dashes, so rephrase instead: "X представляет собой Y", "X является Y", or "X служит Y". Never cut a thought short with a semicolon or a full stop where the sentence calls for a comma, a colon, or parentheses.
- Cut the words that add nothing, never the meaning. Prefer the verb to the noun built from it ("установить", not "произвести установку"), and prefer the active voice to a passive "применяется агентом".
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs. **Lagune** is never declined and takes "он" where a pronoun is unavoidable, though it is better to repeat the name or rephrase.
- Write titles, descriptions, and keywords from how people search in Russia, keeping the English technical terms they also search for (such as OWASP, CVSS, hardening, prompt, Claude Code), and write each FAQ question the way a user in Russia would ask it.

## Typography

- Use sentence case for titles and labels, never English title case ("Начало работы", "Усиление безопасности для любого ИИ-агента").
- After a colon, start with a lowercase letter unless the next word is a proper name or a product name ("/lagune-detect: выявите, что делает система и где ее риски", "Хук crypto: обнаружение слабой криптографии").
- Quote with straight double quotes (`"`), never the Russian angle quotes (`«»`) or the low-high quotes (`„“`), and use straight apostrophes.
- Write "е", never "ё", so the same word is always spelled the same way.
- Join a compound with a hyphen where one part is an abbreviation ("ИИ-агент", "API-ключ", "MIME-тип", "QR-код"). Where one part is a bold product name, rephrase instead of compounding ("плагин для **Claude Code**").
- Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write counts with no separator in a four-digit number ("1200 файлов").
- Titles and labels carry no trailing full stop, and tab labels and buttons are short noun phrases or infinitives ("Указать пути", "Установить").
- Never break lines by hand in the middle of prose.
- A YAML value that holds a colon followed by a space, such as a description, goes in single quotes, or the frontmatter breaks.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a user in Russia would type, addressing the agent as "ты" ("проверь", "добавь"), while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("и/или", "TCP/IP", a date such as "03/11"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English, and so do the comments inside `bash`, `text`, and `json` blocks, the section headers and verdicts the engine prints, and the labels the artifacts write (Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code, Critical, High, Medium, Low, Applied specializations).

## Glossary

| English                                                                                           | ru-RU                                                                                                                             |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                           | unchanged and never declined ("команды **Lagune**")                                                                               |
| `/lagune-charter` and every other command                                                         | unchanged                                                                                                                         |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                   | unchanged                                                                                                                         |
| hardening (noun), security hardening                                                              | усиление защиты, усиление безопасности, keeping "hardening" in keywords                                                           |
| harden (verb)                                                                                     | усиливать защиту, защищать                                                                                                        |
| charter (the principles it holds)                                                                 | принципы безопасности                                                                                                             |
| charter, detect, plan, harden, verify (as phase names)                                            | unchanged and feminine, with "фаза" where the sentence needs it ("фаза detect", "verify доказывает")                              |
| governing layer, convention (SDH as one)                                                          | управляющий уровень, конвенция                                                                                                    |
| engine                                                                                            | движок                                                                                                                            |
| deterministic                                                                                     | детерминированный                                                                                                                 |
| Development flow, Blue Team flow, workflow                                                        | процесс разработки, процесс Blue Team, рабочий процесс                                                                            |
| universal (the `/lagune` command, the install route)                                              | универсальный                                                                                                                     |
| context, context-aware                                                                            | контекст, с учетом контекста                                                                                                      |
| audit                                                                                             | проводить аудит, аудит                                                                                                            |
| map (what the system does, its risks)                                                             | выявлять                                                                                                                          |
| record (a finding, a category)                                                                    | фиксировать                                                                                                                       |
| finding                                                                                           | находка                                                                                                                           |
| concern, worry (one the user describes)                                                           | опасение                                                                                                                          |
| evidence                                                                                          | свидетельство                                                                                                                     |
| fix                                                                                               | исправление                                                                                                                       |
| control                                                                                           | мера защиты                                                                                                                       |
| hold (a control, a fix)                                                                           | действовать                                                                                                                       |
| prove, proof, proof of concept                                                                    | доказать, доказательство, proof of concept (PoC)                                                                                  |
| verdict                                                                                           | вердикт                                                                                                                           |
| confront (the code with the record)                                                               | сопоставлять                                                                                                                      |
| reconcile                                                                                         | сверять                                                                                                                           |
| reprove (verify rejecting a fix)                                                                  | отклонять                                                                                                                         |
| detect map, defense plan, hardening record                                                        | карта обнаружения, план защиты, журнал усиления защиты                                                                            |
| specialization, catalog, category                                                                 | специализация, каталог, категория                                                                                                 |
| built-in (specialization)                                                                         | встроенный                                                                                                                        |
| distill, shadow (a built-in, with a specialization of your own)                                   | превращать (в специализацию), перекрывать                                                                                         |
| stand down, close out                                                                             | снимать с учета ("снимает с учета во всей цепочке"), закрывать                                                                    |
| closable, closability (security)                                                                  | закрываемый, закрываемость                                                                                                        |
| at rest, settled (the cycle)                                                                      | в состоянии покоя, в устойчивом состоянии                                                                                         |
| artifact, memory (the phase artifacts)                                                            | артефакт, память                                                                                                                  |
| chain (the phase artifacts together)                                                              | цепочка ("вся цепочка")                                                                                                           |
| tracking, tracking map, tracked item                                                              | отслеживание, карта отслеживания, отслеживаемый элемент                                                                           |
| vulnerability, risk, exploit                                                                      | уязвимость, риск, эксплойт                                                                                                        |
| prompt injection, path traversal, prototype pollution, data races, type juggling, class pollution | unchanged and lowercase, as Russian security writing keeps them                                                                   |
| broken access control                                                                             | нарушение контроля доступа, as **OWASP** writes it in Russian                                                                     |
| crafted, untrusted, hardcoded                                                                     | специально сформированный, недоверенный, жестко заданный                                                                          |
| score, rate (a finding)                                                                           | оценивать                                                                                                                         |
| false positive, sink                                                                              | ложное срабатывание, sink (or "точка динамического выполнения" for the interpreter hook)                                          |
| attack vector, attack surface                                                                     | вектор атаки, поверхность атаки                                                                                                   |
| severity                                                                                          | критичность ("критический", "высокий", "средний", "низкий" in prose and prompts, unchanged in command output and artifact labels) |
| authentication, authorization, access control                                                     | аутентификация, авторизация, контроль доступа                                                                                     |
| secret, credential                                                                                | секрет, учетные данные                                                                                                            |
| login, file uploads, payments                                                                     | вход в систему, загрузка файлов, платежи                                                                                          |
| file, folder, directory, path, link                                                               | файл, папка, директория (never "каталог", which means catalog), путь, ссылка                                                      |
| scan, check (hook modes)                                                                          | unchanged as mode names ("режим scan")                                                                                            |
| sweep, scan (verb and noun)                                                                       | сканировать, проверять, сканирование                                                                                              |
| flag (verb)                                                                                       | помечать                                                                                                                          |
| snippet                                                                                           | фрагмент кода                                                                                                                     |
| codebase                                                                                          | кодовая база                                                                                                                      |
| AI agent, coding agent, agent                                                                     | ИИ-агент, агент для программирования, агент                                                                                       |
| prompt, plugin, hook, payload, handler, dashboard                                                 | промпт, плагин, хук, payload, обработчик, дашборд                                                                                 |
| skill                                                                                             | навык                                                                                                                             |
| skills CLI, CLI, terminal                                                                         | CLI **skills**, keeping "skills CLI" in keywords, CLI, терминал                                                                   |
| session, tool (the engine's MCP tools)                                                            | сессия, инструмент                                                                                                                |
| slash command                                                                                     | slash-команда                                                                                                                     |
| sub-agent                                                                                         | субагент                                                                                                                          |
| test (what a test runner runs)                                                                    | тест, kept apart from "доказательство", which means proof                                                                         |
| branch, commit, pull request, diff                                                                | ветка, коммит, pull request, diff                                                                                                 |
| report, template, library, header                                                                 | отчет, шаблон, библиотека, заголовок                                                                                              |
| deploy                                                                                            | развертывать                                                                                                                      |
| deprecated                                                                                        | устаревший                                                                                                                        |
| live (view, dashboard)                                                                            | в реальном времени                                                                                                                |
| badge                                                                                             | бейдж                                                                                                                             |
| extension, package, marketplace                                                                   | расширение, пакет, маркетплейс                                                                                                    |
| defense-only, defensive security                                                                  | ориентированный только на защиту, защитная безопасность                                                                           |
| security posture                                                                                  | уровень защищенности                                                                                                              |
| advisory, responsible disclosure                                                                  | бюллетень безопасности, ответственное раскрытие                                                                                   |
| on demand                                                                                         | по запросу                                                                                                                        |
| scope (of a run), in scope, out of scope                                                          | охват, в пределах охвата, вне охвата                                                                                              |
| safe by default, safe defaults                                                                    | безопасный по умолчанию, безопасные настройки по умолчанию                                                                        |
| open-source                                                                                       | открытый, с открытым исходным кодом                                                                                               |
| Get Started, Install                                                                              | Начало работы, Установка                                                                                                          |
| Run it, Next (headings)                                                                           | Использование on a command page, Запуск on a hook page, Что дальше                                                                |
| How it works, Update, Permissions, Commands (headings)                                            | Как это работает, Обновление, Разрешения, Команды                                                                                 |
| CLI options (heading), Option, Value, Description                                                 | Параметры CLI, Параметр, Значение, Описание                                                                                       |
| Get the most out of it (tip title)                                                                | Как извлечь максимум                                                                                                              |
| Frequently Asked Questions                                                                        | Частые вопросы                                                                                                                    |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
