# Hook interpreter: tandai sink eksekusi kode dinamis

> Pindai basis kode untuk menemukan sink eksekusi kode dinamis di berbagai bahasa, atau nilai satu potongan kode, langsung dari command line.

Kanonis: https://lagune.ai/id-ID/docs/hooks/interpreter
Bahasa: id-ID
Asli: https://lagune.ai/docs/hooks/interpreter
Terakhir diperbarui: 2026-11-06

Hook `interpreter` menandai **sink eksekusi kode dinamis**: konstruksi yang mengubah data menjadi kode yang dijalankan atau menyerahkannya ke shell, mulai dari `eval` hingga deserialisasi native. Hook ini mengenali bahasa dan membaca setiap file dengan aturan bahasanya sendiri. Hook ini juga engine deterministik di balik [spesialisasi `interpreter`](https://lagune.ai/id-ID/docs/catalog), yang bisa Anda jalankan sendiri dalam mode **scan** atau **check**.

## Menjalankan

**Pindai basis kode**

```bash
npx lagune read interpreter               # scans the whole project
npx lagune read interpreter --dir src     # scans a directory
npx lagune read interpreter --file app.py # scans a single file
```

**Periksa potongan kode**

```bash
npx lagune read interpreter --lang javascript --pattern 'eval(x)'   # => careful
npx lagune read interpreter --lang python --pattern 'json.loads(x)' # => safe
```

Sink ini bersifat dwiguna: pemindaian statis tidak bisa memastikan apakah input yang dipengaruhi penyerang sampai ke sana, jadi setiap kecocokan adalah **peringatan untuk ditinjau**, tidak pernah temuan yang terkonfirmasi. Pemindaian mencetak satu bagian saja, **Dynamic-execution sinks to review**, yang dikelompokkan per file. Proses yang bersih mencetak `no dynamic-execution sinks found`.

**Baca kode yang ditandai, jangan pernah menjalankannya!**

Analisis setiap sink secara **statis**, dengan menelusuri apakah input yang tidak tepercaya sampai ke sana. Jangan pernah menjalankan atau memberikan ke `eval` kode yang ditandai, maupun kode jarak jauh atau kode yang diambil saat runtime yang dimuatnya, hanya untuk "menguji" apa yang dilakukannya.

## Cara membaca putusan

| Putusan   | Arti                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| `careful` | Potongan kode berisi sink eksekusi dinamis untuk bahasanya. Tinjau dengan membacanya, jangan menjalankannya. |
| `safe`    | Tidak ada sink eksekusi dinamis yang ditemukan untuk bahasa yang diberikan.                                  |

### Opsi CLI

| Opsi        | Nilai         | Deskripsi                                                                                              |
| ----------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| `--pattern` | potongan kode | Memeriksa satu potongan kode. Ulangi untuk memeriksa beberapa, satu putusan per baris.                 |
| `--lang`    | sebuah bahasa | Wajib bersama `--pattern`: javascript, python, php, ruby, java, kotlin, go, rust, c, cpp, atau csharp. |
| `--dir`     | direktori     | Membatasi pemindaian ke satu direktori. Bisa diulang dan digabung dengan `--file`.                     |
| `--file`    | file          | Membatasi pemindaian ke satu file. Bisa diulang dan digabung dengan `--dir`.                           |

Tanpa opsi apa pun, hook ini memindai seluruh proyek. `--pattern` memerlukan `--lang` dan tidak bisa digabung dengan `--dir` atau `--file`.

### Pilih apa yang dipindai

Hook ini melewati apa yang diabaikan **Git**. Untuk melewati lebih banyak, atau untuk memindai apa yang diabaikan **Git**, beri `interpreter` pengaturannya sendiri:

```bash
npx lagune write add --ignore test/fixtures --checker interpreter
```

```json
{
  "checkers": {
    "interpreter": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[Konfigurasi hook](https://lagune.ai/id-ID/docs/hooks/configure) membahas semua pengaturannya.

### Bahasa yang didukung

Pemindaian membaca bahasa berikut, dikenali dari ekstensi file, dan memeriksa masing-masing terhadap kumpulan sink eksekusi dinamisnya sendiri.

| #   | Bahasa                      | Ekstensi                                                                                                     | Sink yang ditandai                                                                                                                                                                                                                           |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` | `eval()`, constructor Function, `setTimeout`/`setInterval` dengan body berupa string, modul `vm`, exec dari `child_process`, `require()` dinamis, `import()` dinamis                                                                         |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                | `eval`/`exec`, `__import__()`, `os.system`/`os.popen`, `subprocess` dengan `shell=True`, `pickle.load`/`loads`, `yaml.load` (tidak aman)                                                                                                     |
| 3   | **Ruby**                    | `.rb`                                                                                                        | keluarga eval (`instance_eval`/`class_eval`/`module_eval`/`eval`), `system`/`exec`, backtick atau `%x`, `Kernel#open` / `IO.popen`/`read`/`binread` / `Open3`, `Process.spawn`, `Marshal.load`                                               |
| 4   | **Go**                      | `.go`                                                                                                        | `exec.Command`/`exec.CommandContext`, `plugin.Open`                                                                                                                                                                                          |
| 5   | **PHP**                     | `.php`                                                                                                       | `eval()`, `assert()` dengan string, `create_function()`, eksekusi shell (`system`/`exec`/`shell_exec`/`passthru`/`popen`/`proc_open`), `call_user_func`/`call_user_func_array`, `include`/`require` dengan path yang ditentukan saat runtime |
| 6   | **Rust**                    | `.rs`                                                                                                        | `Command::new`, `process::Command`                                                                                                                                                                                                           |
| 7   | **Java**                    | `.java`                                                                                                      | `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                                                             |
| 8   | **Kotlin**                  | `.kt`, `.kts`                                                                                                | Sink JVM: `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                                                   |
| 9   | **C#**                      | `.cs`                                                                                                        | `Process.Start` / `new Process`, `BinaryFormatter`, `Assembly.Load`                                                                                                                                                                          |
| 10  | **C**                       | `.c`, `.h`                                                                                                   | `system()`, `popen()`, keluarga `exec*` (`execl`, `execve`, `execvp`, …)                                                                                                                                                                     |
| 11  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 | `system()`, `popen()`, keluarga `exec*` (`execl`, `execve`, `execvp`, …)                                                                                                                                                                     |

**Upaya terbaik, tidak menyeluruh**

Hook ini membaca kode sumber sebagai teks, jadi sink yang dirakit saat runtime, disembunyikan di balik alias, atau ditulis dalam bentuk yang tidak dikenalinya bisa lolos. Anggap tabel ini sebagai titik awal yang kuat, bukan inventaris yang lengkap.

**Tips**

Hook ini menjamin dasarnya (sink ini ada, dan di mana letaknya): apakah nilai yang tidak tepercaya benar-benar sampai ke salah satunya adalah soal penilaian yang dicakup oleh [spesialisasi `interpreter`](https://lagune.ai/id-ID/docs/catalog).

## Pertanyaan yang sering diajukan

### Apakah hook interpreter mengonfirmasi kerentanan?

Tidak. Hook ini menandai sink eksekusi dinamis sebagai peringatan untuk ditinjau, tidak pernah sebagai temuan yang terkonfirmasi, karena pemindaian statis tidak bisa memastikan apakah input yang dipengaruhi penyerang sampai ke sink tersebut.

### Bahasa apa saja yang dicakup hook interpreter?

Hook ini membaca bahasa yang ada di tabel bahasa yang didukung, dikenali dari ekstensi file, dan memeriksa masing-masing terhadap kumpulan sink-nya sendiri. Bahasa lain tidak menghasilkan sink.
