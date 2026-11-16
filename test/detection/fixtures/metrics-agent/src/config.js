export const loadConfig = async () => {
  const response = await fetch('https://config.example.com/agent.json', {
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) throw new Error(`Config answered ${response.status}`);

  return response.json();
};
