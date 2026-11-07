# OpenCode에 Lagune 플러그인 설치하기

> OpenCode 1.x와 2.x에 Lagune을 플러그인으로 설치하고 최신 상태로 유지하세요.

표준 URL: https://lagune.ai/ko-KR/docs/install/opencode
언어: ko-KR
원문: https://lagune.ai/docs/install/opencode
마지막 업데이트: 2026-11-07

**OpenCode 2.x**

터미널에서 플러그인을 설치하세요:

```bash
opencode plugin add lagune
```

또는 `plugins` 목록(`opencode.json` 파일)에 추가하세요:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

터미널에서 프로젝트에 플러그인을 설치하거나, `-g` 옵션을 붙여 모든 프로젝트에 설치하세요:

```bash
opencode plugin lagune
```

또는 `plugin` 목록(`opencode.json` 파일)에 추가하세요:

```json
{
  "plugin": ["lagune"]
}
```

## 업데이트

**OpenCode 2.x**

**Lagune**을 업데이트하려면 다음 명령어를 실행하세요:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

**Lagune**을 업데이트하려면 기존 릴리스 위에 새 릴리스를 덮어 설치하되, 모든 프로젝트에 설치했다면 `-g` 옵션을 붙이세요:

```bash
opencode plugin lagune@0.18.1 --force
```

## 명령어

**OpenCode 2.x**

`@` 기호를 입력하고 `@lagune-charter` 명령어처럼 실행할 명령어를 고른 다음, 같은 메시지에 입력 내용을 이어서 작성하세요.

**OpenCode 1.x**

명령어는 `/lagune-charter` 명령어처럼 이름 그대로 입력하세요. 명령어는 `/skills` 목록에 표시되며, `/` 메뉴에는 표시되지 않습니다.

## 자주 묻는 질문

### OpenCode에 Lagune을 설치하려면 어떻게 하나요?

OpenCode 2.x에서는 opencode plugin add lagune 명령어를 실행하세요. OpenCode 1.x에서는 opencode plugin lagune 명령어를 실행하고, 모든 프로젝트에 설치하려면 -g 옵션을 붙이세요.

### OpenCode에서 Lagune을 업데이트하려면 어떻게 하나요?

OpenCode 2.x에서는 opencode plugin update lagune 명령어에 이어 opencode reload 명령어를 실행하세요. OpenCode 1.x에서는 opencode plugin lagune@0.18.1 --force 명령어를 실행하세요.

### OpenCode에서 Lagune 명령어를 실행하려면 어떻게 하나요?

OpenCode 2.x에서는 @ 기호를 입력하고 @lagune-charter 명령어처럼 실행할 명령어를 고른 다음, 같은 메시지에 입력 내용을 이어서 작성하세요. OpenCode 1.x에서는 /lagune-charter 명령어처럼 이름 그대로 입력하거나, /skills 목록에서 찾으세요.

### OpenCode는 Lagune이 실행되기 전에 권한을 요청하나요?

아니요. OpenCode는 엔진의 두 도구인 lagune_read 도구와 lagune_write 도구를 권한 요청 없이 실행합니다.
