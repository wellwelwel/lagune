# Lagune vs. Deepsec: perbandingan dua pendekatan keamanan berbasis AI

> Referensi yang membandingkan Lagune dan Deepsec dari Vercel dari sisi cara kerja, siklus hidup, deteksi, biaya, temuan, dan penutupan.

Kanonis: https://lagune.ai/id-ID/docs/references/deepsec
Bahasa: id-ID
Asli: https://lagune.ai/docs/references/deepsec
Terakhir diperbarui: 2026-11-06

[Lagune](https://github.com/wellwelwel/lagune) dan [Deepsec](https://github.com/vercel-labs/deepsec) (`v2.2.1`) adalah dua jawaban defensif untuk masalah yang sama: keamanan di era pengembangan yang dibantu AI. Premis keduanya, awal, tengah, dan akhirnya, serta cara masing-masing tampil di hadapan pengguna sengaja dibuat berbeda, bahkan ketika mekanismenya beririsan.

**Tips**

Apakah Lagune terinspirasi dari Deepsec? Tidak. Lagune ditulis dari nol dan terinspirasi dari Spec-Driven Development dan Security Hardening. Kedua proyek dikembangkan secara terpisah, dan perbandingan ini ada untuk membantu pengguna memahami perbedaan keduanya.

## Sekilas

| Aspek           | Lagune                                                                                                                      | Deepsec                                                                        |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Jenis           | Metodologi (SDH) dengan implementasi referensi                                                                              | Produk: pemindai kerentanan bertenaga agen                                     |
| Pusat gravitasi | Prinsip keamanan dan pengetahuan yang dimuat hanya saat dibutuhkan mengarahkan agen, dengan pijakan hook deterministik      | Jaring regex yang lebar memasok investigasi AI yang wajib                      |
| Hasilnya        | Kode yang diperkuat, pembuktian, dan rantai temuan yang dilacak                                                             | Laporan temuan yang sudah ditriase dan diurutkan menurut tingkat keparahan     |
| Menyentuh kode  | Ya: `harden` mengubah kode Anda                                                                                             | Tidak: hanya analisis statis, menghasilkan temuan dan teks rekomendasi         |
| Runtime         | Berjalan di agen dan model yang sudah Anda pakai, di tingkat apa pun                                                        | Menjalankan pipeline model sendiri, secara bawaan memakai model kelas frontier |
| Memulai         | Satu kali instal plugin atau `npx skills add`, lalu arahkan dengan bahasa sehari-hari, tanpa tool baru yang perlu disiapkan | Siapkan workspace `.deepsec/`, instal dependensi, dan tambahkan kunci model    |

## Cara kerjanya

Lagune mengutamakan agen (agent-first): agen yang memegang kendali, memuat pengetahuan hanya saat dibutuhkan sesuai jenis kodenya, dan menyerahkan bagian yang bisa diputuskan secara pasti ke hook deterministik.

Deepsec mengutamakan determinisme (deterministic-first): pemindaian yang lebar menandai kandidat, lalu kandidat itu menunjukkan kepada model wajib apa yang perlu diselidiki dan dinilai.

| Aspek               | Lagune                                                                                                     | Deepsec                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Urutan              | Prinsip keamanan dan pengetahuan yang cocok mengarahkan agen, yang menyerahkan ke hook dan menilai sisanya | Matcher menandai kandidat, model menyelidiki dan menilai satu per satu |
| Peran deterministik | Hook multibahasa yang mengembalikan putusan atau mengarahkan agen, dipadukan dengan pengetahuan kategori   | Matcher yang menandai kandidat untuk dinilai model wajib               |
| Alur pengembangan   | `/lagune` membangun dengan aman langsung saat Anda menulis kode                                            | Meninjau kode, tidak menulisnya                                        |
| Alur audit          | `charter` → `detect` → `plan` → `harden` → `verify`                                                        | `scan` → `process` → `triage` → `revalidate` → `report`                |
| Tugas AI            | Bernalar dari pengetahuan, menerapkan perbaikan, dan membuktikan perbaikan itu bertahan                    | Menyelidiki setiap kandidat dan melaporkan temuan                      |

## Siklus hidup

Lagune bekerja sebelum, selama, dan setelah kode ditulis. Deepsec meninjau repositori setelah kodenya ada.

| Momen                    | Lagune                                                                                      | Deepsec                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Sebelum kode ada         | `charter` menyusun kebijakan keamanan dari tujuan yang dinyatakan                           | Berangkat dari kode yang sudah ada: `init` membutuhkan direktori         |
| Saat membangun           | `/lagune` membangun dengan aman secara bawaan, langsung di alur, tanpa meninggalkan artefak | Meninjau setelah membangun, bukan selama prosesnya                       |
| Pada kode yang sudah ada | `detect` → `plan` → `harden` → `verify`                                                     | `scan` → `process`, alur intinya                                         |
| Peninjauan berkelanjutan | Jalankan ulang fase per cakupan, tanpa gerbang CI siap pakai                                | Pemindaian ulang inkremental, `process --diff` sebagai gerbang keluar CI |

## Lapisan deteksi

Kedua lapisan deterministik itu berlawanan sifatnya: yang satu memutuskan, yang lain menandai.

| Aspek         | Lagune                                                                   | Deepsec                                                              |
| ------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Pengelompokan | Hook dan spesialisasi, dikelompokkan dalam kategori                      | Matcher per pola atau framework                                      |
| Output        | Putusan literal (finding / review / advisory) ditambah label klasifikasi | Kandidat tanpa putusan (slug, baris, potongan kode, pola yang cocok) |
| Penyetelan    | Presisi: peka komentar, dengan pengaman placeholder dan jendela          | Recall: jaring lebar, AI memangkas positif palsu sesudahnya          |
| Kedalaman     | Lebih dalam pada kelas yang dicakup keduanya                             | Lebih luas, kurang dalam pada kelas yang dicakup keduanya            |
| Positif palsu | Ditekan sejak sumbernya, lalu dinilai sesuai konteks                     | Sengaja dihasilkan berlebih, lalu dikurangi lewat tahap `revalidate` |

## Pengetahuan dan penilaian

Keduanya membawa pengetahuan keamanan yang tidak bisa dijangkau regex. Bedanya ada pada tempat pengetahuan itu berada dan siapa yang bisa membentuknya.

| Aspek              | Lagune                                                                  | Deepsec                                                                                |
| ------------------ | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Bentuk             | Modul markdown yang bisa diedit, beberapa didukung hook deterministik   | Prompt singkat dan sorotan per teknologi, bersandar pada pengetahuan model itu sendiri |
| Pemilihan          | Dicocokkan dengan kode, dimuat hanya saat konteksnya ada                | Disisipkan ke setiap batch AI, ditambah sorotan untuk teknologi yang terdeteksi        |
| Siapa yang menulis | Pengguna mengedit modul dan menambah modul baru dengan `specialize`     | Maintainer memegang prompt, pengguna mengisi `INFO.md`                                 |
| Letak penilaian    | Hook memutuskan lapisan dasarnya, agen menilai sisanya dari pengetahuan | Terpusat: satu prosesor AI menilai setiap kandidat                                     |
| Pemakaian ulang    | Satu modul memandu `detect` sekaligus `verify`                          | Satu prompt menggerakkan satu-satunya tahap `process`                                  |

## Temuan dan penutupan

Perbedaan terbesar keduanya ada pada nasib sebuah temuan setelah diselesaikan.

| Aspek             | Lagune                                                                                          | Deepsec                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Tingkat keparahan | Skor CVSS v4.0, disesuaikan dengan eksposur dan taruhannya                                      | Tingkat keparahan dari AI, ditambah triase P0 / P1 / P2 atas kemungkinan eksploitasi dan dampaknya |
| Putusan           | Risk closed, Risk not closed, atau Cannot tell from the code                                    | true-positive, false-positive, fixed, uncertain, accepted-risk, duplicate                          |
| Persistensi       | Rantai kerja diselaraskan dengan kondisi terkini, temuan yang ditutup disarikan menjadi riwayat | Catatan per file yang hanya terus ditambah, tidak ada yang dihapus                                 |
| Kondisi akhir     | Bisa dituntaskan: temuan yang terbukti ditutup, dan siklus pun tuntas                           | Setiap temuan disimpan selamanya, disembunyikan dari tampilan setelah diselesaikan                 |
| Detail riwayat    | Ringkasan singkat tentang risikonya                                                             | Jejak putusan lengkap, termasuk cara perbaikannya                                                  |

## Biaya

| Aspek                       | Lagune                                                                                                                                                             | Deepsec                                                                                                                                                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lapisan dasar deterministik | Gratis: hook berjalan tanpa AI dan tanpa kunci, dan sudah menghasilkan putusan                                                                                     | Gratis: `scan` berjalan tanpa AI, tetapi tidak menghasilkan putusan sendiri                                                                                                                                                                           |
| Tagihan umum                | Sudah termasuk dalam agen yang Anda jalankan, bisa $0 dengan model lokal, sesuai harga paket yang sudah Anda pakai, atau per iterasi untuk penggunaan berbasis API | [Kira-kira $25 hingga $1.200 per eksekusi untuk 100 hingga 2.000 file, dan lebih besar lagi dalam skala besar](https://github.com/vercel-labs/deepsec/blob/f75a16803ec5250938bacfe41571d929e8564f45/docs/getting-started.md#run-the-ai-investigation) |
| Jalur termurah              | Model apa pun, termasuk model lokal gratis, bisa menuntaskan siklus                                                                                                | Ada tier berbayar yang lebih murah, tetapi temuan tetap memerlukan tahap AI berbayar                                                                                                                                                                  |

## Ekstensibilitas dan tata kelola

Masing-masing membuka lapisan yang ditutup oleh yang lain.

| Aspek                     | Lagune                                                  | Deepsec                                                 |
| ------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| Yang bisa Anda perluas    | Edit modul, atau tambahkan yang baru lewat `specialize` | Tambahkan matcher, agen, notifier, dan kepemilikan      |
| Lapisan kebijakan         | Prinsip keamanan mengatur setiap fase dan diberi versi  | Konfigurasi bersifat operasional (matcher, model, path) |
| Override berdasarkan nama | Modul yang disempurnakan menggantikan modul bawaan      | Saat slug matcher bentrok, matcher Anda yang menang     |

## Antarmuka

Deepsec menghasilkan deliverable untuk organisasi keamanan. Lagune menampilkan tampilan langsung bagi siapa pun yang menjalankannya.

| Aspek                        | Lagune                                                                            | Deepsec                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Antarmuka untuk manusia      | Dasbor lokal langsung untuk seluruh rantai, dalam bahasa sehari-hari              | File laporan, ekspor, metrik, dan komentar PR, ditambah situs dokumentasi                 |
| Akuntabilitas                | Menunjukkan file dan spesialisasi yang diterapkan                                 | Mengarahkan ke penanggung jawab yang disarankan: petugas on-call, manajer, atau committer |
| Pembuktian yang bisa diulang | `prove` menulis tes yang bisa dijalankan dan advisori keamanan untuk pengungkapan | Sengaja tetap statis, tidak pernah menjalankan target                                     |
| Pertahanan diri tool         | Memperkuat API tulis lokal di dasbor                                              | Memperkuat eksekusi AI miliknya terhadap kode target yang tidak tepercaya                 |

## Skala dan penerapan

| Aspek      | Lagune                                                                                        | Deepsec                                                      |
| ---------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Instalasi  | Sembilan perintah dari plugin agen Anda atau **skills** CLI, tanpa file yang dibuat di proyek | Workspace `.deepsec/` dengan paket dan dependensinya sendiri |
| Arah skala | Bisa dibatasi ke bagian mana pun, sebuah konteks, dari satu file hingga seluruh proyek        | Memindai seluruh repositori, hingga monorepo besar           |
| Distribusi | Hanya lokal, satu-satunya server terikat ke loopback                                          | Opsional disebar ke VM worker Vercel Sandbox                 |

## Pengalaman pengguna

Cara masing-masing menyambut orang yang menjalankannya: apa yang dibutuhkan saat pertama kali dijalankan, dan bagaimana operator mengarahkannya.

### Langkah awal

Lagune berjalan lewat agen yang sudah terbuka. Deepsec lebih dulu menyiapkan workspace dan akses model miliknya sendiri.

| Aspek                        | Lagune                                                                          | Deepsec                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Perintah pertama             | Instal plugin atau `npx skills add wellwelwel/lagune`, lalu `/lagune-*` di agen | `npx deepsec init`, lalu `cd .deepsec`, `pnpm install`, `scan`, `process`         |
| Kredensial untuk menjalankan | Tanpa kunci terpisah, memakai agen Anda saat ini                                | Kunci model (misalnya AI Gateway, token OIDC Vercel 12 jam, atau token Anthropic) |

### Mengarahkannya

Keduanya menerima arahan. Lagune membaca bentuk input di tiap fase. Deepsec mempersempit kumpulan file yang dicakup oleh investigasi yang sama.

| Aspek             | Lagune                                                                               | Deepsec                                                        |
| ----------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| Seluruh proyek    | Fase tanpa input memindai seluruh cakupan                                            | `scan` dan `process` memindai seluruh repositori               |
| Sebagian          | Fase apa pun bisa dibatasi ke file atau direktori tertentu                           | `--files`, `--files-from`, atau `--diff` mempersempit eksekusi |
| Kekhawatiran      | Fase bisa dibatasi ke kekhawatiran yang Anda deskripsikan                            | Prompt investigasinya tetap                                    |
| Rentang prioritas | `harden` dan `verify` bisa dibatasi ke tingkat kritis, tinggi, sedang, atau rendah   | Temuan diberi label setelah eksekusi                           |
| Satu nilai        | Hook langsung memberi skor satu potongan kode, pola, atau URL (`--pattern`, `--url`) | Unit kerjanya adalah file                                      |

## Pertanyaan yang sering diajukan

### Apa perbedaan Lagune dan Deepsec?

Lagune mengutamakan agen dan bekerja sebelum, selama, dan setelah kode ditulis: menetapkan kebijakan sebelum kode ada, memperkuat keamanan langsung saat membangun, serta mengaudit, memperkuat, dan memverifikasi kode yang sudah ditulis. Deepsec mengutamakan determinisme: pemindaian regex yang lebar memasok investigasi wajib oleh model kelas frontier, yang meninjau kode yang sudah ada dan melaporkan temuan tanpa mengubahnya.

### Apakah saya bisa menjalankan salah satunya secara gratis?

Seluruh alur Lagune bisa berjalan dengan biaya $0 di model lokal gratis, dan hook deterministiknya menghasilkan putusan tanpa AI sama sekali. Scan Deepsec gratis, tetapi tidak menghasilkan putusan, jadi setiap temuan memerlukan tahap AI berbayarnya.

### Apakah salah satunya mengubah kode saya?

Lagune mengubahnya: harden menerapkan perbaikan ke kode Anda. Deepsec tidak: Deepsec hanya melakukan analisis statis, menghasilkan temuan dan teks rekomendasi yang diterapkan secara terpisah oleh orang atau agen.
