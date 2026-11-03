# Lagune mit skills.sh in jedem Agenten installieren

> Installiere und aktualisiere Lagune in jedem KI-Agenten mit der CLI von skills.

Kanonische URL: https://lagune.ai/de-DE/docs/install/universal
Sprache: de-DE
Original: https://lagune.ai/docs/install/universal
Zuletzt aktualisiert: 2026-11-03

**Terminal**

Installiere die Befehle von **Lagune** über dein Terminal mit [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune
```

**Prompt**

Füge diesen Prompt in deinen Agenten ein:

```md
Führe `npx --yes skills add wellwelwel/lagune` aus und folge jetzt den generierten Skill-Anweisungen. Lies die vollständige Ausgabe, die du bei Bedarf zuerst in eine temporäre Datei umleitest. Löse relative Pfade ausgehend vom Verzeichnis der Begleitdateien auf, das die Ausgabe nennt.
```

## Aktualisierung

**Terminal**

Um **Lagune** zu aktualisieren, führe Folgendes aus:

```bash
npx skills update
```

**Prompt**

Um **Lagune** zu aktualisieren, füge diesen Prompt in deinen Agenten ein:

```md
Führe `npx --yes skills update -y` aus und lies die vollständige Ausgabe, die du bei Bedarf zuerst in eine temporäre Datei umleitest.
```

---

**Ein Installationsweg pro Agent**

Installiere **Lagune** entweder über **skills.sh** oder über das **Plugin**, nie über beides.

**Berechtigungen**

Die Befehle starten die Engine als `npx --yes lagune@0.16.0`, und die [Installationsseite jedes Agenten](https://lagune.ai/de-DE/docs) zeigt die Regel, die das vorab erlaubt. Hat deine Sandbox keinen Netzwerkzugriff, installiere die Engine über dein eigenes Terminal in deinem Projekt, einmal und nach jeder Aktualisierung erneut:

```bash
npm i -D lagune@0.16.0
```

## Häufige Fragen

### Wie installiere ich Lagune in einem beliebigen KI-Agenten?

Führe npx skills add wellwelwel/lagune in deinem Projekt aus oder füge den Prompt zur Installation in deinen Agenten ein.

### Wie aktualisiere ich Lagune nach der Installation mit der CLI von skills?

Führe npx skills update aus oder füge den Prompt zur Aktualisierung in deinen Agenten ein.

### Kann ich Lagune gleichzeitig mit der CLI von skills und als Plugin installieren?

Nein. Mit beiden Wegen listet der Agent jeden Befehl doppelt auf oder nutzt eine Kopie und blendet die andere aus.
