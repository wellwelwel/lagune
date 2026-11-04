# Lagune prompt örnekleri: Blue Team akışını otomatikleştirin

> Kopyalamaya hazır Lagune prompt'ları: salt okunur bir tarama, tam Blue Team akışı ve bir Zero Trust denetimi, ayrıca bir commit'e, bir dalın ya da PR'ın diff'ine veya gerçek bir olaya göre kapsamı daraltılmış tespit.

Kanonik URL: https://lagune.ai/tr-TR/docs/examples/prompts
Dil: tr-TR
Orijinal: https://lagune.ai/docs/examples/prompts
Son güncelleme: 2026-11-04

Doğrudan yapay zeka ajanınıza yapıştırabileceğiniz, kopyalamaya hazır Lagune prompt'ları.

## 💧 Yüzeysel tarama

Kodu kendi başına okuyup her kusuru bir düzeltmeyle birlikte raporlayan salt okunur bir tarama. Blue Team akışını çalıştırmaz ve Lagune'nin takibine hiçbir şey yazmaz.

**İpucu**

Planlama modunda ve tanımlanmış bir charter (`/lagune-charter`) ile daha iyi çalışır.

**🪼 Varsayılan**

| Yön                 | Ödünleşim                                                    | Düzey               |
| ------------------- | ------------------------------------------------------------ | ------------------- |
| **Çaba**            | Tek bir ajan tarar ve raporlar, alt ajan yok.                | 1/5 |
| **Süre**            | Hızlı. Tek bir salt okunur geçiş, hiçbir şey uygulanmaz.     | 2/5 |
| **Token kullanımı** | Orta, paylaşımlı. Taramanın tamamı tek bir bağlamda çalışır. | 2/5 |

```md
/lagune Savunma güvenliğinde derin uzmanlığa sahip bir siber güvenlik araştırmacısısın ve bilgini ve isabetini artırmak için Lagune'yi kullanıyorsun.

Çalışma alanını kendi başına tara ve bulduğun her kusuru somut bir düzeltmeyle eşleştir. Bu, Blue Team akışı değil, bağımsız bir taramadır: detect, plan, harden ya da verify çalıştırma ve Lagune'nin takibine hiçbir şey yazma.

Sonunda bulduğun her kusuru, önem derecesi ve somut bir düzeltmeyle birlikte listele.
```

**🐬 Çoklu ajan**

| Yön                 | Ödünleşim                                                                       | Düzey               |
| ------------------- | ------------------------------------------------------------------------------- | ------------------- |
| **Çaba**            | Dosya başına bir alt ajan, kod tabanınızın boyutuna göre ölçeklenir.            | 2/5 |
| **Süre**            | Dosya başına paralel, ardından tek bir raporda birleştirilir. Yine salt okunur. | 3/5 |
| **Token kullanımı** | Daha yüksek, ama yalıtılmış. Her alt ajan kendi bağlamında tarar.               | 3/5 |

````md
/lagune Lagune'yi kullanarak yolları listeleyen, her yol için bir alt ajan görevlendiren ve raporlarını birleştiren bir siber güvenlik orkestratörüsün (tüm içeriği alt ajanlar okur).

Görevi mevcut projenin boyutuna göre alt ajanlara devretmelisin: kod tabanı ne kadar büyükse o kadar çok alt ajan görevlendirilmeli. Hepsini paralel çalıştır ve her birine aşağıdaki prompt'u ver:

```prompt
/lagune Savunma güvenliğinde derin uzmanlığa sahip bir siber güvenlik araştırmacısısın ve bilgini ve isabetini artırmak için Lagune'yi kullanıyorsun.

<path> yolunu kendi başına tara ve bulduğun her kusuru somut bir düzeltmeyle eşleştir. Bu, Blue Team akışı değil, bağımsız bir taramadır: detect, plan, harden ya da verify çalıştırma ve Lagune'nin takibine hiçbir şey yazma.

Sonunda <path> içindeki her kusuru, önem derecesi ve somut bir düzeltmeyle birlikte listele.
```

