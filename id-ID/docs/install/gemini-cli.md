# Cara menginstal Lagune di Gemini CLI sebagai ekstensi

> Instal Lagune di Gemini CLI sebagai ekstensi, jaga agar tetap terbaru, dan izinkan engine-nya sejak awal.

Kanonis: https://lagune.ai/id-ID/docs/install/gemini-cli
Bahasa: id-ID
Asli: https://lagune.ai/docs/install/gemini-cli
Terakhir diperbarui: 2026-11-06

Instal ekstensi dari terminal Anda:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## Pembaruan

Untuk memperbarui **Lagune**, jalankan:

```bash
gemini extensions update lagune
```

Agar tetap terbaru, instal dengan `--auto-update`.

## Perintah

Ketik perintah dengan nama ekstensi di depannya, misalnya `/lagune:lagune-charter` untuk `/lagune-charter`.

---

**Izin**

Engine berjalan melalui dua tool: `lagune_read` hanya membaca proyek Anda, dan `lagune_write` hanya menulis ke `.lagune/`. **Gemini CLI** hanya menjalankannya di folder tepercaya. Untuk mengizinkannya sejak awal, simpan aturan ini sebagai `~/.gemini/policies/lagune.toml`:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

Saat engine berjalan melalui **npx**, seperti pada **skills.sh**, tambahkan aturan ini ke file yang sama:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## Pertanyaan yang sering diajukan

### Bagaimana cara menginstal Lagune di Gemini CLI?

Jalankan gemini extensions install https://github.com/wellwelwel/lagune.

### Bagaimana cara memperbarui Lagune di Gemini CLI?

Jalankan gemini extensions update lagune, atau instal ekstensi dengan --auto-update.

### Bagaimana cara menjalankan perintah Lagune di Gemini CLI?

Ketik perintah dengan nama ekstensi di depannya, misalnya /lagune:lagune-charter.

### Apakah Gemini CLI bisa menjalankan Lagune tanpa meminta izin?

Ya. Tambahkan aturan kebijakan yang mengizinkan tool lagune_read dan lagune_write dari server lagune, ditambah satu aturan untuk run_shell_command dengan npx --yes lagune@ dan nomor versi saat engine berjalan melalui npx.
