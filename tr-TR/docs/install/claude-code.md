# Claude Code için Lagune eklentisi kurulumu

> Lagune'yi Claude Code için eklenti olarak terminalden, uzantıdan veya masaüstü uygulamasından kurun, güncel tutun ve motoruna baştan izin verin.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/claude-code
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/claude-code
Son güncelleme: 2026-11-04

**Terminal**

Eklentiyi terminalden kurun:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

Ya da bir **Claude Code** oturumundan kurun:

```text
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**Uzantı**

- `/plugin` yazıp **Manage plugins** seçeneğini seçin.
- **Marketplaces** sekmesinde `wellwelwel/lagune` pazar yerini ekleyin.
- **Plugins** sekmesinde `lagune` eklentisini kurun.

**Masaüstü**

- **Lagune**'yi terminalden veya uzantıdan kurun, uzantıda **Install for you** seçeneğini seçin.
- Kendiniz için kurduğunuz eklentileri yükleyen masaüstü uygulamasında yeni bir oturum başlatın.

## Güncelleme

**Terminal**

**Lagune**'yi güncellemek için şunu çalıştırın:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

Otomatik olarak güncel kalması için `lagune` pazar yerinde, `/plugin` altındaki **Enable auto-update** seçeneğini seçin.

**Uzantı**

- `/plugin` yazıp **Manage plugins** seçeneğini seçin.
- **Marketplaces** sekmesini açın.
- `lagune` yanındaki yenileme simgesini seçin.

**Masaüstü**

- **Lagune**'yi terminalden veya uzantıdan güncelleyin.
- Masaüstü uygulamasında yeni bir oturum başlatın.

## Komutlar

Komutları adlarıyla, örneğin `/lagune-charter` şeklinde ya da eklentinin adıyla birlikte, örneğin `/lagune:lagune-charter` şeklinde yazın.

---

**İzinler**

Motor iki araçla çalışır: `lagune_read` yalnızca projenizi okur, `lagune_write` ise yalnızca `.lagune/` klasörüne yazar. Bunlara baştan izin vermek için bu kuralları tek bir proje için `.claude/settings.json` dosyasına, tüm projeleriniz için `~/.claude/settings.json` dosyasına ekleyin:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

Motor, **skills.sh** ile kurulumda olduğu gibi **npx** üzerinden çalıştığında `Bash(npx --yes lagune@*)` için izin verin. Korumalı alan açıksa `registry.npmjs.org` adresini de `sandbox.network.allowedDomains` listesine ekleyin.

## Sıkça sorulan sorular

### Claude Code için Lagune nasıl kurulur?

claude plugin install lagune --marketplace wellwelwel/lagune komutunu çalıştırın. Bir oturumda veya uzantıda, eklenti yöneticisinden wellwelwel/lagune pazar yerini ekleyip lagune eklentisini kurun. Masaüstü uygulaması, eklentiyi terminalde veya uzantıda kendiniz için kurduğunuzda onu yükler.

### Claude Code kullanırken Lagune nasıl güncellenir?

claude plugin marketplace update lagune ve ardından claude plugin update lagune@lagune komutlarını çalıştırın ya da /plugin altında lagune pazar yeri için Enable auto-update seçeneğini seçin. Uzantıda /plugin üzerinden Manage plugins bölümünü açın ve lagune pazar yerinin yanındaki yenileme simgesini seçin. Masaüstü uygulaması güncellemeyi bir sonraki oturumda yükler.

### Claude Code kullanırken Lagune komutları nasıl çalıştırılır?

Adlarıyla, örneğin /lagune-charter şeklinde ya da eklentinin adıyla birlikte, örneğin /lagune:lagune-charter şeklinde yazın.

### Claude Code, Lagune'yi izin istemeden çalıştırabilir mi?

Evet. Claude Code ayarlarınızda mcp__plugin_lagune_lagune__lagune_read ve mcp__plugin_lagune_lagune__lagune_write için izin verin, motor npx üzerinden çalıştığında Bash(npx --yes lagune@*) için de izin verin.
