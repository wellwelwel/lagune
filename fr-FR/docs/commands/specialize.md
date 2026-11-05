# /lagune-specialize: créer une spécialisation de sécurité en langage courant

> Condensez une source ou un sujet de sécurité que vous lui donnez en une nouvelle spécialisation chargée à la demande.

Canonique: https://lagune.ai/fr-FR/docs/commands/specialize
Langue: fr-FR
Original: https://lagune.ai/docs/commands/specialize
Dernière mise à jour: 2026-11-05

🎓 Apprenez à **Lagune** une nouvelle spécialisation, à partir d'une source ou d'un sujet que vous lui donnez.

Il lit le contenu et le condense en une spécialisation ciblée et exclusivement défensive, construite exactement comme les [spécialisations intégrées](https://lagune.ai/fr-FR/docs/catalog), pour que les phases detect et verify la chargent ensuite comme n'importe quelle autre. Il ne fait qu'auditer et expliquer : il n'écrit jamais d'entrées d'attaque ni d'exploits, et ne touche jamais à votre code.

**À partir d**

```prompt
# Un lien ou une référence : Lagune en tire la défense
/lagune-specialize https://owasp.org/www-community/attacks/SQL_Injection
```

**À partir d**

```prompt
# Une attaque comme source : la spécialisation reste la défense
/lagune-specialize "' OR 1=1 -- injecte du SQL dans le texte de la requête"
```

**À partir d**

```prompt
# Ou nomme simplement ce qu'il faut couvrir
/lagune-specialize injection SQL
```

**Une attaque peut être la source, jamais le résultat**

Le pointer vers une attaque ne pose pas de problème quand l'objectif est de s'en défendre : la description d'un exploit est un matériau d'étude qu'il condense en défense. La spécialisation qu'il produit audite et explique toujours, elle ne produit jamais d'exploit fonctionnel, de payload ni de technique de contournement.

## Ce qu'il écrit

Le résultat, ce sont deux fichiers dans votre projet, commités et relisibles à côté de votre code :

- La spécialisation dans `.lagune/catalog/<name>.md`, construite comme les [spécialisations intégrées](https://lagune.ai/fr-FR/docs/catalog).
- Son entrée dans `.lagune/configs.json`, où votre projet indexe ses propres spécialisations pour que le catalogue les fusionne avec les intégrées.

Il liste ensuite le catalogue pour confirmer que la nouvelle entrée y figure. Vos propres spécialisations sont toujours dans le catalogue, quelles que soient ses catégories. Vous n'ajoutez jamais de commande et ne touchez jamais au paquet : une nouvelle spécialité, c'est un fichier de connaissances plus une entrée d'index, écrits dans votre propre projet.

## Affiner, jamais écraser

Spécialiser un nom qui existe déjà, qu'il s'agisse d'une spécialisation intégrée comme `regex` ou d'une que vous avez créée auparavant, **met en cohérence** le fichier actuel au lieu de le remplacer. Il lit ce qui s'y trouve, y intègre les nouvelles connaissances, garde ce qui reste valable et réécrit ce qui a changé. Rien n'est jeté sans avoir été lu. Une spécialisation à vous masque une spécialisation intégrée du même nom, ce qui vous permet d'affiner une intégrée pour votre propre projet sans la perdre.

**Astuce**

- La nouvelle spécialisation se charge exactement comme une intégrée : les phases detect et verify la prennent à la demande, ou chargez-la vous-même avec `npx lagune read catalog <name>` et confiez-lui une tâche.
- Quand le contenu a une origine identifiable (un article, un auteur, un lien, une norme), la spécialisation la crédite. Un simple sujet ne porte aucune source.

**Remarque**

**Il ne s'exécute que quand vous l'appelez :** l'agent ne le lance jamais de lui-même.

## Questions fréquentes

### Comment ajouter une spécialisation de sécurité personnalisée ?

Exécutez /lagune-specialize avec une source ou un sujet. Il le condense en une spécialisation exclusivement défensive, écrite dans .lagune/catalog/<name>.md avec son entrée dans .lagune/configs.json.

### Lagune peut-il apprendre à partir de la description d'un exploit ?

Oui, comme source, jamais comme résultat. Une attaque peut être la source, jamais le produit. Specialize n'écrit jamais d'entrées d'attaque ni d'exploits.

### Specialize écrase-t-il les spécialisations intégrées ?

Non. Il affine, il n'écrase jamais.
