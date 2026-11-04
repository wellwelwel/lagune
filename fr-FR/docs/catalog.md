# Catalogue : spécialisations de sécurité à la demande

> Comment les spécialisations du catalogue de votre projet sont chargées, à la demande par une phase, et directement par vous.

Canonique: https://lagune.ai/fr-FR/docs/catalog
Langue: fr-FR
Original: https://lagune.ai/docs/catalog
Dernière mise à jour: 2026-11-04

🧠 Les spécialisations de **Lagune** sont des modules de connaissances en sécurité ciblés et indépendants du langage, qui ne se chargent qu'à la demande, jamais par défaut. Ce ne sont pas des commandes. Le catalogue de votre projet est l'ensemble qu'il utilise : les spécialisations intégrées de ses [catégories](https://lagune.ai/fr-FR/docs/categories) plus les siennes. Les phases detect et verify y font appel pendant leur exécution, et vous pouvez en charger une directement à tout moment.

**Vue d**

*La vue d'ensemble interactive du catalogue se trouve sur la page web. Toutes les spécialisations intégrées figurent dans le tableau ci-dessous.*

**Fonctionnement**

## L'utiliser vous-même

Pour utiliser une spécialisation directement, demandez à votre agent de la charger avec `read catalog <name>` et écrivez la tâche dans le même prompt. Les connaissances s'appliquent alors à ce que vous avez demandé. Cela fonctionne dans n'importe quel prompt, même sans rapport avec le flux de **Lagune**.

Par exemple, un prompt libre et direct pour générer une collection de **RegExp** sûres en **Python** :

```prompt
Charge la spécialisation regex avec `npx lagune read catalog regex`, puis crée une collection d'expressions régulières dans @src/utils/regex.py pour valider les e-mails et les noms d'utilisateur.
```

Cela utilise un hook déterministe pour tester chaque **RegExp** contre le **ReDoS**, garde celles qui sont sûres et produit quelque chose comme :

```python
import re

EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
USERNAME = re.compile(r"^[a-zA-Z0-9_]{3,20}$")

def is_email(value: str) -> bool:
    return EMAIL.match(value) is not None

def is_username(value: str) -> bool:
    return USERNAME.match(value) is not None
```

**Essayez le vérificateur de ReDoS**

