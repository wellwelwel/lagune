# interpreter hook'u: dinamik kod çalıştırma sink'lerini işaretleyin

> Kod tabanını farklı dillerdeki dinamik kod çalıştırma sink'lerine karşı tarayın ya da tek bir kod parçasını doğrudan komut satırından puanlayın.

Kanonik URL: https://lagune.ai/tr-TR/docs/hooks/interpreter
Dil: tr-TR
Orijinal: https://lagune.ai/docs/hooks/interpreter
Son güncelleme: 2026-11-05

`interpreter` hook'u **dinamik kod çalıştırma sink'lerini** işaretler: `eval`'den yerel seri durumdan çıkarmaya kadar, veriyi çalışan koda dönüştüren ya da bir kabuğa aktaran yapılar. Dile duyarlıdır, her dosyayı kendi kurallarıyla okur. [`interpreter` uzmanlığının](https://lagune.ai/tr-TR/docs/catalog) arkasındaki deterministik motordur ve onu **scan** veya **check** modunda kendiniz çalıştırabilirsiniz.

## Çalıştırma

**Kod tabanını tara**

```bash
npx lagune read interpreter               # scans the whole project
npx lagune read interpreter --dir src     # scans a directory
npx lagune read interpreter --file app.py # scans a single file
```

**Bir kod parçasını kontrol et**

```bash
npx lagune read interpreter --lang javascript --pattern 'eval(x)'   # => careful
npx lagune read interpreter --lang python --pattern 'json.loads(x)' # => safe
```

Bu sink'ler çift kullanımlıdır: saldırganın etkileyebildiği bir girdinin bunlardan birine ulaşıp ulaşmadığına statik bir tarama karar veremez, bu yüzden her eşleşme onaylanmış bir bulgu değil, **incelenmesi gereken bir uyarıdır**. Tarama, dosyaya göre gruplanmış tek bir **Dynamic-execution sinks to review** bölümü yazdırır. Temiz bir çalıştırma `no dynamic-execution sinks found` çıktısını verir.

**İşaretlenen kodu okuyun, asla çalıştırmayın!**

Her sink'i **statik olarak** değerlendirin ve güvenilmeyen bir girdinin ona ulaşıp ulaşmadığını izleyin. Ne yaptığını "test etmek" için işaretlenen kodu ya da onun çektiği uzak veya çalışma zamanında indirilen herhangi bir kodu asla çalıştırmayın ve `eval` ile değerlendirmeyin.

## Kararı nasıl okumalı

| Karar     | Anlamı                                                                                                           |
| --------- | ---------------------------------------------------------------------------------------------------------------- |
| `careful` | Kod parçası, kendi dili için bir dinamik çalıştırma sink'i içeriyor. Onu çalıştırarak değil, okuyarak inceleyin. |
| `safe`    | Verilen dil için hiçbir dinamik çalıştırma sink'i bulunamadı.                                                    |

### CLI seçenekleri

| Seçenek     | Değer           | Açıklama                                                                                                            |
| ----------- | --------------- | ------------------------------------------------------------------------------------------------------------------- |
| `--pattern` | bir kod parçası | Tek bir kod parçasını kontrol eder. Birkaçını kontrol etmek için tekrarlayın, her satıra bir karar düşer.           |
| `--lang`    | bir dil         | `--pattern` ile zorunludur: javascript, python, php, ruby, java, kotlin, go, rust, c, cpp, csharp dillerinden biri. |
| `--dir`     | bir dizin       | Taramayı bir dizinle sınırlar. Tekrarlanabilir ve `--file` ile birleştirilebilir.                                   |
| `--file`    | bir dosya       | Taramayı tek bir dosyayla sınırlar. Tekrarlanabilir ve `--dir` ile birleştirilebilir.                               |

Seçenek verilmezse tüm proje taranır. `--pattern`, `--lang` gerektirir ve `--dir` ya da `--file` ile birleştirilemez.

### Neyin taranacağını seçin

Hook, **Git**'in yok saydıklarını dışarıda bırakır. Daha fazlasını dışarıda bırakmak ya da **Git**'in yok saydıklarını taramak için `interpreter` hook'una kendi ayarlarını verin:

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

