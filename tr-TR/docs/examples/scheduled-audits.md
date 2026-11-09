# Zamanlanmış denetimler: Lagune'yi düzenli aralıklarla çalıştırın

> Düzenli bir Lagune denetimini kendi anahtarınızla GitHub Actions'ta ya da Claude Code, Codex, Cursor, Antigravity veya OpenCode'da zamanlayın. Denetim ya yeni riskleri raporlar ya da tüm Blue Team akışını çalıştırır.

Kanonik URL: https://lagune.ai/tr-TR/docs/examples/scheduled-audits
Dil: tr-TR
Orijinal: https://lagune.ai/docs/examples/scheduled-audits
Son güncelleme: 2026-11-09

**Lagune**'yi projenizi kendi kendine denetleyecek şekilde zamanlayın: Bulduklarını raporlasın ya da tüm Blue Team akışını çalıştırsın.

## Zamanlama

**Universal**

**GitHub Actions**, denetimi [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/) ile bulutta çalıştırır. **Copilot CLI** motoru, seçtiğiniz model sağlayıcısını kendi anahtarınızla çağırır, bu yüzden herhangi bir ajan aboneliği gerektirmez:

- Uzantıyı `gh extension install github/gh-aw` ile kurun.
- Sağlayıcınızın anahtarını `gh secret set PROVIDER_API_KEY` ile bir depo gizli bilgisi olarak kaydedin.
- Bu iş akışını `.github/workflows/lagune-audit.md` olarak kaydedin. `<model>` yerine sağlayıcınızın araç çağırmayı destekleyen modellerinden birini, `<your-prompt>` yerine de [prompt örneklerinden](#prompt-examples) birini yazın:

  ```md
  ---
  on:
    schedule:
      - cron: '0 9 * * 1'
  permissions:
    contents: read
  engine:
    id: copilot
    model: <model>
    env:
      COPILOT_PROVIDER_TYPE: <type>
      COPILOT_PROVIDER_BASE_URL: <url>
      COPILOT_PROVIDER_API_KEY: ${{ secrets.PROVIDER_API_KEY }}
  skills:
    - wellwelwel/lagune@v0.18.1
  network:
    allowed:
      - defaults
      - node
  tools:
    edit:
    bash: [npx]
  safe-outputs:
    create-pull-request:
  ---

  <your-prompt>

  Ardından değişikliklerinle bir pull request aç.
  ```

  | Sağlayıcı                                                  | `<type>`    | `<url>`                                              |
  | ---------------------------------------------------------- | ----------- | ---------------------------------------------------- |
  | **OpenAI**                                                 | `openai`    | `https://api.openai.com/v1`                          |
  | **Anthropic**                                              | `anthropic` | `https://api.anthropic.com`                          |
  | **OpenAI** uyumlu herhangi bir API, örneğin **OpenRouter** | `openai`    | Temel URL'si, örneğin `https://openrouter.ai/api/v1` |

- `gh aw compile` komutunu çalıştırın ve iş akışını, oluşturduğu `.lock.yml` dosyasıyla birlikte commit edin.

**Bulutta** denetim, bilgisayarınız kapalıyken bile çalışır:

- **Lagune**'yi eklenti yerine [evrensel kurulumla](https://lagune.ai/tr-TR/docs/install/universal) kurup commit edin.
- Bir **Claude Code** oturumunda `/schedule` yazıp denetimi anlatın ya da denetimi [claude.ai/code/routines](https://claude.ai/code/routines) adresinde oluşturun.

**Kendi bilgisayarınızda** denetim, kendiniz için kurduğunuz eklentiyi kullanır:

- Masaüstü uygulamasının **Scheduled tasks** sayfasında yerel bir görev oluşturun.
- Araçlarını onaylayacak kimse olmadığından, [kurulum sayfasında](https://lagune.ai/tr-TR/docs/install/claude-code) gösterildiği gibi motora önceden izin verin.
- Görev yalnızca uygulama açıkken ve bilgisayarınız uyku modunda değilken çalışır.

Zamanlanmış görevler **Codex CLI** içinde değil, **ChatGPT** masaüstü uygulamasında oluşturulur ve bilgisayarınızda çalışır:

- Bir **Codex** sohbetinde denetimi, ne zaman çalışacağını ve her çalıştırmanın yeni bir sohbet başlatacağını anlatın. Sonuçlar **Scheduled** bölümüne düşer.
- Prompt'ta her komutu `$` ile adlandırın, örneğin `$lagune:lagune-detect`, böylece çalıştırma komutu açıkça çağırır.
- Yeni bir worktree yerine yerel projenizi seçin, çünkü yeni bir worktree, [projenize kurduğunuz](https://lagune.ai/tr-TR/docs/install/codex) motor olmadan başlar.
- Görev yalnızca uygulama açık, bilgisayarınız çalışır durumda ve proje diskte olduğu sürece çalışır.

**Cursor** Automations, bilgisayarınız kapalıyken bile bulutta çalışır:

- **Lagune**'yi eklenti yerine [evrensel kurulumla](https://lagune.ai/tr-TR/docs/install/universal) kurup commit edin.
- [cursor.com/automations](https://cursor.com/automations) adresinde bir otomasyon oluşturun ya da bir ajan oturumunda `/automate` ile tarif edin ve ona zamanlanmış bir tetikleyici verin.
- Zamanlanmış bir tetikleyici depo olmadan başladığı için deponuzu seçin.

**Antigravity** Automations bilgisayarınızda çalışır ve her biri yeni bir sohbette başlar:

- **Antigravity** uygulamasında **Automations** sekmesini açın ve projeniz için zamanlanmış bir otomasyon oluşturun ya da ajandan bunu kurmasını isteyin.
- Araçlarını onaylayacak kimse olmadığından, [kurulum sayfasında](https://lagune.ai/tr-TR/docs/install/antigravity-cli) gösterildiği gibi motora önceden izin verin.
- `/schedule` komutu yalnızca kendi sohbeti sürdükçe geçerli kalır, bu yüzden onun yerine bir otomasyon kullanın.
- Otomasyon yalnızca **Antigravity** çalışırken çalışır.

**OpenCode** kendi zamanlayıcısına sahip olmadığından denetim bulutta, **GitHub Actions** üzerinden çalışır:

- **Lagune**'yi [kurulum sayfasında](https://lagune.ai/tr-TR/docs/install/opencode) gösterildiği gibi deponun `opencode.json` dosyasında commit edin.
- **OpenCode** GitHub uygulamasını bağlamak ve model sağlayıcınızın anahtarını kaydetmek için `opencode github install` komutunu çalıştırın.
- Prompt'u zamanlanmış olarak **OpenCode**'a ileten bir iş akışı ekleyin (burada her pazartesi saat 09:00 UTC'de). `<KEY>` ve `<provider>/<model>` alanlarını `opencode github install` komutunun oluşturduğu iş akışındaki gibi, `<your-prompt>` alanını da [prompt örneklerinden](#prompt-examples) biriyle doldurun:

  ```yaml
  name: Lagune Audit

  on:
    schedule:
      - cron: '0 9 * * 1'

  jobs:
    audit:
      runs-on: ubuntu-latest
      permissions:
        id-token: write
        contents: read
      steps:
        - uses: actions/checkout@v6
          with:
            persist-credentials: false

        - uses: anomalyco/opencode/github@latest
          env:
            <KEY>: ${{ secrets.<KEY> }}
          with:
            model: <provider>/<model>
            prompt: |
              <your-prompt>
  ```

### Prompt örnekleri \{#prompt-examples}

**💧 Yalnızca rapor**

Kodunuzu değiştirmeden yeni riskleri belirler, düzeltmelerini planlar ve önceden uygulanmış kontrolleri yeniden denetler:

```md
Şu komutları sırayla, tek tek çalıştır: `/lagune-detect` ve `/lagune-plan`. Projede bir sıkılaştırma kaydı varsa `/lagune-verify` komutunu da çalıştır.

Projenin kodunu değiştirme. Sonunda yeni bulguları ve artık işe yaramayan uygulanmış kontrolleri özetle.
```

**🌊 Tam döngü**

Ayrıca planlanan düzeltmeleri uygular ve her birinin işe yaradığını kanıtlar, bu yüzden değişikliklerini ana dalınıza ulaşmadan önce inceleyin:

```md
Şu komutları sırayla, tek tek çalıştır: `/lagune-detect`, `/lagune-plan`, `/lagune-harden` ve `/lagune-verify`.

Sonunda uygulanan düzeltmeleri ve hâlâ açık kalan bulguları özetle.
```
