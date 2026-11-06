# Hook jwt : détecter une vérification JWT sans algorithme épinglé

> Analysez une base de code à la recherche de vérifications JWT sans algorithme épinglé, ou évaluez un seul appel, en ligne de commande.

Canonique: https://lagune.ai/fr-FR/docs/hooks/jwt
Langue: fr-FR
Original: https://lagune.ai/docs/hooks/jwt
Dernière mise à jour: 2026-11-04

Le hook `jwt` signale les **vérifications JWT sans algorithme épinglé**, la faille de confusion d'algorithme où le vérificateur fait confiance à l'en-tête `alg` du jeton lui-même, ainsi que la **vérification entièrement désactivée**. Il est **adapté au langage** et lit chaque fichier selon sa propre bibliothèque JWT. C'est le moteur déterministe derrière la [spécialisation `federation`](https://lagune.ai/fr-FR/docs/catalog), que vous pouvez exécuter vous-même en mode **scan** ou **check**.

## Exécution

**Analyser la base de code**

```bash
npx lagune read jwt                # scans the whole project
npx lagune read jwt --dir src      # scans a directory
npx lagune read jwt --file auth.ts # scans a single file
```

**Vérifier un appel**

```bash
npx lagune read jwt --lang javascript --pattern 'jwt.verify(token, secret)'                         # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, options={"verify_signature": False})' # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, algorithms=["HS256"])'                # => safe
```

Chaque ligne sous **Unpinned JWT verification found** est un appel de vérification qui ne fixe aucune liste `algorithms` autorisée (là où la bibliothèque en exige une), qui en accepte une non sûre (`none`, ou un algorithme asymétrique mélangé à HMAC), ou qui désactive purement et simplement la vérification de signature, et fait donc confiance au `alg` du jeton lui-même. C'est une exposition confirmée, donc le hook se termine avec un code non nul. Une analyse propre affiche `no unpinned JWT verification found`.

## Lire le verdict

| Verdict    | Signification                                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `unpinned` | Un appel de vérification sans liste d'algorithmes autorisés (là où il en faut une), avec une liste non sûre, ou avec la vérification désactivée. |
| `safe`     | Un appel de vérification qui épingle une liste d'algorithmes saine, ou dont la bibliothèque l'épingle implicitement.                             |
| `invalid`  | L'extrait ne contient aucun appel de vérification reconnaissable à juger.                                                                        |

### Options de la CLI

| Option      | Valeur             | Description                                                                                 |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------- |
| `--pattern` | un extrait de code | Vérifie un appel. Répétez-la pour en vérifier plusieurs, un verdict par ligne.              |
| `--lang`    | un langage         | Requise avec `--pattern` : javascript, python, go, java, kotlin, php, ruby, rust ou csharp. |
| `--dir`     | un répertoire      | Limite l'analyse à un répertoire. Peut être répétée et combinée avec `--file`.              |
| `--file`    | un fichier         | Limite l'analyse à un seul fichier. Peut être répétée et combinée avec `--dir`.             |

Sans option, il analyse tout le projet. `--pattern` exige `--lang` et ne peut pas être combinée avec `--dir` ou `--file`.

### Choisir ce qu'il analyse

Il laisse de côté ce que **Git** ignore. Pour exclure davantage, ou pour analyser ce que **Git** ignore, donnez à `jwt` ses propres paramètres :

```bash
npx lagune write add --ignore test/fixtures --checker jwt
```

```json
{
  "checkers": {
    "jwt": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Configurer les hooks](https://lagune.ai/fr-FR/docs/hooks/configure) présente chaque paramètre.

### Langages pris en charge

L'analyse lit ces bibliothèques, selon l'extension du fichier. Comme certaines épinglent l'algorithme implicitement (l'absence de liste explicite est alors saine), la règle "pas de liste ⇒ unpinned" ne s'applique que là où la bibliothèque attend une liste explicite, donc un appel correctement configuré n'est jamais signalé.

| Langage                     | Bibliothèque            | Signale l'absence de liste comme unpinned ?                     | Signale toujours                                |
| --------------------------- | ----------------------- | --------------------------------------------------------------- | ----------------------------------------------- |
| **JavaScript / TypeScript** | jsonwebtoken, jose      | Oui                                                             | `none`, mélange asymétrique+HMAC                |
| **Python**                  | PyJWT, python-jose      | Oui (PyJWT l'exige, python-jose a `algorithms=None` par défaut) | `none`, `verify_signature: False`               |
| **Go**                      | golang-jwt              | Oui (pas de `WithValidMethods`)                                 | `none`, `ParseUnverified`                       |
| **Ruby**                    | ruby-jwt                | Oui                                                             | `none`, `verify = false`                        |
| **Java / Kotlin**           | jjwt, nimbus            | Non (déduit de la clé)                                          | `none`, un parseur non signé ou `unsecured`     |
| **PHP**                     | firebase/php-jwt        | Non (`Key` porte l'algorithme)                                  | `none`                                          |
| **Rust**                    | jsonwebtoken            | Non (`Validation` en exige une)                                 | `none`, `insecure_disable_signature_validation` |
| **C#**                      | Microsoft.IdentityModel | Non (paramètres sur plusieurs lignes)                           | `none`, `RequireSignedTokens = false`           |

**Astuce**

Le hook ne tranche que l'épinglage de l'algorithme : les vérifications des claims, des clés et du flux relèvent du jugement que couvre toujours la [spécialisation `federation`](https://lagune.ai/fr-FR/docs/catalog).

## Questions fréquentes

### Qu'est-ce que la confusion d'algorithme JWT ?

Un vérificateur qui lit l'algorithme dans l'en-tête du jeton permet à un attaquant de remplacer RS256 par HS256 et de signer avec la clé publique. Épingler dans le code une liste d'algorithmes saine l'empêche, et le hook jwt signale un appel de vérification qui n'en fixe aucune ou en fixe une non sûre.
