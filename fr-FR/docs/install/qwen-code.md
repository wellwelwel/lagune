# Installer Lagune comme extension sur Qwen Code

> Installez Lagune comme extension sur Qwen Code, gardez-le à jour et autorisez son moteur dès le départ.

Canonique: https://lagune.ai/fr-FR/docs/install/qwen-code
Langue: fr-FR
Original: https://lagune.ai/docs/install/qwen-code
Dernière mise à jour: 2026-11-03

Installez l'extension depuis votre terminal :

```bash
qwen extensions install lagune
```

## Mise à jour

Pour mettre à jour **Lagune**, exécutez :

```bash
qwen extensions update lagune
```

Pour le garder à jour, installez-le avec `--auto-update`.

## Commandes

Tapez les commandes sous le nom de l'extension, comme `/lagune:lagune-charter` pour `/lagune-charter`.

---

**Autorisations**

Le moteur passe par deux outils : `lagune_read` ne fait que lire votre projet, et `lagune_write` n'écrit que dans `.lagune/`. Pour les autoriser dès le départ, ajoutez ces règles à `.qwen/settings.json` pour un seul projet, ou à `~/.qwen/settings.json` pour tous :

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

Quand le moteur passe par **npx**, comme avec **skills.sh**, autorisez `Shell(npx --yes lagune@*)`.

## Questions fréquentes

### Comment installer Lagune sur Qwen Code ?

Exécutez qwen extensions install lagune.

### Comment mettre à jour Lagune sur Qwen Code ?

Exécutez qwen extensions update lagune, ou installez l'extension avec --auto-update.

### Comment exécuter les commandes de Lagune sur Qwen Code ?

Tapez-les sous le nom de l'extension, comme /lagune:lagune-charter.

### Qwen Code peut-il exécuter Lagune sans demander d'autorisation ?

Oui. Autorisez mcp__lagune__lagune_read et mcp__lagune__lagune_write dans les paramètres de Qwen Code, plus Shell(npx --yes lagune@*) quand le moteur passe par npx.
