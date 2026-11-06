# Installer Lagune comme plugin sur Muse Code

> Installez Lagune comme plugin sur Muse Code, gardez-le à jour et exécutez son moteur dans le sandbox.

Canonique: https://lagune.ai/fr-FR/docs/install/muse-code
Langue: fr-FR
Original: https://lagune.ai/docs/install/muse-code
Dernière mise à jour: 2026-11-03

Installez le plugin depuis votre terminal :

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## Mise à jour

Pour mettre à jour **Lagune**, actualisez la marketplace et réinstallez le plugin :

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## Commandes

Tapez les commandes par leur nom, comme `/lagune-charter`, ou sous le nom du plugin, comme `/lagune:lagune-charter`.

---

**Autorisations**

Le sandbox de **Muse Code** ne peut pas télécharger le moteur. Installez-le dans votre projet depuis votre propre terminal, une fois puis après chaque mise à jour :

```bash
npm i -D lagune@0.18.0
```

## Questions fréquentes

### Comment installer Lagune sur Muse Code ?

Exécutez muse plugins marketplace add lagune wellwelwel/lagune, puis muse plugins install lagune@lagune.

### Comment mettre à jour Lagune sur Muse Code ?

Exécutez muse plugins marketplace update lagune, puis réinstallez avec muse plugins remove lagune et muse plugins install lagune@lagune.

### Comment exécuter les commandes de Lagune sur Muse Code ?

Tapez-les par leur nom, comme /lagune-charter, ou sous le nom du plugin, comme /lagune:lagune-charter.

### Lagune fonctionne-t-il dans le sandbox de Muse Code ?

Oui, une fois le moteur installé dans votre projet avec npm i -D lagune@0.18.0 depuis votre propre terminal, une fois puis après chaque mise à jour.
