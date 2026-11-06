# Cara menginstal Lagune di Antigravity CLI sebagai plugin

> Instal Lagune di Antigravity CLI sebagai plugin, jaga agar tetap terbaru, dan izinkan engine-nya sejak awal.

Kanonis: https://lagune.ai/id-ID/docs/install/antigravity-cli
Bahasa: id-ID
Asli: https://lagune.ai/docs/install/antigravity-cli
Terakhir diperbarui: 2026-11-06

Instal plugin dari terminal Anda:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Pembaruan

Untuk memperbarui **Lagune**, instal ulang:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Perintah

Ketik perintah dengan nama plugin di depannya, misalnya `/lagune:lagune-charter` untuk `/lagune-charter`.

---

**Izin**

Engine berjalan melalui dua tool: `lagune_read` hanya membaca proyek Anda, dan `lagune_write` hanya menulis ke `.lagune/`. Perintah yang dikirim sebagai pesan pertama sebuah sesi berjalan sebelum kedua tool itu dimuat, sehingga perintah tersebut memakai **npx** sebagai gantinya. Untuk mengizinkan kedua tool itu dan **npx** sejak awal, tambahkan aturan berikut ke `~/.gemini/antigravity-cli/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## Pertanyaan yang sering diajukan

### Bagaimana cara menginstal Lagune di Antigravity CLI?

Jalankan agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Bagaimana cara memperbarui Lagune di Antigravity CLI?

Jalankan lagi agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Bagaimana cara menjalankan perintah Lagune di Antigravity CLI?

Ketik perintah dengan nama plugin di depannya, misalnya /lagune:lagune-charter.

### Apakah Antigravity CLI bisa menjalankan Lagune tanpa meminta izin?

Ya. Izinkan mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write), dan command(regex:npx --yes lagune@[0-9.]+) di pengaturan Antigravity CLI. Aturan npx mencakup perintah yang dikirim sebagai pesan pertama sebuah sesi.
