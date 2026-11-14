# Como instalar o Lagune no Codex CLI como plugin

> Instale o Lagune no Codex CLI como plugin, mantenha-o atualizado e rode o engine dele dentro do sandbox.

Canônica: https://lagune.ai/pt-BR/docs/install/codex
Idioma: pt-BR
Original: https://lagune.ai/docs/install/codex
Última atualização: 2026-11-07

Instale o plugin pelo terminal:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## Atualização

Para atualizar o **Lagune**, execute:

```bash
codex plugin marketplace upgrade lagune
```

## Comandos

Digite `$` e o comando com o nome do plugin na frente, seguido do seu pedido, como `$lagune:lagune-charter` para `/lagune-charter`. Ao digitar `$`, os comandos aparecem em uma lista, e escolher um insere o nome completo dele.

---

**Sandbox**

O sandbox do **Codex** não tem acesso à rede. Instale o engine no seu projeto pelo seu próprio terminal, uma vez e de novo após cada atualização:

```bash
npm i -D lagune@0.19.0
```

## Perguntas frequentes

### Como instalar o Lagune no Codex CLI?

Execute codex plugin marketplace add wellwelwel/lagune e depois codex plugin add lagune@lagune.

### Como atualizar o Lagune no Codex CLI?

Execute codex plugin marketplace upgrade lagune.

### Como executar os comandos do Lagune no Codex CLI?

Digite $ e o comando com o nome do plugin na frente, seguido do seu pedido, como $lagune:lagune-charter.

### O Lagune funciona dentro do sandbox do Codex?

Sim, depois que você instala o engine no seu projeto com npm i -D lagune@0.19.0 pelo seu próprio terminal, uma vez e de novo após cada atualização.
