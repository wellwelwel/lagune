const AVATAR_HOST = 'https://avatars.example.com';

export const fetchAvatar = async (id) => {
  const response = await fetch(`${AVATAR_HOST}/${encodeURIComponent(id)}.png`, {
    redirect: 'error',
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) throw new Error(`Avatar ${id} answered ${response.status}`);

  return Buffer.from(await response.arrayBuffer());
};
