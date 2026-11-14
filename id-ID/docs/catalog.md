# Katalog: spesialisasi keamanan yang dimuat saat dibutuhkan

> Halaman ini tertinggal dari versi bahasa Inggrisnya. [Baca versi aslinya](https://lagune.ai/docs/catalog).

> Cara spesialisasi di katalog proyek Anda dimuat, oleh fase hanya saat dibutuhkan, atau langsung oleh Anda.

Kanonis: https://lagune.ai/id-ID/docs/catalog
Bahasa: id-ID
Asli: https://lagune.ai/docs/catalog
Terakhir diperbarui: 2026-11-06

🧠 Spesialisasi **Lagune** adalah modul pengetahuan keamanan yang terfokus dan tidak bergantung pada bahasa pemrograman, yang dimuat hanya saat dibutuhkan, tidak pernah secara default. Spesialisasi bukan perintah. Katalog proyek Anda adalah kumpulan spesialisasi yang dipakai proyek itu: spesialisasi bawaan dari [kategori](https://lagune.ai/id-ID/docs/categories) yang dipakainya, ditambah spesialisasi milik proyek sendiri. Fase detect dan verify memakainya saat berjalan, dan Anda bisa memuat salah satunya secara langsung kapan saja.

**Ikhtisar**

*Ringkasan katalog interaktif ada di halaman web. Semua spesialisasi bawaan ada di tabel di bawah ini.*

**Cara kerjanya**

## Jalankan sendiri

Untuk memakai spesialisasi secara langsung, minta agen Anda memuatnya dengan `read catalog <name>` dan tulis tugasnya di prompt yang sama. Pengetahuan itu lalu bekerja pada apa yang Anda minta. Cara ini berlaku di prompt apa pun, bahkan yang tidak berkaitan dengan alur **Lagune**.

Misalnya, prompt bebas yang langsung meminta kumpulan **RegExp** yang aman dengan **Python**:

```prompt
Muat spesialisasi regex dengan `npx lagune read catalog regex`, lalu buat kumpulan ekspresi reguler di @src/utils/regex.py untuk memvalidasi email dan nama pengguna.
```

Prompt ini memakai hook deterministik untuk menguji setiap **RegExp** terhadap **ReDoS**, mempertahankan yang aman, lalu menghasilkan sesuatu seperti ini:

```python
import re

EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
USERNAME = re.compile(r"^[a-zA-Z0-9_]{3,20}$")

def is_email(value: str) -> bool:
    return EMAIL.match(value) is not None

def is_username(value: str) -> bool:
    return USERNAME.match(value) is not None
```

**Coba pemeriksa ReDoS**

Uji sendiri sebuah pola di [**devina.io/redos-checker**](https://devina.io/redos-checker).

## Spesialisasi bawaan

Spesialisasi bawaan dikelompokkan ke dalam [**kategori**](https://lagune.ai/id-ID/docs/categories). Berikut kumpulan yang disertakan bersama **Lagune**:

| Spesialisasi          | Kategori                    | Fokus                                                                                         |
| --------------------- | --------------------------- | --------------------------------------------------------------------------------------------- |
| `regex`               | `owasp`                     | **ReDoS:** pola yang meledak pada input yang sengaja dirancang.                               |
| `network`             | `owasp`                     | **SSRF & redirect:** tujuan fetch atau redirect yang diberikan pengguna.                      |
| `interpreter`         | `owasp`, `lovable`          | **Injeksi kode:** `eval`, include dinamis, dispatch berdasarkan nama.                         |
| `sql`                 | `owasp`                     | **Basis data relasional:** injection, pemanggilan ORM mentah, hak akses, jangkauan engine.    |
| `path`                | `owasp`                     | **Path filesystem:** traversal, null byte, stream NTFS, penanaman file.                       |
| `upload`              | `owasp`                     | **Unggahan file:** tipe dan signature, konten berbahaya, penyimpanan, batas.                  |
| `access-control`      | `owasp`, `lovable`          | **Autentikasi, otorisasi, sesi:** IDOR, mass assignment, tenant, sesi.                        |
| `credential-endpoint` | `owasp`, `lovable`          | **Penebakan & bot:** brute force, spraying, stuffing, throttling.                             |
| `federation`          | `owasp`                     | **Kepercayaan token:** OAuth dan OIDC, SAML, validasi JWT, login lewat QR.                    |
| `http-request`        | `owasp`                     | **Asal request:** CSRF, salah konfigurasi CORS, IP klien yang dipalsukan.                     |
| `transport`           | `owasp`                     | **Keamanan kanal:** konfigurasi TLS, HTTPS dan teks polos, HSTS, pinning.                     |
| `crypto`              | `owasp`, `lovable`          | **Kriptografi data tersimpan:** algoritma lemah atau buatan sendiri, CSPRNG, manajemen kunci. |
| `secrets`             | `owasp`, `lovable`          | **Kredensial hardcoded:** kunci, token, dan kata sandi yang ditulis langsung di kode sumber.  |
| `api-endpoint`        | `owasp`                     | **Permukaan non-REST:** GraphQL, gRPC, otorisasi WebSocket, DoS, skema.                       |
| `payment`             | `owasp`, `lovable`          | **Alur checkout:** verifikasi gateway di sisi server, callback bertanda tangan, idempotensi.  |
| `xml`                 | `owasp`                     | **Parsing XML:** XXE, entitas eksternal, ekspansi billion laughs.                             |
| `csv`                 | `owasp`                     | **Formula injection:** sel spreadsheet yang diawali `=`/`+`/`-`/`@`.                          |
| `container`           | `owasp`, `infra`            | **Konfigurasi container:** root, capabilities, mount socket, hardening image.                 |
| `infra`               | `infra`                     | **Infrastruktur sebagai kode:** Terraform, Dockerfile, GitHub Actions.                        |
| `serverless`          | `owasp`, `infra`, `lovable` | **Fungsi FaaS:** IAM dengan hak akses minimum, input event, konteks, secret.                  |
| `llm`                 | `ai`, `lovable`             | **Risiko AI dan LLM:** prompt injection, agency, RAG, MCP, output.                            |
| `supabase`            | `lovable`                   | **Backend Supabase:** RLS nonaktif secara default, policy yang keliru dibuat AI, model kunci. |
| `browser`             | `javascript`, `lovable`     | **Risiko sisi klien:** XSS, CSP, framing, storage, dll.                                       |
| `javascript`          | `javascript`                | **Risiko tingkat bahasa:** RCE, prototype pollution, dll.                                     |
| `python`              | `python`                    | **Risiko tingkat bahasa:** RCE lewat `pickle`, class pollution, `-O`, dll.                    |
| `rust`                | `rust`                      | **Soundness `unsafe`:** UB dari pemanggil yang aman, `transmute`, overflow.                   |
| `java`                | `java`                      | **Deserialisasi & mobile code:** rantai `readObject`, pembajakan objek.                       |
| `ruby`                | `ruby`                      | **Deserialisasi & `open`:** penghidupan ulang lewat `Marshal`/YAML, keanehan pipe.            |
| `php`                 | `php`                       | **Type juggling & `unserialize`:** magic hash, POP chain.                                     |
| `go`                  | `go`                        | **Typed nil & data races:** `nil != nil`, goroutine dengan memori bersama.                    |
| `c-cpp`               | `c-cpp`                     | **Format string:** `printf(user_input)`, write-what-where lewat `%n`.                         |
| `dotnet`              | `dotnet`                    | **Risiko tingkat platform:** RCE lewat `BinaryFormatter`, `@Html.Raw`, celah enum.            |

Sebagian besar pengetahuan bawaan disarikan dari OWASP. Lihat [**Sumber OWASP**](https://lagune.ai/id-ID/docs/references/owasp-sources) untuk pemetaan lengkap setiap spesialisasi ke halaman serangan dan Cheat Sheet OWASP yang menjadi rujukannya. Beberapa modul khusus untuk stack tertentu justru bersumber dari panduan vendornya sendiri: `supabase`, misalnya, berasal dari dokumentasi Supabase dan CVE-2025-48757.

## Spesialisasi milik Anda

Spesialisasi bawaan bertambah dengan satu file pengetahuan dan satu baris indeks, tidak pernah dengan perintah baru. Anda menambahkan spesialisasi sendiri dengan cara yang sama, lewat perintah [`/lagune-specialize`](https://lagune.ai/id-ID/docs/commands/specialize): arahkan ke sebuah artikel atau topik, dan perintah ini menyarikan spesialisasi baru ke proyek Anda, berupa file di `.lagune/catalog/` beserta entrinya di `.lagune/configs.json`. Spesialisasi milik Anda selalu ada di katalog, apa pun kategorinya, dan spesialisasi Anda menggantikan spesialisasi bawaan yang bernama sama.

**Secara internal, Lagune memuat spesialisasi secara otomatis, hanya saat dibutuhkan**

Saat fase detect atau verify menemukan konteks yang dicakup sebuah spesialisasi, fase itu sendiri yang memuat spesialisasi tersebut dengan `read catalog <name>`. Ini terjadi otomatis, sebagai bagian dari fase. Anda tidak perlu melakukannya secara manual agar ini berjalan.

## Lihat apa saja yang tersedia

Untuk menampilkan katalog proyek Anda dari terminal, satu spesialisasi per baris beserta tag-nya:

```bash
npx lagune read catalog
# regex: Regular Expression [required]
# network: Requests, Webhook, URL Fetch, Socket, IMDS, Redirect
# interpreter: Evaluator, Sink, Shell, Dynamic Execution
# ...
```

Spesialisasi bertanda `[required]` selalu berlaku, apa pun pekerjaannya. Spesialisasi bawaan mana saja yang muncul di daftar bergantung pada [**kategori**](https://lagune.ai/id-ID/docs/categories) proyek Anda.

**Spesialisasi tidak dimuat secara default**

Pengetahuan yang relevan dimuat sesuai dengan apa proyek itu sebenarnya, alih-alih menjalankan semua pemeriksaan secara default.

## Pertanyaan yang sering diajukan

### Apa itu spesialisasi Lagune?

Modul pengetahuan keamanan yang terfokus dan tidak bergantung pada bahasa pemrograman, yang dimuat hanya saat dibutuhkan, tidak pernah secara default. Spesialisasi bukan perintah seperti skill agen.

### Apa itu katalog proyek?

Kumpulan spesialisasi yang dipakai proyek: spesialisasi bawaan dari kategorinya, ditambah spesialisasi milik proyek sendiri. Selama belum ada kategori yang dicatat, proyek hanya memakai OWASP.

### Apakah spesialisasi dimuat secara default?

Tidak. Spesialisasi hanya dimuat saat dibutuhkan, sesuai dengan apa proyek itu sebenarnya.

### Bagaimana cara memuat spesialisasi secara langsung?

Di prompt yang sama dengan tugasnya, minta agen Anda menjalankan npx lagune read catalog <name>.
