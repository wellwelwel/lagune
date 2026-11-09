# da-DK translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into the Danish of Denmark. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural, plain Danish that reads as though it was written in Danish from the start, as fluent as the English. Danish technical writing is short and direct, so keep it that way.
- Prefer the Danish that Danish developers actually use. Where a Danish word is in everyday use, write it ("sårbarhed", "rettelse", "fil", "mappe"). Where they keep the English term, keep it ("prompt", "hook", "commit", "pull request") and inflect it the Danish way ("prompten", "hooken", "committet").
- Never translate literally. A calque keeps the English structure under Danish words, and it reads stiff:
  - ❌ "Det virker i både nye og eksisterende projekter og behøver ingen API nøgle."
  - ✅ "Det virker i nye såvel som eksisterende projekter og kræver ingen API-nøgle."
  - ❌ "Bevis at hver anvendt rettelse holder, luk så dem der gør."
  - ✅ "Påvis, at hver gennemført rettelse holder, og afslut dem, der består."
  - ❌ "Rettelsen bliver anvendt af agenten."
  - ✅ "Agenten gennemfører rettelsen."
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Address the reader as "du", always in lowercase ("du", "din", "dig"), never "De", and use the imperative for instructions. A verb in "-ere" takes the accent in the imperative ("Installér", "Kopiér", "Kør", "Åbn").
- A prompt the reader sends to the agent addresses it the same way, with "du" and the imperative ("tjek", "tilføj", "ret").
- Prefer the verb to the noun built from it ("installere", not "foretage installationen af"), and prefer the active voice to a passive "bliver ... af" or "-es af".
- Avoid anglicisms that are calques: "giver mening" is fine, but "i 2026" stays "i 2026" and "realize" is "indse", never "realisere".
- Write complete sentences. Never cut a thought short with an em dash, a semicolon, or a full stop where the sentence calls for a comma, a colon, or parentheses.
- Cut the words that add nothing, never the meaning.
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in Denmark, keeping the English technical terms they also search for (such as OWASP, CVSS, hardening, prompt, Claude Code), and write each FAQ question the way a Danish user would ask it.

## Typography

