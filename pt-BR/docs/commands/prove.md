# /lagune-prove: prova de conceito exclusivamente defensiva

> Transforme cada achado detectado em uma prova de conceito (PoC) executável e exclusivamente defensiva, com um advisory para divulgação responsável.

Canônica: https://lagune.ai/pt-BR/docs/commands/prove
Idioma: pt-BR
Original: https://lagune.ai/docs/commands/prove
Última atualização: 2026-11-05

🧪 Transforme cada achado detectado em uma evidência executável e exclusivamente defensiva para divulgação responsável.

Para cada achado do mapa do detect, ele escreve um advisory independente e um teste que verifica o **caminho seguro**, de modo que o teste falha enquanto o problema existe e passa assim que o código é corrigido.

**Dica**

Os testes do **Lagune** ficam isolados em `.lagune/`, separados da sua própria suíte.

## Como usar

**Todos os achados**

```prompt
/lagune-prove
```

**Um achado pelo nome**

Veja os achados já rastreados pelo nome:

```prompt
npx lagune read list --findings

# Findings
#   ...
#   • SQL injection na busca de usuários
#   ...
```

```prompt
# Depois, prove um deles
/lagune-prove SQL injection na busca de usuários
```

## Como funciona

Ele lê o código-fonte para o qual cada achado aponta e grava, em `.lagune/proofs/`, um diretório por achado comprovado, com exatamente dois arquivos:

| Arquivo                       | O que é                                                                                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `report.test.mjs` (ou `.cjs`) | O teste. Ele roda no Poku quando o seu projeto já o usa e, caso contrário, no runner nativo do Node.js, então não precisa de nada instalado. |
| `report.md`                   | Um advisory independente: severidade, impacto, como reproduzir e o comando para rodar, legível por si só.                                    |

As provas são sempre em JavaScript, então continuam portáveis seja qual for a linguagem do seu projeto. Um índice `README.md` traz o link de cada prova e um único comando para rodar todas.

**Dica**

- Ele é **opcional e autônomo**: não é uma das cinco fases nem faz parte da cadeia de rastreamento.
- Ele grava apenas em `.lagune/proofs/` e nunca mexe nos artefatos das fases nem no seu código, que ele só lê.
- Um achado cujo teste não reproduz o problema não recebe prova, e ele pede que você rode o [`/lagune-detect`](https://lagune.ai/pt-BR/docs/commands/detect) naquele ponto para reconciliar.
- Rodar de novo reconcilia as provas: um achado que sumiu ou que não se reproduz mais tem o diretório removido.

**Nota**

**Ele só roda quando você o chama:** o agente nunca o inicia por conta própria.

**Depende do detect**

O prove lê o mapa do detect gerado pelo [`/lagune-detect`](https://lagune.ai/pt-BR/docs/commands/detect), então rode o detect primeiro.

## Só defesa, e com autorização

Antes de gerar qualquer coisa, ele confirma que você tem autorização para testar o alvo e recusa qualquer pedido de exploit funcional, payload de ataque ou técnica para escapar da detecção. Uma prova demonstra o comportamento seguro e nunca emite uma entrada de ataque.

## Da prova à divulgação

Os dois arquivos de cada achado comprovado vão juntos em um **GitHub Gist privado** para relatar a vulnerabilidade. Eles são evidência de um problema ativo e ainda não divulgado, então um `.gitignore` dentro de `.lagune/proofs/` os mantém fora de todos os commits: compartilhe-os apenas por esse Gist até que os mantenedores resolvam o problema.

Encerrar um achado na cadeia do **Lagune** continua sendo trabalho do [`/lagune-harden`](https://lagune.ai/pt-BR/docs/commands/harden) e do [`/lagune-verify`](https://lagune.ai/pt-BR/docs/commands/verify): o prove produz evidências, mas não encerra nada.

## Perguntas frequentes

### O Lagune gera exploits?

Não. O /lagune-prove escreve evidências exclusivamente defensivas: um teste que verifica o caminho seguro, de modo que falha enquanto o problema existe e passa assim que o código é corrigido, mais um advisory para divulgação responsável.

### O que o prove gera?

Dois arquivos por achado: um teste (report.test.mjs ou .cjs) e um advisory (report.md).

### Como divulgar de forma responsável uma falha que o Lagune encontrou?

O prove escreve um advisory independente que você pode compartilhar por um canal privado, como um GitHub Gist privado, seguindo a divulgação responsável.
