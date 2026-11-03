# zh-CN translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into Simplified Chinese, as written in mainland China. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural Simplified Chinese that reads as though it was written in Chinese from the start, as fluent as the English.
- Never translate literally. A calque keeps the English structure under Chinese words, and it reads stiff:
  - ❌ "它在新的和现有的项目中都能工作，并且不需要任何 API 密钥。"
  - ✅ "新项目和现有项目都能用，也不需要 API 密钥。"
  - ❌ "证明每一个被应用的修复成立，然后结案那些成立的。"
  - ✅ "证明每项已应用的修复确实有效，并将有效的发现项结案。"
  - ❌ "修复被智能体应用。"
  - ✅ "智能体会应用修复。"
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Write complete sentences. Never cut a thought short with a dash (`——`), a semicolon, or a full stop where the sentence calls for a comma, a colon, or parentheses.
- Cut the words that add nothing, never the meaning. Drop padding such as "进行安装" where "安装" does the job, and avoid stacking "的", "一个", and "被" where the sentence reads without them.
- Address the reader as "你", never "您".
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in Chinese, keeping the English technical terms they also search for (such as OWASP, CVSS, PoC, Claude Code), and write each FAQ question the way a Chinese user would ask it.

## Typography

- Use full-width Chinese punctuation in Chinese prose: `，` `。` `：` `？` `！` `、` and `（）`. Keep ASCII punctuation inside code, commands, and English names.
- Quote with straight double quotes (`"`), never curly quotes or corner brackets, as the rest of the project does.
- Put one space between Chinese characters and Latin letters, numbers, inline code, links, and bold product names ("运行 `/lagune-detect` 之后", "**Lagune** 会读取代码"), and none next to full-width punctuation.
- Never start or end a bold or italic span with punctuation: Markdown then fails to close it beside a Chinese character. Keep the punctuation outside ("**数据库**："), and italicize a word inside a Chinese sentence with `*`, since `_` does not render there.
- Follow a bare URL with a space, never with full-width punctuation, which Markdown and the check read as part of the URL.
- Inline code keeps the English order, so restructure the sentence around the spans instead of reordering them.
- A slash command followed by a colon keeps the ASCII colon and a space, as in a title such as "/lagune-charter: 设定你的安全原则", since the check reads the colon as part of the command.
- Titles and labels carry no trailing full stop, and Latin product names keep their own case.
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a Chinese user would type, while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("和/或", a date such as "11/03"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                        | zh-CN                                                                             |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                        | unchanged                                                                         |
| `/lagune-charter` and every other command                                                      | unchanged                                                                         |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                | unchanged                                                                         |
| hardening, harden (verb)                                                                       | 加固, or 安全加固 where the context needs it ("加固代码库", "安全加固工作流")     |
| charter                                                                                        | "charter" as the phase name, "安全原则" in prose                                  |
| detect, plan, harden, verify (as phase names)                                                  | unchanged, with 阶段 where the sentence needs it ("detect 阶段", "verify 会证明") |
| engine                                                                                         | 引擎                                                                              |
| finding                                                                                        | 发现项                                                                            |
| fix                                                                                            | 修复                                                                              |
| control                                                                                        | 控制措施                                                                          |
| prove, proof, proof of concept                                                                 | 证明, 证明, 概念验证（PoC）                                                       |
| verdict                                                                                        | 判定结果                                                                          |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels) | unchanged, since the artifacts write them in English                              |
| specialization, catalog, category                                                              | 专项, 目录, 类别                                                                  |
| built-in (specialization)                                                                      | 内置                                                                              |
| stand down, closability                                                                        | 结案, 可结案性                                                                    |
| at rest, settled (the cycle)                                                                   | 静止 ("循环进入静止状态")                                                         |
| artifact, memory (the phase artifacts)                                                         | 产物, 记忆                                                                        |
| chain (the phase artifacts together)                                                           | 链路 ("整条链路")                                                                 |
| tracking map, tracked item                                                                     | 追踪映射, 追踪项                                                                  |
| attack vector, attack surface                                                                  | 攻击向量, 攻击面                                                                  |
| severity                                                                                       | 严重程度 ("严重", "高危", "中危", "低危" in prose, unchanged in command output)   |
| scan, check (hook modes)                                                                       | unchanged as mode names ("scan 模式")                                             |
| sweep, scan (verb and noun)                                                                    | 扫描                                                                              |
| flag (verb)                                                                                    | 标记                                                                              |
| snippet                                                                                        | 代码片段                                                                          |
| codebase                                                                                       | 代码库, or 项目 where it reads better                                             |
| AI agent, agent                                                                                | AI 智能体, 智能体                                                                 |
| prompt                                                                                         | 提示词                                                                            |
| plugin, extension, package                                                                     | 插件, 扩展, 包                                                                    |
| dashboard                                                                                      | 仪表盘                                                                            |
| skill, hook, payload, handler                                                                  | unchanged                                                                         |
| defense-only, defensive security                                                               | 仅限防御, 防御性安全                                                              |
| security posture                                                                               | 安全态势                                                                          |
| advisory, responsible disclosure                                                               | 安全公告, 负责任披露                                                              |
| on demand                                                                                      | 按需                                                                              |
| safe by default, safe defaults                                                                 | 默认安全, 安全的默认设置                                                          |
| open-source                                                                                    | 开源                                                                              |
| Get Started                                                                                    | 快速开始                                                                          |
| Run it, Next (headings)                                                                        | 如何运行 (如何使用 on a skill page), 下一步                                       |
| Get the most out of it (tip title)                                                             | 使用技巧                                                                          |
| Frequently Asked Questions                                                                     | 常见问题                                                                          |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
