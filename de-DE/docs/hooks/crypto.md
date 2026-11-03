# Hook crypto: schwache Kryptografie erkennen

> Durchsuche eine Codebasis nach schwachen kryptografischen Primitiven, oder bewerte einen einzelnen Codeausschnitt, direkt über die Kommandozeile.

Kanonische URL: https://lagune.ai/de-DE/docs/hooks/crypto
Sprache: de-DE
Original: https://lagune.ai/docs/hooks/crypto
Zuletzt aktualisiert: 2026-11-03

Der Hook `crypto` meldet **schwache kryptografische Primitive** direkt an der Aufrufstelle: ein veraltetes Verschlüsselungsverfahren, einen unsicheren Modus oder einen gebrochenen Hash. Er arbeitet **sprachspezifisch** und liest jede Datei nach ihren eigenen Regeln, sodass er ein Python-Konstrukt nie in einer Rust-Datei meldet. Er ist die deterministische Engine hinter der [Spezialisierung `crypto`](https://lagune.ai/de-DE/docs/catalog), und du kannst ihn selbst im Modus **scan** oder **check** ausführen.

## Ausführen

**Codebasis durchsuchen**

```bash
npx lagune read crypto                # scans the whole project
npx lagune read crypto --dir src      # scans a directory
npx lagune read crypto --file hash.ts # scans a single file
```

**Codeausschnitt prüfen**

```bash
npx lagune read crypto --lang javascript --pattern 'createCipher("aes-256-cbc", k)' # => weak
npx lagune read crypto --lang python --pattern 'hashlib.md5(data)'                  # => review
npx lagune read crypto --lang go --pattern 'sha256.Sum256(data)'                    # => safe
```

Der Durchlauf gibt bis zu zwei Abschnitte aus. **Weak cryptography found** enthält die Befunde (DES/3DES/RC4/Blowfish/RC2, ECB-Modus): Jeder ist ein gebrochenes Verschlüsselungsprimitiv, deshalb endet der Hook mit einem Exit-Code ungleich null. **Cryptography to review manually** enthält Prüfhinweise, die er allein nicht beurteilen kann: einen MD5- oder SHA-1-Hash (für Sicherheitszwecke gebrochen, als einfache Prüfsumme aber legitim, also entscheidet die Absicht), einen nicht kryptografischen Zufallszahlengenerator in einem Sicherheitskontext oder einen Vergleich, der für Timing-Angriffe anfällig ist. Findet er nichts, gibt er `no weak cryptography found` aus.

## So liest du das Urteil

| Urteil    | Bedeutung                                                                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `weak`    | Der Codeausschnitt verwendet ein gebrochenes Verschlüsselungsprimitiv (DES/3DES, RC4, Blowfish, RC2 oder den ECB-Modus).                                          |
| `review`  | Ein Primitiv, dessen Risiko von der Absicht abhängt: ein MD5- oder SHA-1-Hash oder ein nicht kryptografischer Zufallszahlengenerator in einem Sicherheitskontext. |
| `safe`    | Der Codeausschnitt verwendet Kryptografie, und es wurde kein schwaches Primitiv gefunden.                                                                         |
| `invalid` | Der Codeausschnitt enthält kein erkennbares kryptografisches Konstrukt, das sich beurteilen ließe.                                                                |

### CLI-Optionen

| Option      | Wert               | Beschreibung                                                                                                  |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `--pattern` | ein Codeausschnitt | Prüft einen Codeausschnitt. Wiederhole die Option, um mehrere zu prüfen, ein Urteil pro Zeile.                |
| `--lang`    | eine Sprache       | Erforderlich bei `--pattern`: eine von javascript, python, go, java, kotlin, php, ruby, rust, csharp, c, cpp. |
| `--dir`     | ein Verzeichnis    | Beschränkt den Durchlauf auf ein Verzeichnis. Wiederholbar und mit `--file` kombinierbar.                     |
| `--file`    | eine Datei         | Beschränkt den Durchlauf auf eine einzelne Datei. Wiederholbar und mit `--dir` kombinierbar.                  |

Ohne Option durchsucht er das gesamte Projekt. `--pattern` erfordert `--lang` und lässt sich nicht mit `--dir` oder `--file` kombinieren.

### Unterstützte Sprachen

Der Durchlauf liest diese Sprachen, erkannt an der Dateiendung, und prüft jede gegen ihre eigenen kryptografischen APIs.

| Sprache                     | Schwache Verschlüsselung (Befund), Hashes und Zufallszahlengeneratoren (Prüfung)                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **JavaScript / TypeScript** | `createCipher`, `CryptoJS.DES/RC4`, `*-ecb` in Anführungszeichen; MD5/SHA-1 `createHash`/`subtle.digest`; `Math.random()` |
| **Python**                  | pycryptodome `DES/ARC4/Blowfish.new`, `algorithms.TripleDES`, `MODE_ECB`; `hashlib.md5/sha1`; `random.*`                  |
| **Go**                      | `des.NewCipher`, `rc4.NewCipher`, `blowfish.NewCipher`, `NewECBEncrypter`; `md5/sha1.Sum`; `math/rand`                    |
| **Java / Kotlin**           | `Cipher.getInstance("DES"/…/ECB")`; `MessageDigest.getInstance("MD5")`, `HmacMD5`; `java.util.Random`                     |
| **PHP**                     | `openssl_encrypt("des-…"/"…-ecb")`, `mcrypt_*`; `md5()`/`sha1()`, `hash("md5", …)`; `rand()`/`mt_rand()`                  |
| **Ruby**                    | `OpenSSL::Cipher.new("des-…")`, `:ECB`; `Digest::MD5/SHA1`; `rand()`/`Random`                                             |
| **Rust**                    | `Rc4::`, `Blowfish::`, `des::`, `ecb::`; `Md5::`, `Sha1::`, `Hmac<Md5>`; `SmallRng`/`XorShiftRng`                         |
| **C#**                      | `DES/TripleDES/RC2.Create`, `CipherMode.ECB`; `MD5/SHA1.Create`, `HMACMD5`; `new Random()`                                |
| **C / C++**                 | OpenSSL `DES_*`/`RC4`/`EVP_des_*`, `EVP_*_ecb`; `MD5()`/`SHA1()`, `EVP_md5`; `rand()`/`random()`                          |

**Bestmöglich, aber nicht lückenlos**

Er liest den Quellcode als Text, deshalb kann ihm ein Primitiv entgehen, das erst zur Laufzeit zusammengesetzt wird, hinter einem Alias steckt oder in einer Form geschrieben ist, die er nicht erkennt. Betrachte die Tabelle als soliden Ausgangspunkt, nicht als vollständige Bestandsaufnahme.

**Tipp**

Der Hook garantiert das Minimum (dass diese Konstrukte vorhanden sind): Schlüsselverwaltung, die Wiederverwendung von IVs und RSA-Padding bleiben Ermessensfragen, die die [Spezialisierung `crypto`](https://lagune.ai/de-DE/docs/catalog) abdeckt.

## Häufige Fragen

### Wie durchsuche ich eine Codebasis nach schwacher Kryptografie?

Führe den Hook crypto ohne Option aus. Gebrochene Verschlüsselungsverfahren und der ECB-Modus sind Befunde, die mit einem Exit-Code ungleich null enden. Ein MD5- oder SHA-1-Hash ist ein Prüfhinweis, da er für Sicherheitszwecke gebrochen, als einfache Prüfsumme aber legitim ist.

### Meldet der Hook crypto Math.random()?

Nur als Prüfhinweis in einem Sicherheitskontext, nie als automatischen Befund, da Zufall für Jitter oder die Reihenfolge von Elementen in einer Oberfläche legitim ist.
