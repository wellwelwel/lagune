# Installer Lagune comme plugin sur Codex CLI

> Installez Lagune comme plugin sur Codex CLI, gardez-le à jour et exécutez son moteur dans le sandbox.

Canonique: https://lagune.ai/fr-FR/docs/install/codex
Langue: fr-FR
Original: https://lagune.ai/docs/install/codex
Dernière mise à jour: 2026-11-07

Installez le plugin depuis votre terminal :

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## Mise à jour

Pour mettre à jour **Lagune**, exécutez :

```bash
codex plugin marketplace upgrade lagune
```

## Commandes

Tapez `$` et la commande sous le nom du plugin, suivie de votre demande, comme `$lagune:lagune-charter` pour `/lagune-charter`. Taper `$` liste les commandes, et en choisir une insère son nom complet.

---

**Sandbox**

Le sandbox de **Codex** n'a pas d'accès réseau. Installez le moteur dans votre projet depuis votre propre terminal, une fois puis après chaque mise à jour :

```bash
npm i -D lagune@0.19.0
```

## Questions fréquentes

### Comment installer Lagune sur Codex CLI ?

Exécutez codex plugin marketplace add wellwelwel/lagune, puis codex plugin add lagune@lagune.

### Comment mettre à jour Lagune sur Codex CLI ?

Exécutez codex plugin marketplace upgrade lagune.

### Comment exécuter les commandes de Lagune sur Codex CLI ?

Tapez $ et la commande sous le nom du plugin, suivie de votre demande, comme $lagune:lagune-charter.

### Lagune fonctionne-t-il dans le sandbox de Codex ?

Oui, une fois le moteur installé dans votre projet avec npm i -D lagune@0.19.0 depuis votre propre terminal, une fois puis après chaque mise à jour.
