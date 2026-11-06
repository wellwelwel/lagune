# GitHub Copilot CLI에 Lagune 플러그인 설치하기

> GitHub Copilot CLI에 Lagune을 플러그인으로 설치하고 최신 상태로 유지하세요.

표준 URL: https://lagune.ai/ko-KR/docs/install/github-copilot-cli
언어: ko-KR
원문: https://lagune.ai/docs/install/github-copilot-cli
마지막 업데이트: 2026-11-03

터미널에서 플러그인을 설치하세요:

```bash
copilot plugin marketplace add wellwelwel/lagune
copilot plugin install lagune@lagune
```

에디터에서는 [**skills.sh**](https://lagune.ai/ko-KR/docs/install/universal)로 **GitHub Copilot**용 **Lagune**을 설치하세요.

## 업데이트

**Lagune**을 업데이트하려면 다음 명령어를 실행하세요:

```bash
copilot plugin marketplace update lagune
copilot plugin update lagune@lagune
```

## 명령어

명령어는 `/lagune-charter` 명령어처럼 이름 그대로 입력하세요.

## 자주 묻는 질문

### GitHub Copilot CLI에 Lagune을 설치하려면 어떻게 하나요?

copilot plugin marketplace add wellwelwel/lagune 명령어에 이어 copilot plugin install lagune@lagune 명령어를 실행하세요.

### GitHub Copilot CLI에서 Lagune을 업데이트하려면 어떻게 하나요?

copilot plugin marketplace update lagune 명령어에 이어 copilot plugin update lagune@lagune 명령어를 실행하세요.

### GitHub Copilot CLI에서 Lagune 명령어를 실행하려면 어떻게 하나요?

/lagune-charter 명령어처럼 이름 그대로 입력하세요.

### VS Code의 GitHub Copilot에서도 Lagune을 사용할 수 있나요?

네. VS Code나 다른 에디터에서는 플러그인 대신 skills.sh로 Lagune을 설치하세요.
