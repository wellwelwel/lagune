import type * as PrismNamespace from 'prismjs';
import siteConfig from '@generated/docusaurus.config';

const prismIncludeLanguages = (PrismObject: typeof PrismNamespace): void => {
  const {
    themeConfig: { prism },
  } = siteConfig;
  const { additionalLanguages } = prism as { additionalLanguages: string[] };
  const PrismBefore = globalThis.Prism;

  globalThis.Prism = PrismObject;

  additionalLanguages.forEach((language) => {
    if (language === 'php')
      require('prismjs/components/prism-markup-templating.js');
    require(`prismjs/components/prism-${language}`);
  });

  /* Prism matches the tokens in declaration order. */
  PrismObject.languages.prompt = {
    comment: {
      pattern: /(^|\s)#.*/m,
      lookbehind: true,
      greedy: true,
    },
    command: {
      pattern: /(^|\s)\/[a-z][\w-]*(?:[.:][a-z][\w-]*)*/im,
      lookbehind: true,
      greedy: true,
    },
    'at-mark': {
      pattern: /(^|\s)@\S+/m,
      lookbehind: true,
      greedy: true,
      alias: 'command',
    },
  };

  const globalWithPrism: { Prism?: typeof PrismNamespace } = globalThis;

  delete globalWithPrism.Prism;

  if (typeof PrismBefore !== 'undefined') globalThis.Prism = PrismObject;
};

export default prismIncludeLanguages;
