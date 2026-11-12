# Cara menginstal Lagune di Muse Code sebagai plugin

> Instal Lagune di Muse Code sebagai plugin, jaga agar tetap terbaru, dan jalankan engine-nya di dalam sandbox.

Kanonis: https://lagune.ai/id-ID/docs/install/muse-code
Bahasa: id-ID
Asli: https://lagune.ai/docs/install/muse-code
Terakhir diperbarui: 2026-11-07

Instal plugin dari terminal Anda:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## Pembaruan

Untuk memperbarui **Lagune**, segarkan marketplace lalu instal ulang plugin:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## Perintah

Ketik perintah dengan namanya, misalnya `/lagune-charter`, atau dengan nama plugin di depannya, misalnya `/lagune:lagune-charter`.

---

**Sandbox**

Sandbox **Muse Code** tidak bisa mengunduh engine. Instal engine di proyek Anda dari terminal Anda sendiri, sekali di awal dan lagi setelah setiap pembaruan:

```bash
npm i -D lagune@0.18.2
```

## Pertanyaan yang sering diajukan

### Bagaimana cara menginstal Lagune di Muse Code?

Jalankan muse plugins marketplace add lagune wellwelwel/lagune, lalu muse plugins install lagune@lagune.

### Bagaimana cara memperbarui Lagune di Muse Code?

Jalankan muse plugins marketplace update lagune, lalu instal ulang dengan muse plugins remove lagune dan muse plugins install lagune@lagune.

### Bagaimana cara menjalankan perintah Lagune di Muse Code?

Ketik perintah dengan namanya, misalnya /lagune-charter, atau dengan nama plugin di depannya, misalnya /lagune:lagune-charter.

### Apakah Lagune berfungsi di dalam sandbox Muse Code?

Ya, setelah Anda menginstal engine di proyek Anda dengan npm i -D lagune@0.18.2 dari terminal Anda sendiri, sekali di awal dan lagi setelah setiap pembaruan.
