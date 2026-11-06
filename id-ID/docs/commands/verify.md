# /lagune-verify: buktikan kontrol keamanan tetap efektif

> Buktikan bahwa setiap perbaikan yang diterapkan tetap efektif, lalu tuntaskan perbaikan yang lolos.

Kanonis: https://lagune.ai/id-ID/docs/commands/verify
Bahasa: id-ID
Asli: https://lagune.ai/docs/commands/verify
Terakhir diperbarui: 2026-11-06

⚖️ Buktikan bahwa setiap perbaikan yang diterapkan tetap efektif, dengan membaca kode dan mencocokkannya dengan apa yang dicatat harden, lalu tuntaskan perbaikan yang lolos.

## Cara menggunakan

**Verifikasi semuanya**

```prompt
/lagune-verify
```

**Tunjuk path**

```prompt
/lagune-verify src/routes/upload.ts
```

**Berdasarkan prioritas**

```prompt
/lagune-verify hanya yang prioritasnya kritis dan tinggi
```

## Cara kerjanya

Verify membaca kode di setiap titik yang dicatat harden dan memastikan kode itu benar-benar sesuai dengan klaimnya. Pembuktiannya adalah pencocokan itu, kode dibandingkan dengan catatan. Setiap kontrol mendapat salah satu dari tiga putusan:

| Putusan                      | Arti                                                              |
| ---------------------------- | ----------------------------------------------------------------- |
| ✅ Risk closed               | Kode melakukan persis seperti yang diklaim catatan.               |
| ❌ Risk not closed           | Kontrol masih terbuka. Verify mengarahkan Anda kembali ke harden. |
| ❓ Cannot tell from the code | Buktinya tidak terlihat dari kode saja.                           |

Risiko yang terbukti tuntas kemudian ditutup dari seluruh rantai, dengan konfirmasi Anda. Contohnya:

- **Unggahan file** (Putusan: **✅ Risk closed**)
  - _Cara pembuktian:_ membaca handler unggahan dan melihat bahwa handler itu mendeteksi jenis asli file dari isinya, menerapkan batas ukuran, dan menolak selain itu, persis seperti yang diklaim catatan.
  - _Bukti:_ fungsi `handleUpload`, yang mendeteksi jenis asli file dari isinya.

Jika risikonya belum tertutup, verify menyatakannya dengan jelas dan mengarahkan Anda kembali ke [`/lagune-harden`](https://lagune.ai/id-ID/docs/commands/harden), karena perbaikannya masih terbuka.

**Tips**

- Verify sepenuhnya bertumpu pada catatan hardening.
- Verify hanya membaca kode Anda untuk menilainya, dan tidak pernah melemahkan kontrol keamanan atau menulis ulang kode agar sebuah putusan lolos.
- Menjalankannya lagi akan menyelaraskan putusan dengan kondisi terkini: putusan yang usang hilang, dan risiko yang tidak lagi tertutup ditandai kembali.
- Saat sebuah risiko terbukti tertutup, verify bertanya sekali, lalu menghapus temuan itu dari seluruh rantai (detect, plan, harden, dan pelacakan).
- Verify tidak menulis laporan sendiri: setiap putusan berada di blok kontrolnya di `.lagune/memory/harden.md`, tempat harden membacanya pada run berikutnya.

**Bergantung pada harden**

Verify bertumpu pada [`/lagune-harden`](https://lagune.ai/id-ID/docs/commands/harden).

## Siklus pun tuntas

Saat semua yang ada dalam cakupan sudah ditutup, siklus pun tuntas. Siklus hanya terbuka kembali saat kode berubah. Keamanan bisa dituntaskan, jadi alurnya punya titik akhir, bukan putaran tanpa ujung.

## Pertanyaan yang sering diajukan

### Bagaimana Lagune memverifikasi sebuah perbaikan?

/lagune-verify membaca kode dan mencocokkannya dengan apa yang dicatat harden, lalu memberikan salah satu dari tiga putusan: Risk closed (risiko tertutup), Risk not closed (risiko belum tertutup), atau Cannot tell from the code (tidak bisa dipastikan dari kode).

### Apa artinya menutup sebuah temuan?

Saat verify membuktikan sebuah risiko tertutup, temuannya ditutup: dihapus dari seluruh rantai, dengan konfirmasi Anda, sehingga tidak diproses ulang.

### Apakah pekerjaan keamanan bisa benar-benar selesai?

Bisa. SDH bisa dituntaskan: temuan yang terbukti tuntas akan ditutup, jadi alurnya punya titik akhir, bukan putaran tanpa ujung.
