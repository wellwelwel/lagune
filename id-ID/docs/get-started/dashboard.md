# Dasbor

> Lihat charter, temuan, dan katalog proyek Anda dalam tampilan langsung dan lokal yang terbuka dengan satu perintah.

Kanonis: https://lagune.ai/id-ID/docs/get-started/dashboard
Bahasa: id-ID
Asli: https://lagune.ai/docs/get-started/dashboard
Terakhir diperbarui: 2026-11-06

Jalankan **Lagune** begitu saja, tanpa subperintah, untuk mendapatkan tampilan langsung yang interaktif dari `.lagune/`. **Lagune** menyajikan dasbor dan membukanya di port acak:

```bash
npx lagune
```

- [x] **Live reload**
- [x] **Privat** dan **lokal**
- [x] Menampilkan apa pun isi `.lagune/`, sejak charter pertama
- [x] **Kelola** kategori proyek dan apa yang dipindai hook-nya, langsung dari browser Anda
- [x] Tidak perlu `node_modules` maupun `package.json` 📦

![Charter di dasbor Lagune](https://lagune.ai/img/dashboard/02.webp)

![Temuan di dasbor Lagune](https://lagune.ai/img/dashboard/03.webp)

![Side quest di dasbor Lagune](https://lagune.ai/img/dashboard/04.webp)

![Detail temuan di dasbor Lagune](https://lagune.ai/img/dashboard/05.webp)

![Katalog di dasbor Lagune](https://lagune.ai/img/dashboard/06.webp)

**Tips**

- 🚪 Gunakan `--port` untuk menentukan port kustom.
- ⏏️ Tekan `Ctrl+C` untuk menghentikannya.

## Pertanyaan yang sering diajukan

### Bagaimana cara membuka dasbor Lagune?

Jalankan npx lagune tanpa subperintah di root proyek Anda. Perintah ini menyajikan tampilan langsung dari .lagune/ di port acak dan membukanya di browser Anda.

### Apakah dasbornya privat?

Ya. Dasbor hanya berjalan di komputer Anda sendiri, di alamat lokal yang tidak bisa dijangkau komputer lain.

### Apakah saya bisa mengubah proyek dari dasbor?

Hanya kategorinya dan apa yang dikecualikan oleh hook-nya, dari browser Anda. Selain itu, semua yang ditampilkan dasbor hanya bisa dibaca.
