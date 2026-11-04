# /lagune-plan: noter les constats et planifier les correctifs

> Transformez ce que detect a trouvé en plan de défense, en évaluant chaque constat avec une catégorie et un score CVSS v4.0, et en l'associant à un correctif.

Canonique: https://lagune.ai/fr-FR/docs/commands/plan
Langue: fr-FR
Original: https://lagune.ai/docs/commands/plan
Dernière mise à jour: 2026-11-04

🛡️ Transformez ce que detect a trouvé en plan de défense : évaluez chaque constat avec une catégorie et un score CVSS v4.0, puis associez-le au correctif à appliquer.

## Utilisation

**Tout planifier**

```prompt
/lagune-plan
```

**Indiquer des chemins**

```prompt
/lagune-plan src/routes/upload.ts
```

**Cibler une inquiétude**

```prompt
/lagune-plan là où des données sensibles pourraient fuiter
```

## Fonctionnement

Cette phase prend la suite de detect. Detect a déjà trouvé ce que fait votre système et le risque que porte chaque élément, donc le plan ne répète pas le risque : il évalue sa gravité et décide de ce qu'il faut faire. Plan ne lit jamais le code, ce qui oblige chaque correctif à pointer vers quelque chose que detect a réellement détecté. Il évalue chaque constat avec la méthode CVSS v4.0 : une catégorie, un vecteur CVSS v4.0 raisonné à partir de ce que detect et la charter ont capturé et noté par le [hook `cvss`](https://lagune.ai/fr-FR/docs/hooks/cvss), et la tranche de priorité où tombe ce score. Chaque correctif indique aussi le principe de sécurité qu'il fait respecter.

Par exemple :

- **Envoi de fichiers** (priorité : **Critical**)
  - _Catégorie :_ envoi de fichiers sans restriction (CWE-434).
  - _CVSS :_ CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N (9.3, Critical).
  - _Pourquoi cette priorité :_ n'importe qui peut atteindre l'envoi depuis Internet, et il se trouve sur le serveur qui stocke les fichiers des clients.
  - _Fait respecter :_ III. Toute entrée est non fiable tant qu'elle n'a pas été validée.
  - _Correctif :_ vérifier le type réel et la taille du fichier, le renommer à l'enregistrement et stocker les fichiers envoyés là où ils ne peuvent pas être exécutés comme du code.

Vous disposez alors d'une liste de correctifs évalués et priorisés, chacun lié à un constat et prêt à être appliqué par la phase suivante. Le score est calculé, jamais estimé : le vecteur porte l'exposition et les enjeux du projet sous forme de métriques Environmental, et n'importe qui peut le coller dans le calculateur de FIRST ou du NVD pour retrouver le même score.

**Astuce**

- Il s'appuie entièrement sur detect. Si un fichier ou une inquiétude n'a jamais été cartographié, il vous demande d'abord d'exécuter `/lagune-detect` dessus.
- Le relancer met le plan à jour : les correctifs terminés disparaissent, les nouveaux apparaissent.
- Le plan de défense se trouve dans `.lagune/memory/plan.md`.

**Dépend de detect**

Plan travaille uniquement à partir de ce que [`/lagune-detect`](https://lagune.ai/fr-FR/docs/commands/detect) a déjà cartographié, donc exécutez detect d'abord.

## Étape suivante

Appliquez le plan : [`/lagune-harden`](https://lagune.ai/fr-FR/docs/commands/harden).

## Questions fréquentes

### Comment Lagune priorise-t-il les vulnérabilités ?

/lagune-plan évalue chaque constat avec une catégorie et un score CVSS v4.0 calculé par le hook cvss, puis l'associe au correctif à appliquer.

### Lagune utilise-t-il CVSS v4.0 ?

Oui. Chaque constat reçoit un vecteur et un score CVSS v4.0, calculés par le hook cvss avec la même arithmétique que le calculateur de FIRST, donc n'importe qui peut y coller le vecteur et retrouver le score.

### Le plan lit-il mon code ?

Non. Plan ne lit jamais le code, ce qui oblige chaque correctif à pointer vers quelque chose que detect a réellement détecté.
