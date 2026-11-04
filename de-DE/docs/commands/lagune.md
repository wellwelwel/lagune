# /lagune: sicherer Code, während deine KI ihn schreibt

> Baut, worum du bittest, und härtet es schon beim Schreiben, geleitet von deinen Sicherheitsprinzipien und ohne dass du einem Workflow folgen musst.

Kanonische URL: https://lagune.ai/de-DE/docs/commands/lagune
Sprache: de-DE
Original: https://lagune.ai/docs/commands/lagune
Zuletzt aktualisiert: 2026-11-04

⌨️ Lass die gewünschte Arbeit erledigen und schon beim Schreiben absichern. **`/lagune`** nimmt jeden Prompt in jedem Stadium deines Projekts an, baut, was du wolltest, und härtet es mit sicheren Standardwerten, bevor du es zurückbekommst.

## Verwendung

Versieh einen beliebigen Prompt mit **`/lagune`** und beschreibe die Arbeit wie gewohnt.

**📘 Anweisungen für Agenten**

```md
# Meine Projektanweisungen für Agenten

<!-- ... -->

## Sicherheit

- Verwende den Skill `/lagune`, wann immer du Code erstellst oder änderst, damit er standardmäßig für mehr Sicherheit sorgt.
```

    - Zum Beispiel: **AGENTS.md**, **CLAUDE.md**, **.github/copilot-instructions.md**, **.cursorrules** usw.

**💬 Ein Feature**

```prompt
/lagune ermögliche es Nutzern, ein eigenes Foto in ihr Profil hochzuladen.
```

**💬 Eine Korrektur**

```prompt
/lagune wenn der Nutzer das Formular absendet, passiert nichts. Finde heraus, woran es liegen könnte, und behebe es.
```

**💬 Ein Refactoring**

```prompt
/lagune entkopple und verbessere die Payload-Logik
```

**Optional, aber besser mit Sicherheitsprinzipien**

**`/lagune`** funktioniert mit und ohne Sicherheitsprinzipien. Hast du welche, prägen die eigenen Regeln deines Projekts alles, was dabei entsteht. Lege sie einmalig mit [`/lagune-charter`](https://lagune.ai/de-DE/docs/commands/charter) fest.

## So funktioniert es

Der Befehl begleitet die Arbeit in drei Schritten, ohne etwas in Lagune abzulegen:

1. Er lädt deine Sicherheitsprinzipien, falls es sie gibt, und lässt sie die gesamte Umsetzung bestimmen. Hast du noch keine, stützt er sich auf eine standardmäßig sichere Basis.
2. Er listet den [Katalog](https://lagune.ai/de-DE/docs/catalog) deines Projekts auf und lädt nur die Spezialisierungen, die deine Arbeit berührt, also dasselbe bei Bedarf geladene Wissen, das auch der Audit-Workflow nutzt.
3. Er setzt die Abwehr schon beim Schreiben des Codes um und liest sein eigenes Ergebnis anschließend noch einmal, um sicherzustellen, dass die Schutzmaßnahmen tatsächlich greifen, bevor du die Arbeit zurückbekommst.

Das Ergebnis ist funktionierender Code in deinem Projekt, sicher ab der ersten Zeile.

**Jederzeit einsetzbar**

Ohne detect, ohne plan, ohne Aufräumen hinterher. **`/lagune`** passt zu einem frischen Projektgerüst genauso wie zu einer Änderung an einer ausgereiften Codebasis und härtet die Arbeit fortlaufend, nicht erst später.

## Was der Befehl nicht tut

- Er schreibt nichts in den Ordner `.lagune`, kein Artefakt und keine Nachverfolgung, und erzeugt so nur den gehärteten Code, um den du gebeten hast.
- Er schwächt keine Regel ab, um einem Prompt gerecht zu werden: Würde deine Anfrage gegen eines deiner Sicherheitsprinzipien verstoßen, hält er an und sagt es dir zuerst, statt das Gewünschte einfach unsicher zu bauen.

## Häufige Fragen

### Was macht /lagune?

Der Befehl nimmt jeden Prompt in jedem Stadium an, baut, worum du gebeten hast, und härtet es mit sicheren Standardwerten, bevor du es zurückbekommst. Die Abwehr setzt er schon beim Schreiben des Codes um, nicht erst später.

### Muss ich Sicherheitsprinzipien festlegen, um /lagune zu nutzen?

Nein. Der Befehl funktioniert mit und ohne sie. Mit Sicherheitsprinzipien prägen die eigenen Regeln deines Projekts alles, was er baut. Ohne stützt er sich auf eine standardmäßig sichere Basis.

### Was ist der Unterschied zwischen /lagune und dem Blue-Team-Workflow?

/lagune sichert neue Arbeit ab, während du sie schreibst, ohne dass du einem Workflow folgen musst. Der Blue-Team-Workflow durchläuft die fünf Audit-Phasen der Reihe nach an einem bestehenden Projekt.

### Verfolgt /lagune Befunde nach oder schreibt der Befehl Artefakte?

Nein. Der Befehl schreibt nichts in den Ordner .lagune, kein Artefakt und keine Nachverfolgung. Er erzeugt nur den gehärteten Code, um den du gebeten hast.

### Wie bringe ich meinen Agenten dazu, /lagune automatisch zu nutzen?

Füge der Anweisungsdatei deines Agenten (AGENTS.md, CLAUDE.md, .cursorrules und Ähnliche) eine Anweisung hinzu, die ihn auffordert, den Skill /lagune immer dann zu verwenden, wenn er Code erstellt oder ändert.
