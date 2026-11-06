# Cara menginstal Lagune di Pi sebagai paket

> Instal Lagune di Pi sebagai paket, dari npm atau dari GitHub, dan jaga agar tetap terbaru.

Kanonis: https://lagune.ai/id-ID/docs/install/pi
Bahasa: id-ID
Asli: https://lagune.ai/docs/install/pi
Terakhir diperbarui: 2026-11-06

**npm**

Instal paket dari terminal Anda:

```bash
pi install npm:lagune
```

**GitHub**

Instal commit terbaru dari **GitHub**, yang menjalankan engine melalui **npx**:

```bash
pi install git:github.com/wellwelwel/lagune
```

## Pembaruan

**npm**

Untuk memperbarui **Lagune**, jalankan:

```bash
pi update npm:lagune
```

**GitHub**

Untuk memperbarui **Lagune**, jalankan:

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` memperbarui semua paket yang Anda instal, sedangkan `pi update` saja hanya memperbarui **Pi**.

## Perintah

Ketik perintah dengan awalan `skill:`, misalnya `/skill:lagune-charter` untuk `/lagune-charter`.

## Pertanyaan yang sering diajukan

### Bagaimana cara menginstal Lagune di Pi?

Jalankan pi install npm:lagune, atau pi install git:github.com/wellwelwel/lagune untuk commit terbaru dari GitHub.

### Bagaimana cara memperbarui Lagune di Pi?

Jalankan pi update npm:lagune, atau pi update git:github.com/wellwelwel/lagune untuk instalasi dari GitHub. pi update --extensions memperbarui semua paket yang Anda instal.

### Bagaimana cara menjalankan perintah Lagune di Pi?

Ketik perintah dengan awalan skill:, misalnya /skill:lagune-charter.
