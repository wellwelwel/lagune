# hi-IN translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into Hindi. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural, everyday Hindi in Devanagari that reads as though it was written in Hindi from the start, as fluent as the English. Never write Hinglish in Latin script.
- Prefer the plain Hindi that Indian developers and tech readers actually use over heavily Sanskritized coinages. Where a Hindi word is in everyday use, write it ("सुरक्षा", "जोखिम", "कमज़ोरी", "सुधार"). Where Indian developers say the English term, write it in Devanagari ("फ़ाइल", "प्रोजेक्ट", "कमांड", "एजेंट", "प्लगइन"), and keep acronyms in Latin script ("CLI", "MCP", "API").
- Never translate literally. A calque keeps the English structure under Hindi words, and it reads stiff:
  - ❌ "यह नए और मौजूदा दोनों प्रोजेक्ट्स में काम करता है और किसी API कुंजी की आवश्यकता नहीं रखता है।"
  - ✅ "**Lagune** नए और पुराने, दोनों तरह के प्रोजेक्ट में काम करता है, और इसके लिए किसी API कुंजी की ज़रूरत नहीं है।"
  - ❌ "सुधारों को एजेंट के द्वारा लागू किया जाता है।"
  - ✅ "एजेंट सुधार लागू करता है।"
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Address the reader as "आप". Write instructions in the polite imperative ("इंस्टॉल करें", "चलाएँ", "देखें"). Titles, headings, sidebar labels, buttons, and table cells use a short noun phrase or the polite imperative ("शुरू करें", "यह कैसे काम करता है").
- A prompt the reader sends to the agent addresses the agent with "तुम" and its imperative ("जाँचो", "जोड़ो", "ठीक करो"), as people write to an assistant.
- Prefer the active voice to "के द्वारा ... किया जाता है", and cut translationese such as a needless "यह" or "वह", "की आवश्यकता रखता है" where "चाहिए" or "ज़रूरत है" does, and chains of "के", "की", and "का".
- Write complete sentences. Never cut a thought short with an em dash, a semicolon, or a full stop where the sentence calls for a comma, a colon, or parentheses.
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in India, keeping the English technical terms they also search for (such as OWASP, CVSS, PoC, Claude Code, security hardening), and write each FAQ question the way an Indian user would ask it ("क्या ... कर सकता हूँ?", "... क्या है?").

## Grammar and gender

Hindi verbs agree with the noun's gender, so a term keeps one gender everywhere:

- Masculine: **Lagune**, एजेंट, इंजन, प्रोजेक्ट, प्लगइन, हुक, चरण, सुधार, जोखिम, निष्कर्ष, नियंत्रण, सबूत, प्रमाण, फ़ैसला, कैटलॉग, आर्टिफ़ैक्ट, डैशबोर्ड, टूल, सेशन, पैकेज, कोड, टेम्पलेट, कमिट.
- Feminine: कमांड, फ़ाइल, स्किल, विशेषज्ञता, श्रेणी, कमज़ोरी, चेन, योजना, रिपोर्ट, लाइब्रेरी, ब्रांच, डायरेक्टरी, सेटिंग, ट्रैकिंग.
- A phase name kept in English ("detect", "verify") is masculine, through "चरण".

## Typography

