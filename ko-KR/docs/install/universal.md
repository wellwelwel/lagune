# skills.sh로 어떤 에이전트에든 Lagune 설치하기

> skills CLI로 어떤 AI 에이전트에든 Lagune을 설치하고 최신 상태로 유지하세요.

표준 URL: https://lagune.ai/ko-KR/docs/install/universal
언어: ko-KR
원문: https://lagune.ai/docs/install/universal
마지막 업데이트: 2026-11-05

**터미널**

[**skills.sh**](https://www.skills.sh/wellwelwel/lagune)로 터미널에서 **Lagune** 명령어를 설치하세요:

```bash
npx skills add wellwelwel/lagune
```

**프롬프트**

에이전트에 다음 프롬프트를 붙여 넣으세요:

```md
`npx --yes skills add wellwelwel/lagune` 명령어를 실행하고, 생성된 스킬 지침을 지금 바로 따라 줘. 필요하면 먼저 임시 파일로 리디렉션해서 출력 전체를 읽어 줘. 상대 경로는 출력에 표시된 지원 파일 디렉터리를 기준으로 해석해 줘.
```

## 업데이트

**터미널**

**Lagune**을 업데이트하려면 다음 명령어를 실행하세요:

```bash
npx skills update
```

**프롬프트**

**Lagune**을 업데이트하려면 에이전트에 다음 프롬프트를 붙여 넣으세요:

```md
`npx --yes skills update -y` 명령어를 실행하고, 필요하면 먼저 임시 파일로 리디렉션해서 출력 전체를 읽어 줘.
```

---

**에이전트마다 설치 방법은 하나만**

**Lagune**은 **skills.sh**와 **플러그인** 중 한 가지 방법으로만 설치하고, 둘을 함께 사용하지 마세요.

**권한**

명령어는 엔진을 `npx --yes lagune@0.18.0` 형태로 실행하며, 이를 미리 허용하는 규칙은 [에이전트별 설치 페이지](https://lagune.ai/ko-KR/docs)에서 안내합니다. 네트워크에 접근할 수 없는 샌드박스에서는 처음 한 번, 그리고 업데이트할 때마다 직접 터미널에서 프로젝트에 엔진을 설치하세요:

```bash
npm i -D lagune@0.18.0
```

## 자주 묻는 질문

### 어떤 AI 에이전트에든 Lagune을 설치하려면 어떻게 하나요?

프로젝트에서 npx skills add wellwelwel/lagune 명령어를 실행하거나, 설치 프롬프트를 에이전트에 붙여 넣으세요.

### skills CLI로 설치한 Lagune을 업데이트하려면 어떻게 하나요?

npx skills update 명령어를 실행하거나, 업데이트 프롬프트를 에이전트에 붙여 넣으세요.

### Lagune을 skills CLI와 플러그인으로 동시에 설치할 수 있나요?

아니요. 둘 다 설치하면 에이전트가 모든 명령어를 두 번씩 표시하거나, 한쪽만 사용하고 다른 쪽은 숨깁니다.
