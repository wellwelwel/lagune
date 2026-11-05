# Installer Lagune comme paquet sur Pi

> Installez Lagune comme paquet sur Pi, depuis npm ou depuis GitHub, et gardez-le à jour.

Canonique: https://lagune.ai/fr-FR/docs/install/pi
Langue: fr-FR
Original: https://lagune.ai/docs/install/pi
Dernière mise à jour: 2026-11-05

**npm**

Installez le paquet depuis votre terminal :

```bash
pi install npm:lagune
```

**GitHub**

Installez le dernier commit depuis **GitHub**, qui exécute le moteur via **npx** :

```bash
pi install git:github.com/wellwelwel/lagune
```

## Mise à jour

**npm**

Pour mettre à jour **Lagune**, exécutez :

```bash
pi update npm:lagune
```

**GitHub**

Pour mettre à jour **Lagune**, exécutez :

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` met à jour tous les paquets que vous avez installés, alors que `pi update` seul ne met à jour que **Pi**.

## Commandes

Tapez les commandes avec le préfixe `skill:`, comme `/skill:lagune-charter` pour `/lagune-charter`.

## Questions fréquentes

### Comment installer Lagune sur Pi ?

Exécutez pi install npm:lagune, ou pi install git:github.com/wellwelwel/lagune pour le dernier commit depuis GitHub.

### Comment mettre à jour Lagune sur Pi ?

Exécutez pi update npm:lagune, ou pi update git:github.com/wellwelwel/lagune pour une installation depuis GitHub. pi update --extensions met à jour tous les paquets que vous avez installés.

### Comment exécuter les commandes de Lagune sur Pi ?

Tapez-les avec le préfixe skill:, comme /skill:lagune-charter.
