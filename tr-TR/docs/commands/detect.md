# /lagune-detect: sisteminizin ve risklerinin haritasını çıkarın

> Kodunuzu okuyun, sisteminizin ne yaptığını ve risklerin nerede olduğunu belirleyin.

Kanonik URL: https://lagune.ai/tr-TR/docs/commands/detect
Dil: tr-TR
Orijinal: https://lagune.ai/docs/commands/detect
Son güncelleme: 2026-11-05

🔬 Sisteminizin gerçekte ne yaptığını ve risklerin nerede olduğunu öğrenin.

Detect kodu okur ve yalnızca gerçekten bulduğunu, sonraki fazların ihtiyaç duyduğu kanıtlarla birlikte kaydeder. Temel kuralı uydurmak değil, tespit etmektir.

## Kullanım

**Tam tarama**

```prompt
/lagune-detect
```

**Yolları belirt**

```prompt
/lagune-detect src/routes/ src/auth.ts
```

**Bir endişeyi anlat**

```prompt
/lagune-detect müşteri verilerinin asla açığa çıkmadığından emin ol
```

## Neleri çıkarır

**Lagune** kodu okur ve bulduklarının haritasını çıkarır. Her bulgu, ne olduğunu, neden önemli olduğunu ve kanıtını taşır. Örneğin:

- **Dosya yükleme**, sistem kullanıcılardan dosya kabul ediyor:
  - _Neden önemli:_ görsel kılığına girmiş bir dosya, kötü amaçlı kod gizleyebilir.
  - _Kanıt:_ `POST /upload` işleyicisi, dosyanın gerçek türünü kontrol etmeden istemcinin gönderdiği MIME türüne güveniyor.
- **Oturum açma ve oturumlar**, kullanıcılar hesaplarına ulaşmak için giriş yapıyor:
  - _Neden önemli:_ zayıf oturum yönetimi, bir hesabın başka biri tarafından ele geçirilmesine yol açar.
  - _Kanıt:_ oturumların hiçbir son kullanma süresi belirlenmeden açıldığı oturum oluşturma mantığı.

Bu sırada detect, projenizin [kataloğundaki](https://lagune.ai/tr-TR/docs/catalog) her uzmanlık için koda karşı bir karar verir, bağlamı mevcut olanları uygular ve onları harden ile verify fazlarının yeniden kullandığı liste olan **Applied specializations** altında kaydeder.

Böylece sisteminizin ne yaptığının ve risklerin nerede durduğunun, sonraki adımların üzerinde çalışmasına hazır net bir haritası elinizde olur.

**İpucu**

- Yeniden çalıştırmak haritayı günceller: çözülen bulgular düşer, yenileri eklenir.
- Tespit haritası `.lagune/memory/detect.md` dosyasında durur.

## Sırada ne var

Haritayı bir plana dönüştürün: [`/lagune-plan`](https://lagune.ai/tr-TR/docs/commands/plan).

## Sıkça sorulan sorular

### /lagune-detect ne yapar?

Kodunuzu okur, sisteminizin ne yaptığını ve risklerin nerede olduğunu çıkarır ve yalnızca gerçekten bulduğunu kaydeder. Kuralı uydurmak değil, tespit etmektir.

### Lagune'de bulgu nedir?

Bulgu, tespit edilen tek bir risktir. Ne olduğunu, neden önemli olduğunu ve koddaki kanıtını taşır. plan, harden ve verify fazlarının ileriye taşıdığı takip edilen birimdir.

### Tespit haritası nerede saklanır?

.lagune/memory/detect.md dosyasında.

### Detect hangi uzmanlıkları kullanır?

Projenizin kataloğundaki her uzmanlık, koda karşı bir karar alır. Detect, bağlamı mevcut olanları uygular ve onları Applied specializations altında kaydeder.
