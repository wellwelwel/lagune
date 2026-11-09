# /lagune-plan: Vurder funn og planlegg utbedringer

> Gjør det detect fant, om til en forsvarsplan som vurderer hvert funn med en kategori og en CVSS v4.0-score, og knytter en utbedring til det.

Kanonisk URL: https://lagune.ai/no-NO/docs/commands/plan
Språk: no-NO
Original: https://lagune.ai/docs/commands/plan
Sist oppdatert: 2026-11-09

🛡️ Gjør det detect fant, om til en forsvarsplan: Vurder hvert funn med en kategori og en CVSS v4.0-score, og knytt det deretter til utbedringen som skal tas i bruk.

## Bruk

**Planlegg alt**

```prompt
/lagune-plan
```

**Oppgi stier**

```prompt
/lagune-plan src/routes/upload.ts
```

**Fokuser på en bekymring**

```prompt
/lagune-plan hvor sensitive data kan lekke ut
```

## Slik fungerer det

Denne fasen fortsetter der detect slapp. Detect har allerede funnet ut hva systemet ditt gjør og hvilken risiko hver del innebærer, så plan gjentar ikke risikoen, men vurderer hvor alvorlig den er og bestemmer hva som skal gjøres med den. Plan leser aldri koden, og det tvinger hver utbedring til å peke på noe detect faktisk oppdaget. Fasen vurderer hvert funn etter metoden i CVSS v4.0: en kategori, en CVSS v4.0-vektor som er utledet fra det detect og charter fanget opp, og som [hooken `cvss`](https://lagune.ai/no-NO/docs/hooks/cvss) beregner scoren for, samt prioritetsnivået scoren havner i. Hver utbedring angir også sikkerhetsprinsippet den ivaretar.

For eksempel:

- **Filopplasting** (Prioritet: **Critical**)
  - _Kategori:_ Ubegrenset filopplasting (CWE-434).
  - _CVSS:_ CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N (9.3, Critical).
  - _Hvorfor denne prioriteten:_ Alle kan nå opplastingen over internett, og den ligger på serveren som lagrer kundenes filer.
  - _Ivaretar:_ III. All inndata er ikke-klarert til den er validert.
  - _Utbedring:_ sjekk filens faktiske type og størrelse, gi den nytt navn ved lagring, og lagre opplastinger der de ikke kan kjøres som kode.

Deretter har du en vurdert og prioritert liste over utbedringer, hver knyttet til et funn og klar til å tas i bruk i neste fase. Scoren blir beregnet, aldri anslått: Vektoren uttrykker hvor eksponert prosjektet er og hva som står på spill, som Environmental-metrikker, og hvem som helst kan lime den inn i kalkulatoren til FIRST eller NVD og komme frem til samme score.

**Tips**

- Fasen bygger helt på detect. Er en fil eller en bekymring aldri blitt kartlagt, ber den deg kjøre `/lagune-detect` på den først.
- Kjører du den på nytt, blir planen oppdatert: Ferdige utbedringer faller bort, og nye kommer til.
- Forsvarsplanen ligger i `.lagune/memory/plan.md`.

**Avhenger av detect**

Plan arbeider bare ut fra det [`/lagune-detect`](https://lagune.ai/no-NO/docs/commands/detect) allerede har kartlagt, så kjør detect først.

## Neste steg

Ta i bruk planen: [`/lagune-harden`](https://lagune.ai/no-NO/docs/commands/harden).

## Vanlige spørsmål

### Hvordan prioriterer Lagune sårbarheter?

/lagune-plan vurderer hvert funn med en kategori og en CVSS v4.0-score som hooken cvss beregner, og knytter det deretter til utbedringen som skal tas i bruk.

### Bruker Lagune CVSS v4.0?

Ja. Hvert funn får en CVSS v4.0-vektor og -score, beregnet av hooken cvss med samme aritmetikk som kalkulatoren til FIRST, så hvem som helst kan lime inn vektoren der og komme frem til samme score.

### Leser plan koden min?

Nei. Plan leser aldri koden, og det tvinger hver utbedring til å peke på noe detect faktisk oppdaget.
