# Lagune mit skills.sh oder der GitHub CLI in jedem Agenten installieren

> Installiere Lagune in jedem KI-Agenten mit der CLI von skills oder der GitHub CLI und halte es aktuell.

Kanonische URL: https://lagune.ai/de-DE/docs/install/universal
Sprache: de-DE
Original: https://lagune.ai/docs/install/universal
Zuletzt aktualisiert: 2026-11-09

**skills.sh**

Installiere die Befehle von **Lagune** über dein Terminal in deinem Projekt mit [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune -y
```

Oder füge diesen Prompt in deinen Agenten ein:

```md
Führe `npx --yes skills add wellwelwel/lagune --yes` aus und folge jetzt den generierten Skill-Anweisungen. Lies die vollständige Ausgabe, die du bei Bedarf zuerst in eine temporäre Datei umleitest. Löse relative Pfade ausgehend vom Verzeichnis der Begleitdateien auf, das die Ausgabe nennt.
```

**GitHub CLI**

Installiere die Befehle von **Lagune** über dein Terminal in deinem Projekt mit der [**GitHub CLI**](https://cli.github.com/) ab Version 2.90.0:

```bash
gh skill install wellwelwel/lagune --all --scope project
```

Oder füge diesen Prompt in deinen Agenten ein:

```md
Führe `gh skill install wellwelwel/lagune --all --scope project` aus und lies die vollständige Ausgabe, die du bei Bedarf zuerst in eine temporäre Datei umleitest.
```

## Aktualisierung

**skills.sh**

Um **Lagune** zu aktualisieren, führe Folgendes aus:

```bash
npx skills update
```

Oder füge diesen Prompt in deinen Agenten ein:

```md
Führe `npx --yes skills update -y` aus und lies die vollständige Ausgabe, die du bei Bedarf zuerst in eine temporäre Datei umleitest.
```

**GitHub CLI**

Um **Lagune** zu aktualisieren, führe Folgendes aus:

```bash
gh skill update --all
```

Oder füge diesen Prompt in deinen Agenten ein:

```md
Führe `gh skill update --all` aus und lies die vollständige Ausgabe, die du bei Bedarf zuerst in eine temporäre Datei umleitest.
```

---

**Sandbox**

In einer Sandbox ohne Netzwerkzugriff können die Befehle die Engine nicht herunterladen. Installiere sie über dein eigenes Terminal in deinem Projekt, einmal und nach jeder Aktualisierung erneut:

```bash
npm i -D lagune@0.18.2
```

## Häufige Fragen

### Wie installiere ich Lagune in einem beliebigen KI-Agenten?

Führe in deinem Projekt npx skills add wellwelwel/lagune -y oder gh skill install wellwelwel/lagune --all --scope project aus, oder füge den Prompt zur Installation in deinen Agenten ein.

### Wie aktualisiere ich Lagune in einem beliebigen KI-Agenten?

Führe npx skills update aus, wenn du es mit skills.sh installiert hast, oder gh skill update --all, wenn du es mit der GitHub CLI installiert hast. Du kannst auch den Prompt zur Aktualisierung in deinen Agenten einfügen.

### Kann ich Lagune gleichzeitig über mehrere Wege installieren?

Nein. Mit zwei Wegen listet der Agent jeden Befehl doppelt auf oder nutzt eine Kopie und blendet die andere aus.
