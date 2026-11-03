# cvss hook'u: bir CVSS v4.0 vektörünü puanlayın

> Bir veya birden çok CVSS v4.0 vektörünü FIRST hesaplayıcısıyla aynı aritmetikle doğrudan komut satırından puanlayın ve her birini sade bir dille okuyun.

Kanonik URL: https://lagune.ai/tr-TR/docs/hooks/cvss
Dil: tr-TR
Orijinal: https://lagune.ai/docs/hooks/cvss
Son güncelleme: 2026-11-03

`cvss` hook'u bir **CVSS v4.0 vektörünü** puanlar ve puanını ile önem derecesi aralığını yazdırır. Bu, [`/lagune-plan`](https://lagune.ai/tr-TR/docs/commands/plan) komutunun her düzeltmeye, [`/lagune-prove`](https://lagune.ai/tr-TR/docs/commands/prove) komutunun da her güvenlik bültenine yazdığı derecelendirmedir. Hook, bu derecelendirmelerin arkasındaki deterministik motordur, [FIRST hesaplayıcısıyla](https://www.first.org/cvss/calculator/4.0) aynı aritmetiği kullanır ve onu kendiniz çalıştırabilirsiniz.

## Çalıştırma

Her vektörü `--vector` ile verin. Hook her vektör için bir satır yazdırır: puanını ve aralığını.

**Tek vektör**

```bash
npx lagune read cvss --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N'
# => 9.3, Critical
```

**Birkaç vektör**

Birkaç vektörü aynı anda puanlamak için `--vector` seçeneğini tekrarlayın. Her biri için sırasıyla bir satır yazdırılır.

```bash
npx lagune read cvss \
  --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N' \
  --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A'
# => 9.3, Critical
# => 8.7, High
```

**Sade bir dille**

Her metriği sade bir dille okumak için `--explain` ekleyin. Threat veya Environmental metrikleri puanı değiştirdiğinde önce yalnızca Base metriklerine göre puan gösterilir.

```bash
npx lagune read cvss --explain --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A'
# => 8.7, High
# =>   Base metrics alone: 9.3, Critical
# =>   Attack Vector: Network, modified to Adjacent
# =>   Attack Complexity: Low
# =>   ...
```

## Sonucu nasıl okumalı

| Aralık     | Puan               |
| ---------- | ------------------ |
| `None`     | 0.0                |
| `Low`      | 0.1 ile 3.9 arası  |
| `Medium`   | 4.0 ile 6.9 arası  |
| `High`     | 7.0 ile 8.9 arası  |
| `Critical` | 9.0 ile 10.0 arası |

Yalnızca Base metrikleri içeren bir vektör, en kötüsünü varsayarak açığın kendisini puanlar: her güvenlik gereksinimi High düzeyindedir ve açık gerçek dünyada saldırıya uğramaktadır. Environmental metrikleri (`MAV` ve değiştirilmiş diğer metrikler, ayrıca `CR`, `IR` ve `AR`) puanı belirli bir dağıtım için, Threat metriği (`E`) ise istismar hakkında bilinenlere göre netleştirir.

Geçersiz bir vektör `invalid vector:` ifadesini ve sorunun ne olduğunu yazdırır, hook da sıfırdan farklı bir kodla çıkar.

### CLI seçenekleri

| Seçenek     | Değer                  | Açıklama                                                                                              |
| ----------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `--vector`  | bir `CVSS:4.0` vektörü | Tek bir vektörü puanlar. Birkaçını puanlamak için tekrarlayın, her vektöre sırasıyla bir satır düşer. |
| `--explain` |                        | Her derecelendirme satırının altına her metriği sade bir dille ekler.                                 |

En az bir `--vector` zorunludur. Vektör asla yalın bir konumsal argüman olarak verilmez, bu yüzden bir bayrakla karıştırılamaz.

**Neden bir bayrak değeri**

Her vektör bir bayrak değeri olarak verilir, asla komutun içine yerleştirilmez. Tırnak veya ters tırnak içeren bir değer etkisiz kalır ve kabuğa enjeksiyon yapamaz. Kabuğunuzun onu önceden genişletmemesi için her zaman tek tırnak içine alın.

**Neleri kapsamaz**

Yalnızca CVSS v4.0: bir v2.0, v3.0 veya v3.1 vektörü puanlanmaz, reddedilir, çünkü **Lagune** her bulguyu v4.0 ile derecelendirir.

**İpucu**

plan fazının doğrulaması her CVSS satırında aynı aritmetiği yeniden çalıştırır, bu yüzden vektöründen sapmış bir puan, plan kabul edilmeden önce yakalanır.

## Sıkça sorulan sorular

### Lagune bir CVSS puanını nasıl hesaplar?

cvss hook'u CVSS v4.0 için FIRST'ün referans hesaplayıcısını izler, bu yüzden bir vektör FIRST sitesindekiyle tam olarak aynı puanı alır.

### Bununla bir CVSS v3.1 vektörünü puanlayabilir miyim?

Hayır. Lagune her bulguyu CVSS v4.0 ile derecelendirir ve hook başka herhangi bir sürümü puanlamak yerine reddeder.

### --explain bayrağı ne işe yarar?

Her metriği sade bir dille okur ve Base puanını genel puanın yanında gösterir, böylece herkes vektörün ne söylediğini ve proje bağlamının puanı nasıl değiştirdiğini görebilir.
