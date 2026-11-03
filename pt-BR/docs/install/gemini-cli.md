# Como instalar o Lagune no Gemini CLI como extensão

> Instale o Lagune no Gemini CLI como extensão, mantenha-o atualizado e libere o engine dele de antemão.

Canônica: https://lagune.ai/pt-BR/docs/install/gemini-cli
Idioma: pt-BR
Original: https://lagune.ai/docs/install/gemini-cli
Última atualização: 2026-11-03

Instale a extensão pelo terminal:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## Atualização

Para atualizar o **Lagune**, execute:

```bash
gemini extensions update lagune
```

Para mantê-lo atualizado, instale-o com `--auto-update`.

## Comandos

Digite os comandos com o nome da extensão na frente, como `/lagune:lagune-charter` para `/lagune-charter`.

---

**Permissões**

O engine roda por meio de duas ferramentas: `lagune_read` só lê o seu projeto, e `lagune_write` só grava em `.lagune/`. O **Gemini CLI** só as inicia em uma pasta confiável. Para liberá-las de antemão, salve esta regra como `~/.gemini/policies/lagune.toml`:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

Quando o engine roda pelo **npx**, como acontece com o **skills.sh**, adicione esta regra ao mesmo arquivo:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## Perguntas frequentes

### Como instalar o Lagune no Gemini CLI?

Execute gemini extensions install https://github.com/wellwelwel/lagune.

### Como atualizar o Lagune no Gemini CLI?

Execute gemini extensions update lagune, ou instale a extensão com --auto-update.

### Como executar os comandos do Lagune no Gemini CLI?

Digite-os com o nome da extensão na frente, como /lagune:lagune-charter.

### O Gemini CLI pode rodar o Lagune sem pedir permissão?

Sim. Adicione uma regra de política que libere as ferramentas lagune_read e lagune_write do servidor lagune, além de uma para run_shell_command com npx --yes lagune@ e uma versão quando o engine roda pelo npx.
