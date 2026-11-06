# Hook cvss: hitung skor vektor CVSS v4.0

> Hitung skor satu atau beberapa vektor CVSS v4.0 dari command line, dengan aritmetika yang sama seperti kalkulator FIRST, dan baca penjelasan tiap vektor dalam bahasa sederhana.

Kanonis: https://lagune.ai/id-ID/docs/hooks/cvss
Bahasa: id-ID
Asli: https://lagune.ai/docs/hooks/cvss
Terakhir diperbarui: 2026-11-06

Hook `cvss` menghitung skor **vektor CVSS v4.0** lalu mencetak skor dan tingkat keparahannya, yaitu penilaian yang ditulis perintah [`/lagune-plan`](https://lagune.ai/id-ID/docs/commands/plan) di setiap perbaikan dan perintah [`/lagune-prove`](https://lagune.ai/id-ID/docs/commands/prove) di setiap advisori keamanan. Hook ini adalah engine deterministik di balik penilaian tersebut, dengan aritmetika yang sama seperti [kalkulator FIRST](https://www.first.org/cvss/calculator/4.0), dan Anda bisa menjalankannya sendiri.

## Menjalankan

Berikan setiap vektor dengan `--vector`. Hook ini mencetak satu baris per vektor: skor dan tingkat keparahannya.

**Satu vektor**

```bash
npx lagune read cvss --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N'
# => 9.3, Critical
```

**Beberapa vektor**

Ulangi `--vector` untuk menghitung beberapa sekaligus, satu baris untuk masing-masing, sesuai urutan.

```bash
npx lagune read cvss \
  --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N' \
  --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A'
# => 9.3, Critical
# => 8.7, High
```

**Dalam bahasa sederhana**

Tambahkan `--explain` untuk membaca penjelasan setiap metrik dalam bahasa sederhana. Jika metrik Threat atau Environmental mengubah skornya, skor Base saja ditampilkan lebih dulu.

```bash
npx lagune read cvss --explain --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A'
# => 8.7, High
# =>   Base metrics alone: 9.3, Critical
# =>   Attack Vector: Network, modified to Adjacent
# =>   Attack Complexity: Low
# =>   ...
```

## Cara membaca hasilnya

| Tingkat    | Skor            |
| ---------- | --------------- |
| `None`     | 0.0             |
| `Low`      | 0.1 sampai 3.9  |
| `Medium`   | 4.0 sampai 6.9  |
| `High`     | 7.0 sampai 8.9  |
| `Critical` | 9.0 sampai 10.0 |

Vektor yang hanya berisi metrik Base menilai celahnya sendiri dengan asumsi terburuk: setiap kebutuhan keamanan bernilai High dan celahnya sudah dieksploitasi di dunia nyata. Metrik Environmental (`MAV` dan metrik modifikasi lainnya, ditambah `CR`, `IR`, dan `AR`) menyesuaikan skornya untuk satu deployment tertentu, dan metrik Threat (`E`) menyesuaikannya dengan apa yang diketahui tentang eksploitasinya.

Vektor yang tidak valid mencetak `invalid vector:` beserta letak kesalahannya, dan hook ini keluar dengan kode bukan nol.

### Opsi CLI

| Opsi        | Nilai             | Deskripsi                                                                                            |
| ----------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| `--vector`  | vektor `CVSS:4.0` | Menghitung skor satu vektor. Ulangi untuk menghitung beberapa, satu baris per vektor, sesuai urutan. |
| `--explain` |                   | Menambahkan penjelasan setiap metrik dalam bahasa sederhana di bawah setiap baris penilaian.         |

Minimal satu `--vector` wajib diberikan. Vektor tidak pernah diberikan sebagai argumen posisional polos, jadi tidak bisa dikira sebuah flag.

**Kenapa nilai flag**

Setiap vektor diberikan sebagai nilai flag, tidak pernah disisipkan ke dalam perintah. Nilai yang berisi tanda kutip atau backtick tetap tidak berbahaya dan tidak bisa melakukan injeksi ke shell. Selalu apit vektornya dengan tanda kutip tunggal agar shell Anda tidak mengekspansinya lebih dulu.

**Yang tidak dicakup**

Hanya CVSS v4.0: vektor v2.0, v3.0, atau v3.1 ditolak alih-alih dihitung, karena **Lagune** memberi skor setiap temuan dalam v4.0.

**Tips**

Validasi di fase plan menjalankan ulang aritmetika yang sama di setiap baris CVSS, jadi skor yang menyimpang dari vektornya ketahuan sebelum rencana diterima.

## Pertanyaan yang sering diajukan

### Bagaimana Lagune menghitung skor CVSS?

Hook cvss mengikuti kalkulator referensi FIRST untuk CVSS v4.0, jadi skor sebuah vektor sama persis dengan skornya di situs FIRST.

### Apakah saya bisa menghitung skor vektor CVSS v3.1 dengannya?

Tidak. Lagune memberi skor setiap temuan dalam CVSS v4.0, dan hook ini menolak versi lain alih-alih menghitungnya.

### Apa fungsi flag --explain?

Flag ini menjelaskan setiap metrik dalam bahasa sederhana dan menampilkan skor Base di samping skor keseluruhan, sehingga siapa pun bisa melihat apa arti vektornya dan bagaimana konteks proyek mengubahnya.
