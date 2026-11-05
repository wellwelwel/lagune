# Hook cors: CORS-Origins auditieren

> Durchsuche den Quellcode nach einer umgehbaren Allowlist für CORS-Origins, oder bewerte, ob ein einzelner Origin-Wert zu freizügigen Zugriff erlaubt, direkt über die Kommandozeile.

Kanonische URL: https://lagune.ai/de-DE/docs/hooks/cors
Sprache: de-DE
Original: https://lagune.ai/docs/hooks/cors
Zuletzt aktualisiert: 2026-11-05

Der Hook `cors` ist die deterministische Engine hinter der [Spezialisierung `http-request`](https://lagune.ai/de-DE/docs/catalog), und du kannst ihn selbst ausführen. Er arbeitet mit einem einzigen Befehl in zwei Modi: Im Modus **scan** durchsucht er den Quellcode nach einer **umgehbaren Origin-Allowlist** (einer Regex zur Host-Validierung, an der ein Host eines Angreifers vorbeikommt), und im Modus **score** bewertet er den Wert eines einzelnen **CORS-Origins** als `wildcard`, `null` oder `safe`.

## Eine Codebasis durchsuchen

Ohne Option durchsucht er das gesamte Projekt.

**Gesamtes Projekt**

```bash
npx lagune read cors
```

**Ein Verzeichnis**

```bash
npx lagune read cors --dir src/server
```

**Eine einzelne Datei**

```bash
npx lagune read cors --file internal/auth/origin.go
```

Er listet jede umgehbare Allowlist unter einer gemeinsamen Überschrift auf, nach Datei gruppiert. Ein Host-Validator, dessen `.+`/`.*` im Authority-Teil der URL vor dem Suffix des vertrauenswürdigen Hosts steht (`^https?://.+\.trusted\.com`), lässt einen Angreifer-Host wie `your-site.com.attacker.com` durch.

```text
Origin-allowlist patterns with a greedy wildcard (bypassable, review):

internal/auth/origin.go
  ^https?://.+\.trusted\.com
```

Das ist ein Prüfhinweis, kein abgeschlossener Befund: Ob die Regex eine echte Vertrauensentscheidung absichert, lässt sich aus dem Text nicht entscheiden, deshalb ändert ein Durchlauf nie den Exit-Code. Lies jede Fundstelle und vergewissere dich, dass die Allowlist auf vollständige Gleichheit prüft. Findet er nichts, gibt er eine einzige Zeile aus.

```bash
npx lagune read cors --dir src/clean
# => no bypassable origin allowlist found
```

## Einen Origin bewerten

Übergib jeden Origin mit `--origin`. Der Hook gibt pro Origin ein Wort aus und endet bei jedem `wildcard` oder `null` mit einem Exit-Code ungleich null.

**Ein Origin**

```bash
npx lagune read cors --origin '*'                       # => wildcard
npx lagune read cors --origin 'null'                    # => null
npx lagune read cors --origin 'https://app.example.com' # => safe
```

**Mehrere Origins**

Wiederhole `--origin`, um eine ganze Allowlist mit einem Aufruf zu bewerten, ein Urteil pro Zeile, in derselben Reihenfolge.

```bash
npx lagune read cors \
  --origin 'https://app.example.com' \
  --origin '*' \
  --origin 'null'
# => safe
# => wildcard
# => null
```

| Urteil     | Bedeutung                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| `safe`     | Weder `*` noch `null` noch ein Glob mit `*`. Ein korrekt aufgebauter Origin ist damit nicht garantiert.             |
| `wildcard` | `*` oder ein Glob für Subdomain, Host oder Port: Jede Website (oder eine große Menge davon) darf die Antwort lesen. |
| `null`     | Der Origin `null`, den Iframes in einer Sandbox und Weiterleitungen fälschen können.                                |

Nur `safe` bedeutet Zulassen, und `--origin` ist ein Orakel für Werte: Es beurteilt den Wert, nicht den Handler, also prüfe den Handler mit der Spezialisierung `http-request`.

### CLI-Optionen

| Option     | Wert            | Beschreibung                                                                                 |
| ---------- | --------------- | -------------------------------------------------------------------------------------------- |
| `--origin` | ein Origin      | Bewertet einen Origin-Wert. Wiederhole die Option, um mehrere zu bewerten, einen pro Zeile.  |
| `--dir`    | ein Verzeichnis | Beschränkt den Durchlauf auf ein Verzeichnis. Wiederholbar und mit `--file` kombinierbar.    |
| `--file`   | eine Datei      | Beschränkt den Durchlauf auf eine einzelne Datei. Wiederholbar und mit `--dir` kombinierbar. |

Ohne Option durchsucht er das gesamte Projekt. `--origin` steht für den Modus score und lässt sich nicht mit `--dir` oder `--file` kombinieren.

### Festlegen, was er durchsucht

Er lässt aus, was **Git** ignoriert. Wenn du mehr auslassen oder auch durchsuchen willst, was **Git** ignoriert, gib `cors` eigene Einstellungen:

```bash
npx lagune write add --ignore test/fixtures --checker cors
```

```json
{
  "checkers": {
    "cors": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Hooks konfigurieren](https://lagune.ai/de-DE/docs/hooks/configure) beschreibt jede Einstellung.

**Was er nicht abdeckt**

Der Durchlauf erkennt die Form der **umgehbaren Regex**, und `--origin` bewertet **Werte** von Origins. Zwei Muster im Quellcode bleiben außer Reichweite: das Spiegeln des `Origin` der Anfrage (der Server sendet den eingehenden `Origin` unverändert zurück oder kombiniert ihn mit Zugangsdaten) und eine freizügige Allowlist auf Basis von `endsWith` oder Teilstrings. Erkenne sie im Code und behandle sie so, wie es die [Spezialisierung `http-request`](https://lagune.ai/de-DE/docs/catalog) beschreibt.

## Häufige Fragen

### Warum ist der CORS-Origin null gefährlich?

Iframes in einer Sandbox und manche Weiterleitungen senden Origin: null, deshalb gewährt eine Allowlist, die null vertraut, diesen Kontexten Lesezugriff. Der Hook cors meldet das zusammen mit der Wildcard.

### Wie finde ich eine umgehbare Allowlist für CORS-Origins?

Führe npx lagune read cors über die Codebasis aus. Er meldet eine Regex zur Host-Validierung, deren gierige Wildcard vor dem vertrauenswürdigen Suffix steht, sodass ein Angreifer-Host wie your-site.com.attacker.com durchrutscht.
