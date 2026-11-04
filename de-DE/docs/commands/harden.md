# /lagune-harden: Setze Sicherheitskorrekturen in deinem Code um

> Setze die Korrekturen aus dem Plan in deinem Code um, sicher und eine nach der anderen.

Kanonische URL: https://lagune.ai/de-DE/docs/commands/harden
Sprache: de-DE
Original: https://lagune.ai/docs/commands/harden
Zuletzt aktualisiert: 2026-11-04

🔧 Setze die Korrekturen aus dem Plan in deinem Code um, sicher und eine nach der anderen.

## Verwendung

**Alles umsetzen**

```prompt
/lagune-harden
```

**Pfade angeben**

```prompt
/lagune-harden src/routes/upload.ts
```

**Nach Priorität**

```prompt
/lagune-harden Priorität kritisch und hoch
```

## So funktioniert es

Der Plan hat jede Korrektur bereits festgelegt, harden setzt sie also nur noch um. Da harden die einzige Phase ist, die deinen Code anfasst, geht sie behutsam vor: Sie setzt eine Korrektur nach der anderen um, damit jede Änderung leicht zu prüfen bleibt, und schwächt nie eine Schutzmaßnahme ab, nur damit eine Korrektur passt. Zum Beispiel die Korrektur für den Upload:

- **Datei-Uploads** (Status: **Applied**)
  - _Was sich geändert hat:_ prüft den tatsächlichen Typ und die Größe der Datei, lehnt alles Unerwartete ab, benennt sie beim Speichern um und legt sie dort ab, wo sie nicht als Code ausgeführt werden kann.
  - _Wo:_ die Funktion `handleUpload` sowie die Speicher-Hilfsfunktion, die sie aufruft.

Lässt sich eine Korrektur nicht vollständig umsetzen, erledigt harden, was gefahrlos möglich ist, markiert den Rest als **Partial** oder **Blocked** und lässt ihn offen.

**Applied heißt nicht verifiziert**

Applied bedeutet noch nicht nachgewiesen. Dafür ist [verify](https://lagune.ai/de-DE/docs/commands/verify) da.

**Tipp**

- Die Phase baut vollständig auf dem Plan auf. Wurde eine Korrektur oder Datei nie geplant, fordert sie dich auf, zuerst `/lagune-plan` dafür auszuführen.
- Ein erneuter Lauf gleicht das Protokoll ab: Rückgängig gemachte Änderungen fallen weg, neu umgesetzte Korrekturen kommen hinzu.
- Das Härtungsprotokoll liegt in `.lagune/memory/harden.md`.

**Hängt von plan ab und ändert deinen Code**

Harden baut auf [`/lagune-plan`](https://lagune.ai/de-DE/docs/commands/plan) auf. Es ist die einzige Phase, die deinen Code ändert.

## Nächster Schritt

Weise nach, dass jede Korrektur greift: [`/lagune-verify`](https://lagune.ai/de-DE/docs/commands/verify).

## Häufige Fragen

### Ändert /lagune-harden meinen Code?

Ja. Harden ist die einzige Phase, die deinen Code anfasst, und setzt die Korrekturen aus dem Plan eine nach der anderen um.

### Was bedeuten Applied, Partial und Blocked?

Das ist der Status, den Lagune für jede Korrektur festhält. Applied bedeutet, dass die Korrektur umgesetzt wurde, Partial, dass sie nur zum Teil umgesetzt wurde, und Blocked, dass sie sich nicht umsetzen ließ. Applied bedeutet noch nicht nachgewiesen.

### Setzt Lagune Korrekturen um, ohne zu fragen?

Ob eine Änderung deine Zustimmung braucht, entscheiden dein Agent und der Berechtigungsmodus, in dem du ihn ausführst, nicht Lagune: Lagune fügt keine eigene Bestätigungsstufe hinzu. Trotzdem schwächt es nie eine Schutzmaßnahme ab, nur um einer Korrektur gerecht zu werden, und würde eine Korrektur gegen eines deiner Sicherheitsprinzipien verstoßen, hält es an und sagt es dir zuerst.
