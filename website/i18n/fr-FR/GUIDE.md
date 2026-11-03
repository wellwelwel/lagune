# fr-FR translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into the French of France. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural French that reads as though it was written in French from the start, as fluent as the English.
- Never translate literally. A calque keeps the English structure under French words, and it reads stiff:
  - ❌ "Il fonctionne dans les deux nouveaux et existants projets et ne nécessite aucune clé API."
  - ✅ "Il fonctionne aussi bien dans un nouveau projet que dans un projet existant, sans clé d'API."
  - ❌ "Prouvez que chaque correctif appliqué tient, puis fermez ceux qui le font."
  - ✅ "Prouvez que chaque correctif appliqué est efficace, puis clôturez ceux qui passent la preuve."
  - ❌ "Le correctif est appliqué par l'agent."
  - ✅ "L'agent applique le correctif."
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Address the reader as "vous", never "tu", and use the imperative plural for instructions ("Installez", "Exécutez").
- Write complete sentences. Never cut a thought short with an em dash, a semicolon, or a full stop where the sentence calls for a comma, a colon, or parentheses.
- Cut the words that add nothing, never the meaning. French runs longer than English, so prefer the verb to the noun built from it ("installer", not "procéder à l'installation"), and prefer the active voice to a passive "est appliqué par".
- Avoid anglicisms that are calques: "avoir du sens", never "faire du sens", "en 2026", and "se rendre compte" for "realize", never "réaliser".
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in France, keeping the English technical terms they also search for (such as OWASP, CVSS, hardening, prompt, Claude Code), and write each FAQ question the way a user in France would ask it.

## Typography

