# Installer Lagune comme plugin sur Factory Droid

> Installez Lagune comme plugin sur Factory Droid, gardez-le à jour et autorisez les outils de son moteur.

Canonique: https://lagune.ai/fr-FR/docs/install/factory-droid
Langue: fr-FR
Original: https://lagune.ai/docs/install/factory-droid
Dernière mise à jour: 2026-11-07

Installez le plugin depuis votre terminal :

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## Mise à jour

Pour mettre à jour **Lagune**, exécutez :

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## Commandes

Tapez les commandes par leur nom, comme `/lagune-charter`.

## Questions fréquentes

### Comment installer Lagune sur Factory Droid ?

Exécutez droid plugin marketplace add wellwelwel/lagune, puis droid plugin install lagune@lagune.

### Comment mettre à jour Lagune sur Factory Droid ?

Exécutez droid plugin marketplace update lagune, puis droid plugin update lagune@lagune.

### Comment exécuter les commandes de Lagune sur Factory Droid ?

Tapez-les par leur nom, comme /lagune-charter.

### Factory Droid peut-il exécuter Lagune sans demander d'autorisation ?

Oui. Choisissez de toujours autoriser lagune_read et lagune_write quand Factory Droid le demande. Il le redemande après avoir synchronisé un nouveau commit de la marketplace lagune.
