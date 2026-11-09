# Spec-Driven Development : sécuriser ce que votre spécification construit

> Associez Lagune à Superpowers, Spec Kit ou OpenSpec : définissez les principes de sécurité à partir de votre spécification, puis implémentez-la avec /lagune pour que chaque tâche soit durcie au fil de l'écriture du code.

Canonique: https://lagune.ai/fr-FR/docs/examples/spec-driven-development
Langue: fr-FR
Original: https://lagune.ai/docs/examples/spec-driven-development
Dernière mise à jour: 2026-11-09

Associez **Lagune** à un outil de Spec-Driven Development, comme [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit) ou [**OpenSpec**](https://github.com/Fission-AI/OpenSpec) : votre outil décide de ce qu'il faut construire, et **Lagune** de la façon dont cela reste sûr.

## Comment il s'intègre

**Lagune** rejoint le flux de votre outil à deux moments, sans toucher au reste :

1. Une fois la spécification écrite par votre outil, [`/lagune-charter`](https://lagune.ai/fr-FR/docs/commands/charter) la lit et définit les principes de sécurité qu'exige la fonctionnalité, avant même que le code existe.
2. Ajouté à la commande d'implémentation de votre outil, [`/lagune`](https://lagune.ai/fr-FR/docs/commands/lagune) durcit chaque tâche selon ces principes, au fil de l'écriture du code.

**Astuce**

Dans chaque exemple, remplacez le chemin de la spécification par le fichier que votre outil a écrit. Si le projet a déjà des principes de sécurité, la même étape les met à jour avec ce dont la nouvelle fonctionnalité a besoin.

## Exemples de prompts

Envoyez les prompts dans l'ordre, chacun une fois le précédent terminé.

```prompt
/superpowers:brainstorming Commande en tant qu'invité avec paiement par carte.
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
/speckit.specify Commande en tant qu'invité avec paiement par carte.
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
