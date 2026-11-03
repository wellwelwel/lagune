# Gösterge paneli

> Projenizin charter'ını, bulgularını ve kataloğunu tek komutla açılan canlı ve yerel bir görünümde izleyin.

Kanonik URL: https://lagune.ai/tr-TR/docs/get-started/dashboard
Dil: tr-TR
Orijinal: https://lagune.ai/docs/get-started/dashboard
Son güncelleme: 2026-11-03

`.lagune/` klasörünün etkileşimli, canlı bir görünümü için **Lagune**'yi alt komut vermeden doğrudan çalıştırın. Bir gösterge paneli sunar ve onu rastgele bir portta açar:

```bash
npx lagune
```

- [x] **Live reload**
- [x] **Özel** ve **yerel**
- [x] İlk charter'dan itibaren `.lagune/` klasöründe ne varsa gösterir
- [x] Projenin kategorilerini doğrudan tarayıcınızdan **yönetin**
- [x] `node_modules` ya da `package.json` dosyasına gerek yoktur 📦

![Lagune gösterge panelinde charter](https://lagune.ai/img/dashboard/02.webp)

![Lagune gösterge panelinde bulgular](https://lagune.ai/img/dashboard/03.webp)

![Lagune gösterge panelinde yan görevler](https://lagune.ai/img/dashboard/04.webp)

![Lagune gösterge panelinde bulgu ayrıntısı](https://lagune.ai/img/dashboard/05.webp)

![Lagune gösterge panelinde katalog](https://lagune.ai/img/dashboard/06.webp)

**İpucu**

- 🚪 Özel bir port belirtmek için `--port` seçeneğini kullanın.
- ⏏️ Durdurmak için `Ctrl+C` tuşlarına basın.

## Sıkça sorulan sorular

### Lagune gösterge panelini nasıl açarım?

Projenizin kök dizininde npx lagune komutunu alt komut olmadan çalıştırın. .lagune/ klasörünün canlı bir görünümünü rastgele bir portta sunar ve tarayıcınızda açar.

### Gösterge paneli özel mi?

Evet. Yalnızca kendi makinenizde, başka hiçbir bilgisayarın erişemeyeceği yerel bir adreste çalışır.

### Projemi gösterge panelinden değiştirebilir miyim?

Yalnızca kategorilerini, tarayıcınızdan. Panelin gösterdiği diğer her şey salt okunurdur.
