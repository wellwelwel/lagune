# Configurer les hooks : choisir ce qu'ils analysent

> Choisissez ce que les hooks qui analysent des fichiers laissent de côté, pour tous ou pour un seul.

Canonique: https://lagune.ai/fr-FR/docs/hooks/configure
Langue: fr-FR
Original: https://lagune.ai/docs/hooks/configure
Dernière mise à jour: 2026-11-06

Le bloc `checkers` de `.lagune/configs.json` définit ce que les hooks qui analysent des fichiers laissent de côté, pour tous ou pour un seul.

## Configuration

Ajoutez ou retirez des chemins et des motifs en ligne de commande, en mettant un motif entre guillemets pour que le shell le laisse tel quel :

```bash
npx lagune write add --ignore test/fixtures
npx lagune write add --ignore 'packages/*/dist' --checker secrets
npx lagune write remove --ignore test/fixtures
```

Ou choisissez-les dans les Settings du [tableau de bord](https://lagune.ai/fr-FR/docs/get-started/dashboard), ou définissez-les dans le fichier :

```json
{
  "checkers": {
    "ignore": ["test/fixtures"],
    "secrets": { "gitignore": false, "ignore": ["test/fixtures", "temp"] }
  }
}
```

### Paramètres

| Clé         | Valeur                                       | Défaut | Description                                                                                                 |
| ----------- | -------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| `gitignore` | `true` ou `false`                            | `true` | Laisse de côté ce que **Git** ignore. Un fichier que **Git** suit est analysé dans tous les cas.            |
| `ignore`    | chemins ou motifs depuis la racine du projet | `[]`   | Laisse de côté ce que chacun désigne et tout ce qui se trouve en dessous, même un fichier que **Git** suit. |

Au premier niveau de `checkers`, une clé s'applique à tous les vérificateurs. Sous le nom d'un vérificateur, elle ne s'applique qu'à lui et remplace la clé commune, si bien que dans l'exemple `secrets` analyse ce que **Git** ignore et laisse de côté `test/fixtures` et `temp`. Quand `write add --ignore` donne à un vérificateur sa première liste propre, cette liste commence par une copie de la liste commune.

### Motifs

Un motif part de la racine du projet, donc `*.generated.ts` n'atteint que les fichiers qui s'y trouvent et `**/*.generated.ts` les atteint à n'importe quelle profondeur. Les noms doivent correspondre exactement, casse comprise.

| Motif               | Laisse de côté                                            |
| ------------------- | --------------------------------------------------------- |
| `dist`              | `dist` à la racine du projet                              |
| `packages/*/dist`   | `dist` dans chaque dossier sous `packages`                |
| `**/dist`           | chaque `dist`, à n'importe quelle profondeur              |
| `**/*.generated.ts` | chaque fichier dont le nom se termine par `.generated.ts` |
| `fixture-?`         | `fixture-a`, `fixture-1` et les noms du même genre        |
| `[ab]-cache`        | `a-cache` et `b-cache`                                    |
| `[*]x`              | `*x`, avec un `*` littéral                                |

## Lire le résultat

Le rapport se termine par le nombre de chemins que l'analyse a laissés de côté, selon ce qui les ignore :

```text
Skipped 25 paths that Git ignores and 3 paths that .lagune/configs.json ignores. Name one with --dir or --file to scan it.
```

Un chemin indiqué avec `--dir` ou `--file` est analysé quoi que disent les paramètres. Un paramètre que le moteur ne peut pas lire arrête le vérificateur avec une erreur qui le nomme, par exemple un motif qui commence par `!` ou par une espace, qui sort du projet, qui laisse un crochet ouvert ou dont la correspondance prend trop de temps.

## Questions fréquentes

### Lagune définit-il ces paramètres à ma place ?

Non. La charter liste les dossiers commités qui, d'après sa lecture, ne relèvent pas du code que vous avez à défendre, comme des fixtures de test écrites pour sembler vulnérables, et n'enregistre que ceux que vous choisissez par numéro.

### Quand un vérificateur doit-il analyser ce que Git ignore ?

Quand vous n'avez pas de raison de faire confiance au dépôt, car ses propres fichiers .gitignore pourraient cacher du code, ou quand un dossier de build peut contenir une clé intégrée au moment du build. Réglez gitignore sur false pour tous les vérificateurs ou pour un seul.
