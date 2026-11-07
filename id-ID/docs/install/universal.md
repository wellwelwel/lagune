# Cara menginstal Lagune di agen mana pun dengan skills.sh atau GitHub CLI

> Instal Lagune di agen AI mana pun dengan skills CLI atau GitHub CLI, dan jaga agar tetap terbaru.

Kanonis: https://lagune.ai/id-ID/docs/install/universal
Bahasa: id-ID
Asli: https://lagune.ai/docs/install/universal
Terakhir diperbarui: 2026-11-07

**skills.sh**

Instal perintah **Lagune** di proyek Anda dari terminal dengan [**skills.sh**](https://www.skills.sh/wellwelwel/lagune), dan biarkan cakupan instalasinya tetap **Project**:

```bash
npx skills add wellwelwel/lagune --skill '*'
```

Atau tempel prompt ini ke agen Anda:

```md
Jalankan `npx --yes skills add wellwelwel/lagune` dan ikuti sekarang juga instruksi skill yang dihasilkannya. Baca seluruh output-nya, alihkan dulu ke file sementara jika perlu. Tentukan path relatif berdasarkan direktori file pendukung yang diberikannya.
```

**GitHub CLI**

Instal perintah **Lagune** di proyek Anda dari terminal dengan [**GitHub CLI**](https://cli.github.com/) 2.90.0 atau yang lebih baru:

```bash
gh skill install wellwelwel/lagune --all --scope project
```

Atau tempel prompt ini ke agen Anda:

```md
Jalankan `gh skill install wellwelwel/lagune --all --scope project` dan baca seluruh output-nya, alihkan dulu ke file sementara jika perlu.
```

## Pembaruan

**skills.sh**

Untuk memperbarui **Lagune**, jalankan:

```bash
npx skills update
```

Atau tempel prompt ini ke agen Anda:

```md
Jalankan `npx --yes skills update -y` dan baca seluruh output-nya, alihkan dulu ke file sementara jika perlu.
```

**GitHub CLI**

Untuk memperbarui **Lagune**, jalankan:

```bash
gh skill update --all
```

Atau tempel prompt ini ke agen Anda:

```md
Jalankan `gh skill update --all` dan baca seluruh output-nya, alihkan dulu ke file sementara jika perlu.
```

---

**Sandbox**

Di sandbox tanpa akses jaringan, perintah tidak bisa mengunduh engine. Instal engine di proyek Anda dari terminal Anda sendiri, sekali di awal dan lagi setelah setiap pembaruan:

```bash
npm i -D lagune@0.18.1
```

## Pertanyaan yang sering diajukan

### Bagaimana cara menginstal Lagune di agen AI mana pun?

Jalankan npx skills add wellwelwel/lagune --skill '*' atau gh skill install wellwelwel/lagune --all --scope project di proyek Anda, atau tempel prompt instalasi ke agen Anda.

### Bagaimana cara memperbarui Lagune di agen AI mana pun?

Jalankan npx skills update jika Anda menginstalnya dengan skills.sh, atau gh skill update --all jika Anda menginstalnya dengan GitHub CLI. Anda juga bisa menempelkan prompt pembaruan ke agen Anda.

### Apakah saya bisa menginstal Lagune melalui lebih dari satu jalur?

Tidak. Jika Anda menginstalnya melalui dua jalur, agen menampilkan setiap perintah dua kali, atau memakai satu salinan dan menyembunyikan yang lain.