- Use sentence case for titles and labels, never English title case ("Premiers pas", "La sécurité pour tout agent IA"), and lowercase after a colon unless a proper noun follows.
- Put a no-break space (U+00A0) before `:`, `?`, and `!` in prose, as French typography does, and never before them inside code. A colon right after a command keeps the English form, with no space ("/lagune-detect: cartographier votre système"), since the check reads the command and its colon as one token.
- Quote with straight double quotes (`"`), never French guillemets (`«»`) or curly quotes, and use straight apostrophes ("l'agent").
- Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write counts the French way, with a no-break space in a four-digit number ("1 200 fichiers").
- Titles and labels carry no trailing full stop, and tab labels and buttons use the infinitive ("Indiquer des chemins", "Installer").
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a user in France would type, addressing the agent as "tu" ("analyse", "ajoute"), while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("et/ou", "TCP/IP", a date such as "03/11"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                        | fr-FR                                                                                                                |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                        | unchanged, and **Lagune** takes no article ("les commandes de **Lagune**"), with "il" where a pronoun is unavoidable |
| `/lagune-charter` and every other command                                                      | unchanged                                                                                                            |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                | unchanged                                                                                                            |
| hardening (noun), security hardening                                                           | durcissement ("le durcissement du projet"), durcissement de la sécurité, keeping "hardening" in keywords             |
| harden (verb)                                                                                  | durcir, or "renforcer la sécurité" where it reads better                                                             |
| charter (the principles it holds)                                                              | principes de sécurité                                                                                                |
| charter, detect, plan, harden, verify (as phase names)                                         | unchanged and feminine, with "phase" where the sentence needs it ("la phase charter", "verify prouve")               |
| governing layer, convention (SDH as one)                                                       | couche de gouvernance, convention                                                                                    |
| engine                                                                                         | moteur ("le moteur déterministe")                                                                                    |
| deterministic                                                                                  | déterministe                                                                                                         |
| Development flow, Blue Team flow, workflow                                                     | flux de développement, or Développement where space is tight (the sidebar), flux Blue Team, workflow                 |
| universal (the `/lagune` command, the install route)                                           | universel                                                                                                            |
| context, context-aware                                                                         | contexte, adapté au contexte                                                                                         |
| audit                                                                                          | auditer, audit                                                                                                       |
| map (what the system does, its risks)                                                          | cartographier                                                                                                        |
| record (a finding, a category)                                                                 | consigner, enregistrer                                                                                               |
| finding                                                                                        | constat                                                                                                              |
| concern (one the user describes to detect)                                                     | préoccupation                                                                                                        |
| evidence                                                                                       | élément de preuve                                                                                                    |
| fix                                                                                            | correctif                                                                                                            |
| control                                                                                        | mesure de protection, or mesure where the context is clear                                                           |
| hold (a control, a fix)                                                                        | être efficace, tenir                                                                                                 |
| prove, proof, proof of concept                                                                 | prouver, preuve, preuve de concept (PoC)                                                                             |
| verdict                                                                                        | verdict                                                                                                              |
| confront (the code with the record)                                                            | confronter                                                                                                           |
| reconcile                                                                                      | mettre en cohérence                                                                                                  |
| detect map, defense plan, hardening record                                                     | cartographie, plan de défense, registre de durcissement                                                              |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels) | unchanged, since the artifacts write them in English                                                                 |
| specialization, catalog, category                                                              | spécialisation, catalogue, catégorie                                                                                 |
| built-in (specialization)                                                                      | intégrée                                                                                                             |
| distill, shadow (a built-in, with a specialization of your own)                                | condenser, masquer                                                                                                   |
| stand down, close out                                                                          | retirer ("retirer de toute la chaîne"), clôturer                                                                     |
| closable, closability (security)                                                               | clôturable, le fait que la sécurité puisse être clôturée                                                             |
| at rest, settled (the cycle)                                                                   | au repos                                                                                                             |
| artifact, memory (the phase artifacts)                                                         | artefact, mémoire                                                                                                    |
| chain (the phase artifacts together)                                                           | chaîne ("toute la chaîne")                                                                                           |
| tracking, tracking map, tracked item                                                           | suivi, carte de suivi, élément suivi                                                                                 |
| vulnerability, risk, exploit                                                                   | vulnérabilité, risque, exploit                                                                                       |
| prompt injection, prototype pollution, class pollution                                         | injection de prompt, pollution de prototype, pollution de classe                                                     |
| path traversal, data races, type juggling                                                      | unchanged ("le path traversal"), as French security writing keeps them                                               |
| broken access control                                                                          | contrôle d'accès défaillant, as **OWASP** writes it in French                                                        |
| crafted, untrusted, hardcoded                                                                  | forgé, non fiable, codé en dur                                                                                       |
| score, rate (a finding)                                                                        | noter, évaluer                                                                                                       |
| false positive, sink                                                                           | faux positif, sink                                                                                                   |
| attack vector, attack surface                                                                  | vecteur d'attaque, surface d'attaque                                                                                 |
| severity                                                                                       | gravité ("critique", "élevée", "moyenne", "faible" in prose, unchanged in command output)                            |
| authentication, authorization, access control                                                  | authentification, autorisation, contrôle d'accès                                                                     |
| secret, credential                                                                             | secret, identifiants                                                                                                 |
| login, file uploads, payments                                                                  | connexion, envoi de fichiers, paiements                                                                              |
| file, folder, directory, path, link                                                            | fichier, dossier, répertoire, chemin, lien                                                                           |
| scan, check (hook modes)                                                                       | unchanged as mode names ("le mode scan")                                                                             |
| sweep, scan (verb and noun)                                                                    | analyser, analyse                                                                                                    |
| flag (verb)                                                                                    | signaler                                                                                                             |
| snippet                                                                                        | extrait de code                                                                                                      |
| codebase                                                                                       | base de code, or projet where it reads better                                                                        |
| AI agent, coding agent, agent                                                                  | agent IA, agent de programmation, agent                                                                              |
| prompt, plugin, hook, payload, handler, dashboard                                              | prompt, plugin, hook, payload, handler, tableau de bord ("le prompt", "le plugin", "le hook", "le payload")          |
| skill                                                                                          | unchanged and masculine ("le skill")                                                                                 |
| skills CLI, CLI, terminal                                                                      | la CLI **skills**, keeping "skills CLI" in keywords, la CLI, le terminal                                             |
| session, tool (the engine's MCP tools)                                                         | session, outil                                                                                                       |
| slash command                                                                                  | commande slash                                                                                                       |
| test (what a test runner runs)                                                                 | test, kept apart from "preuve", which means proof                                                                    |
| branch, commit, pull request, diff                                                             | branche, commit, pull request, diff                                                                                  |
| report, template, library, header                                                              | rapport, modèle, bibliothèque, en-tête                                                                               |
| deploy                                                                                         | déployer                                                                                                             |
| deprecated                                                                                     | obsolète                                                                                                             |
| live (view, dashboard)                                                                         | en direct                                                                                                            |
| badge                                                                                          | badge                                                                                                                |
| extension, package                                                                             | extension, paquet                                                                                                    |
| defense-only, defensive security                                                               | exclusivement défensif, sécurité défensive                                                                           |
| security posture                                                                               | posture de sécurité                                                                                                  |
| advisory, responsible disclosure                                                               | avis de sécurité, divulgation responsable                                                                            |
| on demand                                                                                      | à la demande                                                                                                         |
| scope (of a run), in scope, out of scope                                                       | périmètre, dans le périmètre, hors périmètre                                                                         |
| safe by default, safe defaults                                                                 | sûr par défaut, valeurs par défaut sûres                                                                             |
| open-source                                                                                    | open source ("un projet open source")                                                                                |
| Get Started, Install                                                                           | Premiers pas, Installation                                                                                           |
| Run it, Next (headings)                                                                        | Utilisation on a command page, Exécution on a hook page, Étape suivante                                              |
| How it works, Update, Permissions (headings)                                                   | Fonctionnement, Mise à jour, Autorisations                                                                           |
| Get the most out of it (tip title)                                                             | Tirer le meilleur parti                                                                                              |
| Frequently Asked Questions                                                                     | Questions fréquentes                                                                                                 |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
