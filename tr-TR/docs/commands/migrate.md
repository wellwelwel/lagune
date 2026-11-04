# Migrate: manifest tabanlı bir Lagune projesini becerilere ve eklentilere taşıyın

> Manifest tabanlı bir Lagune projesini güvenlik ilkelerinizi, artefaktlarınızı, takibinizi ve kendi uzmanlıklarınızı koruyarak beceri tabanlı Lagune'ye taşıyın.

Kanonik URL: https://lagune.ai/tr-TR/docs/commands/migrate
Dil: tr-TR
Orijinal: https://lagune.ai/docs/commands/migrate
Son güncelleme: 2026-11-04

🔀 Manifest tabanlı bir **Lagune** projesini, yazdığınız her şeyi koruyarak beceri tabanlı **Lagune**'ye taşıyın.

**Kullanımdan kaldırma bildirimi**

Manifest içeren bir proje `v1.x` sürümüne kadar olduğu gibi çalışmaya devam eder: `npx lagune`, `init`, `pull`, `update`, `add`, `remove`, `list` komutlarını ve gösterge panelini manifest tabanlı son sürüm olan `lagune@0.15.0` sürümüne devreder.

## Taşıma

1. Mevcut çalışmanızın commit edildiğinden emin olun, ardından proje kök dizininden migrate komutunu çalıştırın:

   ```bash
   npx lagune migrate
   ```

2. Taşıma incelenebilir tek bir değişiklik olarak kalsın diye yalnızca onun değiştirdiklerini commit edin.
3. [Kurulum sayfasında](https://lagune.ai/tr-TR/docs) gösterildiği gibi komutları ajanınız için kurun.
4. Projede zaten bir detect, plan ya da harden artefaktı varsa, bunlardaki ve kendi uzmanlıklarınızdaki eski referansları uzlaştırması için [`/lagune-repair`](https://lagune.ai/tr-TR/docs/commands/repair) komutundan yardım isteyin:

   ```prompt
   /lagune-repair `.lagune/memory/` altındaki artefaktlarda (`detect.md`, `plan.md` ve `harden.md`) uygulanan uzmanlıkları (eski adıyla sub-skills) yeni kataloğun listelediği adlarla uzlaştır ve `.lagune/catalog/` içindeki kendi uzmanlıklarımın `.lagune/hooks/` içindeki eski hook'lara yaptığı her çağrıyı `lagune_read` ya da `lagune_write` aracına yapılan bir çağrı olarak yeniden yaz.
   ```

## Neler değişir

| Önce                                                                   | Sonra                                                                              |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `.lagune/templates/`, `.lagune/hooks/` ve `.lagune/specializations.md` | Kaldırıldı: her beceri kendi şablonunu taşır, hook'ları ise motor çalıştırır       |
| `.lagune/skills/` içindeki yerleşik uzmanlık kopyaları                 | Kaldırıldı: yerleşik uzmanlıkları motor sunar                                      |
| `.lagune/skills/` içindeki kendi uzmanlıklarınız                       | `.lagune/catalog/` klasörüne taşındı                                               |
| Kendi uzmanlıklarınızın dizini olan `.lagune/skills.json`              | `.lagune/configs.json` ile birleştirildi                                           |
| Manifestteki kategoriler                                               | `.lagune/configs.json` dosyasına kaydedildi                                        |
| `/lagune.detect` gibi eski ajan komutları                              | Kaldırıldı: [**Lagune**'yi kurmak](https://lagune.ai/tr-TR/docs) `/lagune-detect` gibi yenilerini getirir |
| `.gitignore` içindeki **Lagune** bloğu                                 | Kaldırıldı, başka bir şey içermiyorsa dosyayla birlikte                            |
| O bloğun yok saydığı `.lagune/proofs/`                                 | Kendi `.gitignore` dosyasıyla commit'lerin dışında tutulur                         |
| `.lagune/manifest.json`                                                | En son silindi                                                                     |

Güvenlik çalışmanız olduğu gibi kalır: güvenlik ilkeleri, her fazın ürettiği artefakt ve her bulgunun işaret ettiği yollarla birlikte takip haritası.

## Sıkça sorulan sorular

### Taşıma yapmak zorunda mıyım?

Evet. Manifest tabanlı projeler kullanımdan kaldırılmıştır ve yalnızca v1.x sürümüne kadar çalışmaya devam eder, bu yüzden projenizi taşımak için npx lagune migrate komutunu çalıştırın.

### Migrate neleri korur?

Güvenlik ilkelerinizi, her faz artefaktını, takip haritasını, kategorilerinizi ve kendi uzmanlıklarınızı. Uzmanlıklar .lagune/catalog/ klasörüne taşınır, dizinleri ise kategorilerinizle birlikte .lagune/configs.json dosyasına eklenir.

### Yeni komutları ne zaman kurarım?

Migrate komutundan sonra, kurulum sayfasında ajanınız için gösterildiği gibi. Migrate yeni /lagune komutunu koruduğu için önce kurmak da işe yarar.

### Bir ekip arkadaşım taşımayı zaten yaptı. Ne çalıştırmalıyım?

Taşıma değişikliğini çekin, ardından npx lagune migrate komutunu bir kez çalıştırın. Komut, manifest tabanlı Lagune'nin kendi kopyanızda bıraktığı ve sürüm kontrolünün hiç taşımadığı dosyaları kaldırır ve ispatlarınızı commit'lerin dışında tutar.
