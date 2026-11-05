# Hook cvss: einen CVSS-v4.0-Vektor bewerten

> Bewerte einen oder mehrere CVSS-v4.0-Vektoren über die Kommandozeile, mit derselben Berechnung wie der Rechner von FIRST, und lass dir jeden in einfachen Worten erklären.

Kanonische URL: https://lagune.ai/de-DE/docs/hooks/cvss
Sprache: de-DE
Original: https://lagune.ai/docs/hooks/cvss
Zuletzt aktualisiert: 2026-11-05

Der Hook `cvss` bewertet einen **CVSS-v4.0-Vektor** und gibt dessen Score und Schweregradstufe aus, also die Bewertung, die [`/lagune-plan`](https://lagune.ai/de-DE/docs/commands/plan) zu jeder Korrektur und [`/lagune-prove`](https://lagune.ai/de-DE/docs/commands/prove) zu jedem Sicherheitshinweis schreibt. Er ist die deterministische Engine hinter diesen Bewertungen, nutzt dieselbe Berechnung wie der [Rechner von FIRST](https://www.first.org/cvss/calculator/4.0), und du kannst ihn selbst ausführen.

## Ausführen

Übergib jeden Vektor mit `--vector`. Der Hook gibt pro Vektor eine Zeile aus: Score und Stufe.

**Ein Vektor**

```bash
npx lagune read cvss --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N'
# => 9.3, Critical
```

**Mehrere Vektoren**

Wiederhole `--vector`, um mehrere auf einmal zu bewerten, eine Zeile pro Vektor, in derselben Reihenfolge.

```bash
npx lagune read cvss \
  --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N' \
  --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A'
# => 9.3, Critical
# => 8.7, High
```

**In einfachen Worten**

Füge `--explain` hinzu, um dir jede Metrik in einfachen Worten erklären zu lassen. Wenn Threat- oder Environmental-Metriken den Score verändern, steht der Base-Score allein an erster Stelle.

```bash
npx lagune read cvss --explain --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A'
# => 8.7, High
# =>   Base metrics alone: 9.3, Critical
# =>   Attack Vector: Network, modified to Adjacent
# =>   Attack Complexity: Low
# =>   ...
```

## So liest du das Ergebnis

| Stufe      | Score        |
| ---------- | ------------ |
| `None`     | 0.0          |
| `Low`      | 0.1 bis 3.9  |
| `Medium`   | 4.0 bis 6.9  |
| `High`     | 7.0 bis 8.9  |
| `Critical` | 9.0 bis 10.0 |

Ein Vektor nur mit Base-Metriken bewertet die Schwachstelle selbst und geht vom schlimmsten Fall aus: Jede Sicherheitsanforderung steht auf High, und die Schwachstelle wird aktiv ausgenutzt. Environmental-Metriken (`MAV` und die übrigen modifizierten Metriken sowie `CR`, `IR` und `AR`) passen den Score an eine konkrete Einsatzumgebung an, die Threat-Metrik (`E`) an das, was über die Ausnutzung bekannt ist.

Bei einem ungültigen Vektor gibt der Hook `invalid vector:` und den Fehler aus und endet mit einem Exit-Code ungleich null.

### CLI-Optionen

| Option      | Wert                            | Beschreibung                                                                                                           |
| ----------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `--vector`  | ein Vektor im Format `CVSS:4.0` | Bewertet einen Vektor. Wiederhole die Option, um mehrere zu bewerten, eine Zeile pro Vektor, in derselben Reihenfolge. |
| `--explain` |                                 | Ergänzt unter jeder Bewertungszeile jede Metrik in einfachen Worten.                                                   |

Mindestens ein `--vector` ist Pflicht. Der Vektor ist nie ein bloßes Positionsargument, deshalb kann er nicht mit einer Option verwechselt werden.

**Warum als Wert einer Option**

Jeder Vektor wird als Wert einer Option übergeben und nie in den Befehl interpoliert. Ein Wert mit Anführungszeichen oder Backticks bleibt wirkungslos und kann nichts in die Shell einschleusen. Setze ihn immer in einfache Anführungszeichen, damit deine Shell ihn nicht vorher expandiert.

**Was er nicht abdeckt**

Nur CVSS v4.0: Einen Vektor in v2.0, v3.0 oder v3.1 lehnt er ab, statt ihn zu bewerten, denn **Lagune** bewertet jeden Befund in v4.0.

**Tipp**

Die Validierung der Phase plan wiederholt genau diese Berechnung für jede CVSS-Zeile, sodass ein Score, der nicht mehr zu seinem Vektor passt, auffällt, bevor der Plan angenommen wird.

## Häufige Fragen

### Wie berechnet Lagune einen CVSS-Score?

Der Hook cvss folgt dem Referenzrechner von FIRST für CVSS v4.0, deshalb erhält ein Vektor exakt denselben Score wie auf der Website von FIRST.

### Kann ich damit einen CVSS-v3.1-Vektor bewerten?

Nein. Lagune bewertet jeden Befund in CVSS v4.0, und der Hook lehnt jede andere Version ab, statt sie zu bewerten.

### Was bewirkt die Option --explain?

Sie erklärt jede Metrik in einfachen Worten und zeigt den Base-Score neben dem Gesamtscore, sodass jeder sieht, was der Vektor aussagt und wie der Projektkontext den Score verändert hat.
