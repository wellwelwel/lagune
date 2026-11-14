# /lagune-detect: cartographier votre système et ses risques

> Cette page n'est plus à jour par rapport à sa version anglaise. [Lire la version originale](https://lagune.ai/docs/commands/detect).

> Lisez votre code et cartographiez ce que fait votre système et où se trouvent les risques.

Canonique: https://lagune.ai/fr-FR/docs/commands/detect
Langue: fr-FR
Original: https://lagune.ai/docs/commands/detect
Dernière mise à jour: 2026-11-03

🔬 Découvrez ce que fait vraiment votre système et où se trouvent les risques.

Detect lit le code et ne consigne que ce qu'il trouve réellement, avec les éléments de preuve dont les phases suivantes ont besoin. Sa règle directrice est la détection, pas l'invention.

## Utilisation

**Analyse complète**

```prompt
/lagune-detect
```

**Indiquer des chemins**

```prompt
/lagune-detect src/routes/ src/auth.ts
```

**Décrire une préoccupation**

```prompt
/lagune-detect assure-toi que les données des clients ne sont jamais exposées
```

## Ce qu'il cartographie

**Lagune** lit le code et cartographie ce qu'il trouve. Chaque constat indique ce qu'il est, pourquoi il compte et l'élément de preuve. Par exemple :

- **Envoi de fichiers**, le système accepte des fichiers envoyés par les utilisateurs :
  - _Pourquoi c'est important :_ un fichier déguisé en image peut cacher du code malveillant.
  - _Élément de preuve :_ le handler `POST /upload` fait confiance au type MIME envoyé par le client, sans vérifier le type réel du fichier.
- **Connexion et sessions**, les utilisateurs se connectent pour accéder à leur compte :
  - _Pourquoi c'est important :_ une gestion de session fragile permet à un compte d'en prendre un autre.
  - _Élément de preuve :_ la logique d'émission des sessions, où les sessions sont émises sans expiration.

Au passage, detect donne à chaque spécialisation du [catalogue](https://lagune.ai/fr-FR/docs/catalog) de votre projet un verdict face au code, applique celles dont le contexte est présent et les consigne sous **Applied specializations**, la liste que harden et verify réutilisent.

Vous disposez alors d'une cartographie claire de ce que fait votre système et de l'endroit où se trouvent les risques, prête pour les étapes suivantes.

**Astuce**

- Le relancer met la cartographie à jour : les constats résolus disparaissent, les nouveaux apparaissent.
- La cartographie se trouve dans `.lagune/memory/detect.md`.

## Étape suivante

Transformez la cartographie en plan : [`/lagune-plan`](https://lagune.ai/fr-FR/docs/commands/plan).

## Questions fréquentes

### Que fait /lagune-detect ?

Il lit votre code et cartographie ce que fait votre système et où se trouvent les risques, en ne consignant que ce qu'il trouve réellement. Sa règle est la détection, pas l'invention.

### Qu'est-ce qu'un constat dans Lagune ?

Un constat est un risque détecté, qui indique ce qu'il est, pourquoi il compte et l'élément de preuve dans le code. C'est l'unité suivie que plan, harden et verify reprennent.

### Où la cartographie est-elle stockée ?

Dans .lagune/memory/detect.md.

### Quelles spécialisations detect utilise-t-il ?

Chacune de celles du catalogue de votre projet reçoit un verdict face au code. Detect applique celles dont le contexte est présent et les consigne sous Applied specializations.
