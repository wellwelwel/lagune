# Installer Lagune comme plugin sur Antigravity CLI

> Installez Lagune comme plugin sur Antigravity CLI, gardez-le à jour et autorisez son moteur dès le départ.

Canonique: https://lagune.ai/fr-FR/docs/install/antigravity-cli
Langue: fr-FR
Original: https://lagune.ai/docs/install/antigravity-cli
Dernière mise à jour: 2026-11-03

Installez le plugin depuis votre terminal :

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Mise à jour

Pour mettre à jour **Lagune**, installez-le de nouveau :

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Commandes

Tapez les commandes sous le nom du plugin, comme `/lagune:lagune-charter` pour `/lagune-charter`.

---

**Autorisations**

Le moteur passe par deux outils : `lagune_read` ne fait que lire votre projet, et `lagune_write` n'écrit que dans `.lagune/`. Une commande envoyée comme premier message d'une session s'exécute avant qu'ils soient chargés, et passe donc par **npx**. Pour autoriser les outils et **npx** dès le départ, ajoutez ces règles à `~/.gemini/antigravity-cli/settings.json` :

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## Questions fréquentes

### Comment installer Lagune sur Antigravity CLI ?

Exécutez agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Comment mettre à jour Lagune sur Antigravity CLI ?

Exécutez de nouveau agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Comment exécuter les commandes de Lagune sur Antigravity CLI ?

Tapez-les sous le nom du plugin, comme /lagune:lagune-charter.

### Antigravity CLI peut-il exécuter Lagune sans demander d'autorisation ?

Oui. Autorisez mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write) et command(regex:npx --yes lagune@[0-9.]+) dans les paramètres d'Antigravity CLI. La règle npx couvre une commande envoyée comme premier message d'une session.
