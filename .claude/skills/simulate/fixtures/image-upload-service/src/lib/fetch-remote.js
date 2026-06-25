const ALLOWED_HOSTS = new Set([
  'images.pixvault.example',
  'cdn.pixvault.example',
]);

export const fetchRemote = async (rawUrl) => {
  const url = new URL(rawUrl);

  if (url.protocol !== 'https:') {
    throw new Error('Only https is allowed');
  }
  if (!ALLOWED_HOSTS.has(url.hostname)) {
    throw new Error('Host not allowed');
  }

  const response = await fetch(url, { redirect: 'error' });
  return Buffer.from(await response.arrayBuffer());
};
