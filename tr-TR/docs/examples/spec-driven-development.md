# Spec-Driven Development: spesifikasyonunuzla geliştirilen kodu güvenli hale getirin

> Lagune'yi Superpowers, Spec Kit veya OpenSpec ile birlikte kullanın: Güvenlik ilkelerini spesifikasyonunuzdan belirleyin, ardından spesifikasyonu /lagune ile uygulayın, böylece her görev kod yazılırken sıkılaştırılsın.

Kanonik URL: https://lagune.ai/tr-TR/docs/examples/spec-driven-development
Dil: tr-TR
Orijinal: https://lagune.ai/docs/examples/spec-driven-development
Son güncelleme: 2026-11-09

**Lagune**'yi [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit) veya [**OpenSpec**](https://github.com/Fission-AI/OpenSpec) gibi bir Spec-Driven Development aracıyla birlikte kullanın: Neyin geliştirileceğine aracınız, bunun nasıl güvenli kalacağına **Lagune** karar verir.

## Nasıl uyum sağlar

**Lagune**, aracınızın akışına iki noktada katılır ve geri kalanını değiştirmez:

1. Aracınız spesifikasyonu yazdıktan sonra [`/lagune-charter`](https://lagune.ai/tr-TR/docs/commands/charter) onu okur ve daha hiç kod yokken özelliğin gerektirdiği güvenlik ilkelerini belirler.
2. Aracınızın uygulama komutuna eklendiğinde [`/lagune`](https://lagune.ai/tr-TR/docs/commands/lagune), kod yazılırken her görevi bu ilkelere göre sıkılaştırır.

**İpucu**

Her örnekteki spesifikasyon yolunu aracınızın yazdığı dosyayla değiştirin. Projenin güvenlik ilkeleri zaten varsa aynı adım, bu ilkeleri yeni özelliğin gerektirdikleriyle günceller.

## Prompt örnekleri

Prompt'ları sırayla gönderin, her birini bir önceki bittikten sonra.

```prompt
/superpowers:brainstorming Kartla ödeme destekli misafir alışverişi.
```

```prompt
/lagune-charter docs/superpowers/specs/2026-11-09-guest-checkout-design.md
```

```prompt
/superpowers:writing-plans
```

```prompt
/superpowers:executing-plans /lagune
```

```prompt
/speckit.specify Kartla ödeme destekli misafir alışverişi.
```

```prompt
/lagune-charter specs/001-guest-checkout/spec.md
```

```prompt
/speckit.plan
```

```prompt
/speckit.tasks
```

```prompt
/speckit.implement /lagune
```

```prompt
/opsx:propose add-guest-checkout
```

```prompt
/lagune-charter openspec/changes/add-guest-checkout/proposal.md
```

```prompt
/opsx:apply /lagune
```

```prompt
/opsx:archive
```
