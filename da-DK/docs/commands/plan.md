# /lagune-plan: Vurdér fund og planlæg rettelser

> Gør det, detect fandt, til en forsvarsplan, der vurderer hvert fund med en kategori og en CVSS v4.0-score og parrer det med en rettelse.

Kanonisk URL: https://lagune.ai/da-DK/docs/commands/plan
Sprog: da-DK
Original: https://lagune.ai/docs/commands/plan
Sidst opdateret: 2026-11-09

🛡️ Gør det, detect fandt, til en forsvarsplan: vurdér hvert fund med en kategori og en CVSS v4.0-score, og par det derefter med den rettelse, der skal gennemføres.

## Brug

**Planlæg alt**

```prompt
/lagune-plan
```

**Angiv stier**

```prompt
/lagune-plan src/routes/upload.ts
```

**Fokusér på en bekymring**

```prompt
/lagune-plan hvor følsomme data kan lække
```

## Sådan virker det

Denne fase fortsætter, hvor detect slap. Detect har allerede fundet, hvad dit system gør, og hvilken risiko hver ting indebærer, så planen gentager ikke risikoen, men vurderer, hvor alvorlig den er, og beslutter, hvad der skal gøres ved den. Plan læser aldrig koden, hvilket tvinger hver rettelse til at pege på noget, detect faktisk opdagede. Den vurderer hvert fund med metoden CVSS v4.0: en kategori, en CVSS v4.0-vektor, udledt af det, detect og charter har registreret, og scoret af [hooken `cvss`](https://lagune.ai/da-DK/docs/hooks/cvss), og det prioritetsniveau, scoren lander i. Hver rettelse angiver også det princip i charter, den opretholder.

For eksempel:

- **Filupload** (prioritet: **Critical**)
  - _Kategori:_ ubegrænset filupload (CWE-434).
  - _CVSS:_ CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N (9.3, Critical).
  - _Hvorfor denne prioritet:_ alle kan nå uploaden over internettet, og den ligger på den server, der gemmer kundernes filer.
  - _Opretholder:_ III. Alt input er ikke-betroet, indtil det er valideret.
  - _Rettelse:_ tjek filens reelle type og størrelse, omdøb den ved lagring, og gem uploads et sted, hvor de ikke kan køres som kode.

Derfra har du en vurderet og prioriteret liste over rettelser, hver knyttet til et fund og klar til, at den næste fase gennemfører den. Scoren bliver beregnet, aldrig anslået: vektoren indeholder projektets eksponering og indsats som Environmental-metrikker, og alle kan indsætte den i lommeregneren fra FIRST eller NVD og udlede den samme score igen.

**Tip**

- Den bygger udelukkende på detect. Hvis en fil eller en bekymring aldrig er blevet kortlagt, beder den dig om først at køre `/lagune-detect` på den.
- Når du kører den igen, bliver planen opdateret: færdige rettelser forsvinder, og nye kommer til.
- Forsvarsplanen ligger i `.lagune/memory/plan.md`.

**Afhænger af detect**

Plan arbejder kun ud fra det, [`/lagune-detect`](https://lagune.ai/da-DK/docs/commands/detect) allerede har kortlagt, så kør detect først.

## Næste trin

Gennemfør planen: [`/lagune-harden`](https://lagune.ai/da-DK/docs/commands/harden).

## Ofte stillede spørgsmål

### Hvordan prioriterer Lagune sårbarheder?

/lagune-plan vurderer hvert fund med en kategori og en CVSS v4.0-score, beregnet af hooken cvss, og parrer det derefter med den rettelse, der skal gennemføres.

### Bruger Lagune CVSS v4.0?

Ja. Hvert fund får en CVSS v4.0-vektor og -score, beregnet af hooken cvss med samme aritmetik som lommeregneren fra FIRST, så alle kan indsætte vektoren dér og udlede scoren igen.

### Læser planen min kode?

Nej. Plan læser aldrig koden, hvilket tvinger hver rettelse til at pege på noget, detect faktisk opdagede.
