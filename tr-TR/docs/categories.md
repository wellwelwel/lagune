# Kategoriler

> Bir Lagune projesinin kullanabileceği, OWASP'tan JavaScript, Python, Go ve Rust gibi dillere özgü sıkılaştırmaya uzanan uzmanlık kategorileri ve bunların nasıl değiştirileceği.

Kanonik URL: https://lagune.ai/tr-TR/docs/categories
Dil: tr-TR
Orijinal: https://lagune.ai/docs/categories
Son güncelleme: 2026-11-03

**Lagune**, yerleşik [**uzmanlıklarını**](https://lagune.ai/tr-TR/docs/catalog) **13 kategoride** gruplar. Bir projenin kullandığı kategoriler, hangi yerleşik uzmanlıkların projenin [**kataloğuna**](https://lagune.ai/tr-TR/docs/catalog) katılacağını belirler ve ikiye ayrılır: sistemin ne yaptığı ve hangi dille yazıldığı.

Hiçbir kategori kaydedilmemişken proje yalnızca `owasp` kullanır. [`/lagune-charter`](https://lagune.ai/tr-TR/docs/commands/charter) komutu, projeyi okumasının desteklediği her kategoriyi kaydeder ve siz de bunları istediğiniz zaman kendiniz değiştirebilirsiniz.

## Sistemin ne yaptığı

| Kategori         | Anahtar   | Neyi sıkılaştırır                                                                                                                                 |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| OWASP            | `owasp`   | OWASP'ın takip ettiği uygulama güvenliği riskleri: enjeksiyon, bozuk erişim kontrolü, kimlik doğrulama ve kriptografi hataları                    |
| Altyapı          | `infra`   | Konteyner, iş yükü ve serverless yapılandırması: Dockerfile, Compose, Pod güvenliği, FaaS IAM ve tetikleyicileri                                  |
| Yapay zeka / LLM | `ai`      | Yapay zeka ve LLM entegrasyonları, prompt injection'a ve güvensiz araç, ajan, veri getirme ve MCP bağlantılarına karşı                            |
| Lovable          | `lovable` | Yapay zekayla üretilmiş Supabase uygulamaları (Lovable ve benzerleri): RLS boşlukları, sızan `service_role` anahtarları ve güvensiz varsayılanlar |

## Hangi dille yazıldığı

| Kategori   | Anahtar      | Neyi sıkılaştırır                                                                                                      |
| ---------- | ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| JavaScript | `javascript` | Çalışma ortamlarının tamamında `eval` ve `child_process` ile RCE, path traversal ve prototype pollution                |
| Python     | `python`     | `pickle` ve YAML seri durumdan çıkarma ile RCE, `str.format` ile dize traversal'ı ve class pollution                   |
| Rust       | `rust`       | Sağlam olmayan `unsafe` API'ler, hatalı `transmute` kullanımı, tamsayı taşması ve FFI sınırında tanımsız davranış      |
| C / C++    | `c-cpp`      | Kod çalıştırmaya olanak tanıyan biçim dizesi hataları, arabellek taşmaları ve sınır dışı yazmalar                      |
| PHP        | `php`        | Type juggling ile kimlik doğrulama atlatma, nesne enjeksiyonu gadget zincirleri ve güvensiz varsayılan yapılandırmalar |
| Go         | `go`         | Typed nil arayüz hataları, goroutine data races ve güvenlik yollarında güvensiz eşzamanlılık                           |
| Java       | `java`       | Uzaktan kod çalıştırmayla sonuçlanan `ObjectInputStream` seri durumdan çıkarma gadget zincirleri                       |
| Ruby       | `ruby`       | Uzaktan kod çalıştırmaya ulaşan `Marshal.load` ve YAML seri durumdan çıkarma gadget zincirleri                         |
| .NET / C#  | `dotnet`     | `BinaryFormatter` seri durumdan çıkarma ile RCE ve XSS'e ulaşan kodlayıcı atlatmaları                                  |

**İpucu**

**Lagune** dilden bağımsızdır: tüm akış projeniz hangi dille yazılmış olursa olsun onu okur ve bu kategoriler yalnızca tek bir dile özgü tuzaklarda derinlik katar.

## İstediğiniz zaman ekleyin ve kaldırın

Bir kategori bir bağlılık değil, bir başlangıç noktasıdır. Projeye şu anda uyanı kullanın ve istediğiniz zaman anahtarıyla, `write add` ve `write remove` ile değiştirin. Değer verilmeyen `--categories`, terminalde etkileşimli bir seçici açar (seçmek ya da bırakmak için boşluk, onaylamak için enter, atlamak için boş bırakın). Terminal dışında kategorileri onun ardından verin.

**Ekle**

```bash
npx lagune write add --categories # interactive
npx lagune write add --categories owasp
npx lagune write add --categories owasp rust
```

**Kaldır**

```bash
npx lagune write remove --categories # interactive
npx lagune write remove --categories owasp
npx lagune write remove --categories owasp rust
```

İlk `write add` ya da `write remove` komutu `owasp` ile başlar, bu yüzden tüm kategorileri kaldırmak varsayılanı değil, boş bir listeyi bırakır. Her değişiklik `.lagune/configs.json` dosyasına yazılır, böylece tüm ekip aynı kümeyle çalışır.

## Bir projenin ne kullandığını görün

`read list --categories` komutu her kategoriyi ve projenin onu kullanıp kullanmadığını gösterir:

```bash
npx lagune read list --categories
# Categories
#   • owasp       [used]       Harden against the application security risks OWASP tracks
#   • javascript  [available]  Harden JavaScript and its runtimes
#   • php         [available]  Harden PHP against type-juggling auth bypass
#   • go          [available]  Harden Go against typed-nil interface bugs
#   ...
#
# No category is recorded yet, so this project uses the default: owasp.
```

Her kategorinin hangi uzmanlıkları taşıdığını görmek için [**Katalog**](https://lagune.ai/tr-TR/docs/catalog) sayfasına bakın. [`/lagune-specialize`](https://lagune.ai/tr-TR/docs/commands/specialize) ile yazdığınız kendi uzmanlıklarınız, kategoriler ne olursa olsun kataloğa katılır.

## Sıkça sorulan sorular

### Nasıl kategori eklerim?

Kategorinin anahtarını --categories seçeneğine verin, örneğin npx lagune write add --categories javascript. Hiçbir kategori kaydedilmemişken charter da projeyi okumasının desteklediği kategorileri kaydeder.

### Birden fazla kategori kullanabilir miyim?

Evet. Onları aynı satırda art arda yazın.

### Bir proje hangi kategoriyi kullanmalı?

Varsayılan olan owasp ile başlayın, ardından dilinize ya da yığınınıza uygun kategoriyi ekleyin. Uzmanlıklar yalnızca talep üzerine yüklenir, bu yüzden bir faz onun uzmanlıklarından birine ihtiyaç duyana kadar bir kategorinin hiçbir maliyeti yoktur.
