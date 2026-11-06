# regex 훅: ReDoS 패턴 탐지하기

> 명령줄에서 코드베이스를 스캔해 ReDoS에 취약한 정규식을 찾거나, 패턴 하나에 점수를 매길 수 있습니다.

표준 URL: https://lagune.ai/ko-KR/docs/hooks/regex
언어: ko-KR
원문: https://lagune.ai/docs/hooks/regex
마지막 업데이트: 2026-11-04

`regex` 훅은 [`regex` 전문 지식](https://lagune.ai/ko-KR/docs/catalog)이 실행하는 결정론적 정규식 안전성 엔진이며, 직접 실행할 수도 있습니다. 명령어 하나로 두 가지 모드를 쓸 수 있습니다: **scan** 모드는 **ReDoS**에 취약한 패턴과 런타임에 만들어지는 패턴이 있는지 코드베이스를 스캔하고, **check** 모드는 건네받은 패턴 하나에 점수를 매깁니다.

## 코드베이스 스캔

플래그를 지정하지 않으면 프로젝트 전체를 스캔합니다. `--dir` 옵션은 스캔 범위를 디렉터리로, `--file` 옵션은 파일 하나로 좁힙니다. 두 옵션 모두 여러 번 지정해 하나의 보고서로 합칠 수 있으며, 여러 대상에 걸치는 파일도 한 번만 표시됩니다.

**프로젝트 전체**

```bash
npx lagune read regex
```

**특정 디렉터리**

```bash
npx lagune read regex --dir src/services
```

**단일 파일**

```bash
npx lagune read regex --file bin/import.pl
```

**여러 대상**

```bash
npx lagune read regex --dir core --dir workers --file Sources/App/Router.swift
```

**한도 지정**

`--limit` 옵션은 스캔의 ReDoS 임곗값(기본값 25)을 정하며, check 모드에서 쓰는 한도와 같습니다. 한도가 낮을수록 더 엄격합니다.

```bash
npx lagune read regex --dir src/services --limit 15
```

출력은 가공하지 않은 텍스트이며, 각 섹션의 헤더가 그 섹션을 읽는 법을 알려 줍니다. 섹션은 발견 사항이 있을 때만 표시됩니다.

```text
Vulnerable regular expressions found:

cmd/server/main.go
  ([a-z]+)+$ (exponential, search)

Dynamically built regular expressions (review manually by simulating a constructed regex):

app/payments.php
crates/parser/lexer.rs
lib/validate.py

Static regex wrapped in a constructor (use a literal instead):

config/token.rb
```

아무것도 발견되지 않으면 한 줄만 출력합니다.

```bash
npx lagune read regex --dir src/clean
# => no unsafe patterns found
```

### 섹션 해석하기

| 섹션                                                                                        | 의미                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Vulnerable regular expressions found`                                                      | ReDoS에 취약한 패턴. 파일별로 묶어 각 패턴을 그 아래에 들여 쓰고, 괄호 안에 안전하지 않은 이유와 (해당하는 경우) 범위 및 플래그를 표시. 모든 줄이 안전하지 않은 패턴이므로 판정은 따로 표시하지 않음 |
| `Regular expressions the analysis could not settle (review manually)`                       | 분석이 작업 한도 안에서 결론을 내지 못한 패턴. 같은 방식으로 나열                                                                                                                                    |
| `Dynamically built regular expressions (review manually by simulating a constructed regex)` | 변수, 문자열 연결, 보간으로 정규식을 만드는 파일                                                                                                                                                     |
| `Static regex wrapped in a constructor (use a literal instead)`                             | 정규식 리터럴이 더 간단하고 런타임 컴파일도 생략할 수 있는데, 일반 문자열 리터럴을 정규식 생성자에 넘기는 파일                                                                                       |

첫 번째 섹션은 보안 발견 사항입니다. 두 번째와 세 번째 섹션은 그 자체로는 발견 사항이 아니며, 정적 검사로 결론을 낼 수 없는 코드를 가리키므로 사람이 직접 읽어 봐야 합니다. 네 번째 섹션은 보안 발견 사항이 아니라 코드를 더 명확하게 만들기 위한 힌트입니다.

### CLI 옵션

| 옵션        | 값            | 설명                                                                                       |
| ----------- | ------------- | ------------------------------------------------------------------------------------------ |
| `--pattern` | 정규식 소스   | 패턴 하나 검사. 반복해 지정하면 여러 패턴을 검사해 입력 순서대로 패턴마다 판정 하나씩 출력 |
| `--flags`   | 정규식 플래그 | 모든 `--pattern` 패턴을 `im` 같은 플래그로 검사. check 모드에만 적용                       |
| `--dir`     | 디렉터리      | 스캔 범위를 디렉터리로 한정. 반복 지정 가능, `--file` 옵션과 함께 사용 가능                |
| `--file`    | 파일          | 스캔 범위를 단일 파일로 한정. 반복 지정 가능, `--dir` 옵션과 함께 사용 가능                |
| `--limit`   | 0 이상의 정수 | ReDoS 반복 한도 설정(기본값 25). 두 모드 모두에 적용. 한도가 낮을수록 더 엄격              |

옵션을 지정하지 않으면 프로젝트 전체를 스캔합니다. `--pattern` 옵션은 check 모드이며, `--dir` 또는 `--file` 옵션과 함께 쓸 수 없습니다.

### 스캔 대상 선택하기

**Git**이 무시하는 항목은 건너뜁니다. 더 많은 항목을 제외하거나 **Git**이 무시하는 항목도 스캔하려면 `regex` 훅에 전용 설정을 지정하세요:

```bash
npx lagune write add --ignore test/fixtures --checker regex
```

```json
{
  "checkers": {
    "regex": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

모든 설정은 [훅 설정하기](https://lagune.ai/ko-KR/docs/hooks/configure)에서 설명합니다.

### 지원 언어

스캔은 파일 확장자로 다음 언어를 구분하고 언어마다 고유한 규칙으로 읽으므로, 한 언어의 패턴을 다른 언어의 규칙으로 검사하는 일은 없습니다. 그 밖의 파일은 잘못된 규칙으로 스캔하지 않고 건너뜁니다.

| #   | 언어                        | 확장자                                                                                                       |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                |
| 3   | **Ruby**                    | `.rb`                                                                                                        |
| 4   | **Go**                      | `.go`                                                                                                        |
| 5   | **PHP**                     | `.php`                                                                                                       |
| 6   | **Rust**                    | `.rs`                                                                                                        |
| 7   | **Java**                    | `.java`                                                                                                      |
| 8   | **C#**                      | `.cs`                                                                                                        |
| 9   | **C**                       | `.c`, `.h`                                                                                                   |
| 10  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 |
| 11  | **Kotlin**                  | `.kt`, `.kts`                                                                                                |
| 12  | **Swift**                   | `.swift`                                                                                                     |
| 13  | **Scala**                   | `.scala`, `.sc`                                                                                              |
| 14  | **Dart**                    | `.dart`                                                                                                      |
| 15  | **PowerShell**              | `.ps1`, `.psm1`, `.psd1`                                                                                     |
| 16  | **Elixir**                  | `.ex`, `.exs`                                                                                                |
| 17  | **Objective-C**             | `.m`, `.mm`                                                                                                  |
| 18  | **R**                       | `.r`                                                                                                         |
| 19  | **Julia**                   | `.jl`                                                                                                        |
| 20  | **Clojure**                 | `.clj`, `.cljs`, `.cljc`, `.edn`                                                                             |
| 21  | **Crystal**                 | `.cr`                                                                                                        |
| 22  | **Nim**                     | `.nim`, `.nims`                                                                                              |
| 23  | **V**                       | `.v`                                                                                                         |
| 24  | **D**                       | `.d`                                                                                                         |
| 25  | **Perl**                    | `.pl`, `.pm`                                                                                                 |

**전수 검사가 아닌 최선의 탐지**

소스 코드를 텍스트로 읽으므로 런타임에 조합되는 패턴은 판단할 수 없고, 여러 줄에 걸쳐 있거나 별칭 뒤에 숨겨졌거나 인식하지 못하는 형태로 작성된 패턴은 놓칠 수 있습니다. 출력된 섹션을 완전한 목록이 아니라 든든한 출발점으로 활용하고, 섹션이 닿지 못하는 부분은 계속 코드를 읽어 확인하세요.

## 단일 패턴 검사

`--pattern` 옵션에 패턴 소스를 넘기면 점수를 매깁니다. 훅은 `safe`, `unsafe`, `undetermined`(분석이 결론을 내기 전에 작업 한도에 도달한 경우), `invalid regex` 중 한 단어를 출력합니다. `--pattern` 옵션을 반복해 지정하면 여러 패턴에 한 번에 점수를 매길 수 있으며, 판정은 입력 순서대로 패턴마다 하나씩 출력됩니다.

**패턴 하나**

```bash
npx lagune read regex --pattern '(a+)+$'
# => unsafe

npx lagune read regex --pattern '^[a-z0-9_]{3,20}$'
# => safe
```

**여러 패턴**

```bash
npx lagune read regex --pattern '(a+)+$' --pattern '^[a-z]+$'
# => unsafe
# => safe
```

**플래그 지정**

`--flags` 옵션을 쓰면 호출에 포함된 모든 `--pattern` 패턴을 실제로 실행될 때의 플래그로 검사합니다. 플래그에 따라 패턴이 일치하는 문자가 달라지기 때문입니다.

```bash
npx lagune read regex --pattern '^(?:a|A)+$'
# => safe

npx lagune read regex --pattern '^(?:a|A)+$' --flags 'i'
# => unsafe
```

**한도 지정**

`--limit` 옵션은 반복 한도(기본값 25)를 정하며, 호출에 포함된 모든 `--pattern` 패턴에 적용됩니다. 한도가 낮을수록 더 엄격합니다.

```bash
npx lagune read regex --pattern 'a?a?a?' --limit 2
# => unsafe
```

**인수를 따옴표로 감싸는 이유**

각 패턴은 명령어에 끼워 넣지 않고 항상 플래그 값으로 전달합니다. 따옴표나 백틱이 든 값도 아무 효과 없이 그대로 남아 셸에 인젝션될 수 없습니다. 셸이 먼저 패턴을 확장하지 않도록 항상 작은따옴표로 감싸세요.

**팁**

[`regex` 전문 지식](https://lagune.ai/ko-KR/docs/catalog)이 실행하는 것과 같은 엔진입니다. scan 모드로 ReDoS 점검을 시작하고, check 모드로 스캔에서 드러난 패턴을 확인합니다.

## 자주 묻는 질문

### CLI에서 정규식의 ReDoS 취약점을 어떻게 검사하나요?

npx lagune read regex --pattern '<pattern>' 명령어를 실행하세요. safe, unsafe, undetermined, invalid regex 중 하나를 반환합니다.

### 프로젝트 전체에서 안전하지 않은 정규식을 어떻게 스캔하나요?

regex 훅을 scan 모드로 코드베이스 전체에 실행하세요. 지원하는 25개 언어에서 ReDoS에 취약한 패턴을 보고합니다.
