# Como instalar o Lagune no Antigravity CLI como plugin

> Instale o Lagune no Antigravity CLI como plugin, mantenha-o atualizado e libere o engine dele de antemão.

Canônica: https://lagune.ai/pt-BR/docs/install/antigravity-cli
Idioma: pt-BR
Original: https://lagune.ai/docs/install/antigravity-cli
Última atualização: 2026-11-03

Instale o plugin pelo terminal:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Atualização

Para atualizar o **Lagune**, instale-o de novo:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## Comandos

Digite os comandos com o nome do plugin na frente, como `/lagune:lagune-charter` para `/lagune-charter`.

---

**Permissões**

O engine roda por meio de duas ferramentas: `lagune_read` só lê o seu projeto, e `lagune_write` só grava em `.lagune/`. Um comando enviado como primeira mensagem de uma sessão roda antes de elas carregarem, então usa o **npx** no lugar delas. Para liberar as ferramentas e o **npx** de antemão, adicione estas regras a `~/.gemini/antigravity-cli/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## Perguntas frequentes

### Como instalar o Lagune no Antigravity CLI?

Execute agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity.

### Como atualizar o Lagune no Antigravity CLI?

Execute agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity de novo.

### Como executar os comandos do Lagune no Antigravity CLI?

Digite-os com o nome do plugin na frente, como /lagune:lagune-charter.

### O Antigravity CLI pode rodar o Lagune sem pedir permissão?

Sim. Libere mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write) e command(regex:npx --yes lagune@[0-9.]+) nas configurações do Antigravity CLI. A regra do npx cobre um comando enviado como primeira mensagem de uma sessão.
