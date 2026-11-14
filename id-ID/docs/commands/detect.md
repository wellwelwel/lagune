# /lagune-detect: petakan sistem Anda dan risikonya

> Halaman ini tertinggal dari versi bahasa Inggrisnya. [Baca versi aslinya](https://lagune.ai/docs/commands/detect).

> Baca kode Anda lalu petakan apa yang dilakukan sistem Anda dan di mana letak risikonya.

Kanonis: https://lagune.ai/id-ID/docs/commands/detect
Bahasa: id-ID
Asli: https://lagune.ai/docs/commands/detect
Terakhir diperbarui: 2026-11-06

🔬 Ketahui apa yang sebenarnya dilakukan sistem Anda dan di mana letak risikonya.

Detect membaca kode dan hanya mencatat apa yang benar-benar ditemukannya, beserta bukti yang dibutuhkan fase berikutnya. Prinsip utamanya adalah mendeteksi, bukan mengarang.

## Cara menggunakan

**Pemindaian penuh**

```prompt
/lagune-detect
```

**Tunjuk path**

```prompt
/lagune-detect src/routes/ src/auth.ts
```

**Jelaskan kekhawatiran**

```prompt
/lagune-detect pastikan data pelanggan tidak pernah terekspos
```

## Apa yang dipetakannya

**Lagune** membaca kode dan memetakan apa yang ditemukannya. Setiap temuan memuat apa temuan itu, mengapa penting, dan buktinya. Contohnya:

- **Unggahan file**, sistem menerima file dari pengguna:
  - _Mengapa penting:_ file yang menyamar sebagai gambar bisa menyembunyikan kode berbahaya.
  - _Bukti:_ handler `POST /upload` memercayai MIME type yang dikirim klien, tanpa memeriksa jenis asli file tersebut.
- **Login dan sesi**, pengguna masuk untuk mengakses akun mereka:
  - _Mengapa penting:_ penanganan sesi yang lemah memungkinkan sebuah akun diambil alih oleh akun lain.
  - _Bukti:_ logika penerbitan sesi, tempat sesi diterbitkan tanpa batas waktu kedaluwarsa.

Sambil berjalan, detect memberi putusan terhadap kode untuk setiap spesialisasi di [katalog](https://lagune.ai/id-ID/docs/catalog) proyek Anda, menerapkan spesialisasi yang konteksnya ada, lalu mencatatnya di bawah **Applied specializations**, daftar yang dipakai ulang oleh harden dan verify.

Dari situ, Anda memiliki peta yang jelas tentang apa yang dilakukan sistem Anda dan di mana letak risikonya, siap ditindaklanjuti di langkah berikutnya.

**Tips**

- Menjalankannya lagi akan memperbarui peta: temuan yang sudah selesai hilang, temuan baru masuk.
- Peta detect ada di `.lagune/memory/detect.md`.

## Selanjutnya

Ubah peta menjadi rencana: [`/lagune-plan`](https://lagune.ai/id-ID/docs/commands/plan).

## Pertanyaan yang sering diajukan

### Apa fungsi /lagune-detect?

Perintah ini membaca kode Anda dan memetakan apa yang dilakukan sistem Anda dan di mana letak risikonya, dengan hanya mencatat apa yang benar-benar ditemukannya. Prinsipnya adalah mendeteksi, bukan mengarang.

### Apa itu temuan di Lagune?

Temuan adalah satu risiko yang terdeteksi, yang memuat apa risiko itu, mengapa penting, dan buktinya di kode. Temuan adalah unit yang dilacak dan dibawa terus oleh plan, harden, dan verify.

### Di mana peta detect disimpan?

Di .lagune/memory/detect.md.

### Spesialisasi mana yang digunakan detect?

Setiap spesialisasi di katalog proyek Anda mendapat putusan terhadap kode. Detect menerapkan spesialisasi yang konteksnya ada dan mencatatnya di bawah Applied specializations.
