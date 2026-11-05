# Yapılandırma şeması

> Bir Lagune projesinin yapılandırması için JSON Schema: düzenleyicinizde otomatik tamamlama ve doğrulama sağlar, güncel Lagune'yi izler ya da bir sürüme sabitlenir.

Kanonik URL: https://lagune.ai/tr-TR/docs/references/configs-schema
Dil: tr-TR
Orijinal: https://lagune.ai/docs/references/configs-schema
Son güncelleme: 2026-11-05

`.lagune/configs.json` dosyası, projenin kullandığı [**kategorileri**](https://lagune.ai/tr-TR/docs/categories) kaydeder, projenin kendi [**uzmanlıklarını**](https://lagune.ai/tr-TR/docs/catalog) dizinler ve [**denetleyicilerin**](https://lagune.ai/tr-TR/docs/hooks/configure) neleri dışarıda bırakacağını belirler. JSON Schema'sı sayesinde düzenleyiciniz siz dosyayı düzenlerken her alanı otomatik tamamlar ve bir yazım hatasını ya da bilinmeyen bir kategoriyi işaretler.

## Güncel şema

**Lagune** dosyayı her yazdığında, içinde `$schema` bulamazsa dosyayı güncel şemaya yönlendirir:

```json
{
  "$schema": "https://lagune.ai/schemas/configs.json",
  "categories": ["owasp", "javascript"]
}
```

Bu adres her zaman güncel **Lagune**'yi izler. **Lagune** 0.16.0'dan önce yazılmış bir dosya bu adresi bir sonraki değişikliğinde alır ve o zamana kadar her faz bunu hatırlatır.

## Bir sürüme sabitleme

**Lagune**'nin 0.16.0 ve sonraki her sürümü, şemayı o sürümdeki hâliyle taşır. Şema **npm** üzerinde yayımlanır ve **jsDelivr** üzerinden sunulur. Bir sürüme sabitlemek için sürümü, `lagune@` ifadesinden sonra gelecek şekilde `$schema` adresine yazın:

```json
{
  "$schema": "https://cdn.jsdelivr.net/npm/lagune@0.16.0/schemas/configs.json"
}
```

Sürüm, herhangi bir semver aralığını kabul eder:

| Sürüm                 | Şema                         |
| --------------------- | ---------------------------- |
| `0.16.0`              | 0.16.0 sürümündeki şema      |
| `0.16.x` ya da `0.16` | En son 0.16 sürümündeki şema |
| `0.x` ya da `0`       | En son 0.x sürümündeki şema  |
| `latest`              | En son sürümdeki şema        |

## Sıkça sorulan sorular

### Lagune'nin şemaya ihtiyacı var mı?

Hayır. Şema yalnızca düzenleyicinize yardımcı olur ve Lagune dosyayı $schema olsa da olmasa da aynı şekilde okur.

### Lagune sabitlenmiş bir şemanın üzerine yazar mı?

Hayır. Lagune $schema alanını yalnızca dosyada hiç yoksa yazar ve sizin belirlediğiniz adresi korur.

### Bir sürüme ne zaman sabitlemeliyim?

Proje belirli bir Lagune sürümüyle çalışıyorsa sabitleyin. Böylece düzenleyiciniz dosyayı o sürümün kabul ettiklerine göre doğrular.
