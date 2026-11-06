# Installer Lagune comme plugin sur Claude Code

> Installez Lagune comme plugin sur Claude Code, dans le terminal, l'extension ou l'application de bureau, gardez-le à jour et autorisez son moteur dès le départ.

Canonique: https://lagune.ai/fr-FR/docs/install/claude-code
Langue: fr-FR
Original: https://lagune.ai/docs/install/claude-code
Dernière mise à jour: 2026-11-03

**Terminal**

Installez le plugin depuis votre terminal :

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

Ou depuis une session **Claude Code** :

```text
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**Extension**

- Tapez `/plugin` et sélectionnez **Manage plugins**.
- Ajoutez `wellwelwel/lagune` dans l'onglet **Marketplaces**.
- Installez `lagune` dans l'onglet **Plugins**.

**Bureau**

- Installez **Lagune** depuis le terminal ou l'extension, en choisissant **Install for you** dans l'extension.
- Démarrez une nouvelle session dans l'application de bureau, qui charge les plugins que vous installez pour vous-même.

## Mise à jour

**Terminal**

Pour mettre à jour **Lagune**, exécutez :

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

Pour le garder à jour, sélectionnez **Enable auto-update** pour la marketplace `lagune` dans `/plugin`.

**Extension**

- Tapez `/plugin` et sélectionnez **Manage plugins**.
- Ouvrez l'onglet **Marketplaces**.
- Sélectionnez l'icône d'actualisation sur `lagune`.

**Bureau**

- Mettez à jour **Lagune** depuis le terminal ou l'extension.
- Démarrez une nouvelle session dans l'application de bureau.

## Commandes

Tapez les commandes par leur nom, comme `/lagune-charter`, ou sous le nom du plugin, comme `/lagune:lagune-charter`.

---

**Autorisations**

Le moteur passe par deux outils : `lagune_read` ne fait que lire votre projet, et `lagune_write` n'écrit que dans `.lagune/`. Pour les autoriser dès le départ, ajoutez ces règles à `.claude/settings.json` pour un seul projet, ou à `~/.claude/settings.json` pour tous :

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

Quand le moteur passe par **npx**, comme avec **skills.sh**, autorisez `Bash(npx --yes lagune@*)`. Avec le sandbox activé, ajoutez aussi `registry.npmjs.org` à `sandbox.network.allowedDomains`.

## Questions fréquentes

### Comment installer Lagune sur Claude Code ?

Exécutez claude plugin install lagune --marketplace wellwelwel/lagune. Dans une session ou dans l'extension, ajoutez la marketplace wellwelwel/lagune depuis le gestionnaire de plugins et installez lagune. L'application de bureau le charge dès que vous l'installez pour vous-même dans le terminal ou l'extension.

### Comment mettre à jour Lagune sur Claude Code ?

Exécutez claude plugin marketplace update lagune, puis claude plugin update lagune@lagune, ou sélectionnez Enable auto-update pour la marketplace lagune dans /plugin. Dans l'extension, ouvrez Manage plugins depuis /plugin et sélectionnez l'icône d'actualisation sur la marketplace lagune. L'application de bureau charge la mise à jour à sa prochaine session.

### Comment exécuter les commandes de Lagune sur Claude Code ?

Tapez-les par leur nom, comme /lagune-charter, ou sous le nom du plugin, comme /lagune:lagune-charter.

### Claude Code peut-il exécuter Lagune sans demander d'autorisation ?

Oui. Autorisez mcp__plugin_lagune_lagune__lagune_read et mcp__plugin_lagune_lagune__lagune_write dans les paramètres de Claude Code, plus Bash(npx --yes lagune@*) quand le moteur passe par npx.
