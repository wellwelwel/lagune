# Kurulum: her yapay zeka ajanı için güvenlik sıkılaştırması

> Lagune'yi her projeye kurun, ajanınız destekliyorsa eklenti olarak, desteklemiyorsa skills CLI aracıyla, ardından projenize uyan güvenlik uzmanlıklarını seçin.

Kanonik URL: https://lagune.ai/tr-TR/docs
Dil: tr-TR
Orijinal: https://lagune.ai/docs
Son güncelleme: 2026-11-05

**Lagune**, yapay zeka ajanınızın bir projeyi daha güvenli hale getirmesine yardım eder. Ona kodunuzu gösterirsiniz, ajan sisteminizin gerçekte ne yaptığını çıkarır ve ardından o sistem için önemli olan güvenlik çalışmasında size yol gösterir. **Lagune**, [Security-Driven Hardening (SDH)](https://lagune.ai/tr-TR/docs/references/paper) metodolojisinin ilk projesidir.

**Açık kaynağı destekleyin**

**Lagune**'yi sevdiniz mi? [**GitHub**'da bize bir ⭐ verin](https://github.com/wellwelwel/lagune)

## Ajanınızı seçin

- [Claude Code](https://lagune.ai/tr-TR/docs/install/claude-code): Anthropic'in ajan tabanlı kodlama aracı
- [Codex](https://lagune.ai/tr-TR/docs/install/codex): OpenAI'ın kodlama ajanı
- [Cursor](https://lagune.ai/tr-TR/docs/install/cursor): Yapay zeka destekli kod editörü
- [GitHub Copilot](https://lagune.ai/tr-TR/docs/install/github-copilot-cli): GitHub'ın yapay zeka destekli eşli programlama asistanı
- [Gemini CLI](https://lagune.ai/tr-TR/docs/install/gemini-cli): Google'ın açık kaynak terminal ajanı
- [Antigravity](https://lagune.ai/tr-TR/docs/install/antigravity-cli): Google'ın ajan tabanlı geliştirme platformu
- [OpenCode](https://lagune.ai/tr-TR/docs/install/opencode): Açık kaynak kodlama ajanı
- [Devin for Terminal](https://lagune.ai/tr-TR/docs/install/devin-cli): Cognition'ın terminal ajanı
- [Factory Droid](https://lagune.ai/tr-TR/docs/install/factory-droid): Factory'nin yazılım geliştirme ajanı
- [Grok Build](https://lagune.ai/tr-TR/docs/install/grok-build): xAI'ın kodlama ajanı
- [Qwen Code](https://lagune.ai/tr-TR/docs/install/qwen-code): Qwen'in terminal kodlama ajanı
- [Kimi Code](https://lagune.ai/tr-TR/docs/install/kimi-code): Moonshot AI'ın kodlama ajanı
- [Muse Code](https://lagune.ai/tr-TR/docs/install/muse-code): Meta'nın kodlama ajanı
- [Pi](https://lagune.ai/tr-TR/docs/install/pi): Minimal bir terminal kodlama ajanı
- [Hermes Agent](https://lagune.ai/tr-TR/docs/install/hermes-agent): Nous Research imzalı açık kaynak ajan
- [Evrensel](https://lagune.ai/tr-TR/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed ve 66 ajan daha

**Bilgi**

- **Lagune** arka planda **Node.js** üzerinde çalışır, ama siz istediğiniz dili kullanırsınız.
- Tamamen çevrimdışı çalışmak için **Lagune**'yi projenize `npm i -D lagune@0.18.0` ile kurun.

## Kategoriler

**Lagune**'nin güvenlik bilgisi, [**kategoriler**](https://lagune.ai/tr-TR/docs/categories) halinde gruplanan [**uzmanlıklar**](https://lagune.ai/tr-TR/docs/catalog) olarak gelir.

- **OWASP** (`owasp`): OWASP'ın takip ettiği uygulama güvenliği risklerine karşı sıkılaştırır: enjeksiyon, bozuk erişim kontrolü, kimlik doğrulama ve kriptografi hataları
- **Altyapı** (`infra`): Konteyner, iş yükü ve serverless yapılandırmasını sıkılaştırır: Dockerfile, Compose, Pod güvenliği, FaaS IAM ve tetikleyicileri
- **Yapay zeka / LLM** (`ai`): Yapay zeka ve LLM entegrasyonlarını prompt injection'a ve güvensiz araç, ajan, retrieval ve MCP bağlantılarına karşı sıkılaştırır
- **Lovable** (`lovable`): Yapay zekayla üretilmiş Supabase uygulamalarını (Lovable ve benzerleri) sıkılaştırır: RLS boşlukları, sızdırılmış service_role anahtarları ve güvensiz varsayılanlar
- **JavaScript** (`javascript`): JavaScript'i ve çalışma ortamlarını eval ve child_process kaynaklı RCE'ye, path traversal'a ve prototype pollution'a karşı sıkılaştırır
- **Python** (`python`): Python kodunu pickle ve YAML ile seri durumdan çıkarma kaynaklı RCE'ye, str.format ile string traversal'a ve class pollution'a karşı sıkılaştırır
- **Rust** (`rust`): Rust kodunu sağlam olmayan unsafe API'lere, hatalı transmute kullanımına, tamsayı taşmasına ve FFI sınırındaki tanımsız davranışa karşı sıkılaştırır
- **Java** (`java`): Java kodunu, uzaktan kod çalıştırmayla sonuçlanan ObjectInputStream seri durumdan çıkarma gadget zincirlerine karşı sıkılaştırır
- **Ruby** (`ruby`): Ruby kodunu, uzaktan kod çalıştırmaya varan Marshal.load ve YAML seri durumdan çıkarma gadget zincirlerine karşı sıkılaştırır
- **PHP** (`php`): PHP kodunu type juggling ile kimlik doğrulama atlatmaya, object injection gadget zincirlerine ve güvensiz varsayılan yapılandırmalara karşı sıkılaştırır
- **Go** (`go`): Go kodunu typed nil arayüz hatalarına, goroutine'ler arasındaki data race'lere ve güvenlik açısından kritik yollardaki güvensiz eşzamanlılığa karşı sıkılaştırır
- **C / C++** (`c-cpp`): C ve C++ kodunu, kod çalıştırmaya imkan veren format string hatalarına, arabellek taşmalarına ve sınır dışı yazmalara karşı sıkılaştırır
- **.NET** (`dotnet`): .NET ve C# kodunu, BinaryFormatter ile seri durumdan çıkarma kaynaklı RCE'ye ve XSS'e varan kodlayıcı atlatmalarına karşı sıkılaştırır

Seçtiğiniz kategorilerin anahtarlarıyla `npx lagune write add --categories` komutunu çalıştırın.

**İpucu**

Bir proje `owasp` ile başlar ve [`/lagune-charter`](https://lagune.ai/tr-TR/docs/commands/charter) komutu, projeyi okuyarak gerekçelendirebildiği kategorileri ekler.

## Gereksinimler

Sisteminizde [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) kurulu olmalıdır.

## Rozet kullanın ✨

**Lagune** kullanıyor musunuz? **README** dosyanıza bir rozet ekleyin:

**İki tonlu**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**Düz renk**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## Sırada ne var

**Lagune**'nin [**becerilerinin**](https://lagune.ai/tr-TR/docs/get-started/commands) her birinin ne yaptığını görün.

## Sıkça sorulan sorular

### Lagune nedir?

Lagune, yapay zeka ajanınızın her kod tabanını sıkılaştırmasına yardım eden, açık kaynaklı ve yalnızca savunma odaklı bir güvenlik iş akışıdır. Ona kodunuzu gösterirsiniz, sisteminizin gerçekte ne yaptığını tespit eder, ardından o bağlam için önemli olan güvenlik düzeltmelerinde yol gösterir.

### Lagune nasıl kurulur?

Ajanınızı seçin: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI ve Hermes Agent, Lagune'yi eklenti olarak kurar, Gemini CLI ve Qwen Code uzantı olarak, Pi paket olarak kurar, diğer tüm ajanlar ise npx skills add wellwelwel/lagune ile kurar. Lagune yeni projelerde de mevcut projelerde de çalışır.

### Lagune için API anahtarı gerekir mi?

Hayır. Kendi yapay zeka ajanınız üzerinden çalışır, bu yüzden hiçbir API anahtarı gerekmez.

### Gereksinimler nelerdir?

Sisteminizde Node.js (LTS) kurulu olmalıdır.

### Lagune hangi programlama dillerini destekler?

Hepsini. Lagune arka planda Node.js üzerinde çalışır, ama hangi programlama dilinde yazılmış olursa olsun projeleri denetler ve sıkılaştırır.

### Lagune projeme ne ekler?

Projenizin güvenlik durumunu tutan, yazma yapan ilk komutun oluşturduğu bir .lagune/ dizini. skills CLI aracı ayrıca slash komutlarını projeye, ajanınızın onları okuduğu yere kurar, eklenti ise onları ajanın içinde tutar.

### Lagune nasıl güncellenir?

Kurduğunuz şekilde. Her ajanın kurulum sayfası Lagune'nin orada nasıl güncelleneceğini gösterir, skills CLI aracı ise onu npx skills update ile günceller. Güvenlik ilkeleriniz, faz artefaktlarınız ve kendi uzmanlıklarınız olduğu gibi kalır.

### Bir proje hangi uzmanlıkları kullanır?

Kategorilerinin yerleşik uzmanlıklarını ve kendi uzmanlıklarını. charter fazı, projeyi okuyarak gerekçelendirebildiği kategorileri kaydeder, npx lagune write add --categories ise onları değiştirir.

### Projemi güvenli hale getirmeden önce geliştirmeyi bitirmem gerekir mi?

Hayır. /lagune komutu, iş yazılırken onu sıkılaştırır: her prompt kabul eder, istediğinizi geliştirir ve güvenlik ilkelerinin rehberliğinde güvenli varsayılanlarla sıkılaştırır. Beş fazlı Blue Team akışı ise zaten var olanı denetler.

### Lagune mevcut bir projeyi denetleyebilir mi?

Evet. Beş fazlı Blue Team akışı zaten var olanı denetler: charter güvenlik kurallarınızı belirler, detect sistemin ne yaptığını ve risklerin nerede olduğunu çıkarır, plan her bulguyu puanlayıp bir düzeltmeyle eşleştirir, harden düzeltmeleri uygular, verify ise işe yaradıklarını kanıtlayıp onları kapatır.

### Lagune kullanmakla ajandan güvenlik açıklarını ve güvenlik kusurlarını çıkarmasını istemek arasındaki fark nedir?

Kendi başına okuyan bir ajan, güvenlik açığına benzeyeni bulur ve kontrole benzeyeni atlar. Engellenen adreslerin bir listesi, riski birisi zaten halletmiş gibi görünür, bu yüzden kimse adreslerin çoğunu kaçırdığını kontrol etmez ve kod yayına çıkar. Lagune bu varsayılanı tersine çevirir: kodda zaten bulunan bir koruma, kontrol edilene kadar kanıtlanmamış sayılır, katalogdaki her uzmanlık açık bir karar alır ve verify, bir kontrolün var olup olmadığını değil, riskin ortadan kalkıp kalkmadığını sorar. Her bulgu ayrıca çalıştırmalar boyunca takip edilen tek bir öğe olarak kalır, böylece kapandığı kanıtlanıp takipten çıkarılabilir. Sıradan bir istek ise size her seferinde, karşılaştıracak hiçbir şey bırakmayan farklı bir rapor verir.

### Lagune ile geliştirmekle ajandan güvenli kod yazmasını istemek arasındaki fark nedir?

Güvenli kod istemek, güvenlinin tanımını ajana bırakır ve neyi isteyeceğinizi bildiğinizi varsayar. Gereksinim çoğu zaman, ikiniz de görmeden, isteğinizin içinde zaten vardır: bir kullanıcının erişebildiği kursları gösteren bir sayfa istemek bir yetkilendirme kuralı koyar ve hiç yazılmayan bir kontrol, kodda fark edilecek hiçbir şey bırakmaz. /lagune komutu, ilk satır yazılmadan önce güvenlik ilkelerinizi ve geliştirilmek üzere olan şeye uyan uzmanlıkları yükler, ardından sonucu kullandığı savunmaya göre yeniden okur. Güvenli yol, güvensiz olandan nadiren daha pahalıdır, bu yüzden sonucu belirleyen hangisine uzanılacağını bilmektir ve en başta gelen de tam olarak budur.

### Lagune DAST (Dynamic Application Security Testing) çalıştırır mı, ya da çalışan uygulamamı test eder mi?

Hayır. Lagune kodu okur, sisteminizi asla çalıştırmaz ve ona özel hazırlanmış istekler göndermez. Verify, bir kontrolün kaynak kodda var ve doğru olduğunu teyit eder. Bu, kontrolün canlı bir hedefe yapılan saldırıya dayanıp dayanmadığından farklı bir sorudur, bu yüzden "Cannot tell from the code" sessiz bir onay yerine meşru bir karardır. DAST çalışma zamanı sorusunu, Lagune ise kaynak kod sorusunu yanıtlar, yani biri diğerinin yerini tutmaz. İsteğe bağlı prove komutu bile bu çizgiyi korur: testleri saldırı payload'unu değil, güvenli davranışı doğrular.

### Lagune bir pentest (sızma testi) yerine geçer mi?

Hayır, kesinlikle hayır! Pentest, bir uzmanın canlı sisteminiz üzerinde kendi muhakemesini kullandığı, bulguları birbirine zincirlediği ve hiçbir yüzey kuralının tarif etmediği iş mantığını yokladığı yetkili bir çalışmadır. Bir pentest'in bulguları, detect fazına verdiğiniz endişeler olarak Lagune Blue Team akışına girebilir, böylece bir uzmanın raporladıkları planlanır, sıkılaştırılır ve doğrulanır.

## Güvenlik politikası

Lütfen [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md) dosyasına göz atın.

## Lisans

**Lagune**, [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE) ile lisanslanmıştır.

Telif hakkı © 2026-günümüz [Weslley Araújo](https://github.com/wellwelwel) ve [katkıda bulunanlar](https://github.com/wellwelwel/lagune/graphs/contributors).
