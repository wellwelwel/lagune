# /lagune-specialize: latih spesialisasi keamanan dengan teks biasa

> Sarikan sumber atau topik keamanan yang Anda berikan menjadi spesialisasi baru yang dimuat hanya saat dibutuhkan.

Kanonis: https://lagune.ai/id-ID/docs/commands/specialize
Bahasa: id-ID
Asli: https://lagune.ai/docs/commands/specialize
Terakhir diperbarui: 2026-11-06

🎓 Ajari **Lagune** spesialisasi baru, dari sumber atau topik yang Anda berikan.

Specialize membaca materinya dan menyarikannya menjadi spesialisasi yang terfokus dan khusus pertahanan, dengan bentuk yang persis sama seperti [spesialisasi bawaan](https://lagune.ai/id-ID/docs/catalog), sehingga fase detect dan verify kemudian memuatnya seperti spesialisasi lainnya. Specialize hanya mengaudit dan menjelaskan: tidak pernah menulis input serangan atau eksploit, dan tidak pernah menyentuh kode Anda.

**Dari artikel**

```prompt
# Tautan atau referensi: Lagune menyarikannya menjadi pertahanan
/lagune-specialize https://owasp.org/www-community/attacks/SQL_Injection
```

**Dari eksploit**

```prompt
# Serangan sebagai sumber: spesialisasinya tetap berupa pertahanan
/lagune-specialize "' OR 1=1 -- menyisipkan SQL ke dalam teks query"
```

**Dari topik**

```prompt
# Atau cukup sebutkan apa yang perlu dicakup
/lagune-specialize SQL injection
```

**Serangan boleh menjadi sumber, tidak pernah menjadi hasil**

Mengarahkannya ke sebuah serangan tidak masalah jika tujuannya untuk bertahan dari serangan itu: tulisan tentang eksploit adalah bahan belajar yang disarikannya menjadi pertahanan. Spesialisasi yang dihasilkannya selalu mengaudit dan menjelaskan, dan tidak pernah menghasilkan eksploit yang berfungsi, payload, atau cara menghindari deteksi.

## Apa yang ditulisnya

Hasilnya berupa dua file di proyek Anda, yang di-commit dan bisa ditinjau bersama kode Anda:

- Spesialisasinya di `.lagune/catalog/<name>.md`, dengan bentuk seperti [spesialisasi bawaan](https://lagune.ai/id-ID/docs/catalog).
- Entrinya di `.lagune/configs.json`, tempat proyek Anda mengindeks spesialisasinya sendiri agar katalog bisa menggabungkannya dengan spesialisasi bawaan.

Setelah itu, specialize menampilkan daftar katalog untuk memastikan entri baru sudah ada. Spesialisasi milik Anda selalu ada di katalog, apa pun kategorinya. Anda tidak pernah menambahkan perintah atau menyentuh paket: spesialisasi baru hanyalah satu file pengetahuan ditambah satu entri indeks, yang ditulis ke proyek Anda sendiri.

## Menyempurnakan, tidak pernah menimpa

Membuat spesialisasi dengan nama yang sudah ada, baik spesialisasi bawaan seperti `regex` maupun spesialisasi yang pernah Anda buat, akan **menyelaraskan** file yang ada dengan kondisi terkini alih-alih menggantinya. Specialize membaca isi yang ada, memasukkan pengetahuan baru, mempertahankan yang masih berlaku, dan menulis ulang yang berubah. Tidak ada yang dibuang tanpa dibaca. Spesialisasi milik Anda menggantikan spesialisasi bawaan yang bernama sama, sehingga Anda bisa mempertajam spesialisasi bawaan untuk proyek Anda sendiri tanpa kehilangannya.

**Tips**

- Spesialisasi baru dimuat persis seperti spesialisasi bawaan: fase detect dan verify memakainya hanya saat dibutuhkan, atau muat sendiri dengan `npx lagune read catalog <name>` lalu beri tugas.
- Jika materinya punya asal yang jelas (sebuah artikel, penulis, tautan, atau standar), spesialisasi mencantumkan kreditnya. Topik saja tidak membawa sumber.

**Catatan**

**Specialize hanya berjalan saat Anda memanggilnya:** agen tidak pernah memulainya atas inisiatif sendiri.

## Pertanyaan yang sering diajukan

### Bagaimana cara menambahkan spesialisasi keamanan kustom?

Jalankan /lagune-specialize dengan sebuah sumber atau topik. Perintah ini menyarikannya menjadi spesialisasi khusus pertahanan, yang ditulis ke .lagune/catalog/<name>.md beserta entrinya di .lagune/configs.json.

### Apakah Lagune bisa belajar dari tulisan tentang eksploit?

Bisa, sebagai sumber, tidak pernah sebagai hasil. Serangan boleh menjadi sumber, tidak pernah menjadi produknya. Specialize tidak pernah menulis input serangan atau eksploit.

### Apakah specialize menimpa spesialisasi bawaan?

Tidak. Specialize menyempurnakan, tidak pernah menimpa.
