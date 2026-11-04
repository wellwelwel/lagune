# Como instalar o Lagune em qualquer agente com o skills.sh

> Instale o Lagune em qualquer agente de IA com o skills CLI e mantenha-o atualizado.

Canônica: https://lagune.ai/pt-BR/docs/install/universal
Idioma: pt-BR
Original: https://lagune.ai/docs/install/universal
Última atualização: 2026-11-04

**Terminal**

Instale os comandos do **Lagune** pelo terminal com o [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune
```

**Prompt**

Cole este prompt no seu agente:

```md
Execute `npx --yes skills add wellwelwel/lagune` e siga agora as instruções da skill geradas. Leia a saída completa do comando, redirecionando-a antes para um arquivo temporário se for preciso. Resolva os caminhos relativos a partir do diretório de arquivos de apoio que ele indicar.
```

## Atualização

**Terminal**

Para atualizar o **Lagune**, execute:

```bash
npx skills update
```

**Prompt**

Para atualizar o **Lagune**, cole este prompt no seu agente:

```md
Execute `npx --yes skills update -y` e leia a saída completa do comando, redirecionando-a antes para um arquivo temporário se for preciso.
```

---

**Uma forma de instalação por agente**

Instale o **Lagune** pelo **skills.sh** ou pelo **plugin** dele, nunca pelos dois.

**Permissões**

Os comandos rodam o engine como `npx --yes lagune@0.17.0`, e a [página de instalação de cada agente](https://lagune.ai/pt-BR/docs) mostra a regra que o libera de antemão. Em um sandbox sem acesso à rede, instale o engine no seu projeto pelo seu próprio terminal, uma vez e de novo após cada atualização:

```bash
npm i -D lagune@0.17.0
```

## Perguntas frequentes

### Como instalar o Lagune em qualquer agente de IA?

Execute npx skills add wellwelwel/lagune no seu projeto, ou cole o prompt de instalação no seu agente.

### Como atualizar o Lagune instalado com o skills CLI?

Execute npx skills update, ou cole o prompt de atualização no seu agente.

### Posso instalar o Lagune com o skills CLI e com um plugin ao mesmo tempo?

Não. Com os dois, o agente lista cada comando duas vezes, ou usa uma cópia e esconde a outra.
