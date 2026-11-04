# Hook cvss: calcule a nota de um vetor CVSS v4.0

> Calcule a nota de um ou de vários vetores CVSS v4.0 pela linha de comando, com a mesma aritmética da calculadora da FIRST, e leia cada um em palavras simples.

Canônica: https://lagune.ai/pt-BR/docs/hooks/cvss
Idioma: pt-BR
Original: https://lagune.ai/docs/hooks/cvss
Última atualização: 2026-11-04

O hook `cvss` calcula a nota de um **vetor CVSS v4.0** e imprime a nota e a faixa de severidade, a classificação que o [`/lagune-plan`](https://lagune.ai/pt-BR/docs/commands/plan) registra em cada correção e o [`/lagune-prove`](https://lagune.ai/pt-BR/docs/commands/prove) em cada advisory. Ele é o engine determinístico por trás dessas classificações, com a mesma aritmética da [calculadora da FIRST](https://www.first.org/cvss/calculator/4.0), e você mesmo pode executá-lo.

## Como executar

Passe cada vetor com `--vector`. O hook imprime uma linha por vetor, com a nota e a faixa dele.

**Um vetor**

```bash
npx lagune read cvss --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N'
# => 9.3, Critical
```

**Vários vetores**

Repita `--vector` para calcular vários de uma vez, com uma linha para cada um, na ordem.

```bash
npx lagune read cvss \
  --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N' \
  --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A'
# => 9.3, Critical
# => 8.7, High
```

**Em palavras simples**

Adicione `--explain` para ler cada métrica em palavras simples. Quando as métricas de Threat ou Environmental mudam a nota, a nota Base sozinha aparece primeiro.

```bash
npx lagune read cvss --explain --vector 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/MAV:A'
# => 8.7, High
# =>   Base metrics alone: 9.3, Critical
# =>   Attack Vector: Network, modified to Adjacent
# =>   Attack Complexity: Low
# =>   ...
```

## Como ler o resultado

| Faixa      | Nota       |
| ---------- | ---------- |
| `None`     | 0.0        |
| `Low`      | 0.1 a 3.9  |
| `Medium`   | 4.0 a 6.9  |
| `High`     | 7.0 a 8.9  |
| `Critical` | 9.0 a 10.0 |

Um vetor só com métricas Base avalia a falha em si, presumindo o pior: todos os requisitos de segurança em High e a falha sendo explorada na prática. As métricas Environmental (`MAV` e as demais métricas modificadas, além de `CR`, `IR` e `AR`) ajustam a nota para uma implantação específica, e a métrica Threat (`E`), para o que se sabe sobre a exploração.

Um vetor inválido imprime `invalid vector:` e o que está errado, e o hook termina com código diferente de zero.

### Opções da CLI

| Opção       | Valor               | Descrição                                                                                   |
| ----------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `--vector`  | um vetor `CVSS:4.0` | Calcula a nota de um vetor. Repita para calcular vários, com uma linha por vetor, na ordem. |
| `--explain` |                     | Adiciona cada métrica em palavras simples abaixo de cada linha de classificação.            |

É obrigatório passar pelo menos um `--vector`. O vetor nunca é um argumento posicional solto, então não pode ser confundido com uma flag.

**Por que o valor de uma flag**

Cada vetor é passado como o valor de uma flag, nunca interpolado no comando. Um valor com aspas ou crases continua inerte e não consegue fazer injeção no shell. Sempre coloque o vetor entre aspas simples para que o seu shell não o expanda antes.

**O que ele não cobre**

Apenas CVSS v4.0: um vetor v2.0, v3.0 ou v3.1 é rejeitado em vez de avaliado, já que o **Lagune** classifica todos os achados em v4.0.

**Dica**

A validação da fase plan refaz essa mesma aritmética em cada linha de CVSS, então uma nota que se desviou do seu vetor é detectada antes de o plano ser aceito.

## Perguntas frequentes

### Como o Lagune calcula uma nota CVSS?

O hook cvss segue a calculadora de referência da FIRST para o CVSS v4.0, então um vetor recebe exatamente a mesma nota que receberia no site da FIRST.

### Dá para calcular a nota de um vetor CVSS v3.1 com ele?

Não. O Lagune classifica todos os achados em CVSS v4.0, e o hook rejeita qualquer outra versão em vez de calculá-la.

### O que a flag --explain faz?

Ela lê cada métrica em palavras simples e mostra a nota Base ao lado da nota geral, para que qualquer pessoa veja o que o vetor diz e como o contexto do projeto o alterou.
