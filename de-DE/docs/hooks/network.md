# Hook network: URLs auf SSRF bewerten

> Bewerte das SSRF-Risiko eines oder mehrerer Anfrageziele, direkt über die Kommandozeile.

Kanonische URL: https://lagune.ai/de-DE/docs/hooks/network
Sprache: de-DE
Original: https://lagune.ai/docs/hooks/network
Zuletzt aktualisiert: 2026-11-04

Der Hook `network` entscheidet, ob das Ziel einer serverseitigen Anfrage vor **SSRF** sicher ist (einer Anfrage, die sich auf interne Dienste, Cloud-Metadaten oder private Hosts richten lässt). Er ist die deterministische Engine hinter der [Spezialisierung `network`](https://lagune.ai/de-DE/docs/catalog), und du kannst ihn selbst ausführen.

## Ausführen

Übergib jedes Ziel mit `--url`. Der Hook gibt pro Ziel ein Wort aus, dessen Bedeutung die Tabelle weiter unten erklärt.

**Ein Ziel**

```bash
npx lagune read network --url 'http://example.com/'
# => safe

npx lagune read network --url 'http://0x7f000001/'
# => private-target
```

**Mehrere Ziele**

Wiederhole `--url`, um eine ganze Allowlist oder Denylist mit einem Aufruf zu bewerten, ein Urteil pro Zeile, in derselben Reihenfolge.

```bash
npx lagune read network \
  --url 'http://example.com/' \
  --url 'http://[::1]/' \
  --url 'http://allowed.com@evil.example/'
# => safe
# => private-target
# => parser-divergent
```

Er löst den Host so auf, wie es das Netzwerk tut, deshalb rutschen codierte Formen einer internen Adresse nicht durch: Hexadezimale, oktale, punktlose dezimale, verkürzte, IPv6- und IPv4-gemappte Schreibweisen ergeben alle `private-target`. Und wo ein nachlässiger Validator und der Client, der die Anfrage tatsächlich ausführt, unterschiedliche Hosts lesen würden, lautet das Urteil `parser-divergent`.

## So liest du das Urteil

| Urteil             | Bedeutung                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `safe`             | Das Ziel führt zu einem öffentlichen Host, und ein nachlässiger Validator würde denselben Host lesen.            |
| `private-target`   | Der Host löst zu einer privaten, Loopback-, Link-Local-, unspezifizierten oder Cloud-Metadaten-Adresse auf.      |
| `parser-divergent` | Ein nachlässiger Textvalidator würde einen anderen realen Host lesen als den, mit dem sich der Client verbindet. |
| `invalid url`      | Die Zeichenkette lässt sich nicht als URL parsen, also gibt es nichts abzurufen.                                 |

Nur `safe` bedeutet Zulassen. Behandle `private-target`, `parser-divergent` und `invalid url` alle als Sperre.

### CLI-Optionen

| Option  | Wert                   | Beschreibung                                                                       |
| ------- | ---------------------- | ---------------------------------------------------------------------------------- |
| `--url` | eine URL oder ein Host | Prüft ein Ziel. Wiederhole die Option, um mehrere zu prüfen, ein Urteil pro Zeile. |

Mindestens ein `--url` ist Pflicht. Das Ziel ist nie ein bloßes Positionsargument, deshalb kann es nicht mit einer Option verwechselt werden.

**Warum als Wert einer Option**

Jedes Ziel wird als Wert einer Option übergeben und nie in den Befehl interpoliert. Ein Wert mit Anführungszeichen oder Backticks bleibt wirkungslos und kann nichts in die Shell einschleusen. Setze ihn immer in einfache Anführungszeichen, damit deine Shell ihn nicht vorher expandiert.

**Was er nicht abdeckt**

Der Hook ist rein und löst nie DNS auf, deshalb liegen zwei Lücken, die erst zur Laufzeit entstehen, außerhalb seines Umfangs: **DNS-Rebinding** (ein Name, der bei der Prüfung öffentlich und beim Abruf intern auflöst) und **Weiterleitungsketten** (ein erster Sprung, der die Prüfung besteht und dann nach innen weiterleitet). Schließe sie, indem du einmal auflöst und dich mit der validierten Adresse verbindest, und indem du Weiterleitungen ablehnst. Die reservierten Loopback-Namen (`localhost` und die Familie `.localhost`) stuft er ohne Abfrage als intern ein, aber jeder andere DNS-Name ergibt `safe`, denn die Behauptung, er löse nach innen auf, würde eine Auflösung erfordern: Diese Namen schützt die Allowlist, und genau sie prüft dieser Checker.

**Tipp**

Das ist dieselbe Prüfung, die die [Spezialisierung `network`](https://lagune.ai/de-DE/docs/catalog) ausführt, um nachzuweisen, dass ein Zielfilter greift.

## Häufige Fragen

### Wie teste ich eine URL auf SSRF?

Führe den Hook network aus. Er bewertet ein Anfrageziel und gibt safe, private-target, parser-divergent oder invalid url zurück. Nur safe bedeutet Zulassen.

### Was ist eine URL vom Typ parser-divergent?

Eine URL, die verschiedene Parser unterschiedlich lesen, was ein klassischer Weg ist, einen SSRF-Schutz zu umgehen. Der Hook network meldet sie, statt sie zuzulassen.
