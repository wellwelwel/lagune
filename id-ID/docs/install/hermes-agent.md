# Cara menginstal Lagune di Hermes Agent sebagai plugin

> Instal Lagune di Hermes Agent sebagai plugin, dan jaga agar tetap terbaru.

Kanonis: https://lagune.ai/id-ID/docs/install/hermes-agent
Bahasa: id-ID
Asli: https://lagune.ai/docs/install/hermes-agent
Terakhir diperbarui: 2026-11-06

Instal plugin dari terminal Anda:

```bash
hermes plugins install wellwelwel/lagune --enable
```

- Saat **Hermes Agent** meminta Anda mengonfirmasi plugin dari luar katalognya, **konfirmasikan**.
- Saat agen menawarkan untuk menginstal dependensi **Node.js** milik repositori, **tolak**.

## Pembaruan

Untuk memperbarui **Lagune**, jalankan:

```bash
hermes plugins update lagune
```

## Perintah

Ketik perintah dengan nama plugin di depannya, misalnya `/lagune:lagune-charter` untuk `/lagune-charter` dan `/lagune:lagune` untuk `/lagune`.

## Pertanyaan yang sering diajukan

### Bagaimana cara menginstal Lagune di Hermes Agent?

Jalankan hermes plugins install wellwelwel/lagune --enable. Konfirmasikan plugin saat diminta, dan tolak instalasi dependensi Node.js milik repositori.

### Bagaimana cara memperbarui Lagune di Hermes Agent?

Jalankan hermes plugins update lagune.

### Bagaimana cara menjalankan perintah Lagune di Hermes Agent?

Ketik perintah dengan nama plugin di depannya, misalnya /lagune:lagune-charter dan /lagune:lagune.
