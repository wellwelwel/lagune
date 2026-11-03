const SITEMAP_LINE = /^Sitemap:.*$/gm;

export const robotsWithSitemaps = (
  robots: string,
  sitemaps: string[]
): string =>
  `${robots.replace(SITEMAP_LINE, '').trimEnd()}\n\n${sitemaps
    .map((sitemap) => `Sitemap: ${sitemap}`)
    .join('\n')}\n`;
