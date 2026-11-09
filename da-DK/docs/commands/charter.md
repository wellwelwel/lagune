# /lagune-charter: Fastlæg dine sikkerhedsprincipper

> Fastlæg dit projekts sikkerhedsprincipper, de regler hver senere fase respekterer, og registrér de kategorier af specialiseringer, som læsningen af projektet understøtter.

Kanonisk URL: https://lagune.ai/da-DK/docs/commands/charter
Sprog: da-DK
Original: https://lagune.ai/docs/commands/charter
Sidst opdateret: 2026-11-09

🧬 Fortæl **Lagune**, hvad dit projekt er, så gør det det til dine sikkerhedsregler (eller, uden en beskrivelse, udleder dem af projektet alene).

Charter er det overordnede lag: et sæt principper med sikkerheden i første række, som hver senere fase skal respektere. Tænk på det som kompileringstjekket for dit projekts sikkerhedsniveau.

## Brug

**Beskriv det**

```prompt
/lagune-charter Mit projekt er en webshop, der sælger videospil. Kunderne lægger produkter i en kurv og betaler med kreditkort eller bankoverførsel. De kan se deres ordrer og status for hver enkelt.
```

**Lad Lagune foreslå**

```prompt
/lagune-charter
```

> _Jeg ser et betalingsbibliotek, en loginopsætning og en ordremodel knyttet til en kunde. Det ligner en webshop, der sælger noget. Kunderne betaler og følger deres egne ordrer..._ ☁️

## Hvad det udleder

**Lagune** tager din beskrivelse eller din **PRD** som retning og udleder, hvad den betyder for sikkerheden, og læser derefter projektet for at gå videre, end du nævnte. For eksempel:

- En kurv, der indeholder ordrer, betyder, at der er en **database**:
  - f.eks. `"Hvor ligger dataene?"`, `"Hvem kan nå dem?"`, `"Lækker de?"`.
- Kunder, der kan se deres egne ordrer, betyder, at der er en form for **login eller adgangskontrol**:
  - f.eks. `"Kan én kunde nå en anden kundes ordrer?"`, `"Er sessionerne beskyttet?"`.
- Betaling med kort og bankoverførsel betyder, at **penge og følsomme data er involveret**:
  - f.eks. `"Bliver kortdata gemt?"`, `"Bliver betalingerne verificeret?"`.

Din beskrivelse og projektet supplerer hinanden: din beskrivelse sætter hensigten, og læsningen af afhængighederne, README og konfigurationen bringer det frem, du ikke nævnte. Hvis noget vigtigt stadig er uklart, stiller **Lagune** et kort, enkelt spørgsmål i stedet for at gætte.

Ud fra det bygger **Lagune** et skræddersyet sæt sikkerhedsregler til projektet, som du kan gennemse og justere, når du har brug for det.

**Få mest muligt ud af det**

- Du kan også definere dine egne sikkerhedsregler for projektet.
- Jo flere relevante detaljer du giver, desto bedre bliver den endelige rapport:
  - Forklar projektet, hvordan det virker, og hvad der sker bag kulisserne.
  - Hvem er slutbrugeren? Hvad kan brugerne gøre, og hvad kan de ikke?
  - Detaljer om adfærd er lige så værdifulde som tekniske detaljer.
- Hukommelsen for charter ligger i `.lagune/memory/charter.md`.

## De kategorier, det registrerer

Specialiseringer, den sikkerhedsviden de senere faser indlæser efter behov, kommer ind i dit projekts [katalog](https://lagune.ai/da-DK/docs/catalog) efter [kategori](https://lagune.ai/da-DK/docs/categories). Så længe dit projekt ikke har nogen kategori registreret, registrerer charter hver kategori, som læsningen understøtter, såsom dit projekts sprog, kald til en LLM eller containere, og nævner dem i sit resumé.

Når der er registreret kategorier, lader charter dem være og nævner kun en kategori, dit projekt endnu ikke bruger. Du kan selv ændre dem når som helst:

```bash
npx lagune write add --categories python
npx lagune write remove --categories python
```

## De mapper, det tilbyder at udelade

Når læsningen i charter finder committede mapper, der ikke er dit projekts kode at forsvare, såsom testfixtures skrevet til at se sårbare ud, oplister den dem med numre sidst i sit resumé. Den udelader aldrig en mappe på egen hånd, da et fjendtligt repository kan få sin kode til at ligne fixtures, så kun de numre, du svarer med, bliver registreret. [Konfigurér hooks](https://lagune.ai/da-DK/docs/hooks/configure) beskriver, hvordan du selv ændrer dem.

## Næste trin

Med reglerne på plads kan du kortlægge, hvad dit system rent faktisk gør: [`/lagune-detect`](https://lagune.ai/da-DK/docs/commands/detect).

## Ofte stillede spørgsmål

### Hvad er charter i Lagune?

Charter er det overordnede lag i Lagune, et sæt principper med sikkerheden i første række, som hver senere fase skal respektere. Tænk på det som kompileringstjekket for dit projekts sikkerhedsniveau.

### Hvor bliver charter gemt?

I .lagune/memory/charter.md.

### Kan jeg skrive mine egne regler i charter?

Ja. Lagune foreslår regler ud fra din beskrivelse og din kode, og du kan omformulere, fjerne, tilføje eller afgrænse dem.

### Vælger charter mine kategorier af specialiseringer?

Kun så længe der ikke er registreret nogen. Den registrerer så hver kategori, som læsningen understøtter, såsom dit sprog eller kald til en LLM. Når der er registreret kategorier, ændrer den dem aldrig.
