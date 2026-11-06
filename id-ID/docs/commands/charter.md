# /lagune-charter: tetapkan prinsip keamanan Anda

> Tetapkan prinsip keamanan proyek Anda, aturan yang dipatuhi semua fase berikutnya, dan catat kategori spesialisasi yang didukung oleh hasil pembacaan proyek.

Kanonis: https://lagune.ai/id-ID/docs/commands/charter
Bahasa: id-ID
Asli: https://lagune.ai/docs/commands/charter
Terakhir diperbarui: 2026-11-06

🧬 Ceritakan kepada **Lagune** proyek Anda itu apa, lalu **Lagune** mengubahnya menjadi aturan keamanan Anda (atau, tanpa deskripsi, menyusunnya hanya dari proyek itu sendiri).

Charter adalah lapisan yang mengarahkan semua fase: sekumpulan prinsip yang mengutamakan keamanan dan wajib dipatuhi setiap fase berikutnya. Anggap saja sebagai pemeriksaan saat kompilasi untuk postur keamanan proyek Anda.

## Cara menggunakan

**Deskripsikan proyek**

```prompt
/lagune-charter Proyekku adalah toko online yang menjual video game. Pelanggan menambahkan produk ke keranjang dan membayar dengan kartu kredit atau transfer bank. Mereka bisa melihat pesanan mereka dan status setiap pesanan.
```

**Biarkan Lagune mengusulkan**

```prompt
/lagune-charter
```

> _Saya melihat pustaka pembayaran, pengaturan login, dan model pesanan yang terhubung ke pelanggan. Ini tampaknya toko online yang menjual sesuatu. Pelanggan membayar dan memantau pesanan mereka sendiri..._ ☁️

## Apa yang disimpulkannya

**Lagune** menjadikan deskripsi atau **PRD** Anda sebagai arah, menyimpulkan dampaknya bagi keamanan, lalu membaca proyek untuk melangkah lebih jauh dari yang Anda sebutkan. Contohnya:

- Keranjang yang menyimpan pesanan berarti ada **basis data**:
  - misalnya, `"Di mana data disimpan?"`, `"Siapa yang bisa mengaksesnya?"`, `"Apakah datanya bocor?"`.
- Pelanggan yang bisa melihat pesanan mereka sendiri berarti ada semacam **login atau kontrol akses**:
  - misalnya, `"Bisakah seorang pelanggan mengakses pesanan pelanggan lain?"`, `"Apakah sesi terlindungi?"`.
- Menerima pembayaran dengan kartu dan transfer bank berarti **ada uang dan data sensitif yang terlibat**:
  - misalnya, `"Apakah data kartu disimpan?"`, `"Apakah pembayaran diverifikasi?"`.

Deskripsi Anda dan proyek saling melengkapi: deskripsi menetapkan tujuan, sementara pembacaan dependensi, README, dan konfigurasi mengungkap hal yang tidak Anda sebutkan. Jika ada hal penting yang masih belum jelas, **Lagune** mengajukan pertanyaan singkat dan sederhana alih-alih menebak.

Dari situ, **Lagune** menyusun aturan keamanan yang disesuaikan dengan proyek, yang bisa Anda tinjau dan ubah kapan pun diperlukan.

**Manfaatkan sepenuhnya**

- Anda juga bisa menetapkan aturan keamanan sendiri untuk proyek.
- Makin banyak detail relevan yang Anda berikan, makin baik laporan akhirnya:
  - Jelaskan proyeknya, cara kerjanya, dan apa yang terjadi di baliknya.
  - Siapa pengguna akhirnya? Apa yang boleh dilakukan pengguna, dan apa yang tidak?
  - Detail perilaku sama berharganya dengan detail teknis.
- Memori charter ada di `.lagune/memory/charter.md`.

## Kategori yang dicatatnya

Spesialisasi, yaitu pengetahuan keamanan yang dimuat fase berikutnya hanya saat dibutuhkan, masuk ke [katalog](https://lagune.ai/id-ID/docs/catalog) proyek Anda per [kategori](https://lagune.ai/id-ID/docs/categories). Selama proyek Anda belum mencatat kategori apa pun, charter mencatat setiap kategori yang didukung oleh hasil pembacaannya, seperti bahasa pemrograman proyek, pemanggilan LLM, atau container, lalu menyebutkannya dalam ringkasan.

Setelah kategori tercatat, charter membiarkannya apa adanya dan hanya menyebutkan kategori yang belum digunakan proyek Anda. Anda bisa mengubahnya sendiri kapan saja:

```bash
npx lagune write add --categories python
npx lagune write remove --categories python
```

## Folder yang ditawarkannya untuk dikecualikan

Saat pembacaan charter menemukan folder yang di-commit tetapi bukan kode proyek Anda yang perlu dilindungi, seperti fixture tes yang sengaja ditulis agar tampak rentan, charter mencantumkannya dengan nomor di akhir ringkasannya. Charter tidak pernah mengecualikan folder atas inisiatif sendiri, karena repositori yang berniat jahat bisa membuat kodenya tampak seperti fixture, jadi hanya nomor yang Anda sebutkan dalam balasan yang dicatat. [Konfigurasi hook](https://lagune.ai/id-ID/docs/hooks/configure) menjelaskan cara mengubahnya sendiri.

## Selanjutnya

Setelah aturan ditetapkan, petakan apa yang benar-benar dilakukan sistem Anda: [`/lagune-detect`](https://lagune.ai/id-ID/docs/commands/detect).

## Pertanyaan yang sering diajukan

### Apa itu charter di Lagune?

Charter adalah lapisan Lagune yang mengarahkan semua fase, sekumpulan prinsip yang mengutamakan keamanan dan wajib dipatuhi setiap fase berikutnya. Anggap saja sebagai pemeriksaan saat kompilasi untuk postur keamanan proyek Anda.

### Di mana charter disimpan?

Di .lagune/memory/charter.md.

### Apakah saya bisa menulis aturan charter sendiri?

Bisa. Lagune mengusulkan aturan dari deskripsi dan kode Anda, dan Anda bisa mengubah kata-katanya, menghapusnya, menambahkannya, atau mempersempit cakupannya.

### Apakah charter memilihkan kategori spesialisasi untuk saya?

Hanya selama belum ada kategori yang tercatat. Charter kemudian mencatat setiap kategori yang didukung oleh hasil pembacaannya, seperti bahasa pemrograman Anda atau pemanggilan LLM. Setelah kategori tercatat, charter tidak pernah mengubahnya.
