# 대시보드

> 명령어 하나로 열리는 로컬 실시간 뷰에서 프로젝트의 보안 원칙, 발견 사항, 카탈로그를 확인하세요.

표준 URL: https://lagune.ai/ko-KR/docs/get-started/dashboard
언어: ko-KR
원문: https://lagune.ai/docs/get-started/dashboard
마지막 업데이트: 2026-11-03

하위 명령어 없이 **Lagune**을 바로 실행하면 `.lagune/` 폴더를 인터랙티브한 실시간 뷰로 볼 수 있습니다. 임의의 포트에서 대시보드를 띄우고 엽니다:

```bash
npx lagune
```

- [x] **실시간 새로고침**
- [x] **비공개**이며 **로컬**에서 동작
- [x] 첫 보안 원칙부터 `.lagune/` 폴더에 담긴 모든 내용 표시
- [x] 브라우저에서 프로젝트의 카테고리를 직접 **관리**
- [x] `node_modules` 폴더도 `package.json` 파일도 필요 없음 📦

![Lagune 대시보드의 보안 원칙 화면](https://lagune.ai/img/dashboard/02.webp)

![Lagune 대시보드의 발견 사항 화면](https://lagune.ai/img/dashboard/03.webp)

![Lagune 대시보드의 사이드 퀘스트 화면](https://lagune.ai/img/dashboard/04.webp)

![Lagune 대시보드의 발견 사항 상세 화면](https://lagune.ai/img/dashboard/05.webp)

![Lagune 대시보드의 카탈로그 화면](https://lagune.ai/img/dashboard/06.webp)

**팁**

- 🚪 원하는 포트를 지정하려면 `--port` 옵션을 사용하세요.
- ⏏️ 중지하려면 `Ctrl+C` 키를 누르세요.

## 자주 묻는 질문

### Lagune 대시보드는 어떻게 여나요?

프로젝트 루트에서 하위 명령어 없이 npx lagune 명령어를 실행하세요. 임의의 포트에서 .lagune/ 폴더의 실시간 뷰를 띄우고 브라우저에서 엽니다.

### 대시보드는 비공개인가요?

네. 자신의 컴퓨터에서만 실행되며, 다른 컴퓨터에서는 접근할 수 없는 로컬 주소를 사용합니다.

### 대시보드에서 프로젝트를 변경할 수 있나요?

브라우저에서 카테고리만 변경할 수 있습니다. 대시보드에 표시되는 나머지는 모두 읽기 전용입니다.
