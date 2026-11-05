# /lagune-detect: mapeie o seu sistema e os riscos dele

> Leia o seu código e mapeie o que o seu sistema faz e onde estão os riscos.

Canônica: https://lagune.ai/pt-BR/docs/commands/detect
Idioma: pt-BR
Original: https://lagune.ai/docs/commands/detect
Última atualização: 2026-11-05

🔬 Descubra o que o seu sistema realmente faz e onde estão os riscos.

O detect lê o código e registra apenas o que de fato encontra, com as evidências de que as fases seguintes precisam. A regra que o rege é detectar, não inventar.

## Como usar

**Varredura completa**

```prompt
/lagune-detect
```

**Aponte caminhos**

```prompt
/lagune-detect src/routes/ src/auth.ts
```

**Descreva uma preocupação**

```prompt
/lagune-detect garanta que os dados dos clientes nunca fiquem expostos
```

## O que ele mapeia

O **Lagune** lê o código e mapeia o que encontra. Cada achado traz o que ele é, por que importa e a evidência. Por exemplo:

- **Upload de arquivos**: o sistema aceita arquivos enviados pelos usuários.
  - _Por que importa:_ um arquivo disfarçado de imagem pode esconder código malicioso.
  - _Evidência:_ o handler de `POST /upload` confia no MIME type enviado pelo cliente, sem verificar o tipo real do arquivo.
- **Login e sessões**: os usuários entram para acessar a própria conta.
  - _Por que importa:_ um controle de sessão fraco permite que uma conta seja tomada por outra.
  - _Evidência:_ a lógica de emissão de sessões, em que as sessões são emitidas sem prazo de expiração.

No caminho, o detect dá a cada especialização do [catálogo](https://lagune.ai/pt-BR/docs/catalog) do seu projeto um veredito em relação ao código, aplica aquelas cujo contexto está presente e as registra em **Applied specializations**, a lista que o harden e o verify reaproveitam.

A partir daí, você tem um mapa claro do que o seu sistema faz e de onde estão os riscos, pronto para as próximas etapas agirem sobre ele.

**Dica**

- Rodar de novo atualiza o mapa: os achados resolvidos saem e os novos entram.
- O mapa do detect fica em `.lagune/memory/detect.md`.

## Próximo passo

Transforme o mapa em um plano: [`/lagune-plan`](https://lagune.ai/pt-BR/docs/commands/plan).

## Perguntas frequentes

### O que o /lagune-detect faz?

Ele lê o seu código e mapeia o que o seu sistema faz e onde estão os riscos, registrando apenas o que de fato encontra. A regra dele é detectar, não inventar.

### O que é um achado no Lagune?

Um achado é um risco detectado, com o que ele é, por que importa e a evidência no código. É a unidade rastreada que o plan, o harden e o verify levam adiante.

### Onde o mapa do detect fica salvo?

Em .lagune/memory/detect.md.

### Quais especializações o detect usa?

Cada uma do catálogo do seu projeto recebe um veredito em relação ao código. O detect aplica aquelas cujo contexto está presente e as registra em Applied specializations.
