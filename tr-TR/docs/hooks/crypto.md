# crypto hook'u: zayıf kriptografiyi tespit edin

> Kod tabanını zayıf kriptografik primitiflere karşı tarayın ya da tek bir kod parçasını doğrudan komut satırından puanlayın.

Kanonik URL: https://lagune.ai/tr-TR/docs/hooks/crypto
Dil: tr-TR
Orijinal: https://lagune.ai/docs/hooks/crypto
Son güncelleme: 2026-11-03

`crypto` hook'u, **zayıf kriptografik primitifleri** çağrıldıkları yerde işaretler: kullanımdan kaldırılmış bir şifre, güvensiz bir mod ya da kırılmış bir özet algoritması. **Dile duyarlıdır**, her dosyayı kendi kurallarıyla okur, bu yüzden bir Python yapısı asla bir Rust dosyasında işaretlenmez. [`crypto` uzmanlığının](https://lagune.ai/tr-TR/docs/catalog) arkasındaki deterministik motordur ve onu **scan** veya **check** modunda kendiniz çalıştırabilirsiniz.

## Çalıştırma

**Kod tabanını tara**

```bash
npx lagune read crypto                # scans the whole project
npx lagune read crypto --dir src      # scans a directory
npx lagune read crypto --file hash.ts # scans a single file
```

**Bir kod parçasını kontrol et**

```bash
npx lagune read crypto --lang javascript --pattern 'createCipher("aes-256-cbc", k)' # => weak
npx lagune read crypto --lang python --pattern 'hashlib.md5(data)'                  # => review
npx lagune read crypto --lang go --pattern 'sha256.Sum256(data)'                    # => safe
```

Tarama en fazla iki bölüm yazdırır. **Weak cryptography found** bulgu kümesidir (DES/3DES/RC4/Blowfish/RC2, ECB modu): her biri kırılmış bir şifreleme primitifidir, bu yüzden hook sıfırdan farklı bir kodla çıkar. **Cryptography to review manually** ise hook'un tek başına değerlendiremediği ipuçlarının kümesidir: bir MD5/SHA-1 özeti (güvenlik amacıyla kırılmıştır ama sıradan bir sağlama toplamı olarak meşrudur, yani karar niyete bağlıdır), güvenlik bağlamında kriptografik olmayan bir rastgele sayı üreteci ya da zamanlama saldırısına açık bir karşılaştırma. Temiz bir çalıştırma `no weak cryptography found` çıktısını verir.

## Kararı nasıl okumalı

| Karar     | Anlamı                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `weak`    | Kod parçası kırılmış bir şifreleme primitifi kullanıyor (DES/3DES, RC4, Blowfish, RC2 veya ECB modu).                    |
| `review`  | Niyete bağlı bir primitif: bir MD5/SHA-1 özeti ya da güvenlik bağlamında kriptografik olmayan bir rastgele sayı üreteci. |
| `safe`    | Kod parçası kriptografi kullanıyor ve hiçbir zayıf primitif bulunamadı.                                                  |
| `invalid` | Kod parçası, değerlendirilebilecek tanınır bir kriptografik yapı içermiyor.                                              |

### CLI seçenekleri

| Seçenek     | Değer           | Açıklama                                                                                                            |
| ----------- | --------------- | ------------------------------------------------------------------------------------------------------------------- |
| `--pattern` | bir kod parçası | Tek bir kod parçasını kontrol eder. Birkaçını kontrol etmek için tekrarlayın, her satıra bir karar düşer.           |
| `--lang`    | bir dil         | `--pattern` ile zorunludur: javascript, python, go, java, kotlin, php, ruby, rust, csharp, c, cpp dillerinden biri. |
| `--dir`     | bir dizin       | Taramayı bir dizinle sınırlar. Tekrarlanabilir ve `--file` ile birleştirilebilir.                                   |
| `--file`    | bir dosya       | Taramayı tek bir dosyayla sınırlar. Tekrarlanabilir ve `--dir` ile birleştirilebilir.                               |

