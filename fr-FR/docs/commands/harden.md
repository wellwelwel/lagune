# /lagune-harden: appliquer les correctifs de sécurité à votre code

> Appliquez à votre code les correctifs du plan, en toute sécurité et un par un.

Canonique: https://lagune.ai/fr-FR/docs/commands/harden
Langue: fr-FR
Original: https://lagune.ai/docs/commands/harden
Dernière mise à jour: 2026-11-03

🔧 Appliquez à votre code les correctifs du plan, en toute sécurité et un par un.

## Utilisation

**Tout appliquer**

```prompt
/lagune-harden
```

**Indiquer des chemins**

```prompt
/lagune-harden src/routes/upload.ts
```

**Par priorité**

```prompt
/lagune-harden gravité critique et élevée
```

## Fonctionnement

Le plan a déjà décidé de chaque correctif, donc harden se contente de l'appliquer. Comme c'est la seule phase qui touche à votre code, elle avance prudemment : elle applique un correctif à la fois pour que chaque modification reste facile à relire, et n'affaiblit jamais une mesure de protection pour faire entrer un correctif. Par exemple, le correctif de l'envoi de fichiers :

- **Envoi de fichiers** (statut : **Applied**)
  - _Ce qui a changé :_ vérifie le type réel et la taille du fichier, rejette tout ce qui est inattendu, le renomme à l'enregistrement et le stocke là où il ne peut pas être exécuté comme du code.
  - _Où :_ la fonction `handleUpload`, ainsi que l'utilitaire de stockage qu'elle appelle.

Si un correctif ne peut pas être appliqué entièrement, harden fait ce qu'il peut sans risque et marque le reste **Partial** ou **Blocked**, en le laissant ouvert.

**Appliqué ne veut pas dire vérifié**

Applied ne veut pas encore dire prouvé. C'est le rôle de [verify](https://lagune.ai/fr-FR/docs/commands/verify).

**Astuce**

- Il s'appuie entièrement sur le plan. Si un correctif ou un fichier n'a jamais été planifié, il vous demande d'abord d'exécuter `/lagune-plan` dessus.
- Le relancer met le registre en cohérence : les modifications annulées disparaissent, les correctifs nouvellement appliqués apparaissent.
- Le registre de durcissement se trouve dans `.lagune/memory/harden.md`.

**Dépend de plan et modifie votre code**

Harden s'appuie sur [`/lagune-plan`](https://lagune.ai/fr-FR/docs/commands/plan). C'est la seule phase qui modifie votre code.

## Étape suivante

Prouvez que chaque correctif est efficace : [`/lagune-verify`](https://lagune.ai/fr-FR/docs/commands/verify).

## Questions fréquentes

### /lagune-harden modifie-t-il mon code ?

Oui. C'est la seule phase qui touche à votre code, en appliquant les correctifs du plan un par un.

### Que signifient Applied, Partial et Blocked ?

Ce sont les statuts que Lagune enregistre pour chaque correctif. Applied signifie que le correctif a été fait, Partial qu'il ne l'a été qu'en partie, Blocked qu'il n'a pas pu être appliqué. Applied ne veut pas encore dire prouvé.

### Lagune applique-t-il les correctifs sans demander ?

C'est votre agent et le mode d'autorisation dans lequel vous l'exécutez qui décident si une modification demande votre accord, pas Lagune, qui n'ajoute aucune étape de confirmation propre. Il n'affaiblit pourtant jamais une mesure de protection pour satisfaire un correctif, et si un correctif entrait en conflit avec une règle de vos principes de sécurité, il s'arrête et vous prévient d'abord.
