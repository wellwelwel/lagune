# no-NO translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into Norwegian Bokmål. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural Norwegian Bokmål in a neutral, professional register that reads as though it was written in Norwegian from the start, as fluent as the English. Never mix in Nynorsk forms.
- Never translate literally. A calque keeps the English structure under Norwegian words, and it reads stiff:
  - ❌ "Det fungerer i både nye og eksisterende prosjekter og trenger ikke noen API nøkkel."
  - ✅ "Det fungerer i nye og eksisterende prosjekter, uten API-nøkkel."
  - ❌ "Utbedringen blir anvendt av agenten."
  - ✅ "Agenten tar i bruk utbedringen."
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Address the reader as "du" ("du", "din", "deg"), never "De", and use the imperative for instructions ("Installer", "Kjør").
- Write complete sentences. Never cut a thought short with an em dash, a semicolon, or a full stop where the sentence calls for a comma, a colon, or parentheses.
- Cut the words that add nothing, never the meaning. Prefer the verb to the noun built from it ("installere", not "utføre installasjonen"), and prefer the active voice to a passive "blir ... av".
- Avoid anglicisms that are calques: "2026", never "i 2026", and "håndtere" for "address", never "adressere".
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in Norway, keeping the English technical terms they also search for (such as OWASP, CVSS, hardening, prompt, Claude Code), and write each FAQ question the way a user in Norway would ask it.

## Typography

