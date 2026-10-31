/** The skill sources OpenCode 1.x reads from its configuration */
export type SkillSources = { paths?: string[]; urls?: string[] };

export type ServerConfig = { skills?: SkillSources };

export type ServerHooks = { config: (config: ServerConfig) => Promise<void> };

/** A skill as OpenCode 2.x registers it, with its body apart from the frontmatter */
export type SkillInfo = {
  id: string;
  name: string;
  description?: string;
  autoinvoke?: boolean;
  path: string;
  content: string;
};

/** OpenCode 1.x also runs setup, with an editor that has no `add` */
export type SkillEditor = { add?: (skill: SkillInfo) => void };

export type SkillDomain = {
  transform?: (edit: (editor: SkillEditor) => void) => Promise<unknown>;
};

export type SetupContext = { skill?: SkillDomain };

export type OpenCodePlugin = {
  id: string;
  server: () => Promise<ServerHooks>;
  setup: (context: SetupContext) => Promise<void>;
};
