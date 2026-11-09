# Spec-Driven Development: amankan apa yang dibangun dari spesifikasi Anda

> Pasangkan Lagune dengan Superpowers, Spec Kit, atau OpenSpec: tetapkan charter dari spesifikasi Anda, lalu implementasikan dengan /lagune agar keamanan setiap tugas diperkuat saat kodenya ditulis.

Kanonis: https://lagune.ai/id-ID/docs/examples/spec-driven-development
Bahasa: id-ID
Asli: https://lagune.ai/docs/examples/spec-driven-development
Terakhir diperbarui: 2026-11-09

Pasangkan **Lagune** dengan tool Spec-Driven Development, seperti [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit), atau [**OpenSpec**](https://github.com/Fission-AI/OpenSpec): tool Anda menentukan apa yang dibangun, dan **Lagune** menentukan cara menjaganya tetap aman.

## Cara memadukannya

**Lagune** masuk ke alur tool Anda di dua titik, tanpa mengubah bagian lainnya:

1. Setelah tool Anda menulis spesifikasi, [`/lagune-charter`](https://lagune.ai/id-ID/docs/commands/charter) membacanya dan menetapkan prinsip keamanan yang dibutuhkan fitur tersebut, sebelum ada kode apa pun.
2. Saat ditambahkan ke perintah implementasi tool Anda, [`/lagune`](https://lagune.ai/id-ID/docs/commands/lagune) memperkuat keamanan setiap tugas sesuai prinsip tersebut seiring kodenya ditulis.

**Tips**

Ganti path spesifikasi di setiap contoh dengan file yang ditulis tool Anda. Jika proyek sudah memiliki charter, langkah yang sama memperbaruinya dengan apa yang dibutuhkan fitur baru.

## Contoh prompt

Kirim prompt secara berurutan, masing-masing setelah prompt sebelumnya selesai.

```prompt
/superpowers:brainstorming Checkout sebagai tamu dengan pembayaran kartu.
```

```prompt
/lagune-charter docs/superpowers/specs/2026-11-09-guest-checkout-design.md
```

```prompt
/superpowers:writing-plans
```

```prompt
/superpowers:executing-plans /lagune
```

```prompt
/speckit.specify Checkout sebagai tamu dengan pembayaran kartu.
```

```prompt
/lagune-charter specs/001-guest-checkout/spec.md
```

```prompt
/speckit.plan
```

```prompt
/speckit.tasks
```

```prompt
/speckit.implement /lagune
```

```prompt
/opsx:propose add-guest-checkout
```

```prompt
/lagune-charter openspec/changes/add-guest-checkout/proposal.md
```

```prompt
/opsx:apply /lagune
```

```prompt
/opsx:archive
```
