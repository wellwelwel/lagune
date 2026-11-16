import os from 'node:os';

export const collect = () => ({
  at: new Date().toISOString(),
  load: os.loadavg(),
  freeMemory: os.freemem(),
  uptime: os.uptime(),
});
