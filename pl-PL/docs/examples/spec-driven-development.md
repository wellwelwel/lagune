# Spec-Driven Development: Zabezpiecz to, co buduje twoja specyfikacja

> Połącz Lagune z Superpowers, Spec Kit lub OpenSpec: ustal zasady bezpieczeństwa na podstawie specyfikacji, a potem wdrażaj ją z /lagune, aby każde zadanie było utwardzane już w trakcie pisania kodu.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/examples/spec-driven-development
Język: pl-PL
Oryginał: https://lagune.ai/docs/examples/spec-driven-development
Ostatnia aktualizacja: 2026-11-09

Połącz **Lagune** z narzędziem do Spec-Driven Development, takim jak [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit) lub [**OpenSpec**](https://github.com/Fission-AI/OpenSpec): twoje narzędzie decyduje, co zbudować, a **Lagune** decyduje, jak to zabezpieczyć.

## Jak to współgra

**Lagune** włącza się w przepływ pracy twojego narzędzia w dwóch miejscach, a resztę zostawia bez zmian:

1. Gdy twoje narzędzie zapisze specyfikację, polecenie [`/lagune-charter`](https://lagune.ai/pl-PL/docs/commands/charter) ją czyta i ustala zasady bezpieczeństwa, których wymaga dana funkcja, zanim powstanie jakikolwiek kod.
2. Polecenie [`/lagune`](https://lagune.ai/pl-PL/docs/commands/lagune), którym oznaczysz polecenie implementacji swojego narzędzia, utwardza każde zadanie zgodnie z tymi zasadami już w trakcie pisania kodu.

**Wskazówka**

W każdym przykładzie zastąp ścieżkę do specyfikacji plikiem, który zapisało twoje narzędzie. Jeśli projekt ma już zasady bezpieczeństwa, ten sam krok uzupełnia je o to, czego wymaga nowa funkcja.

## Przykładowe prompty

Wysyłaj prompty po kolei, każdy dopiero wtedy, gdy poprzedni się zakończy.

```prompt
/superpowers:brainstorming Zakupy bez zakładania konta z płatnością kartą.
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
/speckit.specify Zakupy bez zakładania konta z płatnością kartą.
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
