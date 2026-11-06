# Installer Lagune comme extension sur Gemini CLI

> Installez Lagune comme extension sur Gemini CLI, gardez-le à jour et autorisez son moteur dès le départ.

Canonique: https://lagune.ai/fr-FR/docs/install/gemini-cli
Langue: fr-FR
Original: https://lagune.ai/docs/install/gemini-cli
Dernière mise à jour: 2026-11-03

Installez l'extension depuis votre terminal :

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## Mise à jour

Pour mettre à jour **Lagune**, exécutez :

```bash
gemini extensions update lagune
```

Pour le garder à jour, installez-le avec `--auto-update`.

## Commandes

Tapez les commandes sous le nom de l'extension, comme `/lagune:lagune-charter` pour `/lagune-charter`.

---

**Autorisations**

Le moteur passe par deux outils : `lagune_read` ne fait que lire votre projet, et `lagune_write` n'écrit que dans `.lagune/`. **Gemini CLI** ne les démarre que dans un dossier de confiance. Pour les autoriser dès le départ, enregistrez cette règle dans `~/.gemini/policies/lagune.toml` :

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

Quand le moteur passe par **npx**, comme avec **skills.sh**, ajoutez cette règle au même fichier :

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## Questions fréquentes

### Comment installer Lagune sur Gemini CLI ?

Exécutez gemini extensions install https://github.com/wellwelwel/lagune.

### Comment mettre à jour Lagune sur Gemini CLI ?

Exécutez gemini extensions update lagune, ou installez l'extension avec --auto-update.

### Comment exécuter les commandes de Lagune sur Gemini CLI ?

Tapez-les sous le nom de l'extension, comme /lagune:lagune-charter.

### Gemini CLI peut-il exécuter Lagune sans demander d'autorisation ?

Oui. Ajoutez une règle de politique qui autorise les outils lagune_read et lagune_write du serveur lagune, plus une pour run_shell_command avec npx --yes lagune@ et une version quand le moteur passe par npx.
