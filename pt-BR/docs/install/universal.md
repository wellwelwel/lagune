# Como instalar o Lagune em qualquer agente com o skills.sh ou o GitHub CLI

> Instale o Lagune em qualquer agente de IA com o skills CLI ou o GitHub CLI e mantenha-o atualizado.

Canônica: https://lagune.ai/pt-BR/docs/install/universal
Idioma: pt-BR
Original: https://lagune.ai/docs/install/universal
Última atualização: 2026-11-09

**skills.sh**

Instale os comandos do **Lagune** no seu projeto pelo terminal com o [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune -y
```

Ou cole este prompt no seu agente:

```md
Execute `npx --yes skills add wellwelwel/lagune --yes` e siga agora as instruções da skill geradas. Leia a saída completa do comando, redirecionando-a antes para um arquivo temporário se for preciso. Resolva os caminhos relativos a partir do diretório de arquivos de apoio que ele indicar.
```

**GitHub CLI**

Instale os comandos do **Lagune** no seu projeto pelo terminal com o [**GitHub CLI**](https://cli.github.com/) 2.90.0 ou mais recente:

```bash
gh skill install wellwelwel/lagune --all --scope project
```

Ou cole este prompt no seu agente:

```md
Execute `gh skill install wellwelwel/lagune --all --scope project` e leia a saída completa do comando, redirecionando-a antes para um arquivo temporário se for preciso.
```

## Atualização

**skills.sh**

Para atualizar o **Lagune**, execute:

```bash
npx skills update
```

Ou cole este prompt no seu agente:

```md
Execute `npx --yes skills update -y` e leia a saída completa do comando, redirecionando-a antes para um arquivo temporário se for preciso.
```

**GitHub CLI**

Para atualizar o **Lagune**, execute:

```bash
gh skill update --all
```

Ou cole este prompt no seu agente:

```md
Execute `gh skill update --all` e leia a saída completa do comando, redirecionando-a antes para um arquivo temporário se for preciso.
```

---

**Sandbox**

Em um sandbox sem acesso à rede, os comandos não conseguem baixar o engine. Instale-o no seu projeto pelo seu próprio terminal, uma vez e de novo após cada atualização:

```bash
npm i -D lagune@0.19.0
```

## Perguntas frequentes

### Como instalar o Lagune em qualquer agente de IA?

Execute npx skills add wellwelwel/lagune -y ou gh skill install wellwelwel/lagune --all --scope project no seu projeto, ou cole o prompt de instalação no seu agente.

### Como atualizar o Lagune em qualquer agente de IA?

Execute npx skills update se você o instalou com o skills.sh, ou gh skill update --all se o instalou com o GitHub CLI. Você também pode colar o prompt de atualização no seu agente.

### Posso instalar o Lagune de mais de uma forma?

Não. Com duas, o agente lista cada comando duas vezes, ou usa uma cópia e esconde a outra.