Tüm ayarlar [Hook'ları yapılandırın](https://lagune.ai/tr-TR/docs/hooks/configure) sayfasında açıklanır.

### Desteklenen diller

Tarama bu dilleri dosya uzantısına göre tanıyarak okur ve her birini kendi dinamik çalıştırma sink'leri kümesine göre kontrol eder.

| #   | Dil                         | Uzantılar                                                                                                    | İşaretlediği sink'ler                                                                                                                                                                                                                      |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` | `eval()`, Function yapıcısı, gövdesi dize olan `setTimeout`/`setInterval`, `vm` modülü, `child_process` exec, dinamik `require()`, dinamik `import()`                                                                                      |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                | `eval`/`exec`, `__import__()`, `os.system`/`os.popen`, `subprocess` `shell=True`, `pickle.load`/`loads`, `yaml.load` (güvensiz)                                                                                                            |
| 3   | **Ruby**                    | `.rb`                                                                                                        | eval ailesi (`instance_eval`/`class_eval`/`module_eval`/`eval`), `system`/`exec`, ters tırnaklar veya `%x`, `Kernel#open` / `IO.popen`/`read`/`binread` / `Open3`, `Process.spawn`, `Marshal.load`                                         |
| 4   | **Go**                      | `.go`                                                                                                        | `exec.Command`/`exec.CommandContext`, `plugin.Open`                                                                                                                                                                                        |
| 5   | **PHP**                     | `.php`                                                                                                       | `eval()`, dize üzerinde `assert()`, `create_function()`, kabukta çalıştırma (`system`/`exec`/`shell_exec`/`passthru`/`popen`/`proc_open`), `call_user_func`/`call_user_func_array`, çalışma zamanında belirlenen yolla `include`/`require` |
| 6   | **Rust**                    | `.rs`                                                                                                        | `Command::new`, `process::Command`                                                                                                                                                                                                         |
| 7   | **Java**                    | `.java`                                                                                                      | `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                                                           |
| 8   | **Kotlin**                  | `.kt`, `.kts`                                                                                                | JVM sink'leri: `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                                            |
| 9   | **C#**                      | `.cs`                                                                                                        | `Process.Start` / `new Process`, `BinaryFormatter`, `Assembly.Load`                                                                                                                                                                        |
| 10  | **C**                       | `.c`, `.h`                                                                                                   | `system()`, `popen()`, `exec*` ailesi (`execl`, `execve`, `execvp`, …)                                                                                                                                                                     |
| 11  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 | `system()`, `popen()`, `exec*` ailesi (`execl`, `execve`, `execvp`, …)                                                                                                                                                                     |

**Elden gelenin en iyisi, ama eksiksiz değil**

Hook kaynak kodu metin olarak okur, bu yüzden çalışma zamanında oluşturulan, bir takma adın arkasına gizlenen ya da tanımadığı bir biçimde yazılan bir sink gözden kaçabilir. Tabloyu eksiksiz bir envanter olarak değil, sağlam bir başlangıç noktası olarak görün.

**İpucu**

Hook tabanı garanti eder (bu sink'ler mevcuttur ve yerleri bellidir): güvenilmeyen bir değerin gerçekten bunlardan birine ulaşıp ulaşmadığı ise [`interpreter` uzmanlığının](https://lagune.ai/tr-TR/docs/catalog) kapsadığı bir değerlendirmedir.

## Sıkça sorulan sorular

### interpreter hook'u bir güvenlik açığını doğrular mı?

Hayır. Dinamik çalıştırma sink'lerini onaylanmış bir bulgu olarak değil, incelenmesi gereken bir uyarı olarak işaretler, çünkü saldırganın etkileyebildiği bir girdinin sink'e ulaşıp ulaşmadığına statik bir tarama karar veremez.

### interpreter hook'u hangi dilleri kapsar?

Desteklenen diller tablosundaki dilleri dosya uzantısına göre tanıyarak okur ve her birini kendi sink kümesine göre kontrol eder. Diğer dillerde sink bulunmaz.
