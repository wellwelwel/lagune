# Cara menginstal Lagune di Factory Droid sebagai plugin

> Instal Lagune di Factory Droid sebagai plugin, jaga agar tetap terbaru, dan izinkan tool engine-nya.

Kanonis: https://lagune.ai/id-ID/docs/install/factory-droid
Bahasa: id-ID
Asli: https://lagune.ai/docs/install/factory-droid
Terakhir diperbarui: 2026-11-07

Instal plugin dari terminal Anda:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## Pembaruan

Untuk memperbarui **Lagune**, jalankan:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## Perintah

Ketik perintah dengan namanya, misalnya `/lagune-charter`.

## Pertanyaan yang sering diajukan

### Bagaimana cara menginstal Lagune di Factory Droid?

Jalankan droid plugin marketplace add wellwelwel/lagune, lalu droid plugin install lagune@lagune.

### Bagaimana cara memperbarui Lagune di Factory Droid?

Jalankan droid plugin marketplace update lagune, lalu droid plugin update lagune@lagune.

### Bagaimana cara menjalankan perintah Lagune di Factory Droid?

Ketik perintah dengan namanya, misalnya /lagune-charter.

### Apakah Factory Droid bisa menjalankan Lagune tanpa meminta izin?

Ya. Pilih untuk selalu mengizinkan lagune_read dan lagune_write saat Factory Droid meminta izin. Factory Droid akan meminta lagi setelah menyinkronkan commit baru dari marketplace lagune.