Seçenek verilmezse tüm proje taranır. `--pattern`, `--lang` gerektirir ve `--dir` ya da `--file` ile birleştirilemez.

### Desteklenen diller

Tarama bu dilleri dosya uzantısına göre tanıyarak okur ve her birini kendi kriptografik API'lerine göre kontrol eder.

| Dil                         | Zayıf şifreler (bulgu) ve özetler ile rastgele sayı üreteçleri (inceleme)                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **JavaScript / TypeScript** | `createCipher`, `CryptoJS.DES/RC4`, tırnak içinde `*-ecb`; MD5/SHA-1 `createHash`/`subtle.digest`; `Math.random()` |
| **Python**                  | pycryptodome `DES/ARC4/Blowfish.new`, `algorithms.TripleDES`, `MODE_ECB`; `hashlib.md5/sha1`; `random.*`           |
| **Go**                      | `des.NewCipher`, `rc4.NewCipher`, `blowfish.NewCipher`, `NewECBEncrypter`; `md5/sha1.Sum`; `math/rand`             |
| **Java / Kotlin**           | `Cipher.getInstance("DES"/…/ECB")`; `MessageDigest.getInstance("MD5")`, `HmacMD5`; `java.util.Random`              |
| **PHP**                     | `openssl_encrypt("des-…"/"…-ecb")`, `mcrypt_*`; `md5()`/`sha1()`, `hash("md5", …)`; `rand()`/`mt_rand()`           |
| **Ruby**                    | `OpenSSL::Cipher.new("des-…")`, `:ECB`; `Digest::MD5/SHA1`; `rand()`/`Random`                                      |
| **Rust**                    | `Rc4::`, `Blowfish::`, `des::`, `ecb::`; `Md5::`, `Sha1::`, `Hmac<Md5>`; `SmallRng`/`XorShiftRng`                  |
| **C#**                      | `DES/TripleDES/RC2.Create`, `CipherMode.ECB`; `MD5/SHA1.Create`, `HMACMD5`; `new Random()`                         |
| **C / C++**                 | OpenSSL `DES_*`/`RC4`/`EVP_des_*`, `EVP_*_ecb`; `MD5()`/`SHA1()`, `EVP_md5`; `rand()`/`random()`                   |

**Elden gelenin en iyisi, ama eksiksiz değil**

Hook kaynak kodu metin olarak okur, bu yüzden çalışma zamanında oluşturulan, bir takma adın arkasına gizlenen ya da tanımadığı bir biçimde yazılan bir primitif gözden kaçabilir. Tabloyu eksiksiz bir envanter olarak değil, sağlam bir başlangıç noktası olarak görün.

**İpucu**

Hook tabanı garanti eder (bu yapılar mevcuttur): anahtar yönetimi, IV'nin yeniden kullanımı ve RSA dolgusu, değerlendirme gerektiren konulardır ve onları [`crypto` uzmanlığı](https://lagune.ai/tr-TR/docs/catalog) kapsamaya devam eder.

## Sıkça sorulan sorular

### Bir kod tabanını zayıf kriptografiye karşı nasıl tararım?

crypto hook'unu bayraksız çalıştırın. Kırılmış şifreler ve ECB modu, sıfırdan farklı bir kodla çıkan bulgulardır. Bir MD5/SHA-1 özeti ise incelenmesi gereken bir ipucudur, çünkü güvenlik amacıyla kırılmıştır ama sıradan bir sağlama toplamı olarak meşrudur.

### crypto hook'u Math.random() kullanımını işaretler mi?

Yalnızca güvenlik bağlamında, incelenmesi gereken bir ipucu olarak işaretler, asla otomatik bir bulgu olarak değil, çünkü rastgelelik jitter veya arayüzdeki sıralama için meşrudur.
