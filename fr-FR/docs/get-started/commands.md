# Skills de sécurité pour agents IA

> Les skills que votre agent IA débloque avec Lagune : auditer un projet existant ou sécuriser le nouveau travail pendant que vous développez, le tout encadré par les principes de sécurité.

Canonique: https://lagune.ai/fr-FR/docs/get-started/commands
Langue: fr-FR
Original: https://lagune.ai/docs/get-started/commands
Dernière mise à jour: 2026-11-05

Une fois **Lagune** [installé](https://lagune.ai/fr-FR/docs), votre agent **IA** débloque un ensemble de skills. Il y a deux façons de les utiliser, toutes deux encadrées par la **charter** : sécuriser le nouveau travail pendant que vous le construisez, ou lancer l'audit complet d'un projet.

**⌨️ Construction / développement**

Inutile de finir votre travail avant de le sécuriser. Utilisez [**`/lagune`**](https://lagune.ai/fr-FR/docs/commands/lagune) pour le travail que vous écrivez **en ce moment** :

| Skill                                         | Ce qu'il fait pour vous                                                                    |
| --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [**/lagune-charter**](https://lagune.ai/fr-FR/docs/commands/charter) | Fixe les règles de sécurité de votre projet, la base sur laquelle `/lagune` construit      |
| [**/lagune**](https://lagune.ai/fr-FR/docs/commands/lagune)          | Construit ce que vous demandez et le durcit au fil de l'écriture, en suivant vos principes |

**Utilisez-le à tout moment**

[**`/lagune`**](https://lagune.ai/fr-FR/docs/commands/lagune) respecte vos principes de sécurité à chaque exécution. Il accepte n'importe quel prompt, construit ce que vous avez demandé et le durcit avec des valeurs par défaut sûres au fur et à mesure, pas plus tard.

---

#### Skills spéciaux

| Skill                                               | Ce qu'il fait                                                                                              |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/fr-FR/docs/commands/specialize) | Enseigne à **Lagune** une nouvelle spécialisation de sécurité à partir d'articles, d'exploits ou de sujets |

**🔬 Audit : flux Blue Team**

Le **flux Blue Team** complet : comprendre ce que fait un projet, cartographier ses risques et les clôturer. Chaque phase s'appuie sur la précédente, il suffit donc de suivre la liste de haut en bas :

| #   | Skill                                         | Ce qu'il fait pour vous                                                                             |
| --- | --------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | [**/lagune-charter**](https://lagune.ai/fr-FR/docs/commands/charter) | Fixe les règles de sécurité de votre projet, proposées pour vous ou façonnées par ce que vous dites |
| 2   | [**/lagune-detect**](https://lagune.ai/fr-FR/docs/commands/detect)   | Lit votre code et cartographie ce que fait votre système et où se trouvent les risques              |
| 3   | [**/lagune-plan**](https://lagune.ai/fr-FR/docs/commands/plan)       | Transforme ce que detect a trouvé en plan de défense, avec un correctif pour chaque constat         |
| 4   | [**/lagune-harden**](https://lagune.ai/fr-FR/docs/commands/harden)   | Applique à votre code les correctifs du plan, en toute sécurité et un par un                        |
| 5   | [**/lagune-verify**](https://lagune.ai/fr-FR/docs/commands/verify)   | Prouve que chaque correctif appliqué est efficace et clôture ceux qui passent la preuve             |

---

#### Skills spéciaux

| Skill                                               | Ce qu'il fait                                                                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [**/lagune-specialize**](https://lagune.ai/fr-FR/docs/commands/specialize) | Enseigne à **Lagune** une nouvelle spécialisation de sécurité à partir d'articles, d'exploits ou de sujets         |
| [**/lagune-prove**](https://lagune.ai/fr-FR/docs/commands/prove)           | Transforme chaque constat détecté en preuve exécutable et exclusivement défensive, pour la divulgation responsable |

---

#### Skills internes

| Skill                                       | Ce qu'il fait                         |
| ------------------------------------------- | ------------------------------------- |
| [**/lagune-repair**](https://lagune.ai/fr-FR/docs/commands/repair) | Répare le suivi interne de **Lagune** |

**Astuce**

La sécurité n'est pas un coût, c'est un investissement : ce que vous y mettez en amont, vous l'économisez bien des fois en incidents que vous n'aurez jamais 🙋🏻‍♂️

## Questions fréquentes

### Quels skills Lagune ajoute-t-il ?

/lagune pour durcir le travail pendant que vous le construisez, et le flux d'audit Blue Team en cinq phases : /lagune-charter, /lagune-detect, /lagune-plan, /lagune-harden, /lagune-verify. Plus /lagune-specialize et /lagune-prove.

### Qu'est-ce que le flux Blue Team de Lagune ?

Un audit en cinq phases : charter (fixer les règles), detect (cartographier les risques), plan (noter les constats et planifier les correctifs), harden (appliquer les correctifs), verify (prouver qu'ils sont efficaces et les clôturer).

### Quelle différence entre /lagune et le flux d'audit ?

/lagune sécurise le nouveau travail pendant que vous l'écrivez, sans flux à suivre. Le flux d'audit exécute les cinq phases dans l'ordre sur un projet existant.
