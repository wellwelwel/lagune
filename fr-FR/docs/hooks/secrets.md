# Hook secrets : détecter les secrets codés en dur

> Analysez une base de code en ligne de commande à la recherche d'identifiants codés en dur.

Canonique: https://lagune.ai/fr-FR/docs/hooks/secrets
Langue: fr-FR
Original: https://lagune.ai/docs/hooks/secrets
Dernière mise à jour: 2026-11-03

Le hook `secrets` signale les **identifiants compilés dans le code source** au lieu d'être lus depuis l'environnement. Il se fonde sur la **provenance** (un littéral face à une lecture de l'environnement), pas sur le contenu de la valeur, donc il n'a besoin d'aucun catalogue exhaustif de préfixes de fournisseurs et ne produit presque aucun faux positif. C'est le moteur déterministe derrière la [spécialisation `secrets`](https://lagune.ai/fr-FR/docs/catalog).

Les signatures de format des fournisseurs, les identifiants dans les chaînes de connexion et un littéral lié à un identifiant au nom de secret sont **indépendants du langage** : la même chaîne se lit de la même façon dans n'importe quel fichier. Les deux heuristiques qui dépendent de la syntaxe, une lecture de l'environnement avec une valeur par défaut codée en dur et un secret qui aboutit dans un sink de journalisation, sont **adaptées au langage** : un `console.log` JavaScript n'est jamais lu dans un fichier Rust, et le `os.getenv("X", "default")` de Python est reconnu en tant que tel.

## Exécution

```bash
npx lagune read secrets                  # scans the whole project
npx lagune read secrets --dir src        # scans a directory
npx lagune read secrets --file config.ts # scans a single file
```

L'analyse affiche jusqu'à deux sections. **Hardcoded secrets found** est l'ensemble des constats (une valeur par défaut codée en dur pour une variable d'environnement au nom de secret, un identifiant intégré dans une chaîne de connexion, ou une valeur qui correspond à un format de fournisseur répertorié), donc le hook se termine avec un code non nul. **Secret handling to review manually** est un ensemble de pistes : un simple littéral lié à un identifiant au nom de secret (sa provenance est déterminable, mais pas le fait que la valeur soit un vrai secret), et une valeur au nom de secret qui aboutit dans un sink de journalisation ou de réponse. Une analyse propre affiche `no hardcoded secrets found`.

### Options de la CLI

| Option   | Valeur        | Description                                                                     |
| -------- | ------------- | ------------------------------------------------------------------------------- |
| `--dir`  | un répertoire | Limite l'analyse à un répertoire. Peut être répétée et combinée avec `--file`.  |
| `--file` | un fichier    | Limite l'analyse à un seul fichier. Peut être répétée et combinée avec `--dir`. |

Sans option, il analyse tout le projet.

### Langages couverts

Le constat de valeur par défaut d'environnement et la piste de sink de journalisation lisent un ensemble de formes propre à chaque langage, donc ils couvrent les langages ci-dessous et restent silencieux ailleurs. Les trois autres signaux s'exécutent sur **tous** les fichiers.

| Signal                               | Langages                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| Valeur par défaut d'environnement    | JavaScript/TypeScript, Python, Ruby, PHP, Kotlin, Java, Go (`cmp.Or`), Rust, C# |
| Sink de journalisation ou de réponse | JavaScript/TypeScript, Python, Ruby, PHP, Java, Kotlin, Go, Rust, C, C++, C#    |

**Est-ce un problème de politique d'usage ?**

Non. Détecter le format d'un secret pour avertir qu'il a été commité est un outil défensif standard, la même opération que réalisent gitleaks, trufflehog et la push protection de GitHub. Le hook embarque des signatures de détection (des **formats** publics de jetons), jamais un secret réel, et il audite et explique au lieu d'exfiltrer.

## Questions fréquentes

### Comment le hook secrets évite-t-il les faux positifs ?

Il se fonde sur la provenance, pas sur le contenu de la valeur. Les formats à haut niveau de confiance (jetons de fournisseurs, valeurs par défaut d'environnement, chaînes de connexion) sont des constats qui terminent avec un code non nul. Un simple littéral lié à un identifiant au nom de secret est une piste à confirmer, et le même identifiant lu depuis process.env n'est pas signalé du tout.
