# Pi için Lagune paketi kurulumu

> Lagune'yi Pi için npm'den veya GitHub'dan paket olarak kurun ve güncel tutun.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/pi
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/pi
Son güncelleme: 2026-11-05

**npm**

Paketi terminalden kurun:

```bash
pi install npm:lagune
```

**GitHub**

Motoru **npx** üzerinden çalıştıran en son commit'i **GitHub** üzerinden kurun:

```bash
pi install git:github.com/wellwelwel/lagune
```

## Güncelleme

**npm**

**Lagune**'yi güncellemek için şunu çalıştırın:

```bash
pi update npm:lagune
```

**GitHub**

**Lagune**'yi güncellemek için şunu çalıştırın:

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` kurduğunuz tüm paketleri günceller, tek başına `pi update` ise yalnızca **Pi** uygulamasını günceller.

## Komutlar

Komutları `skill:` önekiyle yazın, örneğin `/skill:lagune-charter` yazarak `/lagune-charter` komutunu çalıştırın.

## Sıkça sorulan sorular

### Pi için Lagune nasıl kurulur?

pi install npm:lagune komutunu ya da GitHub'daki en son commit için pi install git:github.com/wellwelwel/lagune komutunu çalıştırın.

### Pi kullanırken Lagune nasıl güncellenir?

pi update npm:lagune komutunu ya da GitHub kurulumu için pi update git:github.com/wellwelwel/lagune komutunu çalıştırın. pi update --extensions kurduğunuz tüm paketleri günceller.

### Pi kullanırken Lagune komutları nasıl çalıştırılır?

skill: önekiyle yazın, örneğin /skill:lagune-charter.
