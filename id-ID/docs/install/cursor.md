# Cara menginstal Lagune di Cursor sebagai plugin

> Instal Lagune di Cursor dan Cursor CLI sebagai plugin, jaga agar tetap terbaru, dan izinkan engine-nya sejak awal.

Kanonis: https://lagune.ai/id-ID/docs/install/cursor
Bahasa: id-ID
Asli: https://lagune.ai/docs/install/cursor
Terakhir diperbarui: 2026-11-06

**Cursor**

- Buka **Customize**.
- Pilih **From GitHub Repository** lalu masukkan `https://github.com/wellwelwel/lagune`.
- Pilih **Install** pada **Lagune** lalu tentukan cakupan proyek atau pengguna.

**Cursor CLI**

- Tambahkan marketplace dari terminal Anda:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Ketik `/plugins` di sesi `agent`.
- Instal **Lagune**.

Jika **Lagune** sudah terinstal di **Claude Code**, **Cursor CLI** memuatnya dari sana.

## Pembaruan

**Cursor**

- Buka **Customize**.
- Pilih **Refresh** pada marketplace `lagune`.

**Cursor CLI**

- Ganti marketplace dari terminal Anda:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Ketik `/plugins` di sesi `agent`.
- Instal **Lagune** lagi.

## Perintah

Ketik perintah dengan namanya, misalnya `/lagune-charter`.

---

**Izin**

Di **Cursor**, setiap perintah menjalankan engine melalui **npx**, dan mode Auto-review default mengizinkannya tanpa bertanya.

Di **Cursor CLI**, engine berjalan melalui dua tool: `lagune_read` hanya membaca proyek Anda, dan `lagune_write` hanya menulis ke `.lagune/`. Untuk mengizinkannya sejak awal, tambahkan aturan berikut ke `.cursor/cli.json` untuk satu proyek, atau ke `~/.cursor/cli-config.json` untuk semua proyek:

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

Saat engine berjalan melalui **npx**, seperti pada **skills.sh**, izinkan `Shell(npx:--yes lagune@*)`.

## Pertanyaan yang sering diajukan

### Bagaimana cara menginstal Lagune di Cursor?

Di Cursor, buka Customize, pilih From GitHub Repository, masukkan https://github.com/wellwelwel/lagune, lalu instal Lagune. Di Cursor CLI, jalankan agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor, lalu instal Lagune dari /plugins.

### Bagaimana cara memperbarui Lagune di Cursor?

Di Cursor, pilih Refresh pada marketplace lagune di Customize. Di Cursor CLI, hapus marketplace lagune, tambahkan lagi, lalu instal Lagune lagi dari /plugins.

### Bagaimana cara menjalankan perintah Lagune di Cursor?

Ketik perintah dengan namanya, misalnya /lagune-charter.

### Apakah Cursor bisa menjalankan Lagune tanpa meminta izin?

Ya. Mode Auto-review default di Cursor sudah mengizinkannya. Di Cursor CLI, izinkan Mcp(plugin-lagune-lagune:lagune_read) dan Mcp(plugin-lagune-lagune:lagune_write), ditambah Shell(npx:--yes lagune@*) saat engine berjalan melalui npx.
