# Hook network : évaluer des URL face au SSRF

> Évaluez une ou plusieurs destinations de requête face au SSRF, directement en ligne de commande.

Canonique: https://lagune.ai/fr-FR/docs/hooks/network
Langue: fr-FR
Original: https://lagune.ai/docs/hooks/network
Dernière mise à jour: 2026-11-03

Le hook `network` détermine si une destination de requête côté serveur est à l'abri du **SSRF** (une requête qui peut être dirigée vers des services internes, des métadonnées cloud ou des hôtes privés). C'est le moteur déterministe derrière la [spécialisation `network`](https://lagune.ai/fr-FR/docs/catalog), et vous pouvez l'exécuter vous-même.

## Exécution

Passez chaque destination avec `--url`. Le hook affiche un mot par destination, à lire dans le tableau ci-dessous.

**Une destination**

```bash
npx lagune read network --url 'http://example.com/'
# => safe

npx lagune read network --url 'http://0x7f000001/'
# => private-target
```

**Plusieurs destinations**

Répétez `--url` pour évaluer toute une liste d'autorisation ou de blocage en un seul appel, un verdict par ligne, dans l'ordre.

```bash
npx lagune read network \
  --url 'http://example.com/' \
  --url 'http://[::1]/' \
  --url 'http://allowed.com@evil.example/'
# => safe
# => private-target
# => parser-divergent
```

Il résout l'hôte comme le fait le réseau, donc les formes encodées d'une adresse interne ne passent pas entre les mailles : hexadécimal, octal, décimal sans points, forme abrégée, IPv6 et IPv4 mappé en IPv6 donnent tous `private-target`. Et là où un validateur approximatif et le vrai client HTTP liraient des hôtes différents, le verdict est `parser-divergent`.

## Lire le verdict

| Verdict            | Signification                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| `safe`             | La destination se connecte à un hôte public, et un validateur approximatif lirait le même hôte.         |
| `private-target`   | L'hôte se résout en une adresse privée, de loopback, link-local, non spécifiée ou de métadonnées cloud. |
| `parser-divergent` | Un validateur textuel approximatif lirait un autre hôte réel que celui auquel se connecte le client.    |
| `invalid url`      | La chaîne ne s'analyse pas comme une URL, donc il n'y a rien à récupérer.                               |

Seul `safe` vaut autorisation. Traitez `private-target`, `parser-divergent` et `invalid url` comme un blocage.

### Options de la CLI

| Option  | Valeur             | Description                                                                           |
| ------- | ------------------ | ------------------------------------------------------------------------------------- |
| `--url` | une URL ou un hôte | Vérifie une destination. Répétez-la pour en vérifier plusieurs, un verdict par ligne. |

Au moins un `--url` est requis. La destination n'est jamais un argument positionnel nu, donc elle ne peut pas être confondue avec une option.

**Pourquoi une valeur d'option**

Chaque destination est passée comme valeur d'option, jamais interpolée dans la commande. Une valeur contenant des guillemets ou des backticks reste inerte et ne peut rien injecter dans le shell. Entourez-la toujours de guillemets simples pour que votre shell ne l'interprète pas d'abord.

**Ce qu'il ne couvre pas**

Le hook est pur et ne résout jamais le DNS, donc deux failles d'exécution sont hors périmètre : le **DNS rebinding** (un nom qui se résout en adresse publique lors de la vérification et en adresse interne lors de la requête) et les **chaînes de redirection** (un premier saut qui passe, puis redirige vers l'intérieur). Fermez-les en résolvant une seule fois et en vous connectant à l'adresse validée, et en refusant les redirections. Il rattache les noms de loopback réservés (`localhost` et la famille `.localhost`) à l'interne sans résolution, mais tout autre nom DNS donne `safe`, car affirmer qu'il se résout vers l'intérieur exigerait une résolution : c'est la liste d'autorisation qui les protège, et c'est elle que ce vérificateur valide.

**Astuce**

C'est la même vérification que la [spécialisation `network`](https://lagune.ai/fr-FR/docs/catalog) exécute pour prouver qu'un filtre de destinations est efficace.

## Questions fréquentes

### Comment tester une URL face au SSRF ?

Exécutez le hook network. Il évalue une destination de requête et renvoie safe, private-target, parser-divergent ou invalid url. Seul safe vaut autorisation.

### Qu'est-ce qu'une URL parser-divergent ?

Une URL que des analyseurs différents lisent différemment, un contournement classique du SSRF. Le hook network la signale au lieu de l'autoriser.
