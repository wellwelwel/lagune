# Hook cors: audit origin CORS

> Pindai kode sumber untuk menemukan daftar izin origin CORS yang bisa ditembus, atau nilai apakah satu origin memberi akses yang terlalu longgar, langsung dari command line.

Kanonis: https://lagune.ai/id-ID/docs/hooks/cors
Bahasa: id-ID
Asli: https://lagune.ai/docs/hooks/cors
Terakhir diperbarui: 2026-11-06

Hook `cors` adalah engine deterministik di balik [spesialisasi `http-request`](https://lagune.ai/id-ID/docs/catalog), dan Anda bisa menjalankannya sendiri. Hook ini bekerja dalam dua mode dari satu perintah: **scan**, yang memindai kode sumber untuk menemukan **daftar izin origin yang bisa ditembus** (regex validasi host yang bisa dilewati host milik penyerang), dan **score**, yang menilai satu nilai **origin CORS** sebagai `wildcard`, `null`, atau `safe`.

## Memindai basis kode

Tanpa flag apa pun, hook ini memindai seluruh proyek.

**Seluruh proyek**

```bash
npx lagune read cors
```

**Satu direktori**

```bash
npx lagune read cors --dir src/server
```

**Satu file**

```bash
npx lagune read cors --file internal/auth/origin.go
```

Hook ini mencantumkan setiap daftar izin yang bisa ditembus di bawah satu header, dikelompokkan per file. Validator host yang menempatkan `.+`/`.*` di segmen authority sebelum sufiks host tepercaya (`^https?://.+\.trusted\.com`) meloloskan host penyerang seperti `your-site.com.attacker.com`.

```text
Origin-allowlist patterns with a greedy wildcard (bypassable, review):

internal/auth/origin.go
  ^https?://.+\.trusted\.com
```

Ini adalah petunjuk untuk ditinjau, bukan temuan yang sudah pasti: dari teksnya saja tidak bisa dipastikan apakah regex itu benar-benar menjaga keputusan kepercayaan, jadi pemindaian tidak pernah mengubah kode keluar. Baca masing-masing dan pastikan daftar izinnya membandingkan dengan kesamaan penuh. Jika tidak ada yang ditemukan, hook ini mencetak satu baris.

```bash
npx lagune read cors --dir src/clean
# => no bypassable origin allowlist found
```

## Menilai origin

Berikan setiap origin dengan `--origin`. Hook ini mencetak satu kata per origin dan keluar dengan kode bukan nol jika ada `wildcard` atau `null`.

**Satu origin**

```bash
npx lagune read cors --origin '*'                       # => wildcard
npx lagune read cors --origin 'null'                    # => null
npx lagune read cors --origin 'https://app.example.com' # => safe
```

**Beberapa origin**

Ulangi `--origin` untuk menilai seluruh daftar izin dalam satu panggilan, satu putusan per baris, sesuai urutan.

```bash
npx lagune read cors \
  --origin 'https://app.example.com' \
  --origin '*' \
  --origin 'null'
# => safe
# => wildcard
# => null
```

| Putusan    | Arti                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| `safe`     | Bukan `*`, `null`, atau glob `*`. Tidak menjamin origin-nya berformat benar.                                 |
| `wildcard` | `*`, atau glob subdomain, host, atau port: situs mana pun (atau sekumpulan luas situs) bisa membaca respons. |
| `null`     | Origin `null`, yang bisa dipalsukan oleh iframe dalam sandbox dan redirect.                                  |

Hanya `safe` yang berarti diizinkan, dan `--origin` adalah oracle nilai: ia menilai nilainya, bukan handler-nya, jadi pastikan handler-nya dengan spesialisasi `http-request`.

### Opsi CLI

| Opsi       | Nilai     | Deskripsi                                                                          |
| ---------- | --------- | ---------------------------------------------------------------------------------- |
| `--origin` | origin    | Menilai satu nilai origin. Ulangi untuk menilai beberapa, satu per baris.          |
| `--dir`    | direktori | Membatasi pemindaian ke satu direktori. Bisa diulang dan digabung dengan `--file`. |
| `--file`   | file      | Membatasi pemindaian ke satu file. Bisa diulang dan digabung dengan `--dir`.       |

Tanpa opsi apa pun, hook ini memindai seluruh proyek. `--origin` adalah mode score dan tidak bisa digabung dengan `--dir` atau `--file`.

### Pilih apa yang dipindai

Hook ini melewati apa yang diabaikan **Git**. Untuk melewati lebih banyak, atau untuk memindai apa yang diabaikan **Git**, beri `cors` pengaturannya sendiri:

```bash
npx lagune write add --ignore test/fixtures --checker cors
```

```json
{
  "checkers": {
    "cors": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Konfigurasi hook](https://lagune.ai/id-ID/docs/hooks/configure) membahas semua pengaturannya.

**Yang tidak dicakup**

Pemindaian membaca bentuk **regex yang bisa ditembus**, dan `--origin` menilai **nilai** origin. Dua pola di tingkat kode sumber tetap di luar jangkauan: pemantulan `Origin` dari request (server mengembalikan `Origin` yang masuk, atau memasangkannya dengan kredensial), dan daftar izin longgar berbasis `endsWith` atau substring. Kenali keduanya di kode dan tangani seperti yang dijelaskan [spesialisasi `http-request`](https://lagune.ai/id-ID/docs/catalog).

## Pertanyaan yang sering diajukan

### Kenapa origin CORS null berbahaya?

Iframe dalam sandbox dan sebagian redirect mengirim Origin: null, jadi daftar izin yang memercayai null memberi konteks tersebut akses baca. Hook cors menandainya bersama wildcard.

### Bagaimana cara menemukan daftar izin origin CORS yang bisa ditembus?

Jalankan npx lagune read cors di basis kode Anda. Hook ini menandai regex validasi host yang wildcard serakahnya berada sebelum sufiks tepercaya, sehingga host penyerang seperti your-site.com.attacker.com bisa lolos.
