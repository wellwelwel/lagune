# Hook crypto : détecter la cryptographie faible

> Analysez une base de code à la recherche de primitives cryptographiques faibles, ou évaluez un seul extrait, en ligne de commande.

Canonique: https://lagune.ai/fr-FR/docs/hooks/crypto
Langue: fr-FR
Original: https://lagune.ai/docs/hooks/crypto
Dernière mise à jour: 2026-11-03

Le hook `crypto` signale les **primitives cryptographiques faibles** à l'endroit de l'appel : un chiffrement obsolète, un mode non sûr ou une empreinte cassée. Il est **adapté au langage** et lit chaque fichier selon ses propres règles, donc une construction Python n'est jamais signalée dans un fichier Rust. C'est le moteur déterministe derrière la [spécialisation `crypto`](https://lagune.ai/fr-FR/docs/catalog), que vous pouvez exécuter vous-même en mode **scan** ou **check**.

## Exécution

**Analyser la base de code**

```bash
npx lagune read crypto                # scans the whole project
npx lagune read crypto --dir src      # scans a directory
npx lagune read crypto --file hash.ts # scans a single file
```

**Vérifier un extrait**

```bash
npx lagune read crypto --lang javascript --pattern 'createCipher("aes-256-cbc", k)' # => weak
npx lagune read crypto --lang python --pattern 'hashlib.md5(data)'                  # => review
npx lagune read crypto --lang go --pattern 'sha256.Sum256(data)'                    # => safe
```

L'analyse affiche jusqu'à deux sections. **Weak cryptography found** est l'ensemble des constats (DES/3DES/RC4/Blowfish/RC2, mode ECB) : chacun est une primitive de chiffrement cassée, donc le hook se termine avec un code non nul. **Cryptography to review manually** est un ensemble de pistes qu'il ne peut pas juger seul : une empreinte MD5/SHA-1 (cassée pour un usage de sécurité, mais légitime comme simple somme de contrôle, c'est donc l'intention qui tranche), un générateur aléatoire non cryptographique dans un contexte de sécurité, ou une comparaison sensible aux attaques temporelles. Une analyse propre affiche `no weak cryptography found`.

## Lire le verdict

| Verdict   | Signification                                                                                                                                              |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `weak`    | L'extrait utilise une primitive de chiffrement cassée (DES/3DES, RC4, Blowfish, RC2 ou mode ECB).                                                          |
| `review`  | Une primitive dont le risque dépend de l'intention : une empreinte MD5/SHA-1, ou un générateur aléatoire non cryptographique dans un contexte de sécurité. |
| `safe`    | L'extrait utilise de la cryptographie, et aucune primitive faible n'a été trouvée.                                                                         |
| `invalid` | L'extrait ne contient aucune construction cryptographique reconnaissable à juger.                                                                          |

### Options de la CLI

| Option      | Valeur             | Description                                                                                         |
| ----------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| `--pattern` | un extrait de code | Vérifie un extrait. Répétez-la pour en vérifier plusieurs, un verdict par ligne.                    |
| `--lang`    | un langage         | Requise avec `--pattern` : javascript, python, go, java, kotlin, php, ruby, rust, csharp, c ou cpp. |
| `--dir`     | un répertoire      | Limite l'analyse à un répertoire. Peut être répétée et combinée avec `--file`.                      |
| `--file`    | un fichier         | Limite l'analyse à un seul fichier. Peut être répétée et combinée avec `--dir`.                     |

Sans option, il analyse tout le projet. `--pattern` exige `--lang` et ne peut pas être combinée avec `--dir` ou `--file`.

### Langages pris en charge

L'analyse lit ces langages, selon l'extension du fichier, chacun confronté à ses propres API cryptographiques.

| Langage                     | Chiffrements faibles (constat) et empreintes ou générateurs aléatoires (à examiner)                         |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **JavaScript / TypeScript** | `createCipher`, `CryptoJS.DES/RC4`, quoted `*-ecb`; MD5/SHA-1 `createHash`/`subtle.digest`; `Math.random()` |
| **Python**                  | pycryptodome `DES/ARC4/Blowfish.new`, `algorithms.TripleDES`, `MODE_ECB`; `hashlib.md5/sha1`; `random.*`    |
| **Go**                      | `des.NewCipher`, `rc4.NewCipher`, `blowfish.NewCipher`, `NewECBEncrypter`; `md5/sha1.Sum`; `math/rand`      |
| **Java / Kotlin**           | `Cipher.getInstance("DES"/…/ECB")`; `MessageDigest.getInstance("MD5")`, `HmacMD5`; `java.util.Random`       |
| **PHP**                     | `openssl_encrypt("des-…"/"…-ecb")`, `mcrypt_*`; `md5()`/`sha1()`, `hash("md5", …)`; `rand()`/`mt_rand()`    |
| **Ruby**                    | `OpenSSL::Cipher.new("des-…")`, `:ECB`; `Digest::MD5/SHA1`; `rand()`/`Random`                               |
| **Rust**                    | `Rc4::`, `Blowfish::`, `des::`, `ecb::`; `Md5::`, `Sha1::`, `Hmac<Md5>`; `SmallRng`/`XorShiftRng`           |
| **C#**                      | `DES/TripleDES/RC2.Create`, `CipherMode.ECB`; `MD5/SHA1.Create`, `HMACMD5`; `new Random()`                  |
| **C / C++**                 | OpenSSL `DES_*`/`RC4`/`EVP_des_*`, `EVP_*_ecb`; `MD5()`/`SHA1()`, `EVP_md5`; `rand()`/`random()`            |

**Au mieux, pas de façon exhaustive**

Il lit le code source comme du texte, donc une primitive assemblée à l'exécution, cachée derrière un alias ou écrite sous une forme qu'il ne reconnaît pas peut lui échapper. Considérez le tableau comme un point de départ solide, pas comme un inventaire complet.

**Astuce**

Le hook garantit le socle (ces constructions existent) : la gestion des clés, la réutilisation des IV et le padding RSA relèvent du jugement que couvre toujours la [spécialisation `crypto`](https://lagune.ai/fr-FR/docs/catalog).

## Questions fréquentes

### Comment analyser une base de code à la recherche de cryptographie faible ?

Exécutez le hook crypto sans option. Les chiffrements cassés et le mode ECB sont des constats qui terminent avec un code non nul. Une empreinte MD5/SHA-1 est une piste à examiner, puisqu'elle est cassée pour un usage de sécurité mais légitime comme simple somme de contrôle.

### Le hook crypto signale-t-il Math.random() ?

Seulement comme piste à examiner dans un contexte de sécurité, jamais comme constat automatique, puisque l'aléatoire est légitime pour du jitter ou l'ordre d'affichage d'une interface.
