# Hook jwt: deteksi verifikasi JWT tanpa algoritma yang dikunci

> Pindai basis kode untuk menemukan verifikasi JWT tanpa algoritma yang dikunci, atau nilai satu panggilan, langsung dari command line.

Kanonis: https://lagune.ai/id-ID/docs/hooks/jwt
Bahasa: id-ID
Asli: https://lagune.ai/docs/hooks/jwt
Terakhir diperbarui: 2026-11-06

Hook `jwt` menandai **verifikasi JWT tanpa algoritma yang dikunci**, celah algorithm confusion yang membuat verifier memercayai header `alg` milik token itu sendiri, serta **verifikasi yang dimatikan sepenuhnya**. Hook ini **mengenali bahasa** dan membaca setiap file sesuai pustaka JWT bahasanya. Hook ini juga engine deterministik di balik [spesialisasi `federation`](https://lagune.ai/id-ID/docs/catalog), yang bisa Anda jalankan sendiri dalam mode **scan** atau **check**.

## Menjalankan

**Pindai basis kode**

```bash
npx lagune read jwt                # scans the whole project
npx lagune read jwt --dir src      # scans a directory
npx lagune read jwt --file auth.ts # scans a single file
```

**Periksa satu panggilan**

```bash
npx lagune read jwt --lang javascript --pattern 'jwt.verify(token, secret)'                         # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, options={"verify_signature": False})' # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, algorithms=["HS256"])'                # => safe
```

Setiap baris di bawah **Unpinned JWT verification found** adalah panggilan verifikasi yang tidak menetapkan daftar izin `algorithms` (jika pustakanya memerlukannya), menerima daftar yang tidak aman (`none`, atau algoritma asimetris yang dicampur dengan HMAC), atau mematikan pengecekan tanda tangan sama sekali, sehingga panggilan itu memercayai `alg` milik token itu sendiri. Ini adalah paparan yang terkonfirmasi, jadi hook ini keluar dengan kode bukan nol. Proses yang bersih mencetak `no unpinned JWT verification found`.

## Cara membaca putusan

| Putusan    | Arti                                                                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `unpinned` | Panggilan verifikasi tanpa daftar izin algoritma (jika diperlukan), dengan daftar yang tidak aman, atau dengan verifikasi yang dimatikan. |
| `safe`     | Panggilan verifikasi yang mengunci daftar izin algoritma yang aman, atau yang pustakanya menguncinya secara implisit.                     |
| `invalid`  | Potongan kode tidak berisi panggilan verifikasi yang bisa dikenali untuk dinilai.                                                         |

### Opsi CLI

| Opsi        | Nilai         | Deskripsi                                                                                      |
| ----------- | ------------- | ---------------------------------------------------------------------------------------------- |
| `--pattern` | potongan kode | Memeriksa satu panggilan. Ulangi untuk memeriksa beberapa, satu putusan per baris.             |
| `--lang`    | sebuah bahasa | Wajib bersama `--pattern`: javascript, python, go, java, kotlin, php, ruby, rust, atau csharp. |
| `--dir`     | direktori     | Membatasi pemindaian ke satu direktori. Bisa diulang dan digabung dengan `--file`.             |
| `--file`    | file          | Membatasi pemindaian ke satu file. Bisa diulang dan digabung dengan `--dir`.                   |

Tanpa opsi apa pun, hook ini memindai seluruh proyek. `--pattern` memerlukan `--lang` dan tidak bisa digabung dengan `--dir` atau `--file`.

### Pilih apa yang dipindai

Hook ini melewati apa yang diabaikan **Git**. Untuk melewati lebih banyak, atau untuk memindai apa yang diabaikan **Git**, beri `jwt` pengaturannya sendiri:

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

[Konfigurasi hook](https://lagune.ai/id-ID/docs/hooks/configure) membahas semua pengaturannya.

### Bahasa yang didukung

Pemindaian membaca pustaka berikut, dikenali dari ekstensi file. Karena sebagian pustaka mengunci algoritma secara implisit (tidak adanya daftar eksplisit tetap aman), aturan "tanpa daftar izin ⇒ unpinned" hanya berlaku jika pustakanya mengharapkan daftar eksplisit, sehingga panggilan yang dikonfigurasi dengan benar tidak pernah ditandai.

| Bahasa                      | Pustaka                 | Menandai tidak adanya daftar izin sebagai unpinned?                           | Selalu menandai                                    |
| --------------------------- | ----------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------- |
| **JavaScript / TypeScript** | jsonwebtoken, jose      | Ya                                                                            | `none`, campuran algoritma asimetris dan HMAC      |
| **Python**                  | PyJWT, python-jose      | Ya (PyJWT mewajibkannya, python-jose secara bawaan memakai `algorithms=None`) | `none`, `verify_signature: False`                  |
| **Go**                      | golang-jwt              | Ya (tanpa `WithValidMethods`)                                                 | `none`, `ParseUnverified`                          |
| **Ruby**                    | ruby-jwt                | Ya                                                                            | `none`, `verify = false`                           |
| **Java / Kotlin**           | jjwt, nimbus            | Tidak (diturunkan dari kunci)                                                 | `none`, parser tanpa tanda tangan atau `unsecured` |
| **PHP**                     | firebase/php-jwt        | Tidak (`Key` membawa alg-nya)                                                 | `none`                                             |
| **Rust**                    | jsonwebtoken            | Tidak (`Validation` mewajibkan satu algoritma)                                | `none`, `insecure_disable_signature_validation`    |
| **C#**                      | Microsoft.IdentityModel | Tidak (parameternya ditulis dalam beberapa baris)                             | `none`, `RequireSignedTokens = false`              |

**Tips**

Hook ini hanya memutuskan soal penguncian algoritma: pengecekan claim, kunci, dan alur adalah soal penilaian yang tetap dicakup oleh [spesialisasi `federation`](https://lagune.ai/id-ID/docs/catalog).

## Pertanyaan yang sering diajukan

### Apa itu algorithm confusion pada JWT?

Verifier yang membaca algoritma dari header token memungkinkan penyerang menukar RS256 dengan HS256 lalu menandatangani token dengan kunci publik. Mengunci daftar izin algoritma yang aman di dalam kode mencegahnya, dan hook jwt menandai panggilan verifikasi yang tidak menetapkan daftar itu atau menetapkan daftar yang tidak aman.
