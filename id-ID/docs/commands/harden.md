# /lagune-harden: terapkan perbaikan keamanan ke kode Anda

> Terapkan perbaikan dari rencana ke kode Anda, dengan aman dan satu per satu.

Kanonis: https://lagune.ai/id-ID/docs/commands/harden
Bahasa: id-ID
Asli: https://lagune.ai/docs/commands/harden
Terakhir diperbarui: 2026-11-06

🔧 Terapkan perbaikan dari rencana ke kode Anda, dengan aman dan satu per satu.

## Cara menggunakan

**Terapkan semuanya**

```prompt
/lagune-harden
```

**Tunjuk path**

```prompt
/lagune-harden src/routes/upload.ts
```

**Berdasarkan prioritas**

```prompt
/lagune-harden hanya yang prioritasnya kritis dan tinggi
```

## Cara kerjanya

Plan sudah menentukan setiap perbaikan, jadi harden tinggal menerapkannya. Karena ini satu-satunya fase yang menyentuh kode Anda, harden bekerja dengan hati-hati: menerapkan satu perbaikan dalam satu waktu agar setiap perubahan tetap mudah ditinjau, dan tidak pernah melemahkan kontrol keamanan demi menyesuaikan perbaikan. Contohnya, perbaikan untuk unggahan:

- **Unggahan file** (Status: **Applied**)
  - _Apa yang berubah:_ memeriksa jenis asli dan ukuran file, menolak apa pun yang tidak terduga, mengganti namanya saat disimpan, dan menyimpannya di tempat yang tidak bisa dijalankan sebagai kode.
  - _Di mana:_ fungsi `handleUpload`, ditambah helper penyimpanan yang dipanggilnya.

Jika sebuah perbaikan tidak bisa diterapkan sepenuhnya, harden mengerjakan apa yang bisa dilakukan dengan aman dan menandai sisanya **Partial** atau **Blocked**, sehingga tetap terbuka.

**Diterapkan belum berarti terverifikasi**

Applied belum berarti terbukti. Itulah gunanya [verify](https://lagune.ai/id-ID/docs/commands/verify).

**Tips**

- Harden sepenuhnya bertumpu pada rencana. Jika sebuah perbaikan atau file belum pernah direncanakan, harden meminta Anda menjalankan `/lagune-plan` untuk itu terlebih dahulu.
- Menjalankannya lagi akan menyelaraskan catatan dengan kondisi terkini: perubahan yang dibatalkan hilang, perbaikan yang baru diterapkan masuk.
- Catatan hardening ada di `.lagune/memory/harden.md`.

**Bergantung pada plan, dan mengubah kode Anda**

Harden bertumpu pada [`/lagune-plan`](https://lagune.ai/id-ID/docs/commands/plan). Ini satu-satunya fase yang mengubah kode Anda.

## Selanjutnya

Buktikan bahwa setiap perbaikan tetap efektif: [`/lagune-verify`](https://lagune.ai/id-ID/docs/commands/verify).

## Pertanyaan yang sering diajukan

### Apakah /lagune-harden mengubah kode saya?

Ya. Ini satu-satunya fase yang menyentuh kode Anda, dengan menerapkan perbaikan dari rencana satu per satu.

### Apa arti Applied, Partial, dan Blocked?

Ketiganya adalah status yang dicatat Lagune untuk setiap perbaikan. Applied berarti perbaikan sudah dibuat, Partial berarti baru sebagian, dan Blocked berarti perbaikan tidak bisa diterapkan. Applied belum berarti terbukti.

### Apakah Lagune menerapkan perbaikan tanpa bertanya?

Perlu atau tidaknya persetujuan Anda untuk sebuah perubahan ditentukan oleh agen Anda dan mode izin yang Anda gunakan, bukan oleh Lagune, yang tidak menambahkan langkah konfirmasi sendiri. Meski begitu, Lagune tidak pernah melemahkan kontrol keamanan demi memenuhi perbaikan, dan jika sebuah perbaikan bertentangan dengan aturan charter, Lagune berhenti dan memberi tahu Anda terlebih dahulu.
