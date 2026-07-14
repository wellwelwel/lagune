import { env, exit } from 'node:process';

const { CF_ZONE_ID, CF_TOKEN, CI } = env;

if (!CF_ZONE_ID || !CF_TOKEN) {
  console.log('Skipping: Cloudflare not set.');
  exit(0);
}

const url = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID.trim()}/purge_cache`;
const body = { purge_everything: true };
const headers = {
  Authorization: `Bearer ${CF_TOKEN.trim()}`,
  'Content-Type': 'application/json',
};

try {
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    const errorMessage =
      typeof error === 'object' &&
      error !== null &&
      'errors' in error &&
      Array.isArray(error.errors) &&
      error.errors[0]?.message
        ? error.errors[0].message
        : response.statusText;
    throw new Error(`Failed to purge cache: ${errorMessage}`);
  }

  await response.json();
  console.log('Cache purged successfully');
} catch (error) {
  console.error('Error purging cache.');

  if (!CI) throw error;
  else exit(1);
}
