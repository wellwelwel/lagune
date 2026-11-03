# Installer Lagune comme plugin sur OpenCode

> Installez Lagune comme plugin sur OpenCode 1.x et 2.x, et gardez-le à jour.

Canonique: https://lagune.ai/fr-FR/docs/install/opencode
Langue: fr-FR
Original: https://lagune.ai/docs/install/opencode
Dernière mise à jour: 2026-11-03

**OpenCode 2.x**

Installez le plugin depuis votre terminal :

```bash
opencode plugin add lagune
```

Ou ajoutez-le à la liste `plugins` de `opencode.json` :

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

Installez le plugin dans votre projet depuis votre terminal, ou ajoutez `-g` pour l'installer dans tous vos projets :

```bash
opencode plugin lagune
```

Ou ajoutez-le à la liste `plugin` de `opencode.json` :

```json
{
  "plugin": ["lagune"]
}
```

## Mise à jour

**OpenCode 2.x**

Pour mettre à jour **Lagune**, exécutez :

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

Pour mettre à jour **Lagune**, installez la nouvelle version par-dessus l'ancienne, en ajoutant `-g` si vous l'avez installé pour tous vos projets :

```bash
opencode plugin lagune@0.16.0 --force
```

## Commandes

**OpenCode 2.x**

Tapez `@` et choisissez la commande, comme `@lagune-charter`, puis écrivez votre demande dans le même message.

**OpenCode 1.x**

Tapez les commandes par leur nom, comme `/lagune-charter`. Elles sont listées sous `/skills`, pas dans le menu `/`.

---

**Autorisations**

Le moteur passe par deux outils : `lagune_read` ne fait que lire votre projet, et `lagune_write` n'écrit que dans `.lagune/`. **OpenCode** les exécute sans demander.

## Questions fréquentes

### Comment installer Lagune sur OpenCode ?

Sur OpenCode 2.x, exécutez opencode plugin add lagune. Sur OpenCode 1.x, exécutez opencode plugin lagune, en ajoutant -g pour l'installer dans tous vos projets.

### Comment mettre à jour Lagune sur OpenCode ?

Sur OpenCode 2.x, exécutez opencode plugin update lagune, puis opencode reload. Sur OpenCode 1.x, exécutez opencode plugin lagune@0.16.0 --force.

### Comment exécuter les commandes de Lagune sur OpenCode ?

Sur OpenCode 2.x, tapez @ et choisissez la commande, comme @lagune-charter, puis écrivez votre demande dans le même message. Sur OpenCode 1.x, tapez-les par leur nom, comme /lagune-charter, ou trouvez-les sous /skills.

### OpenCode demande-t-il l'autorisation avant d'exécuter Lagune ?

Non. OpenCode exécute les deux outils du moteur, lagune_read et lagune_write, sans demander.
