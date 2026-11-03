# /lagune: sécuriser le code pendant que votre IA l'écrit

> Construisez ce que vous demandez et durcissez-le au fil de l'écriture, en suivant vos principes de sécurité, sans flux à suivre.

Canonique: https://lagune.ai/fr-FR/docs/commands/lagune
Langue: fr-FR
Original: https://lagune.ai/docs/commands/lagune
Dernière mise à jour: 2026-11-03

⌨️ Faites le travail demandé, sécurisé au fil de l'écriture. **`/lagune`** accepte n'importe quel prompt, à n'importe quelle étape, construit ce que vous vouliez et le durcit avec des valeurs par défaut sûres avant de vous le rendre.

## Utilisation

Ajoutez **`/lagune`** à n'importe quel prompt, et décrivez le travail comme vous le feriez d'habitude.

**📘 Instructions de l**

```md
# Les instructions de mon projet pour les agents

<!-- ... -->

## Sécurité

- Utilise le skill `/lagune` chaque fois que tu construis ou modifies du code, pour renforcer la sécurité par défaut.
```

    - Par exemple : **AGENTS.md**, **CLAUDE.md**, **.github/copilot-instructions.md**, **.cursorrules**, etc.

**💬 Une fonctionnalité**

```prompt
/lagune permets aux utilisateurs d'envoyer une photo personnalisée sur leur profil.
```

**💬 Une correction**

```prompt
/lagune il ne se passe rien quand l'utilisateur envoie le formulaire. Cherche d'où ça peut venir et corrige-le.
```

**💬 Une refactorisation**

```prompt
/lagune découple et améliore la logique du payload
```

**Charter facultative, mais mieux avec**

**`/lagune`** fonctionne avec ou sans principes de sécurité. S'ils existent, les règles propres à votre projet façonnent chaque construction. Définissez-les une fois pour toutes avec [`/lagune-charter`](https://lagune.ai/fr-FR/docs/commands/charter).

## Fonctionnement

Il enveloppe le travail en trois temps, sans rien écrire dans Lagune :

1. Il charge vos principes de sécurité, s'ils existent, et ceux-ci gouvernent toute la construction. Sinon, il s'appuie sur une base sûre par défaut.
2. Il liste le [catalogue](https://lagune.ai/fr-FR/docs/catalog) de votre projet et ne charge que les spécialisations que touche votre travail, les mêmes connaissances à la demande que celles du flux d'audit.
3. Il applique la défense pendant l'écriture du code, puis relit son propre résultat pour confirmer que les mesures de protection sont réellement efficaces avant de vous rendre le travail.

Le résultat, c'est du code fonctionnel dans votre projet, sûr dès la première ligne.

**Utilisez-le à tout moment**

Pas de detect, pas de plan, pas de nettoyage après coup. **`/lagune`** convient aussi bien à un projet tout juste créé qu'à une modification sur une base de code mature, et il durcit le travail au fur et à mesure, pas plus tard.

## Ce qu'il ne fait pas

- Il n'écrit rien dans le répertoire `.lagune`, ni artefact ni suivi : la seule chose qu'il produit, c'est le code durci que vous avez demandé.
- Il n'affaiblit jamais une règle pour satisfaire un prompt : si votre demande enfreint un de vos principes de sécurité, il s'arrête et vous prévient d'abord, au lieu de la construire directement de façon risquée.

## Questions fréquentes

### Que fait /lagune ?

Il accepte n'importe quel prompt, à n'importe quelle étape, construit ce que vous avez demandé et le durcit avec des valeurs par défaut sûres avant de vous le rendre. La défense est appliquée pendant l'écriture du code, pas plus tard.

### Ai-je besoin de principes de sécurité pour utiliser /lagune ?

Non. Il fonctionne avec ou sans. Avec des principes de sécurité, les règles propres à votre projet façonnent chaque construction. Sans eux, il s'appuie sur une base sûre par défaut.

### Quelle différence entre /lagune et le flux Blue Team ?

/lagune sécurise le nouveau travail pendant que vous l'écrivez, sans flux à suivre. Le flux Blue Team exécute les cinq phases d'audit dans l'ordre sur un projet existant.

### /lagune suit-il les constats ou écrit-il des artefacts ?

Non. Il n'écrit rien dans le répertoire .lagune, ni artefact ni suivi. La seule chose qu'il produit, c'est le code durci que vous avez demandé.

### Comment faire en sorte que mon agent utilise /lagune automatiquement ?

Ajoutez au fichier d'instructions de votre agent (AGENTS.md, CLAUDE.md, .cursorrules, etc.) une instruction lui demandant d'utiliser le skill /lagune chaque fois qu'il construit ou modifie du code.
