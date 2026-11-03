# Hook crypto: rileva la crittografia debole

> Analizza una codebase alla ricerca di primitive crittografiche deboli, oppure valuta un singolo frammento, dalla riga di comando.

Canonico: https://lagune.ai/it-IT/docs/hooks/crypto
Lingua: it-IT
Originale: https://lagune.ai/docs/hooks/crypto
Ultimo aggiornamento: 2026-11-03

L'hook `crypto` segnala le **primitive crittografiche deboli** nel punto della chiamata: un cifrario deprecato, una modalità non sicura o un digest compromesso. È **consapevole del linguaggio**, legge ogni file con le sue regole, così un costrutto Python non viene mai segnalato in un file Rust, ed è il motore deterministico dietro la [specializzazione `crypto`](https://lagune.ai/it-IT/docs/catalog), che puoi eseguire tu stesso in modalità **scan** o **check**.

## Come eseguirlo

**Analizza la codebase**

```bash
npx lagune read crypto                # scans the whole project
npx lagune read crypto --dir src      # scans a directory
npx lagune read crypto --file hash.ts # scans a single file
```

**Controlla un frammento**

```bash
npx lagune read crypto --lang javascript --pattern 'createCipher("aes-256-cbc", k)' # => weak
npx lagune read crypto --lang python --pattern 'hashlib.md5(data)'                  # => review
npx lagune read crypto --lang go --pattern 'sha256.Sum256(data)'                    # => safe
```

L'analisi stampa fino a due sezioni. **Weak cryptography found** è l'insieme dei rilievi (DES/3DES/RC4/Blowfish/RC2, modalità ECB): ognuno è una primitiva di cifratura compromessa, quindi l'hook esce con un codice diverso da zero. **Cryptography to review manually** è un insieme di piste che non può giudicare da solo: un digest MD5/SHA-1 (compromesso per usi di sicurezza, ma legittimo come semplice checksum, quindi decide l'intento), un RNG non crittografico in un contesto di sicurezza o un confronto non sicuro rispetto ai tempi di esecuzione. Un'esecuzione pulita stampa `no weak cryptography found`.

## Come leggere il verdetto

| Verdetto  | Significato                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| `weak`    | Il frammento usa una primitiva di cifratura compromessa (DES/3DES, RC4, Blowfish, RC2 o modalità ECB).               |
| `review`  | Una primitiva che dipende dall'intento: un digest MD5/SHA-1, o un RNG non crittografico in un contesto di sicurezza. |
| `safe`    | Il frammento usa la crittografia e non è stata trovata alcuna primitiva debole.                                      |
| `invalid` | Il frammento non contiene alcun costrutto crittografico riconoscibile da giudicare.                                  |

### Opzioni della CLI

| Opzione     | Valore                 | Descrizione                                                                                                  |
| ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `--pattern` | un frammento di codice | Controlla un frammento. Ripetila per controllarne diversi, un verdetto per riga.                             |
| `--lang`    | un linguaggio          | Obbligatoria con `--pattern`: uno tra javascript, python, go, java, kotlin, php, ruby, rust, csharp, c, cpp. |
| `--dir`     | una directory          | Limita l'analisi a una directory. Si ripete e si combina con `--file`.                                       |
| `--file`    | un file                | Limita l'analisi a un singolo file. Si ripete e si combina con `--dir`.                                      |

Senza opzioni analizza l'intero progetto. `--pattern` richiede `--lang` e non si può combinare con `--dir` o `--file`.

### Linguaggi supportati

L'analisi legge questi linguaggi, riconosciuti dall'estensione del file, ognuno controllato rispetto alle proprie API crittografiche.

| Linguaggio                  | Cifrari deboli (rilievo) e digest/RNG (da rivedere)                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **JavaScript / TypeScript** | `createCipher`, `CryptoJS.DES/RC4`, `*-ecb` tra virgolette; MD5/SHA-1 `createHash`/`subtle.digest`; `Math.random()` |
| **Python**                  | pycryptodome `DES/ARC4/Blowfish.new`, `algorithms.TripleDES`, `MODE_ECB`; `hashlib.md5/sha1`; `random.*`            |
| **Go**                      | `des.NewCipher`, `rc4.NewCipher`, `blowfish.NewCipher`, `NewECBEncrypter`; `md5/sha1.Sum`; `math/rand`              |
| **Java / Kotlin**           | `Cipher.getInstance("DES"/…/ECB")`; `MessageDigest.getInstance("MD5")`, `HmacMD5`; `java.util.Random`               |
| **PHP**                     | `openssl_encrypt("des-…"/"…-ecb")`, `mcrypt_*`; `md5()`/`sha1()`, `hash("md5", …)`; `rand()`/`mt_rand()`            |
| **Ruby**                    | `OpenSSL::Cipher.new("des-…")`, `:ECB`; `Digest::MD5/SHA1`; `rand()`/`Random`                                       |
| **Rust**                    | `Rc4::`, `Blowfish::`, `des::`, `ecb::`; `Md5::`, `Sha1::`, `Hmac<Md5>`; `SmallRng`/`XorShiftRng`                   |
| **C#**                      | `DES/TripleDES/RC2.Create`, `CipherMode.ECB`; `MD5/SHA1.Create`, `HMACMD5`; `new Random()`                          |
| **C / C++**                 | OpenSSL `DES_*`/`RC4`/`EVP_des_*`, `EVP_*_ecb`; `MD5()`/`SHA1()`, `EVP_md5`; `rand()`/`random()`                    |

**Al meglio delle possibilità, non esaustivo**

Legge il sorgente come testo, quindi una primitiva costruita a runtime, nascosta dietro un alias o scritta in una forma che non riconosce può sfuggirgli. Considera la tabella un solido punto di partenza, non un inventario completo.

**Suggerimento**

L'hook garantisce la base (questi costrutti esistono): la gestione delle chiavi, il riutilizzo degli IV e il padding RSA restano valutazioni coperte dalla [specializzazione `crypto`](https://lagune.ai/it-IT/docs/catalog).

## Domande frequenti

### Come analizzo una codebase alla ricerca di crittografia debole?

Esegui l'hook crypto senza flag. I cifrari compromessi e la modalità ECB sono rilievi che escono con un codice diverso da zero. Un digest MD5/SHA-1 è una pista da rivedere, perché è compromesso per usi di sicurezza ma legittimo come semplice checksum.

### L'hook crypto segnala Math.random()?

Solo come pista da rivedere in un contesto di sicurezza, mai come rilievo automatico, perché la casualità è legittima per il jitter o per l'ordinamento nell'interfaccia.
