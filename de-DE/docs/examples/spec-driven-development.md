# Spec-Driven Development: sicher umsetzen, was deine Spezifikation vorgibt

> Kombiniere Lagune mit Superpowers, Spec Kit oder OpenSpec: Lege die Sicherheitsprinzipien anhand deiner Spezifikation fest und setze die Spezifikation dann mit /lagune um, damit jede Aufgabe schon beim Schreiben des Codes gehärtet wird.

Kanonische URL: https://lagune.ai/de-DE/docs/examples/spec-driven-development
Sprache: de-DE
Original: https://lagune.ai/docs/examples/spec-driven-development
Zuletzt aktualisiert: 2026-11-09

Kombiniere **Lagune** mit einem Tool für Spec-Driven Development wie [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit) oder [**OpenSpec**](https://github.com/Fission-AI/OpenSpec): Dein Tool entscheidet, was gebaut wird, und **Lagune** entscheidet, wie es sicher bleibt.

## So fügt es sich ein

**Lagune** klinkt sich an zwei Stellen in den Ablauf deines Tools ein und lässt den Rest unverändert:

1. Sobald dein Tool die Spezifikation geschrieben hat, liest [`/lagune-charter`](https://lagune.ai/de-DE/docs/commands/charter) sie und legt die Sicherheitsprinzipien fest, die das Feature erfordert, noch bevor es Code gibt.
2. An den Implementierungsbefehl deines Tools angehängt, härtet [`/lagune`](https://lagune.ai/de-DE/docs/commands/lagune) jede Aufgabe nach diesen Prinzipien, während der Code entsteht.

**Tipp**

Ersetze in jedem Beispiel den Pfad der Spezifikation durch die Datei, die dein Tool geschrieben hat. Hat das Projekt bereits Sicherheitsprinzipien, passt derselbe Schritt sie an das an, was das neue Feature braucht.

## Prompt-Beispiele

Sende die Prompts der Reihe nach, jeden erst, wenn der vorherige fertig ist.

```prompt
/superpowers:brainstorming Gast-Checkout mit Kartenzahlung.
```

```prompt
/lagune-charter docs/superpowers/specs/2026-11-09-guest-checkout-design.md
```

```prompt
/superpowers:writing-plans
```

```prompt
/superpowers:executing-plans /lagune
```

```prompt
/speckit.specify Gast-Checkout mit Kartenzahlung.
```

```prompt
/lagune-charter specs/001-guest-checkout/spec.md
```

```prompt
/speckit.plan
```

```prompt
/speckit.tasks
```

```prompt
/speckit.implement /lagune
```

```prompt
/opsx:propose add-guest-checkout
```

```prompt
/lagune-charter openspec/changes/add-guest-checkout/proposal.md
```

```prompt
/opsx:apply /lagune
```

```prompt
/opsx:archive
```
