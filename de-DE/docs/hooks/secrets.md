# Hook secrets: fest im Code hinterlegte Secrets erkennen

> Durchsuche eine Codebasis nach fest im Code hinterlegten Zugangsdaten, direkt über die Kommandozeile.

Kanonische URL: https://lagune.ai/de-DE/docs/hooks/secrets
Sprache: de-DE
Original: https://lagune.ai/docs/hooks/secrets
Zuletzt aktualisiert: 2026-11-03

Der Hook `secrets` meldet **Zugangsdaten, die fest im Quellcode stehen**, statt aus der Umgebung gelesen zu werden. Er achtet auf die **Herkunft** (ein Literal oder ein Zugriff auf die Umgebung), nicht auf den Inhalt des Werts, deshalb braucht er keinen vollständigen Katalog von Anbieter-Präfixen und erzeugt kaum False Positives. Er ist die deterministische Engine hinter der [Spezialisierung `secrets`](https://lagune.ai/de-DE/docs/catalog).

Signaturen im Format eines Anbieters, Zugangsdaten in Connection-Strings und ein Literal, das einem Bezeichner mit Secret-typischem Namen zugewiesen ist, sind **sprachunabhängig**: Derselbe String liest sich in jeder Datei gleich. Die zwei Heuristiken, die von der Syntax abhängen (ein Zugriff auf die Umgebung mit einem fest im Code hinterlegten Standardwert und ein Secret, das in einen Log-Sink fließt), arbeiten **sprachspezifisch**, sodass er ein `console.log` aus JavaScript nie in einer Rust-Datei sucht und das `os.getenv("X", "default")` von Python für sich erkennt.

## Ausführen

```bash
npx lagune read secrets                  # scans the whole project
npx lagune read secrets --dir src        # scans a directory
npx lagune read secrets --file config.ts # scans a single file
```

Der Durchlauf gibt bis zu zwei Abschnitte aus. **Hardcoded secrets found** enthält die Befunde (ein fest im Code hinterlegter Standardwert für eine Umgebungsvariable mit Secret-typischem Namen, in einen Connection-String eingebettete Zugangsdaten oder ein Wert, der zu einem kuratierten Anbieterformat passt), deshalb endet der Hook mit einem Exit-Code ungleich null. **Secret handling to review manually** enthält Prüfhinweise: ein einfaches Literal, das einem Bezeichner mit Secret-typischem Namen zugewiesen ist (seine Herkunft lässt sich entscheiden, ob der Wert ein echtes Secret ist, dagegen nicht), und ein Wert mit Secret-typischem Namen, der in einen Log- oder Antwort-Sink fließt. Findet er nichts, gibt er `no hardcoded secrets found` aus.

### CLI-Optionen

| Option   | Wert            | Beschreibung                                                                                 |
| -------- | --------------- | -------------------------------------------------------------------------------------------- |
| `--dir`  | ein Verzeichnis | Beschränkt den Durchlauf auf ein Verzeichnis. Wiederholbar und mit `--file` kombinierbar.    |
| `--file` | eine Datei      | Beschränkt den Durchlauf auf eine einzelne Datei. Wiederholbar und mit `--dir` kombinierbar. |

Ohne Option durchsucht er das gesamte Projekt.

### Abgedeckte Sprachen

Der Befund zum Standardwert einer Umgebungsvariablen und der Prüfhinweis zum Log-Sink lesen je Sprache eigene Schreibweisen, deshalb decken sie die folgenden Sprachen ab und bleiben anderswo still. Die anderen drei Signale prüfen **jede** Datei.

| Signal                    | Sprachen                                                                        |
| ------------------------- | ------------------------------------------------------------------------------- |
| Standardwert der Umgebung | JavaScript/TypeScript, Python, Ruby, PHP, Kotlin, Java, Go (`cmp.Or`), Rust, C# |
| Log- oder Antwort-Sink    | JavaScript/TypeScript, Python, Ruby, PHP, Java, Kotlin, Go, Rust, C, C++, C#    |

**Verstößt das gegen eine Richtlinie?**

Nein. Das Format eines Secrets zu erkennen, um zu warnen, dass es committet wurde, ist gängige Praxis defensiver Werkzeuge, dieselbe Operation, die gitleaks, trufflehog und die Push Protection von GitHub ausführen. Der Hook liefert Erkennungssignaturen (öffentliche **Formate** von Tokens), nie ein echtes Secret, und er auditiert und erklärt, statt Daten zu exfiltrieren.

## Häufige Fragen

### Wie vermeidet der Hook secrets False Positives?

Er achtet auf die Herkunft, nicht auf den Inhalt des Werts. Formate mit hoher Treffsicherheit (Tokens von Anbietern, Standardwerte aus der Umgebung, Connection-Strings) sind Befunde, die mit einem Exit-Code ungleich null enden. Ein einfaches Literal, das einem Bezeichner mit Secret-typischem Namen zugewiesen ist, ist ein Prüfhinweis, den du bestätigen musst, und derselbe Bezeichner, aus process.env gelesen, wird gar nicht gemeldet.
