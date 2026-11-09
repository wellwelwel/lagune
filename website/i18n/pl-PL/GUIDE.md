# pl-PL translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into Polish. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural Polish that reads as though it was written in Polish from the start, as fluent as the English.
- Never translate literally. A calque keeps the English structure under Polish words, and it reads stiff:
  - ❌ "To działa w obu nowych i istniejących projektach i nie potrzebuje żadnego klucza API."
  - ✅ "Działa zarówno w nowych, jak i w istniejących projektach, bez klucza API."
  - ❌ "Udowodnij, że każda zastosowana poprawka trzyma, następnie zamknij te, które to robią."
  - ✅ "Wykaż, że każda wdrożona poprawka działa, i zamknij te, które przejdą weryfikację."
  - ❌ "Poprawka jest zastosowana przez agenta."
  - ✅ "Agent wdraża poprawkę."
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Address the reader as "ty", informally, as Polish developer documentation does, and leave the pronoun out wherever the verb already carries it. Write instructions in the imperative singular ("Zainstaluj", "Uruchom", "Sprawdź"), never "Pan", "Pani", or "Państwo".
- A prompt the reader sends to the agent addresses the agent the same way, in the imperative singular ("sprawdź", "dodaj", "popraw"), as people write to an assistant.
- Write complete sentences. Never cut a thought short with an em dash, an en dash, a semicolon, or a full stop where the sentence calls for a comma, a colon, or parentheses.
- Cut the words that add nothing, never the meaning. Polish drifts into a nominal style, so prefer the verb to the noun built from it ("zainstalować", not "przeprowadzić instalację"), and prefer the active voice to a passive "jest stosowana przez".
- Avoid calques of English idioms: "ma sens", never "robi sens", "w 2026 roku", and "zdawać sobie sprawę" for "realize", never "realizować".
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in Poland, keeping the English technical terms they also search for (such as OWASP, CVSS, hardening, prompt, Claude Code), and write each FAQ question the way a Polish user would ask it.

## Grammar

- Polish inflects nouns, and an English term Polish developers keep inflects too, with no apostrophe after a pronounced consonant ("promptu", "hooka", "commita", "pull requesta"). Never inflect inline code, a command, or a bold product name: give it a head noun that takes the case instead ("uruchom polecenie `/lagune-plan`", "w pliku `package.json`", "wtyczka do **Claude Code**").
- **Lagune** stays indeclinable and reads naturally after a preposition ("z **Lagune**", "dla **Lagune**"). Where a sentence would decline it or give it a grammatical gender, as a past-tense verb or an agreeing adjective does, attach it to a head noun ("polecenia **Lagune**", "wtyczka **Lagune**") or rephrase.
- Give a phase name the feminine gender of "faza" ("detect wykryła") and a command the neuter gender of "polecenie". Avoid past-tense forms that would assign the reader a gender ("zainstalowałeś"), using the present tense or an impersonal form instead.
- Acronyms such as API, CLI, MCP, and JWT stay indeclinable, with a head noun where the case matters ("klucz API", "serwer MCP", "token JWT").
- Follow the Polish comma rules: a comma always comes before "że", "który", "aby", "ale", "bo", "gdy", and before a participle clause ending in "-ąc" or "-wszy".

## Typography

