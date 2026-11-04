# /lagune-verify: Weise nach, dass Schutzmaßnahmen greifen

> Weise nach, dass jede umgesetzte Korrektur greift, und schließe die ab, die den Nachweis bestehen.

Kanonische URL: https://lagune.ai/de-DE/docs/commands/verify
Sprache: de-DE
Original: https://lagune.ai/docs/commands/verify
Zuletzt aktualisiert: 2026-11-04

⚖️ Weise nach, dass jede umgesetzte Korrektur greift, indem du den Code liest und ihn dem gegenüberstellst, was harden festgehalten hat, und schließe dann die ab, die den Nachweis bestehen.

## Verwendung

**Alles verifizieren**

```prompt
/lagune-verify
```

**Pfade angeben**

```prompt
/lagune-verify src/routes/upload.ts
```

**Nach Priorität**

```prompt
/lagune-verify Priorität kritisch und hoch
```

## So funktioniert es

Verify liest den Code an jeder Stelle, die harden festgehalten hat, und bestätigt, dass er wirklich der Behauptung entspricht. Der Nachweis ist genau diese Gegenüberstellung, Code gegen Protokoll. Jede Schutzmaßnahme erhält eines von drei Urteilen:

| Urteil                       | Bedeutung                                                                |
| ---------------------------- | ------------------------------------------------------------------------ |
| ✅ Risk closed               | Der Code tut genau das, was das Protokoll behauptet.                     |
| ❌ Risk not closed           | Die Schutzmaßnahme ist noch offen. Verify schickt dich zurück zu harden. |
| ❓ Cannot tell from the code | Der Beleg ist allein im Code nicht sichtbar.                             |

Ein nachweislich geschlossenes Risiko trägt verify dann mit deiner Bestätigung aus der Kette aus. Zum Beispiel:

- **Datei-Uploads** (Urteil: **✅ Risk closed**)
  - _Wie nachgewiesen:_ Verify hat den Upload-Handler gelesen und festgestellt, dass er den tatsächlichen Dateityp anhand des Inhalts erkennt, ein Größenlimit durchsetzt und alles andere ablehnt, genau wie das Protokoll behauptet.
  - _Beleg:_ die Funktion `handleUpload`, die den tatsächlichen Dateityp anhand des Inhalts erkennt.

Ist das Risiko nicht geschlossen, sagt verify das klar und schickt dich zurück zu [`/lagune-harden`](https://lagune.ai/de-DE/docs/commands/harden), da die Korrektur noch offen ist.

**Tipp**

- Verify baut vollständig auf dem Härtungsprotokoll auf.
- Verify liest deinen Code nur, um ihn zu beurteilen, und schwächt nie eine Schutzmaßnahme ab oder schreibt den Code um, damit ein Urteil positiv ausfällt.
- Ein erneuter Lauf gleicht die Urteile ab: Veraltete fallen weg, und ein Risiko, das nicht mehr geschlossen ist, wird erneut gemeldet.
- Ist ein Risiko nachweislich geschlossen, fragt verify einmal nach und entfernt diesen Befund dann aus der gesamten Kette (detect, plan, harden und die Nachverfolgung).
- Verify schreibt keinen eigenen Bericht: Jedes Urteil steht im Block seiner Schutzmaßnahme in `.lagune/memory/harden.md`, wo harden es beim nächsten Lauf liest.

**Hängt von harden ab**

Verify baut auf [`/lagune-harden`](https://lagune.ai/de-DE/docs/commands/harden) auf.

## Der Zyklus schließt sich

Ist alles im betrachteten Umfang ausgetragen, ist der Zyklus im Ruhezustand. Er öffnet sich erst wieder, wenn sich der Code ändert. Sicherheit ist abschließbar, also hat der Workflow einen Endzustand statt einer Endlosschleife.

## Häufige Fragen

### Wie verifiziert Lagune eine Korrektur?

/lagune-verify liest den Code, stellt ihn dem gegenüber, was harden festgehalten hat, und gibt eines von drei Urteilen zurück: Risk closed, Risk not closed oder Cannot tell from the code.

### Was bedeutet es, einen Befund auszutragen?

Weist verify nach, dass ein Risiko geschlossen ist, wird der Befund ausgetragen: Er wird mit deiner Bestätigung aus der gesamten Kette entfernt, damit er nicht immer wieder verarbeitet wird.

### Kann Sicherheitsarbeit jemals abgeschlossen sein?

Ja. SDH ist abschließbar: Ein nachweislich geschlossener Befund wird ausgetragen, also hat der Workflow einen Endzustand statt einer Endlosschleife.
