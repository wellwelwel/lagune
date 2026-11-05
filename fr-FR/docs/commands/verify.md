# /lagune-verify: prouver que les mesures de sécurité sont efficaces

> Prouvez que chaque correctif appliqué est efficace, puis clôturez ceux qui passent la preuve.

Canonique: https://lagune.ai/fr-FR/docs/commands/verify
Langue: fr-FR
Original: https://lagune.ai/docs/commands/verify
Dernière mise à jour: 2026-11-05

⚖️ Prouvez que chaque correctif appliqué est efficace, en lisant le code et en le confrontant à ce que harden a consigné, puis clôturez ceux qui passent la preuve.

## Utilisation

**Tout vérifier**

```prompt
/lagune-verify
```

**Indiquer des chemins**

```prompt
/lagune-verify src/routes/upload.ts
```

**Par priorité**

```prompt
/lagune-verify gravité critique et élevée
```

## Fonctionnement

Il lit le code à chaque endroit consigné par harden et confirme qu'il correspond vraiment à ce qui est affirmé. La preuve, c'est cette confrontation du code avec le registre. Chaque mesure de protection reçoit l'un de trois verdicts :

| Verdict                      | Signification                                               |
| ---------------------------- | ----------------------------------------------------------- |
| ✅ Risk closed               | Le code fait exactement ce qu'affirme le registre.          |
| ❌ Risk not closed           | La mesure est encore ouverte. Verify vous renvoie à harden. |
| ❓ Cannot tell from the code | L'élément de preuve n'est pas visible dans le code seul.    |

Un risque dont la clôture est prouvée est ensuite retiré de la chaîne, avec votre confirmation. Par exemple :

- **Envoi de fichiers** (verdict : **✅ Risk closed**)
  - _Comment c'est prouvé :_ lecture du handler d'envoi, qui détecte le type réel du fichier à partir de son contenu, impose une taille maximale et refuse tout le reste, exactement comme l'affirme le registre.
  - _Élément de preuve :_ la fonction `handleUpload`, qui détecte le type réel du fichier à partir de son contenu.

Si le risque n'est pas clôturé, verify le dit clairement et vous renvoie à [`/lagune-harden`](https://lagune.ai/fr-FR/docs/commands/harden), puisque le correctif est encore ouvert.

**Astuce**

- Il s'appuie entièrement sur le registre de durcissement.
- Il ne lit votre code que pour le juger, et n'affaiblit jamais une mesure de protection ni ne réécrit le code pour faire passer un verdict.
- Le relancer met les verdicts en cohérence : ceux qui sont périmés disparaissent, et un risque qui n'est plus clôturé est de nouveau signalé.
- Quand la clôture d'un risque est prouvée, il demande une fois, puis retire ce constat de toute la chaîne (detect, plan, harden et le suivi).
- Il n'écrit aucun rapport propre : chaque verdict se trouve dans le bloc de sa mesure dans `.lagune/memory/harden.md`, où harden le lit à l'exécution suivante.

**Dépend de harden**

Verify s'appuie sur [`/lagune-harden`](https://lagune.ai/fr-FR/docs/commands/harden).

## Le cycle se referme

Quand tout ce qui est dans le périmètre a été retiré, le cycle est au repos. Il ne se rouvre que lorsque le code change. La sécurité peut être clôturée, donc le flux a un état final, pas une boucle sans fin.

## Questions fréquentes

### Comment Lagune vérifie-t-il un correctif ?

/lagune-verify lit le code et le confronte à ce que harden a consigné, puis rend l'un de trois verdicts : Risk closed, Risk not closed ou Cannot tell from the code.

### Qu'est-ce que le retrait d'un constat ?

Quand verify prouve qu'un risque est clôturé, le constat est retiré : supprimé de toute la chaîne, avec votre confirmation, pour qu'il cesse d'être retraité.

### Le travail de sécurité peut-il un jour être terminé ?

Oui. Avec le SDH, la sécurité peut être clôturée : un constat dont la clôture est prouvée est retiré, donc le flux a un état final, pas une boucle sans fin.
