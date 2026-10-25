import type { FSWatcher } from 'node:fs';
import type { ServerResponse } from 'node:http';
import type { LiveReload } from '../../types/dashboard/server';
import { watch } from 'node:fs';
import { dirname } from 'node:path';

const watchDir = (dir: string, onChange: () => void): FSWatcher => {
  try {
    return watch(dir, { recursive: true }, onChange);
  } catch {
    return watch(dir, onChange);
  }
};

export const createLiveReload = (dir: string): LiveReload => {
  const clients = new Set<ServerResponse>();
  let timer: NodeJS.Timeout | null = null;

  const notify = (): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      for (const client of clients) {
        try {
          client.write('data: reload\n\n');
        } catch {
          clients.delete(client);
        }
      }
    }, 120);
  };

  const tryWatchTarget = (): FSWatcher | null => {
    try {
      const target = watchDir(dir, notify);
      target.on('error', () => {});
      return target;
    } catch {
      return null;
    }
  };

  const watchParentUntilCreated = (): FSWatcher => {
    const parent = watch(dirname(dir), () => {
      const target = tryWatchTarget();

      if (target === null) return;

      parent.close();
      watcher = target;
      notify();
    });

    parent.on('error', () => {});

    return parent;
  };

  let watcher = tryWatchTarget() ?? watchParentUntilCreated();

  return {
    add: (client) => {
      clients.add(client);
      client.write('retry: 1000\n\n');
    },
    remove: (client) => {
      clients.delete(client);
    },
    close: () => {
      if (timer) clearTimeout(timer);
      watcher.close();
      for (const client of clients) client.end();
      clients.clear();
    },
  };
};
