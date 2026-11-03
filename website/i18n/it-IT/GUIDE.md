# it-IT translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into Italian. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural Italian that reads as though it was written in Italian from the start, as fluent as the English.
- Never translate literally. A calque keeps the English structure under Italian words, and it reads stiff:
  - ❌ "Funziona in entrambi i progetti nuovi ed esistenti e non ha bisogno di nessuna chiave API."
  - ✅ "Funziona sia nei progetti nuovi sia in quelli esistenti, e non serve alcuna chiave API."
  - ❌ "Prova che ogni correzione applicata tiene, poi chiude quelle che lo fanno."
  - ✅ "Dimostra che ogni correzione applicata regge e archivia quelle che superano la prova."
  - ❌ "La correzione è applicata dall'agente."
  - ✅ "L'agente applica la correzione."
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Address the reader as "tu", never "Lei" or "voi", with the informal imperative for instructions ("installa", "esegui"), and use sentence case for titles and labels, never English title case ("Per iniziare", not "Per Iniziare").
- Avoid the calques Italian readers notice at once, such as "fare senso" for "make sense", "realizzare" for "realize", "eventualmente" for "eventually", or "in 2026" for "nel 2026".
- Write complete sentences. Never cut a thought short with an em dash, a semicolon, or a full stop where the sentence calls for a comma, a colon, or parentheses.
- Cut the words that add nothing, never the meaning. Italian runs longer than English, so drop padding such as "effettuare l'installazione" where "installare" does the job, or "procedere all'analisi" where "analizzare" does, and prefer the active voice to a passive "viene applicata da".
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in Italy, keeping the English technical terms they also search for (such as OWASP, CVSS, hardening, prompt, Claude Code), and write each FAQ question the way a user in Italy would ask it.

## Typography

