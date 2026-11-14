# Installation : durcissement de la sécurité pour tout agent IA

> Installez Lagune dans n'importe quel projet, comme plugin si votre agent le permet ou avec la CLI skills ailleurs, puis choisissez les spécialisations de sécurité qui lui conviennent.

Canonique: https://lagune.ai/fr-FR/docs
Langue: fr-FR
Original: https://lagune.ai/docs
Dernière mise à jour: 2026-11-09

**Lagune** aide votre agent IA à rendre un projet plus sûr. Vous le pointez vers votre code, et l'agent comprend ce que fait réellement votre système, puis vous guide dans le travail de sécurité qui compte pour lui. **Lagune** est le premier projet de la méthodologie [Security-Driven Hardening (SDH)](https://lagune.ai/fr-FR/docs/references/paper).

**Soutenez l'open source**

Vous aimez **Lagune** ? [Donnez-nous une ⭐ sur **GitHub**](https://github.com/wellwelwel/lagune)

## Choisissez votre agent

- [Claude Code](https://lagune.ai/fr-FR/docs/install/claude-code): L'outil de programmation agentique d'Anthropic
- [Codex](https://lagune.ai/fr-FR/docs/install/codex): L'agent de programmation d'OpenAI
- [Cursor](https://lagune.ai/fr-FR/docs/install/cursor): L'éditeur de code IA
- [GitHub Copilot](https://lagune.ai/fr-FR/docs/install/github-copilot-cli): Le binôme de programmation IA de GitHub
- [Gemini CLI](https://lagune.ai/fr-FR/docs/install/gemini-cli): L'agent de terminal open source de Google
- [Antigravity](https://lagune.ai/fr-FR/docs/install/antigravity-cli): La plateforme de développement agentique de Google
- [OpenCode](https://lagune.ai/fr-FR/docs/install/opencode): L'agent de programmation open source
- [Devin for Terminal](https://lagune.ai/fr-FR/docs/install/devin-cli): L'agent de terminal de Cognition
- [Factory Droid](https://lagune.ai/fr-FR/docs/install/factory-droid): L'agent de développement logiciel de Factory
- [Grok Build](https://lagune.ai/fr-FR/docs/install/grok-build): L'agent de programmation de xAI
- [Qwen Code](https://lagune.ai/fr-FR/docs/install/qwen-code): L'agent de programmation de Qwen pour le terminal
- [Kimi Code](https://lagune.ai/fr-FR/docs/install/kimi-code): L'agent de programmation de Moonshot AI
- [Muse Code](https://lagune.ai/fr-FR/docs/install/muse-code): L'agent de programmation de Meta
- [Pi](https://lagune.ai/fr-FR/docs/install/pi): Un agent de programmation minimaliste pour le terminal
- [Hermes Agent](https://lagune.ai/fr-FR/docs/install/hermes-agent): L'agent open source de Nous Research
- [Universel](https://lagune.ai/fr-FR/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed et 66 autres

**Info**

- **Lagune** tourne sur **Node.js** en coulisses, mais vous utilisez le langage que vous voulez.
- Pour fonctionner entièrement hors ligne, installez **Lagune** dans votre projet avec `npm i -D lagune@0.19.0`.

## Catégories

Les connaissances de sécurité de **Lagune** se présentent sous forme de [**spécialisations**](https://lagune.ai/fr-FR/docs/catalog), regroupées en [**catégories**](https://lagune.ai/fr-FR/docs/categories).

- **OWASP** (`owasp`): Durcir contre les risques de sécurité applicative suivis par l'OWASP : injection, contrôle d'accès défaillant, authentification et défaillances cryptographiques
- **Infrastructure** (`infra`): Durcir la configuration des conteneurs, des workloads et du serverless : Dockerfile, Compose, sécurité des Pods, IAM et déclencheurs FaaS
- **IA / LLM** (`ai`): Durcir les intégrations d'IA et de LLM contre l'injection de prompt et le câblage risqué d'outils, d'agents, de recherche documentaire et de MCP
- **Lovable** (`lovable`): Durcir les applications Supabase générées par IA (Lovable et similaires) : lacunes RLS, clés service_role divulguées et valeurs par défaut non sûres
- **JavaScript** (`javascript`): Durcir JavaScript et ses runtimes contre la RCE par eval et child_process, le path traversal et la pollution de prototype
- **Python** (`python`): Durcir Python contre la RCE par désérialisation pickle et YAML, le parcours via str.format et la pollution de classe
- **Rust** (`rust`): Durcir Rust contre les API unsafe non sound, le mauvais usage de transmute, les dépassements d'entier et le comportement indéfini à la frontière FFI
- **Java** (`java`): Durcir Java contre les chaînes de gadgets de désérialisation ObjectInputStream qui aboutissent à l'exécution de code à distance
- **Ruby** (`ruby`): Durcir Ruby contre les chaînes de gadgets de désérialisation Marshal.load et YAML qui mènent à l'exécution de code à distance
- **PHP** (`php`): Durcir PHP contre le contournement d'authentification par type juggling, les chaînes de gadgets d'injection d'objets et les configurations par défaut non sûres
- **Go** (`go`): Durcir Go contre les bugs d'interface nil typée, les data races entre goroutines et la concurrence risquée sur les chemins de sécurité
- **C / C++** (`c-cpp`): Durcir le C et le C++ contre les bugs de chaîne de format, les dépassements de tampon et les écritures hors limites qui permettent l'exécution de code
- **.NET** (`dotnet`): Durcir .NET et C# contre la RCE par désérialisation BinaryFormatter et les contournements d'encodeur qui mènent au XSS

Exécutez `npx lagune write add --categories` avec les clés des catégories que vous choisissez.

**Astuce**

Un projet commence avec `owasp`, et [`/lagune-charter`](https://lagune.ai/fr-FR/docs/commands/charter) ajoute les catégories que justifie sa lecture du projet.

## Prérequis

Vous devez avoir [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) installé sur votre système.

## Affichez un badge ✨

Vous utilisez **Lagune** ? Ajoutez-en un à votre **README** :

**Deux tons**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**Uni**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## Étape suivante

Découvrez ce que fait chacun des [**Skills**](https://lagune.ai/fr-FR/docs/get-started/commands) de **Lagune**.

## Questions fréquentes

### Qu'est-ce que Lagune ?

Lagune est un workflow de sécurité open source et exclusivement défensif qui aide votre agent IA à durcir n'importe quelle base de code. Vous le pointez vers votre code, il détecte ce que fait réellement votre système, puis il guide les correctifs de sécurité qui comptent dans ce contexte.

### Comment installer Lagune ?

Choisissez votre agent : Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI et Hermes Agent installent Lagune comme plugin, Gemini CLI et Qwen Code comme extension, Pi comme paquet, et tout autre agent avec npx skills add wellwelwel/lagune -y. Il fonctionne aussi bien dans un nouveau projet que dans un projet existant.

### Lagune a-t-il besoin d'une clé d'API ?

Non. Il passe par votre propre agent IA, donc aucune clé d'API n'est nécessaire.

### Quels sont les prérequis ?

Vous devez avoir Node.js (LTS) installé sur votre système.

### Quels langages de programmation Lagune prend-il en charge ?

Tous. Lagune tourne sur Node.js en coulisses, mais il audite et durcit des projets écrits dans n'importe quel langage de programmation.

### Qu'est-ce que Lagune ajoute à mon projet ?

Un répertoire .lagune/ qui contient l'état de sécurité de votre projet, créé par la première commande qui écrit. La CLI skills installe aussi les commandes slash dans le projet, où votre agent les lit, alors qu'un plugin les garde dans l'agent.

### Comment mettre à jour Lagune ?

De la même façon que vous l'avez installé. La page d'installation de chaque agent explique comment y mettre à jour Lagune, et la CLI skills le met à jour avec npx skills update. Vos principes de sécurité, les artefacts des phases et vos propres spécialisations restent intacts.

### Quelles spécialisations un projet utilise-t-il ?

Les spécialisations intégrées de ses catégories, plus les siennes. La phase charter enregistre les catégories que justifie sa lecture du projet, et npx lagune write add --categories les modifie.

### Dois-je finir de développer avant de sécuriser mon projet ?

Non. La commande /lagune durcit le travail au fil de l'écriture : elle accepte n'importe quel prompt, construit ce que vous avez demandé et le durcit avec des valeurs par défaut sûres, en suivant vos principes de sécurité. Le flux Blue Team en cinq phases audite ce qui existe déjà.

### Lagune peut-il auditer un projet existant ?

Oui. Le flux Blue Team en cinq phases audite ce qui existe déjà : charter fixe vos règles de sécurité, detect cartographie ce que fait le système et où se trouvent les risques, plan note chaque constat et l'associe à un correctif, harden applique les correctifs, et verify prouve qu'ils sont efficaces et les clôture.

### Quelle différence entre utiliser Lagune et demander simplement à l'agent de cartographier les vulnérabilités et les failles de sécurité ?

Un agent qui lit seul trouve ce qui ressemble à une vulnérabilité et passe sur ce qui ressemble à une mesure de protection. Une liste d'adresses bloquées donne l'impression que quelqu'un a déjà traité le risque, donc personne ne vérifie qu'elle en oublie la plupart, et le code part en production. Lagune inverse ce réflexe : une protection déjà présente dans le code est présumée non prouvée tant qu'elle n'a pas été vérifiée, chaque spécialisation du catalogue reçoit un verdict explicite, et verify se demande si le risque a disparu, pas si une mesure est en place. Chaque constat reste aussi un seul élément suivi d'une exécution à l'autre, ce qui permet de prouver sa clôture et de le retirer, là où une simple demande vous donne un rapport différent à chaque fois, sans rien à comparer.

### Quelle différence entre développer avec Lagune et demander simplement à l'agent d'écrire du code sécurisé ?

Demander du code sécurisé laisse à l'agent le soin de définir ce qui est sécurisé, et suppose que vous savez quoi demander. L'exigence se trouve souvent déjà dans votre demande sans que ni vous ni lui ne la voyiez : demander une page qui affiche les cours auxquels un utilisateur a accès énonce une règle d'autorisation, et une vérification jamais écrite ne laisse rien à remarquer dans le code. La commande /lagune charge vos principes de sécurité et les spécialisations qui correspondent à ce qui va être construit avant que la première ligne soit écrite, puis relit le résultat à la lumière de la défense utilisée. La forme sûre coûte rarement plus que la forme risquée, donc ce qui décide du résultat, c'est de savoir laquelle choisir, et c'est précisément ce qui arrive en amont.

### Lagune fait-il du DAST (Dynamic Application Security Testing) ou teste-t-il mon application en cours d'exécution ?

Non. Lagune lit le code et n'exécute jamais votre système ni ne lui envoie de requêtes forgées. Verify confirme qu'une mesure de protection est présente et correcte dans le code source, ce qui est une autre question que de savoir si elle résiste à une attaque sur une cible en production, donc "impossible à déterminer à partir du code" est un verdict légitime plutôt qu'une validation silencieuse. Le DAST répond à la question de l'exécution et Lagune à celle du code source, donc aucun ne remplace l'autre. Même la commande facultative prove respecte cette limite : ses tests vérifient le comportement sûr, jamais un payload d'attaque.

### Lagune remplace-t-il un pentest (test d'intrusion) ?

Non, absolument pas ! Un pentest est une mission autorisée où un professionnel exerce son jugement contre votre système en production, en enchaînant les constats et en sondant la logique métier qu'aucune règle par surface ne décrit. Les constats d'un pentest peuvent entrer dans le flux Blue Team de Lagune, pour que detect consigne ces préoccupations, afin que ce qu'un professionnel signale soit planifié, durci et vérifié.

## Politique de sécurité

Consultez le fichier [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md).

## Licence

**Lagune** est distribué sous [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE).

Copyright © 2026-aujourd'hui [Weslley Araújo](https://github.com/wellwelwel) et [contributeurs](https://github.com/wellwelwel/lagune/graphs/contributors).
