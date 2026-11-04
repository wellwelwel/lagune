# Migrate: Stelle ein manifestbasiertes Lagune-Projekt auf die Skills und Plugins um

> Stelle ein manifestbasiertes Lagune-Projekt auf die auf Skills basierende Version von Lagune um und behalte deine charter, deine Artefakte, die Nachverfolgung und deine eigenen Spezialisierungen.

Kanonische URL: https://lagune.ai/de-DE/docs/commands/migrate
Sprache: de-DE
Original: https://lagune.ai/docs/commands/migrate
Zuletzt aktualisiert: 2026-11-04

🔀 Stelle ein manifestbasiertes Projekt von **Lagune** auf die auf Skills basierende Version von **Lagune** um und behalte alles, was du geschrieben hast.

**Hinweis zur Abkündigung**

Ein Projekt mit Manifest funktioniert bis `v1.x` unverändert weiter: `npx lagune` übergibt `init`, `pull`, `update`, `add`, `remove`, `list` und das Dashboard an `lagune@0.15.0`, die letzte manifestbasierte Version.

## So stellst du um

1. Stelle sicher, dass deine aktuelle Arbeit committet ist, und führe migrate dann im Stammverzeichnis des Projekts aus:

   ```bash
   npx lagune migrate
   ```

2. Committe die Änderungen von migrate in einem eigenen Commit, damit die Umstellung eine einzige, prüfbare Änderung bleibt.
3. Installiere die Befehle für deinen Agenten, wie es die [Installationsseite](https://lagune.ai/de-DE/docs) zeigt.
4. Hat das Projekt bereits ein Artefakt von detect, plan oder harden, bitte [`/lagune-repair`](https://lagune.ai/de-DE/docs/commands/repair), die alten Verweise darin und in deinen eigenen Spezialisierungen abzugleichen:

   ```prompt
   /lagune-repair Gleiche die angewendeten Spezialisierungen (früher Sub-Skills) in den Artefakten unter `.lagune/memory/` (`detect.md`, `plan.md` und `harden.md`) mit den Namen ab, die der neue Katalog auflistet, und schreibe jeden Aufruf, den meine eigenen Spezialisierungen in `.lagune/catalog/` an die alten Hooks in `.lagune/hooks/` richten, in einen Aufruf des Tools `lagune_read` oder `lagune_write` um.
   ```

## Was sich ändert

| Vorher                                                                  | Nachher                                                                                        |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `.lagune/templates/`, `.lagune/hooks/` und `.lagune/specializations.md` | Entfernt: Jeder Skill bringt seine Vorlage mit, und die Engine führt die Hooks aus             |
| Die Kopien der integrierten Spezialisierungen in `.lagune/skills/`      | Entfernt: Die Engine liefert die integrierten aus                                              |
| Deine eigenen Spezialisierungen in `.lagune/skills/`                    | Verschoben nach `.lagune/catalog/`                                                             |
| `.lagune/skills.json`, der Index deiner eigenen Spezialisierungen       | Zusammengeführt in `.lagune/configs.json`                                                      |
| Die Kategorien des Manifests                                            | Eingetragen in `.lagune/configs.json`                                                          |
| Die alten Agentenbefehle, etwa `/lagune.detect`                         | Entfernt: Mit der [Installation von **Lagune**](https://lagune.ai/de-DE/docs) kommen die neuen, etwa `/lagune-detect` |
| Der Block von **Lagune** in `.gitignore`                                | Entfernt, zusammen mit der Datei, wenn sie sonst nichts enthielt                               |
| `.lagune/proofs/`, von diesem Block ignoriert                           | Durch eine eigene `.gitignore` aus Commits herausgehalten                                      |
| `.lagune/manifest.json`                                                 | Gelöscht, als Letztes                                                                          |

Deine Sicherheitsarbeit bleibt, wie sie ist: die charter, das Artefakt, das jede Phase erzeugt hat, und die Tracking-Map mit den Pfaden, auf die jeder Befund zeigt.

## Häufige Fragen

### Muss ich migrieren?

Ja. Manifestbasierte Projekte sind abgekündigt und funktionieren nur bis v1.x weiter, führe also npx lagune migrate aus, um deins umzustellen.

### Was behält migrate bei?

Deine charter, jedes Artefakt der Phasen, die Tracking-Map, deine Kategorien und deine eigenen Spezialisierungen. Die Spezialisierungen ziehen nach .lagune/catalog/ um, und ihr Index landet zusammen mit deinen Kategorien in .lagune/configs.json.

### Wann installiere ich die neuen Befehle?

Nach migrate, wie es die Installationsseite für deinen Agenten zeigt. Vorher zu installieren funktioniert auch, da migrate den neuen Befehl /lagune behält.

### Ein Teammitglied hat schon migriert. Was führe ich aus?

Hol dir die Umstellung per Pull und führe dann einmal npx lagune migrate aus. Der Befehl entfernt, was die manifestbasierte Version von Lagune in deinem Klon hinterlassen hat und was die Versionsverwaltung nie mitgeführt hat, und hält deine Nachweise aus Commits heraus.
