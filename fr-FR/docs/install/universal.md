# Installer Lagune dans tout agent avec skills.sh

> Installez Lagune dans n'importe quel agent IA avec la CLI skills, et gardez-le à jour.

Canonique: https://lagune.ai/fr-FR/docs/install/universal
Langue: fr-FR
Original: https://lagune.ai/docs/install/universal
Dernière mise à jour: 2026-11-04

**Terminal**

Installez les commandes de **Lagune** depuis votre terminal avec [**skills.sh**](https://www.skills.sh/wellwelwel/lagune) :

```bash
npx skills add wellwelwel/lagune
```

**Prompt**

Collez ce prompt dans votre agent :

```md
Exécute `npx --yes skills add wellwelwel/lagune` et suis dès maintenant les instructions du skill généré. Lis toute la sortie, en la redirigeant d'abord vers un fichier temporaire si nécessaire. Résous les chemins relatifs à partir du répertoire de fichiers annexes qu'elle indique.
```

## Mise à jour

**Terminal**

Pour mettre à jour **Lagune**, exécutez :

```bash
npx skills update
```

**Prompt**

Pour mettre à jour **Lagune**, collez ce prompt dans votre agent :

```md
Exécute `npx --yes skills update -y` et lis toute la sortie, en la redirigeant d'abord vers un fichier temporaire si nécessaire.
```

---

**Une seule voie par agent**

Installez **Lagune** avec **skills.sh** ou avec son **plugin**, jamais les deux.

**Autorisations**

Les commandes exécutent le moteur sous la forme `npx --yes lagune@0.17.0`, et la [page d'installation de chaque agent](https://lagune.ai/fr-FR/docs) indique la règle qui l'autorise dès le départ. Dans un sandbox sans accès réseau, installez le moteur dans votre projet depuis votre propre terminal, une fois puis après chaque mise à jour :

```bash
npm i -D lagune@0.17.0
```

## Questions fréquentes

### Comment installer Lagune dans n'importe quel agent IA ?

Exécutez npx skills add wellwelwel/lagune dans votre projet, ou collez le prompt d'installation dans votre agent.

### Comment mettre à jour Lagune installé avec la CLI skills ?

Exécutez npx skills update, ou collez le prompt de mise à jour dans votre agent.

### Puis-je installer Lagune à la fois avec la CLI skills et avec un plugin ?

Non. Avec les deux, l'agent liste chaque commande deux fois, ou utilise une copie et masque l'autre.
