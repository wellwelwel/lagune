# Sicherheits-Skills für KI-Agenten

> Die Skills, die dein KI-Agent mit Lagune freischaltet: ein bestehendes Projekt auditieren oder neue Arbeit schon beim Entwickeln absichern, stets nach deinen Sicherheitsprinzipien.

Kanonische URL: https://lagune.ai/de-DE/docs/get-started/commands
Sprache: de-DE
Original: https://lagune.ai/docs/get-started/commands
Zuletzt aktualisiert: 2026-11-05

Sobald **Lagune** [installiert](https://lagune.ai/de-DE/docs) ist, schaltet dein **KI**-Agent eine Reihe von Skills frei. Es gibt zwei Wege, sie zu nutzen, und beide folgen deinen **Sicherheitsprinzipien**: neue Arbeit schon beim Entwickeln absichern oder das vollständige Audit über ein Projekt laufen lassen.

**⌨️ Bauen / Entwickeln**

Du musst deine Arbeit nicht erst fertigstellen, bevor du sie absicherst. Nutze [**`/lagune`**](https://lagune.ai/de-DE/docs/commands/lagune) für die Arbeit, die du **gerade jetzt** schreibst:

| Skill                                         | Was er für dich tut                                                                                   |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [**/lagune-charter**](https://lagune.ai/de-DE/docs/commands/charter) | Legt die Sicherheitsregeln deines Projekts fest, die Grundlage, auf der `/lagune` aufbaut             |
| [**/lagune**](https://lagune.ai/de-DE/docs/commands/lagune)          | Baut, worum du bittest, und härtet es schon beim Schreiben, geleitet von deinen Sicherheitsprinzipien |

**Nutze ihn jederzeit**

[**`/lagune`**](https://lagune.ai/de-DE/docs/commands/lagune) befolgt die Regeln deiner Sicherheitsprinzipien bei jeder Ausführung. Er nimmt jeden Prompt an, baut, worum du gebeten hast, und härtet es dabei mit sicheren Standardwerten, nicht erst später.

---

#### Spezielle Skills

| Skill                                               | Was er tut                                                                                           |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/de-DE/docs/commands/specialize) | Bringt **Lagune** anhand von Artikeln, Exploits oder Themen eine neue Sicherheitsspezialisierung bei |

**🔬 Auditieren: Blue-Team-Workflow**

Der vollständige **Blue-Team-Workflow**: lesen, was ein Projekt tut, seine Risiken erfassen und schließen. Jede Phase baut auf der vorherigen auf, du musst der Liste also nur von oben nach unten folgen:

| #   | Skill                                         | Was er für dich tut                                                                                       |
| --- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | [**/lagune-charter**](https://lagune.ai/de-DE/docs/commands/charter) | Legt die Sicherheitsregeln deines Projekts fest, für dich vorgeschlagen oder nach deinen Vorgaben geformt |
| 2   | [**/lagune-detect**](https://lagune.ai/de-DE/docs/commands/detect)   | Liest deinen Code und erfasst, was dein System tut und wo die Risiken liegen                              |
| 3   | [**/lagune-plan**](https://lagune.ai/de-DE/docs/commands/plan)       | Macht aus dem, was detect gefunden hat, einen Abwehrplan mit einer Korrektur für jeden Befund             |
| 4   | [**/lagune-harden**](https://lagune.ai/de-DE/docs/commands/harden)   | Setzt die Korrekturen des Plans in deinem Code um, sicher und eine nach der anderen                       |
| 5   | [**/lagune-verify**](https://lagune.ai/de-DE/docs/commands/verify)   | Weist nach, dass jede umgesetzte Korrektur greift, und schließt die ab, die den Nachweis bestehen         |

---

#### Spezielle Skills

| Skill                                               | Was er tut                                                                                                             |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/de-DE/docs/commands/specialize) | Bringt **Lagune** anhand von Artikeln, Exploits oder Themen eine neue Sicherheitsspezialisierung bei                   |
| [**/lagune-prove**](https://lagune.ai/de-DE/docs/commands/prove)           | Macht aus jedem erkannten Befund einen ausführbaren, ausschließlich defensiven Nachweis für die Responsible Disclosure |

---

#### Interne Skills

| Skill                                       | Was er tut                                          |
| ------------------------------------------- | --------------------------------------------------- |
| [**/lagune-repair**](https://lagune.ai/de-DE/docs/commands/repair) | Repariert die interne Nachverfolgung von **Lagune** |

**Tipp**

Sicherheit ist kein Kostenfaktor, sondern eine Investition: Was du am Anfang hineinsteckst, sparst du bei den Vorfällen, die du nie erlebst, um ein Vielfaches wieder ein 🙋🏻‍♂️

## Häufige Fragen

### Welche Skills bringt Lagune mit?

/lagune, um Arbeit schon beim Entwickeln zu härten, und den Blue-Team-Workflow für Audits in fünf Phasen: /lagune-charter, /lagune-detect, /lagune-plan, /lagune-harden, /lagune-verify. Dazu kommen /lagune-specialize und /lagune-prove.

### Was ist der Blue-Team-Workflow von Lagune?

Ein Audit in fünf Phasen: charter (Regeln festlegen), detect (Risiken erfassen), plan (bewerten und Korrekturen planen), harden (Korrekturen umsetzen), verify (nachweisen, dass sie greifen, und sie abschließen).

### Was ist der Unterschied zwischen /lagune und dem Audit-Workflow?

/lagune sichert neue Arbeit schon beim Schreiben ab, ohne einen Workflow, dem du folgen musst. Der Audit-Workflow wendet die fünf Phasen der Reihe nach auf ein bestehendes Projekt an.
