# Hook infra : détecter les erreurs de configuration IaC

> Analysez Terraform, les Dockerfiles et GitHub Actions à la recherche d'erreurs de configuration, ou évaluez un seul extrait, en ligne de commande.

Canonique: https://lagune.ai/fr-FR/docs/hooks/infra
Langue: fr-FR
Original: https://lagune.ai/docs/hooks/infra
Dernière mise à jour: 2026-11-04

Le hook `infra` signale les **erreurs de configuration de l'infrastructure as code** qu'il est possible de trancher à partir du fichier : un réseau ouvert au monde entier, une autorisation générique, un secret dans un manifeste, un conteneur root, une valeur non fiable dans un shell de CI. Il ne lit que les fichiers IaC (`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`). C'est le moteur déterministe derrière la [spécialisation `infra`](https://lagune.ai/fr-FR/docs/catalog), en mode **scan** ou **check**.

## Exécution

**Analyser la base de code**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**Vérifier un extrait**

Passez l'extrait avec `--pattern` et son type avec `--kind` (`terraform`, `dockerfile` ou `github-actions`).

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

L'analyse affiche jusqu'à deux sections. **Infrastructure risks found** se termine avec un code non nul et contient les défauts tranchables (un ingress `0.0.0.0/0` sur un port sensible, une déclaration IAM générique, un secret dans un manifeste, `encrypted = false`, un module git non épinglé, une image qui s'exécute explicitement en root, un `curl | sh`, une injection de script en CI, `permissions: write-all`). **Infrastructure hardening advisories** ne change pas le code de sortie (un tag de base mutable, une action épinglée par tag). Une analyse propre affiche `no infrastructure risks found`.

## Lire le verdict

Le mode check affiche le tag de plus haute gravité qu'il a reconnu (par exemple `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`), un tag d'avertissement (`mutable-tag`, `unpinned-action`), ou `safe`. Seul un tag de gravité constat produit un code de sortie non nul.

### Options de la CLI

| Option      | Valeur                                          | Description                                                                     |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------------------------- |
| `--pattern` | un extrait                                      | Vérifie un extrait. Exige `--kind`. Répétez-la pour en vérifier plusieurs.      |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | Le type selon lequel l'extrait est jugé.                                        |
| `--dir`     | un répertoire                                   | Limite l'analyse à un répertoire. Peut être répétée et combinée avec `--file`.  |
| `--file`    | un fichier                                      | Limite l'analyse à un seul fichier. Peut être répétée et combinée avec `--dir`. |

Sans option, il analyse tous les fichiers IaC du projet. `--pattern` ne peut pas être combinée avec `--dir` ou `--file`.

### Choisir ce qu'il analyse

Il laisse de côté ce que **Git** ignore. Pour exclure davantage, ou pour analyser ce que **Git** ignore, donnez à `infra` ses propres paramètres :

```bash
npx lagune write add --ignore examples --checker infra
```

```json
{
  "checkers": {
    "infra": { "gitignore": false, "ignore": ["examples"] }
  }
}
```

[Configurer les hooks](https://lagune.ai/fr-FR/docs/hooks/configure) présente chaque paramètre.

**Astuce**

Le hook repère les cas flagrants et tranchables : l'absence de chiffrement, l'exposition via `pull_request_target` et le bon périmètre IAM relèvent du jugement que couvre toujours la [spécialisation `infra`](https://lagune.ai/fr-FR/docs/catalog).

## Questions fréquentes

### Quels fichiers d'infrastructure le hook infra lit-il ?

Terraform/HCL (.tf, .tf.json, .hcl), les Dockerfiles, et le YAML des workflows et des actions GitHub Actions sous .github/. Il atteint ces fichiers même si les analyseurs de code source les ignorent.
