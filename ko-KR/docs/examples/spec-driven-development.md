# Spec-Driven Development: 명세로 만드는 기능을 안전하게 지키기

> Lagune을 Superpowers, Spec Kit, OpenSpec과 함께 사용하세요. 명세를 바탕으로 보안 원칙을 정한 뒤 /lagune 명령어로 구현하면, 코드를 작성하는 동안 모든 작업의 보안이 강화됩니다.

표준 URL: https://lagune.ai/ko-KR/docs/examples/spec-driven-development
언어: ko-KR
원문: https://lagune.ai/docs/examples/spec-driven-development
마지막 업데이트: 2026-11-09

**Lagune**을 [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit), [**OpenSpec**](https://github.com/Fission-AI/OpenSpec) 같은 Spec-Driven Development 도구와 함께 사용하세요. 무엇을 만들지는 사용하는 도구가 정하고, 만든 결과물을 어떻게 안전하게 지킬지는 **Lagune**이 정합니다.

## 흐름에 맞물리는 방식

**Lagune**은 사용하는 도구의 흐름 중 두 지점에만 참여하고, 나머지는 그대로 둡니다:

1. 도구가 명세를 작성하면, 코드가 생기기 전에 [`/lagune-charter`](https://lagune.ai/ko-KR/docs/commands/charter) 명령어가 그 명세를 읽고 기능에 필요한 보안 원칙을 정합니다.
2. 도구의 구현 명령어에 [`/lagune`](https://lagune.ai/ko-KR/docs/commands/lagune) 명령어를 붙이면, 코드를 작성하는 동안 그 보안 원칙에 따라 작업마다 보안을 강화합니다.

**팁**

각 예시의 명세 경로를 사용하는 도구가 작성한 파일로 바꾸세요. 프로젝트에 이미 보안 원칙이 있다면, 같은 단계에서 새 기능에 필요한 내용을 반영해 보안 원칙을 갱신합니다.

## 프롬프트 예시

프롬프트를 순서대로 보내되, 이전 프롬프트가 끝난 뒤에 다음 프롬프트를 보내세요.

```prompt
/superpowers:brainstorming 카드 결제를 지원하는 비회원 주문.
```

```prompt
/lagune-charter docs/superpowers/specs/2026-11-09-guest-checkout-design.md
```

```prompt
/superpowers:writing-plans
```

```prompt
/superpowers:executing-plans /lagune
```

```prompt
/speckit.specify 카드 결제를 지원하는 비회원 주문.
```

```prompt
/lagune-charter specs/001-guest-checkout/spec.md
```

```prompt
/speckit.plan
```

```prompt
/speckit.tasks
```

```prompt
/speckit.implement /lagune
```

```prompt
/opsx:propose add-guest-checkout
```

```prompt
/lagune-charter openspec/changes/add-guest-checkout/proposal.md
```

```prompt
/opsx:apply /lagune
```

```prompt
/opsx:archive
```
