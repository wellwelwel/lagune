# Sikkerhedsskills til AI-agenter

> De skills, din AI-agent får med Lagune: gennemgå et eksisterende projekt, eller sikr nyt arbejde, mens du bygger, altid styret af sikkerhedsprincipperne.

Kanonisk URL: https://lagune.ai/da-DK/docs/get-started/commands
Sprog: da-DK
Original: https://lagune.ai/docs/get-started/commands
Sidst opdateret: 2026-11-09

Når **Lagune** er [installeret](https://lagune.ai/da-DK/docs), får din **AI**-agent en række skills. Der er to måder at bruge dem på, og begge styres af **charter**: sikr nyt arbejde, mens du bygger det, eller kør hele gennemgangen af et projekt.

**⌨️ Byg / udvikling**

Du behøver ikke at gøre dit arbejde færdigt, før du sikrer det. Brug [**`/lagune`**](https://lagune.ai/da-DK/docs/commands/lagune) til det arbejde, du skriver **lige nu**:

| Skill                                         | Hvad den gør for dig                                                               |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| [**/lagune-charter**](https://lagune.ai/da-DK/docs/commands/charter) | Fastlægger dit projekts sikkerhedsregler, det fundament `/lagune` bygger ud fra    |
| [**/lagune**](https://lagune.ai/da-DK/docs/commands/lagune)          | Bygger det, du beder om, og hærder det, mens det bliver skrevet, styret af charter |

**Brug den når som helst**

[**`/lagune`**](https://lagune.ai/da-DK/docs/commands/lagune) overholder dine regler fra charter, hver gang den kører. Den tager imod enhver prompt, bygger det, du bad om, og hærder det med sikre standardindstillinger undervejs, ikke senere.

---

#### Særlige skills

| Skill                                               | Hvad den gør                                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/da-DK/docs/commands/specialize) | Lærer **Lagune** en ny sikkerhedsspecialisering ud fra artikler, exploits eller emner |

**🔬 Gennemgang: Blue Team-workflow**

Hele **Blue Team-workflowet**: læs, hvad et projekt gør, kortlæg dets risici, og luk dem. Hvert trin bygger på det forrige, så du skal blot følge listen oppefra og ned:

| #   | Skill                                         | Hvad den gør for dig                                                                         |
| --- | --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | [**/lagune-charter**](https://lagune.ai/da-DK/docs/commands/charter) | Fastlægger dit projekts sikkerhedsregler, foreslået for dig eller formet efter det, du siger |
| 2   | [**/lagune-detect**](https://lagune.ai/da-DK/docs/commands/detect)   | Læser din kode og kortlægger, hvad dit system gør, og hvor risiciene er                      |
| 3   | [**/lagune-plan**](https://lagune.ai/da-DK/docs/commands/plan)       | Gør det, detect fandt, til en forsvarsplan med en rettelse til hvert fund                    |
| 4   | [**/lagune-harden**](https://lagune.ai/da-DK/docs/commands/harden)   | Gennemfører planens rettelser i din kode, sikkert og én ad gangen                            |
| 5   | [**/lagune-verify**](https://lagune.ai/da-DK/docs/commands/verify)   | Påviser, at hver gennemført rettelse holder, og afslutter dem, der gør                       |

---

#### Særlige skills

| Skill                                               | Hvad den gør                                                                                         |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/da-DK/docs/commands/specialize) | Lærer **Lagune** en ny sikkerhedsspecialisering ud fra artikler, exploits eller emner                |
| [**/lagune-prove**](https://lagune.ai/da-DK/docs/commands/prove)           | Gør hvert fund fra detect til et kørbart, udelukkende defensivt bevis til ansvarlig offentliggørelse |

---

#### Interne skills

| Skill                                       | Hvad den gør                               |
| ------------------------------------------- | ------------------------------------------ |
| [**/lagune-repair**](https://lagune.ai/da-DK/docs/commands/repair) | Reparerer den interne sporing i **Lagune** |

**Tip**

Sikkerhed er ikke en udgift, men en investering: det, du lægger i fra starten, sparer du mange gange igen i de hændelser, du aldrig får 🙋🏻‍♂️

## Ofte stillede spørgsmål

### Hvilke skills tilføjer Lagune?

/lagune til at hærde arbejdet, mens du bygger det, og Blue Team-gennemgangen i fem faser: /lagune-charter, /lagune-detect, /lagune-plan, /lagune-harden, /lagune-verify. Derudover /lagune-specialize og /lagune-prove.

### Hvad er Blue Team-workflowet i Lagune?

En gennemgang i fem faser: charter (fastlæg regler), detect (kortlæg risici), plan (vurdér og planlæg rettelser), harden (gennemfør rettelser), verify (påvis, at de holder, og afslut dem).

### Hvad er forskellen på /lagune og gennemgangen?

/lagune sikrer nyt arbejde, mens du skriver det, uden et workflow at følge. Gennemgangen kører de fem faser i rækkefølge over et eksisterende projekt.
