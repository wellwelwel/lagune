# Hook agent : détecter les boucles d'agent sans limite

> Analysez une base de code à la recherche d'appels d'agent ou de LLM sans limite d'étapes ni de temps, ou évaluez un seul appel, en ligne de commande.

Canonique: https://lagune.ai/fr-FR/docs/hooks/agent
Langue: fr-FR
Original: https://lagune.ai/docs/hooks/agent
Dernière mise à jour: 2026-11-03

Le hook `agent` signale les **runtimes d'agent qui bouclent sans limite de tours, de budget ni de temps**, la faille d'autonomie incontrôlée qui transforme une entrée forgée en coût illimité ou en escalade par injection de prompt. Il est **adapté au langage** et couvre les deux écosystèmes de frameworks d'agents : **JavaScript** (le runtime `query` du SDK d'agent de **Claude**) et **Python** (**LangChain**, **LangGraph**, **CrewAI**, **OpenAI Agents**). C'est le moteur déterministe derrière la [spécialisation `llm`](https://lagune.ai/fr-FR/docs/catalog), que vous pouvez exécuter vous-même en mode **scan** ou **check**.

## Exécution

**Analyser la base de code**

```bash
npx lagune read agent                # scans the whole project
npx lagune read agent --dir src/ai   # scans a directory
npx lagune read agent --file chat.ts # scans a single file
```

**Vérifier un appel**

```bash
npx lagune read agent --lang javascript --pattern 'query({ prompt })'                           # => uncapped
npx lagune read agent --lang javascript --pattern 'query({ prompt, options: { maxTurns: 5 } })' # => safe
npx lagune read agent --lang python --pattern 'AgentExecutor(agent=a, max_iterations=None)'     # => uncapped
```

Chaque ligne sous **Uncapped agent loops found** correspond, dans un fichier qui importe un SDK d'agent, soit au runtime `query` du SDK d'agent de Claude appelé sans limite de tours, de budget ni de temps (JavaScript, illimité par défaut), soit à la suppression explicite de la limite par défaut d'un framework, comme `max_iterations=None` / `max_turns=None` (Python, limité par défaut). Dans les deux cas, le hook se termine avec un code non nul. `generateText`/`streamText` du Vercel AI SDK se limitent par défaut à une seule étape (`stopWhen: stepCountIs(1)`), donc un appel nu ne peut pas y boucler et n'est pas signalé, et un `db.query(...)` ordinaire n'est jamais pris pour un appel d'agent. Une analyse propre affiche `no uncapped agent loops found`.

## Lire le verdict

| Verdict    | Signification                                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| `uncapped` | Un appel au runtime `query` sans limite (JS), ou une suppression explicite de la limite (`=None`, Py).              |
| `safe`     | Un appel `query` qui fixe une limite, une génération en une seule étape ou un appel de framework limité par défaut. |
| `invalid`  | L'extrait ne contient aucun appel d'agent reconnaissable à juger.                                                   |

### Options de la CLI

| Option      | Valeur             | Description                                                                     |
| ----------- | ------------------ | ------------------------------------------------------------------------------- |
| `--pattern` | un extrait de code | Vérifie un appel. Répétez-la pour en vérifier plusieurs, un verdict par ligne.  |
| `--lang`    | un langage         | Requise avec `--pattern` : `javascript` ou `python`.                            |
| `--dir`     | un répertoire      | Limite l'analyse à un répertoire. Peut être répétée et combinée avec `--file`.  |
| `--file`    | un fichier         | Limite l'analyse à un seul fichier. Peut être répétée et combinée avec `--dir`. |

Sans option, il analyse tout le projet. `--pattern` exige `--lang` et ne peut pas être combinée avec `--dir` ou `--file`.

**Au mieux, pas de façon exhaustive**

Une boucle d'agent écrite à la main, dans n'importe quel langage, échappe à une analyse statique. Considérez ceci comme un socle solide, pas comme un inventaire complet.

**Astuce**

Le hook ne tranche que la limite : le périmètre des capacités, le mélange de niveaux de confiance et l'autorisation relèvent du jugement que couvre toujours la [spécialisation `llm`](https://lagune.ai/fr-FR/docs/catalog).

## Questions fréquentes

### Pourquoi limiter une boucle d'agent ?

Un agent sans limite peut être entraîné dans une récursion, un coût ou une escalade par injection de prompt sans fin. Fixer maxTurns/maxBudgetUsd/stopWhen/signal le borne, et le hook agent signale un appel au runtime query qui n'en fixe aucun.
