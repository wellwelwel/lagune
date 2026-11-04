# Grok Build için Lagune eklentisi kurulumu

> Lagune'yi Grok Build için eklenti olarak kurun, güncel tutun ve motoruna baştan izin verin.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/grok-build
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/grok-build
Son güncelleme: 2026-11-04

Eklentiyi terminalden kurun:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## Güncelleme

**Lagune**'yi güncellemek için şunu çalıştırın:

```bash
grok plugin update lagune
```

## Komutlar

Komutları adlarıyla, örneğin `/lagune-charter` şeklinde ya da eklentinin adıyla birlikte, örneğin `/lagune:lagune-charter` şeklinde yazın.

---

**İzinler**

Motor iki araçla çalışır: `lagune_read` yalnızca projenizi okur, `lagune_write` ise yalnızca `.lagune/` klasörüne yazar. Bunlara baştan izin vermek için bu kuralları `~/.grok/config.toml` dosyasına ekleyin:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

Motor, **skills.sh** ile kurulumda olduğu gibi **npx** üzerinden çalıştığında `Bash(npx --yes lagune@*)` için izin verin.

## Sıkça sorulan sorular

### Grok Build için Lagune nasıl kurulur?

grok plugin install wellwelwel/lagune@plugin-grok --trust komutunu çalıştırın.

### Grok Build kullanırken Lagune nasıl güncellenir?

grok plugin update lagune komutunu çalıştırın.

### Grok Build kullanırken Lagune komutları nasıl çalıştırılır?

Adlarıyla, örneğin /lagune-charter şeklinde ya da eklentinin adıyla birlikte, örneğin /lagune:lagune-charter şeklinde yazın.

### Grok Build, Lagune'yi izin istemeden çalıştırabilir mi?

Evet. Grok Build yapılandırmasında MCPTool(lagune__lagune_read) ve MCPTool(lagune__lagune_write) için izin verin, motor npx üzerinden çalıştığında Bash(npx --yes lagune@*) için de izin verin.
