# /lagune-detect: Erfasse dein System und seine Risiken

> Erfasse anhand deines Codes, was dein System tut und wo die Risiken liegen.

Kanonische URL: https://lagune.ai/de-DE/docs/commands/detect
Sprache: de-DE
Original: https://lagune.ai/docs/commands/detect
Zuletzt aktualisiert: 2026-11-04

🔬 Finde heraus, was dein System wirklich tut und wo die Risiken liegen.

Detect liest den Code und hält nur fest, was sich dort tatsächlich findet, zusammen mit den Belegen, die die späteren Phasen brauchen. Ihr oberster Grundsatz lautet: erkennen, nicht erfinden.

## Verwendung

**Vollständiger Durchlauf**

```prompt
/lagune-detect
```

**Pfade angeben**

```prompt
/lagune-detect src/routes/ src/auth.ts
```

**Anliegen beschreiben**

```prompt
/lagune-detect stelle sicher, dass Kundendaten nie offengelegt werden
```

## Was detect erfasst

**Lagune** liest den Code und erfasst, was es findet. Jeder Befund nennt, worum es sich handelt, warum es wichtig ist und den Beleg dafür. Zum Beispiel:

- **Datei-Uploads**, das System nimmt Dateien von Nutzern entgegen:
  - _Warum es wichtig ist:_ Eine als Bild getarnte Datei kann Schadcode verbergen.
  - _Beleg:_ Der Handler für `POST /upload` vertraut dem MIME-Typ, den der Client sendet, ohne den tatsächlichen Typ der Datei zu prüfen.
- **Anmeldung und Sitzungen**, Nutzer melden sich an, um auf ihr Konto zuzugreifen:
  - _Warum es wichtig ist:_ Eine schwache Sitzungsverwaltung ermöglicht es, dass jemand ein fremdes Konto übernimmt.
  - _Beleg:_ die Logik zur Ausgabe von Sitzungen, die Sitzungen ohne Ablaufzeit ausstellt.

Dabei fällt detect für jede Spezialisierung im [Katalog](https://lagune.ai/de-DE/docs/catalog) deines Projekts ein Urteil anhand des Codes, wendet die an, deren Kontext vorhanden ist, und trägt sie unter **Applied specializations** ein, der Liste, die harden und verify wiederverwenden.

Danach hast du eine klare Bestandsaufnahme dessen, was dein System tut und wo die Risiken liegen, als Grundlage für die nächsten Schritte.

**Tipp**

- Ein erneuter Lauf aktualisiert die Bestandsaufnahme: Gelöste Befunde fallen weg, neue kommen hinzu.
- Die Bestandsaufnahme von detect liegt in `.lagune/memory/detect.md`.

## Nächster Schritt

Mach aus der Bestandsaufnahme einen Plan: [`/lagune-plan`](https://lagune.ai/de-DE/docs/commands/plan).

## Häufige Fragen

### Was macht /lagune-detect?

Die Phase liest deinen Code und erfasst, was dein System tut und wo die Risiken liegen, wobei sie nur festhält, was sie tatsächlich findet. Ihr Grundsatz lautet: erkennen, nicht erfinden.

### Was ist ein Befund bei Lagune?

Ein Befund ist ein einzelnes erkanntes Risiko und nennt, worum es sich handelt, warum es wichtig ist und den Beleg im Code. Er ist die nachverfolgte Einheit, die plan, harden und verify weitertragen.

### Wo wird die Bestandsaufnahme von detect gespeichert?

In .lagune/memory/detect.md.

### Welche Spezialisierungen nutzt detect?

Jede im Katalog deines Projekts erhält ein Urteil anhand des Codes. Detect wendet die an, deren Kontext vorhanden ist, und trägt sie unter Applied specializations ein.
