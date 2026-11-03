# es-ES translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into the Spanish of Spain. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural Spanish of Spain that reads as though it was written in Spanish from the start, as fluent as the English.
- Never translate literally. A calque keeps the English structure under Spanish words, and it reads stiff:
  - ❌ "Funciona en ambos proyectos nuevos y existentes y no necesita ninguna clave API."
  - ✅ "Funciona tanto en proyectos nuevos como en los que ya existen, y no necesita clave de API."
  - ❌ "Prueba que cada corrección aplicada sostiene, luego cierra las que lo hacen."
  - ✅ "Demuestra que cada corrección aplicada se sostiene y cierra las que superen la prueba."
  - ❌ "La corrección es aplicada por el agente."
  - ✅ "El agente aplica la corrección."
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Address the reader as "tú", never "usted" or "vosotros", and use sentence case for titles and labels, never English title case ("Primeros pasos", not "Primeros Pasos").
- Write the Spanish of Spain: "ordenador", "archivo", "enlace", "móvil", and "ejecutar" a command, never "correr" it. Avoid Latin American usage such as "computadora", "celular", "checar", or "aplicar a".
- Write complete sentences. Never cut a thought short with an em dash, a semicolon, or a full stop where the sentence calls for a comma, a colon, or parentheses.
- Cut the words that add nothing, never the meaning. Spanish runs longer than English, so drop padding such as "realizar la instalación" where "instalar" does the job, or "llevar a cabo un análisis" where "analizar" does, and prefer the active voice to a passive "es aplicada por".
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in Spain, keeping the English technical terms they also search for (such as OWASP, CVSS, hardening, prompt, Claude Code), and write each FAQ question the way a user in Spain would ask it.

## Typography

