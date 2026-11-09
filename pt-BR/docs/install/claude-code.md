# Como instalar o Lagune no Claude Code como plugin

> Instale o Lagune no Claude Code como plugin, no terminal, na extensão ou no app desktop, mantenha-o atualizado e libere o engine dele de antemão.

Canônica: https://lagune.ai/pt-BR/docs/install/claude-code
Idioma: pt-BR
Original: https://lagune.ai/docs/install/claude-code
Última atualização: 2026-11-09

**Terminal**

Instale o plugin pelo terminal:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

Ou em uma sessão do **Claude Code**:

```prompt
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**Extensão**

- Digite `/plugin` e selecione **Manage plugins**.
- Adicione `wellwelwel/lagune` na aba **Marketplaces**.
- Instale `lagune` na aba **Plugins**.

**Desktop**

- Instale o **Lagune** pelo terminal ou pela extensão, escolhendo **Install for you** na extensão.
- Inicie uma nova sessão no app desktop, que carrega os plugins que você instala para si mesmo.

## Atualização

**Terminal**

Para atualizar o **Lagune**, execute:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

Para mantê-lo atualizado, selecione **Enable auto-update** para o marketplace `lagune` em `/plugin`.

**Extensão**

- Digite `/plugin` e selecione **Manage plugins**.
- Abra a aba **Marketplaces**.
- Selecione o ícone de atualizar em `lagune`.

**Desktop**

- Atualize o **Lagune** pelo terminal ou pela extensão.
- Inicie uma nova sessão no app desktop.

## Comandos

Digite os comandos pelo nome, como `/lagune-charter`, ou com o nome do plugin na frente, como `/lagune:lagune-charter`.

---

**Permissões**

O engine roda por meio de duas ferramentas: `lagune_read` só lê o seu projeto, e `lagune_write` só grava em `.lagune/`. Para liberá-las de antemão, adicione estas regras a `.claude/settings.json` para um projeto, ou a `~/.claude/settings.json` para todos eles:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

Quando o engine roda pelo **npx**, como acontece com o **skills.sh**, libere `Bash(npx --yes lagune@*)`. Com o sandbox ativado, adicione também `registry.npmjs.org` a `sandbox.network.allowedDomains`.

## Perguntas frequentes

### Como instalar o Lagune no Claude Code?

Execute claude plugin install lagune --marketplace wellwelwel/lagune. Em uma sessão ou na extensão, adicione o marketplace wellwelwel/lagune pelo gerenciador de plugins e instale lagune. O app desktop o carrega assim que você o instala para si mesmo no terminal ou na extensão.

### Como atualizar o Lagune no Claude Code?

Execute claude plugin marketplace update lagune e depois claude plugin update lagune@lagune, ou selecione Enable auto-update para o marketplace lagune em /plugin. Na extensão, abra Manage plugins em /plugin e selecione o ícone de atualizar no marketplace lagune. O app desktop carrega a atualização na próxima sessão.

### Como executar os comandos do Lagune no Claude Code?

Digite-os pelo nome, como /lagune-charter, ou com o nome do plugin na frente, como /lagune:lagune-charter.

### O Claude Code pode rodar o Lagune sem pedir permissão?

Sim. Libere mcp__plugin_lagune_lagune__lagune_read e mcp__plugin_lagune_lagune__lagune_write nas configurações do Claude Code, além de Bash(npx --yes lagune@*) quando o engine roda pelo npx.
