# Spec-Driven Development: proteja o que a sua especificação constrói

> Combine o Lagune com Superpowers, Spec Kit ou OpenSpec: defina o charter a partir da sua especificação e implemente-a com /lagune para que cada tarefa receba hardening enquanto o código é escrito.

Canônica: https://lagune.ai/pt-BR/docs/examples/spec-driven-development
Idioma: pt-BR
Original: https://lagune.ai/docs/examples/spec-driven-development
Última atualização: 2026-11-09

Combine o **Lagune** com uma ferramenta de Spec-Driven Development, como [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit) ou [**OpenSpec**](https://github.com/Fission-AI/OpenSpec): a sua ferramenta decide o que construir, e o **Lagune** decide como isso continua seguro.

## Como se encaixa

O **Lagune** entra no fluxo da sua ferramenta em dois pontos e não muda o resto:

1. Assim que a sua ferramenta escreve a especificação, o [`/lagune-charter`](https://lagune.ai/pt-BR/docs/commands/charter) a lê e define os princípios de segurança que a funcionalidade exige, antes de existir qualquer código.
2. Colocado no comando de implementação da sua ferramenta, o [`/lagune`](https://lagune.ai/pt-BR/docs/commands/lagune) protege cada tarefa sob esses princípios enquanto o código é escrito.

**Dica**

Substitua o caminho da especificação em cada exemplo pelo arquivo que a sua ferramenta escreveu. Quando o projeto já tem um charter, o mesmo passo o atualiza com o que a nova funcionalidade precisa.

## Exemplos de prompts

Envie os prompts em ordem, cada um depois que o anterior terminar.

```prompt
/superpowers:brainstorming Checkout como convidado com pagamento por cartão.
```

```prompt
/lagune-charter docs/superpowers/specs/2026-11-09-guest-checkout-design.md
```

```prompt
/superpowers:writing-plans
```

```prompt
/superpowers:executing-plans /lagune
```

```prompt
/speckit.specify Checkout como convidado com pagamento por cartão.
```

```prompt
/lagune-charter specs/001-guest-checkout/spec.md
```

```prompt
/speckit.plan
```

```prompt
/speckit.tasks
```

```prompt
/speckit.implement /lagune
```

```prompt
/opsx:propose add-guest-checkout
```

```prompt
/lagune-charter openspec/changes/add-guest-checkout/proposal.md
```

```prompt
/opsx:apply /lagune
```

```prompt
/opsx:archive
```
