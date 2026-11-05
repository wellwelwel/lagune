# /lagune-repair: bozulan bulgu takibini onarın

> Bir yeniden adlandırma ya da taşınan bir dosya Lagune'nin takibini karıştırdığında zinciri onarın.

Kanonik URL: https://lagune.ai/tr-TR/docs/commands/repair
Dil: tr-TR
Orijinal: https://lagune.ai/docs/commands/repair
Son güncelleme: 2026-11-05

🧰 Bir yeniden adlandırma ya da taşınan bir dosya zinciri karıştırdığında onu onarın.

**Dahili bakım, bir güvenlik fazı değil**

Repair, doğrusal akıştaki altıncı bir faz değildir. Görevi takibi tutarlı tutmaktır.

```prompt
# Girdi almaz: her zaman tüm zinciri onarır
/lagune-repair
```

## Nasıl çalışır

Her detect bulgusu, plan, harden ve verify fazlarının ileri taşıdığı, her birinin üzerinde işlem yapıp adıyla yeniden raporladığı tek bir takip edilen öğedir. Her artefaktta bölüm başlığı olarak birebir aynı yazılan bu ad, baştan sona onun kimliğidir.

Takibin sakladığı tek değişken şey, öğenin işaret ettiği dosya yollarıdır. Bu yollar başka hiçbir yerde bulunmaz, bu yüzden bir yeniden adlandırma ya da taşınan bir dosya bağlantıyı yalnızca orada bozabilir, asla birbirinden ayrışan iki kopyada bozmaz. Bu olduğunda repair, kimlik yeniden adlandırmadan sağ çıksın diye haritayı (`.lagune/tracking.json`) düzeltir. Artefaktları ve takip haritasını okur, kaynak kodunuzu yalnızca yeniden adlandırılan bir dosyanın yeni yolunu öğrenmek için okur ve asla güvenlik içeriği yazmaz.

Aynı geçişte her bellek artefaktını kendi şablonuyla karşılaştırır ve sapmaları raporlayarak her birini onu düzeltecek faza yönlendirir.

**İpucu**

- Ne kodunuza ne de metin artefaktlarına dokunur, yalnızca takibe dokunur.
- Onu nadiren elle çalıştırırsınız. Bir faz zincirin tutarsız olduğunu fark ettiğinde repair'i sizin için çalıştırır ve devam eder.
- Sürdürdüğü takip, asla elle düzenlemediğiniz dahili bir durum olan `.lagune/tracking.json` dosyasında tutulur.
