export const send = async (sample, host) => {
  await fetch('http://metrics.example.com/ingest', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.METRICS_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ host, sample }),
  });
};