- Use sentence case for titles and labels, never English title case ("Kom i gang", "Sikkerhet for alle KI-agenter").
- Write compounds as one word, never split them ("sikkerhetsprinsipp", "angrepsflate", never "sikkerhets prinsipp"). Join a compound with a hyphen wherever one part is an abbreviation, a code term, or a multi-word English term ("KI-agent", "API-nøkkel", "OWASP-kategori", "Blue Team-flyt"). Where one part is a bold product name or inline code, rephrase instead of compounding ("pluginen for **Claude Code**", not "**Claude Code**-pluginen").
- A bold product name and inline code take no suffix: never attach a definite ending or a genitive "s" to them. Rephrase instead ("kommandoene i **Lagune**", "hooken `secrets`").
- After a colon, capitalize the next word only when a complete sentence follows, an imperative included ("/lagune-detect: Kartlegg systemet ditt"), and otherwise write it in lowercase ("Katalog: sikkerhetsspesialiseringer ved behov").
- Quote with straight double quotes (`"`), never the Norwegian angle quotes (`«»`) or curly quotes, and use straight apostrophes.
- Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write counts the Norwegian way, with no separator in a four-digit number ("1200 filer") and a space in larger ones ("12 000 filer"), and write a percentage with a space before the sign ("50 %").
- Titles and labels carry no trailing full stop, and tab labels and buttons use the imperative or a noun ("Oppgi stier", "Installer").
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a user in Norway would type, addressing the agent as "du" ("sjekk", "legg til"), while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("og/eller", a date such as "03/11"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                           | no-NO                                                                                           |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                           | unchanged, with no suffix on **Lagune** ("kommandoene i **Lagune**")                            |
| `/lagune-charter` and every other command                                                         | unchanged, with "kommandoen" where the sentence needs a noun ("kjør kommandoen `/lagune-plan`") |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                   | unchanged                                                                                       |
| hardening (noun), security hardening                                                              | herding, sikkerhetsherding, keeping "hardening" in keywords                                     |
| harden (verb)                                                                                     | herde, or "styrke sikkerheten" where it reads better                                            |
| charter (the principles it holds)                                                                 | sikkerhetsprinsipper                                                                            |
| charter, detect, plan, harden, verify (as phase names)                                            | unchanged, with "fasen" where the sentence needs it ("fasen charter", "verify beviser")         |
| phase                                                                                             | fase                                                                                            |
| governing layer, convention (SDH as one)                                                          | overordnet lag, konvensjon                                                                      |
| spec                                                                                              | spesifikasjon                                                                                   |
| engine                                                                                            | motor ("den deterministiske motoren")                                                           |
| deterministic                                                                                     | deterministisk                                                                                  |
| development flow, Blue Team flow, workflow                                                        | utviklingsflyt, Blue Team-flyt, arbeidsflyt                                                     |
| universal (the `/lagune` command, the install route)                                              | universell                                                                                      |
| context, context-aware, context window                                                            | kontekst, kontekstbevisst, kontekstvindu                                                        |
| audit (noun), audit (verb)                                                                        | revisjon, revidere                                                                              |
| map (what the system does, its risks)                                                             | kartlegge                                                                                       |
| record (a finding, a category)                                                                    | registrere                                                                                      |
| finding                                                                                           | funn                                                                                            |
| concern (one the user describes to detect)                                                        | problemstilling                                                                                 |
| evidence (behind a finding, and what prove writes)                                                | belegg                                                                                          |
| fix                                                                                               | utbedring                                                                                       |
| control                                                                                           | sikringstiltak, or tiltak where the context is clear                                            |
| hold (a control, a fix)                                                                           | holde                                                                                           |
| prove, proof, proof of concept                                                                    | bevise, bevis, proof of concept (PoC)                                                           |
| verdict                                                                                           | konklusjon                                                                                      |
| confront (the code with the record)                                                               | holde opp mot                                                                                   |
| reconcile                                                                                         | avstemme                                                                                        |
| detect map, defense plan, hardening record                                                        | kartleggingen, forsvarsplanen, herdingsloggen                                                   |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels)    | unchanged, since the artifacts write them in English                                            |
| specialization, catalog, category                                                                 | spesialisering, katalog, kategori                                                               |
| built-in (specialization)                                                                         | innebygd                                                                                        |
| distill, shadow (a built-in, with a specialization of your own)                                   | destillere, overstyre                                                                           |
| stand down, close out                                                                             | ta ut ("ta ut av hele kjeden"), lukke                                                           |
| closable, closability (security)                                                                  | lukkbar, lukkbarhet                                                                             |
| at rest, settled (the cycle)                                                                      | i ro                                                                                            |
| cycle                                                                                             | syklus                                                                                          |
| artifact, memory (the phase artifacts)                                                            | artefakt, minne                                                                                 |
| chain (the phase artifacts together)                                                              | kjede ("hele kjeden")                                                                           |
| tracking, tracking map, tracked item                                                              | sporing, sporingskart, sporet element                                                           |
| vulnerability, risk, exploit                                                                      | sårbarhet, risiko, exploit                                                                      |
| prompt injection, path traversal, prototype pollution, data races, type juggling, class pollution | unchanged and lowercase, as Norwegian security writing keeps them                               |
| broken access control                                                                             | brutt tilgangskontroll                                                                          |
| crafted, untrusted, hardcoded                                                                     | manipulert, ikke-klarert, hardkodet                                                             |
| allowlist, denylist                                                                               | tillatelsesliste, blokkeringsliste                                                              |
| score, rate (a finding)                                                                           | vurdere, score                                                                                  |
| false positive, sink                                                                              | falsk positiv, sink                                                                             |
| attack vector, attack surface                                                                     | angrepsvektor, angrepsflate                                                                     |
| severity                                                                                          | alvorlighetsgrad ("kritisk", "høy", "middels", "lav" in prose, unchanged in command output)     |
| authentication, authorization, access control                                                     | autentisering, autorisasjon, tilgangskontroll                                                   |
| secret, credential                                                                                | hemmelighet, påloggingsdetaljer                                                                 |
| login, file uploads, payments                                                                     | innlogging, filopplasting, betalinger                                                           |
| file, folder, directory, path, link                                                               | fil, mappe, mappe, sti, lenke                                                                   |
| scan, check (hook modes)                                                                          | unchanged as mode names ("modusen scan")                                                        |
| checker (what a hook runs)                                                                        | kontroll                                                                                        |
| sweep, scan (verb and noun)                                                                       | skanne, gjennomgang                                                                             |
| flag (verb)                                                                                       | flagge                                                                                          |
| snippet                                                                                           | kodeutdrag                                                                                      |
| codebase                                                                                          | kodebase, or prosjekt where it reads better                                                     |
| repository, dependency, sub-agent, workspace                                                      | repository, avhengighet, underagent, arbeidsområde                                              |
| AI agent, coding agent, agent                                                                     | KI-agent, kodeagent, agent                                                                      |
| project                                                                                           | prosjekt                                                                                        |
| prompt, hook, payload, handler                                                                    | prompt, hook, payload, handler ("prompten", "hooken")                                           |
| plugin                                                                                            | plugin ("pluginen", "pluginene")                                                                |
| dashboard                                                                                         | dashbord ("dashbordet")                                                                         |
| skill                                                                                             | skill ("skillen", "skillene")                                                                   |
| skills CLI, CLI, terminal                                                                         | CLI-en til **skills**, keeping "skills CLI" in keywords, CLI-en, terminalen                     |
| session, tool (the engine's MCP tools)                                                            | økt, verktøy                                                                                    |
| command, slash command                                                                            | kommando, skråstrekkommando                                                                     |
| test (what a test runner runs)                                                                    | test, kept apart from "bevis", which means proof                                                |
| branch, commit, pull request, diff                                                                | branch, commit, pull request, diff                                                              |
| report, template, library, header                                                                 | rapport, mal, bibliotek, header                                                                 |
| deploy                                                                                            | rulle ut                                                                                        |
| deprecated                                                                                        | utfaset                                                                                         |
| live (view, dashboard)                                                                            | live ("live-visning")                                                                           |
| badge                                                                                             | merke                                                                                           |
| extension, package                                                                                | utvidelse, pakke                                                                                |
| install, update (verbs)                                                                           | installere, oppdatere                                                                           |
| run (a command)                                                                                   | kjøre                                                                                           |
| defense-only, defensive security                                                                  | kun defensiv, defensiv sikkerhet                                                                |
| security posture                                                                                  | sikkerhetsnivå                                                                                  |
| advisory, responsible disclosure                                                                  | sikkerhetsvarsel, ansvarlig varsling                                                            |
| on demand                                                                                         | ved behov                                                                                       |
| prompt-on-demand, methodology                                                                     | prompt-on-demand, metodikk                                                                      |
| scope (of a run), in scope, out of scope                                                          | omfang, innenfor omfanget, utenfor omfanget                                                     |
| safe by default, safe defaults                                                                    | sikker som standard, sikre standardinnstillinger                                                |
| open-source                                                                                       | åpen kildekode ("et prosjekt med åpen kildekode")                                               |
| Get Started, Install                                                                              | Kom i gang, Installasjon                                                                        |
| Run it, Next (headings)                                                                           | Bruk on a command page, Kjør on a hook page, Neste steg                                         |
| How it works, Update, Permissions (headings)                                                      | Slik fungerer det, Oppdatering, Tillatelser                                                     |
| Get the most out of it (tip title)                                                                | Få mest mulig ut av det                                                                         |
| Frequently Asked Questions                                                                        | Vanlige spørsmål                                                                                |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
