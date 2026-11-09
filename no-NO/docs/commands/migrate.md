# Migrate: Flytt et prosjekt fra manifestbasert Lagune til skills og plugins

> Flytt et prosjekt fra den manifestbaserte versjonen av Lagune til versjonen basert på skills, og behold sikkerhetsprinsippene, artefaktene, sporingen og dine egne spesialiseringer.

Kanonisk URL: https://lagune.ai/no-NO/docs/commands/migrate
Språk: no-NO
Original: https://lagune.ai/docs/commands/migrate
Sist oppdatert: 2026-11-09

🔀 Flytt et prosjekt fra den manifestbaserte versjonen av **Lagune** til versjonen av **Lagune** basert på skills, og behold alt du har skrevet.

**Varsel om utfasing**

Et prosjekt med manifest fungerer som før frem til `v1.x`: `npx lagune` overlater `init`, `pull`, `update`, `add`, `remove`, `list` og dashbordet til `lagune@0.15.0`, den siste manifestbaserte versjonen.

## Slik flytter du det

1. Sørg for at det du jobber med nå, er committet, og kjør deretter migrate fra rotmappen i prosjektet:

   ```bash
   npx lagune migrate
   ```

2. Commit bare det migrate endret, slik at flyttingen forblir én endring som er lett å gå gjennom.
3. Installer kommandoene for agenten din, slik [installasjonssiden](https://lagune.ai/no-NO/docs) viser.
4. Har prosjektet allerede en artefakt fra detect, plan eller harden, be [`/lagune-repair`](https://lagune.ai/no-NO/docs/commands/repair) om å avstemme de gamle referansene i dem og i dine egne spesialiseringer:

   ```prompt
   /lagune-repair Avstem spesialiseringene som er tatt i bruk (tidligere sub-skills) i artefaktene under `.lagune/memory/` (`detect.md`, `plan.md` og `harden.md`) med navnene den nye katalogen lister opp, og skriv om hvert kall mine egne spesialiseringer i `.lagune/catalog/` gjør til de gamle hookene i `.lagune/hooks/`, til et kall til verktøyet `lagune_read` eller `lagune_write`.
   ```

## Hva som endres

| Før                                                                    | Etter                                                                                         |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `.lagune/templates/`, `.lagune/hooks/` og `.lagune/specializations.md` | Fjernet: Hver skill har med seg sin egen mal, og motoren kjører hookene                       |
| Kopiene av innebygde spesialiseringer i `.lagune/skills/`              | Fjernet: Motoren leverer de innebygde                                                         |
| Dine egne spesialiseringer i `.lagune/skills/`                         | Flyttet til `.lagune/catalog/`                                                                |
| `.lagune/skills.json`, indeksen over dine egne spesialiseringer        | Slått sammen med `.lagune/configs.json`                                                       |
| Kategoriene i manifestet                                               | Registrert i `.lagune/configs.json`                                                           |
| De gamle agentkommandoene, for eksempel `/lagune.detect`               | Fjernet: Når du [installerer **Lagune**](https://lagune.ai/no-NO/docs), får du de nye, for eksempel `/lagune-detect` |
| Blokken for **Lagune** i `.gitignore`                                  | Fjernet, sammen med filen når den ikke inneholdt noe annet                                    |
| `.lagune/proofs/`, ignorert av den blokken                             | Holdt utenfor commits av sin egen `.gitignore`                                                |
| `.lagune/manifest.json`                                                | Slettet, til sist                                                                             |

Sikkerhetsarbeidet ditt forblir som det er: sikkerhetsprinsippene, artefakten hver fase produserte, og sporingskartet med stiene hvert funn peker på.

## Vanlige spørsmål

### Må jeg migrere?

Ja. Manifestbaserte prosjekter er utfaset og fungerer bare frem til v1.x, så kjør npx lagune migrate for å flytte ditt.

### Hva beholder migrate?

Sikkerhetsprinsippene, hver artefakt fra fasene, sporingskartet, kategoriene og dine egne spesialiseringer. Spesialiseringene flyttes til .lagune/catalog/, og indeksen over dem havner sammen med kategoriene i .lagune/configs.json.

### Når installerer jeg de nye kommandoene?

Etter migrate, slik installasjonssiden viser for agenten din. Det går også an å installere først, siden migrate beholder den nye /lagune.

### En kollega har allerede migrert. Hva kjører jeg?

Hent flyttingen med pull, og kjør deretter npx lagune migrate én gang. Den fjerner det den manifestbaserte versjonen av Lagune etterlot i klonen din, som versjonskontrollen aldri tok med, og holder bevisene dine utenfor commits.
