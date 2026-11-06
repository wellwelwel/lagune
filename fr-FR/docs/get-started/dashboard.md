# Tableau de bord

> Consultez les principes de sécurité, les constats et le catalogue de votre projet dans une vue locale en direct, qui s'ouvre avec une seule commande.

Canonique: https://lagune.ai/fr-FR/docs/get-started/dashboard
Langue: fr-FR
Original: https://lagune.ai/docs/get-started/dashboard
Dernière mise à jour: 2026-11-06

Exécutez **Lagune** directement, sans sous-commande, pour obtenir une vue interactive et en direct de `.lagune/`. Il sert un tableau de bord et l'ouvre sur un port aléatoire :

```bash
npx lagune
```

- [x] **Live Reload**
- [x] **Privé** et **local**
- [x] Affiche tout ce que contient `.lagune/`, dès les premiers principes de sécurité
- [x] **Gérez** les catégories du projet et ce que ses hooks analysent, directement depuis votre navigateur
- [x] Aucun `node_modules` ni `package.json` n'est nécessaire 📦

![Principes de sécurité dans le tableau de bord de Lagune](https://lagune.ai/img/dashboard/02.webp)

![Constats dans le tableau de bord de Lagune](https://lagune.ai/img/dashboard/03.webp)

![Quêtes annexes dans le tableau de bord de Lagune](https://lagune.ai/img/dashboard/04.webp)

![Détail d](https://lagune.ai/img/dashboard/05.webp)

![Catalogue dans le tableau de bord de Lagune](https://lagune.ai/img/dashboard/06.webp)

**Astuce**

- 🚪 Utilisez `--port` pour choisir un port précis.
- ⏏️ Appuyez sur `Ctrl+C` pour l'arrêter.

## Questions fréquentes

### Comment ouvrir le tableau de bord de Lagune ?

Exécutez npx lagune sans sous-commande à la racine de votre projet. Il sert une vue en direct de .lagune/ sur un port aléatoire et l'ouvre dans votre navigateur.

### Le tableau de bord est-il privé ?

Oui. Il tourne uniquement sur votre propre machine, à une adresse locale qu'aucun autre ordinateur ne peut atteindre.

### Puis-je modifier mon projet depuis le tableau de bord ?

Seulement ses catégories et ce que ses hooks laissent de côté, depuis votre navigateur. Tout le reste de ce qu'affiche le tableau de bord est en lecture seule.
