# 카테고리

> Lagune 프로젝트에서 사용할 수 있는 전문 지식 카테고리와 변경 방법을 소개합니다. OWASP부터 JavaScript, Python, Go, Rust의 언어별 보안 강화까지 다룹니다.

표준 URL: https://lagune.ai/ko-KR/docs/categories
언어: ko-KR
원문: https://lagune.ai/docs/categories
마지막 업데이트: 2026-11-04

**Lagune**은 내장 [**전문 지식**](https://lagune.ai/ko-KR/docs/catalog)을 **13개 카테고리**로 묶습니다. 프로젝트가 사용하는 카테고리에 따라 어떤 내장 전문 지식이 프로젝트의 [**카탈로그**](https://lagune.ai/ko-KR/docs/catalog)에 들어갈지 정해지며, 카테고리는 시스템이 하는 일과 시스템을 작성한 언어, 두 가지로 나뉩니다.

기록된 카테고리가 없으면 프로젝트는 `owasp` 카테고리만 사용합니다. [`/lagune-charter`](https://lagune.ai/ko-KR/docs/commands/charter) 명령어는 프로젝트를 살펴보고 근거가 확인된 카테고리를 모두 기록하며, 카테고리는 언제든 직접 바꿀 수 있습니다.

## 시스템이 하는 일

| 카테고리 | 키        | 보안 강화 대상                                                                                |
| -------- | --------- | --------------------------------------------------------------------------------------------- |
| OWASP    | `owasp`   | OWASP가 추적하는 애플리케이션 보안 위험: 인젝션, 취약한 접근 통제, 인증 실패, 암호화 실패     |
| 인프라   | `infra`   | 컨테이너, 워크로드, 서버리스 설정: Dockerfile, Compose, Pod 보안, FaaS IAM과 트리거           |
| AI / LLM | `ai`      | 프롬프트 인젝션과 도구, 에이전트, 검색, MCP의 안전하지 않은 연결로부터 AI와 LLM 연동 보호     |
| Lovable  | `lovable` | AI가 생성한 Supabase 앱(Lovable 등): RLS 누락, 유출된 `service_role` 키, 안전하지 않은 기본값 |

## 시스템을 작성한 언어

| 카테고리   | 키           | 보안 강화 대상                                                                                      |
| ---------- | ------------ | --------------------------------------------------------------------------------------------------- |
| JavaScript | `javascript` | 런타임 전반의 `eval` 및 `child_process` 기반 RCE, 경로 탐색(path traversal), 프로토타입 오염        |
| Python     | `python`     | `pickle` 및 YAML 역직렬화 RCE, `str.format` 문자열 탐색(traversal), 클래스 오염                     |
| Rust       | `rust`       | 건전하지 않은(unsound) `unsafe` API, `transmute` 오용, 정수 오버플로, FFI 경계의 정의되지 않은 동작 |
| C / C++    | `c-cpp`      | 코드 실행으로 이어지는 포맷 문자열 버그, 버퍼 오버플로, 경계 밖 쓰기(out-of-bounds write)           |
| PHP        | `php`        | 타입 저글링을 이용한 인증 우회, 객체 인젝션 가젯 체인, 안전하지 않은 기본 설정                      |
| Go         | `go`         | typed nil 인터페이스 버그, 고루틴 데이터 레이스, 보안 관련 코드 경로의 안전하지 않은 동시성         |
| Java       | `java`       | 원격 코드 실행으로 이어지는 `ObjectInputStream` 역직렬화 가젯 체인                                  |
| Ruby       | `ruby`       | 원격 코드 실행에 이르는 `Marshal.load` 및 YAML 역직렬화 가젯 체인                                   |
| .NET / C#  | `dotnet`     | `BinaryFormatter` 역직렬화 RCE, XSS로 이어지는 인코더 우회                                          |

**팁**

**Lagune**은 언어에 구애받지 않습니다. 프로젝트가 어떤 언어로 작성되었든 전체 흐름이 그대로 읽어 내며, 이 카테고리는 한 언어에만 있는 함정을 더 깊이 다룰 뿐입니다.

## 언제든 추가하고 제거하기

카테고리는 한번 정하면 바꿀 수 없는 약속이 아니라 출발점입니다. 지금 프로젝트에 맞는 카테고리를 사용하고, `write add` 및 `write remove` 명령어로 키를 지정해 언제든 바꾸세요. 터미널에서 `--categories` 옵션을 값 없이 사용하면 대화형 선택 화면이 열립니다(스페이스 키로 선택하거나 해제하고 엔터 키로 확정하며, 아무것도 선택하지 않으면 건너뜁니다). 터미널 밖에서는 옵션 뒤에 카테고리를 이어서 넘기세요.

**추가**

```bash
npx lagune write add --categories # interactive
npx lagune write add --categories owasp
npx lagune write add --categories owasp rust
```

**제거**

```bash
npx lagune write remove --categories # interactive
npx lagune write remove --categories owasp
npx lagune write remove --categories owasp rust
```

처음 실행하는 `write add` 또는 `write remove` 명령어는 `owasp` 카테고리에서 시작하므로, 카테고리를 모두 제거하면 기본값으로 돌아가지 않고 빈 목록이 남습니다. 모든 변경 사항은 `.lagune/configs.json` 파일에 기록되므로 팀 전체가 같은 카테고리 구성으로 작업합니다.

## 프로젝트가 사용하는 카테고리 확인하기

`read list --categories` 명령어는 모든 카테고리와 프로젝트의 사용 여부를 보여 줍니다.

```bash
npx lagune read list --categories
# Categories
#   • owasp       [used]       Harden against the application security risks OWASP tracks
#   • javascript  [available]  Harden JavaScript and its runtimes
#   • php         [available]  Harden PHP against type-juggling auth bypass
#   • go          [available]  Harden Go against typed-nil interface bugs
#   ...
#
# No category is recorded yet, so this project uses the default: owasp.
```

각 카테고리에 어떤 전문 지식이 들어 있는지는 [**카탈로그**](https://lagune.ai/ko-KR/docs/catalog)에서 확인하세요. [`/lagune-specialize`](https://lagune.ai/ko-KR/docs/commands/specialize) 명령어로 직접 만든 전문 지식은 카테고리와 관계없이 카탈로그에 포함됩니다.

## 자주 묻는 질문

### 카테고리는 어떻게 추가하나요?

카테고리의 키를 --categories 옵션에 넘기세요. 예를 들어 npx lagune write add --categories javascript 명령어를 실행합니다. 기록된 카테고리가 없는 동안에는 charter 단계도 프로젝트를 살펴보고 근거가 확인된 카테고리를 기록합니다.

### 카테고리를 여러 개 사용할 수 있나요?

네. 같은 줄에 하나씩 이어서 나열하세요.

### 프로젝트에는 어떤 카테고리를 사용해야 하나요?

기본값인 owasp 카테고리로 시작한 뒤, 사용하는 언어나 스택에 맞는 카테고리를 추가하세요. 전문 지식은 필요할 때만 불러오므로, 단계에서 그 카테고리의 전문 지식이 필요해지기 전까지는 카테고리에 드는 비용이 전혀 없습니다.
