# Schéma des configs

> Le JSON Schema des configs d'un projet Lagune, pour l'autocomplétion et la validation dans votre éditeur, qui suit la version actuelle de Lagune ou est épinglé à une version.

Canonique: https://lagune.ai/fr-FR/docs/references/configs-schema
Langue: fr-FR
Original: https://lagune.ai/docs/references/configs-schema
Dernière mise à jour: 2026-11-03

`.lagune/configs.json` enregistre les [**catégories**](https://lagune.ai/fr-FR/docs/categories) qu'utilise un projet et indexe ses propres [**spécialisations**](https://lagune.ai/fr-FR/docs/catalog). Son JSON Schema permet à votre éditeur d'autocompléter chaque champ et de signaler une faute de frappe ou une catégorie inconnue pendant que vous modifiez le fichier.

## Le schéma actuel

Chaque fois que **Lagune** écrit le fichier sans y trouver de `$schema`, il fait pointer le fichier vers le schéma actuel :

```json
{
  "$schema": "https://lagune.ai/schemas/configs.json",
  "categories": ["owasp", "javascript"]
}
```

Cette adresse suit toujours la version actuelle de **Lagune**. Un fichier écrit avant **Lagune** 0.16.0 la reçoit à sa prochaine modification, et chaque phase le signale d'ici là.

## Épingler une version

Chaque version de **Lagune** à partir de la 0.16.0 embarque le schéma tel qu'il était dans cette version, publié sur **npm** et servi par **jsDelivr**. Pour en épingler une, indiquez la version après `lagune@` dans l'adresse de `$schema` :

```json
{
  "$schema": "https://cdn.jsdelivr.net/npm/lagune@0.16.0/schemas/configs.json"
}
```

La version accepte n'importe quelle plage semver :

| Version            | Schéma                            |
| ------------------ | --------------------------------- |
| `0.16.0`           | Celui de la 0.16.0                |
| `0.16.x` ou `0.16` | Celui de la dernière version 0.16 |
| `0.x` ou `0`       | Celui de la dernière version 0.x  |
| `latest`           | Celui de la dernière version      |

## Questions fréquentes

### Lagune a-t-il besoin du schéma ?

Non. Le schéma ne sert qu'à votre éditeur, et Lagune lit le fichier de la même façon avec ou sans $schema.

### Lagune écrasera-t-il un schéma épinglé ?

Non. Lagune n'écrit $schema que si le fichier n'en a pas, et garde toute adresse que vous avez définie.

### Quand épingler une version ?

Quand le projet utilise une version précise de Lagune, pour que votre éditeur valide le fichier selon ce qu'accepte cette version.
