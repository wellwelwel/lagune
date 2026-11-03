# /lagune-charter: defina os seus princípios de segurança

> Estabeleça os princípios de segurança do seu projeto, as regras que todas as fases seguintes respeitam, e registre as categorias de especialização que a leitura do projeto justifica.

Canônica: https://lagune.ai/pt-BR/docs/commands/charter
Idioma: pt-BR
Original: https://lagune.ai/docs/commands/charter
Última atualização: 2026-11-03

🧬 Conte ao **Lagune** o que é o seu projeto, e ele transforma isso nas suas regras de segurança (ou, sem descrição, as deduz só a partir do projeto).

O charter é a camada que rege tudo: um conjunto de princípios que colocam a segurança em primeiro lugar e que todas as fases seguintes precisam respeitar. Pense nele como a verificação em tempo de compilação da postura de segurança do seu projeto.

## Como usar

**Descreva o projeto**

```prompt
/lagune-charter Meu projeto é uma loja virtual que vende videogames. Os clientes adicionam produtos ao carrinho e pagam com cartão de crédito ou boleto. Eles podem ver os próprios pedidos e o status de cada um.
```

**Deixe o Lagune propor**

```prompt
/lagune-charter
```

> _Vejo uma biblioteca de pagamento, uma configuração de login e um modelo de pedido ligado a um cliente. Parece uma loja virtual que vende alguma coisa. Os clientes pagam e acompanham os próprios pedidos..._ ☁️

## O que ele deduz

O **Lagune** usa a sua descrição ou o seu **PRD** como direção, deduz o que isso implica para a segurança e então lê o projeto para ir além do que você mencionou. Por exemplo:

- Um carrinho que guarda pedidos significa que existe um **banco de dados**:
  - por exemplo, `"Onde ficam os dados?"`, `"Quem consegue acessá-los?"`, `"Eles vazam?"`.
- Clientes que podem ver os próprios pedidos significam que existe algum tipo de **login ou controle de acesso**:
  - por exemplo, `"Um cliente consegue acessar os pedidos de outro?"`, `"As sessões estão protegidas?"`.
- Aceitar pagamentos com cartão e boleto significa que **dinheiro e dados sensíveis estão envolvidos**:
  - por exemplo, `"Os dados do cartão ficam armazenados?"`, `"Os pagamentos são verificados?"`.

A sua descrição e o projeto se somam: enquanto a descrição define a intenção, a leitura das dependências, do README e da configuração revela o que você não mencionou. Se algo importante continuar incerto, o **Lagune** faz uma pergunta curta e simples em vez de tentar adivinhar.

A partir daí, o **Lagune** monta um conjunto de regras de segurança sob medida para o projeto, que você pode revisar e ajustar sempre que precisar.

**Aproveite ao máximo**

- Você também pode definir as suas próprias regras de segurança para o projeto.
- Quanto mais detalhes relevantes você der, melhor será o relatório final:
  - Explique o projeto, como ele funciona e o que acontece por baixo dos panos.
  - Quem é o usuário final? O que os usuários podem fazer, e o que não podem?
  - Detalhes de comportamento valem tanto quanto detalhes técnicos.
- A memória do charter fica em `.lagune/memory/charter.md`.

## As categorias que ele registra

As especializações, o conhecimento de segurança que as fases seguintes carregam sob demanda, entram no [catálogo](https://lagune.ai/pt-BR/docs/catalog) do seu projeto por [categoria](https://lagune.ai/pt-BR/docs/categories). Enquanto o seu projeto não tem nenhuma categoria registrada, o charter registra cada uma que a leitura dele justifica, como a linguagem do projeto, chamadas a um LLM ou contêineres, e as cita no resumo.

Depois que as categorias estão registradas, o charter as mantém como estão e só cita uma categoria que o seu projeto ainda não usa. Você mesmo pode alterá-las a qualquer momento:

```bash
npx lagune write add --categories python
npx lagune write remove --categories python
```

## Próximo passo

Com as regras definidas, mapeie o que o seu sistema realmente faz: [`/lagune-detect`](https://lagune.ai/pt-BR/docs/commands/detect).

## Perguntas frequentes

### O que é o charter no Lagune?

O charter é a camada que rege o Lagune, um conjunto de princípios que colocam a segurança em primeiro lugar e que todas as fases seguintes precisam respeitar. Pense nele como a verificação em tempo de compilação da postura de segurança do seu projeto.

### Onde o charter fica salvo?

Em .lagune/memory/charter.md.

### Posso escrever as minhas próprias regras no charter?

Sim. O Lagune propõe regras a partir da sua descrição e do seu código, e você pode reescrevê-las, removê-las, acrescentar novas ou reduzir o escopo delas.

### O charter escolhe as minhas categorias de especialização?

Só enquanto nenhuma está registrada. Nesse caso, ele registra cada categoria que a leitura dele justifica, como a sua linguagem ou chamadas a um LLM. Depois que as categorias estão registradas, ele nunca as altera.
