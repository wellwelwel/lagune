# Spec-Driven Development: metti in sicurezza ciò che nasce dalla tua specifica

> Abbina Lagune a Superpowers, Spec Kit o OpenSpec: definisci il charter a partire dalla tua specifica, poi implementala con /lagune, che mette in sicurezza ogni task mentre il codice viene scritto.

Canonico: https://lagune.ai/it-IT/docs/examples/spec-driven-development
Lingua: it-IT
Originale: https://lagune.ai/docs/examples/spec-driven-development
Ultimo aggiornamento: 2026-11-09

Abbina **Lagune** a uno strumento di Spec-Driven Development, come [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit) o [**OpenSpec**](https://github.com/Fission-AI/OpenSpec): il tuo strumento decide cosa costruire e **Lagune** decide come mantenerlo sicuro.

## Come si integra

**Lagune** entra nel flusso del tuo strumento in due punti e lascia invariato tutto il resto:

1. Quando il tuo strumento ha scritto la specifica, [`/lagune-charter`](https://lagune.ai/it-IT/docs/commands/charter) la legge e definisce i principi di sicurezza di cui la funzionalità ha bisogno, prima che esista una sola riga di codice.
2. Aggiunto al comando di implementazione del tuo strumento, [`/lagune`](https://lagune.ai/it-IT/docs/commands/lagune) mette in sicurezza ogni task secondo quei principi, mentre il codice viene scritto.

**Suggerimento**

In ogni esempio, sostituisci il percorso della specifica con il file scritto dal tuo strumento. Se il progetto ha già un charter, lo stesso passaggio lo aggiorna con ciò che serve alla nuova funzionalità.

## Esempi di prompt

Invia i prompt in ordine, ciascuno quando il precedente ha finito.

```prompt
/superpowers:brainstorming Checkout come ospite con pagamento con carta.
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
/speckit.specify Checkout come ospite con pagamento con carta.
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
