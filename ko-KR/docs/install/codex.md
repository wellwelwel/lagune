# Codex CLI에 Lagune 플러그인 설치하기

> Codex CLI에 Lagune을 플러그인으로 설치하고, 최신 상태로 유지하며, 샌드박스 안에서 엔진을 실행하세요.

표준 URL: https://lagune.ai/ko-KR/docs/install/codex
언어: ko-KR
원문: https://lagune.ai/docs/install/codex
마지막 업데이트: 2026-11-03

터미널에서 플러그인을 설치하세요:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## 업데이트

**Lagune**을 업데이트하려면 다음 명령어를 실행하세요:

```bash
codex plugin marketplace upgrade lagune
```

## 명령어

`$` 기호에 이어 플러그인 이름을 붙인 명령어를 입력하고, 그 뒤에 입력 내용을 덧붙이세요. 예를 들어 `$lagune:lagune-charter` 명령어를 입력하면 `/lagune-charter` 명령어가 실행됩니다. `$` 기호를 입력하면 명령어 목록이 나타나고, 하나를 고르면 전체 이름이 입력됩니다.

---

**권한**

**Codex**의 샌드박스는 네트워크에 접근할 수 없습니다. 처음 한 번, 그리고 업데이트할 때마다 직접 터미널에서 프로젝트에 엔진을 설치하세요:

```bash
npm i -D lagune@0.16.0
```

## 자주 묻는 질문

### Codex CLI에 Lagune을 설치하려면 어떻게 하나요?

codex plugin marketplace add wellwelwel/lagune 명령어에 이어 codex plugin add lagune@lagune 명령어를 실행하세요.

### Codex CLI에서 Lagune을 업데이트하려면 어떻게 하나요?

codex plugin marketplace upgrade lagune 명령어를 실행하세요.

### Codex CLI에서 Lagune 명령어를 실행하려면 어떻게 하나요?

$lagune:lagune-charter 명령어처럼 $ 기호에 이어 플러그인 이름을 붙인 명령어를 입력하고, 그 뒤에 입력 내용을 덧붙이세요.

### Codex 샌드박스 안에서도 Lagune이 작동하나요?

네. 처음 한 번, 그리고 업데이트할 때마다 직접 터미널에서 npm i -D lagune@0.16.0 명령어로 프로젝트에 엔진을 설치하면 작동합니다.
