# 예약 감사: Lagune을 정해진 일정에 따라 반복 실행하기

> GitHub Actions에서 본인 키로, 또는 Claude Code, Codex, Cursor, Antigravity, OpenCode에서 Lagune 감사를 정기적으로 예약하세요. 새로운 위험을 보고하거나 Blue Team 흐름 전체를 실행합니다.

표준 URL: https://lagune.ai/ko-KR/docs/examples/scheduled-audits
언어: ko-KR
원문: https://lagune.ai/docs/examples/scheduled-audits
마지막 업데이트: 2026-11-09

**Lagune**이 프로젝트를 알아서 점검하도록 예약하세요. 발견한 내용을 보고만 하게 하거나, Blue Team 흐름 전체를 실행하게 할 수 있습니다.

## 예약하기

**Universal**

**GitHub Actions**는 [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/)로 클라우드에서 감사를 실행합니다. **Copilot CLI** 엔진이 직접 고른 모델 제공자를 본인 키로 호출하므로, 에이전트 구독이 필요 없습니다:

- `gh extension install github/gh-aw` 명령어로 확장 프로그램을 설치하세요.
- `gh secret set PROVIDER_API_KEY` 명령어로 제공자의 키를 저장소 시크릿에 저장하세요.
- 이 워크플로를 `.github/workflows/lagune-audit.md` 파일로 저장하세요. `<model>` 자리에는 도구 호출을 지원하는 제공자의 모델 하나를, `<your-prompt>` 자리에는 [프롬프트 예시](#prompt-examples) 중 하나를 넣으세요:

  ```md
  ---
  on:
    schedule:
      - cron: '0 9 * * 1'
  permissions:
    contents: read
  engine:
    id: copilot
    model: <model>
    env:
      COPILOT_PROVIDER_TYPE: <type>
      COPILOT_PROVIDER_BASE_URL: <url>
      COPILOT_PROVIDER_API_KEY: ${{ secrets.PROVIDER_API_KEY }}
  skills:
    - wellwelwel/lagune@v0.18.1
  network:
    allowed:
      - defaults
      - node
  tools:
    edit:
    bash: [npx]
  safe-outputs:
    create-pull-request:
  ---

  <your-prompt>

  그다음 변경 사항으로 풀 리퀘스트를 열어 줘.
  ```

  | 제공자                                       | `<type>`    | `<url>`                                                 |
  | -------------------------------------------- | ----------- | ------------------------------------------------------- |
  | **OpenAI**                                   | `openai`    | `https://api.openai.com/v1`                             |
  | **Anthropic**                                | `anthropic` | `https://api.anthropic.com`                             |
  | 모든 **OpenAI** 호환 API(예: **OpenRouter**) | `openai`    | 해당 API의 기본 URL(예: `https://openrouter.ai/api/v1`) |

- `gh aw compile` 명령어를 실행하고, 워크플로를 함께 생성된 `.lock.yml` 파일과 같이 커밋하세요.

**클라우드**에서는 컴퓨터가 꺼져 있어도 감사가 실행됩니다:

- 플러그인 대신 [범용 설치](https://lagune.ai/ko-KR/docs/install/universal) 방식으로 **Lagune**을 커밋하세요.
- **Claude Code** 세션에서 `/schedule` 명령어를 입력하고 감사 내용을 설명하거나, [claude.ai/code/routines](https://claude.ai/code/routines) 페이지에서 만드세요.

**내 컴퓨터**에서는 개인용으로 설치한 플러그인으로 감사를 실행합니다:

- 데스크톱 앱의 **Scheduled tasks** 페이지에서 로컬 작업을 만드세요.
- 엔진의 도구를 승인해 줄 사람이 없으므로, [설치 페이지](https://lagune.ai/ko-KR/docs/install/claude-code)에 나온 대로 엔진을 미리 허용하세요.
- 작업은 앱이 열려 있고 컴퓨터가 절전 상태가 아닐 때만 실행됩니다.

예약 작업은 **ChatGPT** 데스크톱 앱에서 만들며(**Codex CLI**에서는 만들 수 없음), 내 컴퓨터에서 실행됩니다:

- **Codex** 채팅에서 감사 내용과 실행 시점을 설명하고, 실행할 때마다 새 채팅을 시작하라고 알려 주세요. 결과는 **Scheduled**에 쌓입니다.
- 프롬프트에서는 각 명령어 이름 앞에 `$` 기호를 붙이세요(예: `$lagune:lagune-detect` 명령어). 그래야 실행할 때 명령어를 명시적으로 호출합니다.
- 새 워크트리 대신 로컬 프로젝트를 선택하세요. 새 워크트리는 [프로젝트에 설치한](https://lagune.ai/ko-KR/docs/install/codex) 엔진 없이 시작됩니다.
- 작업은 앱이 열려 있고, 컴퓨터가 켜져 있고, 프로젝트가 디스크에 있을 때만 실행됩니다.

**Cursor**의 Automations는 컴퓨터가 꺼져 있어도 클라우드에서 실행됩니다:

- 플러그인 대신 [범용 설치](https://lagune.ai/ko-KR/docs/install/universal) 방식으로 **Lagune**을 커밋하세요.
- [cursor.com/automations](https://cursor.com/automations) 페이지에서 자동화를 만들거나 에이전트 세션에서 `/automate` 명령어로 설명하고, 예약 트리거를 지정하세요.
- 예약 트리거는 저장소 없이 시작되므로, 저장소를 선택하세요.

**Antigravity**의 Automations는 내 컴퓨터에서 실행되며, 실행할 때마다 새 대화를 엽니다:

- **Automations** 탭을 **Antigravity** 앱에서 열고 프로젝트용 예약 자동화를 만들거나, 에이전트에게 설정해 달라고 요청하세요.
- 엔진의 도구를 승인해 줄 사람이 없으므로, [설치 페이지](https://lagune.ai/ko-KR/docs/install/antigravity-cli)에 나온 대로 엔진을 미리 허용하세요.
- `/schedule` 명령어는 해당 대화가 이어지는 동안만 유지되므로, 대신 자동화를 사용하세요.
- 자동화는 **Antigravity**가 실행 중일 때만 실행됩니다.

**OpenCode**에는 자체 스케줄러가 없으므로, 감사는 클라우드의 **GitHub Actions**에서 실행됩니다:

- [설치 페이지](https://lagune.ai/ko-KR/docs/install/opencode)에 나온 대로 저장소의 `opencode.json` 파일에 **Lagune**을 커밋하세요.
- `opencode github install` 명령어를 실행해 **OpenCode** GitHub 앱을 연결하고 모델 제공자의 키를 저장하세요.
- 예약에 따라 프롬프트를 **OpenCode**에 전달하는 워크플로를 추가하세요(여기서는 매주 월요일 09:00 UTC). `<KEY>` 자리와 `<provider>/<model>` 자리는 `opencode github install` 명령어가 만든 워크플로와 똑같이 채우고, `<your-prompt>` 자리에는 [프롬프트 예시](#prompt-examples) 중 하나를 넣으세요:

  ```yaml
  name: Lagune Audit

  on:
    schedule:
      - cron: '0 9 * * 1'

  jobs:
    audit:
      runs-on: ubuntu-latest
      permissions:
        id-token: write
        contents: read
      steps:
        - uses: actions/checkout@v6
          with:
            persist-credentials: false

        - uses: anomalyco/opencode/github@latest
          env:
            <KEY>: ${{ secrets.<KEY> }}
          with:
            model: <provider>/<model>
            prompt: |
              <your-prompt>
  ```

### 프롬프트 예시 \{#prompt-examples}

**💧 보고만 하기**

코드는 변경하지 않고, 새로운 위험을 파악하고 그 수정을 계획하며, 이미 적용한 보안 통제를 다시 점검합니다:

```md
다음 명령어를 하나씩 차례로 실행해 줘: `/lagune-detect`, `/lagune-plan`. 프로젝트에 강화 기록이 있으면 `/lagune-verify` 명령어도 실행해 줘.

프로젝트 코드는 변경하지 마. 마지막으로, 새 발견 사항과 더 이상 효과가 없는 적용된 보안 통제를 요약해 줘.
```

**🌊 전체 사이클**

계획한 수정까지 적용하고 각 수정이 실제로 효과가 있는지 증명하므로, 변경 사항이 메인 브랜치에 들어가기 전에 검토하세요:

```md
다음 명령어를 하나씩 차례로 실행해 줘: `/lagune-detect`, `/lagune-plan`, `/lagune-harden`, `/lagune-verify`.

마지막으로, 적용한 수정과 아직 해결되지 않은 발견 사항을 요약해 줘.
```
