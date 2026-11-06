# Cara menginstal Lagune di Claude Code sebagai plugin

> Instal Lagune di Claude Code sebagai plugin, di terminal, ekstensi, atau aplikasi desktop, jaga agar tetap terbaru, dan izinkan engine-nya sejak awal.

Kanonis: https://lagune.ai/id-ID/docs/install/claude-code
Bahasa: id-ID
Asli: https://lagune.ai/docs/install/claude-code
Terakhir diperbarui: 2026-11-06

**Terminal**

Instal plugin dari terminal Anda:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

Atau dari sesi **Claude Code**:

```text
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**Ekstensi**

- Ketik `/plugin` lalu pilih **Manage plugins**.
- Tambahkan `wellwelwel/lagune` di tab **Marketplaces**.
- Instal `lagune` di tab **Plugins**.

**Desktop**

- Instal **Lagune** dari terminal atau ekstensi, dengan memilih **Install for you** di ekstensi.
- Mulai sesi baru di aplikasi desktop. Aplikasi ini memuat plugin yang Anda instal untuk diri Anda sendiri.

## Pembaruan

**Terminal**

Untuk memperbarui **Lagune**, jalankan:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

Agar tetap terbaru, pilih **Enable auto-update** untuk marketplace `lagune` di `/plugin`.

**Ekstensi**

- Ketik `/plugin` lalu pilih **Manage plugins**.
- Buka tab **Marketplaces**.
- Pilih ikon muat ulang di `lagune`.

**Desktop**

- Perbarui **Lagune** dari terminal atau ekstensi.
- Mulai sesi baru di aplikasi desktop.

## Perintah

Ketik perintah dengan namanya, misalnya `/lagune-charter`, atau dengan nama plugin di depannya, misalnya `/lagune:lagune-charter`.

---

**Izin**

Engine berjalan melalui dua tool: `lagune_read` hanya membaca proyek Anda, dan `lagune_write` hanya menulis ke `.lagune/`. Untuk mengizinkannya sejak awal, tambahkan aturan berikut ke `.claude/settings.json` untuk satu proyek, atau ke `~/.claude/settings.json` untuk semua proyek:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

Saat engine berjalan melalui **npx**, seperti pada **skills.sh**, izinkan `Bash(npx --yes lagune@*)`. Jika sandbox aktif, tambahkan juga `registry.npmjs.org` ke `sandbox.network.allowedDomains`.

## Pertanyaan yang sering diajukan

### Bagaimana cara menginstal Lagune di Claude Code?

Jalankan claude plugin install lagune --marketplace wellwelwel/lagune. Di sesi atau di ekstensi, tambahkan marketplace wellwelwel/lagune dari pengelola plugin, lalu instal lagune. Aplikasi desktop memuatnya setelah Anda menginstalnya untuk diri Anda sendiri di terminal atau ekstensi.

### Bagaimana cara memperbarui Lagune di Claude Code?

Jalankan claude plugin marketplace update lagune, lalu claude plugin update lagune@lagune, atau pilih Enable auto-update untuk marketplace lagune di /plugin. Di ekstensi, buka Manage plugins dari /plugin dan pilih ikon muat ulang di marketplace lagune. Aplikasi desktop memuat pembaruan itu di sesi berikutnya.

### Bagaimana cara menjalankan perintah Lagune di Claude Code?

Ketik perintah dengan namanya, misalnya /lagune-charter, atau dengan nama plugin di depannya, misalnya /lagune:lagune-charter.

### Apakah Claude Code bisa menjalankan Lagune tanpa meminta izin?

Ya. Izinkan mcp__plugin_lagune_lagune__lagune_read dan mcp__plugin_lagune_lagune__lagune_write di pengaturan Claude Code Anda, ditambah Bash(npx --yes lagune@*) saat engine berjalan melalui npx.
