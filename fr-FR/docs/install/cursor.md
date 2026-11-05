# Installer Lagune comme plugin sur Cursor

> Installez Lagune comme plugin sur Cursor et la Cursor CLI, gardez-le à jour et autorisez son moteur dès le départ.

Canonique: https://lagune.ai/fr-FR/docs/install/cursor
Langue: fr-FR
Original: https://lagune.ai/docs/install/cursor
Dernière mise à jour: 2026-11-05

**Cursor**

- Ouvrez **Customize**.
- Sélectionnez **From GitHub Repository** et saisissez `https://github.com/wellwelwel/lagune`.
- Sélectionnez **Install** sur **Lagune** et choisissez une portée projet ou utilisateur.

**Cursor CLI**

- Ajoutez la marketplace depuis votre terminal :

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Tapez `/plugins` dans une session `agent`.
- Installez **Lagune**.

Si **Lagune** est déjà installé dans **Claude Code**, la **Cursor CLI** le charge depuis là.

## Mise à jour

**Cursor**

- Ouvrez **Customize**.
- Sélectionnez **Refresh** sur la marketplace `lagune`.

**Cursor CLI**

- Remplacez la marketplace depuis votre terminal :

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Tapez `/plugins` dans une session `agent`.
- Réinstallez **Lagune**.

## Commandes

Tapez les commandes par leur nom, comme `/lagune-charter`.

---

**Autorisations**

Dans **Cursor**, les commandes exécutent le moteur via **npx**, ce que le mode Auto-review par défaut autorise sans demander.

Dans la **Cursor CLI**, le moteur passe par deux outils : `lagune_read` ne fait que lire votre projet, et `lagune_write` n'écrit que dans `.lagune/`. Pour les autoriser dès le départ, ajoutez ces règles à `.cursor/cli.json` pour un seul projet, ou à `~/.cursor/cli-config.json` pour tous :

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

Quand le moteur passe par **npx**, comme avec **skills.sh**, autorisez `Shell(npx:--yes lagune@*)`.

## Questions fréquentes

### Comment installer Lagune sur Cursor ?

Dans Cursor, ouvrez Customize, sélectionnez From GitHub Repository, saisissez https://github.com/wellwelwel/lagune et installez Lagune. Dans la Cursor CLI, exécutez agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor, puis installez Lagune depuis /plugins.

### Comment mettre à jour Lagune sur Cursor ?

Dans Cursor, sélectionnez Refresh sur la marketplace lagune dans Customize. Dans la Cursor CLI, supprimez la marketplace lagune, ajoutez-la de nouveau, puis réinstallez Lagune depuis /plugins.

### Comment exécuter les commandes de Lagune sur Cursor ?

Tapez-les par leur nom, comme /lagune-charter.

### Cursor peut-il exécuter Lagune sans demander d'autorisation ?

Oui. Le mode Auto-review par défaut de Cursor l'autorise déjà. Dans la Cursor CLI, autorisez Mcp(plugin-lagune-lagune:lagune_read) et Mcp(plugin-lagune-lagune:lagune_write), plus Shell(npx:--yes lagune@*) quand le moteur passe par npx.
