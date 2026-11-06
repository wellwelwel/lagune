# Kategori

> Kategori spesialisasi yang bisa dipakai proyek Lagune, dari OWASP hingga hardening per bahasa untuk JavaScript, Python, Go, dan Rust, serta cara mengubahnya.

Kanonis: https://lagune.ai/id-ID/docs/categories
Bahasa: id-ID
Asli: https://lagune.ai/docs/categories
Terakhir diperbarui: 2026-11-06

**Lagune** mengelompokkan [**spesialisasi**](https://lagune.ai/id-ID/docs/catalog) bawaannya ke dalam **13 kategori**. Kategori yang dipakai sebuah proyek menentukan spesialisasi bawaan mana yang masuk ke [**katalog**](https://lagune.ai/id-ID/docs/catalog) proyek itu, dan kategori terbagi dua: apa yang dilakukan sistem, dan bahasa yang dipakai untuk menulisnya.

Selama belum ada kategori yang dicatat, proyek hanya memakai `owasp`. Perintah [`/lagune-charter`](https://lagune.ai/id-ID/docs/commands/charter) mencatat setiap kategori yang didukung oleh hasil pembacaannya terhadap proyek, dan Anda bisa mengubahnya sendiri kapan saja.

## Apa yang dilakukan sistem

| Kategori      | Kunci     | Yang diperkuat                                                                                                                                         |
| ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| OWASP         | `owasp`   | Risiko keamanan aplikasi yang dipantau OWASP: injection, kontrol akses yang rusak (Broken Access Control), serta kegagalan autentikasi dan kriptografi |
| Infrastruktur | `infra`   | Konfigurasi container, workload, dan serverless: Dockerfile, Compose, keamanan Pod, IAM dan trigger FaaS                                               |
| AI / LLM      | `ai`      | Integrasi AI dan LLM, terhadap prompt injection serta rangkaian tool, agen, retrieval, dan MCP yang tidak aman                                         |
| Lovable       | `lovable` | Aplikasi Supabase buatan AI (Lovable dan sejenisnya): celah RLS, kunci `service_role` yang bocor, dan default yang tidak aman                          |

## Bahasa yang dipakai sistem

| Kategori   | Kunci        | Yang diperkuat                                                                                                   |
| ---------- | ------------ | ---------------------------------------------------------------------------------------------------------------- |
| JavaScript | `javascript` | RCE lewat `eval` dan `child_process`, path traversal, dan prototype pollution, di semua runtime-nya              |
| Python     | `python`     | RCE lewat deserialisasi `pickle` dan YAML, traversal string lewat `str.format`, dan class pollution              |
| Rust       | `rust`       | API `unsafe` yang tidak sound, penyalahgunaan `transmute`, integer overflow, dan undefined behavior di batas FFI |
| C / C++    | `c-cpp`      | Bug format string, buffer overflow, dan penulisan di luar batas yang membuka jalan eksekusi kode                 |
| PHP        | `php`        | Bypass autentikasi lewat type juggling, gadget chain object injection, dan konfigurasi default yang tidak aman   |
| Go         | `go`         | Bug interface typed nil, data races antar-goroutine, dan konkurensi yang tidak aman di jalur keamanan            |
| Java       | `java`       | Gadget chain deserialisasi `ObjectInputStream` yang berujung pada eksekusi kode jarak jauh                       |
| Ruby       | `ruby`       | Gadget chain deserialisasi `Marshal.load` dan YAML yang mencapai eksekusi kode jarak jauh                        |
| .NET / C#  | `dotnet`     | RCE lewat deserialisasi `BinaryFormatter` dan bypass encoder yang berujung pada XSS                              |

**Tips**

**Lagune** tidak bergantung pada bahasa pemrograman: seluruh alurnya membaca proyek Anda apa pun bahasanya, dan kategori ini hanya menambah kedalaman pada jebakan yang khas untuk satu bahasa.

## Tambah dan hapus kapan saja

Kategori adalah titik awal, bukan komitmen. Pakai yang cocok untuk proyek saat ini dan ubah kapan saja berdasarkan kuncinya, dengan `write add` dan `write remove`. Di terminal, `--categories` tanpa nilai membuka pemilih interaktif (spasi untuk memilih atau membatalkan pilihan, enter untuk konfirmasi, kosongkan untuk melewati). Di luar terminal, tulis kategorinya setelah opsi itu.

**Tambah**

```bash
npx lagune write add --categories # interactive
npx lagune write add --categories owasp
npx lagune write add --categories owasp rust
```

**Hapus**

```bash
npx lagune write remove --categories # interactive
npx lagune write remove --categories owasp
npx lagune write remove --categories owasp rust
```

Perintah `write add` atau `write remove` yang pertama berangkat dari `owasp`, jadi menghapus semua kategori menghasilkan daftar kosong, bukan kembali ke default. Setiap perubahan tersimpan di `.lagune/configs.json`, sehingga seluruh tim bekerja dengan kumpulan yang sama.

## Lihat kategori yang dipakai proyek

Perintah `read list --categories` menampilkan semua kategori dan apakah proyek memakainya:

```bash
npx lagune read list --categories
# Categories
#   • owasp       [used]       Harden against the application security risks OWASP tracks
#   • javascript  [available]  Harden JavaScript and its runtimes
#   • php         [available]  Harden PHP against type-juggling auth bypass
#   • go          [available]  Harden Go against typed-nil interface bugs
#   ...
#
# No category is recorded yet, so this project uses the default: owasp.
```

Lihat [**Katalog**](https://lagune.ai/id-ID/docs/catalog) untuk mengetahui spesialisasi apa saja yang dibawa setiap kategori. Spesialisasi milik Anda sendiri, yang ditulis dengan [`/lagune-specialize`](https://lagune.ai/id-ID/docs/commands/specialize), masuk ke katalog apa pun kategorinya.

## Pertanyaan yang sering diajukan

### Bagaimana cara menambahkan kategori?

Berikan kunci kategori ke --categories, misalnya npx lagune write add --categories javascript. Selama belum ada kategori yang dicatat, fase charter juga mencatat kategori yang didukung oleh hasil pembacaannya terhadap proyek.

### Apakah saya bisa memakai lebih dari satu kategori?

Ya. Tulis semuanya di baris yang sama, satu setelah yang lain.

### Kategori apa yang sebaiknya dipakai sebuah proyek?

Mulai dengan owasp, kategori default, lalu tambahkan kategori untuk bahasa atau stack Anda. Spesialisasi hanya dimuat saat dibutuhkan, jadi sebuah kategori tidak membebani apa pun sampai ada fase yang membutuhkan salah satu spesialisasinya.