- Use sentence case for titles, headings, and labels, never English title case ("Pierwsze kroki", "Bezpieczeństwo dla każdego agenta AI").
- In prose, the word after a colon stays lowercase unless it is a proper noun. In a title, capitalize the first word after the colon ("/lagune-detect: Zmapuj swój system i jego ryzyka", "Hook crypto: Wykrywanie słabej kryptografii", "Katalog: Specjalizacje bezpieczeństwa na żądanie").
- Quote with straight double quotes (`"`), never the Polish low-high quotes (`„”`) or angle quotes (`«»`), and use straight apostrophes.
- Put the acronym after its noun with no hyphen ("agent AI", "klucz API"), never "AI-agent" or "API-klucz", and rephrase instead of building a hybrid adjective ("projekt open source", never "open source'owy").
- Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write counts the Polish way, with no separator in a four-digit number ("1200 plików") and a space for thousands from five digits ("12 000 plików"), and the percent sign right after the number ("50%").
- Titles and labels carry no trailing full stop, and tab labels and buttons use the infinitive or a short noun ("Wskaż ścieżki", "Zainstaluj", "Kopiuj").
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a Polish user would type, addressing the agent in the imperative singular, while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("i/lub", "TCP/IP", a date such as "03/11"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                           | pl-PL                                                                                              |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                           | unchanged and indeclinable                                                                         |
| `/lagune-charter` and every other command                                                         | unchanged, with "polecenie" where the sentence needs a noun ("uruchom polecenie `/lagune-plan`")   |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                   | unchanged                                                                                          |
| hardening (noun), security hardening                                                              | utwardzanie ("utwardzanie projektu"), utwardzanie zabezpieczeń, keeping "hardening" in keywords    |
| harden (verb)                                                                                     | utwardzać, or "wzmacniać zabezpieczenia" where it reads better                                     |
| charter (the principles it holds)                                                                 | zasady bezpieczeństwa                                                                              |
| charter, detect, plan, harden, verify (as phase names)                                            | unchanged, with "faza" where the sentence needs a noun ("faza charter", "faza verify wykazuje")    |
| phase                                                                                             | faza                                                                                               |
| governing layer, convention (SDH as one)                                                          | warstwa nadrzędna, konwencja                                                                       |
| spec                                                                                              | specyfikacja                                                                                       |
| engine                                                                                            | silnik ("deterministyczny silnik")                                                                 |
| deterministic                                                                                     | deterministyczny                                                                                   |
| development flow, Blue Team flow, workflow                                                        | proces deweloperski, przepływ pracy Blue Team, przepływ pracy                                      |
| universal (the `/lagune` command, the install route)                                              | uniwersalny                                                                                        |
| context, context-aware, context window                                                            | kontekst, dopasowany do kontekstu, okno kontekstu                                                  |
| audit (noun), audit (verb)                                                                        | audyt, audytować                                                                                   |
| map (what the system does, its risks)                                                             | rozpoznawać, mapować                                                                               |
| record (a finding, a category)                                                                    | zapisywać, rejestrować                                                                             |
| finding                                                                                           | ustalenie                                                                                          |
| concern (one the user describes to detect)                                                        | zagadnienie                                                                                        |
| evidence (behind a finding, and what prove writes)                                                | dowód, dowody                                                                                      |
| fix                                                                                               | poprawka                                                                                           |
| control                                                                                           | zabezpieczenie                                                                                     |
| hold (a control, a fix)                                                                           | działać, skutecznie chronić                                                                        |
| prove, proof, proof of concept                                                                    | wykazać, wykazanie, Proof of Concept (PoC)                                                         |
| verdict                                                                                           | werdykt                                                                                            |
| confront (the code with the record)                                                               | zestawiać                                                                                          |
| reconcile                                                                                         | uzgadniać                                                                                          |
| detect map, defense plan, hardening record                                                        | mapa wykrywania, plan obrony, rejestr utwardzania                                                  |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels)    | unchanged, since the artifacts write them in English                                               |
| specialization, catalog, category                                                                 | specjalizacja, katalog, kategoria                                                                  |
| built-in (specialization)                                                                         | wbudowany                                                                                          |
| distill, shadow (a built-in, with a specialization of your own)                                   | destylować, przesłaniać                                                                            |
| stand down, close out                                                                             | wycofać ("wycofać z całego łańcucha"), zamknąć                                                     |
| closable, closability (security)                                                                  | możliwe do zamknięcia, zamykalność                                                                 |
| at rest, settled (the cycle)                                                                      | w stanie spoczynku                                                                                 |
| cycle                                                                                             | cykl                                                                                               |
| artifact, memory (the phase artifacts)                                                            | artefakt, pamięć                                                                                   |
| chain (the phase artifacts together)                                                              | łańcuch ("cały łańcuch")                                                                           |
| tracking, tracking map, tracked item                                                              | śledzenie, mapa śledzenia, śledzony element                                                        |
| vulnerability, risk, exploit                                                                      | podatność, ryzyko, exploit                                                                         |
| prompt injection, path traversal, prototype pollution, data races, type juggling, class pollution | unchanged and lowercase, as Polish security writing keeps them                                     |
| broken access control                                                                             | błędna kontrola dostępu                                                                            |
| crafted, untrusted, hardcoded                                                                     | spreparowany, niezaufany, zapisany na sztywno w kodzie                                             |
| allowlist, denylist                                                                               | lista dozwolonych, lista zabronionych                                                              |
| score, rate (a finding)                                                                           | oceniać                                                                                            |
| false positive, sink                                                                              | fałszywy alarm, sink ("sinka", "sinki")                                                            |
| score (noun), flag (CLI), origin (CORS)                                                           | wynik, flaga, origin ("originu", "originów")                                                       |
| sandbox, marketplace                                                                              | sandbox ("w sandboxie"), marketplace                                                               |
| test fixtures, project root                                                                       | fixtury testowe, główny folder projektu                                                            |
| attack vector, attack surface                                                                     | wektor ataku, powierzchnia ataku                                                                   |
| severity                                                                                          | poziom zagrożenia ("krytyczny", "wysoki", "średni", "niski" in prose, unchanged in command output) |
| authentication, authorization, access control                                                     | uwierzytelnianie, autoryzacja, kontrola dostępu                                                    |
| secret, credential                                                                                | sekret, dane uwierzytelniające                                                                     |
| login, file uploads, payments                                                                     | logowanie, przesyłanie plików, płatności                                                           |
| file, folder, directory, path, link                                                               | plik, folder, folder, ścieżka, link, keeping "katalog" for the catalog alone                       |
| scan, check (hook modes)                                                                          | unchanged as mode names ("tryb scan")                                                              |
| sweep, scan (verb and noun)                                                                       | przeszukiwać, skanowanie                                                                           |
| flag (verb)                                                                                       | zgłaszać                                                                                           |
| checker (what a hook runs)                                                                        | narzędzie sprawdzające, or "hook" where the context is clear                                       |
| snippet                                                                                           | fragment kodu                                                                                      |
| codebase                                                                                          | baza kodu, or projekt where it reads better                                                        |
| repository, dependency, sub-agent, workspace                                                      | repozytorium, zależność, subagent, obszar roboczy                                                  |
| project                                                                                           | projekt                                                                                            |
| AI agent, coding agent, agent                                                                     | agent AI, agent programistyczny, agent                                                             |
| prompt, hook, payload, handler                                                                    | prompt, hook, payload, handler ("promptu", "hooka", "payloadu", "handlera")                        |
| plugin                                                                                            | wtyczka                                                                                            |
| dashboard                                                                                         | dashboard ("dashboardu")                                                                           |
| skill                                                                                             | skill ("skilla", "skille")                                                                         |
| skills CLI, CLI, terminal                                                                         | CLI **skills**, keeping "skills CLI" in keywords, CLI, terminal                                    |
| session, tool (the engine's MCP tools)                                                            | sesja, narzędzie                                                                                   |
| command, slash command                                                                            | polecenie, polecenie z ukośnikiem                                                                  |
| test (what a test runner runs)                                                                    | test, kept apart from "wykazanie", which means proof                                               |
| branch, commit, pull request, diff                                                                | gałąź, commit, pull request, diff                                                                  |
| report, template, library, header                                                                 | raport, szablon, biblioteka, nagłówek                                                              |
| deploy                                                                                            | wdrażać                                                                                            |
| deprecated                                                                                        | przestarzały                                                                                       |
| live (view, dashboard)                                                                            | na żywo ("podgląd na żywo")                                                                        |
| badge                                                                                             | odznaka                                                                                            |
| extension, package                                                                                | rozszerzenie, pakiet                                                                               |
| install, update (verbs)                                                                           | zainstalować, zaktualizować                                                                        |
| run (a command)                                                                                   | uruchomić                                                                                          |
| defense-only, defensive security                                                                  | wyłącznie defensywny, bezpieczeństwo defensywne                                                    |
| security posture                                                                                  | poziom bezpieczeństwa                                                                              |
| advisory, responsible disclosure                                                                  | biuletyn bezpieczeństwa, odpowiedzialne ujawnianie                                                 |
| prompt-on-demand, methodology                                                                     | prompt na żądanie, metodologia                                                                     |
| on demand                                                                                         | na żądanie                                                                                         |
| scope (of a run), in scope, out of scope                                                          | zakres, w zakresie, poza zakresem                                                                  |
| safe by default, safe defaults                                                                    | domyślnie bezpieczny, bezpieczne ustawienia domyślne                                               |
| open-source                                                                                       | open source ("projekt open source")                                                                |
| Get Started, Install, Configure                                                                   | Pierwsze kroki, Instalacja, Konfiguracja ("Konfiguracja hooków")                                   |
| Run it, Next (headings)                                                                           | Użycie on a command page, Uruchamianie on a hook page, Co dalej                                    |
| How it works, Update, Permissions (headings)                                                      | Jak to działa, Aktualizacja, Uprawnienia                                                           |
| Get the most out of it (tip title)                                                                | Jak wycisnąć z tego maksimum                                                                       |
| Frequently Asked Questions                                                                        | Najczęściej zadawane pytania                                                                       |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
