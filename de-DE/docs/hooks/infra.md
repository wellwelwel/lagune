# Hook infra: IaC-Fehlkonfigurationen erkennen

> Durchsuche Terraform, Dockerfiles und GitHub Actions nach Fehlkonfigurationen, oder bewerte einen einzelnen Codeausschnitt, direkt über die Kommandozeile.

Kanonische URL: https://lagune.ai/de-DE/docs/hooks/infra
Sprache: de-DE
Original: https://lagune.ai/docs/hooks/infra
Zuletzt aktualisiert: 2026-11-05

Der Hook `infra` meldet **Fehlkonfigurationen in Infrastructure as Code**, die sich aus der Datei selbst entscheiden lassen: ein Netzwerk, das für die ganze Welt offen ist, eine Berechtigung mit Wildcard, ein Secret in einem Manifest, ein Container, der als root läuft, ein nicht vertrauenswürdiger Wert in einer CI-Shell. Er liest nur IaC-Dateien (`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`). Er ist die deterministische Engine hinter der [Spezialisierung `infra`](https://lagune.ai/de-DE/docs/catalog), im Modus **scan** oder **check**.

## Ausführen

**Codebasis durchsuchen**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**Codeausschnitt prüfen**

Übergib den Codeausschnitt mit `--pattern` und seine Art mit `--kind` (`terraform`, `dockerfile` oder `github-actions`).

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

Der Durchlauf gibt bis zu zwei Abschnitte aus. **Infrastructure risks found** führt zu einem Exit-Code ungleich null und enthält die entscheidbaren Mängel (eine Ingress-Regel für `0.0.0.0/0` auf einem sensiblen Port, eine IAM-Anweisung mit Wildcard, ein Secret im Manifest, `encrypted = false`, ein Git-Modul ohne fixierte Version, ein Image, das ausdrücklich als root läuft, ein `curl | sh`, eine Script Injection in der CI, `permissions: write-all`). **Infrastructure hardening advisories** ändert den Exit-Code nicht (ein veränderliches Basis-Tag, eine Action, die nur über ein Tag fixiert ist). Findet er nichts, gibt er `no infrastructure risks found` aus.

## So liest du das Urteil

Der Modus check gibt das Tag mit dem höchsten Schweregrad aus, das er gefunden hat (zum Beispiel `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`), ein Hinweis-Tag (`mutable-tag`, `unpinned-action`) oder `safe`. Nur ein Tag mit dem Schweregrad eines Befunds führt zu einem Exit-Code ungleich null.

### CLI-Optionen

| Option      | Wert                                            | Beschreibung                                                                                 |
| ----------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `--pattern` | ein Codeausschnitt                              | Prüft einen Codeausschnitt. Erfordert `--kind`. Wiederhole die Option für mehrere.           |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | Die Art, als die der Codeausschnitt beurteilt wird.                                          |
| `--dir`     | ein Verzeichnis                                 | Beschränkt den Durchlauf auf ein Verzeichnis. Wiederholbar und mit `--file` kombinierbar.    |
| `--file`    | eine Datei                                      | Beschränkt den Durchlauf auf eine einzelne Datei. Wiederholbar und mit `--dir` kombinierbar. |

Ohne Option durchsucht er jede IaC-Datei im Projekt. `--pattern` lässt sich nicht mit `--dir` oder `--file` kombinieren.

### Festlegen, was er durchsucht

Er lässt aus, was **Git** ignoriert. Wenn du mehr auslassen oder auch durchsuchen willst, was **Git** ignoriert, gib `infra` eigene Einstellungen:

```bash
npx lagune write add --ignore examples --checker infra
```

```json
{
  "checkers": {
    "infra": { "gitignore": false, "ignore": ["examples"] }
  }
}
```

[Hooks konfigurieren](https://lagune.ai/de-DE/docs/hooks/configure) beschreibt jede Einstellung.

**Tipp**

Der Hook findet die offensichtlichen, entscheidbaren Fälle: Fehlende Verschlüsselung, die Exposition über `pull_request_target` und der passende IAM-Umfang bleiben Ermessensfragen, die die [Spezialisierung `infra`](https://lagune.ai/de-DE/docs/catalog) abdeckt.

## Häufige Fragen

### Welche Infrastrukturdateien liest der Hook infra?

Terraform und HCL (.tf, .tf.json, .hcl), Dockerfiles sowie Workflow- und Action-YAML von GitHub Actions unter .github/. Er erreicht diese Dateien, obwohl die Scanner für Quellcode sie überspringen.
