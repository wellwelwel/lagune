# skills.sh veya GitHub CLI ile her ajana Lagune kurulumu

> Lagune'yi skills CLI aracı veya GitHub CLI ile her yapay zeka ajanına kurun ve güncel tutun.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/universal
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/universal
Son güncelleme: 2026-11-07

**skills.sh**

**Lagune** komutlarını [**skills.sh**](https://www.skills.sh/wellwelwel/lagune) ile terminalden projenize kurun ve kurulum kapsamını **Project** olarak bırakın:

```bash
npx skills add wellwelwel/lagune --skill '*'
```

Ya da bu prompt'u ajanınıza yapıştırın:

```md
`npx --yes skills add wellwelwel/lagune` komutunu çalıştır ve oluşturulan beceri talimatlarını hemen uygula. Çıktının tamamını oku, gerekirse önce geçici bir dosyaya yönlendir. Göreli yolları, sağladığı destek dosyaları dizinine göre çözümle.
```

**GitHub CLI**

**Lagune** komutlarını [**GitHub CLI**](https://cli.github.com/) 2.90.0 veya üzeri ile terminalden projenize kurun:

```bash
gh skill install wellwelwel/lagune --all --scope project
```

Ya da bu prompt'u ajanınıza yapıştırın:

```md
`gh skill install wellwelwel/lagune --all --scope project` komutunu çalıştır ve çıktının tamamını oku, gerekirse önce geçici bir dosyaya yönlendir.
```

## Güncelleme

**skills.sh**

**Lagune**'yi güncellemek için şunu çalıştırın:

```bash
npx skills update
```

Ya da bu prompt'u ajanınıza yapıştırın:

```md
`npx --yes skills update -y` komutunu çalıştır ve çıktının tamamını oku, gerekirse önce geçici bir dosyaya yönlendir.
```

**GitHub CLI**

**Lagune**'yi güncellemek için şunu çalıştırın:

```bash
gh skill update --all
```

Ya da bu prompt'u ajanınıza yapıştırın:

```md
`gh skill update --all` komutunu çalıştır ve çıktının tamamını oku, gerekirse önce geçici bir dosyaya yönlendir.
```

---

**Korumalı alan**

Ağ erişimi olmayan bir korumalı alanda komutlar motoru indiremez. Motoru kendi terminalinizden projenize kurun, bir kez ve her güncellemeden sonra:

```bash
npm i -D lagune@0.18.1
```

## Sıkça sorulan sorular

### Her yapay zeka ajanına Lagune nasıl kurulur?

Projenizde npx skills add wellwelwel/lagune --skill '*' ya da gh skill install wellwelwel/lagune --all --scope project komutunu çalıştırın veya kurulum prompt'unu ajanınıza yapıştırın.

### Her yapay zeka ajanında Lagune nasıl güncellenir?

Lagune'yi skills.sh ile kurduysanız npx skills update, GitHub CLI ile kurduysanız gh skill update --all komutunu çalıştırın. Ayrıca güncelleme prompt'unu ajanınıza yapıştırabilirsiniz.

### Lagune aynı anda birden fazla yolla kurulabilir mi?

Hayır. İki yolla kurulursa ajan her komutu iki kez listeler ya da bir kopyayı kullanıp diğerini gizler.
