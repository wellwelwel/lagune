# /lagune-specialize: düz metinle bir güvenlik uzmanlığı eğitin

> Verdiğiniz bir güvenlik kaynağının ya da konusunun özünü çıkararak talep üzerine yüklenen yeni bir uzmanlığa dönüştürün.

Kanonik URL: https://lagune.ai/tr-TR/docs/commands/specialize
Dil: tr-TR
Orijinal: https://lagune.ai/docs/commands/specialize
Son güncelleme: 2026-11-04

🎓 Verdiğiniz bir kaynaktan ya da konudan **Lagune**'ye yeni bir uzmanlık öğretin.

Materyali okur ve özünü çıkararak odaklı, yalnızca savunma odaklı bir uzmanlığa dönüştürür. Bu uzmanlık [yerleşik olanlarla](https://lagune.ai/tr-TR/docs/catalog) tamamen aynı biçimdedir, böylece detect ve verify fazları onu sonrasında diğerleri gibi yükler. Yalnızca denetler ve açıklar: asla saldırı girdisi ya da exploit yazmaz ve kodunuza asla dokunmaz.

**Bir makaleden**

```prompt
# Bir bağlantı ya da kaynak: Lagune onun özünü çıkarıp savunmaya dönüştürür
/lagune-specialize https://owasp.org/www-community/attacks/SQL_Injection
```

**Bir exploit**

```prompt
# Kaynak olarak bir saldırı: uzmanlık yine de savunmayı anlatır
/lagune-specialize "' OR 1=1 -- sorgu metnine SQL ekler"
```

**Bir konudan**

```prompt
# Ya da yalnızca neyi kapsaması gerektiğini söyle
/lagune-specialize SQL injection
```

**Bir saldırı kaynak olabilir, asla çıktı olamaz**

Amaç ona karşı savunma yapmaksa onu bir saldırıya yönlendirmek sorun değildir: bir exploit yazısı, özünü çıkarıp savunmaya dönüştürdüğü bir çalışma materyalidir. Ürettiği uzmanlık her zaman denetler ve açıklar, asla çalışan bir exploit, payload ya da atlatma yöntemi üretmez.

## Ne yazar

Sonuç, projenizde kodunuzla birlikte commit edilen ve incelenebilen iki dosyadır:

- [Yerleşik olanlar](https://lagune.ai/tr-TR/docs/catalog) gibi biçimlendirilmiş, `.lagune/catalog/<name>.md` konumundaki uzmanlık.
- Projenizin kendi uzmanlıklarını, kataloğun yerleşik olanlarla birleştirmesi için dizinlediği `.lagune/configs.json` dosyasındaki kaydı.

Ardından yeni kaydın orada olduğunu doğrulamak için kataloğu listeler. Kendi uzmanlıklarınız, kataloğun kategorileri ne olursa olsun her zaman kataloğun içindedir. Hiçbir zaman bir komut eklemez ya da pakete dokunmazsınız: yeni bir uzmanlık alanı, kendi projenize yazılan bir bilgi dosyası ve bir dizin kaydından ibarettir.

## İyileştirir, asla üzerine yazmaz

`regex` gibi yerleşik bir uzmanlık ya da daha önce oluşturduğunuz bir uzmanlık olsun, zaten var olan bir adı yeniden uzmanlaştırmak mevcut dosyayı değiştirmek yerine onu **uzlaştırır**. Orada olanı okur, yeni bilgiyi içine katar, hâlâ geçerli olanı korur ve değişeni yeniden yazar. Görülmeden hiçbir şey atılmaz. Sizin bir uzmanlığınız aynı adlı yerleşik uzmanlığı gölgeler, böylece yerleşik bir uzmanlığı kaybetmeden kendi projeniz için keskinleştirebilirsiniz.

**İpucu**

- Yeni uzmanlık tam olarak yerleşik bir uzmanlık gibi yüklenir: detect ve verify fazları onu talep üzerine alır, ya da `npx lagune read catalog <name>` ile kendiniz yükleyip ona bir görev verirsiniz.
- Materyalin belirlenebilir bir kaynağı olduğunda (bir makale, bir yazar, bir bağlantı, bir standart) uzmanlık o kaynağa atıf yapar. Yalnızca bir konu verildiğinde kaynak belirtilmez.

**Not**

**Yalnızca siz çağırdığınızda çalışır:** ajan onu asla kendiliğinden başlatmaz.

## Sıkça sorulan sorular

### Özel bir güvenlik uzmanlığını nasıl eklerim?

/lagune-specialize komutunu bir kaynak ya da konuyla çalıştırın. Komut, onun özünü çıkararak yalnızca savunma odaklı bir uzmanlığa dönüştürür ve bunu .lagune/catalog/<name>.md dosyasına, kaydını da .lagune/configs.json dosyasına yazar.

### Lagune bir exploit yazısından öğrenebilir mi?

Evet, kaynak olarak, asla çıktı olarak değil. Bir saldırı kaynak olabilir, asla ürün olamaz. Specialize asla saldırı girdisi ya da exploit yazmaz.

### Specialize yerleşik uzmanlıkların üzerine yazar mı?

Hayır. İyileştirir, asla üzerine yazmaz.
