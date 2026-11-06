# GitHub Copilot CLI için Lagune eklentisi kurulumu

> Lagune'yi GitHub Copilot CLI için eklenti olarak kurun ve güncel tutun.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/github-copilot-cli
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/github-copilot-cli
Son güncelleme: 2026-11-03

Eklentiyi terminalden kurun:

```bash
copilot plugin marketplace add wellwelwel/lagune
copilot plugin install lagune@lagune
```

Bir editörde **GitHub Copilot** için **Lagune**'yi [**skills.sh**](https://lagune.ai/tr-TR/docs/install/universal) ile kurun.

## Güncelleme

**Lagune**'yi güncellemek için şunu çalıştırın:

```bash
copilot plugin marketplace update lagune
copilot plugin update lagune@lagune
```

## Komutlar

Komutları adlarıyla yazın, örneğin `/lagune-charter`.

## Sıkça sorulan sorular

### GitHub Copilot CLI için Lagune nasıl kurulur?

copilot plugin marketplace add wellwelwel/lagune ve ardından copilot plugin install lagune@lagune komutlarını çalıştırın.

### GitHub Copilot CLI kullanırken Lagune nasıl güncellenir?

copilot plugin marketplace update lagune ve ardından copilot plugin update lagune@lagune komutlarını çalıştırın.

### GitHub Copilot CLI kullanırken Lagune komutları nasıl çalıştırılır?

Adlarıyla yazın, örneğin /lagune-charter.

### Lagune'yi VS Code içinde GitHub Copilot ile kullanabilir miyim?

Evet. VS Code veya başka bir editörde Lagune'yi eklenti yerine skills.sh ile kurun.
