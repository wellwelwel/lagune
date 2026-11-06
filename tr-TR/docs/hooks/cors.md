# cors hook'u: CORS kökenlerini denetleyin

> Kaynak kodu atlatılabilir bir CORS köken izin listesine karşı tarayın ya da tek bir köken değerini aşırı serbest erişime karşı doğrudan komut satırından puanlayın.

Kanonik URL: https://lagune.ai/tr-TR/docs/hooks/cors
Dil: tr-TR
Orijinal: https://lagune.ai/docs/hooks/cors
Son güncelleme: 2026-11-04

`cors` hook'u, [`http-request` uzmanlığının](https://lagune.ai/tr-TR/docs/catalog) arkasındaki deterministik motordur ve onu kendiniz çalıştırabilirsiniz. Tek bir komutla iki modda çalışır: kaynak kodu **atlatılabilir bir köken izin listesine** (saldırganın sunucusunun yanından sızıp geçtiği bir sunucu doğrulama regex'ine) karşı tarayan **scan** ve tek bir **CORS köken** değerini `wildcard`, `null` veya `safe` olarak puanlayan **score**.

## Kod tabanını tarama

Hiçbir bayrak verilmezse tüm proje taranır.

**Tüm proje**

```bash
npx lagune read cors
```

**Bir dizin**

```bash
npx lagune read cors --dir src/server
```

**Tek bir dosya**

```bash
npx lagune read cors --file internal/auth/origin.go
```

Hook, atlatılabilir her izin listesini tek bir başlık altında, dosyaya göre gruplayarak listeler. `.+`/`.*` ifadesi güvenilen sunucu sonekinden önce, authority bölümünde yer alan bir sunucu doğrulayıcısı (`^https?://.+\.trusted\.com`), `your-site.com.attacker.com` gibi bir saldırgan sunucusunun yanından sızıp geçmesine izin verir.

```text
Origin-allowlist patterns with a greedy wildcard (bypassable, review):

internal/auth/origin.go
  ^https?://.+\.trusted\.com
```

Bu, kapatılmış bir bulgu değil, incelenmesi gereken bir ipucudur: regex'in gerçek bir güven kararını denetleyip denetlemediği metinden anlaşılamaz, bu yüzden tarama çıkış kodunu asla değiştirmez. Her birini okuyun ve izin listesinin tam eşitlikle karşılaştırdığından emin olun. Hiçbir şey bulunamazsa tek bir satır yazdırılır.

```bash
npx lagune read cors --dir src/clean
# => no bypassable origin allowlist found
```

## Bir kökeni puanlama

Her kökeni `--origin` ile verin. Hook her köken için tek bir kelime yazdırır ve herhangi bir `wildcard` ya da `null` sonucunda sıfırdan farklı bir kodla çıkar.

**Tek köken**

```bash
npx lagune read cors --origin '*'                       # => wildcard
npx lagune read cors --origin 'null'                    # => null
npx lagune read cors --origin 'https://app.example.com' # => safe
```

**Birkaç köken**

Bütün bir izin listesini tek çağrıda puanlamak için `--origin` seçeneğini tekrarlayın. Her satıra sırasıyla bir karar düşer.

```bash
npx lagune read cors \
  --origin 'https://app.example.com' \
  --origin '*' \
  --origin 'null'
# => safe
# => wildcard
# => null
```

| Karar      | Anlamı                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| `safe`     | `*`, `null` veya `*` içeren bir glob değildir. Kökenin doğru biçimlendirildiğini garanti etmez.                 |
| `wildcard` | `*` ya da bir alt alan adı, sunucu veya port glob'u: herhangi bir site (veya geniş bir küme) yanıtı okuyabilir. |
| `null`     | Korumalı alandaki iframe'lerin ve yönlendirmelerin sahteleyebildiği `null` kökeni.                              |

Yalnızca `safe` bir izindir ve `--origin` bir değer kahinidir: işleyiciyi değil değeri değerlendirir, bu yüzden işleyiciyi `http-request` uzmanlığıyla doğrulayın.

### CLI seçenekleri

| Seçenek    | Değer     | Açıklama                                                                                   |
| ---------- | --------- | ------------------------------------------------------------------------------------------ |
| `--origin` | bir köken | Tek bir köken değerini puanlar. Birkaçını puanlamak için tekrarlayın, her satıra bir tane. |
| `--dir`    | bir dizin | Taramayı bir dizinle sınırlar. Tekrarlanabilir ve `--file` ile birleştirilebilir.          |
| `--file`   | bir dosya | Taramayı tek bir dosyayla sınırlar. Tekrarlanabilir ve `--dir` ile birleştirilebilir.      |

Seçenek verilmezse tüm proje taranır. `--origin` score modudur ve `--dir` ya da `--file` ile birleştirilemez.

### Neyin taranacağını seçin

Hook, **Git**'in yok saydıklarını dışarıda bırakır. Daha fazlasını dışarıda bırakmak ya da **Git**'in yok saydıklarını taramak için `cors` hook'una kendi ayarlarını verin:

```bash
npx lagune write add --ignore test/fixtures --checker cors
```

```json
{
  "checkers": {
    "cors": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

Tüm ayarlar [Hook'ları yapılandırın](https://lagune.ai/tr-TR/docs/hooks/configure) sayfasında açıklanır.

**Neleri kapsamaz**

Tarama **atlatılabilir regex** biçimini okur, `--origin` ise köken **değerlerini** puanlar. Kaynak kod düzeyindeki iki örüntü erişim dışında kalır: isteğin `Origin` değerinin yansıtılması (sunucunun gelen `Origin` değerini geri yansıtması ya da kimlik bilgileriyle eşleştirmesi) ve serbest bir `endsWith` veya alt dize tabanlı izin listesi. Bunları kodda tanıyın ve [`http-request` uzmanlığının](https://lagune.ai/tr-TR/docs/catalog) anlattığı şekilde ele alın.

## Sıkça sorulan sorular

### Null CORS kökeni neden tehlikeli?

Korumalı alandaki iframe'ler ve bazı yönlendirmeler Origin: null gönderir, bu yüzden null değerine güvenen bir izin listesi bu bağlamlara okuma erişimi verir. cors hook'u bunu wildcard ile birlikte işaretler.

### Atlatılabilir bir CORS köken izin listesini nasıl yakalarım?

Kod tabanı üzerinde npx lagune read cors komutunu çalıştırın. Hook, açgözlü wildcard'ı güvenilen sonekten önce gelen bir sunucu doğrulama regex'ini işaretler, çünkü böyle bir regex your-site.com.attacker.com gibi bir saldırgan sunucusunun yanından sızıp geçmesine izin verir.
