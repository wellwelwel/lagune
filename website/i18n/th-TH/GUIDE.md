# th-TH translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into Thai. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural, standard Thai in a neutral, professional register that reads as though it was written in Thai from the start, as fluent as the English. Never add the polite particles "ครับ" or "ค่ะ".
- Prefer the Thai that Thai developers and tech readers actually use. Where a Thai word is in everyday use, write it ("ความปลอดภัย", "ความเสี่ยง", "ช่องโหว่", "การแก้ไข", "คำสั่ง"). Where Thai developers keep the English term, keep it in Latin letters, unitalicized ("hook", "skill", "prompt", "commit"), and keep acronyms as they are ("CLI", "MCP", "API"). Where they write a common loanword in Thai script, write it that way ("ไฟล์", "โฟลเดอร์", "ปลั๊กอิน", "เทมเพลต").
- Never translate literally. A calque keeps the English structure under Thai words, and it reads stiff:
  - ❌ "มันทำงานในทั้งโปรเจกต์ใหม่และที่มีอยู่แล้ว และไม่ต้องการคีย์ API ใด ๆ"
  - ✅ "**Lagune** ใช้ได้ทั้งกับโปรเจกต์ใหม่และโปรเจกต์เดิม โดยไม่ต้องใช้คีย์ API"
  - ❌ "การแก้ไขถูกนำไปใช้โดยเอเจนต์"
  - ✅ "เอเจนต์นำการแก้ไขไปใช้"
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Address the reader as "คุณ". Write instructions as a plain verb ("ติดตั้ง", "รัน", "ดู"), never with "กรุณา" or "โปรด" padding. Titles, headings, sidebar labels, buttons, and table cells use a short noun phrase or a plain verb ("เริ่มต้นใช้งาน", "หลักการทำงาน").
- A prompt the reader sends to the agent addresses the agent with a plain verb ("ตรวจสอบ", "เพิ่ม", "แก้ไข") and "คุณ" where a pronoun is needed, as people write to an assistant.
- Prefer the active voice ("เอเจนต์นำการแก้ไขไปใช้"). Avoid the passive "ถูก" outside adverse meanings, and cut translationese such as a needless "มัน", "ซึ่ง", "การที่", or "ทำการ".
- Thai marks no plural, so write "ไฟล์", "ข้อตรวจพบ", "คำสั่ง" for one or many, and add "ต่าง ๆ" or "ทั้งหมด" only where the sentence truly needs the plurality.
- Write complete sentences. Never cut a thought short where the sentence calls for a connector ("และ", "แต่", "จึง", "เพราะ").
- Cut the words that add nothing, never the meaning, such as "ทำการติดตั้ง" where "ติดตั้ง" does the job.
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in Thailand, keeping the English technical terms they also search for (such as OWASP, CVSS, PoC, Claude Code, security hardening), and write each FAQ question the way a Thai user would ask it ("... ได้ไหม", "... คืออะไร").

## Typography

