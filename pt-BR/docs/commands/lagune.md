# /lagune: código seguro enquanto a sua IA escreve

> Construa o que você pede com hardening aplicado enquanto o código é escrito, guiado pelo charter e sem nenhum fluxo para seguir.

Canônica: https://lagune.ai/pt-BR/docs/commands/lagune
Idioma: pt-BR
Original: https://lagune.ai/docs/commands/lagune
Última atualização: 2026-11-03

⌨️ Faça o trabalho que você pediu, protegido enquanto é escrito. O **`/lagune`** aceita qualquer prompt, em qualquer etapa, constrói o que você queria e o protege com padrões seguros antes de devolvê-lo.

## Como usar

Coloque o **`/lagune`** em qualquer prompt e descreva o trabalho como você sempre faria.

**📘 Instruções do agente**

```md
# Instruções do meu projeto para agentes

<!-- ... -->

## Segurança

- Use a skill `/lagune` sempre que criar ou alterar código, para que ela torne o resultado mais seguro por padrão.
```

    - Por exemplo: **AGENTS.md**, **CLAUDE.md**, **.github/copilot-instructions.md**, **.cursorrules** etc.

**💬 Uma funcionalidade**

```prompt
/lagune permita que os usuários enviem uma foto personalizada no perfil.
```

**💬 Uma correção**

```prompt
/lagune nada acontece quando o usuário envia o formulário. Descubra o que pode ser e corrija.
```

**💬 Uma refatoração**

```prompt
/lagune desacople e melhore a lógica do payload
```

**Charter opcional, mas melhor com ele**

O **`/lagune`** roda com ou sem charter. Com um, as regras do seu próprio projeto moldam cada construção. Defina-as uma vez com o [`/lagune-charter`](https://lagune.ai/pt-BR/docs/commands/charter).

## Como funciona

Ele envolve o trabalho em três movimentos, sem gravar nada no Lagune:

1. Carrega o seu charter, se ele existir, e os princípios dele regem toda a construção. Quando você ainda não tem um, recorre a uma base segura por padrão.
2. Lista o [catálogo](https://lagune.ai/pt-BR/docs/catalog) do seu projeto e carrega apenas as especializações que o seu trabalho toca, o mesmo conhecimento sob demanda que o fluxo de auditoria usa.
3. Aplica a defesa enquanto o código é escrito e depois relê o próprio resultado para confirmar que os controles realmente se sustentam antes de devolver o trabalho.

O resultado é código funcionando no seu projeto, seguro desde a primeira linha.

**Use a qualquer momento**

Sem detect, sem plan, sem limpeza depois. O **`/lagune`** serve tanto para um projeto recém-criado quanto para uma mudança em um código maduro, e protege o trabalho ao longo do caminho, e não depois.

## O que ele não faz

- Não grava nada no diretório `.lagune`, nem artefato nem rastreamento, então a única coisa que ele produz é o código protegido que você pediu.
- Não afrouxa uma regra para atender a um prompt. Se o que você pediu violaria um princípio do charter, ele para e avisa você antes, em vez de construir direto de forma insegura.

## Perguntas frequentes

### O que o /lagune faz?

Ele aceita qualquer prompt, em qualquer etapa, constrói o que você pediu e o protege com padrões seguros antes de devolvê-lo. A defesa é aplicada enquanto o código é escrito, e não depois.

### Preciso de um charter para usar o /lagune?

Não. Ele roda com ou sem um. Com um charter, as regras do seu próprio projeto moldam cada construção. Sem ele, recorre a uma base segura por padrão.

### Qual é a diferença entre o /lagune e o fluxo Blue Team?

O /lagune protege o trabalho novo enquanto você o escreve, sem nenhum fluxo para seguir. O fluxo Blue Team executa as cinco fases de auditoria em ordem sobre um projeto existente.

### O /lagune rastreia achados ou grava artefatos?

Não. Ele não grava nada no diretório .lagune, nem artefato nem rastreamento. A única coisa que ele produz é o código protegido que você pediu.

### Como faço o meu agente usar o /lagune automaticamente?

Adicione ao arquivo de instruções do seu agente (AGENTS.md, CLAUDE.md, .cursorrules e similares) uma instrução para ele usar a skill /lagune sempre que construir ou alterar código.
