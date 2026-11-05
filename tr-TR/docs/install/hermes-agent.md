# Hermes Agent için Lagune eklentisi kurulumu

> Lagune'yi Hermes Agent için eklenti olarak kurun ve güncel tutun.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/hermes-agent
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/hermes-agent
Son güncelleme: 2026-11-05

Eklentiyi terminalden kurun:

```bash
hermes plugins install wellwelwel/lagune --enable
```

- **Hermes Agent** kataloğu dışından bir eklentiyi onaylamanızı istediğinde **onaylayın**.
- Deponun **Node.js** bağımlılıklarını kurmayı önerdiğinde **reddedin**.

## Güncelleme

**Lagune**'yi güncellemek için şunu çalıştırın:

```bash
hermes plugins update lagune
```

## Komutlar

Komutları eklentinin adıyla birlikte yazın, örneğin `/lagune:lagune-charter` yazarak `/lagune-charter` komutunu, `/lagune:lagune` yazarak `/lagune` komutunu çalıştırın.

## Sıkça sorulan sorular

### Hermes Agent için Lagune nasıl kurulur?

hermes plugins install wellwelwel/lagune --enable komutunu çalıştırın. İstendiğinde eklentiyi onaylayın, deponun Node.js bağımlılıklarını kurmayı ise reddedin.

### Hermes Agent kullanırken Lagune nasıl güncellenir?

hermes plugins update lagune komutunu çalıştırın.

### Hermes Agent kullanırken Lagune komutları nasıl çalıştırılır?

Eklentinin adıyla birlikte yazın, örneğin /lagune:lagune-charter ve /lagune:lagune.
