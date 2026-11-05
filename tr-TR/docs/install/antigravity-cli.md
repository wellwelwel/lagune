# Antigravity CLI için Lagune eklentisi kurulumu

> Lagune'yi Antigravity CLI için eklenti olarak kurun, güncel tutun ve motoruna baştan izin verin.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/antigravity-cli
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/antigravity-cli
Son güncelleme: 2026-11-05

Eklentiyi terminalden kurun:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Güncelleme

**Lagune**'yi güncellemek için yeniden kurun:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Komutlar

Komutları eklentinin adıyla birlikte yazın, örneğin `/lagune:lagune-charter` yazarak `/lagune-charter` komutunu çalıştırın.

---

**İzinler**

Motor iki araçla çalışır: `lagune_read` yalnızca projenizi okur, `lagune_write` ise yalnızca `.lagune/` klasörüne yazar. Bir oturumun ilk mesajı olarak gönderilen komut bu araçlar yüklenmeden önce çalıştığı için onların yerine **npx** kullanır. Araçlara ve **npx**'e baştan izin vermek için bu kuralları `~/.gemini/antigravity-cli/settings.json` dosyasına ekleyin:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## Sıkça sorulan sorular

### Antigravity CLI için Lagune nasıl kurulur?

agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity komutunu çalıştırın.

### Antigravity CLI kullanırken Lagune nasıl güncellenir?

agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity komutunu yeniden çalıştırın.

### Antigravity CLI kullanırken Lagune komutları nasıl çalıştırılır?

Eklentinin adıyla birlikte yazın, örneğin /lagune:lagune-charter.

### Antigravity CLI, Lagune'yi izin istemeden çalıştırabilir mi?

Evet. Antigravity CLI ayarlarında mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write) ve command(regex:npx --yes lagune@[0-9.]+) için izin verin. npx kuralı, bir oturumun ilk mesajı olarak gönderilen komutu kapsar.
