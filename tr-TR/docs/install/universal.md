# skills.sh ile her ajana Lagune kurulumu

> Lagune'yi skills CLI aracıyla her yapay zeka ajanına kurun ve güncel tutun.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/universal
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/universal
Son güncelleme: 2026-11-03

**Terminal**

**Lagune** komutlarını [**skills.sh**](https://www.skills.sh/wellwelwel/lagune) ile terminalden kurun:

```bash
npx skills add wellwelwel/lagune
```

**Prompt**

Bu prompt'u ajanınıza yapıştırın:

```md
`npx --yes skills add wellwelwel/lagune` komutunu çalıştır ve oluşturulan beceri talimatlarını hemen uygula. Çıktının tamamını oku, gerekirse önce geçici bir dosyaya yönlendir. Göreli yolları, sağladığı destek dosyaları dizinine göre çözümle.
```

## Güncelleme

**Terminal**

**Lagune**'yi güncellemek için şunu çalıştırın:

```bash
npx skills update
```

**Prompt**

**Lagune**'yi güncellemek için bu prompt'u ajanınıza yapıştırın:

```md
`npx --yes skills update -y` komutunu çalıştır ve çıktının tamamını oku, gerekirse önce geçici bir dosyaya yönlendir.
```

---

**Her ajan için tek yol**

**Lagune**'yi ya **skills.sh** ile ya da **eklentisiyle** kurun, asla ikisiyle birden kurmayın.

**İzinler**

Komutlar motoru `npx --yes lagune@0.16.0` olarak çalıştırır ve [her ajanın kurulum sayfası](https://lagune.ai/tr-TR/docs) buna baştan izin veren kuralı gösterir. Ağ erişimi olmayan bir korumalı alanda motoru kendi terminalinizden projenize kurun, bir kez ve her güncellemeden sonra:

```bash
npm i -D lagune@0.16.0
```

## Sıkça sorulan sorular

### Her yapay zeka ajanına Lagune nasıl kurulur?

Projenizde npx skills add wellwelwel/lagune komutunu çalıştırın ya da kurulum prompt'unu ajanınıza yapıştırın.

### skills CLI ile kurulan Lagune nasıl güncellenir?

npx skills update komutunu çalıştırın ya da güncelleme prompt'unu ajanınıza yapıştırın.

### Lagune hem skills CLI hem de bir eklentiyle kurulabilir mi?

Hayır. İkisiyle birden kurulursa ajan her komutu iki kez listeler ya da bir kopyayı kullanıp diğerini gizler.
