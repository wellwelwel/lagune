# Katalog: talep üzerine yüklenen güvenlik uzmanlıkları

> Projenizin kataloğundaki uzmanlıkların nasıl yüklendiği: bir faz tarafından talep üzerine ya da doğrudan sizin tarafınızdan.

Kanonik URL: https://lagune.ai/tr-TR/docs/catalog
Dil: tr-TR
Orijinal: https://lagune.ai/docs/catalog
Son güncelleme: 2026-11-03

🧠 **Lagune**'nin uzmanlıkları, yalnızca talep üzerine yüklenen, asla varsayılan olarak yüklenmeyen, dilden bağımsız ve odaklı güvenlik bilgisi modülleridir. Komut değildirler. Projenizin kataloğu, projenin kullandığı kümedir: [kategorilerinin](https://lagune.ai/tr-TR/docs/categories) yerleşik uzmanlıkları ile projenin kendi uzmanlıkları. Detect ve verify fazları çalışırken onlara başvurur, siz de herhangi birini istediğiniz zaman doğrudan yükleyebilirsiniz.

**Genel bakış**

*Etkileşimli katalog özeti web sayfasındadır. Tüm yerleşik uzmanlıklar aşağıdaki tabloda yer alır.*

**Nasıl çalışır**

## Kendiniz çalıştırın

Bir uzmanlığı doğrudan kullanmak için ajanınızdan onu `read catalog <name>` ile yüklemesini isteyin ve görevi aynı prompt içinde yazın. Bilgi böylece istediğiniz şey üzerinde çalışır. Bu, **Lagune** akışıyla ilgisi olmayan bir prompt dahil her prompt'ta işe yarar.

Örneğin **Python** ile güvenli bir **RegExp** koleksiyonu oluşturmak için doğrudan, serbest biçimli bir prompt:

```prompt
`npx lagune read catalog regex` ile regex uzmanlığını yükle, ardından @src/utils/regex.py içinde e-posta adreslerini ve kullanıcı adlarını doğrulayan bir düzenli ifade koleksiyonu oluştur.
```

Bu, her **RegExp**'i **ReDoS**'a karşı test etmek için deterministik bir hook kullanır, güvenli olanları tutar ve şuna benzer bir şey üretir:

```python
import re

EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
USERNAME = re.compile(r"^[a-zA-Z0-9_]{3,20}$")

def is_email(value: str) -> bool:
    return EMAIL.match(value) is not None

def is_username(value: str) -> bool:
    return USERNAME.match(value) is not None
```

**ReDoS denetleyicisini deneyin**

