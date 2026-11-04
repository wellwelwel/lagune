# /lagune-harden: aplique correções de segurança ao seu código

> Aplique ao seu código as correções do plano, com segurança e uma de cada vez.

Canônica: https://lagune.ai/pt-BR/docs/commands/harden
Idioma: pt-BR
Original: https://lagune.ai/docs/commands/harden
Última atualização: 2026-11-04

🔧 Aplique ao seu código as correções do plano, com segurança e uma de cada vez.

## Como usar

**Aplique tudo**

```prompt
/lagune-harden
```

**Aponte caminhos**

```prompt
/lagune-harden src/routes/upload.ts
```

**Por prioridade**

```prompt
/lagune-harden só as de prioridade crítica e alta
```

## Como funciona

O plano já definiu cada correção, então o harden apenas a aplica. Como esta é a única fase que mexe no seu código, ela age com cuidado: aplica uma correção de cada vez, para que cada mudança continue fácil de revisar, e nunca afrouxa um controle para encaixar uma correção. Por exemplo, a correção do upload:

- **Upload de arquivos** (Status: **Applied**)
  - _O que mudou:_ verifica o tipo real e o tamanho do arquivo, rejeita qualquer coisa inesperada, renomeia o arquivo ao salvar e o guarda onde ele não pode ser executado como código.
  - _Onde:_ a função `handleUpload`, além do helper de armazenamento que ela chama.

Se uma correção não puder ser aplicada por completo, o harden faz o que dá para fazer com segurança e marca o resto como **Partial** ou **Blocked**, deixando-o em aberto.

**Aplicado não é verificado**

Applied ainda não significa comprovado. É para isso que serve o [verify](https://lagune.ai/pt-BR/docs/commands/verify).

**Dica**

- Ele se apoia inteiramente no plano. Se uma correção ou um arquivo nunca foi planejado, ele pede que você rode o `/lagune-plan` sobre isso primeiro.
- Rodar de novo reconcilia o registro: as mudanças revertidas saem e as correções recém-aplicadas entram.
- O registro do hardening fica em `.lagune/memory/harden.md`.

**Depende do plan e altera o seu código**

O harden se apoia no [`/lagune-plan`](https://lagune.ai/pt-BR/docs/commands/plan). É a única fase que altera o seu código.

## Próximo passo

Comprove que cada correção se sustenta: [`/lagune-verify`](https://lagune.ai/pt-BR/docs/commands/verify).

## Perguntas frequentes

### O /lagune-harden altera o meu código?

Sim. É a única fase que mexe no seu código, aplicando as correções do plano uma de cada vez.

### O que significam Applied, Partial e Blocked?

São os status que o Lagune registra para cada correção. Applied significa que a correção foi feita, Partial significa que só uma parte dela foi feita e Blocked significa que não foi possível aplicá-la. Applied ainda não significa comprovado.

### O Lagune aplica correções sem pedir permissão?

Quem decide se uma edição precisa da sua aprovação é o seu agente e o modo de permissão em que você o executa, não o Lagune, que não acrescenta nenhuma etapa de confirmação própria. Mesmo assim, ele nunca afrouxa um controle para encaixar uma correção e, se uma correção entrar em conflito com uma regra do charter, ele para e avisa você antes.
