# /lagune-prove: kun defensiv proof of concept

> Gjør hvert oppdaget funn om til en kjørbar, kun defensiv proof of concept (PoC) og et sikkerhetsvarsel for ansvarlig varsling.

Kanonisk URL: https://lagune.ai/no-NO/docs/commands/prove
Språk: no-NO
Original: https://lagune.ai/docs/commands/prove
Sist oppdatert: 2026-11-09

🧪 Gjør hvert oppdaget funn om til kjørbart, kun defensivt belegg for ansvarlig varsling.

For hvert funn i kartleggingen fra detect skriver kommandoen et selvstendig sikkerhetsvarsel og en test som bekrefter den **sikre veien**, slik at testen feiler så lenge problemet finnes, og går gjennom når koden er utbedret.

**Tips**

Testene fra **Lagune** ligger isolert under `.lagune/`, atskilt fra din egen testsuite.

## Bruk

**Hvert funn**

```prompt
/lagune-prove
```

**Et navngitt funn**

Se funnene som allerede er sporet, med navn:

```prompt
npx lagune read list --findings

# Findings
#   ...
#   • SQL injection i brukeroppslag
#   ...
```

```prompt
# Bevis deretter ett av dem
/lagune-prove SQL injection i brukeroppslag
```

## Slik fungerer det

Kommandoen leser kildekoden hvert funn peker på, og skriver én mappe per bevist funn under `.lagune/proofs/`, med nøyaktig to filer:

| Fil                              | Hva den er                                                                                                                                            |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `report.test.mjs` (eller `.cjs`) | Testen. Den kjører med Poku når prosjektet ditt allerede bruker Poku, ellers med den innebygde testkjøreren i Node.js, så ingenting må installeres.   |
| `report.md`                      | Et selvstendig sikkerhetsvarsel: alvorlighetsgrad, konsekvens, hvordan problemet reproduseres og kommandoen for å kjøre testen, lesbart på egen hånd. |

Bevisene er alltid i JavaScript, så de er portable uansett hvilket språk prosjektet ditt er skrevet i. En indeks i `README.md` lenker til hvert bevis og gir én enkelt kommando for å kjøre alle.

**Tips**

- Den er **valgfri og selvstendig**: ikke en av de fem fasene, og ikke en del av sporingskjeden.
- Den skriver bare i `.lagune/proofs/` og rører aldri fasenes artefakter eller koden din, som den bare leser.
- Et funn der testen ikke reproduserer problemet, får ikke noe bevis, og kommandoen ber deg kjøre [`/lagune-detect`](https://lagune.ai/no-NO/docs/commands/detect) på det stedet for å avstemme.
- Kjører du den på nytt, blir bevisene avstemt: Et funn som er borte eller ikke lenger lar seg reprodusere, får mappen sin fjernet.

**Merk**

**Den kjører bare når du kaller den:** Agenten starter den aldri på egen hånd.

**Bygger på detect**

Prove leser kartleggingen fra [`/lagune-detect`](https://lagune.ai/no-NO/docs/commands/detect), så kjør detect først.

## Kun defensiv og autorisert

Før kommandoen genererer noe, bekrefter den at du har tillatelse til å teste målet, og den avviser enhver forespørsel om en fungerende exploit, en payload for angrep eller omgåelse av deteksjon. Et bevis demonstrerer den sikre oppførselen, det sender aldri ut angrepsinndata.

## Fra bevis til varsling

De to filene for hvert bevist funn hører sammen i en **privat GitHub Gist** når du skal rapportere sårbarheten. De er belegg for et aktivt problem som ikke er offentliggjort, så en `.gitignore` i `.lagune/proofs/` holder dem utenfor hver commit: Del dem bare gjennom den Gisten til vedlikeholderne har løst problemet.

Å lukke et funn i kjeden i **Lagune** er fortsatt jobben til [`/lagune-harden`](https://lagune.ai/no-NO/docs/commands/harden) og [`/lagune-verify`](https://lagune.ai/no-NO/docs/commands/verify): Prove produserer belegg, den lukker ingenting.

## Vanlige spørsmål

### Lager Lagune exploits?

Nei. /lagune-prove skriver kun defensivt belegg: en test som bekrefter den sikre veien, slik at den feiler så lenge problemet finnes, og går gjennom når koden er utbedret, pluss et sikkerhetsvarsel for ansvarlig varsling.

### Hva lager prove?

To filer per funn: en test (report.test.mjs eller .cjs) og et sikkerhetsvarsel (report.md).

### Hvordan varsler jeg ansvarlig om en sårbarhet Lagune har funnet?

Prove skriver et selvstendig sikkerhetsvarsel du kan dele gjennom en privat kanal, for eksempel en privat GitHub Gist, i tråd med ansvarlig varsling.
