# id-ID translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into Indonesian. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural, standard Indonesian (bahasa Indonesia baku, but not stiff) that reads as though it was written in Indonesian from the start, as fluent as the English.
- Prefer the Indonesian that Indonesian developers and tech readers actually use. Where an Indonesian word is in everyday use, write it ("keamanan", "risiko", "kerentanan", "perbaikan", "perintah"). Where Indonesian developers keep the English term, keep it unitalicized ("hook", "plugin", "skill", "prompt", "commit"), and keep acronyms as they are ("CLI", "MCP", "API").
- Never translate literally. A calque keeps the English structure under Indonesian words, and it reads stiff:
  - ❌ "Ia bekerja di kedua proyek baru dan yang sudah ada dan tidak membutuhkan kunci API apa pun."
  - ✅ "**Lagune** bekerja di proyek baru maupun lama, tanpa perlu kunci API."
  - ❌ "Perbaikan diterapkan oleh agen."
  - ✅ "Agen menerapkan perbaikan."
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Address the reader as "Anda", always capitalized. Write instructions in the plain imperative ("Instal", "Jalankan", "Lihat"), never with "silakan" or "-lah" padding. Titles, headings, sidebar labels, buttons, and table cells use a short noun phrase or the imperative, in sentence case ("Mulai", "Cara kerjanya"), never English title case.
- A prompt the reader sends to the agent addresses the agent with the plain imperative ("Periksa", "Tambahkan", "Perbaiki") and "kamu" where a pronoun is needed, as people write to an assistant.
- Prefer the active voice ("Agen menerapkan perbaikan") where the passive "di-" form would hide who acts, and cut translationese such as a needless "hal ini", "yang mana", "adapun", or "dalam rangka".
- Indonesian marks no plural, so write "file", "temuan", "perintah" for one or many, and never reduplicate a loanword ("file-file"). Reduplicate an Indonesian word only where the sentence truly needs it.
- Write complete sentences. Never cut a thought short with an em dash, a semicolon, or a period where the sentence calls for a comma, a colon, or parentheses.
- Cut the words that add nothing, never the meaning, such as "melakukan instalasi" where "instal" does the job.
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in Indonesia, keeping the English technical terms they also search for (such as OWASP, CVSS, PoC, Claude Code, security hardening), and write each FAQ question the way an Indonesian user would ask it ("Apakah saya bisa ...?", "Apa itu ...?").

## Typography

