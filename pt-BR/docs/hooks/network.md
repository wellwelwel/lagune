# Hook network: avalie URLs contra SSRF

> Avalie um ou vários destinos de requisição contra SSRF, direto da linha de comando.

Canônica: https://lagune.ai/pt-BR/docs/hooks/network
Idioma: pt-BR
Original: https://lagune.ai/docs/hooks/network
Última atualização: 2026-11-05

O hook `network` decide se um destino de requisição feita pelo servidor está protegido contra **SSRF** (uma requisição que pode ser direcionada a serviços internos, metadados da nuvem ou hosts privados). É o engine determinístico por trás da [especialização `network`](https://lagune.ai/pt-BR/docs/catalog), e você mesmo pode executá-lo.

## Como executar

Passe cada destino com `--url`. O hook imprime uma palavra por destino, explicada na tabela abaixo.

**Um destino**

```bash
npx lagune read network --url 'http://example.com/'
# => safe

npx lagune read network --url 'http://0x7f000001/'
# => private-target
```

**Vários destinos**

Repita `--url` para avaliar uma allowlist ou denylist inteira em uma só chamada, com um veredito por linha, na mesma ordem.

```bash
npx lagune read network \
  --url 'http://example.com/' \
  --url 'http://[::1]/' \
  --url 'http://allowed.com@evil.example/'
# => safe
# => private-target
# => parser-divergent
```

Ele resolve o host do mesmo jeito que a rede, então as formas codificadas de um endereço interno não passam despercebidas: hexadecimal, octal, decimal sem pontos, abreviada, IPv6 e IPv4 mapeado em IPv6 resultam todas em `private-target`. E quando um validador descuidado e o cliente que faz a requisição leriam hosts diferentes, o veredito é `parser-divergent`.

## Como ler o veredito

| Veredito           | Significado                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `safe`             | O destino se conecta a um host público, e um validador descuidado leria o mesmo host.                        |
| `private-target`   | O host resolve para um endereço privado, de loopback, link-local, não especificado ou de metadados da nuvem. |
| `parser-divergent` | Um validador de texto descuidado leria um host real diferente daquele ao qual o cliente se conecta.          |
| `invalid url`      | A string não pode ser interpretada como URL, então não há nada para buscar.                                  |

Só `safe` significa permitir. Trate `private-target`, `parser-divergent` e `invalid url` como bloqueio.

### Opções da CLI

| Opção   | Valor              | Descrição                                                                     |
| ------- | ------------------ | ----------------------------------------------------------------------------- |
| `--url` | uma URL ou um host | Verifica um destino. Repita para verificar vários, com um veredito por linha. |

É obrigatório informar pelo menos um `--url`. O destino nunca é um argumento posicional solto, então não tem como ser confundido com uma flag.

**Por que passar como flag**

Cada destino é passado como valor de uma flag, nunca interpolado no comando. Um valor com aspas ou crases continua inerte e não consegue injetar nada no shell. Sempre coloque o valor entre aspas simples para que o seu shell não o expanda antes.

**O que ele não cobre**

O hook é puro e nunca resolve DNS, então duas lacunas de tempo de execução ficam fora do escopo: o **DNS rebinding** (um nome que resolve para um endereço público na verificação e para um interno na requisição) e as **cadeias de redirecionamento** (um primeiro salto que passa e depois redireciona para dentro). Feche essas lacunas resolvendo o nome uma única vez e se conectando ao endereço validado, e recusando redirecionamentos. Ele fixa os nomes de loopback reservados (`localhost` e a família `.localhost`) como internos sem nenhuma consulta, mas qualquer outro nome DNS resulta em `safe`, porque afirmar que ele resolve para dentro exigiria a resolução: quem protege esses nomes é a allowlist, e é ela que este verificador valida.

**Dica**

Esta é a mesma verificação que a [especialização `network`](https://lagune.ai/pt-BR/docs/catalog) executa para comprovar que um filtro de destinos se sustenta.

## Perguntas frequentes

### Como testar uma URL contra SSRF?

Execute o hook network. Ele avalia um destino de requisição e retorna safe, private-target, parser-divergent ou invalid url. Só safe significa permitir.

### O que é uma URL parser-divergent?

Uma URL que parsers diferentes leem de formas diferentes, o que é um bypass clássico de SSRF. O hook network a sinaliza em vez de permiti-la.
