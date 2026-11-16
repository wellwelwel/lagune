const TITLE = /<title>([^<]{0,300})<\/title>/i;

export const fetchPreview = async (url) => {
  const response = await fetch(url);
  const html = await response.text();
  const match = TITLE.exec(html);

  return { url, status: response.status, title: match ? match[1] : null };
};
