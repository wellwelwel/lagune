# Installer Lagune comme plugin sur Grok Build

> Installez Lagune comme plugin sur Grok Build, gardez-le à jour et autorisez son moteur dès le départ.

Canonique: https://lagune.ai/fr-FR/docs/install/grok-build
Langue: fr-FR
Original: https://lagune.ai/docs/install/grok-build
Dernière mise à jour: 2026-11-05

Installez le plugin depuis votre terminal :

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## Mise à jour

Pour mettre à jour **Lagune**, exécutez :

```bash
grok plugin update lagune
```

## Commandes

Tapez les commandes par leur nom, comme `/lagune-charter`, ou sous le nom du plugin, comme `/lagune:lagune-charter`.

---

**Autorisations**

Le moteur passe par deux outils : `lagune_read` ne fait que lire votre projet, et `lagune_write` n'écrit que dans `.lagune/`. Pour les autoriser dès le départ, ajoutez ces règles à `~/.grok/config.toml` :

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

Quand le moteur passe par **npx**, comme avec **skills.sh**, autorisez `Bash(npx --yes lagune@*)`.

## Questions fréquentes

### Comment installer Lagune sur Grok Build ?

Exécutez grok plugin install wellwelwel/lagune@plugin-grok --trust.

### Comment mettre à jour Lagune sur Grok Build ?

Exécutez grok plugin update lagune.

### Comment exécuter les commandes de Lagune sur Grok Build ?

Tapez-les par leur nom, comme /lagune-charter, ou sous le nom du plugin, comme /lagune:lagune-charter.

### Grok Build peut-il exécuter Lagune sans demander d'autorisation ?

Oui. Autorisez MCPTool(lagune__lagune_read) et MCPTool(lagune__lagune_write) dans la configuration de Grok Build, plus Bash(npx --yes lagune@*) quand le moteur passe par npx.
