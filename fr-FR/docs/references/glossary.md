# Glossaire Lagune : SDH, charter, constats et mesures de protection

> Les définitions, en langage courant, de chaque terme de Lagune et du Security-Driven Hardening : SDH, charter, detect, constat, mesure de protection, harden, verify, retrait, clôture, spécialisations, catégories et catalogue.

Canonique: https://lagune.ai/fr-FR/docs/references/glossary
Langue: fr-FR
Original: https://lagune.ai/docs/references/glossary
Dernière mise à jour: 2026-11-03

Chaque terme structurant de Lagune et de la méthodologie Security-Driven Hardening, défini une seule fois, en langage courant.

### Security-Driven Hardening (SDH)

La méthodologie que met en œuvre Lagune : une convention Blue Team adaptée au contexte, qui détecte le contexte d'un système, trie les risques que porte ce contexte et guide les correctifs. Les connaissances de sécurité se trouvent dans la spécification et ses spécialisations à la demande, donc un développeur et un non-développeur sont servis par le même flux.

### Lagune

L'implémentation de référence du SDH : neuf commandes d'agent, chacune avec le modèle qu'elle remplit, qu'un agent IA exécute pour durcir une base de code. Chaque agent les installe avec son propre installateur de plugins ou avec [**skills.sh**](https://www.skills.sh/wellwelwel/lagune), comme l'indique la [page d'installation](https://lagune.ai/fr-FR/docs), et elles exécutent le moteur de Lagune pour chaque étape déterministe.

### Charter

La couche de gouvernance de Lagune : un ensemble de principes axés sur la sécurité que chaque phase suivante doit respecter. Voyez-la comme la vérification à la compilation de la posture de sécurité d'un projet. Elle est stockée dans `.lagune/memory/charter.md`.

### Flux de développement

La commande universelle `/lagune`, qui durcit le travail au fil de l'écriture. Elle accepte n'importe quel prompt, à n'importe quelle étape, construit ce que vous avez demandé et le durcit avec des valeurs par défaut sûres avant de vous le rendre, en suivant la charter quand elle existe. Elle n'écrit rien dans le suivi de Lagune, donc son seul produit est le code durci. Avec la charter (avant) et le flux Blue Team (après), c'est ainsi que Lagune protège pendant le développement.

### Flux Blue Team

L'audit en cinq phases au cœur de Lagune : charter, detect, plan, harden, verify. Chaque phase s'appuie sur la précédente. La "Blue Team" est la tradition de sécurité des défenseurs, par opposition à la Red Team offensive.

### Constat

Un risque détecté. Chaque constat indique ce qu'il est, pourquoi il compte et l'élément de preuve dans le code. Un constat est l'unique unité suivie que plan, harden et verify reprennent, identifiée par son nom dans chaque artefact.

### Mesure de protection

Une mesure de sécurité appliquée pour fermer un risque. Harden applique les mesures de protection, verify prouve qu'elles sont efficaces. Lagune n'affaiblit jamais une mesure de protection pour satisfaire un prompt.

### Detect

La phase qui lit le code et cartographie ce que fait le système et où se trouvent les risques. Sa règle directrice est la détection, pas l'invention : elle ne consigne que ce que le code étaye.

### Harden

La seule phase qui touche à votre code. Elle applique les correctifs du plan un par un et consigne chacun comme Applied, Partial ou Blocked. Applied ne veut pas encore dire prouvé.

### Verify

La phase qui prouve que chaque correctif appliqué est efficace, en lisant le code et en le confrontant à ce que harden a consigné. Elle rend l'un de trois verdicts : Risk closed, Risk not closed ou Cannot tell from the code.

### Retrait

Quand verify prouve qu'un risque est clôturé, le constat est retiré : supprimé de toute la chaîne, avec votre confirmation, pour qu'il cesse d'être retraité.

### Clôture

La propriété selon laquelle le travail de sécurité a un état final. Comme un constat dont la clôture est prouvée est retiré, le flux peut arriver au repos, et ne se rouvre que lorsque le code change. Avec le SDH, la sécurité peut être clôturée, ce n'est pas une boucle sans fin.

### Moteur

Le paquet `lagune` sur **npm**, que les commandes exécutent via `npx` pour chaque étape déterministe : les hooks, le catalogue et les catégories.

### Spécialisation

Un module de connaissances en sécurité ciblé et indépendant du langage, qui ne se charge qu'à la demande, jamais par défaut. Une spécialisation n'est pas une commande. Chargez-en une dans n'importe quel prompt avec `read catalog <name>` du moteur, par exemple `npx lagune read catalog regex`.

### Catégorie

Un groupe nommé de spécialisations intégrées, de `owasp` à celles propres à un langage comme `javascript`, `python`, `go` et `rust`. Les catégories qu'utilise un projet, enregistrées dans `.lagune/configs.json`, déterminent quelles spécialisations intégrées rejoignent son catalogue. Tant qu'aucune n'est enregistrée, le projet utilise seulement `owasp`.

### Catalogue

L'ensemble des spécialisations qu'utilise un projet : les intégrées de ses catégories plus les siennes, écrites avec `/lagune-specialize`. `read catalog` du moteur le liste, et les phases le confrontent au code.

### Prompt à la demande

Le principe selon lequel les connaissances de sécurité pertinentes sont chargées pour ce qu'est réellement le projet, au lieu d'exécuter toutes les vérifications par défaut.

### Identité par le nom

Le modèle de suivi de Lagune : le nom de chaque constat, écrit à l'identique comme titre de section dans chaque artefact, est son identité dans toute la chaîne. La carte de suivi (`.lagune/tracking.json`) ne contient que du suivi, jamais de texte rédigé.

## Questions fréquentes

### Qu'est-ce que le Security-Driven Hardening (SDH) ?

Le SDH est une méthodologie de sécurité Blue Team adaptée au contexte. Elle détecte le contexte d'un système, trie les risques que porte ce contexte et guide les correctifs, en gardant chaque constat en langage courant. Lagune en est l'implémentation de référence.

### Qu'est-ce que la charter dans Lagune ?

La charter est la couche de gouvernance de Lagune, un ensemble de principes axés sur la sécurité que chaque phase suivante doit respecter. Elle est stockée dans .lagune/memory/charter.md.

### Que signifie retirer un constat ?

Quand verify prouve qu'un risque est clôturé, le constat est retiré : supprimé de toute la chaîne avec votre confirmation, pour qu'il cesse d'être retraité.
