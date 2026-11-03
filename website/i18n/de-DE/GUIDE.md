# de-DE translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into the German of Germany. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural German that reads as though it was written in German from the start, as fluent as the English.
- Never translate literally. A calque keeps the English structure under German words, and it reads stiff:
  - ❌ "Es funktioniert in beiden neuen und existierenden Projekten und braucht keinen API Schlüssel."
  - ✅ "Es funktioniert in neuen wie in bestehenden Projekten und braucht keinen API-Schlüssel."
  - ❌ "Beweise, dass jede angewendete Korrektur hält, dann schließe die, die es tun."
  - ✅ "Weise nach, dass jede umgesetzte Korrektur greift, und schließe die ab, die den Nachweis bestehen."
  - ❌ "Die Korrektur wird durch den Agenten angewendet."
  - ✅ "Der Agent setzt die Korrektur um."
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Address the reader as "du", in lowercase ("du", "dein", "dich"), never "Sie", and use the imperative singular for instructions ("Installiere", "Führe ... aus").
- Write complete sentences. Never cut a thought short with an em dash, a semicolon, or a full stop where the sentence calls for a comma, a colon, or parentheses.
- Cut the words that add nothing, never the meaning. German drifts into a nominal style, so prefer the verb to the noun built from it ("installieren", not "die Installation durchführen"), and prefer the active voice to a passive "wird durch ... angewendet".
- Avoid anglicisms that are calques: "ergibt Sinn", never "macht Sinn", "2026", never "in 2026", and "erkennen" for "realize", never "realisieren".
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in Germany, keeping the English technical terms they also search for (such as OWASP, CVSS, hardening, prompt, Claude Code), and write each FAQ question the way a user in Germany would ask it.

## Typography

