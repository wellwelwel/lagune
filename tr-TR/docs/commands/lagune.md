# /lagune: yapay zeka yazarken kodu güvenli hale getirin

> İstediğinizi geliştirir ve charter rehberliğinde, izlenecek bir akış olmadan, yazılırken sıkılaştırır.

Kanonik URL: https://lagune.ai/tr-TR/docs/commands/lagune
Dil: tr-TR
Orijinal: https://lagune.ai/docs/commands/lagune
Son güncelleme: 2026-11-03

⌨️ İstediğiniz işi yapın, yazılırken güvenli hale gelsin. **`/lagune`** her aşamada her prompt'u kabul eder, istediğinizi geliştirir ve size geri vermeden önce güvenli varsayılanlarla sıkılaştırır.

## Kullanım

Herhangi bir prompt'ta **`/lagune`** komutunu belirtin ve işi her zamanki gibi anlatın.

**📘 Ajan talimatları**

```md
# Ajanlar için proje talimatlarım

<!-- ... -->

## Güvenlik

- Kod geliştirdiğinde ya da değiştirdiğinde her seferinde `/lagune` becerisini kullan, böylece güvenliği varsayılan olarak iyileştirsin.
```

    - Örneğin: **AGENTS.md**, **CLAUDE.md**, **.github/copilot-instructions.md**, **.cursorrules** vb.

**💬 Bir özellik**

```prompt
/lagune kullanıcıların profillerine özel bir fotoğraf yükleyebilmesini sağla.
```

**💬 Bir düzeltme**

```prompt
/lagune kullanıcı formu gönderdiğinde hiçbir şey olmuyor. Sebebi ne olabilir, araştır ve düzelt.
```

**💬 Bir refactor**

```prompt
/lagune payload mantığını ayrıştır ve iyileştir
```

**Charter isteğe bağlı, ama onunla daha iyi**

**`/lagune`** charter olsun ya da olmasın çalışır. Charter varsa, projenizin kendi kuralları her geliştirmeyi şekillendirir. Kuralları bir kez [`/lagune-charter`](https://lagune.ai/tr-TR/docs/commands/charter) ile belirleyin.

## Nasıl çalışır

İşi, Lagune'ye hiçbir şey yazmadan üç adımda ele alır:

1. Varsa charter'ınızı yükler ve onun ilkeleri tüm geliştirmeyi yönetir. Henüz charter'ınız yoksa, varsayılan olarak güvenli bir temel çizgiye döner.
2. Projenizin [kataloğunu](https://lagune.ai/tr-TR/docs/catalog) listeler ve yalnızca işinizin dokunduğu uzmanlıkları yükler. Bunlar, denetim akışının kullandığı talep üzerine bilginin aynısıdır.
3. Savunmayı kod yazılırken uygular, ardından işi geri vermeden önce kontrollerin gerçekten işe yaradığını doğrulamak için kendi sonucunu yeniden okur.

Sonuç, projenizde ilk satırdan itibaren güvenli, çalışan koddur.

**İstediğiniz zaman kullanın**

detect yok, plan yok, sonradan temizlik yok. **`/lagune`**, sıfırdan bir iskelete de olgun bir kod tabanındaki bir değişikliğe de aynı şekilde uyar ve işi sonra değil, ilerledikçe sıkılaştırır.

## Ne yapmaz

- `.lagune` dizinine hiçbir şey yazmaz, ne artefakt ne de takip. Ürettiği tek şey, istediğiniz sıkılaştırılmış koddur.
- Bir prompt'u karşılamak için bir kuralı gevşetmez. İstediğiniz şey bir charter ilkesini çiğneyecekse, onu doğrudan güvensiz şekilde geliştirmek yerine durur ve önce size söyler.

## Sıkça sorulan sorular

### /lagune ne yapar?

Her aşamada her prompt'u kabul eder, istediğinizi geliştirir ve geri vermeden önce güvenli varsayılanlarla sıkılaştırır. Savunma sonra değil, kod yazılırken uygulanır.

### /lagune kullanmak için charter'a ihtiyacım var mı?

Hayır. Charter olsun ya da olmasın çalışır. Charter varsa, projenizin kendi kuralları her geliştirmeyi şekillendirir. Yoksa, varsayılan olarak güvenli bir temel çizgiye döner.

### /lagune ile Blue Team akışı arasındaki fark nedir?

/lagune yeni işi siz yazarken, izlenecek bir akış olmadan güvenli hale getirir. Blue Team akışı ise beş denetim fazını mevcut bir proje üzerinde sırayla çalıştırır.

### /lagune bulguları takip eder mi ya da artefakt yazar mı?

Hayır. .lagune dizinine hiçbir şey yazmaz, ne artefakt ne de takip. Ürettiği tek şey, istediğiniz sıkılaştırılmış koddur.

### Ajanımın /lagune komutunu otomatik kullanmasını nasıl sağlarım?

Ajanınızın talimat dosyasına (AGENTS.md, CLAUDE.md, .cursorrules ve benzerleri), kod geliştirdiğinde ya da değiştirdiğinde her seferinde /lagune becerisini kullanmasını söyleyen bir talimat ekleyin.
