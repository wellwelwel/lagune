# Muse Code에 Lagune 플러그인 설치하기

> Muse Code에 Lagune을 플러그인으로 설치하고, 최신 상태로 유지하며, 샌드박스 안에서 엔진을 실행하세요.

표준 URL: https://lagune.ai/ko-KR/docs/install/muse-code
언어: ko-KR
원문: https://lagune.ai/docs/install/muse-code
마지막 업데이트: 2026-11-03

터미널에서 플러그인을 설치하세요:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## 업데이트

**Lagune**을 업데이트하려면 마켓플레이스를 새로 고친 다음 플러그인을 다시 설치하세요:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## 명령어

명령어는 `/lagune-charter` 명령어처럼 이름 그대로 입력하거나, `/lagune:lagune-charter` 명령어처럼 플러그인 이름을 붙여 입력하세요.

---

**권한**

**Muse Code**의 샌드박스는 엔진을 다운로드할 수 없습니다. 처음 한 번, 그리고 업데이트할 때마다 직접 터미널에서 프로젝트에 엔진을 설치하세요:

```bash
npm i -D lagune@0.16.0
```

## 자주 묻는 질문

### Muse Code에 Lagune을 설치하려면 어떻게 하나요?

muse plugins marketplace add lagune wellwelwel/lagune 명령어에 이어 muse plugins install lagune@lagune 명령어를 실행하세요.

### Muse Code에서 Lagune을 업데이트하려면 어떻게 하나요?

muse plugins marketplace update lagune 명령어를 실행한 다음 muse plugins remove lagune 명령어와 muse plugins install lagune@lagune 명령어로 다시 설치하세요.

### Muse Code에서 Lagune 명령어를 실행하려면 어떻게 하나요?

/lagune-charter 명령어처럼 이름 그대로 입력하거나, /lagune:lagune-charter 명령어처럼 플러그인 이름을 붙여 입력하세요.

### Muse Code 샌드박스 안에서도 Lagune이 작동하나요?

네. 처음 한 번, 그리고 업데이트할 때마다 직접 터미널에서 npm i -D lagune@0.16.0 명령어로 프로젝트에 엔진을 설치하면 작동합니다.
