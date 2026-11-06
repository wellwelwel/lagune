# infra hook'u: IaC yapılandırma hatalarını tespit edin

> Terraform, Dockerfile ve GitHub Actions dosyalarını yapılandırma hatalarına karşı tarayın ya da tek bir kod parçasını doğrudan komut satırından puanlayın.

Kanonik URL: https://lagune.ai/tr-TR/docs/hooks/infra
Dil: tr-TR
Orijinal: https://lagune.ai/docs/hooks/infra
Son güncelleme: 2026-11-04

`infra` hook'u, dosyanın kendisinden anlaşılabilen **kod olarak altyapı (IaC) yapılandırma hatalarını** işaretler: tüm dünyaya açık bir ağ, wildcard içeren bir izin, bir manifestteki gizli bilgi, root olarak çalışan bir konteyner, bir CI kabuğundaki güvenilmeyen bir değer. Yalnızca IaC dosyalarını okur (`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`). [`infra` uzmanlığının](https://lagune.ai/tr-TR/docs/catalog) arkasındaki deterministik motordur ve **scan** veya **check** modunda çalışır.

## Çalıştırma

**Kod tabanını tara**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**Bir kod parçasını kontrol et**

Kod parçasını `--pattern` ile, türünü de `--kind` ile verin (`terraform`, `dockerfile` veya `github-actions`).

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

Tarama en fazla iki bölüm yazdırır. **Infrastructure risks found** sıfırdan farklı bir kodla çıkar ve kesin olarak belirlenebilen kusurları içerir (hassas bir porta `0.0.0.0/0` gelen trafiği, wildcard içeren bir IAM ifadesi, bir manifestteki gizli bilgi, `encrypted = false`, sabitlenmemiş bir git modülü, açıkça root olarak çalışan bir imaj, bir `curl | sh`, bir CI betiği enjeksiyonu, `permissions: write-all`). **Infrastructure hardening advisories** çıkış kodunu değiştirmez (değişebilir bir temel etiket, etikete sabitlenmiş bir action). Temiz bir çalıştırma `no infrastructure risks found` çıktısını verir.

## Kararı nasıl okumalı

check modu, eşleştiği en yüksek önem derecesine sahip etiketi (örneğin `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`), bir öneri etiketini (`mutable-tag`, `unpinned-action`) ya da `safe` yazdırır. Yalnızca bulgu düzeyindeki bir etiket sıfırdan farklı bir kodla çıkar.

### CLI seçenekleri

| Seçenek     | Değer                                           | Açıklama                                                                              |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| `--pattern` | bir kod parçası                                 | Tek bir kod parçasını kontrol eder. `--kind` gerektirir. Birkaçı için tekrarlayın.    |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | Kod parçasının hangi tür olarak değerlendirileceği.                                   |
| `--dir`     | bir dizin                                       | Taramayı bir dizinle sınırlar. Tekrarlanabilir ve `--file` ile birleştirilebilir.     |
| `--file`    | bir dosya                                       | Taramayı tek bir dosyayla sınırlar. Tekrarlanabilir ve `--dir` ile birleştirilebilir. |

Seçenek verilmezse projedeki her IaC dosyası taranır. `--pattern`, `--dir` ya da `--file` ile birleştirilemez.

### Neyin taranacağını seçin

Hook, **Git**'in yok saydıklarını dışarıda bırakır. Daha fazlasını dışarıda bırakmak ya da **Git**'in yok saydıklarını taramak için `infra` hook'una kendi ayarlarını verin:

```bash
npx lagune write add --ignore examples --checker infra
```

```json
{
  "checkers": {
    "infra": { "gitignore": false, "ignore": ["examples"] }
  }
}
```

Tüm ayarlar [Hook'ları yapılandırın](https://lagune.ai/tr-TR/docs/hooks/configure) sayfasında açıklanır.

**İpucu**

Hook bariz ve kesin olarak belirlenebilen durumları yakalar: şifrelemenin eksikliği, `pull_request_target` kaynaklı açıklık ve doğru IAM kapsamı, değerlendirme gerektiren konulardır ve onları [`infra` uzmanlığı](https://lagune.ai/tr-TR/docs/catalog) kapsamaya devam eder.

## Sıkça sorulan sorular

### infra hook'u hangi altyapı dosyalarını okur?

Terraform ve HCL (.tf, .tf.json, .hcl), Dockerfile'lar ve .github/ altındaki GitHub Actions iş akışı ile action YAML dosyaları. Kaynak kod tarayıcıları bu dosyaları atlasa da hook onlara ulaşır.
