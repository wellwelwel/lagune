# Cara menginstal Lagune di Grok Build sebagai plugin

> Instal Lagune di Grok Build sebagai plugin, jaga agar tetap terbaru, dan izinkan engine-nya sejak awal.

Kanonis: https://lagune.ai/id-ID/docs/install/grok-build
Bahasa: id-ID
Asli: https://lagune.ai/docs/install/grok-build
Terakhir diperbarui: 2026-11-06

Instal plugin dari terminal Anda:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## Pembaruan

Untuk memperbarui **Lagune**, jalankan:

```bash
grok plugin update lagune
```

## Perintah

Ketik perintah dengan namanya, misalnya `/lagune-charter`, atau dengan nama plugin di depannya, misalnya `/lagune:lagune-charter`.

---

**Izin**

Engine berjalan melalui dua tool: `lagune_read` hanya membaca proyek Anda, dan `lagune_write` hanya menulis ke `.lagune/`. Untuk mengizinkannya sejak awal, tambahkan aturan berikut ke `~/.grok/config.toml`:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

Saat engine berjalan melalui **npx**, seperti pada **skills.sh**, izinkan `Bash(npx --yes lagune@*)`.

## Pertanyaan yang sering diajukan

### Bagaimana cara menginstal Lagune di Grok Build?

Jalankan grok plugin install wellwelwel/lagune@plugin-grok --trust.

### Bagaimana cara memperbarui Lagune di Grok Build?

Jalankan grok plugin update lagune.

### Bagaimana cara menjalankan perintah Lagune di Grok Build?

Ketik perintah dengan namanya, misalnya /lagune-charter, atau dengan nama plugin di depannya, misalnya /lagune:lagune-charter.

### Apakah Grok Build bisa menjalankan Lagune tanpa meminta izin?

Ya. Izinkan MCPTool(lagune__lagune_read) dan MCPTool(lagune__lagune_write) di konfigurasi Grok Build, ditambah Bash(npx --yes lagune@*) saat engine berjalan melalui npx.
