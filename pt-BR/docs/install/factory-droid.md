# Como instalar o Lagune no Factory Droid como plugin

> Instale o Lagune no Factory Droid como plugin, mantenha-o atualizado e libere as ferramentas do engine dele.

Canônica: https://lagune.ai/pt-BR/docs/install/factory-droid
Idioma: pt-BR
Original: https://lagune.ai/docs/install/factory-droid
Última atualização: 2026-11-07

Instale o plugin pelo terminal:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## Atualização

Para atualizar o **Lagune**, execute:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## Comandos

Digite os comandos pelo nome, como `/lagune-charter`.

## Perguntas frequentes

### Como instalar o Lagune no Factory Droid?

Execute droid plugin marketplace add wellwelwel/lagune e depois droid plugin install lagune@lagune.

### Como atualizar o Lagune no Factory Droid?

Execute droid plugin marketplace update lagune e depois droid plugin update lagune@lagune.

### Como executar os comandos do Lagune no Factory Droid?

Digite-os pelo nome, como /lagune-charter.

### O Factory Droid pode rodar o Lagune sem pedir permissão?

Sim. Escolha sempre liberar lagune_read e lagune_write quando o Factory Droid perguntar. Ele pergunta de novo depois de sincronizar um novo commit do marketplace lagune.
