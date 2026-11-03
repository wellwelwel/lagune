# Hook crypto: detecte criptografia fraca

> Varra um código em busca de primitivas criptográficas fracas, ou avalie um único trecho, direto da linha de comando.

Canônica: https://lagune.ai/pt-BR/docs/hooks/crypto
Idioma: pt-BR
Original: https://lagune.ai/docs/hooks/crypto
Última atualização: 2026-11-03

O hook `crypto` sinaliza **primitivas criptográficas fracas** no ponto da chamada: uma cifra obsoleta, um modo inseguro ou um digest quebrado. Ele **reconhece a linguagem**, lendo cada arquivo pelas regras dela, para que uma construção de Python nunca seja sinalizada em um arquivo Rust, e é o engine determinístico por trás da [especialização `crypto`](https://lagune.ai/pt-BR/docs/catalog), que você mesmo pode executar no modo **scan** ou **check**.

## Como executar

**Varrer o código**

```bash
npx lagune read crypto                # scans the whole project
npx lagune read crypto --dir src      # scans a directory
npx lagune read crypto --file hash.ts # scans a single file
```

**Verificar um trecho**

```bash
npx lagune read crypto --lang javascript --pattern 'createCipher("aes-256-cbc", k)' # => weak
npx lagune read crypto --lang python --pattern 'hashlib.md5(data)'                  # => review
npx lagune read crypto --lang go --pattern 'sha256.Sum256(data)'                    # => safe
```

O scan imprime até duas seções. **Weak cryptography found** é o conjunto de achados (DES, 3DES, RC4, Blowfish, RC2 e o modo ECB): cada um é uma primitiva de cifra quebrada, então o hook termina com código diferente de zero. **Cryptography to review manually** é um conjunto de pistas que ele não consegue julgar sozinho: um digest MD5 ou SHA-1 (quebrado para uso em segurança, mas legítimo como simples checksum, então a intenção decide), um RNG não criptográfico em um contexto de segurança ou uma comparação vulnerável a timing. Uma execução sem achados imprime `no weak cryptography found`.

## Como ler o veredito

| Veredito  | Significado                                                                                                             |
| --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `weak`    | O trecho usa uma primitiva de cifra quebrada (DES ou 3DES, RC4, Blowfish, RC2 ou o modo ECB).                           |
| `review`  | Uma primitiva que depende da intenção: um digest MD5 ou SHA-1, ou um RNG não criptográfico em um contexto de segurança. |
| `safe`    | O trecho usa criptografia e nenhuma primitiva fraca foi encontrada.                                                     |
| `invalid` | O trecho não contém nenhuma construção criptográfica reconhecível para avaliar.                                         |

### Opções da CLI

| Opção       | Valor               | Descrição                                                                                             |
| ----------- | ------------------- | ----------------------------------------------------------------------------------------------------- |
| `--pattern` | um trecho de código | Verifica um trecho. Repita para verificar vários, com um veredito por linha.                          |
| `--lang`    | uma linguagem       | Obrigatória com `--pattern`: javascript, python, go, java, kotlin, php, ruby, rust, csharp, c ou cpp. |
| `--dir`     | um diretório        | Restringe a varredura a um diretório. Pode ser repetida e combinada com `--file`.                     |
| `--file`    | um arquivo          | Restringe a varredura a um único arquivo. Pode ser repetida e combinada com `--dir`.                  |

Sem nenhuma opção, ele varre o projeto inteiro. `--pattern` exige `--lang` e não pode ser combinada com `--dir` nem com `--file`.

### Linguagens suportadas

O scan lê estas linguagens, identificadas pela extensão do arquivo, e verifica cada uma contra as próprias APIs criptográficas.

| Linguagem                   | Cifras fracas (achado) e digests ou RNG (revisão)                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **JavaScript / TypeScript** | `createCipher`, `CryptoJS.DES/RC4`, `*-ecb` entre aspas; MD5/SHA-1 `createHash`/`subtle.digest`; `Math.random()` |
| **Python**                  | pycryptodome `DES/ARC4/Blowfish.new`, `algorithms.TripleDES`, `MODE_ECB`; `hashlib.md5/sha1`; `random.*`         |
| **Go**                      | `des.NewCipher`, `rc4.NewCipher`, `blowfish.NewCipher`, `NewECBEncrypter`; `md5/sha1.Sum`; `math/rand`           |
| **Java / Kotlin**           | `Cipher.getInstance("DES"/…/ECB")`; `MessageDigest.getInstance("MD5")`, `HmacMD5`; `java.util.Random`            |
| **PHP**                     | `openssl_encrypt("des-…"/"…-ecb")`, `mcrypt_*`; `md5()`/`sha1()`, `hash("md5", …)`; `rand()`/`mt_rand()`         |
| **Ruby**                    | `OpenSSL::Cipher.new("des-…")`, `:ECB`; `Digest::MD5/SHA1`; `rand()`/`Random`                                    |
| **Rust**                    | `Rc4::`, `Blowfish::`, `des::`, `ecb::`; `Md5::`, `Sha1::`, `Hmac<Md5>`; `SmallRng`/`XorShiftRng`                |
| **C#**                      | `DES/TripleDES/RC2.Create`, `CipherMode.ECB`; `MD5/SHA1.Create`, `HMACMD5`; `new Random()`                       |
| **C / C++**                 | OpenSSL `DES_*`/`RC4`/`EVP_des_*`, `EVP_*_ecb`; `MD5()`/`SHA1()`, `EVP_md5`; `rand()`/`random()`                 |

**Melhor esforço, não exaustivo**

Ele lê o código-fonte como texto, então uma primitiva montada em tempo de execução, escondida atrás de um alias ou escrita de uma forma que ele não reconhece pode passar despercebida. Trate a tabela como um ponto de partida sólido, não como um inventário completo.

**Dica**

O hook garante a base (essas construções existem): a gestão de chaves, a reutilização de IV e o padding de RSA são questões de julgamento que a [especialização `crypto`](https://lagune.ai/pt-BR/docs/catalog) continua cobrindo.

## Perguntas frequentes

### Como varrer um código em busca de criptografia fraca?

Execute o hook crypto sem nenhuma flag. Cifras quebradas e o modo ECB são achados que terminam com código diferente de zero. Um digest MD5/SHA-1 é uma pista para revisão, já que é quebrado para uso em segurança, mas legítimo como simples checksum.

### O hook crypto sinaliza Math.random()?

Só como pista para revisão em um contexto de segurança, nunca como achado automático, já que a aleatoriedade é legítima para jitter ou para a ordenação de elementos na interface.