- Thai writes no space between words. A space separates clauses and sentences, and ends a sentence in place of a period. Never end a Thai sentence with a period, and never join Thai clauses with a comma or a semicolon: a space does that job. A colon may introduce a list, an example, or an explanation, as in English.
- Put a space before and after every run of Latin letters, inline code, bold product name, link, and number inside Thai text ("รันคำสั่ง `/lagune-detect` ก่อน", "ใช้ **Lagune** กับ 12 เอเจนต์"). A bare URL is always followed by a space, since Markdown and the check read any letter after it as part of the URL.
- In a list of three or more items, separate the items with a space and put "และ" or "หรือ" before the last one. A comma stays only between items written in Latin letters or code.
- Quote with straight double quotes (`"`), never curly quotes, and use straight apostrophes.
- Write numbers in Arabic digits, never Thai digits. Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write other numbers with a comma for thousands ("1,200 ไฟล์") and the percent sign right after the number ("50%").
- End a question with its question word ("ได้ไหม", "คืออะไร", "อย่างไร"), never with a question mark.
- Write "ๆ" with a space before and after it ("ต่าง ๆ").
- Never start or end a bold or italic span with punctuation or inline code when a letter touches it, since Markdown then fails to close the span. Keep the punctuation outside ("**ฐานข้อมูล**:").
- Inline code keeps the English order, and the check compares the spans one by one, so restructure the sentence around them instead of reordering them.
- Give inline code a head noun where the sentence needs one ("รันคำสั่ง `/lagune-detect`", "hook `secrets`").
- Titles and labels carry no trailing punctuation, and product names keep their own case.
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a Thai user would type, while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("และ/หรือ", a date such as "11/03"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                           | th-TH                                                                                    |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                           | unchanged                                                                                |
| `/lagune-charter` and every other command                                                         | unchanged, with "คำสั่ง" where the sentence needs a noun ("รันคำสั่ง `/lagune-plan`")    |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                   | unchanged                                                                                |
| hardening (noun), security hardening                                                              | hardening, การเสริมความปลอดภัย, keeping "security hardening" in keywords                 |
| harden (verb)                                                                                     | เสริมความปลอดภัย                                                                         |
| charter (the principles it holds)                                                                 | หลักการด้านความปลอดภัย                                                                   |
| charter, detect, plan, harden, verify (as phase names)                                            | unchanged, with "เฟส" where the sentence needs it ("เฟส detect", "ในเฟส verify")         |
| phase                                                                                             | เฟส                                                                                      |
| governing layer, convention (SDH as one)                                                          | ชั้นที่กำกับทุกเฟส, แนวปฏิบัติ                                                           |
| engine                                                                                            | เอนจิน                                                                                   |
| spec                                                                                              | สเปก, keeping "spec-driven development" in keywords                                      |
| deterministic                                                                                     | deterministic ("ขั้นตอนแบบ deterministic")                                               |
| development flow, Blue Team flow, workflow                                                        | ขั้นตอนการพัฒนา, ขั้นตอนแบบ Blue Team, เวิร์กโฟลว์                                       |
| universal (the `/lagune` command, the install route)                                              | universal                                                                                |
| context, context-aware, context window                                                            | บริบท, เข้าใจบริบท, context window (an LLM's)                                            |
| audit (noun), audit (verb)                                                                        | การตรวจสอบ, ตรวจสอบ                                                                      |
| map (what the system does, its risks)                                                             | ระบุให้ครบ, ทำแผนผัง                                                                     |
| record (a finding, a category)                                                                    | บันทึก                                                                                   |
| finding                                                                                           | ข้อตรวจพบ                                                                                |
| concern (one the user describes to detect)                                                        | ข้อกังวล                                                                                 |
| evidence (behind a finding, and what prove writes)                                                | หลักฐาน                                                                                  |
| fix                                                                                               | การแก้ไข                                                                                 |
| control                                                                                           | มาตรการควบคุมความปลอดภัย, มาตรการควบคุม                                                  |
| hold (a control, a fix)                                                                           | ยังได้ผล, ใช้ได้จริง                                                                     |
| prove, proof, proof of concept                                                                    | พิสูจน์, การพิสูจน์, proof of concept (PoC)                                              |
| verdict                                                                                           | ผลตัดสิน                                                                                 |
| confront (the code with the record)                                                               | เทียบ                                                                                    |
| reconcile                                                                                         | ปรับให้ตรงกับสภาพปัจจุบัน                                                                |
| detect map, defense plan, hardening record                                                        | แผนผังจาก detect, แผนการป้องกัน, บันทึก hardening                                        |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels)    | unchanged, since the artifacts write them in English                                     |
| specialization, catalog, category                                                                 | ความรู้เฉพาะทาง, แคตตาล็อก, หมวดหมู่                                                     |
| built-in (specialization)                                                                         | ในตัว                                                                                    |
| distill, shadow (a built-in, with a specialization of your own)                                   | กลั่นกรอง, แทนที่                                                                        |
| stand down, close out                                                                             | ปิด ("ปิดออกจากทั้งห่วงโซ่"), ปิดให้จบ                                                   |
| closable, closability (security)                                                                  | ปิดให้จบได้, การปิดให้จบได้                                                              |
| at rest, settled (the cycle)                                                                      | สิ้นสุด ("รอบการทำงานจึงสิ้นสุดลง")                                                      |
| cycle                                                                                             | รอบการทำงาน                                                                              |
| artifact, memory (the phase artifacts)                                                            | อาร์ติแฟกต์, ความจำ                                                                      |
| chain (the phase artifacts together)                                                              | ห่วงโซ่ ("ทั้งห่วงโซ่")                                                                  |
| tracking, tracking map, tracked item                                                              | การติดตาม, แผนผังการติดตาม, รายการที่ติดตาม                                              |
| vulnerability, risk, exploit                                                                      | ช่องโหว่, ความเสี่ยง, exploit, keeping "vulnerability" in keywords                       |
| prompt injection, path traversal, prototype pollution, data races, type juggling, class pollution | unchanged                                                                                |
| broken access control                                                                             | การควบคุมการเข้าถึงที่บกพร่อง (Broken Access Control) on first mention                   |
| crafted, untrusted, hardcoded                                                                     | ที่จงใจสร้างขึ้น, ไม่น่าเชื่อถือ, ฮาร์ดโค้ด                                              |
| score, rate (a finding)                                                                           | ให้คะแนน                                                                                 |
| allowlist, denylist                                                                               | รายการที่อนุญาต, รายการที่บล็อก                                                          |
| false positive, sink                                                                              | ผลบวกลวง, sink                                                                           |
| attack vector, attack surface                                                                     | ช่องทางการโจมตี, พื้นผิวการโจมตี                                                         |
| severity                                                                                          | ระดับความรุนแรง ("วิกฤต", "สูง", "ปานกลาง", "ต่ำ" in prose, unchanged in command output) |
| authentication, authorization, access control                                                     | การยืนยันตัวตน, การตรวจสอบสิทธิ์, การควบคุมการเข้าถึง                                    |
| secret, credential                                                                                | secret, ข้อมูลรับรอง                                                                     |
| login, file uploads, payments                                                                     | การล็อกอิน, การอัปโหลดไฟล์, การชำระเงิน                                                  |
| file, folder, directory, path, link                                                               | ไฟล์, โฟลเดอร์, ไดเรกทอรี, path, ลิงก์                                                   |
| scan, check (hook modes)                                                                          | unchanged as mode names ("โหมด scan")                                                    |
| checker (what a hook runs)                                                                        | ตัวตรวจ                                                                                  |
| sweep, scan (verb and noun)                                                                       | สแกน, การสแกน                                                                            |
| flag (verb)                                                                                       | ชี้ว่าเป็นปัญหา, ทำเครื่องหมาย                                                           |
| snippet                                                                                           | โค้ดตัวอย่าง                                                                             |
| repository, dependency, sub-agent, workspace                                                      | repository, dependency, ซับเอเจนต์, เวิร์กสเปซ                                           |
| codebase                                                                                          | โค้ดเบส, or โปรเจกต์ where it reads better                                               |
| project                                                                                           | โปรเจกต์                                                                                 |
| AI agent, coding agent, agent                                                                     | เอเจนต์ AI, เอเจนต์เขียนโค้ด, เอเจนต์                                                    |
| prompt, hook, payload, handler                                                                    | unchanged                                                                                |
| plugin                                                                                            | ปลั๊กอิน                                                                                 |
| dashboard                                                                                         | แดชบอร์ด                                                                                 |
| skill                                                                                             | skill                                                                                    |
| skills CLI, CLI, terminal                                                                         | **skills** CLI, CLI, เทอร์มินัล                                                          |
| session, tool (the engine's MCP tools)                                                            | เซสชัน, tool                                                                             |
| command, slash command                                                                            | คำสั่ง, คำสั่ง slash                                                                     |
| test (what a test runner runs)                                                                    | การทดสอบ, kept apart from "การพิสูจน์", which means proof                                |
| branch, commit, pull request, diff                                                                | unchanged                                                                                |
| report, template, library, header                                                                 | รายงาน, เทมเพลต, ไลบรารี, header                                                         |
| deploy                                                                                            | ดีพลอย                                                                                   |
| deprecated                                                                                        | เลิกใช้แล้ว                                                                              |
| live (view, dashboard)                                                                            | แบบเรียลไทม์ ("มุมมองแบบเรียลไทม์")                                                      |
| badge                                                                                             | badge                                                                                    |
| extension, package                                                                                | ส่วนขยาย, แพ็กเกจ                                                                        |
| install, update (verbs)                                                                           | ติดตั้ง, อัปเดต                                                                          |
| run (a command)                                                                                   | รัน                                                                                      |
| defense-only, defensive security                                                                  | เพื่อการป้องกันเท่านั้น, ความปลอดภัยเชิงป้องกัน                                          |
| security posture                                                                                  | สถานะความปลอดภัยโดยรวม                                                                   |
| advisory, responsible disclosure                                                                  | ประกาศแจ้งเตือนด้านความปลอดภัย, การเปิดเผยช่องโหว่อย่างรับผิดชอบ                         |
| prompt-on-demand, methodology                                                                     | prompt-on-demand, ระเบียบวิธี                                                            |
| on demand                                                                                         | เฉพาะเมื่อจำเป็น                                                                         |
| scope (of a run), in scope, out of scope                                                          | ขอบเขต, อยู่ในขอบเขต, อยู่นอกขอบเขต                                                      |
| safe by default, safe defaults                                                                    | ปลอดภัยตั้งแต่ค่าเริ่มต้น, ค่าเริ่มต้นที่ปลอดภัย                                         |
| open-source                                                                                       | โอเพนซอร์ส                                                                               |
| Get Started, Install                                                                              | เริ่มต้นใช้งาน, ติดตั้ง                                                                  |
| Run it, Next (headings)                                                                           | วิธีใช้ on a command page, การรัน on a hook page, ถัดไป                                  |
| How it works, Update, Permissions (headings)                                                      | หลักการทำงาน, การอัปเดต, สิทธิ์                                                          |
| Get the most out of it (tip title)                                                                | ใช้ให้ได้ประโยชน์สูงสุด                                                                  |
| Frequently Asked Questions                                                                        | คำถามที่พบบ่อย                                                                           |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
