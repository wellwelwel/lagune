# /lagune: kode aman sejak AI Anda menulisnya

> Bangun apa yang Anda minta dan perkuat keamanannya saat kode ditulis, dipandu oleh charter, tanpa alur yang harus diikuti.

Kanonis: https://lagune.ai/id-ID/docs/commands/lagune
Bahasa: id-ID
Asli: https://lagune.ai/docs/commands/lagune
Terakhir diperbarui: 2026-11-06

⌨️ Kerjakan apa yang Anda minta, dengan keamanan yang dibangun saat kodenya ditulis. **`/lagune`** menerima prompt apa pun di tahap mana pun, membangun apa yang Anda inginkan, dan memperkuat keamanannya dengan default yang aman sebelum menyerahkannya kembali.

## Cara menggunakan

Tambahkan **`/lagune`** ke prompt apa pun, lalu jelaskan pekerjaannya seperti biasa.

**📘 Instruksi agen**

```md
# Instruksi proyekku untuk agen

<!-- ... -->

## Keamanan

- Gunakan skill `/lagune` setiap kali kamu membangun atau mengubah kode, agar keamanannya meningkat secara bawaan.
```

    - Contohnya: **AGENTS.md**, **CLAUDE.md**, **.github/copilot-instructions.md**, **.cursorrules**, dan sebagainya.

**💬 Fitur**

```prompt
/lagune izinkan pengguna mengunggah foto kustom di profil mereka.
```

**💬 Perbaikan**

```prompt
/lagune tidak terjadi apa-apa saat pengguna mengirim formulir. Cari tahu penyebabnya dan perbaiki.
```

**💬 Refaktor**

```prompt
/lagune pisahkan dan perbaiki logika payload
```

**Charter opsional, tetapi lebih baik dengan charter**

**`/lagune`** berjalan dengan atau tanpa charter. Dengan charter, aturan proyek Anda sendiri membentuk setiap hasil pembangunan. Tetapkan sekali saja dengan [`/lagune-charter`](https://lagune.ai/id-ID/docs/commands/charter).

## Cara kerjanya

Perintah ini membungkus pekerjaan dalam tiga langkah, tanpa menulis apa pun ke Lagune:

1. Memuat charter Anda, jika ada, dan prinsip-prinsipnya mengarahkan seluruh pembangunan. Jika Anda belum punya charter, perintah ini memakai standar dasar yang aman secara bawaan.
2. Menampilkan [katalog](https://lagune.ai/id-ID/docs/catalog) proyek Anda dan hanya memuat spesialisasi yang tersentuh oleh pekerjaan Anda, pengetahuan yang sama, dimuat hanya saat dibutuhkan, yang dipakai alur audit.
3. Menerapkan pertahanan saat kode ditulis, lalu membaca ulang hasilnya sendiri untuk memastikan kontrol keamanannya benar-benar bertahan sebelum menyerahkan pekerjaan kembali.

Hasilnya adalah kode yang berfungsi di proyek Anda, aman sejak baris pertama.

**Gunakan kapan saja**

Tanpa detect, tanpa plan, tanpa beres-beres setelahnya. **`/lagune`** sama cocoknya untuk scaffold baru maupun perubahan di basis kode yang sudah matang, dan memperkuat keamanan pekerjaan sambil berjalan, bukan belakangan.

## Yang tidak dilakukannya

- Tidak menulis apa pun ke direktori `.lagune`, baik artefak maupun pelacakan, jadi satu-satunya yang dihasilkannya adalah kode dengan keamanan yang diperkuat sesuai permintaan Anda.
- Tidak melemahkan aturan demi memenuhi prompt, jadi jika permintaan Anda akan melanggar prinsip charter, perintah ini berhenti dan memberi tahu Anda terlebih dahulu, alih-alih langsung membangunnya dengan cara yang tidak aman.

## Pertanyaan yang sering diajukan

### Apa fungsi /lagune?

Perintah ini menerima prompt apa pun di tahap mana pun, membangun apa yang Anda minta, dan memperkuat keamanannya dengan default yang aman sebelum menyerahkannya kembali. Pertahanan diterapkan saat kode ditulis, bukan belakangan.

### Apakah saya perlu charter untuk menggunakan /lagune?

Tidak. Perintah ini berjalan dengan atau tanpa charter. Dengan charter, aturan proyek Anda sendiri membentuk setiap hasil pembangunan. Tanpa charter, perintah ini memakai standar dasar yang aman secara bawaan.

### Apa bedanya /lagune dengan alur Blue Team?

/lagune mengamankan pekerjaan baru saat Anda menulisnya, tanpa alur yang harus diikuti. Alur Blue Team menjalankan lima fase audit secara berurutan pada proyek yang sudah ada.

### Apakah /lagune melacak temuan atau menulis artefak?

Tidak. Perintah ini tidak menulis apa pun ke direktori .lagune, baik artefak maupun pelacakan. Satu-satunya yang dihasilkannya adalah kode dengan keamanan yang diperkuat sesuai permintaan Anda.

### Bagaimana agar agen saya menggunakan /lagune secara otomatis?

Tambahkan instruksi ke file instruksi agen Anda (AGENTS.md, CLAUDE.md, .cursorrules, dan sejenisnya) agar agen menggunakan skill /lagune setiap kali membangun atau mengubah kode.
