# Cara menginstal Lagune di OpenCode sebagai plugin

> Instal Lagune di OpenCode 1.x dan 2.x sebagai plugin, dan jaga agar tetap terbaru.

Kanonis: https://lagune.ai/id-ID/docs/install/opencode
Bahasa: id-ID
Asli: https://lagune.ai/docs/install/opencode
Terakhir diperbarui: 2026-11-06

**OpenCode 2.x**

Instal plugin dari terminal Anda:

```bash
opencode plugin add lagune
```

Atau tambahkan ke daftar `plugins` di `opencode.json`:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

Instal plugin di proyek Anda dari terminal, atau tambahkan `-g` untuk menginstalnya di semua proyek Anda:

```bash
opencode plugin lagune
```

Atau tambahkan ke daftar `plugin` di `opencode.json`:

```json
{
  "plugin": ["lagune"]
}
```

## Pembaruan

**OpenCode 2.x**

Untuk memperbarui **Lagune**, jalankan:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

Untuk memperbarui **Lagune**, instal rilis baru di atas rilis lama, dengan menambahkan `-g` jika Anda menginstalnya di semua proyek Anda:

```bash
opencode plugin lagune@0.18.0 --force
```

## Perintah

**OpenCode 2.x**

Ketik `@` lalu pilih perintahnya, misalnya `@lagune-charter`, kemudian tulis input Anda di pesan yang sama.

**OpenCode 1.x**

Ketik perintah dengan namanya, misalnya `/lagune-charter`. Perintah ini tercantum di `/skills`, bukan di menu `/`.

---

**Izin**

Engine berjalan melalui dua tool: `lagune_read` hanya membaca proyek Anda, dan `lagune_write` hanya menulis ke `.lagune/`. **OpenCode** menjalankannya tanpa bertanya.

## Pertanyaan yang sering diajukan

### Bagaimana cara menginstal Lagune di OpenCode?

Di OpenCode 2.x, jalankan opencode plugin add lagune. Di OpenCode 1.x, jalankan opencode plugin lagune, dengan menambahkan -g untuk menginstalnya di semua proyek Anda.

### Bagaimana cara memperbarui Lagune di OpenCode?

Di OpenCode 2.x, jalankan opencode plugin update lagune, lalu opencode reload. Di OpenCode 1.x, jalankan opencode plugin lagune@0.18.0 --force.

### Bagaimana cara menjalankan perintah Lagune di OpenCode?

Di OpenCode 2.x, ketik @ lalu pilih perintahnya, misalnya @lagune-charter, kemudian tulis input Anda di pesan yang sama. Di OpenCode 1.x, ketik perintah dengan namanya, misalnya /lagune-charter, atau temukan di /skills.

### Apakah OpenCode meminta izin sebelum Lagune berjalan?

Tidak. OpenCode menjalankan dua tool milik engine, lagune_read dan lagune_write, tanpa bertanya.
