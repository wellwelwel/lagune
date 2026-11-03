# 설치: 모든 AI 에이전트를 위한 보안 강화

> 에이전트가 지원하면 플러그인으로, 그 밖의 경우에는 skills CLI로 어떤 프로젝트에든 Lagune을 설치한 뒤, 프로젝트에 맞는 보안 전문 지식을 고르세요.

표준 URL: https://lagune.ai/ko-KR/docs
언어: ko-KR
원문: https://lagune.ai/docs
마지막 업데이트: 2026-11-03

**Lagune**은 AI 에이전트가 프로젝트를 더 안전하게 만들도록 돕습니다. 코드를 대상으로 실행하면 에이전트가 시스템이 실제로 하는 일을 파악하고, 그 시스템에 중요한 보안 작업을 차근차근 안내합니다. **Lagune**은 [Security-Driven Hardening (SDH)](https://lagune.ai/ko-KR/docs/references/paper) 방법론의 첫 번째 프로젝트입니다.

**오픈 소스 응원하기**

**Lagune**이 마음에 드시나요? [**GitHub**에서 ⭐ 하나 눌러 주세요](https://github.com/wellwelwel/lagune)

## 에이전트 선택하기

- [Claude Code](https://lagune.ai/ko-KR/docs/install/claude-code): Anthropic의 에이전트 기반 코딩 도구
- [Codex](https://lagune.ai/ko-KR/docs/install/codex): OpenAI의 코딩 에이전트
- [Cursor](https://lagune.ai/ko-KR/docs/install/cursor): AI 코드 에디터
- [GitHub Copilot](https://lagune.ai/ko-KR/docs/install/github-copilot-cli): GitHub의 AI 페어 프로그래머
- [Gemini CLI](https://lagune.ai/ko-KR/docs/install/gemini-cli): Google의 오픈 소스 터미널 에이전트
- [Antigravity](https://lagune.ai/ko-KR/docs/install/antigravity-cli): Google의 에이전트 기반 개발 플랫폼
- [OpenCode](https://lagune.ai/ko-KR/docs/install/opencode): 오픈 소스 코딩 에이전트
- [Devin for Terminal](https://lagune.ai/ko-KR/docs/install/devin-cli): Cognition의 터미널 에이전트
- [Factory Droid](https://lagune.ai/ko-KR/docs/install/factory-droid): Factory의 소프트웨어 개발 에이전트
- [Grok Build](https://lagune.ai/ko-KR/docs/install/grok-build): xAI의 코딩 에이전트
- [Qwen Code](https://lagune.ai/ko-KR/docs/install/qwen-code): Qwen의 터미널 코딩 에이전트
- [Kimi Code](https://lagune.ai/ko-KR/docs/install/kimi-code): Moonshot AI의 코딩 에이전트
- [Muse Code](https://lagune.ai/ko-KR/docs/install/muse-code): Meta의 코딩 에이전트
- [Pi](https://lagune.ai/ko-KR/docs/install/pi): 미니멀한 터미널 코딩 에이전트
- [Hermes Agent](https://lagune.ai/ko-KR/docs/install/hermes-agent): Nous Research의 오픈 소스 에이전트
- [범용](https://lagune.ai/ko-KR/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed 외 66개

**정보**

- **Lagune**은 내부적으로 **Node.js**에서 실행되지만, 개발 언어는 무엇이든 자유롭게 쓸 수 있습니다.
- 완전히 오프라인으로 실행하려면 `npm i -D lagune@0.16.0` 명령어로 프로젝트에 **Lagune**을 설치하세요.

## 카테고리

**Lagune**의 보안 지식은 [**카테고리**](https://lagune.ai/ko-KR/docs/categories)별로 묶인 [**전문 지식**](https://lagune.ai/ko-KR/docs/catalog) 형태로 제공됩니다.

- **OWASP** (`owasp`): OWASP가 추적하는 애플리케이션 보안 위험에 대비한 보안 강화: 인젝션, 취약한 접근 통제, 인증과 암호화 실패
- **인프라** (`infra`): 컨테이너, 워크로드, 서버리스 설정 보안 강화: Dockerfile, Compose, Pod 보안, FaaS IAM과 트리거
- **AI / LLM** (`ai`): 프롬프트 인젝션과 도구, 에이전트, 검색, MCP의 안전하지 않은 연결을 막는 AI와 LLM 통합 보안 강화
- **Lovable** (`lovable`): AI로 생성한 Supabase 앱(Lovable 등) 보안 강화: RLS 허점, 유출된 service_role 키, 안전하지 않은 기본값
- **JavaScript** (`javascript`): eval과 child_process 기반 RCE, 경로 탐색(path traversal), 프로토타입 오염을 막는 JavaScript와 런타임 보안 강화
- **Python** (`python`): pickle과 YAML 역직렬화를 통한 RCE, str.format 기반 속성 탐색, 클래스 오염을 막는 Python 보안 강화
- **Rust** (`rust`): 불건전한 unsafe API, transmute 오용, 정수 오버플로, FFI 경계의 정의되지 않은 동작을 막는 Rust 보안 강화
- **Java** (`java`): 원격 코드 실행으로 이어지는 ObjectInputStream 역직렬화 가젯 체인을 막는 Java 보안 강화
- **Ruby** (`ruby`): 원격 코드 실행으로 이어지는 Marshal.load와 YAML 역직렬화 가젯 체인을 막는 Ruby 보안 강화
- **PHP** (`php`): 타입 저글링을 이용한 인증 우회, 객체 인젝션 가젯 체인, 안전하지 않은 기본 설정을 막는 PHP 보안 강화
- **Go** (`go`): typed nil 인터페이스 버그, 고루틴 데이터 레이스, 보안 관련 경로의 안전하지 않은 동시성을 막는 Go 보안 강화
- **C / C++** (`c-cpp`): 코드 실행으로 이어지는 포맷 문자열 버그, 버퍼 오버플로, 범위를 벗어난 쓰기를 막는 C와 C++ 보안 강화
- **.NET** (`dotnet`): BinaryFormatter 역직렬화를 통한 RCE와 XSS로 이어지는 인코더 우회를 막는 .NET과 C# 보안 강화

선택한 카테고리의 키를 붙여 `npx lagune write add --categories` 명령어를 실행하세요.

**팁**

프로젝트는 `owasp` 카테고리로 시작하며, [`/lagune-charter`](https://lagune.ai/ko-KR/docs/commands/charter) 명령어가 프로젝트를 읽고 근거가 확인된 카테고리를 추가합니다.

## 요구 사항

시스템에 [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager)가 설치되어 있어야 합니다.

## 배지 달기 ✨

**Lagune**을 사용하고 계신가요? **README**에 배지를 달아 보세요:

**투톤**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**단색**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## 다음 단계

**Lagune**의 각 [**스킬**](https://lagune.ai/ko-KR/docs/get-started/commands)이 무엇을 하는지 살펴보세요.

## 자주 묻는 질문

### Lagune은 무엇인가요?

Lagune은 AI 에이전트가 어떤 코드베이스든 보안을 강화하도록 돕는, 오픈 소스이자 방어 전용인 보안 워크플로입니다. 코드를 대상으로 실행하면 시스템이 실제로 하는 일을 탐지하고, 그 컨텍스트에 중요한 보안 수정을 안내합니다.

### Lagune은 어떻게 설치하나요?

사용하는 에이전트를 고르세요: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI, Hermes Agent에서는 플러그인으로, Gemini CLI와 Qwen Code에서는 확장 프로그램으로, Pi에서는 패키지로 Lagune을 설치하고, 그 밖의 에이전트에서는 npx skills add wellwelwel/lagune 명령어로 설치합니다. 새 프로젝트에서도 기존 프로젝트에서도 작동합니다.

### Lagune을 쓰려면 API 키가 필요한가요?

아니요. 사용 중인 AI 에이전트를 통해 실행되므로 API 키가 필요 없습니다.

### 요구 사항은 무엇인가요?

시스템에 Node.js (LTS)가 설치되어 있어야 합니다.

### Lagune은 어떤 프로그래밍 언어를 지원하나요?

모든 언어를 지원합니다. Lagune은 내부적으로 Node.js에서 실행되지만, 어떤 프로그래밍 언어로 작성된 프로젝트든 점검하고 보안을 강화합니다.

### Lagune은 프로젝트에 무엇을 추가하나요?

프로젝트의 보안 상태를 담는 .lagune/ 디렉터리입니다. 이 디렉터리는 무언가를 처음 기록하는 명령어가 만듭니다. 또한 skills CLI는 슬래시 명령어를 프로젝트 안에 설치해 에이전트가 그곳에서 읽게 하고, 플러그인은 슬래시 명령어를 에이전트 안에 보관합니다.

### Lagune은 어떻게 업데이트하나요?

설치한 방법 그대로 업데이트합니다. 각 에이전트의 설치 페이지에서 그 에이전트로 Lagune을 업데이트하는 방법을 안내하며, skills CLI에서는 npx skills update 명령어로 업데이트합니다. 보안 원칙, 각 단계의 산출물, 직접 만든 전문 지식은 그대로 유지됩니다.

### 프로젝트는 어떤 전문 지식을 사용하나요?

프로젝트의 카테고리에 속한 내장 전문 지식과 프로젝트가 직접 만든 전문 지식입니다. charter 단계는 프로젝트를 읽고 근거가 확인된 카테고리를 기록하며, npx lagune write add --categories 명령어로 카테고리를 바꿀 수 있습니다.

### 프로젝트 개발을 다 끝내야 보안 작업을 시작할 수 있나요?

아니요. /lagune 명령어는 작성되는 작업의 보안을 그 자리에서 강화합니다: 어떤 프롬프트든 받아 요청한 것을 만들고, 보안 원칙에 따라 안전한 기본값으로 보안을 강화합니다. 이미 있는 코드는 5단계 Blue Team 흐름으로 점검합니다.

### Lagune으로 기존 프로젝트를 점검할 수 있나요?

네. 5단계 Blue Team 흐름이 이미 있는 코드를 점검합니다: charter 단계에서 보안 규칙을 정하고, detect 단계에서 시스템이 하는 일과 위험이 있는 곳을 파악하며, plan 단계에서 발견 사항마다 점수를 매기고 알맞은 수정을 짝지어 줍니다. 이어서 harden 단계에서 수정을 적용하고, verify 단계에서 수정이 실제로 효과가 있는지 증명한 뒤 종결합니다.

### Lagune을 쓰는 것과 에이전트에게 그냥 취약점과 보안 결함을 찾아 달라고 하는 것은 무엇이 다른가요?

에이전트가 혼자 코드를 읽으면 취약점처럼 보이는 것은 찾아내지만, 보안 통제처럼 보이는 것은 그냥 지나칩니다. 차단할 주소 목록이 있으면 누군가 이미 위험을 처리한 것처럼 보이기 때문에, 그 목록이 대부분의 주소를 놓친다는 사실을 아무도 확인하지 않은 채 코드가 배포됩니다. Lagune은 이 기본 전제를 뒤집습니다: 코드에 이미 있는 방어 장치는 확인하기 전까지 증명되지 않은 것으로 보고, 카탈로그의 모든 전문 지식에 명시적인 판정을 내리며, verify 단계는 보안 통제가 있는지가 아니라 위험이 사라졌는지를 묻습니다. 또한 각 발견 사항은 실행을 거듭해도 하나의 추적 항목으로 유지되므로, 위험이 해소되었음을 증명하고 종결할 수 있습니다. 반면 그냥 요청하면 매번 다른 보고서가 나와서 비교할 기준이 없습니다.

### Lagune으로 개발하는 것과 에이전트에게 그냥 안전한 코드를 작성해 달라고 하는 것은 무엇이 다른가요?

안전한 코드를 달라고만 하면 무엇이 안전한지는 에이전트가 정하게 되고, 무엇을 요청해야 하는지 이미 안다고 가정하게 됩니다. 보안 요구 사항은 대개 요청 안에 이미 들어 있지만, 요청한 사람도 에이전트도 알아차리지 못합니다: 사용자가 접근할 수 있는 강의를 보여 주는 페이지를 요청하는 것 자체가 인가 규칙을 말하는 것이고, 한 번도 작성되지 않은 검사는 코드에 눈여겨볼 흔적을 전혀 남기지 않습니다. /lagune 명령어는 첫 줄을 작성하기 전에 보안 원칙과 앞으로 만들 것에 맞는 전문 지식을 불러오고, 다 만든 뒤에는 사용한 방어 기준에 비추어 결과를 다시 읽습니다. 안전한 방식이 안전하지 않은 방식보다 비용이 더 드는 경우는 드물기 때문에, 결과를 가르는 것은 어느 쪽을 택해야 하는지 아는 것이며, 바로 그 지식이 처음부터 주어집니다.

### Lagune은 DAST(동적 애플리케이션 보안 테스트)를 실행하거나 실행 중인 애플리케이션을 테스트하나요?

아니요. Lagune은 코드를 읽을 뿐, 시스템을 실행하거나 조작된 요청을 보내지 않습니다. verify 단계는 보안 통제가 소스 코드에 존재하고 올바르게 구현되었는지를 확인합니다. 이는 실제로 운영 중인 대상에서 보안 통제가 공격을 견디는지와는 다른 질문이므로, "cannot tell from the code"(코드만으로는 판단할 수 없음)는 슬그머니 통과로 처리하는 대신 내리는 정당한 판정입니다. DAST는 런타임에 관한 질문에, Lagune은 소스 코드에 관한 질문에 답하므로 어느 쪽도 다른 쪽을 대신하지 않습니다. 선택 사항인 prove 명령어조차 이 선을 지킵니다: prove 명령어의 테스트가 검증하는 것은 언제나 안전한 동작이며, 공격 페이로드가 아닙니다.

### Lagune이 펜테스트(침투 테스트)를 대신할 수 있나요?

아니요, 절대 그렇지 않습니다! 펜테스트는 승인을 받은 전문가가 실제로 운영 중인 시스템을 상대로 직접 판단하며 진행하는 작업으로, 여러 발견 사항을 엮어 보고 공격 표면별 규칙으로는 설명할 수 없는 비즈니스 로직까지 파고듭니다. 펜테스트에서 나온 발견 사항은 detect 단계에 우려 사항으로 넘겨 Lagune의 Blue Team 흐름에 넣을 수 있으므로, 전문가가 보고한 내용도 계획하고, 보안을 강화하고, 검증할 수 있습니다.

## 보안 정책

[SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md) 파일을 확인하세요.

## 라이선스

**Lagune**은 [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE)에 따라 배포됩니다.

Copyright © 2026-present [Weslley Araújo](https://github.com/wellwelwel) 및 [기여자](https://github.com/wellwelwel/lagune/graphs/contributors).
