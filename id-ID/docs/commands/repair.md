# /lagune-repair: perbaiki pelacakan temuan yang rusak

> Perbaiki rantai saat file yang diganti namanya atau dipindahkan mengacaukan pelacakan Lagune.

Kanonis: https://lagune.ai/id-ID/docs/commands/repair
Bahasa: id-ID
Asli: https://lagune.ai/docs/commands/repair
Terakhir diperbarui: 2026-11-06

🧰 Perbaiki rantai saat file yang diganti namanya atau dipindahkan mengacaukannya.

**Pemeliharaan internal, bukan fase keamanan**

Repair bukan fase keenam dalam alur linear. Tugasnya menjaga pelacakan tetap koheren.

```prompt
# Tidak menerima input: selalu memperbaiki seluruh rantai
/lagune-repair
```

## Cara kerjanya

Setiap temuan detect adalah satu item yang dilacak dan dibawa terus oleh plan, harden, dan verify, yang masing-masing menindaklanjutinya dan melaporkannya kembali dengan namanya. Nama itu, yang ditulis persis sama sebagai judul bagian di setiap artefak, menjadi identitasnya dari awal sampai akhir.

Satu-satunya hal yang mudah berubah yang disimpan pelacakan adalah path file yang ditunjuk item tersebut. Path itu tidak disimpan di tempat lain, jadi file yang diganti namanya atau dipindahkan hanya bisa memutus tautannya di sana, tidak pernah di dua salinan yang saling berbeda. Saat itu terjadi, repair memperbaiki peta (`.lagune/tracking.json`) agar identitas item tetap bertahan setelah penggantian nama. Repair membaca artefak dan peta pelacakan, membaca kode sumber Anda hanya untuk mengetahui path baru dari file yang diganti namanya, dan tidak pernah menulis konten keamanan.

Dalam proses yang sama, repair memeriksa setiap artefak memori terhadap templatnya dan melaporkan apa yang menyimpang, sambil menunjukkan fase yang bertugas memperbaiki setiap penyimpangan.

**Tips**

- Repair tidak menyentuh kode Anda maupun artefak berbentuk prosa, hanya pelacakan.
- Anda jarang perlu menjalankannya secara manual. Saat sebuah fase mendapati rantainya tidak konsisten, fase itu menjalankan repair untuk Anda lalu melanjutkan pekerjaannya.
- Pelacakan yang dikelolanya ada di `.lagune/tracking.json`, state internal yang tidak pernah Anda edit secara manual.
