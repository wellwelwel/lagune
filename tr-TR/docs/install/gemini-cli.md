# Gemini CLI için Lagune uzantısı kurulumu

> Lagune'yi Gemini CLI için uzantı olarak kurun, güncel tutun ve motoruna baştan izin verin.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/gemini-cli
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/gemini-cli
Son güncelleme: 2026-11-05

Uzantıyı terminalden kurun:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## Güncelleme

**Lagune**'yi güncellemek için şunu çalıştırın:

```bash
gemini extensions update lagune
```

Otomatik olarak güncel kalması için `--auto-update` ile kurun.

## Komutlar

Komutları uzantının adıyla birlikte yazın, örneğin `/lagune:lagune-charter` yazarak `/lagune-charter` komutunu çalıştırın.

---

**İzinler**

Motor iki araçla çalışır: `lagune_read` yalnızca projenizi okur, `lagune_write` ise yalnızca `.lagune/` klasörüne yazar. **Gemini CLI** bunları yalnızca güvenilir bir klasörde başlatır. Bunlara baştan izin vermek için bu kuralı `~/.gemini/policies/lagune.toml` olarak kaydedin:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

Motor, **skills.sh** ile kurulumda olduğu gibi **npx** üzerinden çalıştığında bu kuralı aynı dosyaya ekleyin:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## Sıkça sorulan sorular

### Gemini CLI için Lagune nasıl kurulur?

gemini extensions install https://github.com/wellwelwel/lagune komutunu çalıştırın.

### Gemini CLI kullanırken Lagune nasıl güncellenir?

gemini extensions update lagune komutunu çalıştırın ya da uzantıyı --auto-update ile kurun.

### Gemini CLI kullanırken Lagune komutları nasıl çalıştırılır?

Uzantının adıyla birlikte yazın, örneğin /lagune:lagune-charter.

### Gemini CLI, Lagune'yi izin istemeden çalıştırabilir mi?

Evet. lagune sunucusunun lagune_read ve lagune_write araçlarına izin veren bir politika kuralı ekleyin. Motor npx üzerinden çalıştığında run_shell_command için npx --yes lagune@ ve bir sürüm numarasıyla başlayan komutlara izin veren bir kural daha ekleyin.
