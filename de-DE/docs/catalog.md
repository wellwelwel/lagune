# Katalog: Sicherheitsspezialisierungen bei Bedarf

> Wie die Spezialisierungen im Katalog deines Projekts geladen werden: von einer Phase bei Bedarf und von dir direkt.

Kanonische URL: https://lagune.ai/de-DE/docs/catalog
Sprache: de-DE
Original: https://lagune.ai/docs/catalog
Zuletzt aktualisiert: 2026-11-03

🧠 Die Spezialisierungen von **Lagune** sind fokussierte, sprachunabhängige Module mit Sicherheitswissen, die nur bei Bedarf geladen werden, nie standardmäßig. Sie sind keine Befehle. Der Katalog deines Projekts ist die Auswahl, die es nutzt: die integrierten Spezialisierungen seiner [Kategorien](https://lagune.ai/de-DE/docs/categories) plus seine eigenen. Die Phasen detect und verify ziehen sie während ihres Laufs heran, und du kannst jederzeit direkt eine laden.

**Überblick**

*Die interaktive Übersicht des Katalogs findest du auf der Webseite. Alle integrierten Spezialisierungen stehen in der Tabelle unten.*

**So funktioniert es**

## Selbst nutzen

Um eine Spezialisierung direkt zu nutzen, bitte deinen Agenten, sie mit `read catalog <name>` zu laden, und schreibe die Aufgabe in denselben Prompt. Das Wissen wirkt dann auf das, worum du gebeten hast. Das funktioniert in jedem Prompt, auch in einem, der nichts mit dem Workflow von **Lagune** zu tun hat.

Zum Beispiel ein direkter, frei formulierter Prompt, der eine sichere Sammlung von **RegExp** in **Python** erzeugt:

```prompt
Lade die Spezialisierung regex mit `npx lagune read catalog regex` und erstelle dann in @src/utils/regex.py eine Sammlung regulärer Ausdrücke, um E-Mail-Adressen und Benutzernamen zu validieren.
```

Das nutzt einen deterministischen Hook, um jede **RegExp** auf **ReDoS** zu testen, behält die sicheren und erzeugt etwa Folgendes:

```python
import re

EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
USERNAME = re.compile(r"^[a-zA-Z0-9_]{3,20}$")

def is_email(value: str) -> bool:
    return EMAIL.match(value) is not None

def is_username(value: str) -> bool:
    return USERNAME.match(value) is not None
```

**ReDoS-Checker ausprobieren**

Teste selbst ein Muster unter [**devina.io/redos-checker**](https://devina.io/redos-checker).

## Die integrierten Spezialisierungen

Die integrierten Spezialisierungen sind in [**Kategorien**](https://lagune.ai/de-DE/docs/categories) gruppiert. Das ist die Auswahl, die mit **Lagune** ausgeliefert wird:

| Spezialisierung       | Kategorie                   | Schwerpunkt                                                                                                |
| --------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `regex`               | `owasp`                     | **ReDoS:** Muster, deren Laufzeit bei manipulierten Eingaben explodiert.                                   |
| `network`             | `owasp`                     | **SSRF & Weiterleitungen:** vom Nutzer vorgegebene Abruf- oder Weiterleitungsziele.                        |
| `interpreter`         | `owasp`, `lovable`          | **Code-Injection:** `eval`, dynamisches Einbinden, Dispatch über Namen.                                    |
| `sql`                 | `owasp`                     | **Relationale Datenbanken:** Injection, rohe ORM-Aufrufe, Berechtigungen, Reichweite der Datenbank-Engine. |
| `path`                | `owasp`                     | **Dateisystempfade:** Traversal, Null-Byte, NTFS-Streams, Planting.                                        |
| `upload`              | `owasp`                     | **Datei-Uploads:** Typ/Signatur, schädliche Inhalte, Speicherung, Limits.                                  |
| `access-control`      | `owasp`, `lovable`          | **Authentifizierung, Autorisierung, Sitzung:** IDOR, Mass Assignment, Mandanten, Sitzungen.                |
| `credential-endpoint` | `owasp`, `lovable`          | **Erraten von Zugangsdaten & Bots:** Brute Force, Password Spraying, Credential Stuffing, Drosselung.      |
| `federation`          | `owasp`                     | **Vertrauen in Tokens:** OAuth/OIDC, SAML, JWT-Validierung, Anmeldung per QR-Code.                         |
| `http-request`        | `owasp`                     | **Herkunft von Anfragen:** CSRF, CORS-Fehlkonfiguration, gefälschte Client-IP.                             |
| `transport`           | `owasp`                     | **Kanalsicherheit:** TLS-Konfiguration, HTTPS/Klartext, HSTS, Pinning.                                     |
| `crypto`              | `owasp`, `lovable`          | **Kryptografie für ruhende Daten:** schwache oder selbst gebaute Algorithmen, CSPRNG, Schlüsselverwaltung. |
| `secrets`             | `owasp`, `lovable`          | **Fest im Code hinterlegte Zugangsdaten:** Schlüssel, Tokens, Passwörter als Literale im Quellcode.        |
| `api-endpoint`        | `owasp`                     | **Schnittstellen jenseits von REST:** GraphQL, gRPC, WebSocket-Autorisierung, DoS, Schema.                 |
| `payment`             | `owasp`, `lovable`          | **Checkout-Ablauf:** Gateway serverseitig prüfen, signierte Callbacks, Idempotenz.                         |
| `xml`                 | `owasp`                     | **XML-Parsing:** XXE, externe Entitäten, Billion-Laughs-Expansion.                                         |
| `csv`                 | `owasp`                     | **Formel-Injection:** Tabellenzellen, die mit `=`/`+`/`-`/`@` beginnen.                                    |
| `container`           | `owasp`, `infra`            | **Container-Konfiguration:** Root, Capabilities, Socket-Mount, Härtung des Images.                         |
| `infra`               | `infra`                     | **Infrastructure as Code:** Terraform, Dockerfile, GitHub Actions.                                         |
| `serverless`          | `owasp`, `infra`, `lovable` | **FaaS-Funktionen:** IAM nach dem Prinzip der minimalen Rechte, Event-Eingaben, Kontext, Secrets.          |
| `llm`                 | `ai`, `lovable`             | **KI- und LLM-Risiken:** Prompt Injection, Agency, RAG, MCP, Ausgabe.                                      |
| `supabase`            | `lovable`                   | **Backend mit Supabase:** RLS standardmäßig aus, von KI fehlerhaft generierte Policies, Schlüsselmodell.   |
| `browser`             | `javascript`, `lovable`     | **Clientseitige Risiken:** XSS, CSP, Framing, Speicherung usw.                                             |
| `javascript`          | `javascript`                | **Risiken auf Sprachebene:** RCE, Prototype Pollution usw.                                                 |
| `python`              | `python`                    | **Risiken auf Sprachebene:** RCE über `pickle`, Class Pollution, `-O` usw.                                 |
| `rust`                | `rust`                      | **Soundness von `unsafe`:** UB, ausgelöst von sicherem Code, `transmute`, Überläufe.                       |
| `java`                | `java`                      | **Deserialisierung & Mobile Code:** Ketten über `readObject`, Übernahme von Objekten.                      |
| `ruby`                | `ruby`                      | **Deserialisierung & `open`:** Wiederherstellung von Objekten über `Marshal`/YAML, Pipe-Eigenheit.         |
| `php`                 | `php`                       | **Type Juggling & `unserialize`:** Magic Hashes, POP-Ketten.                                               |
| `go`                  | `go`                        | **Typed nil & Data Races:** `nil != nil`, Goroutines mit gemeinsamem Speicher.                             |
| `c-cpp`               | `c-cpp`                     | **Formatstrings:** `printf(user_input)`, Write-what-where über `%n`.                                       |
| `dotnet`              | `dotnet`                    | **Risiken auf Plattformebene:** RCE über `BinaryFormatter`, `@Html.Raw`, Lücken bei Enums.                 |

Das meiste integrierte Wissen ist aus OWASP verdichtet. Unter [**OWASP-Quellen**](https://lagune.ai/de-DE/docs/references/owasp-sources) findest du die vollständige Zuordnung jeder Spezialisierung zu ihren maßgeblichen Seiten zu Angriffen und Cheat Sheets von OWASP. Einige wenige stackspezifische Module stützen sich stattdessen auf die Empfehlungen des jeweiligen Anbieters: `supabase` etwa stammt aus der Dokumentation von Supabase und CVE-2025-48757.

## Deine eigenen Spezialisierungen

Die integrierten wachsen um je eine Wissensdatei plus eine Indexzeile, nie um einen neuen Befehl. Deine eigenen fügst du genauso hinzu, mit [`/lagune-specialize`](https://lagune.ai/de-DE/docs/commands/specialize): Gib dem Befehl einen Artikel oder ein Thema, und er verdichtet daraus eine neue Spezialisierung in deinem Projekt, die Datei unter `.lagune/catalog/` und ihren Eintrag in `.lagune/configs.json`. Deine eigenen sind immer im Katalog, unabhängig von seinen Kategorien, und eine eigene überdeckt eine integrierte mit demselben Namen.

**Intern lädt Lagune Spezialisierungen automatisch, bei Bedarf**

Stößt die Phase detect oder verify auf einen Kontext, den eine Spezialisierung abdeckt, lädt sie diese Spezialisierung selbst mit `read catalog <name>`. Das geschieht automatisch als Teil der Phase. Damit das funktioniert, musst du nichts von Hand tun.

## Herausfinden, was verfügbar ist

So listest du den Katalog deines Projekts im Terminal auf, eine Spezialisierung pro Zeile mit ihren Tags:

```bash
npx lagune read catalog
# regex: Regular Expression [required]
# network: Requests, Webhook, URL Fetch, Socket, IMDS, Redirect
# interpreter: Evaluator, Sink, Shell, Dynamic Execution
# ...
```

Eine Spezialisierung mit `[required]` gilt immer, unabhängig von der Arbeit. Welche integrierten die Liste enthält, hängt von den [**Kategorien**](https://lagune.ai/de-DE/docs/categories) deines Projekts ab.

**Spezialisierungen werden nicht standardmäßig geladen**

Das relevante Wissen wird für das herangezogen, was das Projekt tatsächlich ist, statt jede Prüfung standardmäßig auszuführen.

## Häufige Fragen

### Was ist eine Spezialisierung bei Lagune?

Ein fokussiertes, sprachunabhängiges Modul mit Sicherheitswissen, das nur bei Bedarf geladen wird, nie standardmäßig. Es ist kein Befehl wie die Skills des Agenten.

### Was ist der Katalog eines Projekts?

Die Spezialisierungen, die das Projekt nutzt: die integrierten seiner Kategorien plus seine eigenen. Solange keine Kategorie eingetragen ist, nutzt es nur OWASP.

### Werden Spezialisierungen standardmäßig geladen?

Nein. Sie werden nur bei Bedarf geladen, passend zu dem, was das Projekt tatsächlich ist.

### Wie lade ich eine Spezialisierung direkt?

Bitte deinen Agenten im selben Prompt wie die Aufgabe, npx lagune read catalog <name> auszuführen.
