# Hook jwt: JWT-Verifizierung ohne festgelegten Algorithmus erkennen

> Durchsuche eine Codebasis nach JWT-Verifizierungen ohne festgelegten Algorithmus, oder bewerte einen einzelnen Aufruf, direkt über die Kommandozeile.

Kanonische URL: https://lagune.ai/de-DE/docs/hooks/jwt
Sprache: de-DE
Original: https://lagune.ai/docs/hooks/jwt
Zuletzt aktualisiert: 2026-11-05

Der Hook `jwt` meldet **JWT-Verifizierungen ohne festgelegten Algorithmus**, also die Lücke der Algorithm Confusion, bei der ein Verifizierer dem Header `alg` des Tokens selbst vertraut, sowie **vollständig abgeschaltete Verifizierungen**. Er arbeitet **sprachspezifisch** und liest jede Datei anhand ihrer eigenen JWT-Bibliothek. Er ist die deterministische Engine hinter der [Spezialisierung `federation`](https://lagune.ai/de-DE/docs/catalog), und du kannst ihn selbst im Modus **scan** oder **check** ausführen.

## Ausführen

**Codebasis durchsuchen**

```bash
npx lagune read jwt                # scans the whole project
npx lagune read jwt --dir src      # scans a directory
npx lagune read jwt --file auth.ts # scans a single file
```

**Aufruf prüfen**

```bash
npx lagune read jwt --lang javascript --pattern 'jwt.verify(token, secret)'                         # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, options={"verify_signature": False})' # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, algorithms=["HS256"])'                # => safe
```

Jede Zeile unter **Unpinned JWT verification found** ist ein Verifizierungsaufruf, der keine Allowlist `algorithms` setzt (wo die Bibliothek eine braucht), eine unsichere akzeptiert (`none` oder einen asymmetrischen Algorithmus gemischt mit HMAC) oder die Signaturprüfung gleich ganz abschaltet und deshalb dem `alg` des Tokens selbst vertraut. Das ist eine bestätigte Gefährdung, deshalb endet der Hook mit einem Exit-Code ungleich null. Findet er nichts, gibt er `no unpinned JWT verification found` aus.

## So liest du das Urteil

| Urteil     | Bedeutung                                                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `unpinned` | Ein Verifizierungsaufruf ohne Allowlist für Algorithmen (wo eine nötig ist), mit einer unsicheren oder mit abgeschalteter Verifizierung. |
| `safe`     | Ein Verifizierungsaufruf, der eine solide Allowlist für Algorithmen festlegt oder dessen Bibliothek sie implizit festlegt.               |
| `invalid`  | Der Codeausschnitt enthält keinen erkennbaren Verifizierungsaufruf, den er beurteilen könnte.                                            |

### CLI-Optionen

| Option      | Wert               | Beschreibung                                                                                          |
| ----------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| `--pattern` | ein Codeausschnitt | Prüft einen Aufruf. Wiederhole die Option, um mehrere zu prüfen, ein Urteil pro Zeile.                |
| `--lang`    | eine Sprache       | Erforderlich bei `--pattern`: eine von javascript, python, go, java, kotlin, php, ruby, rust, csharp. |
| `--dir`     | ein Verzeichnis    | Beschränkt den Durchlauf auf ein Verzeichnis. Wiederholbar und mit `--file` kombinierbar.             |
| `--file`    | eine Datei         | Beschränkt den Durchlauf auf eine einzelne Datei. Wiederholbar und mit `--dir` kombinierbar.          |

Ohne Option durchsucht er das gesamte Projekt. `--pattern` erfordert `--lang` und lässt sich nicht mit `--dir` oder `--file` kombinieren.

### Festlegen, was er durchsucht

Er lässt aus, was **Git** ignoriert. Wenn du mehr auslassen oder auch durchsuchen willst, was **Git** ignoriert, gib `jwt` eigene Einstellungen:

```bash
npx lagune write add --ignore test/fixtures --checker jwt
```

```json
{
  "checkers": {
    "jwt": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Hooks konfigurieren](https://lagune.ai/de-DE/docs/hooks/configure) beschreibt jede Einstellung.

### Unterstützte Sprachen

Der Durchlauf liest diese Bibliotheken, erkannt an der Dateiendung. Weil manche den Algorithmus implizit festlegen (eine fehlende explizite Liste ist dort korrekt), gilt die Regel "keine Allowlist ⇒ unpinned" nur dort, wo die Bibliothek eine explizite erwartet, sodass er einen korrekt konfigurierten Aufruf nie meldet.

| Sprache                     | Bibliothek              | Meldet eine fehlende Allowlist als unpinned?                               | Meldet immer                                      |
| --------------------------- | ----------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| **JavaScript / TypeScript** | jsonwebtoken, jose      | Ja                                                                         | `none`, Mischung aus asymmetrisch und HMAC        |
| **Python**                  | PyJWT, python-jose      | Ja (PyJWT verlangt sie, python-jose nutzt standardmäßig `algorithms=None`) | `none`, `verify_signature: False`                 |
| **Go**                      | golang-jwt              | Ja (ohne `WithValidMethods`)                                               | `none`, `ParseUnverified`                         |
| **Ruby**                    | ruby-jwt                | Ja                                                                         | `none`, `verify = false`                          |
| **Java / Kotlin**           | jjwt, nimbus            | Nein (aus dem Schlüssel abgeleitet)                                        | `none`, ein Parser ohne Signatur oder `unsecured` |
| **PHP**                     | firebase/php-jwt        | Nein (`Key` trägt den Algorithmus)                                         | `none`                                            |
| **Rust**                    | jsonwebtoken            | Nein (`Validation` verlangt einen)                                         | `none`, `insecure_disable_signature_validation`   |
| **C#**                      | Microsoft.IdentityModel | Nein (mehrzeilige Parameter)                                               | `none`, `RequireSignedTokens = false`             |

**Tipp**

Der Hook entscheidet nur über die Festlegung des Algorithmus: Die Prüfungen von Claims, Schlüsseln und Flows bleiben Ermessensfragen, die die [Spezialisierung `federation`](https://lagune.ai/de-DE/docs/catalog) abdeckt.

## Häufige Fragen

### Was ist Algorithm Confusion bei JWT?

Ein Verifizierer, der den Algorithmus aus dem Header des Tokens liest, erlaubt einem Angreifer, RS256 gegen HS256 zu tauschen und mit dem öffentlichen Schlüssel zu signieren. Eine solide Allowlist für Algorithmen, die im Code festgelegt ist, verhindert das, und der Hook jwt meldet jeden Verifizierungsaufruf, der keine oder eine unsichere festlegt.
