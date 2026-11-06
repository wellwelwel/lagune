# Skema konfigurasi

> JSON Schema untuk konfigurasi proyek Lagune, agar editor Anda bisa melengkapi otomatis dan memvalidasi file, mengikuti Lagune terbaru atau dikunci ke satu versi.

Kanonis: https://lagune.ai/id-ID/docs/references/configs-schema
Bahasa: id-ID
Asli: https://lagune.ai/docs/references/configs-schema
Terakhir diperbarui: 2026-11-06

File `.lagune/configs.json` mencatat [**kategori**](https://lagune.ai/id-ID/docs/categories) yang dipakai proyek, mengindeks [**spesialisasi**](https://lagune.ai/id-ID/docs/catalog) milik proyek itu sendiri, dan menentukan apa saja yang dilewati [**checker**](https://lagune.ai/id-ID/docs/hooks/configure). Dengan JSON Schema-nya, editor Anda bisa melengkapi setiap field secara otomatis dan menandai salah ketik atau kategori yang tidak dikenal saat Anda menyunting file tersebut.

## Skema terbaru

Setiap kali **Lagune** menulis file ini dan tidak menemukan `$schema` di dalamnya, **Lagune** mengarahkan file itu ke skema terbaru:

```json
{
  "$schema": "https://lagune.ai/schemas/configs.json",
  "categories": ["owasp", "javascript"]
}
```

Alamat ini selalu mengikuti **Lagune** versi terbaru. File yang ditulis sebelum **Lagune** 0.16.0 akan mendapatkannya pada perubahan berikutnya, dan setiap fase akan mengingatkan hal itu sampai saat tersebut.

## Kunci ke satu versi

Setiap rilis **Lagune** sejak 0.16.0 membawa skema sebagaimana adanya di versi itu, diterbitkan di **npm** dan disajikan oleh **jsDelivr**. Untuk mengunci satu versi, tulis versinya setelah `lagune@` di alamat `$schema`:

```json
{
  "$schema": "https://cdn.jsdelivr.net/npm/lagune@0.16.0/schemas/configs.json"
}
```

Versi ini menerima rentang semver apa pun:

| Versi                | Skema                         |
| -------------------- | ----------------------------- |
| `0.16.0`             | Skema dari 0.16.0             |
| `0.16.x` atau `0.16` | Skema dari rilis 0.16 terbaru |
| `0.x` atau `0`       | Skema dari rilis 0.x terbaru  |
| `latest`             | Skema dari rilis terbaru      |

## Pertanyaan yang sering diajukan

### Apakah Lagune membutuhkan skema ini?

Tidak. Skema hanya membantu editor Anda, dan Lagune membaca file dengan cara yang sama, dengan atau tanpa $schema.

### Apakah Lagune akan menimpa skema yang sudah saya kunci?

Tidak. Lagune hanya menulis $schema jika file belum memilikinya, dan tetap memakai alamat apa pun yang Anda tetapkan.

### Kapan saya perlu mengunci versi?

Saat proyek menjalankan versi Lagune tertentu, agar editor Anda memvalidasi file sesuai dengan apa yang diterima versi tersebut.
