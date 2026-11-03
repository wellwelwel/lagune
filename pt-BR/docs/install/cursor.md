# Como instalar o Lagune no Cursor como plugin

> Instale o Lagune no Cursor e no Cursor CLI como plugin, mantenha-o atualizado e libere o engine dele de antemão.

Canônica: https://lagune.ai/pt-BR/docs/install/cursor
Idioma: pt-BR
Original: https://lagune.ai/docs/install/cursor
Última atualização: 2026-11-03

**Cursor**

- Abra **Customize**.
- Selecione **From GitHub Repository** e informe `https://github.com/wellwelwel/lagune`.
- Selecione **Install** no **Lagune** e escolha o escopo de projeto ou de usuário.

**Cursor CLI**

- Adicione o marketplace pelo terminal:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Digite `/plugins` em uma sessão do `agent`.
- Instale o **Lagune**.

Se o **Lagune** já estiver instalado no **Claude Code**, o **Cursor CLI** o carrega de lá.

## Atualização

**Cursor**

- Abra **Customize**.
- Selecione **Refresh** no marketplace `lagune`.

**Cursor CLI**

- Substitua o marketplace pelo terminal:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- Digite `/plugins` em uma sessão do `agent`.
- Instale o **Lagune** de novo.

## Comandos

Digite os comandos pelo nome, como `/lagune-charter`.

---

**Permissões**

No **Cursor**, os comandos rodam o engine pelo **npx**, que o modo padrão Auto-review libera sem perguntar.

No **Cursor CLI**, o engine roda por meio de duas ferramentas: `lagune_read` só lê o seu projeto, e `lagune_write` só grava em `.lagune/`. Para liberá-las de antemão, adicione estas regras a `.cursor/cli.json` para um projeto, ou a `~/.cursor/cli-config.json` para todos eles:

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

Quando o engine roda pelo **npx**, como acontece com o **skills.sh**, libere `Shell(npx:--yes lagune@*)`.

## Perguntas frequentes

### Como instalar o Lagune no Cursor?

No Cursor, abra Customize, selecione From GitHub Repository, informe https://github.com/wellwelwel/lagune e instale o Lagune. No Cursor CLI, execute agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor e depois instale o Lagune por /plugins.

### Como atualizar o Lagune no Cursor?

No Cursor, selecione Refresh no marketplace lagune em Customize. No Cursor CLI, remova o marketplace lagune, adicione-o de novo e depois instale o Lagune de novo por /plugins.

### Como executar os comandos do Lagune no Cursor?

Digite-os pelo nome, como /lagune-charter.

### O Cursor pode rodar o Lagune sem pedir permissão?

Sim. O modo padrão Auto-review do Cursor já o libera. No Cursor CLI, libere Mcp(plugin-lagune-lagune:lagune_read) e Mcp(plugin-lagune-lagune:lagune_write), além de Shell(npx:--yes lagune@*) quando o engine roda pelo npx.
