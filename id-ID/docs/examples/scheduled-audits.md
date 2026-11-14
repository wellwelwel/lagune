# Audit terjadwal: jalankan Lagune secara berkala

> Jadwalkan audit Lagune berkala di GitHub Actions dengan kunci Anda sendiri, atau di Claude Code, Codex, Cursor, Antigravity, atau OpenCode, yang melaporkan risiko baru atau menjalankan seluruh alur Blue Team.

Kanonis: https://lagune.ai/id-ID/docs/examples/scheduled-audits
Bahasa: id-ID
Asli: https://lagune.ai/docs/examples/scheduled-audits
Terakhir diperbarui: 2026-11-09

Jadwalkan **Lagune** untuk mengaudit proyek Anda secara mandiri, entah hanya melaporkan temuannya atau menjalankan seluruh alur Blue Team.

## Menjadwalkan

**Universal**

**GitHub Actions** menjalankan audit di cloud dengan [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/). Engine **Copilot CLI** miliknya memanggil penyedia model pilihan Anda dengan kunci Anda sendiri, sehingga tidak perlu langganan agen apa pun:

- Instal ekstensinya dengan `gh extension install github/gh-aw`.
- Simpan kunci penyedia Anda sebagai secret repositori dengan `gh secret set PROVIDER_API_KEY`.
- Simpan workflow ini sebagai `.github/workflows/lagune-audit.md`, dengan mengganti `<model>` dengan salah satu model penyedia Anda yang mendukung tool calling, dan `<your-prompt>` dengan salah satu [contoh prompt](#prompt-examples):

  ```md
  ---
  on:
    schedule:
      - cron: '0 9 * * 1'
  permissions:
    contents: read
  engine:
    id: copilot
    model: <model>
    env:
      COPILOT_PROVIDER_TYPE: <type>
      COPILOT_PROVIDER_BASE_URL: <url>
      COPILOT_PROVIDER_API_KEY: ${{ secrets.PROVIDER_API_KEY }}
  skills:
    - wellwelwel/lagune@v0.19.0
  network:
    allowed:
      - defaults
      - node
  tools:
    edit:
    bash: [npx]
  safe-outputs:
    create-pull-request:
  ---

  <your-prompt>

  Lalu buka pull request berisi perubahanmu.
  ```

  | Penyedia                                                              | `<type>`    | `<url>`                                              |
  | --------------------------------------------------------------------- | ----------- | ---------------------------------------------------- |
  | **OpenAI**                                                            | `openai`    | `https://api.openai.com/v1`                          |
  | **Anthropic**                                                         | `anthropic` | `https://api.anthropic.com`                          |
  | API apa pun yang kompatibel dengan **OpenAI**, seperti **OpenRouter** | `openai`    | URL dasarnya, seperti `https://openrouter.ai/api/v1` |

- Jalankan `gh aw compile` lalu commit workflow tersebut bersama file `.lock.yml` yang dihasilkannya.

**Di cloud**, audit tetap berjalan meski komputer Anda mati:

- Commit **Lagune** dengan [instalasi universal](https://lagune.ai/id-ID/docs/install/universal), bukan dengan plugin.
- Ketik `/schedule` di sesi **Claude Code** lalu jelaskan auditnya, atau buat di [claude.ai/code/routines](https://claude.ai/code/routines).

**Di komputer Anda**, audit memakai plugin yang Anda instal untuk diri sendiri:

- Buat tugas lokal di halaman **Scheduled tasks** pada aplikasi desktop.
- Izinkan engine sejak awal, seperti yang ditunjukkan [halaman instalasi](https://lagune.ai/id-ID/docs/install/claude-code), karena tidak ada orang yang bisa menyetujui tool-nya saat tugas berjalan.
- Tugas hanya berjalan selama aplikasi terbuka dan komputer Anda tidak dalam mode tidur.

Tugas terjadwal dibuat di aplikasi desktop **ChatGPT**, bukan di **Codex CLI**, dan berjalan di komputer Anda:

- Di chat **Codex**, jelaskan auditnya, kapan harus berjalan, dan bahwa setiap eksekusi memulai chat baru. Hasilnya masuk ke **Scheduled**.
- Di prompt, sebut setiap perintah dengan `$`, seperti `$lagune:lagune-detect`, agar setiap eksekusi memanggilnya secara eksplisit.
- Pilih proyek lokal Anda, bukan worktree baru, karena worktree baru dimulai tanpa engine yang Anda [instal di proyek Anda](https://lagune.ai/id-ID/docs/install/codex).
- Tugas hanya berjalan selama aplikasi terbuka, komputer Anda menyala, dan proyeknya ada di disk.

Automations di **Cursor** berjalan di cloud, bahkan saat komputer Anda mati:

- Commit **Lagune** dengan [instalasi universal](https://lagune.ai/id-ID/docs/install/universal), bukan dengan plugin.
- Buat automation di [cursor.com/automations](https://cursor.com/automations), atau jelaskan dengan `/automate` di sesi agen, lalu beri trigger terjadwal.
- Pilih repositori Anda, karena trigger terjadwal dimulai tanpa repositori.

Automations di **Antigravity** berjalan di komputer Anda, masing-masing dalam percakapan baru:

- Buka tab **Automations** di aplikasi **Antigravity** dan buat automation terjadwal untuk proyek Anda, atau minta agen menyiapkannya.
- Izinkan engine sejak awal, seperti yang ditunjukkan [halaman instalasi](https://lagune.ai/id-ID/docs/install/antigravity-cli), karena tidak ada orang yang bisa menyetujui tool-nya saat automation berjalan.
- Gunakan automation, bukan `/schedule`, yang hanya bertahan selama percakapannya berlangsung.
- Automation hanya berjalan selama **Antigravity** berjalan.

**OpenCode** tidak punya penjadwal sendiri, jadi audit berjalan dari **GitHub Actions**, di cloud:

- Commit **Lagune** di `opencode.json` milik repositori, seperti yang ditunjukkan [halaman instalasi](https://lagune.ai/id-ID/docs/install/opencode).
- Jalankan `opencode github install` untuk menghubungkan aplikasi GitHub **OpenCode** dan menyimpan kunci penyedia model Anda.
- Tambahkan workflow yang meneruskan prompt ke **OpenCode** sesuai jadwal, di sini setiap Senin pukul 09.00 UTC, dengan mengisi `<KEY>` dan `<provider>/<model>` seperti di workflow yang dibuat `opencode github install`, serta `<your-prompt>` dengan salah satu [contoh prompt](#prompt-examples):

  ```yaml
  name: Lagune Audit

  on:
    schedule:
      - cron: '0 9 * * 1'

  jobs:
    audit:
      runs-on: ubuntu-latest
      permissions:
        id-token: write
        contents: read
      steps:
        - uses: actions/checkout@v6
          with:
            persist-credentials: false

        - uses: anomalyco/opencode/github@latest
          env:
            <KEY>: ${{ secrets.<KEY> }}
          with:
            model: <provider>/<model>
            prompt: |
              <your-prompt>
  ```

### Contoh prompt \{#prompt-examples}

**💧 Hanya laporan**

Memetakan risiko baru, merencanakan perbaikannya, dan memeriksa ulang kontrol yang sudah diterapkan, tanpa mengubah kode Anda:

```md
Jalankan perintah berikut satu per satu: `/lagune-detect` dan `/lagune-plan`. Jika proyek memiliki catatan hardening, jalankan juga `/lagune-verify`.

Jangan ubah kode proyek. Di akhir, rangkum temuan baru dan setiap kontrol yang sudah diterapkan tetapi tidak lagi bertahan.
```

**🌊 Siklus penuh**

Juga menerapkan perbaikan yang direncanakan dan membuktikan bahwa masing-masing bertahan, jadi tinjau perubahannya sebelum masuk ke branch utama Anda:

```md
Jalankan perintah berikut satu per satu: `/lagune-detect`, `/lagune-plan`, `/lagune-harden`, dan `/lagune-verify`.

Di akhir, rangkum perbaikan yang diterapkan dan temuan yang masih terbuka.
```