- End a sentence with the Hindi full stop "।", with no space before it. Use ASCII for every other mark: `,` `:` `?` `!` and `()`.
- Quote with straight double quotes (`"`), never curly quotes, as the rest of the project does.
- Write the nukta in loanwords ("फ़ाइल", "ज़रूरी", "फ़ैसला", "ड्राफ़्ट"), and write the standard forms "गए", "गई", "जाएँ", "करें", "हैं", "में".
- Write numbers in Western digits, never Devanagari digits. Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write counts with a thousands comma ("1,200 फ़ाइलें") and the percent sign after the number ("50%").
- Postpositions are separate words, so one follows a bold product name or inline code after a space ("**Lagune** का", "`.lagune/` फ़ोल्डर में"). Give inline code a head noun where the sentence needs one ("`/lagune-detect` कमांड चलाएँ", "`secrets` हुक").
- Follow a bare URL with a space, since Markdown and the check read any letter after it as part of the URL.
- Never start or end a bold or italic span with punctuation or inline code when a letter touches it, since Markdown then fails to close the span. Keep the punctuation outside ("**डेटाबेस**:").
- Inline code keeps the English order, and the check compares the spans one by one, so restructure the sentence around them instead of reordering them.
- A slash command followed by a colon keeps the ASCII colon and a space, as in a title such as "/lagune-charter: सुरक्षा सिद्धांत तय करें".
- Titles and labels carry no trailing full stop, and Latin product names keep their own case.
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what an Indian user would type, addressing the agent with "तुम" ("जाँचो", "जोड़ो"), while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("और/या", a date such as "11/03"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                           | hi-IN                                                                                         |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                           | unchanged                                                                                     |
| `/lagune-charter` and every other command                                                         | unchanged, with "कमांड" where the sentence needs a noun ("`/lagune-plan` कमांड चलाएँ")        |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                   | unchanged                                                                                     |
| hardening (noun), security hardening                                                              | हार्डनिंग, सुरक्षा हार्डनिंग, keeping "security hardening" in keywords                        |
| harden (verb)                                                                                     | सुरक्षा मज़बूत करना, मज़बूत करना                                                              |
| charter (the principles it holds)                                                                 | सुरक्षा सिद्धांत                                                                              |
| charter, detect, plan, harden, verify (as phase names)                                            | unchanged, with "चरण" where the sentence needs it ("detect चरण", "verify चरण में")            |
| phase                                                                                             | चरण                                                                                           |
| governing layer, convention (SDH as one)                                                          | सभी चरणों को दिशा देने वाली परत, कन्वेंशन                                                     |
| engine                                                                                            | इंजन                                                                                          |
| spec                                                                                              | स्पेक, keeping "spec-driven development" in keywords                                          |
| deterministic                                                                                     | नियतात्मक                                                                                     |
| development flow, Blue Team flow, workflow                                                        | डेवलपमेंट फ़्लो, Blue Team फ़्लो, वर्कफ़्लो                                                   |
| universal (the `/lagune` command, the install route)                                              | यूनिवर्सल                                                                                     |
| context, context-aware, context window                                                            | संदर्भ, संदर्भ को समझने वाला, कॉन्टेक्स्ट (an LLM's context window)                           |
| audit (noun), audit (verb)                                                                        | ऑडिट, ऑडिट करना                                                                               |
| map (what the system does, its risks)                                                             | पहचानना, खाका बनाना                                                                           |
| record (a finding, a category)                                                                    | दर्ज करना                                                                                     |
| finding                                                                                           | निष्कर्ष                                                                                      |
| concern (one the user describes to detect)                                                        | चिंता                                                                                         |
| evidence (behind a finding, and what prove writes)                                                | सबूत                                                                                          |
| fix                                                                                               | सुधार                                                                                         |
| control                                                                                           | सुरक्षा नियंत्रण, नियंत्रण                                                                    |
| hold (a control, a fix)                                                                           | कारगर रहना, टिकना                                                                             |
| prove, proof, proof of concept                                                                    | साबित करना, प्रमाण, प्रूफ़ ऑफ़ कॉन्सेप्ट (PoC)                                                |
| verdict                                                                                           | फ़ैसला                                                                                        |
| confront (the code with the record)                                                               | मिलान करना                                                                                    |
| reconcile                                                                                         | मौजूदा स्थिति से मिलाकर अपडेट करना                                                            |
| detect map, defense plan, hardening record                                                        | detect मैप, रक्षा योजना, हार्डनिंग रिकॉर्ड                                                    |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels)    | unchanged, since the artifacts write them in English                                          |
| specialization, catalog, category                                                                 | विशेषज्ञता, कैटलॉग, श्रेणी                                                                    |
| built-in (specialization)                                                                         | बिल्ट-इन                                                                                      |
| distill, shadow (a built-in, with a specialization of your own)                                   | सार निकालना, की जगह लेना                                                                      |
| stand down, close out                                                                             | बंद करना ("पूरी चेन से बंद करता है"), निपटाना                                                 |
| closable, closability (security)                                                                  | बंद हो सकने वाली, बंद हो पाना                                                                 |
| at rest, settled (the cycle)                                                                      | स्थिर ("चक्र स्थिर हो जाता है")                                                               |
| cycle                                                                                             | चक्र                                                                                          |
| artifact, memory (the phase artifacts)                                                            | आर्टिफ़ैक्ट, मेमोरी                                                                           |
| chain (the phase artifacts together)                                                              | चेन ("पूरी चेन")                                                                              |
| tracking, tracking map, tracked item                                                              | ट्रैकिंग, ट्रैकिंग मैप, ट्रैक किया गया आइटम                                                   |
| vulnerability, risk, exploit                                                                      | कमज़ोरी, जोखिम, एक्सप्लॉइट, keeping "vulnerability" in keywords                               |
| prompt injection, path traversal, prototype pollution, data races, type juggling, class pollution | प्रॉम्प्ट इंजेक्शन, पाथ ट्रैवर्सल, प्रोटोटाइप पॉल्यूशन, डेटा रेस, टाइप जगलिंग, क्लास पॉल्यूशन |
| broken access control                                                                             | कमज़ोर एक्सेस कंट्रोल (Broken Access Control) on first mention                                |
| crafted, untrusted, hardcoded                                                                     | जान-बूझकर गढ़ा गया, अविश्वसनीय, हार्डकोड किया गया                                             |
| score, rate (a finding)                                                                           | स्कोर देना                                                                                    |
| allowlist, denylist                                                                               | अनुमति सूची, ब्लॉक सूची                                                                       |
| false positive, sink                                                                              | फ़ॉल्स पॉज़िटिव, सिंक                                                                         |
| attack vector, attack surface                                                                     | अटैक वेक्टर, अटैक सरफ़ेस                                                                      |
| severity                                                                                          | गंभीरता ("क्रिटिकल", "उच्च", "मध्यम", "निम्न" in prose, unchanged in command output)          |
| authentication, authorization, access control                                                     | ऑथेंटिकेशन, ऑथराइज़ेशन, एक्सेस कंट्रोल                                                        |
| secret, credential                                                                                | सीक्रेट, क्रेडेंशियल                                                                          |
| login, file uploads, payments                                                                     | लॉगिन, फ़ाइल अपलोड, पेमेंट                                                                    |
| file, folder, directory, path, link                                                               | फ़ाइल, फ़ोल्डर, डायरेक्टरी, पाथ, लिंक                                                         |
| scan, check (hook modes)                                                                          | unchanged as mode names ("scan मोड")                                                          |
| sweep, scan (verb and noun)                                                                       | स्कैन करना, स्कैन                                                                             |
| flag (verb)                                                                                       | पकड़ना                                                                                        |
| snippet                                                                                           | कोड का टुकड़ा                                                                                 |
| codebase                                                                                          | कोडबेस, or प्रोजेक्ट where it reads better                                                    |
| AI agent, coding agent, agent                                                                     | AI एजेंट, कोडिंग एजेंट, एजेंट                                                                 |
| prompt, plugin, hook, payload, handler, dashboard                                                 | प्रॉम्प्ट, प्लगइन, हुक, पेलोड, हैंडलर, डैशबोर्ड                                               |
| skill                                                                                             | स्किल                                                                                         |
| skills CLI, CLI, terminal                                                                         | **skills** CLI, CLI, टर्मिनल                                                                  |
| session, tool (the engine's MCP tools)                                                            | सेशन, टूल                                                                                     |
| command, slash command                                                                            | कमांड, स्लैश कमांड                                                                            |
| test (what a test runner runs)                                                                    | टेस्ट, kept apart from "प्रमाण", which means proof                                            |
| branch, commit, pull request, diff                                                                | ब्रांच, कमिट, पुल रिक्वेस्ट, diff                                                             |
| report, template, library, header                                                                 | रिपोर्ट, टेम्पलेट, लाइब्रेरी, हेडर                                                            |
| deploy                                                                                            | डिप्लॉय करना                                                                                  |
| deprecated                                                                                        | अप्रचलित                                                                                      |
| live (view, dashboard)                                                                            | लाइव                                                                                          |
| badge                                                                                             | बैज                                                                                           |
| extension, package                                                                                | एक्सटेंशन, पैकेज                                                                              |
| defense-only, defensive security                                                                  | केवल रक्षा के लिए, रक्षात्मक सुरक्षा                                                          |
| security posture                                                                                  | सुरक्षा स्थिति                                                                                |
| advisory, responsible disclosure                                                                  | सुरक्षा एडवाइज़री, ज़िम्मेदार खुलासा                                                          |
| prompt-on-demand, methodology                                                                     | प्रॉम्प्ट-ऑन-डिमांड, पद्धति                                                                   |
| on demand                                                                                         | ज़रूरत पड़ने पर ही                                                                            |
| scope (of a run), in scope, out of scope                                                          | दायरा, दायरे में, दायरे से बाहर                                                               |
| safe by default, safe defaults                                                                    | डिफ़ॉल्ट रूप से सुरक्षित, सुरक्षित डिफ़ॉल्ट                                                   |
| open-source                                                                                       | ओपन सोर्स                                                                                     |
| Get Started, Install                                                                              | शुरू करें, इंस्टॉल करें                                                                       |
| Run it, Next (headings)                                                                           | इस्तेमाल कैसे करें on a command page, चलाएँ on a hook page, आगे क्या                          |
| How it works, Update, Permissions (headings)                                                      | यह कैसे काम करता है, अपडेट, अनुमतियाँ                                                         |
| Get the most out of it (tip title)                                                                | पूरा फ़ायदा उठाएँ                                                                             |
| Frequently Asked Questions                                                                        | अक्सर पूछे जाने वाले सवाल                                                                     |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
