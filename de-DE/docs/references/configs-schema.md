# Konfigurationsschema

> Das JSON Schema für die Konfiguration eines Projekts mit Lagune, für Autovervollständigung und Validierung in deinem Editor, passend zur aktuellen Version von Lagune oder fest an eine Version gebunden.

Kanonische URL: https://lagune.ai/de-DE/docs/references/configs-schema
Sprache: de-DE
Original: https://lagune.ai/docs/references/configs-schema
Zuletzt aktualisiert: 2026-11-03

Die Datei `.lagune/configs.json` hält die [**Kategorien**](https://lagune.ai/de-DE/docs/categories) fest, die ein Projekt nutzt, und indexiert seine eigenen [**Spezialisierungen**](https://lagune.ai/de-DE/docs/catalog). Mit ihrem JSON Schema vervollständigt dein Editor jedes Feld automatisch und meldet einen Tippfehler oder eine unbekannte Kategorie, während du die Datei bearbeitest.

## Das aktuelle Schema

Immer wenn **Lagune** die Datei schreibt und darin kein `$schema` findet, trägt es das aktuelle Schema ein:

```json
{
  "$schema": "https://lagune.ai/schemas/configs.json",
  "categories": ["owasp", "javascript"]
}
```

Diese Adresse folgt immer der aktuellen Version von **Lagune**. Eine Datei, die vor **Lagune** 0.16.0 geschrieben wurde, erhält sie bei ihrer nächsten Änderung, und bis dahin weist jede Phase darauf hin.

## Eine Version festlegen

Jedes Release von **Lagune** ab 0.16.0 enthält das Schema so, wie es in dieser Version war, veröffentlicht auf **npm** und ausgeliefert über **jsDelivr**. Um eine Version festzulegen, trage die Version hinter `lagune@` in die Adresse von `$schema` ein:

```json
{
  "$schema": "https://cdn.jsdelivr.net/npm/lagune@0.16.0/schemas/configs.json"
}
```

Als Version ist jeder semver-Bereich möglich:

| Version              | Schema                            |
| -------------------- | --------------------------------- |
| `0.16.0`             | Das aus 0.16.0                    |
| `0.16.x` oder `0.16` | Das aus dem neuesten Release 0.16 |
| `0.x` oder `0`       | Das aus dem neuesten Release 0.x  |
| `latest`             | Das aus dem neuesten Release      |

## Häufige Fragen

### Braucht Lagune das Schema?

Nein. Das Schema hilft nur deinem Editor, und Lagune liest die Datei mit oder ohne $schema genauso.

### Überschreibt Lagune ein festgelegtes Schema?

Nein. Lagune schreibt $schema nur, wenn die Datei keins enthält, und behält jede Adresse bei, die du gesetzt hast.

### Wann sollte ich eine Version festlegen?

Wenn das Projekt eine bestimmte Version von Lagune nutzt, damit dein Editor die Datei gegen das prüft, was diese Version akzeptiert.
