# Schema de configuração

> O JSON Schema das configurações de um projeto Lagune, para autocompletar e validar no seu editor, acompanhando a versão atual do Lagune ou fixado em uma versão.

Canônica: https://lagune.ai/pt-BR/docs/references/configs-schema
Idioma: pt-BR
Original: https://lagune.ai/docs/references/configs-schema
Última atualização: 2026-11-05

O `.lagune/configs.json` registra as [**categorias**](https://lagune.ai/pt-BR/docs/categories) que um projeto usa, indexa as [**especializações**](https://lagune.ai/pt-BR/docs/catalog) próprias dele e define o que os [**checkers**](https://lagune.ai/pt-BR/docs/hooks/configure) deixam de fora. O JSON Schema desse arquivo permite que o seu editor autocomplete cada campo e aponte um erro de digitação ou uma categoria desconhecida enquanto você edita o arquivo.

## O schema atual

Sempre que o **Lagune** grava o arquivo e não encontra um `$schema` nele, aponta o arquivo para o schema atual:

```json
{
  "$schema": "https://lagune.ai/schemas/configs.json",
  "categories": ["owasp", "javascript"]
}
```

Esse endereço sempre acompanha a versão atual do **Lagune**. Um arquivo gravado antes do **Lagune** 0.16.0 recebe o endereço na próxima alteração, e todas as fases avisam sobre isso até lá.

## Fixe uma versão

Cada release do **Lagune** a partir da 0.16.0 traz o schema como ele era naquela versão, publicado no **npm** e servido pelo **jsDelivr**. Para fixar uma, coloque a versão depois de `lagune@` no endereço do `$schema`:

```json
{
  "$schema": "https://cdn.jsdelivr.net/npm/lagune@0.16.0/schemas/configs.json"
}
```

A versão aceita qualquer intervalo semver:

| Versão             | Schema                         |
| ------------------ | ------------------------------ |
| `0.16.0`           | O da 0.16.0                    |
| `0.16.x` ou `0.16` | O da release 0.16 mais recente |
| `0.x` ou `0`       | O da release 0.x mais recente  |
| `latest`           | O da release mais recente      |

## Perguntas frequentes

### O Lagune precisa do schema?

Não. O schema só ajuda o seu editor, e o Lagune lê o arquivo do mesmo jeito, com ou sem $schema.

### O Lagune sobrescreve um schema fixado?

Não. O Lagune só grava o $schema quando o arquivo não tem nenhum, e mantém qualquer endereço que você definir.

### Quando devo fixar uma versão?

Quando o projeto roda uma versão específica do Lagune, para que o seu editor valide o arquivo de acordo com o que essa versão aceita.
