# Lagune sözlüğü: SDH, charter, bulgular ve kontroller

> Lagune ve Security-Driven Hardening terimlerinin her birinin sade bir dille tanımı: SDH, charter, detect, bulgu, kontrol, harden, verify, takipten çıkarma, kapatılabilirlik, uzmanlıklar, kategoriler ve katalog.

Kanonik URL: https://lagune.ai/tr-TR/docs/references/glossary
Dil: tr-TR
Orijinal: https://lagune.ai/docs/references/glossary
Son güncelleme: 2026-11-04

Lagune'nin ve Security-Driven Hardening metodolojisinin temel taşı olan her terim, bir kez ve sade bir dille tanımlanmış hâliyle.

### Security-Driven Hardening (SDH)

Lagune'nin uyguladığı metodoloji: bir sistemin bağlamını tespit eden, bu bağlamın taşıdığı riskleri önceliklendiren ve düzeltmelere yön veren, bağlama duyarlı bir Blue Team yaklaşımı. Güvenlik bilgisi, spesifikasyonda ve talep üzerine yüklenen uzmanlıklarında bulunur. Böylece geliştirici olan da olmayan da aynı akışla hizmet alır.

### Lagune

SDH'nin referans uygulaması: bir yapay zeka ajanının bir kod tabanını sıkılaştırmak için çalıştırdığı, her biri doldurduğu şablonla birlikte gelen dokuz ajan komutu. Her ajan bu komutları [kurulum sayfasında](https://lagune.ai/tr-TR/docs) gösterildiği gibi kendi eklenti yükleyicisiyle ya da [**skills.sh**](https://www.skills.sh/wellwelwel/lagune) üzerinden kurar ve komutlar her deterministik adım için Lagune'nin motorunu çalıştırır.

### Charter

Lagune'nin yönetici katmanı: sonraki her fazın uyması gereken, güvenliği öne koyan ilkeler. Bunu, bir projenin güvenlik duruşu için derleme zamanı denetimi gibi düşünebilirsiniz. `.lagune/memory/charter.md` dosyasında saklanır.

### Geliştirme akışı

Kodu yazılırken sıkılaştıran evrensel `/lagune` komutu. Herhangi bir aşamada herhangi bir prompt alır, istediğinizi oluşturur ve size teslim etmeden önce güvenli varsayılanlarla sıkılaştırır. Bir charter varsa ona göre yön alır. Lagune'nin takibine hiçbir şey yazmaz, bu yüzden tek ürünü sıkılaştırılmış koddur. Charter (öncesinde) ve Blue Team akışıyla (sonrasında) birlikte, Lagune'nin geliştirme sırasında koruma sağlama biçimidir.

### Blue Team akışı

Lagune'nin merkezindeki beş fazlı denetim: charter, detect, plan, harden, verify. Her faz bir öncekinin üzerine kurulur. "Blue Team", saldırgan Red Team'in karşısında yer alan savunucuların güvenlik geleneğidir.

### Bulgu

Tespit edilmiş tek bir risk. Her bulgu ne olduğunu, neden önemli olduğunu ve koddaki kanıtını taşır. Bulgu, plan, harden ve verify fazlarının ileriye taşıdığı, her artefaktta adıyla tanınan tek takip birimidir.

### Kontrol

Bir riski kapatmak için uygulanan güvenlik önlemi. Harden kontrolleri uygular, verify işe yaradıklarını kanıtlar. Lagune bir prompt'u karşılamak için bir kontrolü asla zayıflatmaz.

### Detect

Kodu okuyup sistemin ne yaptığını ve risklerin nerede olduğunu belirleyen faz. Yönetici kuralı uydurmak değil tespit etmektir: yalnızca kodun desteklediğini kaydeder.

### Harden

Kodunuza dokunan tek faz. Planın düzeltmelerini birer birer uygular ve her birini Applied, Partial ya da Blocked olarak kaydeder. Applied, henüz kanıtlandığı anlamına gelmez.

### Verify

Kodu okuyup harden fazının kaydettikleriyle karşılaştırarak uygulanan her düzeltmenin işe yaradığını kanıtlayan faz. Üç karardan birini verir: Risk closed, Risk not closed ya da Cannot tell from the code.

### Takipten çıkarma

Verify bir riskin kapandığını kanıtladığında, bulgu takipten çıkarılır: sizin onayınızla tüm zincirden kaldırılır, böylece yeniden işlenmez.

### Kapatılabilirlik

Güvenlik çalışmasının bir son durumu olması özelliği. Kapandığı kanıtlanan bir bulgu takipten çıkarıldığı için akış durgunlaşabilir ve yalnızca kod değiştiğinde yeniden açılır. SDH kapatılabilirdir, sonsuz bir döngü değildir.

### Motor

**npm** üzerindeki `lagune` paketi. Komutlar onu her deterministik adım için `npx` ile çalıştırır: hook'lar, katalog ve kategoriler.

### Uzmanlık

Yalnızca talep üzerine yüklenen, asla varsayılan olarak yüklenmeyen, odaklı ve dilden bağımsız bir güvenlik bilgisi modülü. Uzmanlık bir komut değildir. Herhangi bir prompt'a motorun `read catalog <name>` komutuyla bir uzmanlık yükleyin, örneğin `npx lagune read catalog regex`.

### Kategori

`owasp` kategorisinden `javascript`, `python`, `go` ve `rust` gibi dile özgü kategorilere kadar, adı olan bir yerleşik uzmanlık grubu. Projenin kullandığı ve `.lagune/configs.json` dosyasına kaydedilen kategoriler, hangi yerleşik uzmanlıkların kataloğa katılacağını belirler. Hiçbiri kaydedilmemişken proje yalnızca `owasp` kategorisini kullanır.

### Katalog

Projenin kullandığı uzmanlıkların kümesi: kategorilerinin yerleşik uzmanlıkları ve `/lagune-specialize` komutuyla yazılmış kendi uzmanlıkları. Motorun `read catalog` komutu kataloğu listeler, fazlar da onu kodla eşleştirir.

### Talep üzerine prompt

Her denetimin varsayılan olarak çalışması yerine, ilgili güvenlik bilgisinin projenin gerçekte ne olduğuna göre çağrılması ilkesi.

### Ada göre kimlik

Lagune'nin takip modeli: her artefaktta aynı şekilde bölüm başlığı olarak yazılan bulgu adı, zincirin tamamında o bulgunun kimliğidir. Takip haritası (`.lagune/tracking.json`) yalnızca takip bilgisini tutar, asla düz metin tutmaz.

## Sıkça sorulan sorular

### Security-Driven Hardening (SDH) nedir?

SDH, bağlama duyarlı bir Blue Team güvenlik metodolojisidir. Bir sistemin bağlamını tespit eder, bu bağlamın taşıdığı riskleri önceliklendirir ve her bulguyu sade bir dille tutarak düzeltmelere yön verir. Lagune onun referans uygulamasıdır.

### Lagune'de charter nedir?

Charter, Lagune'nin yönetici katmanıdır: sonraki her fazın uyması gereken, güvenliği öne koyan ilkeler. .lagune/memory/charter.md dosyasında saklanır.

### Bir bulguyu takipten çıkarmak ne demek?

Verify bir riskin kapandığını kanıtladığında, bulgu takipten çıkarılır: sizin onayınızla tüm zincirden kaldırılır, böylece yeniden işlenmez.