Sonunda tüm alt ajan raporlarını, kusurların ve düzeltmelerin önceliklendirilmiş tek bir listesinde birleştir.
````

**Uyarı**

Hızlı tarama, geniş ve kapsamı daraltılmamış tek bir prompt'tur, bu yüzden bazı ajanların onu reddetme ya da yarıda kesme olasılığı daha yüksektir. Sizinki direnirse bunun yerine aşağıdaki tam **Blue Team akışını** çalıştırın: kapsamı daraltılmış, adım adım ilerleyen fazlarının engellenme olasılığı çok daha düşüktür.

---

## 🌊 Otomatik Blue Team denetim akışı

[Komut akışının tamamını](https://lagune.ai/tr-TR/docs/get-started/commands) girdi beklemek için durmadan baştan sona çalıştırır.

**🪼 Varsayılan**

| Yön                 | Ödünleşim                                                                             | Düzey               |
| ------------------- | ------------------------------------------------------------------------------------- | ------------------- |
| **Çaba**            | Kod tabanının boyutundan bağımsız olarak tek bir ajan, alt ajan yok.                  | 3/5 |
| **Süre**            | Orta, ama büyük kod tabanlarında daha az kapsamlı. Her komut sırayla bir kez çalışır. | 4/5 |
| **Token kullanımı** | Daha düşük, ama daha az yalıtılmış. Tüm komutlar aynı bağlamı paylaşır.               | 4/5 |

```md
Şu komutları sırayla tek tek çalıştır: `/lagune-charter`, `/lagune-detect`, `/lagune-plan`, `/lagune-harden` ve `/lagune-verify`.

## Döngü

`/lagune-verify` bir ya da daha fazla düzeltmeyi reddettiğinde, tüm bulgular gerektiği gibi çözülene kadar `/lagune-harden` ve ardından `/lagune-verify` komutunu tekrarla.

## Önemli

- Durma, soru sorma: şüpheye düştüğünde her şeyi "full" modda yap.
```

**🐋 Çoklu ajan (derin tarama)**

| Yön                 | Ödünleşim                                                                                                                               | Düzey               |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| **Çaba**            | Alt ajan sayısı kod tabanınızın boyutuna göre ölçeklenir.                                                                               | 5/5 |
| **Süre**            | Daha uzun, ama daha kapsamlı. Bulguları paralel olarak tespit etmek, planlamak ve sıkılaştırmak için birden çok alt ajan görevlendirir. | 5/5 |
| **Token kullanımı** | Daha yüksek, ama daha güvenli. Her alt ajanın önyargısız, kendine ait yalıtılmış bir bağlamı vardır.                                    | 5/5 |

````md
Şu komutların her birini bir alt ajana ver, her seferinde bir tane (ters tırnak olmadan, yalnızca komutu):

Alt ajan 1 prompt'u: `/lagune-charter`
Alt ajan 2 prompt'u: `/lagune-detect`
Alt ajan 3 prompt'u: `/lagune-plan`
Alt ajan 4 prompt'u: `/lagune-harden`
Alt ajan 5 prompt'u: `/lagune-verify`

`/lagune-detect`, `/lagune-plan`, `/lagune-harden` ve `/lagune-verify` komutlarında görevi mevcut projenin boyutuna göre alt ajanlara devretmelisin: kod tabanı ne kadar büyükse o kadar çok alt ajan görevlendirilmeli. Örneğin:

```prompt
/lagune-detect <path>
```

```prompt
/lagune-plan <finding>
```

```prompt
/lagune-harden <finding>
```

```prompt
/lagune-verify <finding>
```

- Aynı komut üzerindeki birden çok ajan paralel olarak görevlendirilmeli.
- Tüm `/lagune-detect` alt ajanları bittiğinde şunu çalıştır:

```prompt
/lagune-detect eşdeğer bulguları birleştir. Yeni bulgu arama ve kod tabanını yeniden tarama.
```

## Döngü

`/lagune-verify` bir ya da daha fazla düzeltmeyi reddettiğinde, tüm bulgular gerektiği gibi çözülene kadar `/lagune-harden` ve ardından `/lagune-verify` komutunu tekrarla.

## Önemli

- Durma, soru sorma: şüpheye düştüğünde her şeyi "full" modda yap.
````

---

## 🪄 Kapsamı daraltılmış tespit

[`/lagune-detect`](https://lagune.ai/tr-TR/docs/commands/detect) komutunu projenin tamamı yerine bir dilimine yöneltin. Kapsamı sade bir dille tarif edin (bir commit, bir pull request ya da gerçek bir durum), komut yalnızca oradaki güvenlikle ilgili bulguları belirler.

**İpucu**

Burada tespit ettiği her şey normal bir bulgudur, bu yüzden yalnızca o öğelerle sınırlı olarak doğrudan `/lagune-plan`, `/lagune-harden` ve `/lagune-verify` komutlarına taşıyabilirsiniz.

**📌 Bir commit**

Yeni bir commit grubuna, yalnızca değiştirdikleriyle sınırlı kendi güvenlik geçişini verin, örneğin:

```prompt
/lagune-detect Tespiti `a1b2c3d` commit'inden beri değişen her şeyle sınırla.
```

**🔀 Dal ya da PR diff**

Bir pull request'i birleştirilmeden önce, yalnızca diff'iyle sınırlı olarak güvenlik açısından inceleyin, örneğin:

```prompt
/lagune-detect Tespiti bu dalın `main` dalına göre getirdiği değişikliklerle sınırla.
```

**⛑️ Bir olaydan sonra**

Ne olduğunu kendi sözlerinizle anlatın. Lagune bir bayrağı değil durumu okur ve onu odaklı bir aramaya dönüştürür, örneğin:

```prompt
/lagune-detect Sitemizde birkaç hafta önce bir veri sızıntısı oldu. Tam olarak nasıl olduğunu bilmiyorum ve verinin yeniden sızmasına yol açabilecek bir açığın hâlâ açık olmasından endişeleniyorum. Kodu dikkatle incele, hassas verinin okunduğu, saklandığı ya da açığa çıktığı her yere odaklan ve hâlâ bir çıkış yolu olabilecek her şeyi belirle. Bunu bir tatbikat değil, gerçek bir olay olarak ele al.
```

---

## 🚨 Zero Trust denetimi

Çalışma alanının tamamını ve her bağımlılığı düşmanca kabul eder: yorumlayıcıları, ağ çağrılarını, kodlanmış payload'ları ve tarayıcılardan kaçmak için beklenmedik yerlere gizlenmiş kodu arar, ardından projenin kullanıma güvenli olup olmadığına dair bir evet ya da hayır kararıyla biter.

Prompt'lar bu denetimin dayandığı uzmanlıkları, projenizin kategorileri ne olursa olsun doğrudan yükler. Kataloğun `/lagune` komutunun eşleştirdiği geri kalanı için projenin **OWASP**, **AI/LLM** ve kendi teknoloji yığınının kategorisini (örneğin **JavaScript**, **Python** vb.) kullandığından emin olun:

```bash
npx lagune write add --categories owasp ai javascript
```

Deponun kendi `.gitignore` dosyaları ve yapılandırmaları dosyaları denetleyicilerden gizleyebilir, bu yüzden deponun getirdiği her bloğun yerine, `checkers` bloğunu `.lagune/configs.json` dosyasında [her şeyi tarayacak](https://lagune.ai/tr-TR/docs/hooks/configure) şekilde ayarlayın:

```json
{
  "checkers": { "gitignore": false }
}
```

**Tehlike**

Güvenilmeyen kaynaklardan gelen projeleri yerel ortamınızda çalıştırırken dikkatli olun. Kötü amaçlı kodun sisteminizi etkilemesini önlemek için **sandbox** (önerilir), **VM** ya da benzeri yalıtılmış bir ortam kullanın.

**🪼 Varsayılan**

| Yön                 | Ödünleşim                                                                         | Düzey               |
| ------------------- | --------------------------------------------------------------------------------- | ------------------- |
| **Çaba**            | Tek bir ajan tüm çalışma alanını tarar, alt ajan yok.                             | 2/5 |
| **Süre**            | Orta. Tek bir ajan kodu ve bağımlılıklarını sırayla inceler.                      | 3/5 |
| **Token kullanımı** | Orta, ama paylaşımlı. Uzmanlıklar, kod ve bağımlılıklar tek bir bağlama yüklenir. | 3/5 |

```md
/lagune Zero trust savunma güvenliğinde derin uzmanlığa sahip bir siber güvenlik araştırmacısısın ve bilgini ve isabetini artırmak için Lagune'yi kullanıyorsun.

Çalışma alanının tamamını güvenilmeyen bir kaynak ve potansiyel olarak kötü amaçlı bir kapsam olarak incele. Her yorumlayıcı, fetch, base64 ve benzeri, potansiyel bir tehdit olarak ele alınmalı.

Analizini bağımlılıklara ve alt bağımlılıklara da genişlet: bir proje, tarayıcılardan kaçmak için kötü amaçlı kodu beklenmedik bir yere gizlemeye çalışabilir.

Zorunlu uzmanlıklar (her birini `npx lagune read catalog <name>` ile tek tek yükle):

- interpreter
- secrets
- llm
- path

Açık olmak gerekirse: belirlenen her güvenlik açığı istisnasız potansiyel bir tehdit olarak ele alınmalı.

Sonunda projenin benim kullanmam için güvenli ve güvenilir olup olmadığına dair bir karar ver.
```

**🐋 Çoklu ajan (derin tarama)**

| Yön                 | Ödünleşim                                                                                              | Düzey               |
| ------------------- | ------------------------------------------------------------------------------------------------------ | ------------------- |
| **Çaba**            | Dosya başına bir alt ajan, kod tabanınızın boyutuna göre ölçeklenir.                                   | 5/5 |
| **Süre**            | Daha uzun, ama daha kapsamlı. Dosyalar paralel olarak taranır, ardından tek bir kararda birleştirilir. | 4/5 |
| **Token kullanımı** | En yüksek, ama en güvenli. Her alt ajan uzmanlıkları kendi yalıtılmış bağlamında okur.                 | 5/5 |

````md
/lagune Lagune'yi kullanarak dosyaları listeleyen, her dosya için bir alt ajan görevlendiren ve raporlar üreten bir siber güvenlik orkestratörüsün (tüm içeriği alt ajanlar okur).

Her dosya için bir alt ajan görevlendir, hepsini paralel çalıştır ve her birine kendi dosyasıyla sınırlı olarak aşağıdaki prompt'u ver:

```prompt
/lagune Zero trust savunma güvenliğinde derin uzmanlığa sahip bir siber güvenlik araştırmacısısın ve bilgini ve isabetini artırmak için Lagune'yi kullanıyorsun.

<file> dosyasını güvenilmeyen bir kaynak ve potansiyel olarak kötü amaçlı bir kapsam olarak ele al. Her yorumlayıcı, fetch, base64 ve benzeri, potansiyel bir tehdit olarak ele alınmalı.

Analizi <file> dosyasının içe aktardığı her şeye, kötü amaçlı kodun tarayıcılardan kaçmak için gizlenebileceği bağımlılıklar ve alt bağımlılıklar dahil, genişlet.

Her alt ajan için zorunlu uzmanlıklar (her birini `npx lagune read catalog <name>` ile tek tek yükle):

- interpreter
- secrets
- llm
- path

Açık olmak gerekirse: belirlenen her güvenlik açığı istisnasız potansiyel bir tehdit olarak ele alınmalı.

Sonunda projenin benim kullanmam için güvenli ve güvenilir olup olmadığına dair bir karar ver.
```

Sonunda tüm alt ajan raporlarını tek bir nihai kararda birleştir.
````
