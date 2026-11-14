# Instalacja poleceń Lagune w dowolnym agencie przez skills.sh lub GitHub CLI

> Zainstaluj polecenia Lagune w dowolnym agencie AI za pomocą CLI skills lub GitHub CLI i aktualizuj je.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/install/universal
Język: pl-PL
Oryginał: https://lagune.ai/docs/install/universal
Ostatnia aktualizacja: 2026-11-09

**skills.sh**

Zainstaluj polecenia **Lagune** w swoim projekcie z terminala za pomocą [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune -y
```

Albo wklej ten prompt swojemu agentowi:

```md
Uruchom `npx --yes skills add wellwelwel/lagune --yes` i od razu wykonaj wygenerowane instrukcje skilla. Przeczytaj cały wynik polecenia, w razie potrzeby najpierw przekierowując go do pliku tymczasowego. Ścieżki względne rozwiązuj od folderu z plikami pomocniczymi wskazanego w tym wyniku.
```

**GitHub CLI**

Zainstaluj polecenia **Lagune** w swoim projekcie z terminala za pomocą [**GitHub CLI**](https://cli.github.com/) w wersji 2.90.0 lub nowszej:

```bash
gh skill install wellwelwel/lagune --all --scope project
```

Albo wklej ten prompt swojemu agentowi:

```md
Uruchom `gh skill install wellwelwel/lagune --all --scope project` i przeczytaj cały wynik polecenia, w razie potrzeby najpierw przekierowując go do pliku tymczasowego.
```

## Aktualizacja

**skills.sh**

Aby zaktualizować polecenia **Lagune**, uruchom:

```bash
npx skills update
```

Albo wklej ten prompt swojemu agentowi:

```md
Uruchom `npx --yes skills update -y` i przeczytaj cały wynik polecenia, w razie potrzeby najpierw przekierowując go do pliku tymczasowego.
```

**GitHub CLI**

Aby zaktualizować polecenia **Lagune**, uruchom:

```bash
gh skill update --all
```

Albo wklej ten prompt swojemu agentowi:

```md
Uruchom `gh skill update --all` i przeczytaj cały wynik polecenia, w razie potrzeby najpierw przekierowując go do pliku tymczasowego.
```

---

**Sandbox**

W sandboxie bez dostępu do sieci polecenia nie mogą pobrać silnika. Zainstaluj go w swoim projekcie z własnego terminala, raz, a potem po każdej aktualizacji:

```bash
npm i -D lagune@0.19.0
```

## Najczęściej zadawane pytania

### Jak zainstalować polecenia Lagune w dowolnym agencie AI?

W swoim projekcie uruchom npx skills add wellwelwel/lagune -y lub gh skill install wellwelwel/lagune --all --scope project albo wklej agentowi prompt instalacyjny.

### Jak zaktualizować polecenia Lagune w dowolnym agencie AI?

Uruchom npx skills update, jeśli polecenia zainstalowano przez skills.sh, albo gh skill update --all, jeśli zainstalowano je przez GitHub CLI. Możesz też wkleić agentowi prompt aktualizacyjny.

### Czy mogę zainstalować polecenia Lagune na kilka sposobów jednocześnie?

Nie. Przy dwóch instalacjach agent pokazuje każde polecenie dwa razy albo używa jednej kopii, a drugą ukrywa.
