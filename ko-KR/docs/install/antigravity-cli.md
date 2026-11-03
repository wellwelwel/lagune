# Antigravity CLI에 Lagune 플러그인 설치하기

> Antigravity CLI에 Lagune을 플러그인으로 설치하고, 최신 상태로 유지하며, 엔진 실행을 미리 허용하세요.

표준 URL: https://lagune.ai/ko-KR/docs/install/antigravity-cli
언어: ko-KR
원문: https://lagune.ai/docs/install/antigravity-cli
마지막 업데이트: 2026-11-03

터미널에서 플러그인을 설치하세요:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## 업데이트

**Lagune**을 업데이트하려면 다시 설치하세요:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## 명령어

명령어는 플러그인 이름을 붙여 입력하세요. 예를 들어 `/lagune:lagune-charter` 명령어를 입력하면 `/lagune-charter` 명령어가 실행됩니다.

---

**권한**

엔진은 두 도구를 통해 실행됩니다: `lagune_read` 도구는 프로젝트를 읽기만 하고, `lagune_write` 도구는 `.lagune/` 폴더에만 씁니다. 세션의 첫 메시지로 보낸 명령어는 두 도구를 불러오기 전에 실행되므로 대신 **npx**를 사용합니다. 두 도구와 **npx**를 미리 허용하려면 `~/.gemini/antigravity-cli/settings.json` 파일에 다음 규칙을 추가하세요:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## 자주 묻는 질문

### Antigravity CLI에 Lagune을 설치하려면 어떻게 하나요?

agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity 명령어를 실행하세요.

### Antigravity CLI에서 Lagune을 업데이트하려면 어떻게 하나요?

agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity 명령어를 다시 실행하세요.

### Antigravity CLI에서 Lagune 명령어를 실행하려면 어떻게 하나요?

/lagune:lagune-charter 명령어처럼 플러그인 이름을 붙여 입력하세요.

### Antigravity CLI가 권한 요청 없이 Lagune을 실행할 수 있나요?

네. Antigravity CLI 설정에서 mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write), command(regex:npx --yes lagune@[0-9.]+) 규칙을 허용하세요. npx 규칙은 세션의 첫 메시지로 보낸 명령어에 적용됩니다.
