# /lagune-verify: güvenlik kontrollerinin işe yaradığını kanıtlayın

> Uygulanan her düzeltmenin işe yaradığını kanıtlayın, ardından kanıtlananları kapatın.

Kanonik URL: https://lagune.ai/tr-TR/docs/commands/verify
Dil: tr-TR
Orijinal: https://lagune.ai/docs/commands/verify
Son güncelleme: 2026-11-03

⚖️ Kodu okuyup harden fazının kaydettikleriyle karşılaştırarak uygulanan her düzeltmenin işe yaradığını kanıtlayın, ardından kanıtlananları kapatın.

## Kullanım

**Tümünü doğrula**

```prompt
/lagune-verify
```

**Yolları belirt**

```prompt
/lagune-verify src/routes/upload.ts
```

**Önceliğe göre**

```prompt
/lagune-verify Critical ve High
```

## Nasıl çalışır

Harden fazının kaydettiği her noktada kodu okur ve kodun iddiayla gerçekten örtüştüğünü doğrular. İspat, bu karşılaştırmanın ta kendisidir: kod ile kayıt yan yana. Her kontrol üç karardan birini alır:

| Karar                        | Anlamı                                                      |
| ---------------------------- | ----------------------------------------------------------- |
| ✅ Risk closed               | Kod, kaydın iddia ettiğini tam olarak yapıyor.              |
| ❌ Risk not closed           | Kontrol hâlâ açık. Verify sizi harden fazına geri gönderir. |
| ❓ Cannot tell from the code | Kanıt yalnızca koda bakarak görülemiyor.                    |

Kapandığı kanıtlanan bir risk, onayınızla zincirden takipten çıkarılır. Örneğin:

- **Dosya yükleme** (Verdict: **✅ Risk closed**)
  - _Nasıl kanıtlandı:_ yükleme işleyicisi okundu ve kaydın iddia ettiği gibi dosyanın gerçek türünü içeriğinden tespit ettiği, bir boyut sınırı uyguladığı ve başka her şeyi reddettiği görüldü.
  - _Kanıt:_ gerçek dosya türünü içerikten tespit eden `handleUpload` fonksiyonu.

Risk kapanmadıysa verify bunu açıkça söyler ve düzeltme hâlâ açık olduğu için sizi [`/lagune-harden`](https://lagune.ai/tr-TR/docs/commands/harden) komutuna geri gönderir.

**İpucu**

- Tamamen sıkılaştırma kaydına dayanır.
- Kodunuzu yalnızca değerlendirmek için okur ve bir kararı geçirmek için bir kontrolü asla zayıflatmaz ya da kodu yeniden yazmaz.
- Yeniden çalıştırmak kararları uzlaştırır: güncelliğini yitirenler çıkar ve artık kapalı olmayan bir risk yeniden işaretlenir.
- Bir riskin kapandığı kanıtlandığında bir kez sorar, ardından o bulguyu tüm zincirden (detect, plan, harden ve takip) temizler.
- Kendine ait bir rapor yazmaz: her karar, `.lagune/memory/harden.md` dosyasında ilgili kontrolün bloğunda tutulur ve harden bir sonraki çalışmada onu okur.

**Harden fazına dayanır**

Verify, [`/lagune-harden`](https://lagune.ai/tr-TR/docs/commands/harden) komutuna dayanır.

## Döngü kapanır

Kapsamdaki her şey takipten çıkarıldığında döngü durgun hâle gelir. Yalnızca kod değiştiğinde yeniden açılır. Güvenlik kapatılabilir, bu yüzden akışın bir son durumu vardır, sonsuz bir döngü değildir.

## Sıkça sorulan sorular

### Lagune bir düzeltmeyi nasıl doğrular?

/lagune-verify kodu okur, harden fazının kaydettikleriyle karşılaştırır ve üç karardan birini verir: Risk closed, Risk not closed ya da Cannot tell from the code.

### Takipten çıkarmak ne demek?

Verify bir riskin kapandığını kanıtladığında bulgu takipten çıkarılır: onayınızla tüm zincirden kaldırılır, böylece yeniden işlenmez.

### Güvenlik çalışması gerçekten bitebilir mi?

Evet. SDH'de güvenlik kapatılabilir: kapandığı kanıtlanan bir bulgu takipten çıkarılır, bu yüzden akışın bir son durumu vardır, sonsuz bir döngü değildir.
