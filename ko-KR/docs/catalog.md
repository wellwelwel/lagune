# 카탈로그: 필요할 때만 불러오는 보안 전문 지식

> 프로젝트 카탈로그의 전문 지식을 불러오는 방식을 설명합니다. 각 단계가 필요할 때만 불러오며, 직접 불러올 수도 있습니다.

표준 URL: https://lagune.ai/ko-KR/docs/catalog
언어: ko-KR
원문: https://lagune.ai/docs/catalog
마지막 업데이트: 2026-11-03

🧠 **Lagune**의 전문 지식은 특정 주제에 집중한, 언어에 구애받지 않는 보안 지식 모듈입니다. 기본으로 불러오는 일 없이 필요할 때만 불러옵니다. 전문 지식은 명령어가 아닙니다. 프로젝트의 카탈로그는 프로젝트가 사용하는 전문 지식의 모음으로, 프로젝트 [카테고리](https://lagune.ai/ko-KR/docs/categories)의 내장 전문 지식과 프로젝트가 직접 만든 전문 지식으로 이루어집니다. detect 단계와 verify 단계는 실행 중에 전문 지식을 찾아 쓰며, 언제든 원하는 전문 지식을 직접 불러올 수도 있습니다.

**개요**

*인터랙티브 카탈로그 개요는 웹 페이지에서 볼 수 있습니다. 모든 내장 전문 지식은 아래 표에 있습니다.*

**작동 방식**

## 직접 실행하기

전문 지식을 직접 사용하려면 에이전트에게 `read catalog <name>` 명령어로 불러오라고 요청하고, 같은 프롬프트에 작업 내용을 적으세요. 그러면 그 지식이 요청한 작업에 적용됩니다. **Lagune** 흐름과 관계없는 프롬프트를 포함해 어떤 프롬프트에서도 사용할 수 있습니다.

예를 들어 **Python**으로 안전한 **RegExp** 모음을 생성하는 자유 형식 프롬프트를 직접 작성하면 다음과 같습니다.

```prompt
`npx lagune read catalog regex` 명령어로 regex 전문 지식을 불러온 다음, @src/utils/regex.py 파일에 이메일과 사용자 이름을 검증하는 정규 표현식 모음을 만들어 줘.
```

이때 결정론적 훅이 각 **RegExp**의 **ReDoS** 취약 여부를 테스트해 안전한 패턴만 남기고, 다음과 같은 결과를 만듭니다.

```python
import re

EMAIL = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
USERNAME = re.compile(r"^[a-zA-Z0-9_]{3,20}$")

def is_email(value: str) -> bool:
    return EMAIL.match(value) is not None

def is_username(value: str) -> bool:
    return USERNAME.match(value) is not None
```

**ReDoS 검사기 사용해 보기**

[**devina.io/redos-checker**](https://devina.io/redos-checker) 사이트에서 패턴을 직접 테스트해 보세요.

## 내장 전문 지식

내장 전문 지식은 [**카테고리**](https://lagune.ai/ko-KR/docs/categories)별로 묶여 있습니다. **Lagune**에 기본으로 포함된 전문 지식은 다음과 같습니다.

| 전문 지식             | 카테고리                    | 다루는 내용                                                                     |
| --------------------- | --------------------------- | ------------------------------------------------------------------------------- |
| `regex`               | `owasp`                     | **ReDoS**: 조작된 입력에서 처리 시간이 폭증하는 패턴.                           |
| `network`             | `owasp`                     | **SSRF와 리디렉션**: 사용자가 입력한 요청 대상이나 리디렉션 대상.               |
| `interpreter`         | `owasp`, `lovable`          | **코드 인젝션**: `eval`, 동적 include, 이름 기반 디스패치.                      |
| `sql`                 | `owasp`                     | **관계형 데이터베이스**: 인젝션, ORM 원시 쿼리 호출, 권한, 엔진이 닿는 범위.    |
| `path`                | `owasp`                     | **파일 시스템 경로**: 경로 탐색, 널 바이트, NTFS 스트림, 파일 심기.             |
| `upload`              | `owasp`                     | **파일 업로드**: 형식과 시그니처, 악성 콘텐츠, 저장소, 제한.                    |
| `access-control`      | `owasp`, `lovable`          | **인증, 인가, 세션**: IDOR, 대량 할당(mass assignment), 테넌트, 세션.           |
| `credential-endpoint` | `owasp`, `lovable`          | **추측 공격과 봇**: 무차별 대입, 패스워드 스프레잉, 크리덴셜 스터핑, 요청 제한. |
| `federation`          | `owasp`                     | **토큰 신뢰**: OAuth/OIDC, SAML, JWT 검증, QR 로그인.                           |
| `http-request`        | `owasp`                     | **요청 출처**: CSRF, CORS 설정 오류, 위조된 클라이언트 IP.                      |
| `transport`           | `owasp`                     | **통신 채널 보안**: TLS 설정, HTTPS와 평문 통신, HSTS, 인증서 피닝.             |
| `crypto`              | `owasp`, `lovable`          | **저장 데이터 암호화**: 취약하거나 직접 만든 알고리즘, CSPRNG, 키 관리.         |
| `secrets`             | `owasp`, `lovable`          | **하드코딩된 자격 증명**: 소스 코드에 그대로 적힌 키, 토큰, 비밀번호.           |
| `api-endpoint`        | `owasp`                     | **REST가 아닌 API 표면**: GraphQL, gRPC, WebSocket 인가, DoS, 스키마.           |
| `payment`             | `owasp`, `lovable`          | **결제 흐름**: 서버 측 결제 게이트웨이 검증, 서명된 콜백, 멱등성.               |
| `xml`                 | `owasp`                     | **XML 파싱**: XXE, 외부 엔티티, billion laughs 확장.                            |
| `csv`                 | `owasp`                     | **수식 인젝션**: `=`/`+`/`-`/`@` 문자로 시작하는 스프레드시트 셀.               |
| `container`           | `owasp`, `infra`            | **컨테이너 설정**: root 실행, 케이퍼빌리티, 소켓 마운트, 이미지 보안 강화.      |
| `infra`               | `infra`                     | **코드형 인프라**: Terraform, Dockerfile, GitHub Actions.                       |
| `serverless`          | `owasp`, `infra`, `lovable` | **FaaS 함수**: 최소 권한 IAM, 이벤트 입력, 컨텍스트, 시크릿.                    |
| `llm`                 | `ai`, `lovable`             | **AI와 LLM 위험**: 프롬프트 인젝션, 과도한 권한(agency), RAG, MCP, 출력.        |
| `supabase`            | `lovable`                   | **Supabase 백엔드**: 기본적으로 꺼져 있는 RLS, AI가 잘못 생성한 정책, 키 모델.  |
| `browser`             | `javascript`, `lovable`     | **클라이언트 측 위험**: XSS, CSP, 프레이밍, 스토리지 등.                        |
| `javascript`          | `javascript`                | **언어 수준 위험**: RCE, 프로토타입 오염 등.                                    |
| `python`              | `python`                    | **언어 수준 위험**: `pickle` RCE, 클래스 오염, `-O` 등.                         |
| `rust`                | `rust`                      | **`unsafe` 건전성**: safe 호출자에서 비롯되는 UB, `transmute`, 오버플로.        |
| `java`                | `java`                      | **역직렬화와 모바일 코드**: `readObject` 체인, 객체 하이재킹.                   |
| `ruby`                | `ruby`                      | **역직렬화와 `open`**: `Marshal`/YAML 객체 복원, 파이프 관련 특이 동작.         |
| `php`                 | `php`                       | **타입 저글링과 `unserialize`**: 매직 해시, POP 체인.                           |
| `go`                  | `go`                        | **typed nil과 데이터 레이스**: `nil != nil`, 메모리를 공유하는 고루틴.          |
| `c-cpp`               | `c-cpp`                     | **포맷 문자열**: `printf(user_input)`, `%n` 기반 write-what-where.              |
| `dotnet`              | `dotnet`                    | **플랫폼 수준 위험**: `BinaryFormatter` RCE, `@Html.Raw`, enum 검증 누락.       |

내장 지식은 대부분 OWASP 자료의 핵심을 정리한 것입니다. 각 전문 지식이 OWASP의 공식 공격 페이지 및 Cheat Sheet 페이지와 어떻게 대응하는지는 [**OWASP 출처**](https://lagune.ai/ko-KR/docs/references/owasp-sources)에서 전체 내용을 확인하세요. 일부 스택 전용 모듈은 OWASP 대신 해당 벤더의 자체 가이드를 바탕으로 합니다. 예를 들어 `supabase` 전문 지식은 Supabase 문서와 CVE-2025-48757을 바탕으로 합니다.

## 직접 만든 전문 지식

내장 전문 지식은 새 명령어 없이, 지식 파일 하나와 인덱스 행 하나를 추가하는 방식으로 늘어납니다. 직접 만드는 전문 지식도 같은 방식으로, [`/lagune-specialize`](https://lagune.ai/ko-KR/docs/commands/specialize) 명령어로 추가합니다. 글이나 주제를 알려 주면 그 핵심을 정리해 프로젝트에 새 전문 지식을 만들며, 파일은 `.lagune/catalog/` 폴더에, 항목은 `.lagune/configs.json` 파일에 기록됩니다. 직접 만든 전문 지식은 카테고리와 관계없이 항상 카탈로그에 포함되며, 이름이 같은 내장 전문 지식을 가립니다.

**Lagune 내부에서 필요할 때 자동으로 불러오는 전문 지식**

detect 단계나 verify 단계는 전문 지식이 다루는 컨텍스트를 만나면 `read catalog <name>` 명령어로 해당 전문 지식을 스스로 불러옵니다. 이 과정은 단계의 일부로 자동으로 진행되므로 직접 불러올 필요가 없습니다.

## 사용할 수 있는 전문 지식 확인하기

터미널에서 프로젝트의 카탈로그를 나열하면 전문 지식이 한 줄에 하나씩 태그와 함께 표시됩니다.

```bash
npx lagune read catalog
# regex: Regular Expression [required]
# network: Requests, Webhook, URL Fetch, Socket, IMDS, Redirect
# interpreter: Evaluator, Sink, Shell, Dynamic Execution
# ...
```

`[required]` 표시가 붙은 전문 지식은 작업 내용과 관계없이 항상 적용됩니다. 목록에 어떤 내장 전문 지식이 들어가는지는 프로젝트의 [**카테고리**](https://lagune.ai/ko-KR/docs/categories)에 따라 달라집니다.

**기본으로 불러오지 않는 전문 지식**

모든 검사를 기본으로 실행하는 대신, 프로젝트의 실제 모습에 맞는 지식만 불러옵니다.

## 자주 묻는 질문

### Lagune의 전문 지식이란 무엇인가요?

특정 주제에 집중한, 언어에 구애받지 않는 보안 지식 모듈로, 기본으로 불러오는 일 없이 필요할 때만 불러옵니다. 에이전트 스킬과 달리 명령어가 아닙니다.

### 프로젝트의 카탈로그란 무엇인가요?

프로젝트가 사용하는 전문 지식으로, 프로젝트 카테고리의 내장 전문 지식과 프로젝트가 직접 만든 전문 지식으로 이루어집니다. 기록된 카테고리가 없으면 OWASP만 사용합니다.

### 전문 지식은 기본으로 불러오나요?

아니요. 프로젝트의 실제 모습에 맞춰 필요할 때만 불러옵니다.

### 전문 지식을 직접 불러오려면 어떻게 하나요?

작업 내용을 적는 프롬프트에, 에이전트가 npx lagune read catalog <name> 명령어를 실행하도록 하는 요청도 함께 적으세요.
