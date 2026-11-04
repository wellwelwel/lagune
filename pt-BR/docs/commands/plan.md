# /lagune-plan: classifique os achados e planeje as correções

> Transforme o que o detect encontrou em um plano de defesa, classificando cada achado com uma categoria e uma nota CVSS v4.0 e associando a ele uma correção.

Canônica: https://lagune.ai/pt-BR/docs/commands/plan
Idioma: pt-BR
Original: https://lagune.ai/docs/commands/plan
Última atualização: 2026-11-04

🛡️ Transforme o que o detect encontrou em um plano de defesa: classifique cada achado com uma categoria e uma nota CVSS v4.0 e depois associe a ele a correção a aplicar.

## Como usar

**Planeje tudo**

```prompt
/lagune-plan
```

**Aponte caminhos**

```prompt
/lagune-plan src/routes/upload.ts
```

**Foque em uma preocupação**

```prompt
/lagune-plan onde dados sensíveis podem vazar
```

## Como funciona

Esta fase continua a partir do detect. O detect já descobriu o que o seu sistema faz e o risco que cada parte carrega, então o plano não repete o risco: ele avalia a gravidade e decide o que fazer a respeito. O plan nunca lê o código, o que obriga cada correção a apontar para algo que o detect de fato detectou. Ele classifica cada achado pelo método CVSS v4.0: uma categoria, um vetor CVSS v4.0 deduzido a partir do que o detect e o charter registraram e calculado pelo [hook `cvss`](https://lagune.ai/pt-BR/docs/hooks/cvss), e a faixa de prioridade em que essa nota cai. Cada correção também traz o princípio do charter que ela sustenta.

Por exemplo:

- **Upload de arquivos** (Prioridade: **Crítica**)
  - _Categoria:_ upload de arquivos sem restrição (CWE-434).
  - _CVSS:_ CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N (9.3, crítica).
  - _Por que esta prioridade:_ qualquer pessoa alcança o upload pela internet, e ele fica no servidor que guarda os arquivos dos clientes.
  - _Sustenta:_ III. Toda entrada é não confiável até ser validada.
  - _Correção:_ verificar o tipo real e o tamanho do arquivo, renomeá-lo ao salvar e guardar os uploads onde não possam ser executados como código.

A partir daí, você tem uma lista de correções classificada e priorizada, cada uma ligada a um achado e pronta para a próxima fase aplicar. A nota é calculada, nunca estimada: o vetor carrega a exposição e o que está em jogo no projeto como métricas Environmental, e qualquer pessoa pode colá-lo na calculadora da FIRST ou do NVD e chegar à mesma nota.

**Dica**

- Ele se apoia inteiramente no detect. Se um arquivo ou uma preocupação nunca foi mapeado, ele pede que você rode o `/lagune-detect` sobre isso primeiro.
- Rodar de novo atualiza o plano: as correções concluídas saem e as novas entram.
- O plano de defesa fica em `.lagune/memory/plan.md`.

**Depende do detect**

O plan trabalha apenas com o que o [`/lagune-detect`](https://lagune.ai/pt-BR/docs/commands/detect) já mapeou, então rode o detect primeiro.

## Próximo passo

Aplique o plano: [`/lagune-harden`](https://lagune.ai/pt-BR/docs/commands/harden).

## Perguntas frequentes

### Como o Lagune prioriza as vulnerabilidades?

O /lagune-plan classifica cada achado com uma categoria e uma nota CVSS v4.0 calculada pelo hook cvss e depois associa a ele a correção a aplicar.

### O Lagune usa CVSS v4.0?

Sim. Cada achado recebe um vetor e uma nota CVSS v4.0, calculados pelo hook cvss com a mesma aritmética da calculadora da FIRST, então qualquer pessoa pode colar o vetor lá e chegar à mesma nota.

### O plano lê o meu código?

Não. O plan nunca lê o código, o que obriga cada correção a apontar para algo que o detect de fato detectou.
