# OpenCode için Lagune eklentisi kurulumu

> Lagune'yi OpenCode 1.x ve 2.x için eklenti olarak kurun ve güncel tutun.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/opencode
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/opencode
Son güncelleme: 2026-11-05

**OpenCode 2.x**

Eklentiyi terminalden kurun:

```bash
opencode plugin add lagune
```

Ya da `plugins` listesine eklemek için `opencode.json` dosyasını düzenleyin:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

Eklentiyi terminalden projenize kurun ya da tüm projeleriniz için kurmak üzere `-g` ekleyin:

```bash
opencode plugin lagune
```

Ya da `plugin` listesine eklemek için `opencode.json` dosyasını düzenleyin:

```json
{
  "plugin": ["lagune"]
}
```

## Güncelleme

**OpenCode 2.x**

**Lagune**'yi güncellemek için şunu çalıştırın:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

**Lagune**'yi güncellemek için yeni sürümü eskisinin üzerine kurun, tüm projeleriniz için kurduysanız `-g` ekleyin:

```bash
opencode plugin lagune@0.18.0 --force
```

## Komutlar

**OpenCode 2.x**

`@` yazıp komutu seçin, örneğin `@lagune-charter`, ardından girdinizi aynı mesaja yazın.

**OpenCode 1.x**

Komutları adlarıyla yazın, örneğin `/lagune-charter`. Komutlar `/skills` altında listelenir, `/` menüsünde değil.

---

**İzinler**

Motor iki araçla çalışır: `lagune_read` yalnızca projenizi okur, `lagune_write` ise yalnızca `.lagune/` klasörüne yazar. **OpenCode** bunları sormadan çalıştırır.

## Sıkça sorulan sorular

### OpenCode için Lagune nasıl kurulur?

OpenCode 2.x sürümünde opencode plugin add lagune komutunu çalıştırın. OpenCode 1.x sürümünde opencode plugin lagune komutunu çalıştırın, tüm projeleriniz için kurmak üzere -g ekleyin.

### OpenCode kullanırken Lagune nasıl güncellenir?

OpenCode 2.x sürümünde opencode plugin update lagune ve ardından opencode reload komutlarını çalıştırın. OpenCode 1.x sürümünde opencode plugin lagune@0.18.0 --force komutunu çalıştırın.

### OpenCode kullanırken Lagune komutları nasıl çalıştırılır?

OpenCode 2.x sürümünde @ yazıp komutu seçin, örneğin @lagune-charter, ardından girdinizi aynı mesaja yazın. OpenCode 1.x sürümünde komutları adlarıyla yazın, örneğin /lagune-charter, ya da /skills altında bulun.

### OpenCode, Lagune çalışmadan önce izin ister mi?

Hayır. OpenCode, motorun iki aracı olan lagune_read ve lagune_write araçlarını sormadan çalıştırır.
