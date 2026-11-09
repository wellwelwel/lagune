# Skills for sikkerhet med KI-agenter

> Skillene KI-agenten din låser opp med Lagune: å revidere et eksisterende prosjekt eller sikre nytt arbeid mens du bygger, alltid styrt av sikkerhetsprinsippene.

Kanonisk URL: https://lagune.ai/no-NO/docs/get-started/commands
Språk: no-NO
Original: https://lagune.ai/docs/get-started/commands
Sist oppdatert: 2026-11-09

Når **Lagune** er [installert](https://lagune.ai/no-NO/docs), låser **KI**-agenten din opp et sett med skills. Du kan bruke dem på to måter, og begge styres av **sikkerhetsprinsippene**: å sikre nytt arbeid mens du bygger det, eller å kjøre hele revisjonen over et prosjekt.

**⌨️ Bygging / utvikling**

Du trenger ikke å bli ferdig med arbeidet før du sikrer det. Bruk [**`/lagune`**](https://lagune.ai/no-NO/docs/commands/lagune) for arbeidet du skriver **akkurat nå**:

| Skill                                         | Hva den gjør for deg                                                                   |
| --------------------------------------------- | -------------------------------------------------------------------------------------- |
| [**/lagune-charter**](https://lagune.ai/no-NO/docs/commands/charter) | Fastsetter sikkerhetsreglene for prosjektet ditt, grunnlaget `/lagune` bygger på       |
| [**/lagune**](https://lagune.ai/no-NO/docs/commands/lagune)          | Bygger det du ber om og herder det mens det skrives, veiledet av sikkerhetsprinsippene |

**Bruk den når som helst**

[**`/lagune`**](https://lagune.ai/no-NO/docs/commands/lagune) følger reglene i sikkerhetsprinsippene dine hver gang den kjører. Den tar imot en hvilken som helst prompt, bygger det du ba om, og herder det med sikre standardinnstillinger underveis, ikke senere.

---

#### Spesielle skills

| Skill                                               | Hva den gjør                                                                        |
| --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/no-NO/docs/commands/specialize) | Lærer **Lagune** en ny sikkerhetsspesialisering fra artikler, exploits eller temaer |

**🔬 Revisjon: Blue Team-flyt**

Hele **Blue Team-flyten**: å lese hva et prosjekt gjør, kartlegge risikoene og lukke dem. Hver fase bygger på den forrige, så alt du trenger å gjøre, er å følge listen ovenfra og ned:

| #   | Skill                                         | Hva den gjør for deg                                                                            |
| --- | --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | [**/lagune-charter**](https://lagune.ai/no-NO/docs/commands/charter) | Fastsetter sikkerhetsreglene for prosjektet ditt, foreslått for deg eller formet av det du sier |
| 2   | [**/lagune-detect**](https://lagune.ai/no-NO/docs/commands/detect)   | Leser koden din og kartlegger hva systemet ditt gjør og hvor risikoene ligger                   |
| 3   | [**/lagune-plan**](https://lagune.ai/no-NO/docs/commands/plan)       | Gjør det detect fant, om til en forsvarsplan, med en utbedring for hvert funn                   |
| 4   | [**/lagune-harden**](https://lagune.ai/no-NO/docs/commands/harden)   | Tar i bruk utbedringene fra planen i koden din, trygt og én om gangen                           |
| 5   | [**/lagune-verify**](https://lagune.ai/no-NO/docs/commands/verify)   | Beviser at hver utbedring holder, og lukker dem som gjør det                                    |

---

#### Spesielle skills

| Skill                                               | Hva den gjør                                                                             |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/no-NO/docs/commands/specialize) | Lærer **Lagune** en ny sikkerhetsspesialisering fra artikler, exploits eller temaer      |
| [**/lagune-prove**](https://lagune.ai/no-NO/docs/commands/prove)           | Gjør hvert oppdaget funn om til et kjørbart bevis, kun defensivt, for ansvarlig varsling |

---

#### Interne skills

| Skill                                       | Hva den gjør                                 |
| ------------------------------------------- | -------------------------------------------- |
| [**/lagune-repair**](https://lagune.ai/no-NO/docs/commands/repair) | Reparerer den interne sporingen i **Lagune** |

**Tips**

Sikkerhet er ikke en kostnad, men en investering: Det du legger inn i starten, sparer du inn mange ganger igjen i hendelsene du aldri får 🙋🏻‍♂️

## Vanlige spørsmål

### Hvilke skills legger Lagune til?

/lagune for å herde arbeidet mens du bygger det, og Blue Team-flyten for revisjon i fem faser: /lagune-charter, /lagune-detect, /lagune-plan, /lagune-harden, /lagune-verify. I tillegg kommer /lagune-specialize og /lagune-prove.

### Hva er Blue Team-flyten i Lagune?

En revisjon i fem faser: charter (fastsett regler), detect (kartlegg risikoer), plan (vurder og planlegg utbedringer), harden (ta i bruk utbedringer), verify (bevis at de holder, og lukk dem).

### Hva er forskjellen på /lagune og revisjonsflyten?

/lagune sikrer nytt arbeid mens du skriver det, uten noen flyt å følge. Revisjonsflyten kjører de fem fasene i rekkefølge over et eksisterende prosjekt.
