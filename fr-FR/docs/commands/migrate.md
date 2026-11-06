# Migrate : passer un projet Lagune à manifeste aux skills et aux plugins

> Passez un projet Lagune à manifeste au Lagune fondé sur les skills, en gardant vos principes de sécurité, vos artefacts, votre suivi et vos propres spécialisations.

Canonique: https://lagune.ai/fr-FR/docs/commands/migrate
Langue: fr-FR
Original: https://lagune.ai/docs/commands/migrate
Dernière mise à jour: 2026-11-03

🔀 Passez un projet **Lagune** à manifeste au **Lagune** fondé sur les skills, en gardant tout ce que vous avez écrit.

**Avis d'obsolescence**

Un projet avec un manifeste continue de fonctionner tel quel jusqu'à la `v1.x` : `npx lagune` confie `init`, `pull`, `update`, `add`, `remove`, `list` et le tableau de bord à `lagune@0.15.0`, la dernière version à manifeste.

## Migrer

1. Assurez-vous que votre travail en cours est commité, puis exécutez migrate depuis la racine du projet :

   ```bash
   npx lagune migrate
   ```

2. Commitez séparément ce qu'il a modifié, pour que la migration reste une seule modification relisible.
3. Installez les commandes pour votre agent, comme l'indique la [page d'installation](https://lagune.ai/fr-FR/docs).
4. Si le projet a déjà un artefact detect, plan ou harden, demandez à [`/lagune-repair`](https://lagune.ai/fr-FR/docs/commands/repair) de mettre en cohérence les anciennes références qu'ils contiennent, ainsi que celles de vos propres spécialisations :

   ```prompt
   /lagune-repair Mets en cohérence les spécialisations appliquées (anciennement sub-skills) dans les artefacts sous `.lagune/memory/` (`detect.md`, `plan.md` et `harden.md`) avec les noms que liste le nouveau catalogue, et réécris chaque appel que mes propres spécialisations dans `.lagune/catalog/` font aux anciens hooks de `.lagune/hooks/` en un appel à l'outil `lagune_read` ou `lagune_write`.
   ```

## Ce qui change

| Avant                                                                  | Après                                                                                    |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `.lagune/templates/`, `.lagune/hooks/` et `.lagune/specializations.md` | Supprimés : chaque skill porte son modèle, et le moteur exécute les hooks                |
| Les copies des spécialisations intégrées dans `.lagune/skills/`        | Supprimées : le moteur sert les intégrées                                                |
| Vos propres spécialisations dans `.lagune/skills/`                     | Déplacées dans `.lagune/catalog/`                                                        |
| `.lagune/skills.json`, l'index de vos propres spécialisations          | Fusionné dans `.lagune/configs.json`                                                     |
| Les catégories du manifeste                                            | Enregistrées dans `.lagune/configs.json`                                                 |
| Les anciennes commandes d'agent, comme `/lagune.detect`                | Supprimées : [installer **Lagune**](https://lagune.ai/fr-FR/docs) apporte les nouvelles, comme `/lagune-detect` |
| Le bloc **Lagune** dans `.gitignore`                                   | Supprimé, avec le fichier s'il ne contenait rien d'autre                                 |
| `.lagune/proofs/`, ignoré par ce bloc                                  | Tenu à l'écart des commits par son propre `.gitignore`                                   |
| `.lagune/manifest.json`                                                | Supprimé, en dernier                                                                     |

Votre travail de sécurité reste tel quel : les principes de sécurité, l'artefact produit par chaque phase et la carte de suivi avec les chemins vers lesquels pointe chaque constat.

## Questions fréquentes

### Dois-je migrer ?

Oui. Les projets à manifeste sont obsolètes et ne fonctionnent que jusqu'à la v1.x, donc exécutez npx lagune migrate pour migrer le vôtre.

### Que garde migrate ?

Vos principes de sécurité, chaque artefact des phases, la carte de suivi, vos catégories et vos propres spécialisations. Les spécialisations passent dans .lagune/catalog/, et leur index rejoint vos catégories dans .lagune/configs.json.

### Quand installer les nouvelles commandes ?

Après migrate, comme l'indique la page d'installation pour votre agent. Les installer avant fonctionne aussi, puisque migrate garde le nouveau /lagune.

### Un coéquipier a déjà migré. Que dois-je exécuter ?

Récupérez la migration avec un pull, puis exécutez npx lagune migrate une fois. Il supprime ce que le Lagune à manifeste a laissé dans votre clone, que le contrôle de version n'a jamais transporté, et tient vos preuves à l'écart des commits.
