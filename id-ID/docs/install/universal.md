# Cara menginstal Lagune di agen mana pun dengan skills.sh

> Instal Lagune di agen AI mana pun dengan skills CLI, dan jaga agar tetap terbaru.

Kanonis: https://lagune.ai/id-ID/docs/install/universal
Bahasa: id-ID
Asli: https://lagune.ai/docs/install/universal
Terakhir diperbarui: 2026-11-06

**Terminal**

Instal perintah **Lagune** dari terminal Anda dengan [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune
```

**Prompt**

Tempel prompt ini ke agen Anda:

```md
Jalankan `npx --yes skills add wellwelwel/lagune` dan ikuti sekarang juga instruksi skill yang dihasilkannya. Baca seluruh output-nya, alihkan dulu ke file sementara jika perlu. Tentukan path relatif berdasarkan direktori file pendukung yang diberikannya.
```

## Pembaruan

**Terminal**

Untuk memperbarui **Lagune**, jalankan:

```bash
npx skills update
```

**Prompt**

Untuk memperbarui **Lagune**, tempel prompt ini ke agen Anda:

```md
Jalankan `npx --yes skills update -y` dan baca seluruh output-nya, alihkan dulu ke file sementara jika perlu.
```

---

**Satu jalur instalasi per agen**

Instal **Lagune** melalui **skills.sh** atau melalui **plugin**-nya, jangan keduanya.

**Izin**

Setiap perintah menjalankan engine sebagai `npx --yes lagune@0.18.0`, dan [halaman instalasi setiap agen](https://lagune.ai/id-ID/docs) menunjukkan aturan untuk mengizinkannya sejak awal. Di sandbox tanpa akses jaringan, instal engine di proyek Anda dari terminal Anda sendiri, sekali di awal dan lagi setelah setiap pembaruan:

```bash
npm i -D lagune@0.18.0
```

## Pertanyaan yang sering diajukan

### Bagaimana cara menginstal Lagune di agen AI mana pun?

Jalankan npx skills add wellwelwel/lagune di proyek Anda, atau tempel prompt instalasi ke agen Anda.

### Bagaimana cara memperbarui Lagune yang diinstal dengan skills CLI?

Jalankan npx skills update, atau tempel prompt pembaruan ke agen Anda.

### Apakah saya bisa menginstal Lagune dengan skills CLI sekaligus plugin?

Tidak. Jika keduanya terpasang, agen menampilkan setiap perintah dua kali, atau memakai satu salinan dan menyembunyikan yang lain.
