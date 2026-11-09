# Hook network: vurdér URL'er for SSRF

> Vurdér et eller flere hentemål for SSRF direkte fra kommandolinjen.

Kanonisk URL: https://lagune.ai/da-DK/docs/hooks/network
Sprog: da-DK
Original: https://lagune.ai/docs/hooks/network
Sidst opdateret: 2026-11-09

Hooken `network` afgør, om et hentemål på serversiden er sikret mod **SSRF** (en forespørgsel, der kan rettes mod interne tjenester, cloud-metadata eller private værter). Den er den deterministiske motor bag [specialiseringen `network`](https://lagune.ai/da-DK/docs/catalog), og du kan selv køre den.

## Kørsel

Angiv hvert mål med `--url`. Hooken udskriver ét ord pr. mål, som du kan slå op i tabellen nedenfor.

**Ét mål**

```bash
npx lagune read network --url 'http://example.com/'
# => safe

npx lagune read network --url 'http://0x7f000001/'
# => private-target
```

**Flere mål**

Gentag `--url` for at vurdere en hel tilladelsesliste eller blokeringsliste i ét kald, én afgørelse pr. linje, i rækkefølge.

```bash
npx lagune read network \
  --url 'http://example.com/' \
  --url 'http://[::1]/' \
  --url 'http://allowed.com@evil.example/'
# => safe
# => private-target
# => parser-divergent
```

Den opløser værten, som netværket gør, så kodede former af en intern adresse ikke slipper forbi: hex, oktal, decimal uden punktummer, forkortet form, IPv6 og IPv4-mapped giver alle `private-target`. Og hvor en sjusket validator og den egentlige henter ville læse forskellige værter, er afgørelsen `parser-divergent`.

## Sådan læser du afgørelsen

| Afgørelse          | Betydning                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| `safe`             | Målet forbinder til en offentlig vært, og en sjusket validator ville læse den samme vært.               |
| `private-target`   | Værten opløses til en privat adresse, loopback, link-local, uspecificeret adresse eller cloud-metadata. |
| `parser-divergent` | En sjusket tekstvalidator ville læse en anden reel vært end den, henteren forbinder til.                |
| `invalid url`      | Strengen kan ikke parses som en URL, så der er intet at hente.                                          |

Kun `safe` er en tilladelse. Behandl `private-target`, `parser-divergent` og `invalid url` alle som en blokering.

### CLI-indstillinger

| Indstilling | Værdi             | Beskrivelse                                                      |
| ----------- | ----------------- | ---------------------------------------------------------------- |
| `--url`     | en URL eller vært | Tjek ét mål. Gentag for at tjekke flere, én afgørelse pr. linje. |

Mindst én `--url` er påkrævet. Målet er aldrig et bart positionelt argument, så det kan ikke forveksles med et flag.

**Hvorfor en værdi til et flag**

Hvert mål angives som værdi til et flag og indsættes aldrig i selve kommandoen. En værdi med anførselstegn eller backticks forbliver uskadelig og kan ikke injicere noget i shellen. Sæt den altid i enkelte anførselstegn, så din shell ikke ekspanderer den først.

**Hvad den ikke dækker**

Hooken er ren og opløser aldrig DNS, så to huller under kørslen ligger uden for omfanget: **DNS rebinding** (et navn, der opløses offentligt, når det tjekkes, og internt, når det hentes) og **kæder af omdirigeringer** (et første hop, der godkendes, og derefter omdirigerer indad). Luk dem ved at opløse én gang og forbinde til den validerede adresse og ved at afvise omdirigeringer. Den låser de reserverede loopback-navne (`localhost` og familien `.localhost`) fast som interne uden opslag, men ethvert andet DNS-navn giver `safe`, fordi det ville kræve opløsning at påstå, at det peger indad: tilladelseslisten beskytter dem, og det er den, dette tjek validerer.

**Tip**

Det er det samme tjek, som [specialiseringen `network`](https://lagune.ai/da-DK/docs/catalog) kører for at påvise, at et filter for mål holder.

## Ofte stillede spørgsmål

### Hvordan tester jeg en URL for SSRF?

Kør hooken network. Den vurderer et hentemål og returnerer safe, private-target, parser-divergent eller invalid url. Kun safe er en tilladelse.

### Hvad er en parser-divergent URL?

En URL, som forskellige parsere læser forskelligt, hvilket er en klassisk måde at omgå SSRF-beskyttelse på. Hooken network markerer den i stedet for at tillade den.
