# /lagune-harden: güvenlik düzeltmelerini kodunuza uygulayın

> Plandaki düzeltmeleri kodunuza güvenli bir şekilde ve tek tek uygulayın.

Kanonik URL: https://lagune.ai/tr-TR/docs/commands/harden
Dil: tr-TR
Orijinal: https://lagune.ai/docs/commands/harden
Son güncelleme: 2026-11-05

🔧 Plandaki düzeltmeleri kodunuza güvenli bir şekilde ve tek tek uygulayın.

## Kullanım

**Tümünü uygula**

```prompt
/lagune-harden
```

**Yolları belirt**

```prompt
/lagune-harden src/routes/upload.ts
```

**Önceliğe göre**

```prompt
/lagune-harden Critical ve High
```

## Nasıl çalışır

Her düzeltmeye plan zaten karar verdiği için harden fazı yalnızca onu uygular. Kodunuza dokunan tek faz olduğundan dikkatli ilerler: her değişiklik kolayca incelenebilsin diye düzeltmeleri tek tek uygular ve bir düzeltmeyi sığdırmak için bir kontrolü asla zayıflatmaz. Örneğin dosya yükleme düzeltmesi:

- **Dosya yükleme** (Status: **Applied**)
  - _Ne değişti:_ dosyanın gerçek türünü ve boyutunu kontrol eder, beklenmeyen her şeyi reddeder, kaydederken adını değiştirir ve dosyayı kod olarak çalıştırılamayacağı bir yerde saklar.
  - _Nerede:_ `handleUpload` fonksiyonu ve çağırdığı depolama yardımcısı.

Bir düzeltme tamamen uygulanamazsa harden güvenle yapabildiğini yapar, kalanı **Partial** ya da **Blocked** olarak işaretler ve açık bırakır.

**Uygulanmış olmak doğrulanmış olmak değildir**

Applied, henüz kanıtlandığı anlamına gelmez. Bunun için [verify](https://lagune.ai/tr-TR/docs/commands/verify) vardır.

**İpucu**

- Tamamen plana dayanır. Bir düzeltme ya da dosya hiç planlanmadıysa önce onun için `/lagune-plan` komutunu çalıştırmanızı söyler.
- Yeniden çalıştırmak kaydı uzlaştırır: geri alınan değişiklikler çıkar, yeni uygulanan düzeltmeler eklenir.
- Sıkılaştırma kaydı `.lagune/memory/harden.md` dosyasında tutulur.

**Plana dayanır ve kodunuzu değiştirir**

Harden fazı [`/lagune-plan`](https://lagune.ai/tr-TR/docs/commands/plan) komutuna dayanır. Kodunuzu değiştiren tek fazdır.

## Sırada ne var

Her düzeltmenin işe yaradığını kanıtlayın: [`/lagune-verify`](https://lagune.ai/tr-TR/docs/commands/verify).

## Sıkça sorulan sorular

### /lagune-harden kodumu değiştirir mi?

Evet. Kodunuza dokunan tek fazdır ve plandaki düzeltmeleri tek tek uygular.

### Applied, Partial ve Blocked ne anlama geliyor?

Bunlar Lagune'nin her düzeltme için kaydettiği durumlardır. Applied düzeltmenin yapıldığını, Partial yalnızca bir kısmının yapıldığını, Blocked ise uygulanamadığını gösterir. Applied, henüz kanıtlandığı anlamına gelmez.

### Lagune düzeltmeleri bana sormadan mı uygular?

Bir düzenlemenin onayınızı gerektirip gerektirmediğine Lagune değil, ajanınız ve onu çalıştırdığınız izin modu karar verir. Lagune kendine ait bir onay adımı eklemez. Yine de bir düzeltmeyi karşılamak için bir kontrolü asla zayıflatmaz ve bir düzeltme charter'daki bir kuralla çelişecekse önce durup size haber verir.
