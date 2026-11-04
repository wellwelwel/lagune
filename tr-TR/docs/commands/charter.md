# /lagune-charter: güvenlik ilkelerinizi belirleyin

> Projenizin güvenlik ilkelerini, yani sonraki her fazın uyduğu kuralları belirleyin ve projeyi okuyarak gerekçelendirilen uzmanlık kategorilerini kaydedin.

Kanonik URL: https://lagune.ai/tr-TR/docs/commands/charter
Dil: tr-TR
Orijinal: https://lagune.ai/docs/commands/charter
Son güncelleme: 2026-11-04

🧬 **Lagune**'ye projenizin ne olduğunu anlatın, o da bunu güvenlik kurallarınıza dönüştürsün (ya da hiçbir açıklama olmadan kuralları yalnızca projeden çıkarsın).

Charter, yönetici katmandır: sonraki her fazın uyması gereken, güvenliği öne alan ilkeler bütünü. Onu, projenizin güvenlik duruşu için derleme zamanı denetimi gibi düşünün.

## Kullanım

**Anlatın**

```prompt
/lagune-charter Projem video oyunu satan bir online mağaza. Müşteriler ürünleri sepete ekliyor ve kredi kartıyla ya da havaleyle ödüyor. Siparişlerini ve her birinin durumunu görebiliyorlar.
```

**Lagune önersin**

```prompt
/lagune-charter
```

> _Bir ödeme kütüphanesi, bir oturum açma yapılandırması ve bir müşteriye bağlı bir sipariş modeli görüyorum. Bir şey satan bir online mağazaya benziyor. Müşteriler ödeme yapıyor ve kendi siparişlerini takip ediyor..._ ☁️

## Neleri çıkarır

**Lagune**, açıklamanızı ya da **PRD**'nizi yön olarak alır ve bunun güvenlik açısından ne anlama geldiğini çıkarır, ardından sizin belirttiklerinizin ötesine geçmek için projeyi okur. Örneğin:

- Siparişleri tutan bir sepet, bir **veritabanı** olduğu anlamına gelir:
  - örn. `"Veriler nerede duruyor?"`, `"Onlara kim erişebiliyor?"`, `"Veri sızıyor mu?"`.
- Kendi siparişlerini görebilen müşteriler, bir tür **oturum açma ya da erişim kontrolü** olduğu anlamına gelir:
  - örn. `"Bir müşteri başka bir müşterinin siparişlerine erişebilir mi?"`, `"Oturumlar korunuyor mu?"`.
- Kart ve havale ile ödeme almak, **paranın ve hassas verilerin işin içinde olduğu** anlamına gelir:
  - örn. `"Kart verileri saklanıyor mu?"`, `"Ödemeler doğrulanıyor mu?"`.

Açıklamanız ve proje birbirini tamamlar: açıklamanız niyeti belirlerken bağımlılıkları, README dosyasını ve yapılandırmayı okumak, sizin bahsetmediklerinizi ortaya çıkarır. Önemli bir şey hâlâ belirsizse, **Lagune** tahmin yürütmek yerine kısa ve sade bir soru sorar.

Buradan yola çıkarak **Lagune**, proje için ona özel bir güvenlik kuralları seti oluşturur. Bu kuralları ihtiyaç duyduğunuzda gözden geçirip düzenleyebilirsiniz.

**En iyi şekilde yararlanın**

- Proje için kendi güvenlik kurallarınızı da tanımlayabilirsiniz.
- Ne kadar ilgili ayrıntı verirseniz, nihai rapor o kadar iyi olur:
  - Projeyi, nasıl çalıştığını ve arka planda neler olduğunu açıklayın.
  - Son kullanıcı kim? Kullanıcılar neleri yapabilir, neleri yapamaz?
  - Davranışsal ayrıntılar, teknik ayrıntılar kadar değerlidir.
- Charter belleği `.lagune/memory/charter.md` dosyasında durur.

## Kaydettiği kategoriler

Sonraki fazların talep üzerine yüklediği güvenlik bilgisi olan uzmanlıklar, projenizin [kataloğuna](https://lagune.ai/tr-TR/docs/catalog) [kategoriye](https://lagune.ai/tr-TR/docs/categories) göre katılır. Projenizde kayıtlı bir kategori olmadığı sürece charter, projeyi okuyarak gerekçelendirebildiği her kategoriyi kaydeder (örneğin projenizin dili, bir LLM'e yapılan çağrılar ya da container'lar) ve bunları özetinde adlarıyla belirtir.

Kategoriler kaydedildikten sonra charter onlara dokunmaz ve yalnızca projenizin henüz kullanmadığı bir kategoriyi adıyla belirtir. Onları istediğiniz zaman kendiniz değiştirin:

```bash
npx lagune write add --categories python
npx lagune write remove --categories python
```

## Dışarıda bırakmayı önerdiği klasörler

Charter, projeyi okurken savunulacak kodunuzun parçası olmayan commit edilmiş klasörler bulduğunda (örneğin savunmasız görünmek üzere yazılmış test fixture'ları), bunları özetinin sonunda numaralandırarak listeler. Düşmanca bir depo kendi kodunu fixture gibi gösterebileceği için hiçbirini kendi başına dışarıda bırakmaz ve yalnızca yanıtınızda belirttiğiniz numaraları kaydeder. Bunları kendiniz nasıl değiştireceğinizi [Hook'ları yapılandırın](https://lagune.ai/tr-TR/docs/hooks/configure) sayfası anlatır.

## Sırada ne var

Kurallar belirlendikten sonra sisteminizin gerçekte ne yaptığını çıkarın: [`/lagune-detect`](https://lagune.ai/tr-TR/docs/commands/detect).

## Sıkça sorulan sorular

### Lagune'de charter nedir?

Charter, Lagune'nin yönetici katmanıdır: sonraki her fazın uyması gereken, güvenliği öne alan ilkeler bütünü. Onu, projenizin güvenlik duruşu için derleme zamanı denetimi gibi düşünün.

### Charter nerede saklanır?

.lagune/memory/charter.md dosyasında.

### Kendi charter kurallarımı yazabilir miyim?

Evet. Lagune, açıklamanızdan ve kodunuzdan yola çıkarak kurallar önerir, siz de onları yeniden ifade edebilir, çıkarabilir, ekleyebilir ya da kapsamlarını daraltabilirsiniz.

### Uzmanlık kategorilerimi charter mı seçer?

Yalnızca hiçbiri kayıtlı değilken. O durumda projeyi okuyarak gerekçelendirebildiği her kategoriyi kaydeder, örneğin dilinizi ya da bir LLM'e yapılan çağrıları. Kategoriler kaydedildikten sonra onları asla değiştirmez.
