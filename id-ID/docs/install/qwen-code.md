# Cara menginstal Lagune di Qwen Code sebagai ekstensi

> Instal Lagune di Qwen Code sebagai ekstensi, jaga agar tetap terbaru, dan izinkan engine-nya sejak awal.

Kanonis: https://lagune.ai/id-ID/docs/install/qwen-code
Bahasa: id-ID
Asli: https://lagune.ai/docs/install/qwen-code
Terakhir diperbarui: 2026-11-06

Instal ekstensi dari terminal Anda:

```bash
qwen extensions install lagune
```

## Pembaruan

Untuk memperbarui **Lagune**, jalankan:

```bash
qwen extensions update lagune
```

Agar selalu terbaru, instal dengan `--auto-update`.

## Perintah

Ketik perintah dengan nama ekstensi di depannya, misalnya `/lagune:lagune-charter` untuk `/lagune-charter`.

---

**Izin**

Engine berjalan melalui dua tool: `lagune_read` hanya membaca proyek Anda, dan `lagune_write` hanya menulis ke `.lagune/`. Untuk mengizinkannya sejak awal, tambahkan aturan berikut ke `.qwen/settings.json` untuk satu proyek, atau ke `~/.qwen/settings.json` untuk semua proyek:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

Saat engine berjalan melalui **npx**, seperti pada **skills.sh**, izinkan `Shell(npx --yes lagune@*)`.

## Pertanyaan yang sering diajukan

### Bagaimana cara menginstal Lagune di Qwen Code?

Jalankan qwen extensions install lagune.

### Bagaimana cara memperbarui Lagune di Qwen Code?

Jalankan qwen extensions update lagune, atau instal ekstensi dengan --auto-update.

### Bagaimana cara menjalankan perintah Lagune di Qwen Code?

Ketik perintah dengan nama ekstensi di depannya, misalnya /lagune:lagune-charter.

### Apakah Qwen Code bisa menjalankan Lagune tanpa meminta izin?

Ya. Izinkan mcp__lagune__lagune_read dan mcp__lagune__lagune_write di pengaturan Qwen Code, ditambah Shell(npx --yes lagune@*) saat engine berjalan melalui npx.