Bir kalıbı [**devina.io/redos-checker**](https://devina.io/redos-checker) adresinde kendiniz test edin.

## Yerleşik uzmanlıklar

Yerleşik uzmanlıklar [**kategoriler**](https://lagune.ai/tr-TR/docs/categories) hâlinde gruplanır. **Lagune** ile birlikte gelen küme şudur:

| Uzmanlık              | Kategori                    | Odak                                                                                                            |
| --------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `regex`               | `owasp`                     | **ReDoS:** özel hazırlanmış girdide patlayan kalıplar.                                                          |
| `network`             | `owasp`                     | **SSRF ve yönlendirmeler:** kullanıcının verdiği istek ya da yönlendirme hedefleri.                             |
| `interpreter`         | `owasp`, `lovable`          | **Kod enjeksiyonu:** `eval`, dinamik include, ada göre çağırma.                                                 |
| `sql`                 | `owasp`                     | **İlişkisel veritabanları:** enjeksiyon, ham ORM çağrıları, yetkiler, motorun erişimi.                          |
| `path`                | `owasp`                     | **Dosya sistemi yolları:** traversal, null bayt, NTFS akışları, dosya yerleştirme.                              |
| `upload`              | `owasp`                     | **Dosya yükleme:** tür ve imza, kötü amaçlı içerik, depolama, sınırlar.                                         |
| `access-control`      | `owasp`, `lovable`          | **Kimlik doğrulama, yetkilendirme, oturum:** IDOR, mass assignment, kiracılar, oturumlar.                       |
| `credential-endpoint` | `owasp`, `lovable`          | **Tahmin ve botlar:** brute force, password spraying, credential stuffing, hız sınırlama.                       |
| `federation`          | `owasp`                     | **Token güveni:** OAuth/OIDC, SAML, JWT doğrulama, QR ile oturum açma.                                          |
| `http-request`        | `owasp`                     | **İstek kaynağı:** CSRF, hatalı CORS yapılandırması, sahte istemci IP'si.                                       |
| `transport`           | `owasp`                     | **Kanal güvenliği:** TLS yapılandırması, HTTPS ve düz metin, HSTS, pinning.                                     |
| `crypto`              | `owasp`, `lovable`          | **Saklanan verinin şifrelenmesi:** zayıf ya da özel yapım algoritmalar, CSPRNG, anahtar yönetimi.               |
| `secrets`             | `owasp`, `lovable`          | **Koda gömülü kimlik bilgileri:** kaynak kodda düz metin olarak duran anahtarlar, token'lar, parolalar.         |
| `api-endpoint`        | `owasp`                     | **REST dışı yüzeyler:** GraphQL, gRPC, WebSocket yetkilendirmesi, DoS, şema.                                    |
| `payment`             | `owasp`, `lovable`          | **Ödeme akışı:** ödeme altyapısını sunucu tarafında doğrulama, imzalı geri çağrılar, idempotency.               |
| `xml`                 | `owasp`                     | **XML ayrıştırma:** XXE, harici varlıklar, billion laughs genişlemesi.                                          |
| `csv`                 | `owasp`                     | **Formül enjeksiyonu:** `=`/`+`/`-`/`@` ile başlayan tablo hücreleri.                                           |
| `container`           | `owasp`, `infra`            | **Konteyner yapılandırması:** root, capabilities, soket bağlama, imaj sıkılaştırma.                             |
| `infra`               | `infra`                     | **Kod olarak altyapı:** Terraform, Dockerfile, GitHub Actions.                                                  |
| `serverless`          | `owasp`, `infra`, `lovable` | **FaaS fonksiyonları:** en az yetkili IAM, olay girdisi, bağlam, gizli bilgiler.                                |
| `llm`                 | `ai`, `lovable`             | **Yapay zeka ve LLM riskleri:** prompt injection, agency, RAG, MCP, çıktı.                                      |
| `supabase`            | `lovable`                   | **Supabase arka ucu:** varsayılan olarak kapalı RLS, yapay zekanın hatalı ürettiği politikalar, anahtar modeli. |
| `browser`             | `javascript`, `lovable`     | **İstemci tarafı riskler:** XSS, CSP, framing, depolama vb.                                                     |
| `javascript`          | `javascript`                | **Dil düzeyindeki riskler:** RCE, prototype pollution vb.                                                       |
| `python`              | `python`                    | **Dil düzeyindeki riskler:** `pickle` ile RCE, class pollution, `-O` vb.                                        |
| `rust`                | `rust`                      | **`unsafe` sağlamlığı:** güvenli çağıranlardan UB, `transmute`, taşma.                                          |
| `java`                | `java`                      | **Seri durumdan çıkarma ve mobil kod:** `readObject` zincirleri, nesne ele geçirme.                             |
| `ruby`                | `ruby`                      | **Seri durumdan çıkarma ve `open`:** `Marshal` ve YAML ile nesne canlandırma, pipe tuhaflığı.                   |
| `php`                 | `php`                       | **Type juggling ve `unserialize`:** magic hash'ler, POP zincirleri.                                             |
| `go`                  | `go`                        | **Typed nil ve data races:** `nil != nil`, paylaşılan bellekli goroutine'ler.                                   |
| `c-cpp`               | `c-cpp`                     | **Biçim dizeleri:** `printf(user_input)`, `%n` ile write-what-where.                                            |
| `dotnet`              | `dotnet`                    | **Platform düzeyindeki riskler:** `BinaryFormatter` ile RCE, `@Html.Raw`, enum boşlukları.                      |

Yerleşik bilginin çoğunun özü OWASP'tan çıkarılmıştır. Her uzmanlığın OWASP'ın standart saldırı ve Cheat Sheet sayfalarıyla tam eşleşmesi için [**OWASP kaynakları**](https://lagune.ai/tr-TR/docs/references/owasp-sources) sayfasına bakın. Yığına özgü birkaç modül ise doğrudan sağlayıcının kendi rehberliğinden beslenir: örneğin `supabase`, Supabase belgelerinden ve CVE-2025-48757'den gelir.

## Kendi uzmanlıklarınız

Yerleşik uzmanlıklar asla yeni bir komutla değil, bir bilgi dosyası ve bir dizin satırı eklenerek büyür. Kendi uzmanlıklarınızı da aynı şekilde, [`/lagune-specialize`](https://lagune.ai/tr-TR/docs/commands/specialize) komutuyla eklersiniz: onu bir makaleye ya da konuya yönlendirin, o da özünü çıkararak projenize yeni bir uzmanlık yazar (`.lagune/catalog/` altındaki dosya ve `.lagune/configs.json` içindeki kaydı). Kendi uzmanlıklarınız, kataloğun kategorileri ne olursa olsun her zaman kataloğun içindedir ve sizin bir uzmanlığınız aynı adlı yerleşik uzmanlığı gölgeler.

**Lagune uzmanlıkları kendi içinde, talep üzerine otomatik olarak yükler**

Detect ya da verify fazı bir uzmanlığın kapsadığı bir bağlamla karşılaştığında o uzmanlığı `read catalog <name>` ile kendisi yükler. Bu, fazın bir parçası olarak otomatik gerçekleşir. Bunun çalışması için elle bir şey yapmanız gerekmez.

## Nelerin mevcut olduğunu keşfedin

Projenizin kataloğunu terminalden, her satırda etiketleriyle bir uzmanlık olacak şekilde listelemek için:

```bash
npx lagune read catalog
# regex: Regular Expression [required]
# network: Requests, Webhook, URL Fetch, Socket, IMDS, Redirect
# interpreter: Evaluator, Sink, Shell, Dynamic Execution
# ...
```

`[required]` olarak işaretli bir uzmanlık, iş ne olursa olsun her zaman uygulanır. Listenin hangi yerleşik uzmanlıkları içerdiği, projenizin [**kategorilerine**](https://lagune.ai/tr-TR/docs/categories) bağlıdır.

**Uzmanlıklar varsayılan olarak yüklenmez**

Her kontrolün varsayılan olarak çalışması yerine, projenin gerçekte ne olduğuna uygun bilgi devreye alınır.

## Sıkça sorulan sorular

### Lagune uzmanlığı nedir?

Yalnızca talep üzerine yüklenen, asla varsayılan olarak yüklenmeyen, dilden bağımsız ve odaklı bir güvenlik bilgisi modülüdür. Ajan becerileri gibi bir komut değildir.

### Bir projenin kataloğu nedir?

Projenin kullandığı uzmanlıklardır: kategorilerinin yerleşik uzmanlıkları ile projenin kendi uzmanlıkları. Hiçbir kategori kaydedilmemişken yalnızca OWASP kullanılır.

### Uzmanlıklar varsayılan olarak yüklenir mi?

Hayır. Yalnızca talep üzerine, projenin gerçekte ne olduğuna göre yüklenirler.

### Bir uzmanlığı doğrudan nasıl yüklerim?

Görevle aynı prompt içinde ajanınızdan npx lagune read catalog <name> komutunu çalıştırmasını isteyin.
