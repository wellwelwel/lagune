# Migrate: Flyt et manifestbaseret Lagune-projekt til skills og plugins

> Flyt et manifestbaseret Lagune-projekt til det skillsbaserede Lagune, og behold dine sikkerhedsprincipper, artefakter, sporing og egne specialiseringer.

Kanonisk URL: https://lagune.ai/da-DK/docs/commands/migrate
Sprog: da-DK
Original: https://lagune.ai/docs/commands/migrate
Sidst opdateret: 2026-11-09

🔀 Flyt et manifestbaseret projekt med **Lagune** til det skillsbaserede **Lagune**, og behold alt, hvad du har skrevet.

**Meddelelse om udfasning**

Et projekt med et manifest fortsætter med at virke, som det er, indtil `v1.x`: `npx lagune` sender `init`, `pull`, `update`, `add`, `remove`, `list` og dashboardet videre til `lagune@0.15.0`, den sidste manifestbaserede version.

## Flyt det

1. Sørg for, at dit nuværende arbejde er committet, og kør derefter migrate fra projektets rod:

   ```bash
   npx lagune migrate
   ```

2. Commit kun det, den ændrede, så flytningen forbliver én ændring, der kan gennemses.
3. Installér kommandoerne til din agent, som [installationssiden](https://lagune.ai/da-DK/docs) viser.
4. Hvis projektet allerede har et artefakt fra detect, plan eller harden, så bed [`/lagune-repair`](https://lagune.ai/da-DK/docs/commands/repair) om at afstemme de gamle referencer i dem og i dine egne specialiseringer:

   ```prompt
   /lagune-repair Afstem de anvendte specialiseringer (tidligere sub-skills) i artefakterne under `.lagune/memory/` (`detect.md`, `plan.md` og `harden.md`) med de navne, det nye katalog oplister, og omskriv hvert kald, som mine egne specialiseringer i `.lagune/catalog/` laver til de gamle hooks i `.lagune/hooks/`, til et kald til værktøjet `lagune_read` eller `lagune_write`.
   ```

## Hvad der ændrer sig

| Før                                                                    | Efter                                                                               |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `.lagune/templates/`, `.lagune/hooks/` og `.lagune/specializations.md` | Fjernet: hver skill har sin skabelon med, og motoren kører hooks                    |
| Kopierne af de indbyggede specialiseringer i `.lagune/skills/`         | Fjernet: motoren leverer de indbyggede                                              |
| Dine egne specialiseringer i `.lagune/skills/`                         | Flyttet til `.lagune/catalog/`                                                      |
| `.lagune/skills.json`, indekset over dine egne specialiseringer        | Flettet ind i `.lagune/configs.json`                                                |
| Manifestets kategorier                                                 | Registreret i `.lagune/configs.json`                                                |
| De gamle agentkommandoer, såsom `/lagune.detect`                       | Fjernet: [installationen af **Lagune**](https://lagune.ai/da-DK/docs) giver de nye, såsom `/lagune-detect` |
| Blokken for **Lagune** i `.gitignore`                                  | Fjernet, sammen med filen, når den ikke indeholdt andet                             |
| `.lagune/proofs/`, ignoreret af den blok                               | Holdt ude af commits af sin egen `.gitignore`                                       |
| `.lagune/manifest.json`                                                | Slettet, til sidst                                                                  |

Dit sikkerhedsarbejde forbliver, som det er: sikkerhedsprincipperne, det artefakt, hver fase har produceret, og sporingskortet med de stier, hvert fund peger på.

## Ofte stillede spørgsmål

### Skal jeg migrere?

Ja. Manifestbaserede projekter er udfaset og virker kun indtil v1.x, så kør npx lagune migrate for at flytte dit.

### Hvad beholder migrate?

Dine sikkerhedsprincipper, hvert faseartefakt, sporingskortet, dine kategorier og dine egne specialiseringer. Specialiseringerne flyttes til .lagune/catalog/, og deres indeks kommer ind sammen med dine kategorier i .lagune/configs.json.

### Hvornår installerer jeg de nye kommandoer?

Efter migrate, som installationssiden viser for din agent. Det virker også at installere først, da migrate beholder den nye /lagune.

### En kollega har allerede migreret. Hvad skal jeg køre?

Hent flytningen med pull, og kør derefter npx lagune migrate én gang. Den fjerner det, det manifestbaserede Lagune efterlod på din klon, som versionsstyringen aldrig har haft med, og holder dine beviser ude af commits.
