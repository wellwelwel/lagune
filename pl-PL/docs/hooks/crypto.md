# Hook crypto: Wykrywanie słabej kryptografii

> Przeszukaj bazę kodu pod kątem słabych prymitywów kryptograficznych albo oceń pojedynczy fragment kodu z wiersza poleceń.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/hooks/crypto
Język: pl-PL
Oryginał: https://lagune.ai/docs/hooks/crypto
Ostatnia aktualizacja: 2026-11-09

Hook `crypto` zgłasza **słabe prymitywy kryptograficzne** bezpośrednio w miejscu wywołania: przestarzały szyfr, niebezpieczny tryb albo złamaną funkcję skrótu. **Rozpoznaje język** i czyta każdy plik według jego własnych reguł, więc nigdy nie zgłosi konstrukcji z Pythona w pliku napisanym w Rust. Jest deterministycznym silnikiem stojącym za [specjalizacją `crypto`](https://lagune.ai/pl-PL/docs/catalog), a ty możesz go uruchomić samodzielnie w trybie **scan** lub **check**.

## Uruchamianie

**Przeszukaj bazę kodu**

```bash
npx lagune read crypto                # scans the whole project
npx lagune read crypto --dir src      # scans a directory
npx lagune read crypto --file hash.ts # scans a single file
```

**Sprawdź fragment kodu**

```bash
npx lagune read crypto --lang javascript --pattern 'createCipher("aes-256-cbc", k)' # => weak
npx lagune read crypto --lang python --pattern 'hashlib.md5(data)'                  # => review
npx lagune read crypto --lang go --pattern 'sha256.Sum256(data)'                    # => safe
```

Skanowanie wypisuje do dwóch sekcji. Sekcja **Weak cryptography found** zawiera ustalenia (DES/3DES/RC4/Blowfish/RC2, tryb ECB): każde z nich to złamany prymityw szyfrujący, więc hook kończy działanie z niezerowym kodem wyjścia. Sekcja **Cryptography to review manually** zawiera wskazówki, których hook nie potrafi ocenić sam: skrót MD5 lub SHA-1 (złamany do zastosowań związanych z bezpieczeństwem, ale uzasadniony jako zwykła suma kontrolna, więc decyduje intencja), niekryptograficzny generator liczb losowych w kontekście bezpieczeństwa albo porównanie podatne na ataki czasowe. Gdy nic nie znajdzie, wypisuje `no weak cryptography found`.

## Jak czytać werdykt

| Werdykt   | Znaczenie                                                                                                                                     |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `weak`    | Fragment kodu używa złamanego prymitywu szyfrującego (DES/3DES, RC4, Blowfish, RC2 lub trybu ECB).                                            |
| `review`  | Prymityw, którego ocena zależy od intencji: skrót MD5 lub SHA-1 albo niekryptograficzny generator liczb losowych w kontekście bezpieczeństwa. |
| `safe`    | Fragment kodu korzysta z kryptografii i nie znaleziono w nim słabego prymitywu.                                                               |
| `invalid` | Fragment kodu nie zawiera rozpoznawalnej konstrukcji kryptograficznej, którą można by ocenić.                                                 |

### Opcje CLI

| Opcja       | Wartość       | Opis                                                                                                   |
| ----------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| `--pattern` | fragment kodu | Sprawdza jeden fragment kodu. Powtórz opcję, aby sprawdzić kilka, po jednym werdykcie na wiersz.       |
| `--lang`    | język         | Wymagana z `--pattern`: jeden z javascript, python, go, java, kotlin, php, ruby, rust, csharp, c, cpp. |
| `--dir`     | folder        | Zawęża skanowanie do folderu. Można ją powtarzać i łączyć z `--file`.                                  |
| `--file`    | plik          | Zawęża skanowanie do jednego pliku. Można ją powtarzać i łączyć z `--dir`.                             |

Bez żadnej opcji przeszukuje cały projekt. Opcja `--pattern` wymaga `--lang` i nie można jej łączyć z `--dir` ani `--file`.

### Wybierz, co przeszukuje

Pomija to, co **Git** ignoruje. Aby pominąć więcej albo przeszukać to, co **Git** ignoruje, nadaj hookowi `crypto` własne ustawienia:

```bash
npx lagune write add --ignore test/fixtures --checker crypto
```

```json
{
  "checkers": {
    "crypto": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

Wszystkie ustawienia opisuje strona [Konfiguracja hooków](https://lagune.ai/pl-PL/docs/hooks/configure).

### Obsługiwane języki

Skanowanie czyta te języki, rozpoznając je po rozszerzeniu pliku, i sprawdza każdy pod kątem jego własnych API kryptograficznych.

| Język                       | Słabe szyfry (ustalenie) oraz skróty i generatory liczb losowych (do przeglądu)                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **JavaScript / TypeScript** | `createCipher`, `CryptoJS.DES/RC4`, `*-ecb` w cudzysłowie; MD5/SHA-1 `createHash`/`subtle.digest`; `Math.random()` |
| **Python**                  | pycryptodome `DES/ARC4/Blowfish.new`, `algorithms.TripleDES`, `MODE_ECB`; `hashlib.md5/sha1`; `random.*`           |
| **Go**                      | `des.NewCipher`, `rc4.NewCipher`, `blowfish.NewCipher`, `NewECBEncrypter`; `md5/sha1.Sum`; `math/rand`             |
| **Java / Kotlin**           | `Cipher.getInstance("DES"/…/ECB")`; `MessageDigest.getInstance("MD5")`, `HmacMD5`; `java.util.Random`              |
| **PHP**                     | `openssl_encrypt("des-…"/"…-ecb")`, `mcrypt_*`; `md5()`/`sha1()`, `hash("md5", …)`; `rand()`/`mt_rand()`           |
| **Ruby**                    | `OpenSSL::Cipher.new("des-…")`, `:ECB`; `Digest::MD5/SHA1`; `rand()`/`Random`                                      |
| **Rust**                    | `Rc4::`, `Blowfish::`, `des::`, `ecb::`; `Md5::`, `Sha1::`, `Hmac<Md5>`; `SmallRng`/`XorShiftRng`                  |
| **C#**                      | `DES/TripleDES/RC2.Create`, `CipherMode.ECB`; `MD5/SHA1.Create`, `HMACMD5`; `new Random()`                         |
| **C / C++**                 | OpenSSL `DES_*`/`RC4`/`EVP_des_*`, `EVP_*_ecb`; `MD5()`/`SHA1()`, `EVP_md5`; `rand()`/`random()`                   |

**W miarę możliwości, bez gwarancji kompletności**

Hook czyta kod źródłowy jako tekst, więc może przeoczyć prymityw składany w czasie działania programu, ukryty za aliasem albo zapisany w formie, której nie rozpoznaje. Traktuj tabelę jako solidny punkt wyjścia, a nie pełną inwentaryzację.

**Wskazówka**

Hook gwarantuje minimum (że te konstrukcje występują w kodzie): zarządzanie kluczami, ponowne użycie IV i padding RSA wymagają oceny, którą nadal zapewnia [specjalizacja `crypto`](https://lagune.ai/pl-PL/docs/catalog).

## Najczęściej zadawane pytania

### Jak przeszukać bazę kodu pod kątem słabej kryptografii?

Uruchom hook crypto bez żadnej opcji. Złamane szyfry i tryb ECB to ustalenia, przy których hook kończy działanie z niezerowym kodem wyjścia. Skrót MD5 lub SHA-1 to wskazówka do przeglądu, bo jest złamany do zastosowań związanych z bezpieczeństwem, ale uzasadniony jako zwykła suma kontrolna.

### Czy hook crypto zgłasza Math.random()?

Tylko jako wskazówkę do przeglądu w kontekście bezpieczeństwa, nigdy jako automatyczne ustalenie, bo losowość jest uzasadniona przy jitterze albo przy ustalaniu kolejności elementów w interfejsie.
