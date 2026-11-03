# Grok Build에 Lagune 플러그인 설치하기

> Grok Build에 Lagune을 플러그인으로 설치하고, 최신 상태로 유지하며, 엔진 실행을 미리 허용하세요.

표준 URL: https://lagune.ai/ko-KR/docs/install/grok-build
언어: ko-KR
원문: https://lagune.ai/docs/install/grok-build
마지막 업데이트: 2026-11-03

터미널에서 플러그인을 설치하세요:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## 업데이트

**Lagune**을 업데이트하려면 다음 명령어를 실행하세요:

```bash
grok plugin update lagune
```

## 명령어

명령어는 `/lagune-charter` 명령어처럼 이름 그대로 입력하거나, `/lagune:lagune-charter` 명령어처럼 플러그인 이름을 붙여 입력하세요.

---

**권한**

엔진은 두 도구를 통해 실행됩니다: `lagune_read` 도구는 프로젝트를 읽기만 하고, `lagune_write` 도구는 `.lagune/` 폴더에만 씁니다. 두 도구를 미리 허용하려면 `~/.grok/config.toml` 파일에 다음 규칙을 추가하세요:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

**skills.sh**로 설치한 경우처럼 엔진이 **npx**를 통해 실행될 때는 `Bash(npx --yes lagune@*)` 규칙을 허용하세요.

## 자주 묻는 질문

### Grok Build에 Lagune을 설치하려면 어떻게 하나요?

grok plugin install wellwelwel/lagune@plugin-grok --trust 명령어를 실행하세요.

### Grok Build에서 Lagune을 업데이트하려면 어떻게 하나요?

grok plugin update lagune 명령어를 실행하세요.

### Grok Build에서 Lagune 명령어를 실행하려면 어떻게 하나요?

/lagune-charter 명령어처럼 이름 그대로 입력하거나, /lagune:lagune-charter 명령어처럼 플러그인 이름을 붙여 입력하세요.

### Grok Build가 권한 요청 없이 Lagune을 실행할 수 있나요?

네. Grok Build 설정에서 MCPTool(lagune__lagune_read) 규칙과 MCPTool(lagune__lagune_write) 규칙을 허용하고, 엔진이 npx를 통해 실행될 때는 Bash(npx --yes lagune@*) 규칙도 허용하세요.
