# Hermes Agent에 Lagune 플러그인 설치하기

> Hermes Agent에 Lagune을 플러그인으로 설치하고 최신 상태로 유지하세요.

표준 URL: https://lagune.ai/ko-KR/docs/install/hermes-agent
언어: ko-KR
원문: https://lagune.ai/docs/install/hermes-agent
마지막 업데이트: 2026-11-04

터미널에서 플러그인을 설치하세요:

```bash
hermes plugins install wellwelwel/lagune --enable
```

- **Hermes Agent**가 자체 카탈로그에 없는 플러그인을 확인해 달라고 하면 **승인하세요**.
- 저장소의 **Node.js** 의존성 설치를 제안하면 **거절하세요**.

## 업데이트

**Lagune**을 업데이트하려면 다음 명령어를 실행하세요:

```bash
hermes plugins update lagune
```

## 명령어

명령어는 플러그인 이름을 붙여 입력하세요. 예를 들어 `/lagune:lagune-charter` 명령어를 입력하면 `/lagune-charter` 명령어가, `/lagune:lagune` 명령어를 입력하면 `/lagune` 명령어가 실행됩니다.

## 자주 묻는 질문

### Hermes Agent에 Lagune을 설치하려면 어떻게 하나요?

hermes plugins install wellwelwel/lagune --enable 명령어를 실행하세요. 확인을 요청하면 플러그인을 승인하고, 저장소의 Node.js 의존성 설치는 거절하세요.

### Hermes Agent에서 Lagune을 업데이트하려면 어떻게 하나요?

hermes plugins update lagune 명령어를 실행하세요.

### Hermes Agent에서 Lagune 명령어를 실행하려면 어떻게 하나요?

/lagune:lagune-charter 명령어와 /lagune:lagune 명령어처럼 플러그인 이름을 붙여 입력하세요.
