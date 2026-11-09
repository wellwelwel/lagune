# Instal: hardening keamanan untuk agen AI apa pun

> Instal Lagune di proyek apa pun, sebagai plugin jika agen Anda mendukungnya atau dengan skills CLI di agen lainnya, lalu pilih spesialisasi keamanan yang sesuai dengan proyek tersebut.

Kanonis: https://lagune.ai/id-ID/docs
Bahasa: id-ID
Asli: https://lagune.ai/docs
Terakhir diperbarui: 2026-11-09

**Lagune** membantu agen AI Anda membuat proyek lebih aman. Anda cukup mengarahkannya ke kode Anda, lalu agen mencari tahu apa yang sebenarnya dilakukan sistem Anda dan memandu Anda menjalankan pekerjaan keamanan yang penting bagi sistem tersebut. **Lagune** adalah proyek pertama dari metodologi [Security-Driven Hardening (SDH)](https://lagune.ai/id-ID/docs/references/paper).

**Dukung open source**

Suka **Lagune**? [Beri kami ⭐ di **GitHub**](https://github.com/wellwelwel/lagune)

## Pilih agen Anda

- [Claude Code](https://lagune.ai/id-ID/docs/install/claude-code): Tool coding agentic dari Anthropic
- [Codex](https://lagune.ai/id-ID/docs/install/codex): Agen coding dari OpenAI
- [Cursor](https://lagune.ai/id-ID/docs/install/cursor): Editor kode berbasis AI
- [GitHub Copilot](https://lagune.ai/id-ID/docs/install/github-copilot-cli): Pair programmer AI dari GitHub
- [Gemini CLI](https://lagune.ai/id-ID/docs/install/gemini-cli): Agen terminal open source dari Google
- [Antigravity](https://lagune.ai/id-ID/docs/install/antigravity-cli): Platform pengembangan agentic dari Google
- [OpenCode](https://lagune.ai/id-ID/docs/install/opencode): Agen coding open source
- [Devin for Terminal](https://lagune.ai/id-ID/docs/install/devin-cli): Agen terminal dari Cognition
- [Factory Droid](https://lagune.ai/id-ID/docs/install/factory-droid): Agen pengembangan perangkat lunak dari Factory
- [Grok Build](https://lagune.ai/id-ID/docs/install/grok-build): Agen coding dari xAI
- [Qwen Code](https://lagune.ai/id-ID/docs/install/qwen-code): Agen coding terminal dari Qwen
- [Kimi Code](https://lagune.ai/id-ID/docs/install/kimi-code): Agen coding dari Moonshot AI
- [Muse Code](https://lagune.ai/id-ID/docs/install/muse-code): Agen coding dari Meta
- [Pi](https://lagune.ai/id-ID/docs/install/pi): Agen coding minimalis untuk terminal
- [Hermes Agent](https://lagune.ai/id-ID/docs/install/hermes-agent): Agen open source dari Nous Research
- [Universal](https://lagune.ai/id-ID/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed dan 66 lainnya

**Info**

- Di balik layar, **Lagune** berjalan di **Node.js**, tetapi Anda bebas memakai bahasa apa pun.
- Untuk menjalankannya sepenuhnya offline, instal **Lagune** di proyek Anda dengan `npm i -D lagune@0.18.1`.

## Kategori

Pengetahuan keamanan **Lagune** hadir dalam bentuk [**spesialisasi**](https://lagune.ai/id-ID/docs/catalog), yang dikelompokkan ke dalam [**kategori**](https://lagune.ai/id-ID/docs/categories).

- **OWASP** (`owasp`): Memperkuat aplikasi terhadap risiko keamanan yang dipantau OWASP: injection, kontrol akses yang rusak, serta kegagalan autentikasi dan kriptografi
- **Infrastruktur** (`infra`): Memperkuat keamanan konfigurasi container, workload, dan serverless: Dockerfile, Compose, keamanan Pod, serta IAM dan trigger FaaS
- **AI / LLM** (`ai`): Memperkuat keamanan integrasi AI dan LLM terhadap prompt injection serta sambungan tool, agen, retrieval, dan MCP yang tidak aman
- **Lovable** (`lovable`): Memperkuat keamanan aplikasi Supabase buatan AI (Lovable dan sejenisnya): celah RLS, kunci service_role yang bocor, dan default yang tidak aman
- **JavaScript** (`javascript`): Memperkuat keamanan JavaScript dan runtime-nya terhadap RCE lewat eval dan child_process, path traversal, serta prototype pollution
- **Python** (`python`): Memperkuat keamanan Python terhadap RCE lewat deserialisasi pickle dan YAML, traversal string lewat str.format, serta class pollution
- **Rust** (`rust`): Memperkuat keamanan Rust terhadap API unsafe yang tidak sound, penyalahgunaan transmute, integer overflow, dan undefined behavior di batas FFI
- **Java** (`java`): Memperkuat keamanan Java terhadap gadget chain deserialisasi ObjectInputStream yang berujung pada eksekusi kode jarak jauh
- **Ruby** (`ruby`): Memperkuat keamanan Ruby terhadap gadget chain deserialisasi Marshal.load dan YAML yang berujung pada eksekusi kode jarak jauh
- **PHP** (`php`): Memperkuat keamanan PHP terhadap bypass autentikasi lewat type juggling, gadget chain object injection, dan default konfigurasi yang tidak aman
- **Go** (`go`): Memperkuat keamanan Go terhadap bug interface typed-nil, data races antar-goroutine, dan konkurensi yang tidak aman di jalur kode yang menyangkut keamanan
- **C / C++** (`c-cpp`): Memperkuat keamanan C dan C++ terhadap bug format string, buffer overflow, dan penulisan di luar batas memori yang membuka jalan bagi eksekusi kode
- **.NET** (`dotnet`): Memperkuat keamanan .NET dan C# terhadap RCE lewat deserialisasi BinaryFormatter dan bypass encoder yang berujung pada XSS

Jalankan `npx lagune write add --categories` dengan kunci kategori yang Anda pilih.

**Tips**

Setiap proyek dimulai dengan `owasp`, lalu perintah [`/lagune-charter`](https://lagune.ai/id-ID/docs/commands/charter) menambahkan kategori yang didukung oleh hasil pembacaannya atas proyek tersebut.

## Persyaratan

[**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) harus sudah terinstal di sistem Anda.

## Gunakan badge ✨

Memakai **Lagune**? Tambahkan salah satunya ke **README** Anda:

**Dua warna**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**Solid**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## Selanjutnya

Lihat apa yang dilakukan setiap [**skill**](https://lagune.ai/id-ID/docs/get-started/commands) milik **Lagune**.

## Pertanyaan yang sering diajukan

### Apa itu Lagune?

Lagune adalah alur kerja keamanan open source yang khusus pertahanan, yang membantu agen AI Anda memperkuat keamanan basis kode apa pun. Anda mengarahkannya ke kode Anda, Lagune mendeteksi apa yang sebenarnya dilakukan sistem Anda, lalu memandu perbaikan keamanan yang penting untuk konteks tersebut.

### Bagaimana cara menginstal Lagune?

Pilih agen Anda: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI, dan Hermes Agent menginstal Lagune sebagai plugin, Gemini CLI dan Qwen Code sebagai ekstensi, Pi sebagai paket, dan agen lain mana pun dengan npx skills add wellwelwel/lagune -y. Lagune bekerja di proyek baru maupun lama.

### Apakah Lagune memerlukan kunci API?

Tidak. Lagune berjalan melalui agen AI Anda sendiri, jadi tidak perlu kunci API.

### Apa saja persyaratannya?

Node.js (LTS) harus sudah terinstal di sistem Anda.

### Bahasa pemrograman apa saja yang didukung Lagune?

Semua. Di balik layar, Lagune berjalan di Node.js, tetapi Lagune mengaudit dan memperkuat keamanan proyek yang ditulis dalam bahasa pemrograman apa pun.

### Apa yang ditambahkan Lagune ke proyek saya?

Direktori .lagune/ yang berisi status keamanan proyek Anda, dibuat oleh perintah pertama yang menulis sesuatu. Selain itu, skills CLI menginstal perintah slash di proyek, tempat agen Anda membacanya, sedangkan plugin menyimpannya di dalam agen.

### Bagaimana cara memperbarui Lagune?

Sama seperti saat Anda menginstalnya. Halaman instalasi setiap agen menunjukkan cara memperbarui Lagune di agen tersebut, dan skills CLI memperbaruinya dengan npx skills update. Charter, artefak fase, dan spesialisasi milik Anda sendiri tetap utuh.

### Spesialisasi apa saja yang dipakai sebuah proyek?

Spesialisasi bawaan dari kategorinya, ditambah spesialisasi milik proyek itu sendiri. Charter mencatat kategori yang didukung oleh hasil pembacaannya atas proyek, dan npx lagune write add --categories mengubahnya.

### Apakah saya harus selesai membangun proyek sebelum mengamankannya?

Tidak. Perintah /lagune memperkuat keamanan pekerjaan Anda selagi ditulis: perintah ini menerima prompt apa pun, membangun apa yang Anda minta, lalu memperkuatnya dengan default yang aman, dipandu oleh charter. Alur Blue Team lima fase mengaudit apa yang sudah ada.

### Apakah Lagune bisa mengaudit proyek yang sudah ada?

Bisa. Alur Blue Team lima fase mengaudit apa yang sudah ada: charter menetapkan aturan keamanan Anda, detect memetakan apa yang dilakukan sistem dan di mana risikonya, plan memberi skor setiap temuan dan memasangkannya dengan perbaikan, harden menerapkan perbaikan, dan verify membuktikan perbaikan tersebut tetap efektif lalu menutupnya.

### Apa bedanya memakai Lagune dengan sekadar meminta agen memetakan kerentanan dan celah keamanan?

Agen yang membaca kode sendiri akan menemukan apa yang tampak seperti kerentanan dan melewatkan apa yang tampak seperti kontrol. Daftar alamat yang diblokir terlihat seolah risikonya sudah ditangani, sehingga tidak ada yang memeriksa bahwa daftar itu melewatkan sebagian besar alamat, dan kodenya pun dirilis. Lagune membalik kebiasaan itu: pengaman yang sudah ada di kode dianggap belum terbukti sampai diperiksa, setiap spesialisasi di katalog mendapat putusan yang eksplisit, dan verify menanyakan apakah risikonya sudah hilang, bukan apakah kontrolnya ada. Setiap temuan juga tetap menjadi satu item yang dilacak dari satu eksekusi ke eksekusi berikutnya, sehingga bisa dibuktikan tuntas lalu ditutup, sedangkan permintaan biasa memberi Anda laporan yang berbeda setiap kali tanpa ada yang bisa dibandingkan.

### Apa bedanya mengembangkan dengan Lagune dengan sekadar meminta agen menulis kode yang aman?

Meminta kode yang aman berarti menyerahkan arti aman kepada agen, dan mengandaikan Anda tahu apa yang harus diminta. Persyaratannya biasanya sudah ada di dalam permintaan Anda tanpa disadari oleh Anda maupun agen: meminta halaman yang menampilkan kursus yang boleh diakses seorang pengguna sudah menyatakan sebuah aturan otorisasi, dan pemeriksaan yang tidak pernah ditulis tidak meninggalkan apa pun di kode untuk disadari. Perintah /lagune memuat charter Anda dan spesialisasi yang cocok dengan apa yang akan dibangun sebelum baris pertama ditulis, lalu membaca ulang hasilnya berdasarkan pertahanan yang dipakainya. Bentuk yang aman jarang lebih mahal daripada yang tidak aman, jadi yang menentukan hasilnya adalah mengetahui mana yang harus dipilih, dan justru itulah yang tersedia sejak awal.

### Apakah Lagune menjalankan DAST (Dynamic Application Security Testing) atau mengetes aplikasi saya yang sedang berjalan?

Tidak. Lagune membaca kode dan tidak pernah menjalankan sistem Anda atau mengirim request yang sengaja dirancang ke sistem tersebut. Verify memastikan sebuah kontrol ada dan benar di kode sumber, dan itu pertanyaan yang berbeda dari apakah kontrol tersebut tahan terhadap serangan pada target yang sedang berjalan, sehingga "cannot tell from the code" adalah putusan yang sah, bukan sekadar diloloskan diam-diam. DAST menjawab pertanyaan saat runtime dan Lagune menjawab pertanyaan di kode sumber, jadi keduanya tidak saling menggantikan. Bahkan perintah prove yang opsional pun memegang batas ini: tesnya memastikan perilaku yang aman, tidak pernah memakai payload serangan.

### Apakah Lagune menggantikan pentest (penetration test)?

Tidak, sama sekali tidak! Pentest adalah penugasan resmi yang diizinkan, ketika seorang profesional menggunakan penilaiannya sendiri terhadap sistem Anda yang sedang berjalan, merangkai temuan dan menyelidiki logika bisnis yang tidak dijelaskan oleh aturan per permukaan serangan mana pun. Temuan dari pentest bisa masuk ke alur Blue Team Lagune sebagai kekhawatiran yang Anda serahkan ke detect, sehingga apa yang dilaporkan profesional tersebut direncanakan, diperkuat, dan diverifikasi.

## Kebijakan keamanan

Lihat [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md).

## Lisensi

**Lagune** dirilis di bawah [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE).

Copyright © 2026-sekarang [Weslley Araújo](https://github.com/wellwelwel) dan [kontributor](https://github.com/wellwelwel/lagune/graphs/contributors).
