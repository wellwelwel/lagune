# /lagune-prove: proof of concept khusus pertahanan

> Ubah setiap temuan yang terdeteksi menjadi proof of concept (PoC) khusus pertahanan yang bisa dijalankan, lengkap dengan advisori keamanan untuk pengungkapan yang bertanggung jawab.

Kanonis: https://lagune.ai/id-ID/docs/commands/prove
Bahasa: id-ID
Asli: https://lagune.ai/docs/commands/prove
Terakhir diperbarui: 2026-11-06

🧪 Ubah setiap temuan yang terdeteksi menjadi bukti khusus pertahanan yang bisa dijalankan, untuk pengungkapan yang bertanggung jawab.

Untuk setiap temuan di peta detect, prove menulis advisori keamanan yang berdiri sendiri dan sebuah tes yang memastikan **jalur aman**, sehingga tes gagal selama masalahnya masih ada dan lolos begitu kodenya diperbaiki.

**Tips**

Tes **Lagune** terisolasi di `.lagune/`, terpisah dari rangkaian tes Anda sendiri.

## Cara menggunakan

**Semua temuan**

```prompt
/lagune-prove
```

**Temuan tertentu**

Lihat nama temuan yang sudah dilacak:

```prompt
npx lagune read list --findings

# Findings
#   ...
#   • SQL injection pada pencarian pengguna
#   ...
```

```prompt
# Lalu buktikan salah satunya
/lagune-prove SQL injection pada pencarian pengguna
```

## Cara kerjanya

Prove membaca kode sumber yang ditunjuk setiap temuan, lalu menulis satu direktori untuk setiap temuan yang terbukti di bawah `.lagune/proofs/`, berisi tepat dua file:

| File                            | Isinya                                                                                                                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `report.test.mjs` (atau `.cjs`) | Tesnya. Tes berjalan di Poku jika proyek Anda sudah menggunakannya, dan jika tidak, di test runner bawaan Node.js, jadi tidak perlu menginstal apa pun.     |
| `report.md`                     | Advisori keamanan yang berdiri sendiri: tingkat keparahan, dampak, cara mereproduksinya, dan perintah untuk menjalankannya, bisa dibaca tanpa konteks lain. |

Pembuktiannya selalu dalam JavaScript, jadi tetap portabel apa pun bahasa pemrograman proyek Anda. Indeks `README.md` menautkan setiap pembuktian dan menyediakan satu perintah untuk menjalankan semuanya.

**Tips**

- Prove bersifat **opsional dan mandiri**: bukan salah satu dari lima fase, dan bukan bagian dari rantai pelacakan.
- Prove hanya menulis ke `.lagune/proofs/` dan tidak pernah menyentuh artefak fase atau kode Anda, yang hanya dibacanya.
- Temuan yang tesnya tidak bisa mereproduksi masalah tidak mendapat pembuktian, dan prove meminta Anda menjalankan [`/lagune-detect`](https://lagune.ai/id-ID/docs/commands/detect) di titik itu untuk menyelaraskannya dengan kondisi terkini.
- Menjalankannya lagi akan menyelaraskan pembuktian dengan kondisi terkini: direktori milik temuan yang sudah hilang atau tidak lagi bisa direproduksi akan dihapus.

**Catatan**

**Prove hanya berjalan saat Anda memanggilnya:** agen tidak pernah memulainya atas inisiatif sendiri.

**Bertumpu pada detect**

Prove membaca peta detect dari [`/lagune-detect`](https://lagune.ai/id-ID/docs/commands/detect), jadi jalankan detect terlebih dahulu.

## Khusus pertahanan, dan dengan izin

Sebelum menghasilkan apa pun, prove memastikan Anda berwenang menguji target tersebut, dan menolak setiap permintaan eksploit yang berfungsi, payload serangan, atau cara menghindari deteksi. Pembuktian menunjukkan perilaku yang aman, dan tidak pernah menghasilkan input serangan.

## Dari pembuktian ke pengungkapan

Dua file dari setiap temuan yang terbukti dimasukkan bersama ke dalam **GitHub Gist privat** untuk melaporkan kerentanannya. Keduanya adalah bukti masalah yang masih aktif dan belum diungkapkan, jadi `.gitignore` di dalam `.lagune/proofs/` menjaganya tetap di luar setiap commit: bagikan hanya lewat Gist itu sampai maintainer menyelesaikan masalahnya.

Menutup temuan di rantai **Lagune** tetap menjadi tugas [`/lagune-harden`](https://lagune.ai/id-ID/docs/commands/harden) dan [`/lagune-verify`](https://lagune.ai/id-ID/docs/commands/verify): prove menghasilkan bukti, tidak menutup apa pun.

## Pertanyaan yang sering diajukan

### Apakah Lagune membuat eksploit?

Tidak. /lagune-prove menulis bukti khusus pertahanan: sebuah tes yang memastikan jalur aman, sehingga gagal selama masalahnya masih ada dan lolos begitu kodenya diperbaiki, ditambah advisori keamanan untuk pengungkapan yang bertanggung jawab.

### Apa yang dihasilkan prove?

Dua file per temuan: sebuah tes (report.test.mjs atau .cjs) dan sebuah advisori keamanan (report.md).

### Bagaimana cara mengungkapkan bug yang ditemukan Lagune secara bertanggung jawab?

Prove menulis advisori keamanan yang berdiri sendiri, yang bisa Anda bagikan lewat saluran privat seperti GitHub Gist privat, sesuai prinsip pengungkapan yang bertanggung jawab.
