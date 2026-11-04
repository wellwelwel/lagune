# /lagune-specialize: treine uma especialização de segurança com texto simples

> Transforme uma fonte ou um tema de segurança que você fornecer em uma nova especialização sob demanda.

Canônica: https://lagune.ai/pt-BR/docs/commands/specialize
Idioma: pt-BR
Original: https://lagune.ai/docs/commands/specialize
Última atualização: 2026-11-04

🎓 Ensine ao **Lagune** uma nova especialização, a partir de uma fonte ou de um tema que você fornecer.

Ele lê o material e o condensa em uma especialização focada e exclusivamente defensiva, com o mesmo formato das [nativas](https://lagune.ai/pt-BR/docs/catalog), para que as fases detect e verify a carreguem depois como qualquer outra. Ele só audita e explica: nunca escreve entradas de ataque nem exploits, e nunca mexe no seu código.

**A partir de um artigo**

```prompt
# Um link ou uma referência: o Lagune os transforma na defesa
/lagune-specialize https://owasp.org/www-community/attacks/SQL_Injection
```

**A partir de um exploit**

```prompt
# Um ataque como fonte: a especialização continua sendo a defesa
/lagune-specialize "' OR 1=1 -- injeta SQL no texto da consulta"
```

**A partir de um tema**

```prompt
# Ou apenas diga o que cobrir
/lagune-specialize SQL injection
```

**Um ataque pode ser a fonte, nunca o resultado**

Apontar para um ataque não tem problema quando o objetivo é se defender dele: o relato de um exploit é material de estudo que ele condensa na defesa. A especialização que ele produz sempre audita e explica, e nunca produz um exploit funcional, um payload ou uma técnica de evasão.

## O que ele grava

O resultado são dois arquivos no seu projeto, versionados e revisáveis junto com o seu código:

- A especialização em `.lagune/catalog/<name>.md`, com o mesmo formato das [nativas](https://lagune.ai/pt-BR/docs/catalog).
- A entrada dela em `.lagune/configs.json`, onde o seu projeto indexa as próprias especializações para o catálogo combiná-las com as nativas.

Em seguida, ele lista o catálogo para confirmar que a nova entrada está lá. As suas próprias especializações estão sempre no catálogo, sejam quais forem as categorias dele. Você nunca adiciona um comando nem mexe no pacote: uma nova especialidade é um arquivo de conhecimento mais uma entrada no índice, gravados no seu próprio projeto.

## Refina, nunca sobrescreve

Especializar um nome que já existe, seja uma nativa como `regex` ou uma que você especializou antes, **reconcilia** o arquivo atual em vez de substituí-lo. Ele lê o que está lá, incorpora o novo conhecimento, mantém o que continua válido e reescreve o que mudou. Nada é descartado sem ser lido. Uma especialização sua se sobrepõe a uma nativa de mesmo nome, então você pode aprimorar uma nativa para o seu próprio projeto sem perdê-la.

**Dica**

- A nova especialização carrega exatamente como uma nativa: as fases detect e verify a usam sob demanda, ou você mesmo a carrega com `npx lagune read catalog <name>` e lhe dá uma tarefa.
- Quando o material tem uma origem identificável (um artigo, um autor, um link, um padrão), a especialização dá o crédito. Um tema solto não traz fonte.

**Nota**

**Ele só roda quando você o chama:** o agente nunca o inicia por conta própria.

## Perguntas frequentes

### Como adicionar uma especialização de segurança personalizada?

Execute o /lagune-specialize com uma fonte ou um tema. Ele os condensa em uma especialização exclusivamente defensiva, gravada em .lagune/catalog/<name>.md, mais a entrada dela em .lagune/configs.json.

### O Lagune consegue aprender com o relato de um exploit?

Sim, como fonte, nunca como resultado. Um ataque pode ser a fonte, nunca o produto. O specialize nunca escreve entradas de ataque nem exploits.

### O specialize sobrescreve as especializações nativas?

Não. Ele refina, nunca sobrescreve.
