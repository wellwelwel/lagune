# Skill keamanan untuk agen AI

> Skill yang didapat agen AI Anda dengan Lagune: audit proyek yang sudah ada atau amankan pekerjaan baru selagi Anda membangunnya, semuanya diatur oleh charter.

Kanonis: https://lagune.ai/id-ID/docs/get-started/commands
Bahasa: id-ID
Asli: https://lagune.ai/docs/get-started/commands
Terakhir diperbarui: 2026-11-06

Setelah **Lagune** [terinstal](https://lagune.ai/id-ID/docs), agen **AI** Anda mendapatkan sejumlah skill. Ada dua cara memakainya, dan keduanya diatur oleh **charter**: mengamankan pekerjaan baru selagi Anda membangunnya, atau menjalankan audit penuh pada sebuah proyek.

**⌨️ Membangun / pengembangan**

Anda tidak perlu menyelesaikan pekerjaan sebelum mengamankannya. Gunakan [**`/lagune`**](https://lagune.ai/id-ID/docs/commands/lagune) untuk pekerjaan yang sedang Anda tulis **saat ini**:

| Skill                                         | Apa yang dilakukannya untuk Anda                                                              |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [**/lagune-charter**](https://lagune.ai/id-ID/docs/commands/charter) | Menetapkan aturan keamanan proyek Anda, fondasi yang menjadi acuan `/lagune` saat membangun   |
| [**/lagune**](https://lagune.ai/id-ID/docs/commands/lagune)          | Membangun apa yang Anda minta dan memperkuat keamanannya selagi ditulis, dipandu oleh charter |

**Gunakan kapan saja**

[**`/lagune`**](https://lagune.ai/id-ID/docs/commands/lagune) mematuhi aturan charter Anda setiap kali dijalankan. Perintah ini menerima prompt apa pun, membangun apa yang Anda minta, dan memperkuatnya dengan default yang aman sambil jalan, bukan belakangan.

---

#### Skill khusus

| Skill                                               | Fungsinya                                                                          |
| --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/id-ID/docs/commands/specialize) | Mengajari **Lagune** spesialisasi keamanan baru dari artikel, eksploit, atau topik |

**🔬 Audit: alur Blue Team**

**Alur Blue Team** lengkap: membaca apa yang dilakukan sebuah proyek, memetakan risikonya, lalu menutupnya. Setiap skill dibangun di atas skill sebelumnya, jadi Anda cukup mengikuti daftar ini dari atas ke bawah:

| #   | Skill                                         | Apa yang dilakukannya untuk Anda                                                             |
| --- | --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | [**/lagune-charter**](https://lagune.ai/id-ID/docs/commands/charter) | Menetapkan aturan keamanan proyek Anda, diusulkan untuk Anda atau dibentuk dari arahan Anda  |
| 2   | [**/lagune-detect**](https://lagune.ai/id-ID/docs/commands/detect)   | Membaca kode Anda dan memetakan apa yang dilakukan sistem Anda serta di mana risikonya       |
| 3   | [**/lagune-plan**](https://lagune.ai/id-ID/docs/commands/plan)       | Mengubah temuan detect menjadi rencana pertahanan, dengan satu perbaikan untuk setiap temuan |
| 4   | [**/lagune-harden**](https://lagune.ai/id-ID/docs/commands/harden)   | Menerapkan perbaikan dari rencana ke kode Anda, dengan aman dan satu per satu                |
| 5   | [**/lagune-verify**](https://lagune.ai/id-ID/docs/commands/verify)   | Membuktikan setiap perbaikan yang diterapkan tetap efektif, lalu menuntaskan yang terbukti   |

---

#### Skill khusus

| Skill                                               | Fungsinya                                                                                                                                       |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/id-ID/docs/commands/specialize) | Mengajari **Lagune** spesialisasi keamanan baru dari artikel, eksploit, atau topik                                                              |
| [**/lagune-prove**](https://lagune.ai/id-ID/docs/commands/prove)           | Mengubah setiap temuan yang terdeteksi menjadi pembuktian yang bisa dijalankan dan khusus pertahanan, untuk pengungkapan yang bertanggung jawab |

---

#### Skill internal

| Skill                                       | Fungsinya                                 |
| ------------------------------------------- | ----------------------------------------- |
| [**/lagune-repair**](https://lagune.ai/id-ID/docs/commands/repair) | Memperbaiki pelacakan internal **Lagune** |

**Tips**

Keamanan bukan biaya, melainkan investasi: apa yang Anda tanamkan di awal akan Anda hemat berkali-kali lipat dari insiden yang tidak pernah terjadi 🙋🏻‍♂️

## Pertanyaan yang sering diajukan

### Skill apa saja yang ditambahkan Lagune?

Perintah /lagune untuk memperkuat keamanan pekerjaan selagi Anda membangunnya, dan alur audit Blue Team lima fase: /lagune-charter, /lagune-detect, /lagune-plan, /lagune-harden, /lagune-verify. Ada juga /lagune-specialize dan /lagune-prove.

### Apa itu alur Blue Team Lagune?

Audit lima fase: charter (menetapkan aturan), detect (memetakan risiko), plan (memberi skor dan merencanakan perbaikan), harden (menerapkan perbaikan), verify (membuktikan perbaikan tetap efektif lalu menuntaskannya).

### Apa bedanya /lagune dengan alur audit?

Perintah /lagune mengamankan pekerjaan baru selagi Anda menulisnya, tanpa alur yang harus diikuti. Alur audit menjalankan kelima fase secara berurutan pada proyek yang sudah ada.