- Quote with straight double quotes (`"`), never curly quotes, and use straight apostrophes.
- Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write other numbers the Indonesian way, with a period for thousands ("1.200 file") and the percent sign right after the number ("50%").
- Follow a bare URL with a space, since Markdown and the check read any letter after it as part of the URL.
- Never start or end a bold or italic span with punctuation or inline code when a letter touches it, since Markdown then fails to close the span. Keep the punctuation outside ("**basis data**:").
- Inline code keeps the English order, and the check compares the spans one by one, so restructure the sentence around them instead of reordering them.
- Give inline code a head noun where the sentence needs one ("jalankan perintah `/lagune-detect`", "hook `secrets`").
- Titles and labels carry no trailing period, and product names keep their own case.
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what an Indonesian user would type, while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("dan/atau", a date such as "11/03"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                           | id-ID                                                                                            |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                           | unchanged                                                                                        |
| `/lagune-charter` and every other command                                                         | unchanged, with "perintah" where the sentence needs a noun ("jalankan perintah `/lagune-plan`")  |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                   | unchanged                                                                                        |
| hardening (noun), security hardening                                                              | hardening, hardening keamanan, keeping "security hardening" in keywords                          |
| harden (verb)                                                                                     | memperkuat keamanan, memperkuat                                                                  |
| charter (the principles it holds)                                                                 | prinsip keamanan                                                                                 |
| charter, detect, plan, harden, verify (as phase names)                                            | unchanged, with "fase" where the sentence needs it ("fase detect", "di fase verify")             |
| phase                                                                                             | fase                                                                                             |
| governing layer, convention (SDH as one)                                                          | lapisan yang mengarahkan semua fase, konvensi                                                    |
| engine                                                                                            | engine                                                                                           |
| spec                                                                                              | spesifikasi, keeping "spec-driven development" in keywords                                       |
| deterministic                                                                                     | deterministik                                                                                    |
| development flow, Blue Team flow, workflow                                                        | alur pengembangan, alur Blue Team, alur kerja                                                    |
| universal (the `/lagune` command, the install route)                                              | universal                                                                                        |
| context, context-aware, context window                                                            | konteks, peka konteks, context window (an LLM's)                                                 |
| audit (noun), audit (verb)                                                                        | audit, mengaudit                                                                                 |
| map (what the system does, its risks)                                                             | memetakan                                                                                        |
| record (a finding, a category)                                                                    | mencatat                                                                                         |
| finding                                                                                           | temuan                                                                                           |
| concern (one the user describes to detect)                                                        | kekhawatiran                                                                                     |
| evidence (behind a finding, and what prove writes)                                                | bukti                                                                                            |
| fix                                                                                               | perbaikan                                                                                        |
| control                                                                                           | kontrol keamanan, kontrol                                                                        |
| hold (a control, a fix)                                                                           | bertahan, tetap efektif                                                                          |
| prove, proof, proof of concept                                                                    | membuktikan, pembuktian, proof of concept (PoC)                                                  |
| verdict                                                                                           | putusan                                                                                          |
| confront (the code with the record)                                                               | mencocokkan                                                                                      |
| reconcile                                                                                         | menyelaraskan dengan kondisi terkini                                                             |
| detect map, defense plan, hardening record                                                        | peta detect, rencana pertahanan, catatan hardening                                               |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels)    | unchanged, since the artifacts write them in English                                             |
| specialization, catalog, category                                                                 | spesialisasi, katalog, kategori                                                                  |
| built-in (specialization)                                                                         | bawaan                                                                                           |
| distill, shadow (a built-in, with a specialization of your own)                                   | menyarikan, menggantikan                                                                         |
| stand down, close out                                                                             | menutup ("menutupnya dari seluruh rantai"), menuntaskan                                          |
| closable, closability (security)                                                                  | bisa dituntaskan, ketertuntasan                                                                  |
| at rest, settled (the cycle)                                                                      | tuntas ("siklus pun tuntas")                                                                     |
| cycle                                                                                             | siklus                                                                                           |
| artifact, memory (the phase artifacts)                                                            | artefak, memori                                                                                  |
| chain (the phase artifacts together)                                                              | rantai ("seluruh rantai")                                                                        |
| tracking, tracking map, tracked item                                                              | pelacakan, peta pelacakan, item yang dilacak                                                     |
| vulnerability, risk, exploit                                                                      | kerentanan, risiko, eksploit, keeping "vulnerability" in keywords                                |
| prompt injection, path traversal, prototype pollution, data races, type juggling, class pollution | unchanged                                                                                        |
| broken access control                                                                             | kontrol akses yang rusak (Broken Access Control) on first mention                                |
| crafted, untrusted, hardcoded                                                                     | sengaja dirancang, tidak tepercaya, hardcoded                                                    |
| score, rate (a finding)                                                                           | memberi skor                                                                                     |
| allowlist, denylist                                                                               | daftar izin, daftar blokir                                                                       |
| false positive, sink                                                                              | positif palsu, sink                                                                              |
| attack vector, attack surface                                                                     | vektor serangan, permukaan serangan                                                              |
| severity                                                                                          | tingkat keparahan ("kritis", "tinggi", "sedang", "rendah" in prose, unchanged in command output) |
| authentication, authorization, access control                                                     | autentikasi, otorisasi, kontrol akses                                                            |
| secret, credential                                                                                | secret, kredensial                                                                               |
| login, file uploads, payments                                                                     | login, unggahan file, pembayaran                                                                 |
| file, folder, directory, path, link                                                               | file, folder, direktori, path, tautan                                                            |
| scan, check (hook modes)                                                                          | unchanged as mode names ("mode scan")                                                            |
| sweep, scan (verb and noun)                                                                       | memindai, pemindaian                                                                             |
| flag (verb)                                                                                       | menandai                                                                                         |
| snippet                                                                                           | potongan kode                                                                                    |
| codebase                                                                                          | basis kode, or proyek where it reads better                                                      |
| AI agent, coding agent, agent                                                                     | agen AI, agen coding, agen                                                                       |
| prompt, plugin, hook, payload, handler                                                            | unchanged                                                                                        |
| dashboard                                                                                         | dasbor                                                                                           |
| skill                                                                                             | skill                                                                                            |
| skills CLI, CLI, terminal                                                                         | **skills** CLI, CLI, terminal                                                                    |
| session, tool (the engine's MCP tools)                                                            | sesi, tool                                                                                       |
| command, slash command                                                                            | perintah, perintah slash                                                                         |
| test (what a test runner runs)                                                                    | tes, kept apart from "pembuktian", which means proof                                             |
| branch, commit, pull request, diff                                                                | unchanged                                                                                        |
| report, template, library, header                                                                 | laporan, templat, pustaka, header                                                                |
| deploy                                                                                            | men-deploy                                                                                       |
| deprecated                                                                                        | usang                                                                                            |
| live (view, dashboard)                                                                            | langsung ("tampilan langsung")                                                                   |
| badge                                                                                             | badge                                                                                            |
| extension, package                                                                                | ekstensi, paket                                                                                  |
| defense-only, defensive security                                                                  | khusus pertahanan, keamanan defensif                                                             |
| security posture                                                                                  | postur keamanan                                                                                  |
| advisory, responsible disclosure                                                                  | advisori keamanan, pengungkapan yang bertanggung jawab                                           |
| prompt-on-demand, methodology                                                                     | prompt-on-demand, metodologi                                                                     |
| on demand                                                                                         | hanya saat dibutuhkan                                                                            |
| scope (of a run), in scope, out of scope                                                          | cakupan, dalam cakupan, di luar cakupan                                                          |
| safe by default, safe defaults                                                                    | aman secara bawaan, default yang aman                                                            |
| open-source                                                                                       | open source                                                                                      |
| Get Started, Install                                                                              | Mulai, Instal                                                                                    |
| Run it, Next (headings)                                                                           | Cara menggunakan on a command page, Menjalankan on a hook page, Selanjutnya                      |
| How it works, Update, Permissions (headings)                                                      | Cara kerjanya, Pembaruan, Izin                                                                   |
| Get the most out of it (tip title)                                                                | Manfaatkan sepenuhnya                                                                            |
| Frequently Asked Questions                                                                        | Pertanyaan yang sering diajukan                                                                  |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