Testez vous-même un motif sur [**devina.io/redos-checker**](https://devina.io/redos-checker).

## Les spécialisations intégrées

Les spécialisations intégrées sont regroupées en [**catégories**](https://lagune.ai/fr-FR/docs/categories). Voici l'ensemble livré avec **Lagune** :

| Spécialisation        | Catégorie                   | Objet                                                                                              |
| --------------------- | --------------------------- | -------------------------------------------------------------------------------------------------- |
| `regex`               | `owasp`                     | **ReDoS :** motifs qui explosent face à une entrée forgée.                                         |
| `network`             | `owasp`                     | **SSRF et redirections :** destinations de requête ou de redirection fournies par l'utilisateur.   |
| `interpreter`         | `owasp`, `lovable`          | **Injection de code :** `eval`, inclusion dynamique, dispatch par nom.                             |
| `sql`                 | `owasp`                     | **Bases de données relationnelles :** injection, appels ORM bruts, privilèges, portée du moteur.   |
| `path`                | `owasp`                     | **Chemins du système de fichiers :** traversal, octet nul, flux NTFS, planting.                    |
| `upload`              | `owasp`                     | **Envoi de fichiers :** type et signature, contenu malveillant, stockage, limites.                 |
| `access-control`      | `owasp`, `lovable`          | **Authentification, autorisation, session :** IDOR, mass assignment, locataires, sessions.         |
| `credential-endpoint` | `owasp`, `lovable`          | **Devinette et bots :** force brute, password spraying, credential stuffing, limitation de débit.  |
| `federation`          | `owasp`                     | **Confiance dans les jetons :** OAuth/OIDC, SAML, validation des JWT, connexion par QR code.       |
| `http-request`        | `owasp`                     | **Provenance des requêtes :** CSRF, mauvaise configuration CORS, IP client usurpée.                |
| `transport`           | `owasp`                     | **Sécurité du canal :** configuration TLS, HTTPS ou texte clair, HSTS, pinning.                    |
| `crypto`              | `owasp`, `lovable`          | **Cryptographie au repos :** algorithmes faibles ou maison, CSPRNG, gestion des clés.              |
| `secrets`             | `owasp`, `lovable`          | **Identifiants codés en dur :** clés, jetons, mots de passe écrits en clair dans le code source.   |
| `api-endpoint`        | `owasp`                     | **Surfaces hors REST :** GraphQL, gRPC, autorisation WebSocket, DoS, schéma.                       |
| `payment`             | `owasp`, `lovable`          | **Parcours de paiement :** vérifier la passerelle côté serveur, callbacks signés, idempotence.     |
| `xml`                 | `owasp`                     | **Analyse XML :** XXE, entités externes, expansion billion laughs.                                 |
| `csv`                 | `owasp`                     | **Injection de formules :** cellules de tableur qui commencent par `=`/`+`/`-`/`@`.                |
| `container`           | `owasp`, `infra`            | **Configuration des conteneurs :** root, capabilities, montage du socket, durcissement de l'image. |
| `infra`               | `infra`                     | **Infrastructure as code :** Terraform, Dockerfile, GitHub Actions.                                |
| `serverless`          | `owasp`, `infra`, `lovable` | **Fonctions FaaS :** IAM au moindre privilège, entrées d'événements, contexte, secrets.            |
| `llm`                 | `ai`, `lovable`             | **Risques de l'IA et des LLM :** injection de prompt, agentivité, RAG, MCP, sortie.                |
| `supabase`            | `lovable`                   | **Backend Supabase :** RLS désactivé par défaut, politiques mal générées par l'IA, modèle de clés. |
| `browser`             | `javascript`, `lovable`     | **Risques côté client :** XSS, CSP, framing, stockage, etc.                                        |
| `javascript`          | `javascript`                | **Risques propres au langage :** RCE, pollution de prototype, etc.                                 |
| `python`              | `python`                    | **Risques propres au langage :** RCE via `pickle`, pollution de classe, `-O`, etc.                 |
| `rust`                | `rust`                      | **Soundness de `unsafe` :** UB déclenché par du code sûr, `transmute`, dépassements.               |
| `java`                | `java`                      | **Désérialisation et code mobile :** chaînes `readObject`, détournement d'objets.                  |
| `ruby`                | `ruby`                      | **Désérialisation et `open` :** reconstitution via `Marshal`/YAML, particularité des pipes.        |
| `php`                 | `php`                       | **Type juggling et `unserialize` :** magic hashes, chaînes POP.                                    |
| `go`                  | `go`                        | **Nil typé et data races :** `nil != nil`, goroutines à mémoire partagée.                          |
| `c-cpp`               | `c-cpp`                     | **Chaînes de format :** `printf(user_input)`, write-what-where via `%n`.                           |
| `dotnet`              | `dotnet`                    | **Risques propres à la plateforme :** RCE via `BinaryFormatter`, `@Html.Raw`, failles des enums.   |

La plupart des connaissances intégrées sont condensées à partir de l'OWASP. Consultez [**Sources OWASP**](https://lagune.ai/fr-FR/docs/references/owasp-sources) pour la correspondance complète entre chaque spécialisation et ses pages canoniques d'attaques et de Cheat Sheets de l'OWASP. Quelques modules propres à une stack s'appuient plutôt sur la documentation de l'éditeur : `supabase`, par exemple, provient de la documentation de Supabase et de la CVE-2025-48757.

## Vos propres spécialisations

Les spécialisations intégrées s'enrichissent d'un fichier de connaissances et d'une ligne d'index, jamais d'une nouvelle commande. Vous ajoutez les vôtres de la même façon, avec [`/lagune-specialize`](https://lagune.ai/fr-FR/docs/commands/specialize) : pointez-le vers un article ou un sujet et il condense une nouvelle spécialisation dans votre projet, le fichier sous `.lagune/catalog/` et son entrée dans `.lagune/configs.json`. Les vôtres sont toujours dans le catalogue, quelles que soient ses catégories, et l'une des vôtres masque une spécialisation intégrée du même nom.

**En interne, Lagune charge les spécialisations automatiquement, à la demande**

Quand la phase detect ou verify rencontre un contexte couvert par une spécialisation, elle charge elle-même cette spécialisation avec `read catalog <name>`. Cela se fait automatiquement, dans le cadre de la phase. Vous n'avez rien à faire à la main pour que cela fonctionne.

## Découvrir ce qui est disponible

Pour lister le catalogue de votre projet depuis le terminal, une spécialisation par ligne avec ses tags :

```bash
npx lagune read catalog
# regex: Regular Expression [required]
# network: Requests, Webhook, URL Fetch, Socket, IMDS, Redirect
# interpreter: Evaluator, Sink, Shell, Dynamic Execution
# ...
```

Une spécialisation `[required]` s'applique toujours, quel que soit le travail. Les spécialisations intégrées que contient la liste dépendent des [**catégories**](https://lagune.ai/fr-FR/docs/categories) de votre projet.

**Les spécialisations ne sont pas chargées par défaut**

Les connaissances pertinentes sont chargées pour ce qu'est réellement le projet, au lieu d'exécuter toutes les vérifications par défaut.

## Questions fréquentes

### Qu'est-ce qu'une spécialisation de Lagune ?

Un module de connaissances en sécurité ciblé et indépendant du langage, qui ne se charge qu'à la demande, jamais par défaut. Ce n'est pas une commande comme les skills de l'agent.

### Qu'est-ce que le catalogue d'un projet ?

Les spécialisations qu'utilise le projet : les intégrées de ses catégories plus les siennes. Tant qu'aucune catégorie n'est enregistrée, il utilise seulement OWASP.

### Les spécialisations sont-elles chargées par défaut ?

Non. Elles ne se chargent qu'à la demande, pour ce qu'est réellement le projet.

### Comment charger directement une spécialisation ?

Dans le même prompt que la tâche, demandez à votre agent d'exécuter npx lagune read catalog <name>.
