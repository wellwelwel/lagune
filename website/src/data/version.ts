import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export const useLaguneVersion = (): string => {
  const version = useDocusaurusContext().siteConfig.customFields?.laguneVersion;

  if (typeof version !== 'string')
    throw new Error('The site config carries no Lagune version.');

  return version;
};
