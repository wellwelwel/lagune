# Migrate: pindahkan proyek Lagune berbasis manifest ke skill dan plugin

> Pindahkan proyek Lagune berbasis manifest ke Lagune berbasis skill, dengan tetap mempertahankan charter, artefak, pelacakan, dan spesialisasi milik Anda sendiri.

Kanonis: https://lagune.ai/id-ID/docs/commands/migrate
Bahasa: id-ID
Asli: https://lagune.ai/docs/commands/migrate
Terakhir diperbarui: 2026-11-06

🔀 Pindahkan proyek **Lagune** berbasis manifest ke **Lagune** berbasis skill, dengan tetap mempertahankan semua yang sudah Anda tulis.

**Pemberitahuan usang**

Proyek dengan manifest tetap berfungsi seperti apa adanya sampai `v1.x`: `npx lagune` meneruskan `init`, `pull`, `update`, `add`, `remove`, `list`, dan dasbor ke `lagune@0.15.0`, versi terakhir yang berbasis manifest.

## Cara migrasi

1. Pastikan pekerjaan Anda saat ini sudah di-commit, lalu jalankan migrate dari root proyek:

   ```bash
   npx lagune migrate
   ```

2. Commit hanya apa yang diubahnya, agar migrasi tetap menjadi satu perubahan yang bisa ditinjau.
3. Instal perintah untuk agen Anda, seperti yang ditunjukkan di [halaman instalasi](https://lagune.ai/id-ID/docs).
4. Jika proyek sudah punya artefak detect, plan, atau harden, minta [`/lagune-repair`](https://lagune.ai/id-ID/docs/commands/repair) untuk menyelaraskan referensi lama di dalamnya dan di spesialisasi milik Anda sendiri:

   ```prompt
   /lagune-repair Selaraskan spesialisasi yang diterapkan (sebelumnya disebut sub-skill) di artefak dalam `.lagune/memory/` (`detect.md`, `plan.md`, dan `harden.md`) dengan nama yang tercantum di katalog baru, lalu tulis ulang setiap panggilan yang dilakukan spesialisasiku sendiri di `.lagune/catalog/` ke hook lama di `.lagune/hooks/` menjadi panggilan ke tool `lagune_read` atau `lagune_write`.
   ```

## Apa yang berubah

| Sebelum                                                                  | Sesudah                                                                                 |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `.lagune/templates/`, `.lagune/hooks/`, dan `.lagune/specializations.md` | Dihapus: setiap skill membawa templatnya sendiri, dan engine menjalankan hook           |
| Salinan spesialisasi bawaan di `.lagune/skills/`                         | Dihapus: engine menyediakan spesialisasi bawaan                                         |
| Spesialisasi milik Anda sendiri di `.lagune/skills/`                     | Dipindahkan ke `.lagune/catalog/`                                                       |
| `.lagune/skills.json`, indeks spesialisasi milik Anda sendiri            | Digabungkan ke `.lagune/configs.json`                                                   |
| Kategori di manifest                                                     | Dicatat di `.lagune/configs.json`                                                       |
| Perintah agen yang lama, seperti `/lagune.detect`                        | Dihapus: [menginstal **Lagune**](https://lagune.ai/id-ID/docs) membawa perintah baru, seperti `/lagune-detect` |
| Blok **Lagune** di `.gitignore`                                          | Dihapus, bersama file-nya jika tidak berisi apa pun lagi                                |
| `.lagune/proofs/`, yang diabaikan oleh blok itu                          | Dijauhkan dari commit oleh `.gitignore` miliknya sendiri                                |
| `.lagune/manifest.json`                                                  | Dihapus, paling akhir                                                                   |

Pekerjaan keamanan Anda tetap seperti semula: charter, artefak yang dihasilkan setiap fase, dan peta pelacakan beserta path yang ditunjuk setiap temuan.

## Pertanyaan yang sering diajukan

### Apakah saya wajib migrasi?

Ya. Proyek berbasis manifest sudah usang dan hanya tetap berfungsi sampai v1.x, jadi jalankan npx lagune migrate untuk memindahkan proyek Anda.

### Apa saja yang dipertahankan migrate?

Charter Anda, setiap artefak fase, peta pelacakan, kategori Anda, dan spesialisasi milik Anda sendiri. Spesialisasi dipindahkan ke .lagune/catalog/, dan indeksnya digabungkan bersama kategori Anda di .lagune/configs.json.

### Kapan saya perlu menginstal perintah baru?

Setelah migrate, seperti yang ditunjukkan halaman instalasi untuk agen Anda. Menginstal lebih dulu juga bisa, karena migrate mempertahankan /lagune yang baru.

### Rekan tim saya sudah migrasi. Apa yang perlu saya jalankan?

Lakukan pull atas perubahan migrasinya, lalu jalankan npx lagune migrate sekali. Perintah ini menghapus sisa Lagune berbasis manifest di clone Anda, yang memang tidak pernah dibawa oleh version control, dan menjauhkan pembuktian Anda dari commit.
