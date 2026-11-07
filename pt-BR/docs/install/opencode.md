# Como instalar o Lagune no OpenCode como plugin

> Instale o Lagune no OpenCode 1.x e 2.x como plugin e mantenha-o atualizado.

Canônica: https://lagune.ai/pt-BR/docs/install/opencode
Idioma: pt-BR
Original: https://lagune.ai/docs/install/opencode
Última atualização: 2026-11-07

**OpenCode 2.x**

Instale o plugin pelo terminal:

```bash
opencode plugin add lagune
```

Ou adicione-o à lista `plugins` do `opencode.json`:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

Instale o plugin no seu projeto pelo terminal, ou adicione `-g` para instalá-lo em todos os seus projetos:

```bash
opencode plugin lagune
```

Ou adicione-o à lista `plugin` do `opencode.json`:

```json
{
  "plugin": ["lagune"]
}
```

## Atualização

**OpenCode 2.x**

Para atualizar o **Lagune**, execute:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

Para atualizar o **Lagune**, instale a nova versão por cima da antiga, adicionando `-g` se você o instalou em todos os seus projetos:

```bash
opencode plugin lagune@0.18.0 --force
```

## Comandos

**OpenCode 2.x**

Digite `@` e escolha o comando, como `@lagune-charter`, depois escreva o seu pedido na mesma mensagem.

**OpenCode 1.x**

Digite os comandos pelo nome, como `/lagune-charter`. Eles aparecem em `/skills`, e não no menu `/`.

## Perguntas frequentes

### Como instalar o Lagune no OpenCode?

No OpenCode 2.x, execute opencode plugin add lagune. No OpenCode 1.x, execute opencode plugin lagune, adicionando -g para instalá-lo em todos os seus projetos.

### Como atualizar o Lagune no OpenCode?

No OpenCode 2.x, execute opencode plugin update lagune e depois opencode reload. No OpenCode 1.x, execute opencode plugin lagune@0.18.0 --force.

### Como executar os comandos do Lagune no OpenCode?

No OpenCode 2.x, digite @ e escolha o comando, como @lagune-charter, depois escreva o seu pedido na mesma mensagem. No OpenCode 1.x, digite-os pelo nome, como /lagune-charter, ou encontre-os em /skills.

### O OpenCode pede permissão antes de rodar o Lagune?

Não. O OpenCode executa as duas ferramentas do engine, lagune_read e lagune_write, sem perguntar.
