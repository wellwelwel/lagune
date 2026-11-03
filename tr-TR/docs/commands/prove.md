# /lagune-prove: yalnızca savunma odaklı Proof of Concept

> Tespit edilen her bulguyu sorumlu ifşa için çalıştırılabilir, yalnızca savunma odaklı bir Proof of Concept'e (PoC) ve güvenlik bültenine dönüştürün.

Kanonik URL: https://lagune.ai/tr-TR/docs/commands/prove
Dil: tr-TR
Orijinal: https://lagune.ai/docs/commands/prove
Son güncelleme: 2026-11-03

🧪 Tespit edilen her bulguyu sorumlu ifşa için çalıştırılabilir, yalnızca savunma odaklı bir kanıta dönüştürün.

Tespit haritasındaki her bulgu için kendi başına okunabilen bir güvenlik bülteni ve **güvenli yolu** doğrulayan bir test yazar. Böylece test, sorun var olduğu sürece başarısız olur ve kod düzeltildiği anda geçer.

**İpucu**

**Lagune** testleri, kendi test paketinizden ayrı olarak `.lagune/` klasöründe yalıtılmış şekilde durur.

## Kullanım

**Her bulgu**

```prompt
/lagune-prove
```

**Adıyla bir bulgu**

Takip edilen bulguları adlarıyla görün:

```prompt
npx lagune read list --findings

# Findings
#   ...
#   • Kullanıcı aramasında SQL injection
#   ...
```

```prompt
# Ardından bunlardan birini kanıtla
/lagune-prove Kullanıcı aramasında SQL injection
```

## Nasıl çalışır

Her bulgunun işaret ettiği kaynak kodu okur ve kanıtlanan her bulgu için `.lagune/proofs/` altında tam olarak iki dosya içeren bir dizin yazar:

| Dosya                            | Nedir                                                                                                                                               |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `report.test.mjs` (ya da `.cjs`) | Test. Projeniz zaten Poku kullanıyorsa Poku üzerinde, aksi hâlde yerleşik Node.js çalıştırıcısında çalışır, bu yüzden hiçbir şey kurmanız gerekmez. |
| `report.md`                      | Kendi başına okunabilen bir güvenlik bülteni: önem derecesi, etki, sorunun nasıl yeniden üretildiği ve çalıştırma komutu.                           |

İspatlar her zaman JavaScript'tir, bu yüzden projeniz hangi dille yazılmış olursa olsun taşınabilir kalırlar. Bir `README.md` dizini her ispata bağlantı verir ve hepsini çalıştırmak için tek bir komut sunar.

**İpucu**

- **İsteğe bağlı ve bağımsızdır:** beş fazdan biri değildir ve takip zincirinin parçası değildir.
- Yalnızca `.lagune/proofs/` klasörüne yazar. Faz artefaktlarına ya da yalnızca okuduğu kodunuza asla dokunmaz.
- Testi sorunu yeniden üretmeyen bir bulgu ispat almaz ve uzlaştırmak için o noktada [`/lagune-detect`](https://lagune.ai/tr-TR/docs/commands/detect) komutunu çalıştırmanızı söyler.
- Yeniden çalıştırmak ispatları uzlaştırır: ortadan kalkan ya da artık yeniden üretilemeyen bir bulgunun dizini silinir.

**Not**

**Yalnızca siz çağırdığınızda çalışır:** ajan onu asla kendiliğinden başlatmaz.

**Detect fazına dayanır**

Prove, [`/lagune-detect`](https://lagune.ai/tr-TR/docs/commands/detect) komutunun tespit haritasını okur, bu yüzden önce detect fazını çalıştırın.

## Yalnızca savunma ve yalnızca yetkiyle

Herhangi bir şey üretmeden önce hedefi test etme yetkiniz olduğunu doğrular ve çalışan bir exploit, saldırı payload'ı ya da tespit atlatma isteğini reddeder. Bir ispat güvenli davranışı gösterir, asla bir saldırı girdisi üretmez.

## İspattan ifşaya

Kanıtlanan her bulgunun iki dosyası, güvenlik açığını bildirmek için bir **gizli GitHub Gist** içinde birlikte durmalıdır. Bunlar hâlâ var olan ve henüz ifşa edilmemiş bir sorunun kanıtlarıdır, bu yüzden bir `.gitignore` dosyası, bulunduğu `.lagune/proofs/` klasöründen onları her commit'in dışında tutar: bakımcılar sorunu çözene kadar onları yalnızca o Gist üzerinden paylaşın.

**Lagune** zincirinde bir bulguyu kapatmak yine [`/lagune-harden`](https://lagune.ai/tr-TR/docs/commands/harden) ve [`/lagune-verify`](https://lagune.ai/tr-TR/docs/commands/verify) komutlarının işidir: prove kanıt üretir, hiçbir şeyi kapatmaz.

## Sıkça sorulan sorular

### Lagune exploit üretir mi?

Hayır. /lagune-prove yalnızca savunma odaklı kanıt yazar: güvenli yolu doğrulayan, sorun var olduğu sürece başarısız olan ve kod düzeltildiği anda geçen bir test ile sorumlu ifşa için bir güvenlik bülteni.

### Prove ne üretir?

Her bulgu için iki dosya: bir test (report.test.mjs ya da .cjs) ve bir güvenlik bülteni (report.md).

### Lagune'nin bulduğu bir hatayı sorumlu bir şekilde nasıl bildiririm?

Prove, sorumlu ifşa ilkesine uygun olarak gizli bir GitHub Gist gibi özel bir kanaldan paylaşabileceğiniz, kendi başına okunabilen bir güvenlik bülteni yazar.