- Capitalize every noun, as German does, and use sentence case for titles and labels otherwise, never English title case ("Erste Schritte", "Sicherheit für jeden KI-Agenten").
- After a colon, capitalize the next word only when a complete sentence follows, an imperative included ("/lagune-detect: Erfasse dein System"), and otherwise only when it is a noun ("Hook crypto: schwache Kryptografie erkennen").
- Quote with straight double quotes (`"`), never the German low-high quotes (`„“`) or angle quotes (`»«`), and use straight apostrophes.
- Join a compound with a hyphen wherever one part is an abbreviation or a multi-word English term ("KI-Agent", "API-Schlüssel", "Blue-Team-Workflow", "OWASP-Kategorie"). Where one part is a bold product name, rephrase instead of compounding ("das Plugin für **Claude Code**", not "das **Claude Code**-Plugin").
- Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write counts the German way, with no separator in a four-digit number ("1200 Dateien").
- Titles and labels carry no trailing full stop, and tab labels and buttons use the infinitive ("Pfade angeben", "Installieren").
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a user in Germany would type, addressing the agent as "du" ("prüfe", "füge ... hinzu"), while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("und/oder", "TCP/IP", a date such as "03/11"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                           | de-DE                                                                                                                                   |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                           | unchanged, and **Lagune** takes no article and no genitive "s" ("die Befehle von **Lagune**"), with "es" where a pronoun is unavoidable |
| `/lagune-charter` and every other command                                                         | unchanged                                                                                                                               |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                   | unchanged                                                                                                                               |
| hardening (noun), security hardening                                                              | Härtung ("die Härtung des Projekts"), Sicherheitshärtung, keeping "hardening" in keywords                                               |
| harden (verb)                                                                                     | härten, or "die Sicherheit stärken" where it reads better                                                                               |
| charter (the principles it holds)                                                                 | Sicherheitsprinzipien                                                                                                                   |
| charter, detect, plan, harden, verify (as phase names)                                            | unchanged and feminine, with "Phase" where the sentence needs it ("die Phase charter", "verify weist nach")                             |
| governing layer, convention (SDH as one)                                                          | übergeordnete Ebene, Konvention                                                                                                         |
| engine                                                                                            | Engine ("die deterministische Engine")                                                                                                  |
| deterministic                                                                                     | deterministisch                                                                                                                         |
| Development flow, Blue Team flow, workflow                                                        | Entwicklungs-Workflow, or Dev-Workflow where space is tight (the sidebar), Blue-Team-Workflow, Workflow                                 |
| universal (the `/lagune` command, the install route)                                              | universell                                                                                                                              |
| context, context-aware                                                                            | Kontext, kontextbezogen                                                                                                                 |
| audit                                                                                             | auditieren, Audit                                                                                                                       |
| map (what the system does, its risks)                                                             | erfassen                                                                                                                                |
| record (a finding, a category)                                                                    | festhalten, eintragen                                                                                                                   |
| finding                                                                                           | Befund                                                                                                                                  |
| concern (one the user describes to detect)                                                        | Anliegen                                                                                                                                |
| evidence                                                                                          | Beleg                                                                                                                                   |
| fix                                                                                               | Korrektur                                                                                                                               |
| control                                                                                           | Schutzmaßnahme, or Maßnahme where the context is clear                                                                                  |
| hold (a control, a fix)                                                                           | greifen                                                                                                                                 |
| prove, proof, proof of concept                                                                    | nachweisen, Nachweis, Proof of Concept (PoC)                                                                                            |
| verdict                                                                                           | Urteil                                                                                                                                  |
| confront (the code with the record)                                                               | gegenüberstellen                                                                                                                        |
| reconcile                                                                                         | abgleichen                                                                                                                              |
| detect map, defense plan, hardening record                                                        | Bestandsaufnahme, Abwehrplan, Härtungsprotokoll                                                                                         |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels)    | unchanged, since the artifacts write them in English                                                                                    |
| specialization, catalog, category                                                                 | Spezialisierung, Katalog, Kategorie                                                                                                     |
| built-in (specialization)                                                                         | integriert                                                                                                                              |
| distill, shadow (a built-in, with a specialization of your own)                                   | verdichten, überdecken                                                                                                                  |
| stand down, close out                                                                             | austragen ("aus der gesamten Kette austragen"), abschließen                                                                             |
| closable, closability (security)                                                                  | abschließbar, Abschließbarkeit                                                                                                          |
| at rest, settled (the cycle)                                                                      | im Ruhezustand                                                                                                                          |
| artifact, memory (the phase artifacts)                                                            | Artefakt, Gedächtnis                                                                                                                    |
| chain (the phase artifacts together)                                                              | Kette ("die gesamte Kette")                                                                                                             |
| tracking, tracking map, tracked item                                                              | Nachverfolgung, Tracking-Map, nachverfolgter Eintrag                                                                                    |
| vulnerability, risk, exploit                                                                      | Schwachstelle, Risiko, Exploit                                                                                                          |
| prompt injection, path traversal, prototype pollution, data races, type juggling, class pollution | unchanged and capitalized as German nouns ("Prompt Injection"), as German security writing keeps them                                   |
| broken access control                                                                             | mangelhafte Zugriffskontrolle, as **OWASP** writes it in German                                                                         |
| crafted, untrusted, hardcoded                                                                     | manipuliert, nicht vertrauenswürdig, fest im Code hinterlegt                                                                            |
| score, rate (a finding)                                                                           | bewerten                                                                                                                                |
| false positive, sink                                                                              | False Positive, Sink                                                                                                                    |
| attack vector, attack surface                                                                     | Angriffsvektor, Angriffsfläche                                                                                                          |
| severity                                                                                          | Schweregrad ("kritisch", "hoch", "mittel", "niedrig" in prose, unchanged in command output)                                             |
| authentication, authorization, access control                                                     | Authentifizierung, Autorisierung, Zugriffskontrolle                                                                                     |
| secret, credential                                                                                | Secret, Zugangsdaten                                                                                                                    |
| login, file uploads, payments                                                                     | Anmeldung, Datei-Uploads, Zahlungen                                                                                                     |
| file, folder, directory, path, link                                                               | Datei, Ordner, Verzeichnis, Pfad, Link                                                                                                  |
| scan, check (hook modes)                                                                          | unchanged as mode names ("der Modus scan")                                                                                              |
| sweep, scan (verb and noun)                                                                       | durchsuchen, Durchlauf                                                                                                                  |
| flag (verb)                                                                                       | melden                                                                                                                                  |
| snippet                                                                                           | Codeausschnitt                                                                                                                          |
| codebase                                                                                          | Codebasis, or Projekt where it reads better                                                                                             |
| AI agent, coding agent, agent                                                                     | KI-Agent, Coding-Agent, Agent                                                                                                           |
| prompt, plugin, hook, payload, handler, dashboard                                                 | Prompt, Plugin, Hook, Payload, Handler, Dashboard ("der Prompt", "das Plugin", "der Hook", "die Payload", "das Dashboard")              |
| skill                                                                                             | unchanged and masculine ("der Skill")                                                                                                   |
| skills CLI, CLI, terminal                                                                         | die CLI von **skills**, keeping "skills CLI" in keywords, die CLI, das Terminal                                                         |
| session, tool (the engine's MCP tools)                                                            | Sitzung, Tool                                                                                                                           |
| slash command                                                                                     | Slash-Befehl                                                                                                                            |
| test (what a test runner runs)                                                                    | Test, kept apart from "Nachweis", which means proof                                                                                     |
| branch, commit, pull request, diff                                                                | Branch, Commit, Pull Request, Diff                                                                                                      |
| report, template, library, header                                                                 | Bericht, Vorlage, Bibliothek, Header                                                                                                    |
| deploy                                                                                            | bereitstellen                                                                                                                           |
| deprecated                                                                                        | abgekündigt                                                                                                                             |
| live (view, dashboard)                                                                            | live ("die Live-Ansicht")                                                                                                               |
| badge                                                                                             | Badge                                                                                                                                   |
| extension, package                                                                                | Erweiterung, Paket                                                                                                                      |
| defense-only, defensive security                                                                  | ausschließlich defensiv, defensive Sicherheit                                                                                           |
| security posture                                                                                  | Sicherheitsniveau                                                                                                                       |
| advisory, responsible disclosure                                                                  | Sicherheitshinweis, Responsible Disclosure                                                                                              |
| on demand                                                                                         | bei Bedarf                                                                                                                              |
| scope (of a run), in scope, out of scope                                                          | Umfang, im Geltungsbereich, außerhalb des Geltungsbereichs                                                                              |
| safe by default, safe defaults                                                                    | standardmäßig sicher, sichere Standardwerte                                                                                             |
| open-source                                                                                       | Open Source ("ein Open-Source-Projekt")                                                                                                 |
| Get Started, Install                                                                              | Erste Schritte, Installation                                                                                                            |
| Run it, Next (headings)                                                                           | Verwendung on a command page, Ausführen on a hook page, Nächster Schritt                                                                |
| How it works, Update, Permissions (headings)                                                      | So funktioniert es, Aktualisierung, Berechtigungen                                                                                      |
| Get the most out of it (tip title)                                                                | Das Beste herausholen                                                                                                                   |
| Frequently Asked Questions                                                                        | Häufige Fragen                                                                                                                          |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
