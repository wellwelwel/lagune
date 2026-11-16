import { collect } from './collect.js';
import { loadConfig } from './config.js';
import { send } from './send.js';

const config = await loadConfig();

setInterval(async () => {
  await send(collect(), config.host);
}, config.intervalMs);
