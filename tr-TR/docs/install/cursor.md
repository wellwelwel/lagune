# Cursor için Lagune eklentisi kurulumu

> Lagune'yi Cursor ve Cursor CLI için eklenti olarak kurun, güncel tutun ve motoruna baştan izin verin.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/cursor
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/cursor
Son güncelleme: 2026-11-05

**Cursor**

- **Customize** bölümünü açın.
- **From GitHub Repository** seçeneğini seçin ve `https://github.com/wellwelwel/lagune` adresini girin.
- **Lagune** üzerinde **Install** seçeneğini seçin ve proje ya da kullanıcı kapsamını belirleyin.

**Cursor CLI**

- Pazar yerini terminalden ekleyin:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- `/plugins` komutunu bir `agent` oturumunda yazın.
- **Lagune**'yi kurun.

**Lagune** zaten **Claude Code** için kuruluysa **Cursor CLI** onu oradan yükler.

## Güncelleme

**Cursor**

- **Customize** bölümünü açın.
- `lagune` pazar yerinde **Refresh** seçeneğini seçin.

**Cursor CLI**

- Pazar yerini terminalden kaldırıp yeniden ekleyin:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- `/plugins` komutunu bir `agent` oturumunda yazın.
- **Lagune**'yi yeniden kurun.

## Komutlar

Komutları adlarıyla yazın, örneğin `/lagune-charter`.

---

**İzinler**

**Cursor** içinde komutlar motoru, varsayılan Auto-review modunun sormadan izin verdiği **npx** üzerinden çalıştırır.

**Cursor CLI** içinde motor iki araçla çalışır: `lagune_read` yalnızca projenizi okur, `lagune_write` ise yalnızca `.lagune/` klasörüne yazar. Bunlara baştan izin vermek için bu kuralları tek bir proje için `.cursor/cli.json` dosyasına, tüm projeleriniz için `~/.cursor/cli-config.json` dosyasına ekleyin:

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

Motor, **skills.sh** ile kurulumda olduğu gibi **npx** üzerinden çalıştığında `Shell(npx:--yes lagune@*)` için izin verin.

## Sıkça sorulan sorular

### Cursor için Lagune nasıl kurulur?

Cursor içinde Customize bölümünü açın, From GitHub Repository seçeneğini seçin, https://github.com/wellwelwel/lagune adresini girin ve Lagune'yi kurun. Cursor CLI içinde agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor komutunu çalıştırın, ardından Lagune'yi /plugins üzerinden kurun.

### Cursor kullanırken Lagune nasıl güncellenir?

Cursor içinde Customize bölümündeki lagune pazar yerinde Refresh seçeneğini seçin. Cursor CLI içinde lagune pazar yerini kaldırıp yeniden ekleyin, ardından Lagune'yi /plugins üzerinden yeniden kurun.

### Cursor kullanırken Lagune komutları nasıl çalıştırılır?

Adlarıyla yazın, örneğin /lagune-charter.

### Cursor, Lagune'yi izin istemeden çalıştırabilir mi?

Evet. Cursor içindeki varsayılan Auto-review modu buna zaten izin verir. Cursor CLI içinde Mcp(plugin-lagune-lagune:lagune_read) ve Mcp(plugin-lagune-lagune:lagune_write) için izin verin, motor npx üzerinden çalıştığında Shell(npx:--yes lagune@*) için de izin verin.
