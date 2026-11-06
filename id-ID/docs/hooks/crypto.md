# Hook crypto: deteksi kriptografi lemah

> Pindai basis kode untuk menemukan primitif kriptografi yang lemah, atau nilai satu potongan kode, langsung dari command line.

Kanonis: https://lagune.ai/id-ID/docs/hooks/crypto
Bahasa: id-ID
Asli: https://lagune.ai/docs/hooks/crypto
Terakhir diperbarui: 2026-11-06

Hook `crypto` menandai **primitif kriptografi yang lemah** di titik pemanggilannya: cipher yang usang, mode yang tidak aman, atau digest yang sudah rusak. Hook ini **mengenali bahasa** dan membaca setiap file dengan aturan bahasanya sendiri, sehingga konstruksi Python tidak pernah ditandai di file Rust. Hook ini juga engine deterministik di balik [spesialisasi `crypto`](https://lagune.ai/id-ID/docs/catalog), yang bisa Anda jalankan sendiri dalam mode **scan** atau **check**.

## Menjalankan

**Pindai basis kode**

```bash
npx lagune read crypto                # scans the whole project
npx lagune read crypto --dir src      # scans a directory
npx lagune read crypto --file hash.ts # scans a single file
```

**Periksa potongan kode**

```bash
npx lagune read crypto --lang javascript --pattern 'createCipher("aes-256-cbc", k)' # => weak
npx lagune read crypto --lang python --pattern 'hashlib.md5(data)'                  # => review
npx lagune read crypto --lang go --pattern 'sha256.Sum256(data)'                    # => safe
```

Pemindaian mencetak hingga dua bagian. **Weak cryptography found** berisi temuan (DES, 3DES, RC4, Blowfish, RC2, mode ECB): masing-masing adalah primitif cipher yang rusak, jadi hook ini keluar dengan kode bukan nol. **Cryptography to review manually** berisi petunjuk yang tidak bisa dinilainya sendiri: digest MD5 atau SHA-1 (rusak untuk keperluan keamanan, tetapi sah sebagai checksum biasa, jadi niat penggunaannya yang menentukan), RNG non-kriptografis dalam konteks keamanan, atau perbandingan yang rentan terhadap serangan timing. Proses yang bersih mencetak `no weak cryptography found`.

## Cara membaca putusan

| Putusan   | Arti                                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `weak`    | Potongan kode memakai primitif cipher yang rusak (DES atau 3DES, RC4, Blowfish, RC2, atau mode ECB).                    |
| `review`  | Primitif yang bergantung pada niat penggunaan: digest MD5 atau SHA-1, atau RNG non-kriptografis dalam konteks keamanan. |
| `safe`    | Potongan kode memakai kriptografi, dan tidak ada primitif lemah yang ditemukan.                                         |
| `invalid` | Potongan kode tidak berisi konstruksi kriptografi yang bisa dikenali untuk dinilai.                                     |

### Opsi CLI

| Opsi        | Nilai         | Deskripsi                                                                                              |
| ----------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| `--pattern` | potongan kode | Memeriksa satu potongan kode. Ulangi untuk memeriksa beberapa, satu putusan per baris.                 |
| `--lang`    | sebuah bahasa | Wajib bersama `--pattern`: javascript, python, go, java, kotlin, php, ruby, rust, csharp, c, atau cpp. |
| `--dir`     | direktori     | Membatasi pemindaian ke satu direktori. Bisa diulang dan digabung dengan `--file`.                     |
| `--file`    | file          | Membatasi pemindaian ke satu file. Bisa diulang dan digabung dengan `--dir`.                           |

Tanpa opsi apa pun, hook ini memindai seluruh proyek. `--pattern` memerlukan `--lang` dan tidak bisa digabung dengan `--dir` atau `--file`.

### Pilih apa yang dipindai

Hook ini melewati apa yang diabaikan **Git**. Untuk melewati lebih banyak, atau untuk memindai apa yang diabaikan **Git**, beri `crypto` pengaturannya sendiri:

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

[Konfigurasi hook](https://lagune.ai/id-ID/docs/hooks/configure) membahas semua pengaturannya.

### Bahasa yang didukung

Pemindaian membaca bahasa berikut, dikenali dari ekstensi file, dan memeriksa masing-masing terhadap API kriptografinya sendiri.

| Bahasa                      | Cipher lemah (temuan) serta digest dan RNG (tinjauan)                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **JavaScript / TypeScript** | `createCipher`, `CryptoJS.DES/RC4`, `*-ecb` dalam tanda kutip; MD5/SHA-1 `createHash`/`subtle.digest`; `Math.random()` |
| **Python**                  | pycryptodome `DES/ARC4/Blowfish.new`, `algorithms.TripleDES`, `MODE_ECB`; `hashlib.md5/sha1`; `random.*`               |
| **Go**                      | `des.NewCipher`, `rc4.NewCipher`, `blowfish.NewCipher`, `NewECBEncrypter`; `md5/sha1.Sum`; `math/rand`                 |
| **Java / Kotlin**           | `Cipher.getInstance("DES"/…/ECB")`; `MessageDigest.getInstance("MD5")`, `HmacMD5`; `java.util.Random`                  |
| **PHP**                     | `openssl_encrypt("des-…"/"…-ecb")`, `mcrypt_*`; `md5()`/`sha1()`, `hash("md5", …)`; `rand()`/`mt_rand()`               |
| **Ruby**                    | `OpenSSL::Cipher.new("des-…")`, `:ECB`; `Digest::MD5/SHA1`; `rand()`/`Random`                                          |
| **Rust**                    | `Rc4::`, `Blowfish::`, `des::`, `ecb::`; `Md5::`, `Sha1::`, `Hmac<Md5>`; `SmallRng`/`XorShiftRng`                      |
| **C#**                      | `DES/TripleDES/RC2.Create`, `CipherMode.ECB`; `MD5/SHA1.Create`, `HMACMD5`; `new Random()`                             |
| **C / C++**                 | OpenSSL `DES_*`/`RC4`/`EVP_des_*`, `EVP_*_ecb`; `MD5()`/`SHA1()`, `EVP_md5`; `rand()`/`random()`                       |

**Upaya terbaik, tidak menyeluruh**

Hook ini membaca kode sumber sebagai teks, jadi primitif yang dirakit saat runtime, disembunyikan di balik alias, atau ditulis dalam bentuk yang tidak dikenalinya bisa lolos. Anggap tabel ini sebagai titik awal yang kuat, bukan inventaris yang lengkap.

**Tips**

Hook ini menjamin dasarnya (konstruksi ini memang ada): manajemen kunci, penggunaan ulang IV, dan padding RSA adalah soal penilaian yang tetap dicakup oleh [spesialisasi `crypto`](https://lagune.ai/id-ID/docs/catalog).

## Pertanyaan yang sering diajukan

### Bagaimana cara memindai basis kode untuk menemukan kriptografi yang lemah?

Jalankan hook crypto tanpa flag apa pun. Cipher yang rusak dan mode ECB adalah temuan yang keluar dengan kode bukan nol. Digest MD5/SHA-1 adalah petunjuk untuk ditinjau, karena rusak untuk keperluan keamanan tetapi sah sebagai checksum biasa.

### Apakah hook crypto menandai Math.random()?

Hanya sebagai petunjuk untuk ditinjau dalam konteks keamanan, tidak pernah sebagai temuan otomatis, karena keacakan sah dipakai untuk jitter atau pengurutan elemen di UI.
