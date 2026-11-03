# tr-TR translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into Turkish. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural Turkish that reads as though it was written in Turkish from the start, as fluent as the English.
- Never translate literally. A calque keeps the English structure under Turkish words, and it reads stiff:
  - ❌ "Bu hem yeni hem de var olan projelerde çalışır ve bir API anahtarına ihtiyaç duymaz."
  - ✅ "**Lagune** yeni projelerde de mevcut projelerde de çalışır ve API anahtarı gerektirmez."
  - ❌ "Her uygulanan düzeltmenin tuttuğunu kanıtlayın, sonra yapanları kapatın."
  - ✅ "Uygulanan her düzeltmenin işe yaradığını kanıtlayın, ardından kanıtlananları takipten çıkarın."
  - ❌ "Düzeltme ajan tarafından uygulanır."
  - ✅ "Düzeltmeyi ajan uygular."
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Address the reader as "siz", in lowercase ("siz", "sizin", "projeniz"), and use the plural imperative for instructions ("Kurun", "Çalıştırın"). A prompt the reader sends to the agent addresses the agent as "sen" ("Kontrol et", "Ekle"), as people write to an assistant.
- Write complete sentences. Never cut a thought short with an em dash, a semicolon, or a full stop where the sentence calls for a comma, a colon, or parentheses.
- Cut the words that add nothing, never the meaning. Prefer the verb to the noun phrase built from it ("kurmak", not "kurulum işlemini gerçekleştirmek"), and prefer the active voice to a passive "ajan tarafından uygulanır".
- Prefer the Turkish word where one is in everyday use ("güvenlik açığı", "kod tabanı", "eklenti"), and keep the English term only where Turkish developers use it as is ("prompt", "hook", "commit").
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in Turkey, keeping the English technical terms they also search for (such as OWASP, CVSS, hardening, prompt, Claude Code), and write each FAQ question the way a user in Turkey would ask it.

## Typography

