# Claude Code에 Lagune 플러그인 설치하기

> 터미널, 확장 프로그램 또는 데스크톱 앱의 Claude Code에 Lagune을 플러그인으로 설치하고, 최신 상태로 유지하며, 엔진 실행을 미리 허용하세요.

표준 URL: https://lagune.ai/ko-KR/docs/install/claude-code
언어: ko-KR
원문: https://lagune.ai/docs/install/claude-code
마지막 업데이트: 2026-11-03

**터미널**

터미널에서 플러그인을 설치하세요:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

또는 **Claude Code** 세션에서 설치하세요:

```text
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**확장 프로그램**

- `/plugin` 명령어를 입력하고 **Manage plugins**를 선택하세요.
- **Marketplaces** 탭에서 `wellwelwel/lagune` 마켓플레이스를 추가하세요.
- **Plugins** 탭에서 `lagune` 플러그인을 설치하세요.

**데스크톱**

- 터미널이나 확장 프로그램에서 **Lagune**을 설치하세요. 확장 프로그램에서는 **Install for you**를 선택하세요.
- 데스크톱 앱에서 새 세션을 시작하세요. 데스크톱 앱은 개인용으로 설치한 플러그인을 불러옵니다.

## 업데이트

**터미널**

**Lagune**을 업데이트하려면 다음 명령어를 실행하세요:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

계속 최신 상태로 유지하려면 `lagune` 마켓플레이스의 **Enable auto-update** 옵션을 `/plugin` 메뉴에서 선택하세요.

**확장 프로그램**

- `/plugin` 명령어를 입력하고 **Manage plugins**를 선택하세요.
- **Marketplaces** 탭을 여세요.
- `lagune` 마켓플레이스의 새로고침 아이콘을 선택하세요.

**데스크톱**

- 터미널이나 확장 프로그램에서 **Lagune**을 업데이트하세요.
- 데스크톱 앱에서 새 세션을 시작하세요.

## 명령어

명령어는 `/lagune-charter` 명령어처럼 이름 그대로 입력하거나, `/lagune:lagune-charter` 명령어처럼 플러그인 이름을 붙여 입력하세요.

---

**권한**

엔진은 두 도구를 통해 실행됩니다: `lagune_read` 도구는 프로젝트를 읽기만 하고, `lagune_write` 도구는 `.lagune/` 폴더에만 씁니다. 두 도구를 미리 허용하려면 한 프로젝트에만 적용할 때는 `.claude/settings.json` 파일에, 모든 프로젝트에 적용할 때는 `~/.claude/settings.json` 파일에 다음 규칙을 추가하세요:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

**skills.sh**로 설치한 경우처럼 엔진이 **npx**를 통해 실행될 때는 `Bash(npx --yes lagune@*)` 규칙을 허용하세요. 샌드박스를 켰다면 `registry.npmjs.org` 도메인도 `sandbox.network.allowedDomains` 목록에 추가하세요.

## 자주 묻는 질문

### Claude Code에 Lagune을 설치하려면 어떻게 하나요?

claude plugin install lagune --marketplace wellwelwel/lagune 명령어를 실행하세요. 세션이나 확장 프로그램에서는 플러그인 관리자에서 wellwelwel/lagune 마켓플레이스를 추가하고 lagune 플러그인을 설치하세요. 터미널이나 확장 프로그램에서 개인용으로 설치하면 데스크톱 앱도 플러그인을 불러옵니다.

### Claude Code에서 Lagune을 업데이트하려면 어떻게 하나요?

claude plugin marketplace update lagune 명령어에 이어 claude plugin update lagune@lagune 명령어를 실행하거나, /plugin 메뉴에서 lagune 마켓플레이스의 Enable auto-update 옵션을 선택하세요. 확장 프로그램에서는 /plugin 명령어로 Manage plugins를 열고 lagune 마켓플레이스의 새로고침 아이콘을 선택하세요. 데스크톱 앱은 다음 세션에서 업데이트를 불러옵니다.

### Claude Code에서 Lagune 명령어를 실행하려면 어떻게 하나요?

/lagune-charter 명령어처럼 이름 그대로 입력하거나, /lagune:lagune-charter 명령어처럼 플러그인 이름을 붙여 입력하세요.

### Claude Code가 권한 요청 없이 Lagune을 실행할 수 있나요?

네. Claude Code 설정에서 mcp__plugin_lagune_lagune__lagune_read 규칙과 mcp__plugin_lagune_lagune__lagune_write 규칙을 허용하고, 엔진이 npx를 통해 실행될 때는 Bash(npx --yes lagune@*) 규칙도 허용하세요.
