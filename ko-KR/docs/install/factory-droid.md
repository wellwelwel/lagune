# Factory Droid에 Lagune 플러그인 설치하기

> Factory Droid에 Lagune을 플러그인으로 설치하고, 최신 상태로 유지하며, 엔진 도구를 허용하세요.

표준 URL: https://lagune.ai/ko-KR/docs/install/factory-droid
언어: ko-KR
원문: https://lagune.ai/docs/install/factory-droid
마지막 업데이트: 2026-11-03

터미널에서 플러그인을 설치하세요:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## 업데이트

**Lagune**을 업데이트하려면 다음 명령어를 실행하세요:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## 명령어

명령어는 `/lagune-charter` 명령어처럼 이름 그대로 입력하세요.

---

**권한**

엔진은 두 도구를 통해 실행됩니다: `lagune_read` 도구는 프로젝트를 읽기만 하고, `lagune_write` 도구는 `.lagune/` 폴더에만 씁니다. **Factory Droid**가 권한을 요청하면 각 도구를 항상 허용하도록 선택하세요. `lagune` 마켓플레이스의 새 커밋을 동기화한 뒤에는 다시 요청하며, 이 동기화는 **Factory Droid**가 시작할 때 일어날 수 있습니다.

## 자주 묻는 질문

### Factory Droid에 Lagune을 설치하려면 어떻게 하나요?

droid plugin marketplace add wellwelwel/lagune 명령어에 이어 droid plugin install lagune@lagune 명령어를 실행하세요.

### Factory Droid에서 Lagune을 업데이트하려면 어떻게 하나요?

droid plugin marketplace update lagune 명령어에 이어 droid plugin update lagune@lagune 명령어를 실행하세요.

### Factory Droid에서 Lagune 명령어를 실행하려면 어떻게 하나요?

/lagune-charter 명령어처럼 이름 그대로 입력하세요.

### Factory Droid가 권한 요청 없이 Lagune을 실행할 수 있나요?

네. Factory Droid가 권한을 요청하면 lagune_read 도구와 lagune_write 도구를 항상 허용하도록 선택하세요. lagune 마켓플레이스의 새 커밋을 동기화한 뒤에는 다시 요청합니다.
