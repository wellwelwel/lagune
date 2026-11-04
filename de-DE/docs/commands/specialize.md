# /lagune-specialize: Trainiere eine Sicherheitsspezialisierung mit einfachem Text

> Verdichte eine Quelle oder ein Thema zur Sicherheit, das du vorgibst, zu einer neuen Spezialisierung, die bei Bedarf geladen wird.

Kanonische URL: https://lagune.ai/de-DE/docs/commands/specialize
Sprache: de-DE
Original: https://lagune.ai/docs/commands/specialize
Zuletzt aktualisiert: 2026-11-04

🎓 Bring **Lagune** eine neue Spezialisierung bei, aus einer Quelle oder einem Thema, das du vorgibst.

Der Befehl liest das Material und verdichtet es zu einer fokussierten, ausschließlich defensiven Spezialisierung, die genauso aufgebaut ist wie die [integrierten](https://lagune.ai/de-DE/docs/catalog), sodass die Phasen detect und verify sie danach wie jede andere laden. Er auditiert und erklärt nur: Er schreibt nie Angriffseingaben oder Exploits und rührt deinen Code nie an.

**Aus einem Artikel**

```prompt
# Ein Link oder eine Quellenangabe: Lagune verdichtet sie zur Abwehr
/lagune-specialize https://owasp.org/www-community/attacks/SQL_Injection
```

**Aus einem Exploit**

```prompt
# Ein Angriff als Quelle: Die Spezialisierung bleibt trotzdem die Abwehr
/lagune-specialize "' OR 1=1 -- schleust SQL in den Abfragetext ein"
```

**Aus einem Thema**

```prompt
# Oder nenne einfach, was abgedeckt werden soll
/lagune-specialize SQL-Injection
```

**Ein Angriff kann die Quelle sein, nie das Ergebnis**

Den Befehl auf einen Angriff anzusetzen, ist in Ordnung, wenn das Ziel ist, sich dagegen zu verteidigen: Die Beschreibung eines Exploits ist Studienmaterial, das er zur Abwehr verdichtet. Die Spezialisierung, die er erzeugt, auditiert und erklärt immer und liefert nie einen funktionierenden Exploit, eine Payload oder eine Umgehung.

## Was der Befehl schreibt

Das Ergebnis sind zwei Dateien in deinem Projekt, die zusammen mit deinem Code committet werden und sich prüfen lassen:

- Die Spezialisierung unter `.lagune/catalog/<name>.md`, aufgebaut wie die [integrierten](https://lagune.ai/de-DE/docs/catalog).
- Ihr Eintrag in `.lagune/configs.json`, wo dein Projekt seine eigenen Spezialisierungen indexiert, damit der Katalog sie mit den integrierten zusammenführt.

Danach listet der Befehl den Katalog auf, um zu bestätigen, dass der neue Eintrag vorhanden ist. Deine eigenen Spezialisierungen sind immer im Katalog, unabhängig von seinen Kategorien. Du fügst nie einen Befehl hinzu und rührst das Paket nicht an: Ein neues Spezialgebiet besteht aus einer Wissensdatei und einem Indexeintrag, geschrieben in dein eigenes Projekt.

## Verfeinern, nie überschreiben

Spezialisierst du einen Namen, den es schon gibt, ob eine integrierte Spezialisierung wie `regex` oder eine, die du früher selbst angelegt hast, wird die vorhandene Datei **abgeglichen** statt ersetzt. Der Befehl liest, was da ist, arbeitet das neue Wissen ein, behält, was weiterhin gilt, und schreibt um, was sich geändert hat. Nichts wird ungesehen verworfen. Eine eigene Spezialisierung überdeckt eine integrierte mit demselben Namen, sodass du eine integrierte für dein eigenes Projekt schärfen kannst, ohne sie zu verlieren.

**Tipp**

- Die neue Spezialisierung wird genau wie eine integrierte geladen: Die Phasen detect und verify ziehen sie bei Bedarf heran, oder du lädst sie selbst mit `npx lagune read catalog <name>` und gibst ihr eine Aufgabe.
- Hat das Material eine erkennbare Herkunft (ein Artikel, ein Autor, ein Link, ein Standard), führt die Spezialisierung sie als Quelle an. Ein bloßes Thema hat keine Quelle.

**Hinweis**

**Der Befehl läuft nur, wenn du ihn aufrufst:** Der Agent startet ihn nie von sich aus.

## Häufige Fragen

### Wie füge ich eine eigene Sicherheitsspezialisierung hinzu?

Führe /lagune-specialize mit einer Quelle oder einem Thema aus. Der Befehl verdichtet sie zu einer ausschließlich defensiven Spezialisierung, die er nach .lagune/catalog/<name>.md schreibt, samt ihrem Eintrag in .lagune/configs.json.

### Kann Lagune aus einer Exploit-Beschreibung lernen?

Ja, als Quelle, nie als Ergebnis. Ein Angriff kann die Quelle sein, nie das Produkt. Specialize schreibt nie Angriffseingaben oder Exploits.

### Überschreibt specialize die integrierten Spezialisierungen?

Nein. Der Befehl verfeinert, statt zu überschreiben.
