# /lagune-prove: ausschließlich defensiver Proof of Concept

> Mach aus jedem erkannten Befund einen ausführbaren, ausschließlich defensiven Proof of Concept (PoC) samt Sicherheitshinweis für Responsible Disclosure.

Kanonische URL: https://lagune.ai/de-DE/docs/commands/prove
Sprache: de-DE
Original: https://lagune.ai/docs/commands/prove
Zuletzt aktualisiert: 2026-11-03

🧪 Mach aus jedem erkannten Befund ausführbare, ausschließlich defensive Belege für Responsible Disclosure.

Für jeden Befund in der Bestandsaufnahme von detect schreibt der Befehl einen in sich geschlossenen Sicherheitshinweis und einen Test, der den **sicheren Pfad** prüft. So schlägt der Test fehl, solange das Problem besteht, und läuft durch, sobald der Code korrigiert ist.

**Tipp**

Die Tests von **Lagune** liegen isoliert unter `.lagune/`, getrennt von deiner eigenen Testsuite.

## Verwendung

**Alle Befunde**

```prompt
/lagune-prove
```

**Ein Befund nach Name**

Sieh dir die bereits nachverfolgten Befunde mit ihrem Namen an:

```prompt
npx lagune read list --findings

# Findings
#   ...
#   • SQL-Injection bei der Benutzersuche
#   ...
```

```prompt
# Weise dann einen davon nach
/lagune-prove SQL-Injection bei der Benutzersuche
```

## So funktioniert es

Der Befehl liest den Quellcode, auf den jeder Befund zeigt, und legt unter `.lagune/proofs/` pro nachgewiesenem Befund einen Ordner mit genau zwei Dateien an:

| Datei                           | Was sie ist                                                                                                                                                                            |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `report.test.mjs` (oder `.cjs`) | Der Test. Nutzt dein Projekt bereits Poku, läuft er damit, sonst mit dem nativen Test-Runner von Node.js, sodass nichts installiert werden muss.                                       |
| `report.md`                     | Ein in sich geschlossener Sicherheitshinweis: Schweregrad, Auswirkung, wie sich das Problem reproduzieren lässt und der Befehl zum Ausführen, auch ohne weiteren Kontext verständlich. |

Die Nachweise sind immer in JavaScript geschrieben und bleiben so portabel, egal in welcher Sprache dein Projekt geschrieben ist. Eine `README.md` dient als Index, verlinkt jeden Nachweis und nennt einen einzigen Befehl, um alle auszuführen.

**Tipp**

- Prove ist **optional und eigenständig**: keine der fünf Phasen und nicht Teil der Kette der Nachverfolgung.
- Prove schreibt nur in `.lagune/proofs/` und rührt weder die Artefakte der Phasen noch deinen Code an, den der Befehl nur liest.
- Ein Befund, dessen Test das Problem nicht reproduziert, erhält keinen Nachweis, und der Befehl fordert dich auf, [`/lagune-detect`](https://lagune.ai/de-DE/docs/commands/detect) für diese Stelle auszuführen, um abzugleichen.
- Ein erneuter Lauf gleicht die Nachweise ab: Ist ein Befund verschwunden oder lässt er sich nicht mehr reproduzieren, wird sein Ordner entfernt.

**Hinweis**

**Der Befehl läuft nur, wenn du ihn aufrufst:** Der Agent startet ihn nie von sich aus.

**Baut auf detect auf**

Prove liest die Bestandsaufnahme von [`/lagune-detect`](https://lagune.ai/de-DE/docs/commands/detect), führe detect also zuerst aus.

## Ausschließlich defensiv und autorisiert

Bevor der Befehl etwas erzeugt, vergewissert er sich, dass du berechtigt bist, das Ziel zu testen, und lehnt jede Anfrage nach einem funktionierenden Exploit, einer Angriffs-Payload oder einer Umgehung der Erkennung ab. Ein Nachweis zeigt das sichere Verhalten und gibt nie eine Angriffseingabe aus.

## Vom Nachweis zur Offenlegung

Die beiden Dateien eines nachgewiesenen Befunds gehören zusammen in einen **privaten GitHub Gist**, um die Schwachstelle zu melden. Sie belegen ein bestehendes, noch nicht offengelegtes Problem, deshalb hält eine `.gitignore` in `.lagune/proofs/` sie aus jedem Commit heraus: Teile sie nur über diesen Gist, bis die Maintainer das Problem behoben haben.

Einen Befund in der Kette von **Lagune** abzuschließen, bleibt Aufgabe von [`/lagune-harden`](https://lagune.ai/de-DE/docs/commands/harden) und [`/lagune-verify`](https://lagune.ai/de-DE/docs/commands/verify): Prove liefert Belege, schließt aber nichts ab.

## Häufige Fragen

### Erzeugt Lagune Exploits?

Nein. /lagune-prove schreibt ausschließlich defensive Belege: einen Test, der den sicheren Pfad prüft, sodass er fehlschlägt, solange das Problem besteht, und durchläuft, sobald der Code korrigiert ist, dazu einen Sicherheitshinweis für Responsible Disclosure.

### Was gibt prove aus?

Zwei Dateien pro Befund: einen Test (report.test.mjs oder .cjs) und einen Sicherheitshinweis (report.md).

### Wie lege ich eine von Lagune gefundene Schwachstelle verantwortungsvoll offen?

Prove schreibt einen in sich geschlossenen Sicherheitshinweis, den du nach den Regeln der Responsible Disclosure über einen privaten Kanal teilen kannst, etwa einen privaten GitHub Gist.
