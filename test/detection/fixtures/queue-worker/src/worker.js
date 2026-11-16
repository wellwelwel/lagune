import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

for (;;) {
  const [, raw] = await redis.blpop('jobs', 0);
  const job = JSON.parse(raw);

  await redis.hset(`results:${job.id}`, 'status', 'done');
}
