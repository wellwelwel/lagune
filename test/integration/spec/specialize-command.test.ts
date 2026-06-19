import { describe, it, strict } from 'poku';
import { loadAssets } from '../../../src/core/assets.js';
import { createProvider } from '../../../src/providers/create-provider.js';

const packageRoot = new URL('../../../', import.meta.url);

await describe('the specialize command is wired as a command + template pair', async () => {
  const assets = await loadAssets(packageRoot);

  it('loads the specialize command and its template', () => {
    strict(
      'specialize' in assets.commands,
      'assets.commands should include specialize'
    );
    strict(
      'specialize' in assets.templates,
      'assets.templates should include specialize'
    );
  });

  it('renders a bluespec.specialize path pointing at the scaffolded template', () => {
    const provider = createProvider({
      key: 'claude',
      displayName: 'Claude Code',
      format: 'skill',
      layout: 'skill',
      dir: '.claude/skills',
    });
    const commands = provider.buildCommands(assets);
    const specialize = commands.find((command) =>
      command.relativePath.includes('bluespec.specialize')
    );

    if (specialize === undefined)
      throw new Error('a bluespec.specialize command should render');

    strict.strictEqual(
      specialize.relativePath,
      '.claude/skills/bluespec.specialize/SKILL.md'
    );
    strict(
      specialize.contents.includes(
        '.bluespec/templates/specialize-template.md'
      ),
      'the rendered command should point at the scaffolded template path'
    );
  });
});
