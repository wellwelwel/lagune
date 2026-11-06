# Hook agent: deteksi loop agen tanpa batas

> Pindai basis kode untuk menemukan panggilan agen dan LLM tanpa batas langkah atau waktu, atau nilai satu panggilan, langsung dari command line.

Kanonis: https://lagune.ai/id-ID/docs/hooks/agent
Bahasa: id-ID
Asli: https://lagune.ai/docs/hooks/agent
Terakhir diperbarui: 2026-11-06

Hook `agent` menandai **runtime agen yang berulang tanpa batas giliran, anggaran, atau waktu**, celah otonomi tak terkendali yang mengubah input yang sengaja dirancang menjadi biaya tanpa batas atau eskalasi prompt injection. Hook ini **mengenali bahasa** dan mencakup dua ekosistem framework agen: **JavaScript** (runtime `query` dari SDK agen **Claude**) dan **Python** (**LangChain**, **LangGraph**, **CrewAI**, **OpenAI Agents**). Hook ini adalah engine deterministik di balik [spesialisasi `llm`](https://lagune.ai/id-ID/docs/catalog), dan Anda bisa menjalankannya sendiri dalam mode **scan** atau **check**.

## Menjalankan

**Pindai basis kode**

```bash
npx lagune read agent                # scans the whole project
npx lagune read agent --dir src/ai   # scans a directory
npx lagune read agent --file chat.ts # scans a single file
```

**Periksa satu panggilan**

```bash
npx lagune read agent --lang javascript --pattern 'query({ prompt })'                           # => uncapped
npx lagune read agent --lang javascript --pattern 'query({ prompt, options: { maxTurns: 5 } })' # => safe
npx lagune read agent --lang python --pattern 'AgentExecutor(agent=a, max_iterations=None)'     # => uncapped
```

Setiap baris di bawah **Uncapped agent loops found**, di file yang mengimpor SDK agen, adalah salah satu dari dua hal: runtime `query` dari SDK agen Claude yang dipanggil tanpa batas giliran, anggaran, atau waktu (JavaScript, tanpa batas secara bawaan), atau penghapusan eksplisit batas bawaan sebuah framework, seperti `max_iterations=None` / `max_turns=None` (Python, dengan batas secara bawaan). Keduanya keluar dengan kode bukan nol. Di Vercel AI SDK, `generateText`/`streamText` secara bawaan hanya menjalankan satu langkah (`stopWhen: stepCountIs(1)`), jadi panggilan polos di sana tidak bisa berulang dan tidak ditandai, dan `db.query(...)` biasa tidak pernah dikira panggilan agen. Proses yang bersih mencetak `no uncapped agent loops found`.

## Cara membaca putusan

| Putusan    | Arti                                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `uncapped` | Panggilan runtime `query` tanpa batas (JS), atau penghapusan batas secara eksplisit (`=None`, Py).                    |
| `safe`     | Panggilan `query` yang menetapkan batas, generasi satu langkah, atau panggilan framework yang dibatasi secara bawaan. |
| `invalid`  | Potongan kode tidak berisi panggilan agen yang bisa dikenali untuk dinilai.                                           |

### Opsi CLI

| Opsi        | Nilai         | Deskripsi                                                                          |
| ----------- | ------------- | ---------------------------------------------------------------------------------- |
| `--pattern` | potongan kode | Memeriksa satu panggilan. Ulangi untuk memeriksa beberapa, satu putusan per baris. |
| `--lang`    | sebuah bahasa | Wajib bersama `--pattern`: `javascript` atau `python`.                             |
| `--dir`     | direktori     | Membatasi pemindaian ke satu direktori. Bisa diulang dan digabung dengan `--file`. |
| `--file`    | file          | Membatasi pemindaian ke satu file. Bisa diulang dan digabung dengan `--dir`.       |

Tanpa opsi apa pun, hook ini memindai seluruh proyek. `--pattern` memerlukan `--lang` dan tidak bisa digabung dengan `--dir` atau `--file`.

### Pilih apa yang dipindai

Hook ini melewati apa yang diabaikan **Git**. Untuk melewati lebih banyak, atau untuk memindai apa yang diabaikan **Git**, beri `agent` pengaturannya sendiri:

```bash
npx lagune write add --ignore test/fixtures --checker agent
```

```json
{
  "checkers": {
    "agent": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Konfigurasi hook](https://lagune.ai/id-ID/docs/hooks/configure) membahas semua pengaturannya.

**Upaya terbaik, tidak menyeluruh**

Loop agen yang dibuat sendiri, dalam bahasa apa pun, berada di luar jangkauan pemindaian statis. Anggap ini sebagai dasar yang kuat, bukan inventaris yang lengkap.

**Tips**

Hook ini hanya memutuskan soal batas: pembatasan kemampuan, pencampuran tingkat kepercayaan, dan otorisasi adalah soal penilaian yang tetap dicakup oleh [spesialisasi `llm`](https://lagune.ai/id-ID/docs/catalog).

## Pertanyaan yang sering diajukan

### Kenapa loop agen perlu dibatasi?

Agen tanpa batas bisa digiring ke rekursi, biaya, atau eskalasi prompt injection yang tak berujung. Menetapkan maxTurns/maxBudgetUsd/stopWhen/signal membatasinya, dan hook agent menandai panggilan runtime query yang tidak menetapkan satu pun.
