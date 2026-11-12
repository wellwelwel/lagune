# Instalacja wtyczki Lagune w Muse Code

> Zainstaluj wtyczkę Lagune w Muse Code, aktualizuj ją i uruchamiaj jej silnik w sandboxie.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/install/muse-code
Język: pl-PL
Oryginał: https://lagune.ai/docs/install/muse-code
Ostatnia aktualizacja: 2026-11-09

Zainstaluj wtyczkę z terminala:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## Aktualizacja

Aby zaktualizować wtyczkę **Lagune**, odśwież marketplace i zainstaluj ją ponownie:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## Polecenia

Wpisuj nazwy poleceń, na przykład `/lagune-charter`, albo poprzedzaj je nazwą wtyczki, na przykład `/lagune:lagune-charter`.

---

**Sandbox**

Sandbox **Muse Code** nie może pobrać silnika. Zainstaluj go w swoim projekcie z własnego terminala, raz, a potem po każdej aktualizacji:

```bash
npm i -D lagune@0.18.2
```

## Najczęściej zadawane pytania

### Jak zainstalować wtyczkę Lagune w Muse Code?

Uruchom muse plugins marketplace add lagune wellwelwel/lagune, a następnie muse plugins install lagune@lagune.

### Jak zaktualizować wtyczkę Lagune w Muse Code?

Uruchom muse plugins marketplace update lagune, a następnie zainstaluj wtyczkę ponownie poleceniami muse plugins remove lagune i muse plugins install lagune@lagune.

### Jak uruchamiać polecenia Lagune w Muse Code?

Wpisuj ich nazwy, na przykład /lagune-charter, albo poprzedzaj je nazwą wtyczki, na przykład /lagune:lagune-charter.

### Czy Lagune działa w sandboxie Muse Code?

Tak, gdy zainstalujesz silnik w swoim projekcie poleceniem npm i -D lagune@0.18.2 z własnego terminala, raz, a potem po każdej aktualizacji.
