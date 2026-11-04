# Catégories

> Les catégories de spécialisations qu'un projet Lagune peut utiliser, de l'OWASP au durcissement propre à JavaScript, Python, Go et Rust, et comment les modifier.

Canonique: https://lagune.ai/fr-FR/docs/categories
Langue: fr-FR
Original: https://lagune.ai/docs/categories
Dernière mise à jour: 2026-11-04

**Lagune** regroupe ses [**spécialisations**](https://lagune.ai/fr-FR/docs/catalog) intégrées en **13 catégories**. Les catégories qu'utilise un projet déterminent quelles spécialisations intégrées rejoignent son [**catalogue**](https://lagune.ai/fr-FR/docs/catalog), et elles se répartissent en deux : ce que fait le système, et le langage dans lequel il est écrit.

Tant qu'aucune catégorie n'est enregistrée, un projet utilise seulement `owasp`. [`/lagune-charter`](https://lagune.ai/fr-FR/docs/commands/charter) enregistre chaque catégorie que justifie sa lecture du projet, et vous pouvez les modifier vous-même à tout moment.

## Ce que fait le système

| Catégorie      | Clé       | Ce qu'elle durcit                                                                                                                                  |
| -------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| OWASP          | `owasp`   | Les risques de sécurité applicative suivis par l'OWASP : injection, contrôle d'accès défaillant, authentification et défaillances cryptographiques |
| Infrastructure | `infra`   | La configuration des conteneurs, des workloads et du serverless : Dockerfile, Compose, sécurité des Pods, IAM et déclencheurs FaaS                 |
| IA / LLM       | `ai`      | Les intégrations d'IA et de LLM, contre l'injection de prompt et le câblage risqué d'outils, d'agents, de recherche documentaire et de MCP         |
| Lovable        | `lovable` | Les applications Supabase générées par IA (Lovable et similaires) : lacunes RLS, clés `service_role` divulguées et valeurs par défaut non sûres    |

## Le langage dans lequel il est écrit

| Catégorie  | Clé          | Ce qu'elle durcit                                                                                                                             |
| ---------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| JavaScript | `javascript` | La RCE par `eval` et `child_process`, le path traversal et la pollution de prototype, dans tous ses runtimes                                  |
| Python     | `python`     | La RCE par désérialisation `pickle` et YAML, le parcours via `str.format` et la pollution de classe                                           |
| Rust       | `rust`       | Les API `unsafe` non sound, le mauvais usage de `transmute`, les dépassements d'entier et le comportement indéfini à la frontière FFI         |
| C / C++    | `c-cpp`      | Les bugs de chaîne de format, les dépassements de tampon et les écritures hors limites qui permettent l'exécution de code                     |
| PHP        | `php`        | Le contournement d'authentification par type juggling, les chaînes de gadgets d'injection d'objets et les configurations par défaut non sûres |
| Go         | `go`         | Les bugs d'interface nil typée, les data races entre goroutines et la concurrence risquée sur les chemins de sécurité                         |
| Java       | `java`       | Les chaînes de gadgets de désérialisation `ObjectInputStream` qui aboutissent à l'exécution de code à distance                                |
| Ruby       | `ruby`       | Les chaînes de gadgets de désérialisation `Marshal.load` et YAML qui mènent à l'exécution de code à distance                                  |
| .NET / C#  | `dotnet`     | La RCE par désérialisation `BinaryFormatter` et les contournements d'encodeur qui mènent au XSS                                               |

**Astuce**

**Lagune** est indépendant du langage : tout le flux lit le langage dans lequel votre projet est écrit, quel qu'il soit, et ces catégories ne font qu'ajouter de la profondeur sur les pièges propres à un langage.

## Ajouter et retirer à tout moment

Une catégorie est un point de départ, pas un engagement. Utilisez ce qui convient au projet aujourd'hui et modifiez-le à tout moment par clé, avec `write add` et `write remove`. `--categories` sans valeur ouvre un sélecteur interactif dans un terminal (espace pour cocher, entrée pour confirmer, rien pour passer). En dehors d'un terminal, passez les catégories après l'option.

**Ajouter**

```bash
npx lagune write add --categories # interactive
npx lagune write add --categories owasp
npx lagune write add --categories owasp rust
```

**Retirer**

```bash
npx lagune write remove --categories # interactive
npx lagune write remove --categories owasp
npx lagune write remove --categories owasp rust
```

Le premier `write add` ou `write remove` part de `owasp`, donc retirer toutes les catégories laisse une liste vide, jamais la valeur par défaut. Chaque modification est enregistrée dans `.lagune/configs.json`, pour que toute l'équipe travaille avec le même ensemble.

## Voir ce qu'utilise un projet

`read list --categories` affiche chaque catégorie et indique si le projet l'utilise :

```bash
npx lagune read list --categories
# Categories
#   • owasp       [used]       Harden against the application security risks OWASP tracks
#   • javascript  [available]  Harden JavaScript and its runtimes
#   • php         [available]  Harden PHP against type-juggling auth bypass
#   • go          [available]  Harden Go against typed-nil interface bugs
#   ...
#
# No category is recorded yet, so this project uses the default: owasp.
```

Consultez le [**Catalogue**](https://lagune.ai/fr-FR/docs/catalog) pour savoir quelles spécialisations porte chaque catégorie. Vos propres spécialisations, écrites avec [`/lagune-specialize`](https://lagune.ai/fr-FR/docs/commands/specialize), rejoignent le catalogue quelles que soient les catégories.

## Questions fréquentes

### Comment ajouter une catégorie ?

Passez la clé de la catégorie à --categories, par exemple npx lagune write add --categories javascript. Tant qu'aucune catégorie n'est enregistrée, la charter enregistre aussi celles que justifie sa lecture du projet.

### Puis-je utiliser plus d'une catégorie ?

Oui. Listez-les sur la même ligne, l'une après l'autre.

### Quelle catégorie un projet doit-il utiliser ?

Commencez par owasp, la valeur par défaut, puis ajoutez celle de votre langage ou de votre stack. Les spécialisations ne se chargent qu'à la demande, donc une catégorie ne coûte rien tant qu'une phase n'a pas besoin de l'une de ses spécialisations.
