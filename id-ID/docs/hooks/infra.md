# Hook infra: deteksi miskonfigurasi IaC

> Pindai Terraform, Dockerfile, dan GitHub Actions untuk menemukan miskonfigurasi, atau nilai satu potongan kode, langsung dari command line.

Kanonis: https://lagune.ai/id-ID/docs/hooks/infra
Bahasa: id-ID
Asli: https://lagune.ai/docs/hooks/infra
Terakhir diperbarui: 2026-11-06

Hook `infra` menandai **miskonfigurasi infrastructure as code** yang bisa dipastikan dari file-nya saja: jaringan yang terbuka untuk seluruh dunia, izin wildcard, secret di dalam manifest, container yang berjalan sebagai root, nilai tidak tepercaya di shell CI. Hook ini hanya membaca file IaC (`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`). Hook ini adalah engine deterministik di balik [spesialisasi `infra`](https://lagune.ai/id-ID/docs/catalog), dalam mode **scan** atau **check**.

## Menjalankan

**Pindai basis kode**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**Periksa potongan kode**

Berikan potongan kode dengan `--pattern` dan jenisnya dengan `--kind` (`terraform`, `dockerfile`, atau `github-actions`).

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

Pemindaian mencetak hingga dua bagian. **Infrastructure risks found** keluar dengan kode bukan nol dan berisi cacat yang bisa dipastikan (ingress `0.0.0.0/0` di port sensitif, pernyataan IAM wildcard, secret di manifest, `encrypted = false`, modul git yang versinya tidak dikunci, image yang secara eksplisit berjalan sebagai root, `curl | sh`, injeksi skrip di CI, `permissions: write-all`). **Infrastructure hardening advisories** tidak mengubah kode keluar (tag base image yang bisa berubah, action yang dikunci dengan tag). Proses yang bersih mencetak `no infrastructure risks found`.

## Cara membaca putusan

Mode check mencetak tag dengan tingkat keparahan tertinggi yang cocok (misalnya `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`), tag peringatan (`mutable-tag`, `unpinned-action`), atau `safe`. Hanya tag dengan tingkat keparahan temuan yang keluar dengan kode bukan nol.

### Opsi CLI

| Opsi        | Nilai                                           | Deskripsi                                                                           |
| ----------- | ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| `--pattern` | potongan kode                                   | Memeriksa satu potongan kode. Memerlukan `--kind`. Ulangi untuk memeriksa beberapa. |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | Jenis yang dipakai untuk menilai potongan kode.                                     |
| `--dir`     | direktori                                       | Membatasi pemindaian ke satu direktori. Bisa diulang dan digabung dengan `--file`.  |
| `--file`    | file                                            | Membatasi pemindaian ke satu file. Bisa diulang dan digabung dengan `--dir`.        |

Tanpa opsi apa pun, hook ini memindai setiap file IaC di proyek. `--pattern` tidak bisa digabung dengan `--dir` atau `--file`.

### Pilih apa yang dipindai

Hook ini melewati apa yang diabaikan **Git**. Untuk melewati lebih banyak, atau untuk memindai apa yang diabaikan **Git**, beri `infra` pengaturannya sendiri:

```bash
npx lagune write add --ignore examples --checker infra
```

```json
{
  "checkers": {
    "infra": { "gitignore": false, "ignore": ["examples"] }
  }
}
```

[Konfigurasi hook](https://lagune.ai/id-ID/docs/hooks/configure) membahas semua pengaturannya.

**Tips**

Hook ini menangkap kasus yang gamblang dan bisa dipastikan: enkripsi yang tidak ada, paparan `pull_request_target`, dan cakupan IAM yang tepat adalah soal penilaian yang tetap dicakup oleh [spesialisasi `infra`](https://lagune.ai/id-ID/docs/catalog).

## Pertanyaan yang sering diajukan

### File infrastruktur apa saja yang dibaca hook infra?

Terraform/HCL (.tf, .tf.json, .hcl), Dockerfile, serta YAML workflow dan action GitHub Actions di bawah .github/. Hook ini menjangkau file tersebut meskipun pemindai kode sumber melewatinya.
