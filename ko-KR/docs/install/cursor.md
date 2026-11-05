# Cursor에 Lagune 플러그인 설치하기

> Cursor와 Cursor CLI에 Lagune을 플러그인으로 설치하고, 최신 상태로 유지하며, 엔진 실행을 미리 허용하세요.

표준 URL: https://lagune.ai/ko-KR/docs/install/cursor
언어: ko-KR
원문: https://lagune.ai/docs/install/cursor
마지막 업데이트: 2026-11-05

**Cursor**

- **Customize**를 여세요.
- **From GitHub Repository**를 선택하고 `https://github.com/wellwelwel/lagune` 주소를 입력하세요.
- **Lagune**의 **Install**을 선택하고 프로젝트 범위나 사용자 범위를 고르세요.

**Cursor CLI**

- 터미널에서 마켓플레이스를 추가하세요:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- `/plugins` 명령어를 `agent` 세션에서 입력하세요.
- **Lagune**을 설치하세요.

**Claude Code**에 **Lagune**이 이미 설치되어 있다면 **Cursor CLI**가 그곳에서 불러옵니다.

## 업데이트

**Cursor**

- **Customize**를 여세요.
- `lagune` 마켓플레이스의 **Refresh**를 선택하세요.

**Cursor CLI**

- 터미널에서 마켓플레이스를 교체하세요:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- `/plugins` 명령어를 `agent` 세션에서 입력하세요.
- **Lagune**을 다시 설치하세요.

## 명령어

명령어는 `/lagune-charter` 명령어처럼 이름 그대로 입력하세요.

---

**권한**

**Cursor**에서는 명령어가 **npx**를 통해 엔진을 실행하며, 기본 Auto-review 모드가 이를 확인 없이 허용합니다.

**Cursor CLI**에서는 엔진이 두 도구를 통해 실행됩니다: `lagune_read` 도구는 프로젝트를 읽기만 하고, `lagune_write` 도구는 `.lagune/` 폴더에만 씁니다. 두 도구를 미리 허용하려면 한 프로젝트에만 적용할 때는 `.cursor/cli.json` 파일에, 모든 프로젝트에 적용할 때는 `~/.cursor/cli-config.json` 파일에 다음 규칙을 추가하세요:

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

**skills.sh**로 설치한 경우처럼 엔진이 **npx**를 통해 실행될 때는 `Shell(npx:--yes lagune@*)` 규칙을 허용하세요.

## 자주 묻는 질문

### Cursor에 Lagune을 설치하려면 어떻게 하나요?

Cursor에서는 Customize를 열고 From GitHub Repository를 선택한 다음, https://github.com/wellwelwel/lagune 주소를 입력하고 Lagune을 설치하세요. Cursor CLI에서는 agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor 명령어를 실행한 다음 /plugins 메뉴에서 Lagune을 설치하세요.

### Cursor에서 Lagune을 업데이트하려면 어떻게 하나요?

Cursor에서는 Customize에서 lagune 마켓플레이스의 Refresh를 선택하세요. Cursor CLI에서는 lagune 마켓플레이스를 제거했다가 다시 추가한 다음, /plugins 메뉴에서 Lagune을 다시 설치하세요.

### Cursor에서 Lagune 명령어를 실행하려면 어떻게 하나요?

/lagune-charter 명령어처럼 이름 그대로 입력하세요.

### Cursor가 권한 요청 없이 Lagune을 실행할 수 있나요?

네. Cursor의 기본 Auto-review 모드가 이미 허용합니다. Cursor CLI에서는 Mcp(plugin-lagune-lagune:lagune_read) 규칙과 Mcp(plugin-lagune-lagune:lagune_write) 규칙을 허용하고, 엔진이 npx를 통해 실행될 때는 Shell(npx:--yes lagune@*) 규칙도 허용하세요.
