# Hook infra: detecte erros de configuração em IaC

> Varra arquivos Terraform, Dockerfiles e GitHub Actions em busca de erros de configuração, ou avalie um único trecho, direto da linha de comando.

Canônica: https://lagune.ai/pt-BR/docs/hooks/infra
Idioma: pt-BR
Original: https://lagune.ai/docs/hooks/infra
Última atualização: 2026-11-04

O hook `infra` sinaliza **erros de configuração em infraestrutura como código** que dá para decidir só pelo arquivo: uma rede aberta para o mundo, uma permissão curinga, um segredo em um manifesto, um contêiner rodando como root, um valor não confiável em um shell de CI. Ele lê apenas arquivos de IaC (`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`). É o engine determinístico por trás da [especialização `infra`](https://lagune.ai/pt-BR/docs/catalog), no modo **scan** ou **check**.

## Como executar

**Varrer o código**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**Verificar um trecho**

Passe o trecho com `--pattern` e o tipo dele com `--kind` (`terraform`, `dockerfile` ou `github-actions`).

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

A varredura imprime até duas seções. **Infrastructure risks found** termina com código de saída diferente de zero e reúne os defeitos decidíveis (um ingress `0.0.0.0/0` em uma porta sensível, uma declaração IAM curinga, um segredo em manifesto, `encrypted = false`, um módulo git sem versão fixada, uma imagem que roda explicitamente como root, um `curl | sh`, uma injeção de script em CI, `permissions: write-all`). **Infrastructure hardening advisories** não altera o código de saída (uma tag de imagem base mutável, uma action fixada por tag). Uma execução sem achados imprime `no infrastructure risks found`.

## Como ler o veredito

O modo check imprime a tag de maior severidade que encontrou (por exemplo, `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`), uma tag de alerta (`mutable-tag`, `unpinned-action`) ou `safe`. Só uma tag com severidade de achado termina com código de saída diferente de zero.

### Opções da CLI

| Opção       | Valor                                           | Descrição                                                                         |
| ----------- | ----------------------------------------------- | --------------------------------------------------------------------------------- |
| `--pattern` | um trecho                                       | Verifica um trecho. Exige `--kind`. Repita para verificar vários.                 |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | O tipo pelo qual o trecho é julgado.                                              |
| `--dir`     | um diretório                                    | Limita a varredura a um diretório. Pode ser repetida e combinada com `--file`.    |
| `--file`    | um arquivo                                      | Limita a varredura a um único arquivo. Pode ser repetida e combinada com `--dir`. |

Sem nenhuma opção, ele varre todos os arquivos de IaC do projeto. `--pattern` não pode ser combinado com `--dir` nem com `--file`.

### Escolha o que ele varre

Ele deixa de fora o que o **Git** ignora. Para deixar mais coisas de fora, ou para varrer o que o **Git** ignora, dê ao `infra` configurações próprias:

```bash
npx lagune write add --ignore examples --checker infra
```

```json
{
  "checkers": {
    "infra": { "gitignore": false, "ignore": ["examples"] }
  }
}
```

Todas as configurações estão em [Configure os hooks](https://lagune.ai/pt-BR/docs/hooks/configure).

**Dica**

O hook pega os casos evidentes e decidíveis: a ausência de criptografia, a exposição de `pull_request_target` e o escopo certo de IAM são julgamentos que a [especialização `infra`](https://lagune.ai/pt-BR/docs/catalog) continua cobrindo.

## Perguntas frequentes

### Quais arquivos de infraestrutura o hook infra lê?

Terraform/HCL (.tf, .tf.json, .hcl), Dockerfiles e os YAML de workflows e actions do GitHub Actions dentro de .github/. Ele alcança esses arquivos mesmo que os scanners de código-fonte os ignorem.
