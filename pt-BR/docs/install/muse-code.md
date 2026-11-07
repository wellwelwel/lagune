# Como instalar o Lagune no Muse Code como plugin

> Instale o Lagune no Muse Code como plugin, mantenha-o atualizado e rode o engine dele dentro do sandbox.

Canônica: https://lagune.ai/pt-BR/docs/install/muse-code
Idioma: pt-BR
Original: https://lagune.ai/docs/install/muse-code
Última atualização: 2026-11-07

Instale o plugin pelo terminal:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## Atualização

Para atualizar o **Lagune**, atualize o marketplace e reinstale o plugin:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## Comandos

Digite os comandos pelo nome, como `/lagune-charter`, ou com o nome do plugin na frente, como `/lagune:lagune-charter`.

---

**Sandbox**

O sandbox do **Muse Code** não consegue baixar o engine. Instale-o no seu projeto pelo seu próprio terminal, uma vez e de novo após cada atualização:

```bash
npm i -D lagune@0.18.1
```

## Perguntas frequentes

### Como instalar o Lagune no Muse Code?

Execute muse plugins marketplace add lagune wellwelwel/lagune e depois muse plugins install lagune@lagune.

### Como atualizar o Lagune no Muse Code?

Execute muse plugins marketplace update lagune e depois reinstale com muse plugins remove lagune e muse plugins install lagune@lagune.

### Como executar os comandos do Lagune no Muse Code?

Digite-os pelo nome, como /lagune-charter, ou com o nome do plugin na frente, como /lagune:lagune-charter.

### O Lagune funciona dentro do sandbox do Muse Code?

Sim, depois que você instala o engine no seu projeto com npm i -D lagune@0.18.1 pelo seu próprio terminal, uma vez e de novo após cada atualização.
