# pt-BR translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into Brazilian Portuguese. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural Brazilian Portuguese that reads as though it was written in Portuguese from the start, as fluent as the English.
- Never translate literally. A calque keeps the English structure under Portuguese words, and it reads stiff:
  - ❌ "Ele funciona em ambos os projetos novos e existentes e não precisa de nenhuma chave API."
  - ✅ "Funciona tanto em projetos novos quanto em existentes e não precisa de chave de API."
  - ❌ "Prove que cada correção aplicada segura, então encerre as que fazem."
  - ✅ "Comprove que cada correção aplicada se sustenta e encerre as que passarem."
  - ❌ "A correção é aplicada pelo agente."
  - ✅ "O agente aplica a correção."
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Write complete sentences. Never cut a thought short with an em dash, a semicolon, or a period where the sentence calls for a comma, a colon, or parentheses.
- Cut the words that add nothing, never the meaning. Portuguese runs longer than English, so drop padding such as "realize a instalação" where "instale" does the job.
- Use straight quotes and apostrophes, never curly ones, and never break lines by hand in the middle of prose.
- Address the reader as "você", and use sentence case for titles and labels, never English title case ("Primeiros passos", not "Primeiros Passos").
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in Portuguese, keeping the English technical terms they also search for, and write each FAQ question the way a Brazilian user would ask it.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a Brazilian user would type, while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("e/ou", "TCP/IP", a date such as "03/11"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, quoted, in the same count and order. Every other inline code stays exactly as in English.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay.

## Glossary

| English                                                                                        | pt-BR                                                                                  |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening                                                     | unchanged, and **Lagune** is masculine ("o Lagune")                                    |
| `/lagune-charter` and every other command                                                      | unchanged                                                                              |
| Blue Team, CVSS, OWASP, JWT, CORS                                                              | unchanged                                                                              |
| hardening                                                                                      | unchanged, as a noun ("o hardening do projeto", "aplicar hardening")                   |
| harden (verb)                                                                                  | "fortalecer a segurança de", or "proteger" where it reads better                       |
| charter                                                                                        | "charter" as the phase name, "princípios de segurança" in prose                        |
| detect, plan, harden, verify (as phase names)                                                  | unchanged ("a fase detect", "o verify comprova")                                       |
| engine                                                                                         | engine ("o engine", "o engine determinístico")                                         |
| finding                                                                                        | achado                                                                                 |
| fix                                                                                            | correção                                                                               |
| control                                                                                        | controle                                                                               |
| prove, proof                                                                                   | comprovar, prova                                                                       |
| verdict                                                                                        | veredito                                                                               |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels) | unchanged, since the artifacts write them in English                                   |
| specialization, catalog, category                                                              | especialização, catálogo, categoria                                                    |
| built-in (specialization)                                                                      | nativa                                                                                 |
| stand down                                                                                     | encerrar                                                                               |
| at rest, settled (the cycle)                                                                   | em repouso                                                                             |
| artifact                                                                                       | artefato                                                                               |
| tracking map, tracked item                                                                     | mapa de rastreamento, item rastreado                                                   |
| attack vector, attack surface                                                                  | vetor de ataque, superfície de ataque                                                  |
| severity                                                                                       | severidade ("crítica", "alta", "média", "baixa" in prose, unchanged in command output) |
| scan, check (hook modes)                                                                       | unchanged as mode names ("o modo scan")                                                |
| sweep, scan (verb and noun)                                                                    | varrer, varredura                                                                      |
| flag (verb)                                                                                    | sinalizar                                                                              |
| snippet                                                                                        | trecho                                                                                 |
| codebase                                                                                       | código, or projeto where it reads better                                               |
| AI agent                                                                                       | agente de IA                                                                           |
| prompt, skill, plugin, hook, dashboard, payload, handler                                       | unchanged                                                                              |
| open-source                                                                                    | open source                                                                            |
| Get Started                                                                                    | Primeiros passos                                                                       |
| Run it, Next (headings)                                                                        | Como executar (Como usar on a skill page), Próximo passo                               |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
