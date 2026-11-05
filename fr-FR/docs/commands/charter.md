# /lagune-charter: définir vos principes de sécurité

> Établissez les principes de sécurité de votre projet, les règles que respecte chaque phase suivante, et enregistrez les catégories de spécialisations que justifie sa lecture.

Canonique: https://lagune.ai/fr-FR/docs/commands/charter
Langue: fr-FR
Original: https://lagune.ai/docs/commands/charter
Dernière mise à jour: 2026-11-05

🧬 Dites à **Lagune** ce qu'est votre projet, et il le transforme en règles de sécurité (ou, sans description, il les déduit du projet seul).

La charter est la couche de gouvernance : un ensemble de principes axés sur la sécurité que chaque phase suivante doit respecter. Voyez-la comme la vérification à la compilation de la posture de sécurité de votre projet.

## Utilisation

**Décrire le projet**

```prompt
/lagune-charter Mon projet est une boutique en ligne qui vend des jeux vidéo. Les clients ajoutent des produits à un panier et paient par carte bancaire ou par boleto. Ils peuvent voir leurs commandes et le statut de chacune.
```

**Laisser Lagune proposer**

```prompt
/lagune-charter
```

> _Je vois une bibliothèque de paiement, un système de connexion et un modèle de commande lié à un client. On dirait une boutique en ligne qui vend quelque chose. Les clients paient et suivent leurs propres commandes..._ ☁️

## Ce qu'il en déduit

**Lagune** prend votre description ou votre **PRD** comme direction et en déduit les implications pour la sécurité, puis lit le projet pour aller plus loin que ce que vous avez nommé. Par exemple :

- Un panier qui contient des commandes implique une **base de données** :
  - ex. `"Où se trouvent les données ?"`, `"Qui peut y accéder ?"`, `"Est-ce qu'elles fuient ?"`.
- Des clients qui voient leurs propres commandes impliquent une forme de **connexion ou de contrôle d'accès** :
  - ex. `"Un client peut-il accéder aux commandes d'un autre ?"`, `"Les sessions sont-elles protégées ?"`.
- Accepter les paiements par carte et par boleto implique **de l'argent et des données sensibles** :
  - ex. `"Les données de carte sont-elles stockées ?"`, `"Les paiements sont-ils vérifiés ?"`.

Votre description et le projet se complètent : votre description fixe l'intention, et la lecture des dépendances, du README et de la configuration fait ressortir ce que vous n'avez pas mentionné. Si un point important reste flou, **Lagune** pose une question courte et simple plutôt que de deviner.

À partir de là, **Lagune** construit un ensemble de règles de sécurité sur mesure pour le projet, que vous pouvez relire et ajuster quand vous le souhaitez.

**Tirer le meilleur parti**

- Vous pouvez aussi définir vos propres règles de sécurité pour le projet.
- Plus vous donnez de détails pertinents, meilleur est le rapport final :
  - Expliquez le projet, son fonctionnement et ce qui se passe en coulisses.
  - Qui est l'utilisateur final ? Que peuvent faire les utilisateurs, et que ne peuvent-ils pas faire ?
  - Les détails de comportement valent autant que les détails techniques.
- La mémoire de la charter se trouve dans `.lagune/memory/charter.md`.

## Les catégories qu'il enregistre

Les spécialisations, ces connaissances de sécurité que les phases suivantes chargent à la demande, rejoignent le [catalogue](https://lagune.ai/fr-FR/docs/catalog) de votre projet par [catégorie](https://lagune.ai/fr-FR/docs/categories). Tant que votre projet n'a aucune catégorie enregistrée, la charter enregistre chacune de celles que justifie sa lecture, comme le langage de votre projet, des appels à un LLM ou des conteneurs, et les nomme dans son résumé.

Une fois des catégories enregistrées, la charter les laisse telles quelles et se contente de nommer une catégorie que votre projet n'utilise pas encore. Modifiez-les vous-même à tout moment :

```bash
npx lagune write add --categories python
npx lagune write remove --categories python
```

## Les dossiers qu'il propose d'exclure

Quand la lecture de la charter trouve des dossiers commités qui ne relèvent pas du code que votre projet doit défendre, comme des fixtures de test écrites pour sembler vulnérables, elle les liste par numéro à la fin de son résumé. Elle n'en exclut jamais aucun d'elle-même, car un dépôt hostile peut faire passer son code pour des fixtures, si bien que seuls les numéros que vous donnez en réponse sont enregistrés. [Configurer les hooks](https://lagune.ai/fr-FR/docs/hooks/configure) explique comment les modifier vous-même.

## Étape suivante

Les règles fixées, cartographiez ce que fait réellement votre système : [`/lagune-detect`](https://lagune.ai/fr-FR/docs/commands/detect).

## Questions fréquentes

### Qu'est-ce que la charter dans Lagune ?

La charter est la couche de gouvernance de Lagune, un ensemble de principes axés sur la sécurité que chaque phase suivante doit respecter. Voyez-la comme la vérification à la compilation de la posture de sécurité de votre projet.

### Où la charter est-elle stockée ?

Dans .lagune/memory/charter.md.

### Puis-je écrire mes propres règles dans la charter ?

Oui. Lagune propose des règles à partir de votre description et de votre code, et vous pouvez les reformuler, les supprimer, en ajouter ou réduire leur portée.

### La charter choisit-elle mes catégories de spécialisations ?

Seulement tant qu'aucune n'est enregistrée. Elle enregistre alors chaque catégorie que justifie sa lecture, comme votre langage ou des appels à un LLM. Une fois des catégories enregistrées, elle ne les modifie jamais.
