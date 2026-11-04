# Lagune ve Deepsec: yapay zeka destekli iki güvenlik yaklaşımı yan yana

> Lagune'yi ve Vercel'in Deepsec'ini çalışma biçimi, yaşam döngüsü, tespit, maliyet, bulgular ve kapatma açısından karşılaştıran bir başvuru sayfası.

Kanonik URL: https://lagune.ai/tr-TR/docs/references/deepsec
Dil: tr-TR
Orijinal: https://lagune.ai/docs/references/deepsec
Son güncelleme: 2026-11-04

[Lagune](https://github.com/wellwelwel/lagune) ve [Deepsec](https://github.com/vercel-labs/deepsec) (`v2.2.1`), aynı soruna verilmiş iki savunma odaklı yanıttır: yapay zeka destekli geliştirme çağında güvenlik. Çıkış noktaları, başları, ortaları ve sonları, ayrıca kullanıcıya kendilerini nasıl sundukları, mekanikleri örtüştüğü yerlerde bile bilinçli olarak ayrışır.

**İpucu**

Lagune, Deepsec'ten mi esinlendi? Hayır. Lagune sıfırdan yazıldı ve Spec-Driven Development ile Security Hardening'den esinlendi. İki proje birbirinden bağımsız geliştirildi ve buradaki karşılaştırma, kullanıcıların aralarındaki farkları anlamasına yardımcı olmak içindir.

## Bir bakışta

| Yön                 | Lagune                                                                                                                     | Deepsec                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Türü                | Referans uygulaması olan bir metodoloji (SDH)                                                                              | Bir ürün: ajan destekli bir güvenlik açığı tarayıcısı                                       |
| Ağırlık merkezi     | Ajanı bir charter ve talep üzerine yüklenen bilgi yönlendirir, deterministik hook'lar da zemin sağlar                      | Geniş bir regex ağı, zorunlu bir yapay zeka incelemesini besler                             |
| Ne üretir           | Sıkılaştırılmış kod, ispatlar ve takip edilen bir bulgu zinciri                                                            | Önem derecesine göre sıralanmış, önceliklendirilmiş bir bulgu raporu                        |
| Kodunuza dokunur mu | Evet: `harden` kodunuzu düzenler                                                                                           | Hayır: yalnızca statik analiz yapar, bulgular ve öneri metni üretir                         |
| Çalışma ortamı      | Zaten kullandığınız ajan ve modelle, her seviyede çalışır                                                                  | Kendi model hattını çalıştırır, varsayılan olarak öncü seviyede bir modelle                 |
| Başlangıç           | Tek bir eklenti kurulumu ya da `npx skills add`, ardından sade bir dille yönlendirme, ayağa kaldırılacak yeni bir araç yok | Bir `.deepsec/` çalışma alanı kurulur, bağımlılıklar yüklenir ve bir model anahtarı eklenir |

## Nasıl çalışır

Lagune ajan önceliklidir: ajan yönetir, kodun ne olduğuna göre bilgiyi talep üzerine çağırır ve karara bağlanabilen bir dilimi deterministik hook'lara devreder.

Deepsec deterministik önceliklidir: geniş bir tarama adayları işaretler ve bu adaylar, zorunlu bir modele neyi inceleyip yargılayacağını gösterir.

| Yön                  | Lagune                                                                                           | Deepsec                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Sıra                 | Charter ve eşleşen bilgi ajanı yönlendirir, ajan hook'lara devreder ve gerisini kendisi yargılar | Eşleştiriciler adayları işaretler, model her birini inceleyip yargılar |
| Deterministik rol    | Bir karar döndüren ya da ajanı hedefe yönelten çok dilli hook'lar, kategori bilgisiyle birlikte  | Zorunlu modelin yargılayacağı adayları işaretleyen eşleştiriciler      |
| Geliştirme akışı     | `/lagune` siz kodlarken güvenli kodu yerinde oluşturur                                           | Kodu inceler, yazmaz                                                   |
| Denetim akışı        | `charter` → `detect` → `plan` → `harden` → `verify`                                              | `scan` → `process` → `triage` → `revalidate` → `report`                |
| Yapay zekanın görevi | Bilgiden yola çıkarak akıl yürütmek, düzeltmeyi uygulamak ve işe yaradığını kanıtlamak           | Her adayı incelemek ve bulguları raporlamak                            |

## Yaşam döngüsü

Lagune kod yazılmadan önce, yazılırken ve yazıldıktan sonra çalışır. Deepsec ise kod var olduktan sonra bir depoyu inceler.

| An               | Lagune                                                                               | Deepsec                                                         |
| ---------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Kod yokken       | `charter`, belirtilen niyetten bir güvenlik politikası çıkarır                       | Mevcut koddan başlar: `init` bir dizin ister                    |
| Geliştirirken    | `/lagune` varsayılan olarak güvenli kodu yerinde oluşturur, geride artefakt bırakmaz | Geliştirme sırasında değil, sonrasında inceler                  |
| Mevcut kodda     | `detect` → `plan` → `harden` → `verify`                                              | `scan` → `process`, temel akış                                  |
| Sürekli inceleme | Fazlar kapsama göre yeniden çalıştırılır, paketlenmiş bir CI kapısı yok              | Artımlı yeniden tarama, CI çıkış kapısı olarak `process --diff` |

## Tespit katmanı

İki deterministik katman doğası gereği zıttır: biri karar verir, diğeri işaretler.

| Yön               | Lagune                                                                             | Deepsec                                                                 |
| ----------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Gruplama          | Kategorilerde gruplanmış hook'lar ve uzmanlıklar                                   | Desen ya da framework başına eşleştiriciler                             |
| Çıktı             | Sabit metinli bir karar (finding / review / advisory) ve bir sınıflandırma etiketi | Kararsız bir aday (slug, satırlar, kod parçası, eşleşen desen)          |
| Ayar              | Kesinlik: yorumları dikkate alır, yer tutucu ve pencere korumaları vardır          | Duyarlılık: geniş ağlar, yanlış pozitifleri sonradan yapay zeka ayıklar |
| Derinlik          | Ortak sınıflarda daha derin                                                        | Daha geniş, ortak sınıflarda daha az derin                              |
| Yanlış pozitifler | Kaynakta düşük tutulur, ardından bağlam içinde yargılanır                          | Bilerek fazla üretilir, bir `revalidate` geçişiyle azaltılır            |

## Bilgi ve yargı

İkisi de regex'in taşıyamadığı güvenlik bilgisini taşır. Farkları, bu bilginin nerede durduğunda ve onu kimin şekillendirebildiğindedir.

| Yön              | Lagune                                                                             | Deepsec                                                                          |
| ---------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Biçim            | Düzenlenebilir markdown modülleri, birkaçının arkasında deterministik bir hook var | Kısa bir prompt ve teknolojiye özel vurgular, modelin kendi bilgisine dayanır    |
| Seçim            | Kodla eşleştirilir, yalnızca bağlamı mevcut olduğunda yüklenir                     | Her yapay zeka grubuna eklenir, tespit edilen teknoloji için vurgular da eklenir |
| Kim yazar        | Kullanıcı modülleri düzenler ve `specialize` ile yenilerini ekler                  | Prompt'un sahibi bakımcıdır, kullanıcı bir `INFO.md` doldurur                    |
| Yargı nerede     | Hook'lar kendi tabanlarına karar verir, ajan gerisini bilgiye dayanarak yargılar   | Merkezi: tek bir yapay zeka işlemcisi her adayı yargılar                         |
| Yeniden kullanım | Tek bir modül hem `detect` hem `verify` fazına yön verir                           | Tek bir prompt, tek `process` aşamasını yönetir                                  |

## Bulgular ve kapatma

En çok, bir bulgunun çözüldükten sonra neye dönüştüğünde ayrışırlar.

| Yön              | Lagune                                                                      | Deepsec                                                                                                          |
| ---------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Önem derecesi    | Maruziyete ve risk altındaki değerlere göre ayarlanmış bir CVSS v4.0 puanı  | Yapay zekanın verdiği bir önem derecesi ve istismar edilebilirlik ile etkiye göre P0 / P1 / P2 önceliklendirmesi |
| Kararlar         | Risk closed, not closed ya da cannot tell from the code                     | true-positive, false-positive, fixed, uncertain, accepted-risk, duplicate                                        |
| Kalıcılık        | Çalışan zincir uzlaştırılır, kapanan bulguların özü bir geçmişe çıkarılır   | Dosya başına yalnızca eklenen kayıtlar, hiçbir şey silinmez                                                      |
| Son durum        | Kapatılabilir: kanıtlanmış bir bulgu takipten çıkar, zincir durgunlaşabilir | Her bulgu kalıcı olarak saklanır, çözüldüğünde görünümlerden gizlenir                                            |
| Geçmiş ayrıntısı | Riskin ne olduğuna dair kısa bir özet                                       | Nasıl düzeltildiği dahil tüm karar geçmişi                                                                       |

## Maliyet

| Yön                 | Lagune                                                                                                                                                           | Deepsec                                                                                                                                                                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deterministik taban | Ücretsiz: hook'lar yapay zeka ve anahtar olmadan çalışır, kararları zaten üretir                                                                                 | Ücretsiz: `scan` yapay zeka olmadan çalışır, ama tek başına karar üretmez                                                                                                                                                                   |
| Tipik fatura        | Zaten kullandığınız ajanın içinde kalır: yerel bir modelle $0'a kadar iner, zaten kullandığınız planın fiyatıdır ya da API tabanlı kullanımda yineleme başınadır | [100 ile 2.000 dosya için çalıştırma başına kabaca $25 ile $1.200 arası, ölçek büyüdükçe daha fazla](https://github.com/vercel-labs/deepsec/blob/f75a16803ec5250938bacfe41571d929e8564f45/docs/getting-started.md#run-the-ai-investigation) |
| En ucuz yol         | Ücretsiz yerel bir model dahil herhangi bir model döngüyü kapatır                                                                                                | Daha ucuz ücretli seviyeler var, ama bulgular ücretli yapay zeka aşamasını gerektirir                                                                                                                                                       |

## Genişletilebilirlik ve yönetişim

Her biri, diğerinin kapalı tuttuğu katmanı açar.

| Yön                  | Lagune                                                          | Deepsec                                                        |
| -------------------- | --------------------------------------------------------------- | -------------------------------------------------------------- |
| Neyi genişletirsiniz | Modülleri düzenler ya da `specialize` ile yenilerini eklersiniz | Eşleştiriciler, ajanlar, bildirimciler ve sahiplik eklersiniz  |
| Politika katmanı     | Charter her fazı yönetir ve sürümlenir                          | Yapılandırma operasyoneldir (eşleştiriciler, modeller, yollar) |
| Adla geçersiz kılma  | İyileştirilmiş bir modül yerleşik olanı gölgeler                | Bir eşleştirici slug çakışmasında sizin eşleştiriciniz kazanır |

## Arayüzler

Deepsec bir güvenlik ekibi için teslim edilecek çıktılar üretir. Lagune ise onu çalıştıran kişi için canlı bir görünüm sunar.

| Yön                     | Lagune                                                                 | Deepsec                                                                             |
| ----------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| İnsana dönük yüzey      | Tüm zincirin sade bir dille sunulduğu canlı, yerel bir gösterge paneli | Rapor, dışa aktarma, metrik ve PR yorumu dosyaları, ayrıca bir dokümantasyon sitesi |
| Sorumluluk              | Dosyaları ve uygulanan uzmanlıkları gösterir                           | Önerilen bir sorumluya yönlendirir: nöbetçi, yönetici ya da commit'i yapan kişi     |
| Tekrarlanabilir ispat   | `prove` çalıştırılabilir testler ve bir ifşa bülteni yazar             | Tasarımı gereği statik kalır, hedefi asla çalıştırmaz                               |
| Aracın kendini koruması | Gösterge panelindeki yerel bir yazma API'sini sıkılaştırır             | Kendi yapay zeka yürütmesini güvenilmeyen hedef koda karşı sıkılaştırır             |

## Ölçek ve dağıtım

| Yön        | Lagune                                                                                           | Deepsec                                                           |
| ---------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Kurulum    | Ajanınızın eklentisinden ya da **skills** CLI aracından dokuz komut, hiçbir iskelet oluşturulmaz | Kendi paketi ve bağımlılıkları olan bir `.deepsec/` çalışma alanı |
| Ölçek yönü | Herhangi bir dilime, bir bağlama, tek bir dosyadan tüm projeye kadar kapsam daraltır             | Büyük monorepo'lara kadar tüm depoları tarar                      |
| Dağıtım    | Yalnızca yerel, tek sunucu loopback'e bağlanır                                                   | Vercel Sandbox çalışan VM'lerine isteğe bağlı dağıtım             |

## Kullanıcı deneyimi

Her birinin, onu çalıştıran kişiyle nasıl buluştuğu: ilk çalıştırmanın ne gerektirdiği ve kullanıcının onu nasıl hedeflediği.

### İlk kurulum

Lagune zaten açık olan ajan üzerinden çalışır. Deepsec ise önce kendi çalışma alanını ve model erişimini hazırlar.

| Yön                             | Lagune                                                                                 | Deepsec                                                                                                 |
| ------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| İlk komut                       | Eklenti kurulumu ya da `npx skills add wellwelwel/lagune`, ardından ajanda `/lagune-*` | `npx deepsec init`, ardından `cd .deepsec`, `pnpm install`, `scan`, `process`                           |
| Çalıştırmak için kimlik bilgisi | Ayrı bir anahtar yok, mevcut ajanınızı kullanır                                        | Bir model anahtarı (örneğin AI Gateway, 12 saatlik bir Vercel OIDC token'ı ya da bir Anthropic token'ı) |

### Yönlendirme

İkisi de yön alır. Lagune girdinin biçimini her fazda okur. Deepsec ise aynı incelemenin üzerinde çalıştığı dosya kümesini daraltır.

| Yön               | Lagune                                                                                      | Deepsec                                                        |
| ----------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Tüm proje         | Girdisi olmayan bir faz tüm kapsamı tarar                                                   | `scan` ve `process` depoyu tarar                               |
| Bir dilim         | Her faz verilen dosyalara ya da dizinlere göre kapsam daraltır                              | `--files`, `--files-from` ya da `--diff` çalıştırmayı daraltır |
| Bir endişe        | Bir faz, tarif edilen bir endişeye göre kapsam daraltır                                     | İnceleme prompt'u sabittir                                     |
| Bir öncelik bandı | `harden` ve `verify`, Critical, High, Medium ya da Low düzeyine göre kapsam daraltır        | Bulgular çalıştırmadan sonra etiketlenir                       |
| Tek bir değer     | Bir hook tek bir kod parçasını, deseni ya da URL'yi doğrudan puanlar (`--pattern`, `--url`) | İş birimi bir dosyadır                                         |

## Sıkça sorulan sorular

### Lagune'nin Deepsec'ten farkı nedir?

Lagune ajan önceliklidir ve kod yazılmadan önce, yazılırken ve yazıldıktan sonra çalışır: koddan önce politikayı belirler, geliştirirken kodu yerinde sıkılaştırır, zaten yazılmış kodu da denetler, sıkılaştırır ve doğrular. Deepsec deterministik önceliklidir: geniş bir regex taraması, mevcut kodu inceleyip değiştirmeden bulguları raporlayan zorunlu bir öncü model incelemesini besler.

### İkisinden birini ücretsiz çalıştırabilir miyim?

Lagune'nin tüm akışı ücretsiz yerel bir modelle $0'a çalışabilir ve deterministik hook'ları hiç yapay zeka kullanmadan karar üretir. Deepsec'in taraması ücretsizdir ama karar üretmez, bu yüzden her bulgu ücretli yapay zeka aşamasını gerektirir.

### İkisinden biri kodumu değiştirir mi?

Lagune değiştirir: harden düzeltmeleri kodunuza uygular. Deepsec değiştirmez: yalnızca statik analiz yapar ve bir kişinin ya da ajanın ayrıca uygulayacağı bulgular ve öneri metni üretir.
