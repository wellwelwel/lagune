import { describe, it, strict } from 'poku';
import { withSkillsDir } from './__utils__.js';

await describe('presentSkillNames reads the installed sub-skill files', async () => {
  await it('returns [] when the skills directory is absent', async () => {
    await withSkillsDir(null, (names) => {
      strict.deepStrictEqual(names, []);
    });
  });

  await it('returns each .md file name without its extension', async () => {
    await withSkillsDir(['regex.md', 'network.md'], (names) => {
      strict.deepStrictEqual(names.slice().sort(), ['network', 'regex']);
    });
  });

  await it('ignores non-markdown files', async () => {
    await withSkillsDir(['regex.md', 'notes.txt'], (names) => {
      strict.deepStrictEqual(names, ['regex']);
    });
  });
});
