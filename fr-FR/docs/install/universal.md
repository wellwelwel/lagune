# Installer Lagune dans tout agent avec skills.sh ou GitHub CLI

> Installez Lagune dans n'importe quel agent IA avec la CLI skills ou GitHub CLI, et gardez-le à jour.

Canonique: https://lagune.ai/fr-FR/docs/install/universal
Langue: fr-FR
Original: https://lagune.ai/docs/install/universal
Dernière mise à jour: 2026-11-09

**skills.sh**

Installez les commandes de **Lagune** dans votre projet depuis votre terminal avec [**skills.sh**](https://www.skills.sh/wellwelwel/lagune) :

```bash
npx skills add wellwelwel/lagune -y
```

Ou collez ce prompt dans votre agent :

```md
Exécute `npx --yes skills add wellwelwel/lagune --yes` et suis dès maintenant les instructions du skill généré. Lis toute la sortie, en la redirigeant d'abord vers un fichier temporaire si nécessaire. Résous les chemins relatifs à partir du répertoire de fichiers annexes qu'elle indique.
```

**GitHub CLI**

Installez les commandes de **Lagune** dans votre projet depuis votre terminal avec [**GitHub CLI**](https://cli.github.com/) 2.90.0 ou une version ultérieure :

```bash
gh skill install wellwelwel/lagune --all --scope project
```

Ou collez ce prompt dans votre agent :

```md
Exécute `gh skill install wellwelwel/lagune --all --scope project` et lis toute la sortie, en la redirigeant d'abord vers un fichier temporaire si nécessaire.
```

## Mise à jour

**skills.sh**

Pour mettre à jour **Lagune**, exécutez :

```bash
npx skills update
```

Ou collez ce prompt dans votre agent :

```md
Exécute `npx --yes skills update -y` et lis toute la sortie, en la redirigeant d'abord vers un fichier temporaire si nécessaire.
```

**GitHub CLI**

Pour mettre à jour **Lagune**, exécutez :

```bash
gh skill update --all
```

Ou collez ce prompt dans votre agent :

```md
Exécute `gh skill update --all` et lis toute la sortie, en la redirigeant d'abord vers un fichier temporaire si nécessaire.
```

---

**Sandbox**

Dans un sandbox sans accès réseau, les commandes ne peuvent pas télécharger le moteur. Installez-le dans votre projet depuis votre propre terminal, une fois puis après chaque mise à jour :

```bash
npm i -D lagune@0.18.1
```

## Questions fréquentes

### Comment installer Lagune dans n'importe quel agent IA ?

Exécutez npx skills add wellwelwel/lagune -y ou gh skill install wellwelwel/lagune --all --scope project dans votre projet, ou collez le prompt d'installation dans votre agent.

### Comment mettre à jour Lagune dans n'importe quel agent IA ?

Exécutez npx skills update si vous l'avez installé avec skills.sh, ou gh skill update --all si vous l'avez installé avec GitHub CLI. Vous pouvez aussi coller le prompt de mise à jour dans votre agent.

### Puis-je installer Lagune par plusieurs voies ?

Non. Avec deux, l'agent liste chaque commande deux fois, ou utilise une copie et masque l'autre.
