# /lagune-prove: Udelukkende defensivt proof of concept

> Gør hvert opdaget fund til et kørbart, udelukkende defensivt proof of concept (PoC) og en sikkerhedsmeddelelse til ansvarlig offentliggørelse.

Kanonisk URL: https://lagune.ai/da-DK/docs/commands/prove
Sprog: da-DK
Original: https://lagune.ai/docs/commands/prove
Sidst opdateret: 2026-11-09

🧪 Gør hvert opdaget fund til et kørbart, udelukkende defensivt belæg til ansvarlig offentliggørelse.

For hvert fund i kortlægningen skriver den en selvstændig sikkerhedsmeddelelse og en test, der bekræfter den **sikre vej**, så testen fejler, mens problemet findes, og består, når koden er rettet.

**Tip**

Tests fra **Lagune** ligger isoleret under `.lagune/`, adskilt fra din egen testsuite.

## Brug

**Hvert fund**

```prompt
/lagune-prove
```

**Et navngivet fund**

Se de fund, der allerede spores, med deres navne:

```prompt
npx lagune read list --findings

# Findings
#   ...
#   • SQL injection i brugeropslag
#   ...
```

```prompt
# Påvis derefter et af dem
/lagune-prove SQL injection i brugeropslag
```

## Sådan virker det

Den læser den kildekode, hvert fund peger på, og skriver én mappe pr. påvist fund under `.lagune/proofs/` med præcis to filer:

| Fil                              | Hvad det er                                                                                                                                   |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `report.test.mjs` (eller `.cjs`) | Testen. Den kører på Poku, når dit projekt allerede bruger det, og ellers på den indbyggede test runner i Node.js, så intet skal installeres. |
| `report.md`                      | En selvstændig sikkerhedsmeddelelse: alvorlighed, konsekvens, hvordan problemet reproduceres, og kommandoen til at køre testen, læsbar alene. |

Beviserne er altid JavaScript, så de forbliver flytbare, uanset hvilket sprog dit projekt er skrevet i. Et indeks i `README.md` linker til hvert bevis og giver én kommando til at køre dem alle.

**Tip**

- Den er **valgfri og selvstændig**: ikke en af de fem faser og ikke en del af sporingskæden.
- Den skriver kun i `.lagune/proofs/` og rører aldrig faseartefakterne eller din kode, som den kun læser.
- Et fund, hvis test ikke reproducerer problemet, får intet bevis, og den beder dig om at køre [`/lagune-detect`](https://lagune.ai/da-DK/docs/commands/detect) på det sted for at afstemme.
- Når du kører den igen, bliver beviserne afstemt: et fund, der er væk eller ikke længere kan reproduceres, får sin mappe fjernet.

**Bemærk**

**Den kører kun, når du kalder den:** agenten starter den aldrig af sig selv.

**Bygger på detect**

Prove læser kortlægningen fra [`/lagune-detect`](https://lagune.ai/da-DK/docs/commands/detect), så kør detect først.

## Udelukkende defensiv og autoriseret

Før den genererer noget, bekræfter den, at du har tilladelse til at teste målet, og den afviser enhver forespørgsel om et fungerende exploit, en angrebspayload eller omgåelse af detektion. Et bevis demonstrerer den sikre adfærd og udsender aldrig et angrebsinput.

## Fra bevis til offentliggørelse

De to filer for hvert påvist fund hører sammen i en **privat GitHub Gist**, når du rapporterer sårbarheden. De er belæg for et aktivt, ikke-offentliggjort problem, så en `.gitignore` inde i `.lagune/proofs/` holder dem ude af hvert commit: del dem kun gennem den Gist, indtil vedligeholderne har løst problemet.

At lukke et fund i kæden i **Lagune** er stadig opgaven for [`/lagune-harden`](https://lagune.ai/da-DK/docs/commands/harden) og [`/lagune-verify`](https://lagune.ai/da-DK/docs/commands/verify): prove producerer belæg, den lukker ikke noget.

## Ofte stillede spørgsmål

### Genererer Lagune exploits?

Nej. /lagune-prove skriver udelukkende defensivt belæg: en test, der bekræfter den sikre vej, så den fejler, mens problemet findes, og består, når koden er rettet, samt en sikkerhedsmeddelelse til ansvarlig offentliggørelse.

### Hvad producerer prove?

To filer pr. fund: en test (report.test.mjs eller .cjs) og en sikkerhedsmeddelelse (report.md).

### Hvordan offentliggør jeg ansvarligt en fejl, Lagune har fundet?

Prove skriver en selvstændig sikkerhedsmeddelelse, som du kan dele gennem en privat kanal, såsom en privat GitHub Gist, efter principperne for ansvarlig offentliggørelse.
