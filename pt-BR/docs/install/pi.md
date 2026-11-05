# Como instalar o Lagune no Pi como pacote

> Instale o Lagune no Pi como pacote, pelo npm ou pelo GitHub, e mantenha-o atualizado.

Canônica: https://lagune.ai/pt-BR/docs/install/pi
Idioma: pt-BR
Original: https://lagune.ai/docs/install/pi
Última atualização: 2026-11-05

**npm**

Instale o pacote pelo terminal:

```bash
pi install npm:lagune
```

**GitHub**

Instale o commit mais recente do **GitHub**, que roda o engine pelo **npx**:

```bash
pi install git:github.com/wellwelwel/lagune
```

## Atualização

**npm**

Para atualizar o **Lagune**, execute:

```bash
pi update npm:lagune
```

**GitHub**

Para atualizar o **Lagune**, execute:

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` atualiza todos os pacotes que você instalou, enquanto `pi update` sozinho atualiza apenas o **Pi**.

## Comandos

Digite os comandos com o prefixo `skill:`, como `/skill:lagune-charter` para `/lagune-charter`.

## Perguntas frequentes

### Como instalar o Lagune no Pi?

Execute pi install npm:lagune, ou pi install git:github.com/wellwelwel/lagune para o commit mais recente do GitHub.

### Como atualizar o Lagune no Pi?

Execute pi update npm:lagune, ou pi update git:github.com/wellwelwel/lagune para uma instalação pelo GitHub. pi update --extensions atualiza todos os pacotes que você instalou.

### Como executar os comandos do Lagune no Pi?

Digite-os com o prefixo skill:, como /skill:lagune-charter.
