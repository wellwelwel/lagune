# Gemini CLI에 Lagune 확장 프로그램 설치하기

> Gemini CLI에 Lagune을 확장 프로그램으로 설치하고, 최신 상태로 유지하며, 엔진 실행을 미리 허용하세요.

표준 URL: https://lagune.ai/ko-KR/docs/install/gemini-cli
언어: ko-KR
원문: https://lagune.ai/docs/install/gemini-cli
마지막 업데이트: 2026-11-04

터미널에서 확장 프로그램을 설치하세요:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## 업데이트

**Lagune**을 업데이트하려면 다음 명령어를 실행하세요:

```bash
gemini extensions update lagune
```

계속 최신 상태로 유지하려면 `--auto-update` 옵션을 붙여 설치하세요.

## 명령어

명령어는 확장 프로그램 이름을 붙여 입력하세요. 예를 들어 `/lagune:lagune-charter` 명령어를 입력하면 `/lagune-charter` 명령어가 실행됩니다.

---

**권한**

엔진은 두 도구를 통해 실행됩니다: `lagune_read` 도구는 프로젝트를 읽기만 하고, `lagune_write` 도구는 `.lagune/` 폴더에만 씁니다. **Gemini CLI**는 신뢰할 수 있는 폴더에서만 두 도구를 실행합니다. 두 도구를 미리 허용하려면 다음 규칙을 `~/.gemini/policies/lagune.toml` 파일로 저장하세요:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

**skills.sh**로 설치한 경우처럼 엔진이 **npx**를 통해 실행될 때는 같은 파일에 다음 규칙을 추가하세요:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## 자주 묻는 질문

### Gemini CLI에 Lagune을 설치하려면 어떻게 하나요?

gemini extensions install https://github.com/wellwelwel/lagune 명령어를 실행하세요.

### Gemini CLI에서 Lagune을 업데이트하려면 어떻게 하나요?

gemini extensions update lagune 명령어를 실행하거나, --auto-update 옵션을 붙여 확장 프로그램을 설치하세요.

### Gemini CLI에서 Lagune 명령어를 실행하려면 어떻게 하나요?

/lagune:lagune-charter 명령어처럼 확장 프로그램 이름을 붙여 입력하세요.

### Gemini CLI가 권한 요청 없이 Lagune을 실행할 수 있나요?

네. lagune 서버의 lagune_read 도구와 lagune_write 도구를 허용하는 정책 규칙을 추가하고, 엔진이 npx를 통해 실행될 때는 run_shell_command 도구에서 npx --yes lagune@ 뒤에 버전이 붙은 명령어를 허용하는 규칙도 추가하세요.
