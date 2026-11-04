# Muse Code için Lagune eklentisi kurulumu

> Lagune'yi Muse Code için eklenti olarak kurun, güncel tutun ve motorunu korumalı alan içinde çalıştırın.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/muse-code
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/muse-code
Son güncelleme: 2026-11-04

Eklentiyi terminalden kurun:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## Güncelleme

**Lagune**'yi güncellemek için pazar yerini yenileyin ve eklentiyi yeniden kurun:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## Komutlar

Komutları adlarıyla, örneğin `/lagune-charter` şeklinde ya da eklentinin adıyla birlikte, örneğin `/lagune:lagune-charter` şeklinde yazın.

---

**İzinler**

**Muse Code** korumalı alanı motoru indiremez. Motoru kendi terminalinizden projenize kurun, bir kez ve her güncellemeden sonra:

```bash
npm i -D lagune@0.17.0
```

## Sıkça sorulan sorular

### Muse Code için Lagune nasıl kurulur?

muse plugins marketplace add lagune wellwelwel/lagune ve ardından muse plugins install lagune@lagune komutlarını çalıştırın.

### Muse Code kullanırken Lagune nasıl güncellenir?

muse plugins marketplace update lagune komutunu çalıştırın, ardından muse plugins remove lagune ve muse plugins install lagune@lagune ile yeniden kurun.

### Muse Code kullanırken Lagune komutları nasıl çalıştırılır?

Adlarıyla, örneğin /lagune-charter şeklinde ya da eklentinin adıyla birlikte, örneğin /lagune:lagune-charter şeklinde yazın.

### Lagune, Muse Code korumalı alanı içinde çalışır mı?

Evet, motoru kendi terminalinizden npm i -D lagune@0.17.0 ile projenize kurduğunuzda çalışır. Bunu bir kez ve her güncellemeden sonra yapın.
