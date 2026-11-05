# crypto 훅: 취약한 암호화 탐지하기

> 명령줄에서 코드베이스를 스캔해 취약한 암호 알고리즘을 찾거나, 코드 조각 하나에 점수를 매길 수 있습니다.

표준 URL: https://lagune.ai/ko-KR/docs/hooks/crypto
언어: ko-KR
원문: https://lagune.ai/docs/hooks/crypto
마지막 업데이트: 2026-11-05

`crypto` 훅은 **취약한 암호 알고리즘**을 호출 지점에서 잡아냅니다: 지원 중단된 암호 방식, 안전하지 않은 모드, 깨진 해시 함수가 그 대상입니다. **언어를 인식해** 파일마다 그 언어의 규칙으로 읽으므로 Rust 파일에서 Python 구문을 잡아내는 일은 없습니다. 또한 [`crypto` 전문 지식](https://lagune.ai/ko-KR/docs/catalog)을 뒷받침하는 결정론적 엔진이며, **scan** 모드나 **check** 모드로 직접 실행할 수도 있습니다.

## 실행하기

**코드베이스 스캔**

```bash
npx lagune read crypto                # scans the whole project
npx lagune read crypto --dir src      # scans a directory
npx lagune read crypto --file hash.ts # scans a single file
```

**코드 조각 검사**

```bash
npx lagune read crypto --lang javascript --pattern 'createCipher("aes-256-cbc", k)' # => weak
npx lagune read crypto --lang python --pattern 'hashlib.md5(data)'                  # => review
npx lagune read crypto --lang go --pattern 'sha256.Sum256(data)'                    # => safe
```

스캔 결과는 최대 두 개의 섹션으로 출력됩니다. **Weak cryptography found** 섹션은 발견 사항 목록(DES/3DES/RC4/Blowfish/RC2, ECB 모드)입니다: 모두 깨진 암호 알고리즘이므로 훅은 0이 아닌 종료 코드를 반환합니다. **Cryptography to review manually** 섹션은 훅 혼자서는 판단할 수 없는 단서 목록입니다: MD5/SHA-1 해시(보안 용도로는 깨졌지만 단순 체크섬으로는 문제가 없어 용도에 따라 판단이 갈림), 보안 용도로 쓰인 비암호학적 난수 생성기, 타이밍 공격에 취약한 비교가 여기에 해당합니다. 아무것도 발견되지 않으면 `no weak cryptography found` 메시지를 출력합니다.

## 판정 해석하기

| 판정      | 의미                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------- |
| `weak`    | 깨진 암호 알고리즘(DES/3DES, RC4, Blowfish, RC2, 또는 ECB 모드)을 사용하는 코드 조각               |
| `review`  | 용도에 따라 판단이 달라지는 알고리즘: MD5/SHA-1 해시, 또는 보안 용도로 쓰인 비암호학적 난수 생성기 |
| `safe`    | 암호화를 사용하지만 취약한 알고리즘은 발견되지 않은 코드 조각                                      |
| `invalid` | 판정할 수 있는 암호 구문이 없는 코드 조각                                                          |

### CLI 옵션

| 옵션        | 값        | 설명                                                                                                         |
| ----------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| `--pattern` | 코드 조각 | 코드 조각 하나 검사. 반복해 지정하면 여러 코드 조각을 검사해 한 줄에 판정 하나씩 출력                        |
| `--lang`    | 언어      | `--pattern` 옵션 사용 시 필수: javascript, python, go, java, kotlin, php, ruby, rust, csharp, c, cpp 중 하나 |
| `--dir`     | 디렉터리  | 스캔 범위를 디렉터리로 한정. 반복 지정 가능, `--file` 옵션과 함께 사용 가능                                  |
| `--file`    | 파일      | 스캔 범위를 단일 파일로 한정. 반복 지정 가능, `--dir` 옵션과 함께 사용 가능                                  |

옵션을 지정하지 않으면 프로젝트 전체를 스캔합니다. `--pattern` 옵션에는 `--lang` 옵션이 필요하며, `--dir` 또는 `--file` 옵션과 함께 쓸 수 없습니다.

### 스캔 대상 선택하기

**Git**이 무시하는 항목은 건너뜁니다. 더 많은 항목을 제외하거나 **Git**이 무시하는 항목도 스캔하려면 `crypto` 훅에 전용 설정을 지정하세요:

```bash
npx lagune write add --ignore test/fixtures --checker crypto
```

```json
{
  "checkers": {
    "crypto": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

모든 설정은 [훅 설정하기](https://lagune.ai/ko-KR/docs/hooks/configure)에서 설명합니다.

### 지원 언어

스캔은 파일 확장자로 다음 언어를 구분해 읽고, 언어마다 해당 언어의 암호 API를 기준으로 검사합니다.

| 언어                        | 취약한 암호 방식(발견 사항), 해시와 난수 생성기(검토)                                                                |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **JavaScript / TypeScript** | `createCipher`, `CryptoJS.DES/RC4`, 따옴표로 감싼 `*-ecb`; MD5/SHA-1용 `createHash`/`subtle.digest`; `Math.random()` |
| **Python**                  | pycryptodome의 `DES/ARC4/Blowfish.new`, `algorithms.TripleDES`, `MODE_ECB`; `hashlib.md5/sha1`; `random.*`           |
| **Go**                      | `des.NewCipher`, `rc4.NewCipher`, `blowfish.NewCipher`, `NewECBEncrypter`; `md5/sha1.Sum`; `math/rand`               |
| **Java / Kotlin**           | `Cipher.getInstance("DES"/…/ECB")`; `MessageDigest.getInstance("MD5")`, `HmacMD5`; `java.util.Random`                |
| **PHP**                     | `openssl_encrypt("des-…"/"…-ecb")`, `mcrypt_*`; `md5()`/`sha1()`, `hash("md5", …)`; `rand()`/`mt_rand()`             |
| **Ruby**                    | `OpenSSL::Cipher.new("des-…")`, `:ECB`; `Digest::MD5/SHA1`; `rand()`/`Random`                                        |
| **Rust**                    | `Rc4::`, `Blowfish::`, `des::`, `ecb::`; `Md5::`, `Sha1::`, `Hmac<Md5>`; `SmallRng`/`XorShiftRng`                    |
| **C#**                      | `DES/TripleDES/RC2.Create`, `CipherMode.ECB`; `MD5/SHA1.Create`, `HMACMD5`; `new Random()`                           |
| **C / C++**                 | OpenSSL의 `DES_*`/`RC4`/`EVP_des_*`, `EVP_*_ecb`; `MD5()`/`SHA1()`, `EVP_md5`; `rand()`/`random()`                   |

**전수 검사가 아닌 최선의 탐지**

소스 코드를 텍스트로 읽으므로, 런타임에 조합되거나 별칭 뒤에 숨겨졌거나 인식하지 못하는 형태로 작성된 알고리즘은 놓칠 수 있습니다. 이 표를 완전한 목록이 아니라 든든한 출발점으로 활용하세요.

**팁**

훅이 보장하는 것은 최소 기준(이런 구문이 존재한다는 사실)입니다: 키 관리, IV 재사용, RSA 패딩처럼 판단이 필요한 부분은 여전히 [`crypto` 전문 지식](https://lagune.ai/ko-KR/docs/catalog)이 다룹니다.

## 자주 묻는 질문

### 코드베이스에서 취약한 암호화를 찾으려면 어떻게 스캔하나요?

플래그 없이 crypto 훅을 실행하세요. 깨진 암호 방식과 ECB 모드는 발견 사항으로 분류되어 0이 아닌 종료 코드를 반환합니다. MD5/SHA-1 해시는 보안 용도로는 깨졌지만 단순 체크섬으로는 문제가 없으므로 검토할 단서로 분류합니다.

### crypto 훅은 Math.random() 호출도 잡아내나요?

보안 용도로 쓰인 경우에만 검토할 단서로 잡아내며, 자동으로 발견 사항이 되지는 않습니다. 지터나 UI 정렬 순서에 난수를 쓰는 것은 문제없는 용도이기 때문입니다.