- Use sentence case for titles and labels, never English title case ("Başlarken", "Her yapay zeka ajanı için güvenlik"). Capitalize the dotted "i" as "İ" ("İzinler", "İş akışı").
- In titles and labels, the word after a colon starts in lowercase unless it is a proper name or a command ("/lagune-detect: sisteminizin ne yaptığını tespit edin"). In prose, a complete sentence after a colon starts with a capital letter, as TDK writes it.
- Attach a case suffix to a proper name, an abbreviation, or a number with a straight apostrophe, with the vowel harmony of the name as it is written ("**Lagune**'nin", never "**Lagune**'un", "**Lagune**'yi", "OWASP'ın", "CVSS'e", "2026'da"). The apostrophe and suffix sit outside the bold. Never attach a suffix to inline code. Give the code a head noun that carries the suffix instead ("`secrets` hook'u", "`/lagune-detect` komutunu", "`.lagune/` klasöründe").
- Quote with straight double quotes (`"`), never curly quotes, and write the apostrophe as a straight apostrophe. Since the suffix apostrophe is everywhere in Turkish, wrap any frontmatter value or JavaScript string (such as a FAQ question or answer) that holds one in double quotes, since a single-quoted value ends at the apostrophe.
- Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write counts the Turkish way, with a full stop in a number of four digits or more ("1.200 dosya", "12.000"), and put the percent sign before the number ("%50").
- A noun after a number stays singular ("3 bulgu", "birkaç ajan"), and a placeholder count follows the same rule ("{count} ajan daha").
- Titles and labels carry no trailing full stop, and tab labels and buttons use a noun or the bare imperative ("Yolları belirt", "Kur").
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a user in Turkey would type, addressing the agent as "sen" ("kontrol et", "ekle"), while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("ve/veya", a date such as "03/11"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                           | tr-TR                                                                                                                               |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                           | unchanged, taking suffixes after an apostrophe as written ("**Lagune**'nin", "**Lagune**'yi", "SDH'nin")                            |
| `/lagune-charter` and every other command                                                         | unchanged, with "komut" carrying the suffix ("`/lagune-plan` komutunu çalıştırın")                                                  |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                   | unchanged                                                                                                                           |
| hardening (noun), security hardening                                                              | sıkılaştırma, güvenlik sıkılaştırması, keeping "hardening" in keywords                                                              |
| harden (verb)                                                                                     | sıkılaştırmak                                                                                                                       |
| charter (the principles it holds)                                                                 | güvenlik ilkeleri                                                                                                                   |
| charter, detect, plan, harden, verify (as phase names)                                            | unchanged, with "faz" carrying the suffix where the sentence needs one ("charter fazı", "verify fazında", "detect fazının analizi") |
| governing layer, convention (SDH as one)                                                          | yönetici katman, yaklaşım                                                                                                           |
| engine                                                                                            | motor ("deterministik motor")                                                                                                       |
| deterministic                                                                                     | deterministik                                                                                                                       |
| Development flow, Blue Team flow, workflow                                                        | geliştirme akışı, Blue Team akışı, iş akışı                                                                                         |
| universal (the `/lagune` command, the install route)                                              | evrensel                                                                                                                            |
| context, context-aware                                                                            | bağlam, bağlama duyarlı                                                                                                             |
| audit                                                                                             | denetlemek, denetim                                                                                                                 |
| map (what the system does, its risks)                                                             | belirlemek, haritasını çıkarmak                                                                                                     |
| record (a finding, a category)                                                                    | kaydetmek                                                                                                                           |
| finding                                                                                           | bulgu                                                                                                                               |
| concern (one the user describes to detect)                                                        | endişe                                                                                                                              |
| evidence                                                                                          | kanıt                                                                                                                               |
| fix                                                                                               | düzeltme                                                                                                                            |
| control                                                                                           | güvenlik kontrolü, kontrol                                                                                                          |
| hold (a control, a fix)                                                                           | işe yaramak, etkili olmak                                                                                                           |
| prove, proof, proof of concept                                                                    | kanıtlamak, ispat, Proof of Concept (PoC)                                                                                           |
| verdict                                                                                           | karar                                                                                                                               |
| confront (the code with the record)                                                               | karşılaştırmak                                                                                                                      |
| reconcile                                                                                         | uzlaştırmak                                                                                                                         |
| detect map, defense plan, hardening record                                                        | tespit haritası, savunma planı, sıkılaştırma kaydı                                                                                  |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels)    | unchanged, since the artifacts write them in English                                                                                |
| specialization, catalog, category                                                                 | uzmanlık, katalog, kategori                                                                                                         |
| built-in (specialization)                                                                         | yerleşik                                                                                                                            |
| distill, shadow (a built-in, with a specialization of your own)                                   | özünü çıkarmak, gölgelemek                                                                                                          |
| stand down, close out                                                                             | takipten çıkarmak ("tüm zincirde takipten çıkarır"), kapatmak                                                                       |
| closable, closability (security)                                                                  | güvenlik kapatılabilir, kapatılabilirlik                                                                                            |
| at rest, settled (the cycle)                                                                      | durgun                                                                                                                              |
| artifact, memory (the phase artifacts)                                                            | artefakt, bellek                                                                                                                    |
| chain (the phase artifacts together)                                                              | zincir ("tüm zincir")                                                                                                               |
| tracking, tracking map, tracked item                                                              | takip, takip haritası, takip edilen öğe                                                                                             |
| vulnerability, risk, exploit                                                                      | güvenlik açığı, keeping "zafiyet" in keywords, risk, exploit                                                                        |
| prompt injection, path traversal, prototype pollution, data races, type juggling, class pollution | unchanged and lowercase, as Turkish security writing keeps them                                                                     |
| broken access control                                                                             | bozuk erişim kontrolü, as **OWASP** writes it in Turkish                                                                            |
| crafted, untrusted, hardcoded                                                                     | özel hazırlanmış, güvenilmeyen, koda gömülü                                                                                         |
| score, rate (a finding)                                                                           | puanlamak                                                                                                                           |
| false positive, sink                                                                              | yanlış pozitif, sink                                                                                                                |
| attack vector, attack surface                                                                     | saldırı vektörü, saldırı yüzeyi                                                                                                     |
| severity                                                                                          | önem derecesi ("kritik", "yüksek", "orta", "düşük" in prose, unchanged in command output)                                           |
| authentication, authorization, access control                                                     | kimlik doğrulama, yetkilendirme, erişim kontrolü                                                                                    |
| secret, credential                                                                                | gizli bilgi, kimlik bilgisi                                                                                                         |
| login, file uploads, payments                                                                     | oturum açma, dosya yükleme, ödemeler                                                                                                |
| file, folder, directory, path, link                                                               | dosya, klasör, dizin, yol, bağlantı                                                                                                 |
| scan, check (hook modes)                                                                          | unchanged as mode names ("scan modu")                                                                                               |
| sweep, scan (verb and noun)                                                                       | taramak, tarama                                                                                                                     |
| flag (verb)                                                                                       | işaretlemek                                                                                                                         |
| snippet                                                                                           | kod parçası                                                                                                                         |
| codebase                                                                                          | kod tabanı, or proje where it reads better                                                                                          |
| AI agent, coding agent, agent                                                                     | yapay zeka ajanı, kodlama ajanı, ajan                                                                                               |
| prompt, plugin, hook, payload, handler, dashboard                                                 | prompt, eklenti, hook ("hook'lar"), payload, işleyici, gösterge paneli ("panel" once named)                                         |
| skill                                                                                             | beceri                                                                                                                              |
| skills CLI, CLI, terminal                                                                         | **skills** CLI aracı, keeping "skills CLI" in keywords, CLI, terminal                                                               |
| session, tool (the engine's MCP tools)                                                            | oturum, araç                                                                                                                        |
| slash command                                                                                     | slash komutu                                                                                                                        |
| test (what a test runner runs)                                                                    | test, kept apart from "ispat", which means proof                                                                                    |
| branch, commit, pull request, diff                                                                | dal, commit, pull request, diff                                                                                                     |
| report, template, library, header                                                                 | rapor, şablon, kütüphane, başlık                                                                                                    |
| deploy                                                                                            | yayına almak                                                                                                                        |
| deprecated                                                                                        | kullanımdan kaldırılmış                                                                                                             |
| live (view, dashboard)                                                                            | canlı ("canlı görünüm")                                                                                                             |
| badge                                                                                             | rozet                                                                                                                               |
| extension, package                                                                                | uzantı, paket                                                                                                                       |
| defense-only, defensive security                                                                  | yalnızca savunma odaklı, savunma güvenliği                                                                                          |
| security posture                                                                                  | güvenlik duruşu                                                                                                                     |
| advisory, responsible disclosure                                                                  | güvenlik bülteni, sorumlu ifşa                                                                                                      |
| on demand                                                                                         | talep üzerine                                                                                                                       |
| scope (of a run), in scope, out of scope                                                          | kapsam, kapsam içinde, kapsam dışında                                                                                               |
| safe by default, safe defaults                                                                    | varsayılan olarak güvenli, güvenli varsayılanlar                                                                                    |
| open-source                                                                                       | açık kaynak                                                                                                                         |
| Get Started, Install                                                                              | Başlarken, Kurulum                                                                                                                  |
| Run it, Next (headings)                                                                           | Kullanım on a command page, Çalıştırma on a hook page, Sırada ne var                                                                |
| How it works, Update, Permissions (headings)                                                      | Nasıl çalışır, Güncelleme, İzinler                                                                                                  |
| Get the most out of it (tip title)                                                                | En iyi şekilde yararlanın                                                                                                           |
| Frequently Asked Questions                                                                        | Sıkça sorulan sorular                                                                                                               |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
