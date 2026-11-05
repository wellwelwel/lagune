# Dashboard

> Diese Seite ist gegenüber ihrer englischen Version veraltet. [Originalversion lesen](https://lagune.ai/docs/get-started/dashboard).

> Sieh dir die Sicherheitsprinzipien, die Befunde und den Katalog deines Projekts in einer lokalen Live-Ansicht an, die sich mit einem einzigen Befehl öffnet.

Kanonische URL: https://lagune.ai/de-DE/docs/get-started/dashboard
Sprache: de-DE
Original: https://lagune.ai/docs/get-started/dashboard
Zuletzt aktualisiert: 2026-11-05

Führe **Lagune** direkt und ohne Unterbefehl aus, um `.lagune/` in einer interaktiven Live-Ansicht zu sehen. Der Befehl startet ein Dashboard und öffnet es auf einem zufälligen Port:

```bash
npx lagune
```

- [x] **Live-Reload**
- [x] **Privat** und **lokal**
- [x] Zeigt alles, was `.lagune/` enthält, sobald die ersten Sicherheitsprinzipien stehen
- [x] **Verwalte** die Kategorien des Projekts direkt in deinem Browser
- [x] Weder `node_modules` noch `package.json` nötig 📦

![Sicherheitsprinzipien im Dashboard von Lagune](https://lagune.ai/img/dashboard/02.webp)

![Befunde im Dashboard von Lagune](https://lagune.ai/img/dashboard/03.webp)

![Side Quests im Dashboard von Lagune](https://lagune.ai/img/dashboard/04.webp)

![Detailansicht eines Befunds im Dashboard von Lagune](https://lagune.ai/img/dashboard/05.webp)

![Katalog im Dashboard von Lagune](https://lagune.ai/img/dashboard/06.webp)

**Tipp**

- 🚪 Nutze `--port`, um einen eigenen Port festzulegen.
- ⏏️ Drücke `Ctrl+C` zum Beenden.

## Häufige Fragen

### Wie öffne ich das Dashboard von Lagune?

Führe npx lagune ohne Unterbefehl im Stammverzeichnis deines Projekts aus. Der Befehl stellt eine Live-Ansicht von .lagune/ auf einem zufälligen Port bereit und öffnet sie in deinem Browser.

### Ist das Dashboard privat?

Ja. Es läuft nur auf deinem eigenen Rechner, unter einer lokalen Adresse, die kein anderer Computer erreichen kann.

### Kann ich mein Projekt über das Dashboard ändern?

Nur seine Kategorien, und zwar in deinem Browser. Alles andere, was das Dashboard zeigt, ist schreibgeschützt.
