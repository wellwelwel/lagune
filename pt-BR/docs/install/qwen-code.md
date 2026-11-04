# Como instalar o Lagune no Qwen Code como extensão

> Instale o Lagune no Qwen Code como extensão, mantenha-o atualizado e libere o engine dele de antemão.

Canônica: https://lagune.ai/pt-BR/docs/install/qwen-code
Idioma: pt-BR
Original: https://lagune.ai/docs/install/qwen-code
Última atualização: 2026-11-04

Instale a extensão pelo terminal:

```bash
qwen extensions install lagune
```

## Atualização

Para atualizar o **Lagune**, execute:

```bash
qwen extensions update lagune
```

Para mantê-lo atualizado, instale-o com `--auto-update`.

## Comandos

Digite os comandos com o nome da extensão na frente, como `/lagune:lagune-charter` para `/lagune-charter`.

---

**Permissões**

O engine roda por meio de duas ferramentas: `lagune_read` só lê o seu projeto, e `lagune_write` só grava em `.lagune/`. Para liberá-las de antemão, adicione estas regras a `.qwen/settings.json` para um projeto, ou a `~/.qwen/settings.json` para todos eles:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

Quando o engine roda pelo **npx**, como acontece com o **skills.sh**, libere `Shell(npx --yes lagune@*)`.

## Perguntas frequentes

### Como instalar o Lagune no Qwen Code?

Execute qwen extensions install lagune.

### Como atualizar o Lagune no Qwen Code?

Execute qwen extensions update lagune, ou instale a extensão com --auto-update.

### Como executar os comandos do Lagune no Qwen Code?

Digite-os com o nome da extensão na frente, como /lagune:lagune-charter.

### O Qwen Code pode rodar o Lagune sem pedir permissão?

Sim. Libere mcp__lagune__lagune_read e mcp__lagune__lagune_write nas configurações do Qwen Code, além de Shell(npx --yes lagune@*) quando o engine roda pelo npx.
