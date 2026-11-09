# /lagune-specialize: Wytrenuj specjalizację bezpieczeństwa zwykłym tekstem

> Destyluj wskazane źródło lub temat z zakresu bezpieczeństwa do postaci nowej specjalizacji ładowanej na żądanie.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/commands/specialize
Język: pl-PL
Oryginał: https://lagune.ai/docs/commands/specialize
Ostatnia aktualizacja: 2026-11-09

🎓 Niech **Lagune** nauczy się nowej specjalizacji ze źródła lub tematu, które wskażesz.

Polecenie czyta materiał i destyluje go do postaci ukierunkowanej, wyłącznie defensywnej specjalizacji o dokładnie takiej samej budowie jak [wbudowane](https://lagune.ai/pl-PL/docs/catalog), dzięki czemu fazy detect i verify ładują ją potem jak każdą inną. Wyłącznie audytuje i wyjaśnia: nigdy nie pisze danych wejściowych do ataku ani exploitów i nigdy nie zmienia twojego kodu.

**Z artykułu**

```prompt
# Link lub odwołanie: Lagune destyluje z niego obronę
/lagune-specialize https://owasp.org/www-community/attacks/SQL_Injection
```

**Z exploita**

```prompt
# Atak jako źródło: specjalizacja i tak opisuje obronę
/lagune-specialize "' OR 1=1 -- dokleja SQL do treści zapytania"
```

**Z tematu**

```prompt
# Albo po prostu nazwij, co ma objąć
/lagune-specialize SQL injection
```

**Atak może być źródłem, nigdy wynikiem**

Wskazanie ataku jest w porządku, gdy celem jest obrona przed nim: opis exploita to materiał do nauki, z którego polecenie destyluje obronę. Specjalizacja, którą tworzy, zawsze audytuje i wyjaśnia, nigdy nie dostarcza działającego exploita, payloadu ani sposobu na obejście zabezpieczeń.

## Co zapisuje

Wynikiem są dwa pliki w twoim projekcie, które trafiają do commita razem z twoim kodem i można je przejrzeć:

- Specjalizacja w pliku `.lagune/catalog/<name>.md`, zbudowana tak jak [wbudowane](https://lagune.ai/pl-PL/docs/catalog).
- Jej wpis w pliku `.lagune/configs.json`, w którym projekt indeksuje własne specjalizacje, aby katalog mógł połączyć je z wbudowanymi.

Następnie polecenie wyświetla katalog, aby potwierdzić, że nowy wpis się w nim znalazł. Twoje własne specjalizacje zawsze są w katalogu, niezależnie od jego kategorii. Nigdy nie dodajesz polecenia ani nie zmieniasz pakietu: nowa specjalność to jeden plik z wiedzą i jeden wpis w indeksie, zapisane w twoim własnym projekcie.

## Udoskonalaj, nigdy nie nadpisuj

Gdy specjalizujesz nazwę, która już istnieje, czy to wbudowaną, taką jak `regex`, czy własną, utworzoną wcześniej, polecenie **uzgadnia** bieżący plik zamiast go zastępować. Czyta to, co w nim jest, wplata nową wiedzę, zachowuje to, co nadal obowiązuje, i przepisuje to, co się zmieniło. Nic nie zostaje odrzucone bez przejrzenia. Twoja specjalizacja przesłania wbudowaną o tej samej nazwie, więc możesz dopracować wbudowaną specjalizację na potrzeby swojego projektu, nie tracąc jej.

**Wskazówka**

- Nowa specjalizacja ładuje się dokładnie tak jak wbudowana: fazy detect i verify sięgają po nią na żądanie, możesz też załadować ją samodzielnie poleceniem `npx lagune read catalog <name>` i zlecić jej zadanie.
- Gdy materiał ma rozpoznawalne pochodzenie (artykuł, autor, link, standard), specjalizacja podaje je jako źródło. Sam temat nie ma źródła.

**Notatka**

**Działa tylko wtedy, gdy je wywołasz:** agent nigdy nie uruchamia go z własnej inicjatywy.

## Najczęściej zadawane pytania

### Jak dodać własną specjalizację bezpieczeństwa?

Uruchom /lagune-specialize ze źródłem lub tematem. Polecenie destyluje je do postaci wyłącznie defensywnej specjalizacji, zapisanej w .lagune/catalog/<name>.md, i dodaje jej wpis w .lagune/configs.json.

### Czy Lagune może się uczyć z opisu exploita?

Tak, jako źródło, nigdy jako wynik. Atak może być źródłem, nigdy produktem. Specialize nigdy nie pisze danych wejściowych do ataku ani exploitów.

### Czy specialize nadpisuje wbudowane specjalizacje?

Nie. Udoskonala je, nigdy nie nadpisuje.
