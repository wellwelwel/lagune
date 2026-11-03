# /lagune-charter: Lege deine Sicherheitsprinzipien fest

> Lege die Sicherheitsprinzipien deines Projekts fest, also die Regeln, an die sich jede spätere Phase hält, und trage die Spezialisierungskategorien ein, die die Analyse des Projekts stützt.

Kanonische URL: https://lagune.ai/de-DE/docs/commands/charter
Sprache: de-DE
Original: https://lagune.ai/docs/commands/charter
Zuletzt aktualisiert: 2026-11-03

🧬 Erzähl **Lagune**, worum es in deinem Projekt geht, und es macht daraus deine Sicherheitsregeln (ohne Beschreibung leitet es sie allein aus dem Projekt ab).

Die charter ist die übergeordnete Ebene: eine Reihe von Prinzipien, bei denen Sicherheit an erster Stelle steht und die jede spätere Phase einhalten muss. Stell sie dir als Prüfung zur Kompilierzeit für das Sicherheitsniveau deines Projekts vor.

## Verwendung

**Beschreiben**

```prompt
/lagune-charter Mein Projekt ist ein Onlineshop, der Videospiele verkauft. Kunden legen Produkte in einen Warenkorb und bezahlen per Kreditkarte oder Überweisung. Sie können ihre Bestellungen und den Status jeder einzelnen sehen.
```

**Lagune vorschlagen lassen**

```prompt
/lagune-charter
```

> _Ich sehe eine Zahlungsbibliothek, eine Anmeldefunktion und ein Bestellmodell, das mit einem Kunden verknüpft ist. Das sieht nach einem Onlineshop aus, der etwas verkauft. Kunden bezahlen und verfolgen ihre eigenen Bestellungen..._ ☁️

## Was die charter ableitet

**Lagune** nimmt deine Beschreibung oder dein **PRD** als Richtung, leitet ab, was daraus für die Sicherheit folgt, und liest dann das Projekt, um über das hinauszugehen, was du genannt hast. Zum Beispiel:

- Ein Warenkorb, der Bestellungen enthält, bedeutet, dass es eine **Datenbank** gibt:
  - z. B. `"Wo liegen die Daten?"`, `"Wer kann darauf zugreifen?"`, `"Gibt es ein Datenleck?"`.
- Dass Kunden ihre eigenen Bestellungen sehen können, bedeutet, dass es eine Art **Anmeldung oder Zugriffskontrolle** gibt:
  - z. B. `"Kann ein Kunde die Bestellungen eines anderen aufrufen?"`, `"Sind die Sitzungen geschützt?"`.
- Zahlungen per Karte und Überweisung bedeuten, dass **Geld und sensible Daten im Spiel sind**:
  - z. B. `"Werden Kartendaten gespeichert?"`, `"Werden Zahlungen überprüft?"`.

Deine Beschreibung und das Projekt ergänzen sich: Deine Beschreibung gibt die Absicht vor, und ein Blick in die Abhängigkeiten, die README und die Konfiguration bringt ans Licht, was du nicht erwähnt hast. Ist danach noch etwas Wichtiges unklar, stellt **Lagune** eine kurze, verständliche Frage, statt zu raten.

Daraus erstellt **Lagune** maßgeschneiderte Sicherheitsregeln für das Projekt, die du jederzeit prüfen und anpassen kannst.

**Das Beste herausholen**

- Du kannst auch eigene Sicherheitsregeln für das Projekt festlegen.
- Je mehr relevante Details du angibst, desto besser wird der abschließende Bericht:
  - Erkläre das Projekt, wie es funktioniert und was unter der Haube passiert.
  - Wer ist der Endnutzer? Was dürfen Nutzer tun und was nicht?
  - Details zum Verhalten sind genauso wertvoll wie technische Details.
- Das Gedächtnis der charter liegt in `.lagune/memory/charter.md`.

## Die eingetragenen Kategorien

Spezialisierungen, also das Sicherheitswissen, das die späteren Phasen bei Bedarf laden, landen im [Katalog](https://lagune.ai/de-DE/docs/catalog) deines Projekts, und zwar nach [Kategorie](https://lagune.ai/de-DE/docs/categories). Solange in deinem Projekt keine Kategorie eingetragen ist, trägt die charter jede ein, die ihre Analyse des Projekts stützt, etwa die Sprache deines Projekts, Aufrufe an ein LLM oder Container, und nennt sie in ihrer Zusammenfassung.

Sind Kategorien eingetragen, lässt die charter sie unverändert und nennt nur noch Kategorien, die dein Projekt noch nicht nutzt. Ändern kannst du sie jederzeit selbst:

```bash
npx lagune write add --categories python
npx lagune write remove --categories python
```

## Nächster Schritt

Sind die Regeln festgelegt, erfasse, was dein System tatsächlich tut: [`/lagune-detect`](https://lagune.ai/de-DE/docs/commands/detect).

## Häufige Fragen

### Was ist die charter bei Lagune?

Die charter ist die übergeordnete Ebene von Lagune, eine Reihe von Prinzipien, bei denen Sicherheit an erster Stelle steht und die jede spätere Phase einhalten muss. Stell sie dir als Prüfung zur Kompilierzeit für das Sicherheitsniveau deines Projekts vor.

### Wo wird die charter gespeichert?

In .lagune/memory/charter.md.

### Kann ich eigene Regeln in die charter schreiben?

Ja. Lagune schlägt Regeln auf Basis deiner Beschreibung und deines Codes vor, und du kannst sie umformulieren, streichen, ergänzen oder ihren Geltungsbereich eingrenzen.

### Wählt die charter meine Spezialisierungskategorien aus?

Nur solange keine eingetragen ist. Dann trägt sie jede Kategorie ein, die ihre Analyse des Projekts stützt, etwa deine Programmiersprache oder Aufrufe an ein LLM. Sind Kategorien eingetragen, ändert sie sie nie.
