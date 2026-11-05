# Qwen Code için Lagune uzantısı kurulumu

> Lagune'yi Qwen Code için uzantı olarak kurun, güncel tutun ve motoruna baştan izin verin.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/qwen-code
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/qwen-code
Son güncelleme: 2026-11-05

Uzantıyı terminalden kurun:

```bash
qwen extensions install lagune
```

## Güncelleme

**Lagune**'yi güncellemek için şunu çalıştırın:

```bash
qwen extensions update lagune
```

Otomatik olarak güncel kalması için `--auto-update` ile kurun.

## Komutlar

Komutları uzantının adıyla birlikte yazın, örneğin `/lagune:lagune-charter` yazarak `/lagune-charter` komutunu çalıştırın.

---

**İzinler**

Motor iki araçla çalışır: `lagune_read` yalnızca projenizi okur, `lagune_write` ise yalnızca `.lagune/` klasörüne yazar. Bunlara baştan izin vermek için bu kuralları tek bir proje için `.qwen/settings.json` dosyasına, tüm projeleriniz için `~/.qwen/settings.json` dosyasına ekleyin:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

Motor, **skills.sh** ile kurulumda olduğu gibi **npx** üzerinden çalıştığında `Shell(npx --yes lagune@*)` için izin verin.

## Sıkça sorulan sorular

### Qwen Code için Lagune nasıl kurulur?

qwen extensions install lagune komutunu çalıştırın.

### Qwen Code kullanırken Lagune nasıl güncellenir?

qwen extensions update lagune komutunu çalıştırın ya da uzantıyı --auto-update ile kurun.

### Qwen Code kullanırken Lagune komutları nasıl çalıştırılır?

Uzantının adıyla birlikte yazın, örneğin /lagune:lagune-charter.

### Qwen Code, Lagune'yi izin istemeden çalıştırabilir mi?

Evet. Qwen Code ayarlarında mcp__lagune__lagune_read ve mcp__lagune__lagune_write için izin verin, motor npx üzerinden çalıştığında Shell(npx --yes lagune@*) için de izin verin.
