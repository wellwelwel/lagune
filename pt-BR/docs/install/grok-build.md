# Como instalar o Lagune no Grok Build como plugin

> Instale o Lagune no Grok Build como plugin, mantenha-o atualizado e libere o engine dele de antemão.

Canônica: https://lagune.ai/pt-BR/docs/install/grok-build
Idioma: pt-BR
Original: https://lagune.ai/docs/install/grok-build
Última atualização: 2026-11-04

Instale o plugin pelo terminal:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## Atualização

Para atualizar o **Lagune**, execute:

```bash
grok plugin update lagune
```

## Comandos

Digite os comandos pelo nome, como `/lagune-charter`, ou com o nome do plugin na frente, como `/lagune:lagune-charter`.

---

**Permissões**

O engine roda por meio de duas ferramentas: `lagune_read` só lê o seu projeto, e `lagune_write` só grava em `.lagune/`. Para liberá-las de antemão, adicione estas regras a `~/.grok/config.toml`:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

Quando o engine roda pelo **npx**, como acontece com o **skills.sh**, libere `Bash(npx --yes lagune@*)`.

## Perguntas frequentes

### Como instalar o Lagune no Grok Build?

Execute grok plugin install wellwelwel/lagune@plugin-grok --trust.

### Como atualizar o Lagune no Grok Build?

Execute grok plugin update lagune.

### Como executar os comandos do Lagune no Grok Build?

Digite-os pelo nome, como /lagune-charter, ou com o nome do plugin na frente, como /lagune:lagune-charter.

### O Grok Build pode rodar o Lagune sem pedir permissão?

Sim. Libere MCPTool(lagune__lagune_read) e MCPTool(lagune__lagune_write) na configuração do Grok Build, além de Bash(npx --yes lagune@*) quando o engine roda pelo npx.