- Danish capitalizes proper nouns only, so titles, headings, labels, and buttons use sentence case, never English title case ("Kom i gang", "Sikkerhed for enhver AI-agent").
- After a colon, capitalize the next word only when a complete sentence follows, an imperative included ("/lagune-detect: Kortlæg dit system"), and otherwise write it in lowercase ("Hook crypto: find svag kryptografi").
- Put a comma before every subordinate clause (the "startkomma") as well as after one that opens the sentence ("Kør `/lagune-detect`, før du planlægger", "Påvis, at rettelsen holder", "Når planen er klar, kører du `/lagune-harden`").
- Write compounds as one word ("sikkerhedsprincip", "angrebsflade"). Join with a hyphen where one part is an abbreviation, a number, or a code-like term ("AI-agent", "API-nøgle", "OWASP-kategori", "JSON-fil"), and before the last part where the first is a multi-word English term ("Blue Team-workflow"). Where one part is a bold product name, rephrase instead of compounding ("pluginnet til **Claude Code**", not "**Claude Code**-pluginnet").
- Never add a genitive "s" to a bold product name or to inline code, since it breaks the span. Rephrase ("kommandoerne i **Lagune**", "konfigurationen af `lagune`").
- Quote with straight double quotes (`"`), never the Danish quotes (`»«` or `„”`), and use straight apostrophes.
- Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write other numbers the Danish way, with a full stop for thousands ("1.200 filer") and a space before the percent sign ("50 %").
- Titles and labels carry no trailing full stop, and tab labels and buttons use the imperative or a short noun ("Angiv stier", "Installér").
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a user in Denmark would type, addressing the agent as "du", while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("og/eller", a date such as "03/11"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                           | da-DK                                                                                                                 |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                           | unchanged, neuter where a pronoun is unavoidable ("det"), and never with a genitive "s" ("kommandoerne i **Lagune**") |
| `/lagune-charter` and every other command                                                         | unchanged, with "kommandoen" where the sentence needs a noun ("kør kommandoen `/lagune-plan`")                        |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                   | unchanged                                                                                                             |
| hardening (noun), security hardening                                                              | hærdning ("hærdning af projektet"), sikkerhedshærdning, keeping "hardening" in keywords                               |
| harden (verb)                                                                                     | hærde, or "styrke sikkerheden" where it reads better                                                                  |
| charter (the principles it holds)                                                                 | sikkerhedsprincipper                                                                                                  |
| charter, detect, plan, harden, verify (as phase names)                                            | unchanged, with "fase" where the sentence needs it ("fasen detect", "verify påviser")                                 |
| phase                                                                                             | fase                                                                                                                  |
| governing layer, convention (SDH as one)                                                          | det overordnede lag, konvention                                                                                       |
| engine                                                                                            | motor ("den deterministiske motor")                                                                                   |
| spec                                                                                              | spec ("en spec"), keeping "spec-driven development" in keywords                                                       |
| deterministic                                                                                     | deterministisk                                                                                                        |
| development flow, Blue Team flow, workflow                                                        | udviklingsworkflow, or dev-workflow where space is tight (the sidebar), Blue Team-workflow, workflow ("et workflow")  |
| universal (the `/lagune` command, the install route)                                              | universel                                                                                                             |
| context, context-aware, context window                                                            | kontekst, kontekstbevidst, kontekstvindue                                                                             |
| audit (noun), audit (verb)                                                                        | gennemgang, gennemgå, keeping "audit" in keywords                                                                     |
| map (what the system does, its risks)                                                             | kortlægge                                                                                                             |
| record (a finding, a category)                                                                    | registrere                                                                                                            |
| finding                                                                                           | fund ("et fund", "fundene")                                                                                           |
| concern (one the user describes to detect)                                                        | bekymring                                                                                                             |
| evidence (behind a finding, and what prove writes)                                                | belæg                                                                                                                 |
| fix                                                                                               | rettelse                                                                                                              |
| control                                                                                           | sikkerhedskontrol, or kontrol where the context is clear                                                              |
| hold (a control, a fix)                                                                           | holde                                                                                                                 |
| prove, proof, proof of concept                                                                    | påvise, bevis, proof of concept (PoC)                                                                                 |
| verdict                                                                                           | afgørelse                                                                                                             |
| confront (the code with the record)                                                               | holde op mod                                                                                                          |
| reconcile                                                                                         | afstemme                                                                                                              |
| detect map, defense plan, hardening record                                                        | kortlægning, forsvarsplan, hærdningslog                                                                               |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels)    | unchanged, since the artifacts write them in English                                                                  |
| specialization, catalog, category                                                                 | specialisering, katalog, kategori                                                                                     |
| built-in (specialization)                                                                         | indbygget                                                                                                             |
| distill, shadow (a built-in, with a specialization of your own)                                   | destillere, overskygge                                                                                                |
| stand down, close out                                                                             | tage ud ("tage ud af hele kæden"), afslutte                                                                           |
| closable, closability (security)                                                                  | kan afsluttes ("sikkerhed kan afsluttes"), rephrased with the verb rather than a noun                                 |
| at rest, settled (the cycle)                                                                      | i hvile ("cyklussen er i hvile")                                                                                      |
| cycle                                                                                             | cyklus                                                                                                                |
| artifact, memory (the phase artifacts)                                                            | artefakt, hukommelse                                                                                                  |
| chain (the phase artifacts together)                                                              | kæde ("hele kæden")                                                                                                   |
| tracking, tracking map, tracked item                                                              | sporing, sporingskort, sporet punkt                                                                                   |
| vulnerability, risk, exploit                                                                      | sårbarhed, risiko, exploit                                                                                            |
| prompt injection, path traversal, prototype pollution, data races, type juggling, class pollution | unchanged and in lowercase, as Danish security writing keeps them                                                     |
| broken access control                                                                             | mangelfuld adgangskontrol, with "(Broken Access Control)" on first mention                                            |
| crafted, untrusted, hardcoded                                                                     | manipuleret, ikke-betroet, hardcodet                                                                                  |
| score, rate (a finding)                                                                           | score, vurdere                                                                                                        |
| allowlist, denylist                                                                               | tilladelsesliste, blokeringsliste                                                                                     |
| false positive, sink                                                                              | falsk positiv, sink                                                                                                   |
| attack vector, attack surface                                                                     | angrebsvektor, angrebsflade                                                                                           |
| severity                                                                                          | alvorlighed ("kritisk", "høj", "middel", "lav" in prose, unchanged in command output)                                 |
| authentication, authorization, access control                                                     | autentificering, autorisation, adgangskontrol                                                                         |
| secret, credential                                                                                | secret ("en secret", "secrets"), loginoplysninger                                                                     |
| login, file uploads, payments                                                                     | login, filupload, betalinger                                                                                          |
| file, folder, directory, path, link                                                               | fil, mappe, mappe, sti, link                                                                                          |
| scan, check (hook modes)                                                                          | unchanged as mode names ("tilstanden scan")                                                                           |
| checker (what a hook runs)                                                                        | tjek ("et tjek")                                                                                                      |
| sweep, scan (verb and noun)                                                                       | gennemsøge, scanning                                                                                                  |
| flag (verb)                                                                                       | markere                                                                                                               |
| snippet                                                                                           | kodeuddrag                                                                                                            |
| repository, dependency, sub-agent, workspace                                                      | repository ("et repository"), afhængighed, subagent, arbejdsområde                                                    |
| codebase                                                                                          | kodebase, or projekt where it reads better                                                                            |
| project                                                                                           | projekt                                                                                                               |
| AI agent, coding agent, agent                                                                     | AI-agent, kodeagent, agent                                                                                            |
| prompt, hook, payload, handler                                                                    | unchanged and common gender ("prompten", "hooken", "en payload", "en handler")                                        |
| plugin, dashboard                                                                                 | unchanged and neuter ("pluginnet", "dashboardet")                                                                     |
| skill                                                                                             | unchanged and common gender ("en skill", "skills")                                                                    |
| skills CLI, CLI, terminal                                                                         | CLI'en fra **skills**, keeping "skills CLI" in keywords, CLI'en, terminalen                                           |
| session, tool (the engine's MCP tools)                                                            | session, værktøj                                                                                                      |
| command, slash command                                                                            | kommando, slash-kommando                                                                                              |
| test (what a test runner runs)                                                                    | test, kept apart from "bevis", which means proof                                                                      |
| branch, commit, pull request, diff                                                                | branch, commit, pull request, diff                                                                                    |
| report, template, library, header                                                                 | rapport, skabelon, bibliotek, header                                                                                  |
| deploy                                                                                            | udrulle                                                                                                               |
| deprecated                                                                                        | udfaset                                                                                                               |
| live (view, dashboard)                                                                            | live ("livevisningen")                                                                                                |
| badge                                                                                             | badge                                                                                                                 |
| extension, package                                                                                | udvidelse, pakke                                                                                                      |
| install, update (verbs)                                                                           | installere, opdatere                                                                                                  |
| run (a command)                                                                                   | køre                                                                                                                  |
| defense-only, defensive security                                                                  | udelukkende defensiv, defensiv sikkerhed                                                                              |
| security posture                                                                                  | sikkerhedsniveau                                                                                                      |
| advisory, responsible disclosure                                                                  | sikkerhedsmeddelelse, ansvarlig offentliggørelse (responsible disclosure)                                             |
| prompt-on-demand, methodology                                                                     | prompt-on-demand, metode                                                                                              |
| on demand                                                                                         | efter behov                                                                                                           |
| scope (of a run), in scope, out of scope                                                          | omfang, inden for omfanget, uden for omfanget                                                                         |
| safe by default, safe defaults                                                                    | sikker som standard, sikre standardindstillinger                                                                      |
| open-source                                                                                       | open source ("et open source-projekt")                                                                                |
| Get Started, Install                                                                              | Kom i gang, Installation                                                                                              |
| Run it, Next (headings)                                                                           | Brug on a command page, Kørsel on a hook page, Næste trin                                                             |
| How it works, Update, Permissions (headings)                                                      | Sådan virker det, Opdatering, Tilladelser                                                                             |
| Get the most out of it (tip title)                                                                | Få mest muligt ud af det                                                                                              |
| Frequently Asked Questions                                                                        | Ofte stillede spørgsmål                                                                                               |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
