import { describe, it, strict } from 'poku';
import { jsonLd } from '../../../website/src/seo/jsonLd.js';

describe('structured data in a script tag', () => {
  const data = {
    '@type': 'FAQPage',
    name: 'Fim</script><script>alert(1)</script><!-- & "aspas"',
    text: 'linha\u2028separada\u2029aqui',
  };
  const serialized = jsonLd(data);

  it('holds no sequence that could close the script tag or open a comment', () => {
    strict.doesNotMatch(serialized, /</);
    strict.doesNotMatch(serialized, /\u2028|\u2029/);
  });

  it('reads back as the same data', () => {
    strict.deepStrictEqual(JSON.parse(serialized), data);
  });
});