- Quote with straight double quotes (`"`), never curly quotes or angle quotes (`«»`), and use straight apostrophes ("l'agente", "dell'utente").
- Write the capital accented letter itself ("È"), never "E'".
- After a colon, start with a lowercase letter unless a proper noun or a product name follows, in titles too ("/lagune-detect: mappa il tuo sistema e i suoi rischi").
- Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write prices and counts the Italian way, with no separator in a four-digit number ("1200 file").
- Write month, weekday, and language names in lowercase, as Italian does, and keep product names in their own case.
- Titles and labels carry no trailing full stop, and tab labels and buttons use the imperative ("Indica i percorsi", "Installa").
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a user in Italy would type, addressing the agent as "tu" ("controlla", "aggiungi"), while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("e/o", "TCP/IP", a date such as "03/11"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                        | it-IT                                                                                                        |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                        | unchanged, and **Lagune** takes no article ("**Lagune** rileva"), masculine where agreement needs it         |
| `/lagune-charter` and every other command                                                      | unchanged                                                                                                    |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                | unchanged                                                                                                    |
| hardening (noun)                                                                               | hardening, masculine ("l'hardening del progetto"), as Italian security writing keeps it                      |
| harden (verb)                                                                                  | mettere in sicurezza, or rafforzare where it reads better                                                    |
| charter                                                                                        | "charter" as the phase name, "principi di sicurezza" in prose                                                |
| governing layer, convention (SDH as one)                                                       | livello di governo, convenzione                                                                              |
| detect, plan, harden, verify (as phase names)                                                  | unchanged and feminine, with "fase" where the sentence needs it ("la fase detect", "verify dimostra")        |
| engine                                                                                         | motore ("il motore deterministico")                                                                          |
| deterministic                                                                                  | deterministico                                                                                               |
| Development flow, Blue Team flow, workflow                                                     | flusso di sviluppo, flusso Blue Team, flusso di lavoro                                                       |
| universal (the `/lagune` command, the install route)                                           | universale                                                                                                   |
| context, context-aware                                                                         | contesto, sensibile al contesto                                                                              |
| audit                                                                                          | verificare, or "fare l'audit di" where it reads better                                                       |
| map (what the system does, its risks)                                                          | mappare                                                                                                      |
| finding                                                                                        | rilievo                                                                                                      |
| evidence                                                                                       | evidenza                                                                                                     |
| fix                                                                                            | correzione                                                                                                   |
| control                                                                                        | controllo                                                                                                    |
| hold (a control, a fix)                                                                        | reggere                                                                                                      |
| prove, proof, proof of concept                                                                 | dimostrare, prova, proof of concept (PoC)                                                                    |
| verdict                                                                                        | verdetto                                                                                                     |
| confront (the code with the record)                                                            | confrontare                                                                                                  |
| reconcile                                                                                      | riconciliare                                                                                                 |
| detect map, defense plan, hardening record                                                     | mappa di detect, piano di difesa, registro di hardening                                                      |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels) | unchanged, since the artifacts write them in English                                                         |
| specialization, catalog, category                                                              | specializzazione, catalogo, categoria                                                                        |
| built-in (specialization)                                                                      | integrata                                                                                                    |
| distill, shadow (a built-in)                                                                   | distillare, oscurare                                                                                         |
| stand down, close out                                                                          | archiviare, chiudere                                                                                         |
| closable, closability (security)                                                               | "la sicurezza si può chiudere", chiudibilità                                                                 |
| at rest, settled (the cycle)                                                                   | a riposo                                                                                                     |
| artifact, memory (the phase artifacts)                                                         | artefatto, memoria                                                                                           |
| chain (the phase artifacts together)                                                           | catena ("tutta la catena")                                                                                   |
| tracking, tracking map, tracked item                                                           | tracciamento, mappa di tracciamento, elemento tracciato                                                      |
| vulnerability, risk, exploit                                                                   | vulnerabilità, rischio, exploit                                                                              |
| prompt injection, path traversal, prototype pollution, data races                              | unchanged and lowercase, as Italian security writing keeps them ("la prompt injection", "il path traversal") |
| broken access control                                                                          | controllo degli accessi inefficace                                                                           |
| crafted, untrusted, hardcoded                                                                  | costruito ad arte, non attendibile, scritto nel codice                                                       |
| score, rate (a finding)                                                                        | assegnare un punteggio, valutare                                                                             |
| false positive, sink                                                                           | falso positivo, sink                                                                                         |
| attack vector, attack surface                                                                  | vettore di attacco, superficie di attacco                                                                    |
| severity                                                                                       | gravità ("critica", "alta", "media", "bassa" in prose, unchanged in command output)                          |
| authentication, authorization, access control                                                  | autenticazione, autorizzazione, controllo degli accessi                                                      |
| secret, credential                                                                             | segreto, credenziale                                                                                         |
| login, file uploads, payments                                                                  | login, caricamento di file, pagamenti                                                                        |
| file, folder, directory, path, link                                                            | file, cartella, directory, percorso, link                                                                    |
| scan, check (hook modes)                                                                       | unchanged as mode names ("la modalità scan")                                                                 |
| sweep, scan (verb and noun)                                                                    | analizzare, analisi                                                                                          |
| flag (verb)                                                                                    | segnalare                                                                                                    |
| snippet                                                                                        | frammento di codice                                                                                          |
| codebase                                                                                       | codebase, feminine ("la codebase"), or codice where it reads better                                          |
| AI agent, agent, coding agent                                                                  | agente IA, agente, agente di programmazione                                                                  |
| prompt, plugin, hook, payload, handler                                                         | unchanged and masculine ("il prompt", "il plugin")                                                           |
| dashboard, skill                                                                               | unchanged and feminine ("la dashboard", "la skill")                                                          |
| skills CLI, CLI, terminal                                                                      | la CLI di **skills**, keeping "skills CLI" in keywords, la CLI, il terminale                                 |
| slash command                                                                                  | comando slash                                                                                                |
| session, tool                                                                                  | sessione, strumento                                                                                          |
| test (what a test runner runs)                                                                 | test, kept apart from "prova", which means proof                                                             |
| branch, commit, pull request, diff                                                             | branch, commit, pull request, diff                                                                           |
| report, template, library, header                                                              | report, template, libreria, header                                                                           |
| deploy                                                                                         | distribuire, or "fare il deploy" where it reads better                                                       |
| live (view, dashboard)                                                                         | in tempo reale                                                                                               |
| badge                                                                                          | badge                                                                                                        |
| extension, package                                                                             | estensione, pacchetto                                                                                        |
| deprecated                                                                                     | deprecato                                                                                                    |
| scope                                                                                          | ambito                                                                                                       |
| defense-only, defensive security                                                               | esclusivamente difensivo, sicurezza difensiva                                                                |
| security posture                                                                               | postura di sicurezza                                                                                         |
| advisory, responsible disclosure                                                               | bollettino di sicurezza, divulgazione responsabile                                                           |
| on demand                                                                                      | su richiesta, or "solo quando serve" where it reads better                                                   |
| safe by default, safe defaults                                                                 | sicuro per impostazione predefinita, impostazioni predefinite sicure                                         |
| open-source                                                                                    | open source                                                                                                  |
| Get Started, Install                                                                           | Per iniziare, Installazione                                                                                  |
| Run it, Next (headings)                                                                        | Come usarlo on a command page, Come eseguirlo on a hook page, Passo successivo                               |
| How it works, Update, Permissions (headings)                                                   | Come funziona, Aggiornamento, Permessi                                                                       |
| Get the most out of it (tip title)                                                             | Sfruttalo al massimo                                                                                         |
| Frequently Asked Questions                                                                     | Domande frequenti                                                                                            |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
