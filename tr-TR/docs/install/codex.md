# Codex CLI için Lagune eklentisi kurulumu

> Lagune'yi Codex CLI için eklenti olarak kurun, güncel tutun ve motorunu korumalı alan içinde çalıştırın.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/codex
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/codex
Son güncelleme: 2026-11-07

Eklentiyi terminalden kurun:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## Güncelleme

**Lagune**'yi güncellemek için şunu çalıştırın:

```bash
codex plugin marketplace upgrade lagune
```

## Komutlar

`$` yazın, ardından eklentinin adıyla birlikte komutu ve girdinizi yazın, örneğin `$lagune:lagune-charter` yazarak `/lagune-charter` komutunu çalıştırın. `$` yazmak komutları listeler, birini seçmek de tam adını ekler.

---

**Korumalı alan**

**Codex** korumalı alanının ağ erişimi yoktur. Motoru kendi terminalinizden projenize kurun, bir kez ve her güncellemeden sonra:

```bash
npm i -D lagune@0.18.2
```

## Sıkça sorulan sorular

### Codex CLI için Lagune nasıl kurulur?

codex plugin marketplace add wellwelwel/lagune ve ardından codex plugin add lagune@lagune komutlarını çalıştırın.

### Codex CLI kullanırken Lagune nasıl güncellenir?

codex plugin marketplace upgrade lagune komutunu çalıştırın.

### Codex CLI kullanırken Lagune komutları nasıl çalıştırılır?

$ yazın, ardından eklentinin adıyla birlikte komutu ve girdinizi yazın, örneğin $lagune:lagune-charter.

### Lagune, Codex korumalı alanı içinde çalışır mı?

Evet, motoru kendi terminalinizden npm i -D lagune@0.18.2 ile projenize kurduğunuzda çalışır. Bunu bir kez ve her güncellemeden sonra yapın.
