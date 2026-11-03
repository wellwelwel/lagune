# /lagune-plan: Bewerte Befunde und plane Korrekturen

> Mach aus dem, was detect gefunden hat, einen Abwehrplan, der jeden Befund mit einer Kategorie und einem CVSS-v4.0-Score bewertet und ihm eine Korrektur zuordnet.

Kanonische URL: https://lagune.ai/de-DE/docs/commands/plan
Sprache: de-DE
Original: https://lagune.ai/docs/commands/plan
Zuletzt aktualisiert: 2026-11-03

🛡️ Mach aus dem, was detect gefunden hat, einen Abwehrplan: Bewerte jeden Befund mit einer Kategorie und einem CVSS-v4.0-Score und ordne ihm dann die Korrektur zu, die umgesetzt werden soll.

## Verwendung

**Alles planen**

```prompt
/lagune-plan
```

**Pfade angeben**

```prompt
/lagune-plan src/routes/upload.ts
```

**Auf eine Sorge konzentrieren**

```prompt
/lagune-plan wo sensible Daten abfließen könnten
```

## So funktioniert es

Diese Phase setzt dort an, wo detect aufgehört hat. Detect hat bereits herausgefunden, was dein System tut und welches Risiko jeder Teil birgt. Deshalb wiederholt plan das Risiko nicht, sondern bewertet, wie ernst es ist, und entscheidet, was dagegen zu tun ist. Plan liest den Code nie, wodurch jede Korrektur auf etwas zeigen muss, das detect tatsächlich erkannt hat. Die Phase bewertet jeden Befund nach der Methode von CVSS v4.0: mit einer Kategorie, einem CVSS-v4.0-Vektor, der aus dem abgeleitet ist, was detect und die charter erfasst haben, und dessen Score der [Hook `cvss`](https://lagune.ai/de-DE/docs/hooks/cvss) berechnet, sowie mit der Prioritätsstufe, in die dieser Score fällt. Jede Korrektur nennt außerdem das Sicherheitsprinzip, das sie wahrt.

Zum Beispiel:

- **Datei-Uploads** (Priorität: **Critical**)
  - _Kategorie:_ uneingeschränkter Datei-Upload (CWE-434).
  - _CVSS:_ CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N (9.3, Critical).
  - _Warum diese Priorität:_ Jeder kann den Upload über das Internet erreichen, und er liegt auf dem Server, der die Dateien der Kunden speichert.
  - _Wahrt:_ III. Jede Eingabe gilt als nicht vertrauenswürdig, bis sie validiert ist.
  - _Korrektur:_ den tatsächlichen Typ und die Größe der Datei prüfen, sie beim Speichern umbenennen und Uploads dort ablegen, wo sie nicht als Code ausgeführt werden können.

Danach hast du eine bewertete, priorisierte Liste von Korrekturen, jede mit einem Befund verknüpft und bereit für die Umsetzung in der nächsten Phase. Der Score wird berechnet, nie geschätzt: Der Vektor bildet die Exponiertheit des Projekts und das, was auf dem Spiel steht, als Environmental-Metriken ab, und jeder kann ihn in den Rechner von FIRST oder NVD einfügen und denselben Score erneut berechnen.

**Tipp**

- Die Phase baut vollständig auf detect auf. Wurde eine Datei oder eine Sorge nie erfasst, fordert sie dich auf, zuerst `/lagune-detect` dafür auszuführen.
- Ein erneuter Lauf aktualisiert den Plan: Erledigte Korrekturen fallen weg, neue kommen hinzu.
- Der Abwehrplan liegt in `.lagune/memory/plan.md`.

**Hängt von detect ab**

Plan arbeitet nur mit dem, was [`/lagune-detect`](https://lagune.ai/de-DE/docs/commands/detect) bereits erfasst hat, führe detect also zuerst aus.

## Nächster Schritt

Setze den Plan um: [`/lagune-harden`](https://lagune.ai/de-DE/docs/commands/harden).

## Häufige Fragen

### Wie priorisiert Lagune Schwachstellen?

/lagune-plan bewertet jeden Befund mit einer Kategorie und einem CVSS-v4.0-Score, den der Hook cvss berechnet, und ordnet ihm dann die Korrektur zu, die umgesetzt werden soll.

### Nutzt Lagune CVSS v4.0?

Ja. Jeder Befund erhält einen CVSS-v4.0-Vektor und -Score, berechnet vom Hook cvss mit derselben Arithmetik wie der Rechner von FIRST, sodass jeder den Vektor dort einfügen und den Score nachrechnen kann.

### Liest die Phase plan meinen Code?

Nein. Plan liest den Code nie, wodurch jede Korrektur auf etwas zeigen muss, das detect tatsächlich erkannt hat.
