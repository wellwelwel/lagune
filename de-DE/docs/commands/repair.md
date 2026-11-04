# /lagune-repair: Repariere die defekte Nachverfolgung von Befunden

> Repariere die Kette, wenn eine Umbenennung oder eine verschobene Datei die Nachverfolgung von Lagune durcheinanderbringt.

Kanonische URL: https://lagune.ai/de-DE/docs/commands/repair
Sprache: de-DE
Original: https://lagune.ai/docs/commands/repair
Zuletzt aktualisiert: 2026-11-04

🧰 Repariere die Kette, wenn eine Umbenennung oder eine verschobene Datei sie durcheinanderbringt.

**Interne Wartung, keine Sicherheitsphase**

Repair ist keine sechste Phase im linearen Workflow. Der Befehl hat die Aufgabe, die Nachverfolgung stimmig zu halten.

```prompt
# Der Befehl nimmt keine Eingabe: Er repariert immer die gesamte Kette
/lagune-repair
```

## So funktioniert es

Jeder Befund aus detect ist ein nachverfolgter Eintrag, den plan, harden und verify weitertragen. Jede dieser Phasen bearbeitet ihn und führt ihn erneut unter seinem Namen auf. Dieser Name, der in jedem Artefakt identisch als Abschnittstitel steht, ist durchgehend seine Identität.

Das einzig Veränderliche, das die Nachverfolgung speichert, sind die Dateipfade, auf die der Eintrag zeigt. Diese Pfade stehen nirgendwo sonst, daher kann eine Umbenennung oder eine verschobene Datei die Verknüpfung nur dort unterbrechen, nie in zwei auseinanderlaufenden Kopien. Passiert das, korrigiert repair die Tracking-Map (`.lagune/tracking.json`), damit die Identität die Umbenennung übersteht. Der Befehl liest die Artefakte und die Tracking-Map, liest deinen Quellcode nur, um den neuen Pfad einer umbenannten Datei zu erfahren, und verfasst nie Sicherheitsinhalte.

Im selben Durchlauf prüft repair jedes Artefakt im Gedächtnis anhand seiner Vorlage und meldet, was davon abweicht, jeweils mit Verweis auf die Phase, die es behebt.

**Tipp**

- Repair rührt weder deinen Code noch die Textartefakte an, nur die Nachverfolgung.
- Von Hand führst du den Befehl selten aus. Bemerkt eine Phase, dass die Kette inkonsistent ist, führt sie repair für dich aus und macht weiter.
- Die Nachverfolgung, die der Befehl pflegt, liegt in `.lagune/tracking.json`, einem internen Zustand, den du nie von Hand bearbeitest.
