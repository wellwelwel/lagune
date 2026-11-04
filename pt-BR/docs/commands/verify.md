# /lagune-verify: comprove que os controles de segurança se sustentam

> Comprove que cada correção aplicada se sustenta e encerre as que passarem.

Canônica: https://lagune.ai/pt-BR/docs/commands/verify
Idioma: pt-BR
Original: https://lagune.ai/docs/commands/verify
Última atualização: 2026-11-04

⚖️ Comprove que cada correção aplicada se sustenta, lendo o código e confrontando-o com o que o harden registrou, e encerre as que passarem.

## Como usar

**Verifique tudo**

```prompt
/lagune-verify
```

**Aponte caminhos**

```prompt
/lagune-verify src/routes/upload.ts
```

**Por prioridade**

```prompt
/lagune-verify só as de prioridade crítica e alta
```

## Como funciona

Ele lê o código em cada ponto que o harden registrou e confirma que ele realmente corresponde ao que foi afirmado. A prova é esse confronto, o código contra o registro. Cada controle recebe um destes três vereditos:

| Veredito                     | Significado                                                            |
| ---------------------------- | ---------------------------------------------------------------------- |
| ✅ Risk closed               | O código faz exatamente o que o registro afirma.                       |
| ❌ Risk not closed           | O controle continua em aberto. O verify manda você de volta ao harden. |
| ❓ Cannot tell from the code | A evidência não é visível apenas pelo código.                          |

Um risco comprovadamente eliminado é então encerrado e sai da cadeia, com a sua confirmação. Por exemplo:

- **Upload de arquivos** (Veredito: **✅ Risk closed**)
  - _Como foi comprovado:_ leu o handler de upload e viu que ele detecta o tipo real do arquivo pelo conteúdo, impõe um limite de tamanho e recusa todo o resto, exatamente como o registro afirma.
  - _Evidência:_ a função `handleUpload`, que detecta o tipo real do arquivo pelo conteúdo.

Se o risco não foi eliminado, o verify diz isso com clareza e manda você de volta ao [`/lagune-harden`](https://lagune.ai/pt-BR/docs/commands/harden), já que a correção continua em aberto.

**Dica**

- Ele se apoia inteiramente no registro do hardening.
- Ele só lê o seu código para julgá-lo e nunca afrouxa um controle nem reescreve o código para fazer um veredito passar.
- Rodar de novo reconcilia os vereditos: os desatualizados saem, e um risco que deixou de estar eliminado volta a ser sinalizado.
- Quando um risco é comprovadamente eliminado, ele pergunta uma vez e então remove esse achado de toda a cadeia (detect, plan, harden e rastreamento).
- Ele não grava nenhum relatório próprio: cada veredito fica no bloco do controle correspondente em `.lagune/memory/harden.md`, onde o harden o lê na próxima execução.

**Depende do harden**

O verify se apoia no [`/lagune-harden`](https://lagune.ai/pt-BR/docs/commands/harden).

## O ciclo se fecha

Quando tudo o que está no escopo é encerrado, o ciclo entra em repouso. Ele só reabre quando o código muda. A segurança pode ser concluída, então o fluxo tem um estado final, e não um loop infinito.

## Perguntas frequentes

### Como o Lagune verifica uma correção?

O /lagune-verify lê o código e o confronta com o que o harden registrou, devolvendo um destes três vereditos: Risk closed (risco eliminado), Risk not closed (risco não eliminado) ou Cannot tell from the code (não dá para saber pelo código).

### O que significa encerrar um achado?

Quando o verify comprova que um risco foi eliminado, o achado é encerrado: sai de toda a cadeia, com a sua confirmação, e deixa de ser reprocessado.

### O trabalho de segurança pode chegar ao fim?

Sim. O SDH pode ser concluído: um achado comprovadamente eliminado é encerrado, então o fluxo tem um estado final, e não um loop infinito.
