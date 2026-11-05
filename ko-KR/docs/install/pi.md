# Pi에 Lagune 패키지 설치하기

> Pi에 Lagune을 npm 또는 GitHub에서 패키지로 설치하고 최신 상태로 유지하세요.

표준 URL: https://lagune.ai/ko-KR/docs/install/pi
언어: ko-KR
원문: https://lagune.ai/docs/install/pi
마지막 업데이트: 2026-11-05

**npm**

터미널에서 패키지를 설치하세요:

```bash
pi install npm:lagune
```

**GitHub**

**GitHub**에서 최신 커밋을 설치하세요. 이렇게 설치하면 엔진이 **npx**를 통해 실행됩니다:

```bash
pi install git:github.com/wellwelwel/lagune
```

## 업데이트

**npm**

**Lagune**을 업데이트하려면 다음 명령어를 실행하세요:

```bash
pi update npm:lagune
```

**GitHub**

**Lagune**을 업데이트하려면 다음 명령어를 실행하세요:

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` 명령어는 설치한 모든 패키지를 업데이트하고, `pi update` 명령어만 실행하면 **Pi**만 업데이트됩니다.

## 명령어

명령어는 `skill:` 접두사를 붙여 입력하세요. 예를 들어 `/skill:lagune-charter` 명령어를 입력하면 `/lagune-charter` 명령어가 실행됩니다.

## 자주 묻는 질문

### Pi에 Lagune을 설치하려면 어떻게 하나요?

pi install npm:lagune 명령어를 실행하거나, GitHub의 최신 커밋을 설치하려면 pi install git:github.com/wellwelwel/lagune 명령어를 실행하세요.

### Pi에서 Lagune을 업데이트하려면 어떻게 하나요?

pi update npm:lagune 명령어를 실행하거나, GitHub에서 설치했다면 pi update git:github.com/wellwelwel/lagune 명령어를 실행하세요. pi update --extensions 명령어는 설치한 모든 패키지를 업데이트합니다.

### Pi에서 Lagune 명령어를 실행하려면 어떻게 하나요?

/skill:lagune-charter 명령어처럼 skill: 접두사를 붙여 입력하세요.
