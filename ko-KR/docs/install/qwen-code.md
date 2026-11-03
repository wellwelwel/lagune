# Qwen Code에 Lagune 확장 프로그램 설치하기

> Qwen Code에 Lagune을 확장 프로그램으로 설치하고, 최신 상태로 유지하며, 엔진 실행을 미리 허용하세요.

표준 URL: https://lagune.ai/ko-KR/docs/install/qwen-code
언어: ko-KR
원문: https://lagune.ai/docs/install/qwen-code
마지막 업데이트: 2026-11-03

터미널에서 확장 프로그램을 설치하세요:

```bash
qwen extensions install lagune
```

## 업데이트

**Lagune**을 업데이트하려면 다음 명령어를 실행하세요:

```bash
qwen extensions update lagune
```

계속 최신 상태로 유지하려면 `--auto-update` 옵션을 붙여 설치하세요.

## 명령어

명령어는 확장 프로그램 이름을 붙여 입력하세요. 예를 들어 `/lagune:lagune-charter` 명령어를 입력하면 `/lagune-charter` 명령어가 실행됩니다.

---

**권한**

엔진은 두 도구를 통해 실행됩니다: `lagune_read` 도구는 프로젝트를 읽기만 하고, `lagune_write` 도구는 `.lagune/` 폴더에만 씁니다. 두 도구를 미리 허용하려면 한 프로젝트에만 적용할 때는 `.qwen/settings.json` 파일에, 모든 프로젝트에 적용할 때는 `~/.qwen/settings.json` 파일에 다음 규칙을 추가하세요:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

**skills.sh**로 설치한 경우처럼 엔진이 **npx**를 통해 실행될 때는 `Shell(npx --yes lagune@*)` 규칙을 허용하세요.

## 자주 묻는 질문

### Qwen Code에 Lagune을 설치하려면 어떻게 하나요?

qwen extensions install lagune 명령어를 실행하세요.

### Qwen Code에서 Lagune을 업데이트하려면 어떻게 하나요?

qwen extensions update lagune 명령어를 실행하거나, --auto-update 옵션을 붙여 확장 프로그램을 설치하세요.

### Qwen Code에서 Lagune 명령어를 실행하려면 어떻게 하나요?

/lagune:lagune-charter 명령어처럼 확장 프로그램 이름을 붙여 입력하세요.

### Qwen Code가 권한 요청 없이 Lagune을 실행할 수 있나요?

네. Qwen Code 설정에서 mcp__lagune__lagune_read 규칙과 mcp__lagune__lagune_write 규칙을 허용하고, 엔진이 npx를 통해 실행될 때는 Shell(npx --yes lagune@*) 규칙도 허용하세요.
