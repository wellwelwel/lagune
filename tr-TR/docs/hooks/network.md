# network hook'u: URL'leri SSRF'ye karşı puanlayın

> Bir veya birden çok istek hedefini doğrudan komut satırından SSRF'ye karşı puanlayın.

Kanonik URL: https://lagune.ai/tr-TR/docs/hooks/network
Dil: tr-TR
Orijinal: https://lagune.ai/docs/hooks/network
Son güncelleme: 2026-11-05

`network` hook'u, sunucu tarafındaki bir istek hedefinin **SSRF**'ye (iç servislere, bulut meta verilerine veya özel sunuculara yöneltilebilen bir istek) karşı güvenli olup olmadığına karar verir. [`network` uzmanlığının](https://lagune.ai/tr-TR/docs/catalog) arkasındaki deterministik motordur ve onu kendiniz çalıştırabilirsiniz.

## Çalıştırma

Her hedefi `--url` ile verin. Hook her hedef için tek bir kelime yazdırır, anlamları aşağıdaki tabloda yer alır.

**Tek hedef**

```bash
npx lagune read network --url 'http://example.com/'
# => safe

npx lagune read network --url 'http://0x7f000001/'
# => private-target
```

**Birkaç hedef**

Bütün bir izin listesini ya da engelleme listesini tek çağrıda puanlamak için `--url` seçeneğini tekrarlayın. Her satıra sırasıyla bir karar düşer.

```bash
npx lagune read network \
  --url 'http://example.com/' \
  --url 'http://[::1]/' \
  --url 'http://allowed.com@evil.example/'
# => safe
# => private-target
# => parser-divergent
```

Hook, sunucu adını ağın çözümlediği şekilde çözümler, bu yüzden bir iç adresin kodlanmış biçimleri gözden kaçmaz: onaltılık, sekizlik, noktasız ondalık, kısaltılmış, IPv6 ve IPv4-mapped biçimlerin hepsi `private-target` sonucunu verir. Özensiz bir doğrulayıcının ve gerçek istemcinin farklı sunucular okuyacağı durumlarda ise karar `parser-divergent` olur.

## Kararı nasıl okumalı

| Karar              | Anlamı                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `safe`             | Hedef herkese açık bir sunucuya bağlanır ve özensiz bir doğrulayıcı da aynı sunucuyu okur.        |
| `private-target`   | Sunucu adı özel, loopback, link-local, belirtilmemiş ya da bulut meta verisi adresine çözümlenir. |
| `parser-divergent` | Özensiz bir metin doğrulayıcısı, istemcinin bağlandığından farklı bir gerçek sunucu okur.         |
| `invalid url`      | Dize bir URL olarak ayrıştırılamaz, yani istenecek bir şey yoktur.                                |

Yalnızca `safe` bir izindir. `private-target`, `parser-divergent` ve `invalid url` sonuçlarının hepsini engelleme olarak ele alın.

### CLI seçenekleri

| Seçenek | Değer                   | Açıklama                                                                                           |
| ------- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| `--url` | bir URL veya sunucu adı | Tek bir hedefi kontrol eder. Birkaçını kontrol etmek için tekrarlayın, her satıra bir karar düşer. |

En az bir `--url` zorunludur. Hedef asla yalın bir konumsal argüman olarak verilmez, bu yüzden bir bayrakla karıştırılamaz.

**Neden bir bayrak değeri**

Her hedef bir bayrak değeri olarak verilir, asla komutun içine yerleştirilmez. Tırnak veya ters tırnak içeren bir değer etkisiz kalır ve kabuğa enjeksiyon yapamaz. Kabuğunuzun onu önceden genişletmemesi için her zaman tek tırnak içine alın.

**Neleri kapsamaz**

Hook saf bir işlevdir ve asla DNS çözümlemesi yapmaz, bu yüzden çalışma zamanına ait iki boşluk kapsam dışında kalır: **DNS rebinding** (kontrol edilirken herkese açık, istek yapılırken iç adrese çözümlenen bir ad) ve **yönlendirme zincirleri** (kontrolden geçen, sonra içeriye yönlendiren ilk adım). Bunları, adı bir kez çözümleyip doğrulanan adrese bağlanarak ve yönlendirmeleri reddederek kapatın. Hook, ayrılmış loopback adlarını (`localhost` ve `.localhost` ailesi) çözümleme yapmadan iç adres olarak sabitler, ancak diğer her DNS adı `safe` sonucunu verir, çünkü bir adın içeriye çözümlendiğini öne sürmek çözümleme gerektirir: bu adları izin listesi korur ve bu denetleyicinin doğruladığı da odur.

**İpucu**

Bu, [`network` uzmanlığının](https://lagune.ai/tr-TR/docs/catalog) bir hedef filtresinin işe yaradığını kanıtlamak için çalıştırdığı kontrolün aynısıdır.

## Sıkça sorulan sorular

### Bir URL'yi SSRF'ye karşı nasıl test ederim?

network hook'unu çalıştırın. Hook bir istek hedefini puanlar ve safe, private-target, parser-divergent veya invalid url sonucunu döndürür. Yalnızca safe bir izindir.

### Parser-divergent URL nedir?

Farklı ayrıştırıcıların farklı okuduğu bir URL'dir ve klasik bir SSRF atlatma yöntemidir. network hook'u ona izin vermek yerine onu işaretler.
