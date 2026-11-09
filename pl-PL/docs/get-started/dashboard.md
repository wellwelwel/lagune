# Dashboard

> Przeglądaj zasady bezpieczeństwa, ustalenia i katalog swojego projektu w lokalnym podglądzie na żywo, który otwierasz jednym poleceniem.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/get-started/dashboard
Język: pl-PL
Oryginał: https://lagune.ai/docs/get-started/dashboard
Ostatnia aktualizacja: 2026-11-09

Uruchom **Lagune** bezpośrednio, bez podpolecenia, aby otworzyć interaktywny podgląd na żywo folderu `.lagune/`. Polecenie uruchamia dashboard i otwiera go na losowym porcie:

```bash
npx lagune
```

- [x] **Odświeżanie na żywo**
- [x] **Prywatny** i **lokalny**
- [x] Pokazuje wszystko, co zawiera folder `.lagune/`, począwszy od pierwszych zasad bezpieczeństwa
- [x] **Zarządzaj** kategoriami projektu i tym, co przeszukują jego hooki, bezpośrednio w przeglądarce
- [x] Nie wymaga folderu `node_modules` ani pliku `package.json` 📦

![Zasady bezpieczeństwa w dashboardzie Lagune](https://lagune.ai/img/dashboard/02.webp)

![Ustalenia w dashboardzie Lagune](https://lagune.ai/img/dashboard/03.webp)

![Side quests w dashboardzie Lagune](https://lagune.ai/img/dashboard/04.webp)

![Szczegóły ustalenia w dashboardzie Lagune](https://lagune.ai/img/dashboard/05.webp)

![Katalog w dashboardzie Lagune](https://lagune.ai/img/dashboard/06.webp)

**Wskazówka**

- 🚪 Użyj opcji `--port`, aby ustawić własny port.
- ⏏️ Naciśnij `Ctrl+C`, aby go zatrzymać.

## Najczęściej zadawane pytania

### Jak otworzyć dashboard Lagune?

Uruchom npx lagune bez podpolecenia w głównym folderze projektu. Polecenie udostępnia podgląd na żywo folderu .lagune/ na losowym porcie i otwiera go w przeglądarce.

### Czy dashboard jest prywatny?

Tak. Działa wyłącznie na twoim komputerze, pod lokalnym adresem, do którego nie dotrze żaden inny komputer.

### Czy mogę zmieniać projekt z poziomu dashboardu?

Tylko jego kategorie i to, co pomijają jego hooki, z poziomu przeglądarki. Wszystko inne w dashboardzie jest tylko do odczytu.
