# /lagune-plan: bulguları puanlayın ve düzeltmeleri planlayın

> detect fazının bulduklarını bir savunma planına dönüştürün, her bulguyu bir kategori ve CVSS v4.0 puanıyla değerlendirin ve bir düzeltmeyle eşleştirin.

Kanonik URL: https://lagune.ai/tr-TR/docs/commands/plan
Dil: tr-TR
Orijinal: https://lagune.ai/docs/commands/plan
Son güncelleme: 2026-11-03

🛡️ detect fazının bulduklarını bir savunma planına dönüştürün: her bulguyu bir kategori ve CVSS v4.0 puanıyla değerlendirin, ardından uygulanacak düzeltmeyle eşleştirin.

## Kullanım

**Her şeyi planla**

```prompt
/lagune-plan
```

**Yolları belirt**

```prompt
/lagune-plan src/routes/upload.ts
```

**Bir endişeye odaklan**

```prompt
/lagune-plan hassas verilerin nereden sızabileceği
```

## Nasıl çalışır

Bu faz detect fazının devamıdır. Detect, sisteminizin ne yaptığını ve her parçanın taşıdığı riski zaten buldu, bu yüzden plan riski tekrarlamaz, ne kadar ciddi olduğunu puanlar ve ne yapılacağına karar verir. Plan kodu asla okumaz, bu da her düzeltmeyi detect fazının gerçekten tespit ettiği bir şeye işaret etmeye zorlar. Her bulguyu CVSS v4.0 yöntemiyle puanlar: bir kategori, detect ve charter fazlarının kaydettiklerinden çıkarılıp [`cvss` hook'u](https://lagune.ai/tr-TR/docs/hooks/cvss) tarafından puanlanan bir CVSS v4.0 vektörü ve bu puanın denk geldiği öncelik aralığı. Her düzeltme ayrıca koruduğu charter ilkesini de taşır.

Örneğin:

- **Dosya yükleme** (Öncelik: **Critical**)
  - _Kategori:_ kısıtlanmamış dosya yükleme (CWE-434).
  - _CVSS:_ CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N (9.3, Critical).
  - _Neden bu öncelik:_ yükleme alanına herkes internet üzerinden erişebilir ve müşteri dosyalarını saklayan sunucuda çalışır.
  - _Koruduğu ilke:_ III. Doğrulanana kadar tüm girdiler güvenilmezdir.
  - _Düzeltme:_ dosyanın gerçek türünü ve boyutunu kontrol edin, kaydederken yeniden adlandırın ve yüklemeleri kod olarak çalıştırılamayacakları bir yerde saklayın.

Böylece her biri bir bulguya bağlı ve sonraki fazın uygulamasına hazır, puanlanmış ve önceliklendirilmiş bir düzeltme listeniz olur. Puan tahmin edilmez, hesaplanır: vektör, projenin maruziyetini ve riskteki değerleri Environmental metrikleri olarak taşır ve herkes onu FIRST ya da NVD hesaplayıcısına yapıştırıp aynı puanı yeniden elde edebilir.

**İpucu**

- Tamamen detect fazının üzerine kurulur. Bir dosyanın ya da endişenin haritası hiç çıkarılmadıysa, önce onun için `/lagune-detect` komutunu çalıştırmanızı söyler.
- Yeniden çalıştırmak planı günceller: tamamlanan düzeltmeler düşer, yenileri eklenir.
- Savunma planı `.lagune/memory/plan.md` dosyasında durur.

**detect fazına bağlıdır**

Plan yalnızca [`/lagune-detect`](https://lagune.ai/tr-TR/docs/commands/detect) komutunun zaten çıkardığı harita üzerinden çalışır, bu yüzden önce detect fazını çalıştırın.

## Sırada ne var

Planı uygulayın: [`/lagune-harden`](https://lagune.ai/tr-TR/docs/commands/harden).

## Sıkça sorulan sorular

### Lagune güvenlik açıklarını nasıl önceliklendirir?

/lagune-plan her bulguyu bir kategori ve cvss hook'unun hesapladığı bir CVSS v4.0 puanıyla değerlendirir, ardından uygulanacak düzeltmeyle eşleştirir.

### Lagune CVSS v4.0 kullanıyor mu?

Evet. Her bulgu, cvss hook'unun FIRST hesaplayıcısıyla aynı aritmetikle hesapladığı bir CVSS v4.0 vektörü ve puanı alır, böylece herkes vektörü oraya yapıştırıp puanı yeniden elde edebilir.

### Plan kodumu okur mu?

Hayır. Plan kodu asla okumaz, bu da her düzeltmeyi detect fazının gerçekten tespit ettiği bir şeye işaret etmeye zorlar.
