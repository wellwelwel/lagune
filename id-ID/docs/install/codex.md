# Cara menginstal Lagune di Codex CLI sebagai plugin

> Instal Lagune di Codex CLI sebagai plugin, jaga agar tetap terbaru, dan jalankan engine-nya di dalam sandbox.

Kanonis: https://lagune.ai/id-ID/docs/install/codex
Bahasa: id-ID
Asli: https://lagune.ai/docs/install/codex
Terakhir diperbarui: 2026-11-06

Instal plugin dari terminal Anda:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## Pembaruan

Untuk memperbarui **Lagune**, jalankan:

```bash
codex plugin marketplace upgrade lagune
```

## Perintah

Ketik `$` dan perintah dengan nama plugin di depannya, diikuti input Anda, misalnya `$lagune:lagune-charter` untuk `/lagune-charter`. Saat Anda mengetik `$`, daftar perintah muncul, dan memilih salah satunya menyisipkan nama lengkapnya.

---

**Izin**

Sandbox **Codex** tidak punya akses jaringan. Instal engine di proyek Anda dari terminal Anda sendiri, sekali di awal dan lagi setelah setiap pembaruan:

```bash
npm i -D lagune@0.18.0
```

## Pertanyaan yang sering diajukan

### Bagaimana cara menginstal Lagune di Codex CLI?

Jalankan codex plugin marketplace add wellwelwel/lagune, lalu codex plugin add lagune@lagune.

### Bagaimana cara memperbarui Lagune di Codex CLI?

Jalankan codex plugin marketplace upgrade lagune.

### Bagaimana cara menjalankan perintah Lagune di Codex CLI?

Ketik $ dan perintah dengan nama plugin di depannya, diikuti input Anda, misalnya $lagune:lagune-charter.

### Apakah Lagune berfungsi di dalam sandbox Codex?

Ya, setelah Anda menginstal engine di proyek Anda dengan npm i -D lagune@0.18.0 dari terminal Anda sendiri, sekali di awal dan lagi setelah setiap pembaruan.