- Open every question and exclamation with "¿" and "¡".
- Quote with straight double quotes (`"`), never curly quotes or angle quotes (`«»`), and use straight apostrophes.
- Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write prices and counts the Spanish way, with no separator in a four-digit number ("1200 archivos").
- Write month, weekday, and language names in lowercase, as Spanish does, and keep Latin product names in their own case.
- Titles and labels carry no trailing full stop, and tab labels and buttons use the infinitive ("Indicar rutas", "Instalar").
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a user in Spain would type, addressing the agent as "tú" ("revisa", "añade"), while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("y/o", "TCP/IP", a date such as "03/11"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                        | es-ES                                                                                                   |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                        | unchanged, and **Lagune** takes no article ("**Lagune** detecta"), masculine where agreement needs it   |
| `/lagune-charter` and every other command                                                      | unchanged                                                                                               |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                | unchanged                                                                                               |
| hardening (noun)                                                                               | bastionado ("el bastionado del proyecto"), keeping "hardening" in keywords                              |
| harden (verb)                                                                                  | bastionar, or "reforzar la seguridad de" where it reads better                                          |
| charter                                                                                        | "charter" as the phase name, "principios de seguridad" in prose                                         |
| governing layer, convention (SDH as one)                                                       | capa rectora, convención                                                                                |
| detect, plan, harden, verify (as phase names)                                                  | unchanged and masculine, with "fase" where the sentence needs it ("la fase detect", "verify demuestra") |
| engine                                                                                         | motor ("el motor determinista")                                                                         |
| deterministic                                                                                  | determinista                                                                                            |
| Development flow, Blue Team flow, workflow                                                     | flujo de desarrollo, flujo Blue Team, flujo de trabajo                                                  |
| universal (the `/lagune` command, the install route)                                           | universal                                                                                               |
| context, context-aware                                                                         | contexto, adaptado al contexto                                                                          |
| audit                                                                                          | auditar                                                                                                 |
| map (what the system does, its risks)                                                          | identificar                                                                                             |
| finding                                                                                        | hallazgo                                                                                                |
| evidence                                                                                       | evidencia                                                                                               |
| fix                                                                                            | corrección                                                                                              |
| control                                                                                        | control                                                                                                 |
| prove, proof, proof of concept                                                                 | demostrar, prueba, prueba de concepto (PoC)                                                             |
| verdict                                                                                        | veredicto                                                                                               |
| confront (the code with the record)                                                            | contrastar                                                                                              |
| reconcile                                                                                      | conciliar                                                                                               |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels) | unchanged, since the artifacts write them in English                                                    |
| specialization, catalog, category                                                              | especialización, catálogo, categoría                                                                    |
| built-in (specialization)                                                                      | integrada                                                                                               |
| stand down, close out                                                                          | dar de baja, cerrar                                                                                     |
| closable, closability (security)                                                               | "la seguridad se puede cerrar", posibilidad de cierre                                                   |
| at rest, settled (the cycle)                                                                   | en reposo                                                                                               |
| artifact, memory (the phase artifacts)                                                         | artefacto, memoria                                                                                      |
| chain (the phase artifacts together)                                                           | cadena ("toda la cadena")                                                                               |
| tracking, tracking map, tracked item                                                           | seguimiento, mapa de seguimiento, elemento en seguimiento                                               |
| vulnerability, risk, exploit                                                                   | vulnerabilidad, riesgo, exploit                                                                         |
| prompt injection, path traversal, prototype pollution, data races                              | inyección de prompts, recorrido de directorios, contaminación de prototipos, carreras de datos          |
| broken access control                                                                          | pérdida de control de acceso, as **OWASP** writes it in Spanish                                         |
| crafted, untrusted, hardcoded                                                                  | manipulado, no fiable, incrustado en el código                                                          |
| score, rate (a finding)                                                                        | puntuar, evaluar                                                                                        |
| false positive, sink                                                                           | falso positivo, sink                                                                                    |
| attack vector, attack surface                                                                  | vector de ataque, superficie de ataque                                                                  |
| severity                                                                                       | gravedad ("crítica", "alta", "media", "baja" in prose, unchanged in command output)                     |
| authentication, authorization, access control                                                  | autenticación, autorización, control de acceso                                                          |
| secret, credential                                                                             | secreto, credencial                                                                                     |
| login, file uploads, payments                                                                  | inicio de sesión, subida de archivos, pagos                                                             |
| file, folder, path, link                                                                       | archivo, carpeta, ruta, enlace                                                                          |
| scan, check (hook modes)                                                                       | unchanged as mode names ("el modo scan")                                                                |
| sweep, scan (verb and noun)                                                                    | analizar, análisis                                                                                      |
| flag (verb)                                                                                    | señalar                                                                                                 |
| snippet                                                                                        | fragmento de código                                                                                     |
| codebase                                                                                       | código, or proyecto where it reads better                                                               |
| AI agent, agent                                                                                | agente de IA, agente                                                                                    |
| prompt, plugin, hook, payload, handler, dashboard                                              | unchanged and masculine ("el prompt", "el plugin")                                                      |
| skill                                                                                          | unchanged and feminine ("la skill")                                                                     |
| skills CLI, CLI, terminal                                                                      | la CLI de skills, keeping "skills CLI" in keywords, la CLI, el terminal                                 |
| slash command                                                                                  | comando de barra                                                                                        |
| test (what a test runner runs)                                                                 | test, kept apart from "prueba", which means proof                                                       |
| branch, commit, pull request, diff                                                             | rama, commit, pull request, diff                                                                        |
| report, template, library, header                                                              | informe, plantilla, biblioteca, cabecera                                                                |
| deploy                                                                                         | desplegar                                                                                               |
| live (view, dashboard)                                                                         | en tiempo real                                                                                          |
| badge                                                                                          | insignia                                                                                                |
| extension, package                                                                             | extensión, paquete                                                                                      |
| defense-only, defensive security                                                               | exclusivamente defensivo, seguridad defensiva                                                           |
| security posture                                                                               | postura de seguridad                                                                                    |
| advisory, responsible disclosure                                                               | aviso de seguridad, divulgación responsable                                                             |
| on demand                                                                                      | bajo demanda, or "solo cuando hace falta" where it reads better                                         |
| safe by default, safe defaults                                                                 | seguro por defecto, valores por defecto seguros                                                         |
| open-source                                                                                    | de código abierto                                                                                       |
| Get Started, Install                                                                           | Primeros pasos, Instalación                                                                             |
| Run it, Next (headings)                                                                        | Cómo usarlo on a command page, Cómo ejecutarlo on a hook page, Siguiente paso                           |
| How it works, Update, Permissions (headings)                                                   | Cómo funciona, Actualización, Permisos                                                                  |
| Get the most out of it (tip title)                                                             | Sácale el máximo partido                                                                                |
| Frequently Asked Questions                                                                     | Preguntas frecuentes                                                                                    |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
